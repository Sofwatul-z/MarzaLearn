import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import csv from 'csv-parser';

// Jalankan skrip dari root proyek: D:\MarzaLearn
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const CSV_FILES = [
  path.resolve(
    process.cwd(),
    'scratch/student_bulk_import/xc_students.csv'
  ),
  path.resolve(
    process.cwd(),
    'scratch/student_bulk_import/xd_students.csv'
  ),
];

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    'Konfigurasi belum lengkap. Pastikan VITE_SUPABASE_URL dan ' +
    'SUPABASE_SERVICE_ROLE_KEY tersedia di .env.local.'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Membersihkan nama kolom CSV, termasuk BOM jika ada.
function cleanHeader(header) {
  return String(header ?? '')
    .replace(/^\uFEFF/, '')
    .trim()
    .toLowerCase();
}

// Membaca CSV yang SUDAH memiliki header.
function readCsv(filePath, expectedClass) {
  return new Promise((resolve, reject) => {
    const rows = [];

    if (!fs.existsSync(filePath)) {
      reject(new Error(`File CSV tidak ditemukan: ${filePath}`));
      return;
    }

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (rawRow) => {
        const row = {};

        for (const [key, value] of Object.entries(rawRow)) {
          row[cleanHeader(key)] =
            typeof value === 'string' ? value.trim() : value;
        }

        // Lewati baris yang benar-benar kosong.
        if (
          !Object.values(row).some(
            (value) => String(value ?? '').trim() !== ''
          )
        ) {
          return;
        }

        const full_name =
          row.full_name ??
          row.nama_lengkap ??
          row.nama ??
          row.name ??
          '';

        const email = row.email ?? row.email_siswa ?? '';

        // Password tetap berupa string agar nol di depan tidak hilang.
        const password = String(
          row.password ?? row.kata_sandi ?? ''
        );

        const class_name =
          row.class_name ?? row.kelas ?? expectedClass;

        rows.push({
          full_name: String(full_name).trim(),
          email: String(email).trim().toLowerCase(),
          password: password.trim(),
          class_name: String(class_name || expectedClass).trim(),
        });
      })
      .on('end', () => {
        if (rows.length === 0) {
          reject(
            new Error(
              `Tidak ada data siswa di ${filePath}. ` +
              'Pastikan CSV memiliki header: ' +
              'full_name,email,password,class_name'
            )
          );
          return;
        }

        const firstRow = rows[0];

        if (!firstRow.email || firstRow.email === 'email') {
          reject(
            new Error(
              `Kolom email tidak terbaca di ${filePath}. ` +
              'Pastikan baris pertama CSV adalah header: ' +
              'full_name,email,password,class_name'
            )
          );
          return;
        }

        resolve(rows);
      })
      .on('error', reject);
  });
}

// Mengambil seluruh pengguna Auth yang sudah ada.
async function listAllAuthUsers() {
  const usersByEmail = new Map();
  const perPage = 1000;
  let page = 1;

  while (true) {
    const { data, error } =
      await supabase.auth.admin.listUsers({
        page,
        perPage,
      });

    if (error) {
      throw new Error(
        `Gagal mengambil daftar pengguna Auth: ${error.message}`
      );
    }

    const users = data?.users ?? [];

    for (const user of users) {
      if (user.email) {
        usersByEmail.set(user.email.toLowerCase(), user);
      }
    }

    if (users.length < perPage) {
      break;
    }

    page += 1;
  }

  return usersByEmail;
}

// Memvalidasi data sebelum dikirim ke Supabase.
function validateStudent(student, sourceFile) {
  const problems = [];

  if (!student.full_name) {
    problems.push('nama kosong');
  }

  if (!student.email) {
    problems.push('email kosong');
  }

  if (
    student.email &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(student.email)
  ) {
    problems.push('format email tidak valid');
  }

  if (!student.password || student.password.length < 6) {
    problems.push('password kosong atau kurang dari 6 karakter');
  }

  if (!student.class_name) {
    problems.push('kelas kosong');
  }

  if (problems.length > 0) {
    console.error(
      `Baris dilewati dari ${path.basename(sourceFile)} ` +
      `(${student.email || 'tanpa email'}): ${problems.join(', ')}`
    );

    return false;
  }

  return true;
}

// Membuat akun baru atau memperbarui metadata akun yang sudah ada.
async function getOrCreateAuthUser(student, usersByEmail) {
  const metadata = {
    full_name: student.full_name,
    name: student.full_name,
    display_name: student.full_name,
    class_name: student.class_name,
    role: 'student',
  };

  const existingUser = usersByEmail.get(student.email);

  if (existingUser) {
    const mergedMetadata = {
      ...(existingUser.user_metadata ?? {}),
      ...metadata,
    };

    const { data, error } =
      await supabase.auth.admin.updateUserById(
        existingUser.id,
        {
          user_metadata: mergedMetadata,
        }
      );

    if (error) {
      console.error(
        `Gagal memperbarui metadata akun ${student.email}: ` +
        error.message
      );

      return null;
    }

    const updatedUser = data?.user ?? existingUser;

    usersByEmail.set(student.email, updatedUser);

    console.log(
      `Akun Auth sudah ada; metadata diperbarui: ${student.email}`
    );

    return updatedUser;
  }

  const { data, error } =
    await supabase.auth.admin.createUser({
      email: student.email,
      password: student.password,
      email_confirm: true,
      user_metadata: metadata,
    });

  if (error) {
    console.error(
      `Gagal membuat akun Auth untuk ${student.email}: ` +
      error.message
    );

    return null;
  }

  // createUser mengembalikan objek data yang berisi properti user.
  const createdUser = data?.user;

  if (!createdUser?.id) {
    console.error(
      `Supabase tidak mengembalikan ID pengguna untuk ` +
      `${student.email}. Profil tidak dibuat.`
    );

    return null;
  }

  usersByEmail.set(student.email, createdUser);

  console.log(`Akun Auth berhasil dibuat: ${student.email}`);

  return createdUser;
}

// Menyimpan profil berdasarkan ID pengguna Auth yang sebenarnya.
async function upsertStudentProfile(student, authUser) {
  if (!authUser?.id) {
    console.error(
      `Profil dilewati untuk ${student.email}: ID Auth tidak tersedia.`
    );

    return false;
  }

  const profile = {
    id: authUser.id,
    full_name: student.full_name,
    class_name: student.class_name,
    role: 'student',
  };

  const { error } = await supabase
    .from('profiles')
    .upsert(profile, { onConflict: 'id' });

  if (error) {
    console.error(
      `Gagal menyimpan profil ${student.email}: ${error.message}`
    );

    return false;
  }

  console.log(
    `Profil siswa berhasil disimpan: ` +
    `${student.full_name} (${student.class_name})`
  );

  return true;
}

// Proses utama.
async function main() {
  let xc;
  let xd;

  try {
    // Baca kedua CSV terlebih dahulu sebelum mengubah data.
    xc = await readCsv(CSV_FILES[0], 'XC');
    xd = await readCsv(CSV_FILES[1], 'XD');
  } catch (error) {
    console.error(`Gagal membaca CSV: ${error.message}`);
    process.exitCode = 1;
    return;
  }

  const allStudents = [
    ...xc.map((student) => ({
      ...student,
      class_name: student.class_name || 'XC',
    })),

    ...xd.map((student) => ({
      ...student,
      class_name: student.class_name || 'XD',
    })),
  ];

  console.log(
    `Data CSV terbaca: XC ${xc.length} baris, ` +
    `XD ${xd.length} baris.`
  );

  console.log(
    `Total baris yang akan diperiksa: ${allStudents.length}.`
  );

  const validStudents = [];
  const seenEmails = new Set();

  for (const student of allStudents) {
    const isXD = student.class_name.toUpperCase() === 'XD';

    const sourceFile = isXD
      ? CSV_FILES[1]
      : CSV_FILES[0];

    if (!validateStudent(student, sourceFile)) {
      continue;
    }

    if (seenEmails.has(student.email)) {
      console.error(
        `Email duplikat di CSV, baris berikutnya dilewati: ` +
        student.email
      );

      continue;
    }

    seenEmails.add(student.email);
    validStudents.push(student);
  }

  if (validStudents.length === 0) {
    console.error(
      'Tidak ada baris siswa valid. Tidak ada perubahan dilakukan.'
    );

    process.exitCode = 1;
    return;
  }

  let usersByEmail;

  try {
    usersByEmail = await listAllAuthUsers();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
    return;
  }

  let authSuccess = 0;
  let profileSuccess = 0;
  let failed = 0;

  for (const student of validStudents) {
    console.log(
      `\nMemproses ${student.full_name} — ${student.email}`
    );

    try {
      const authUser = await getOrCreateAuthUser(
        student,
        usersByEmail
      );

      if (!authUser) {
        failed += 1;
        continue;
      }

      authSuccess += 1;

      const profileSaved = await upsertStudentProfile(
        student,
        authUser
      );

      if (profileSaved) {
        profileSuccess += 1;
      } else {
        failed += 1;
      }
    } catch (error) {
      console.error(
        `Kesalahan saat memproses ${student.email}: ` +
        error.message
      );

      failed += 1;
    }
  }

  console.log('\n========== HASIL IMPORT ==========');
  console.log(`Baris valid: ${validStudents.length}`);
  console.log(
    `Akun Auth berhasil dibuat/ditemukan: ${authSuccess}`
  );
  console.log(`Profil berhasil disimpan: ${profileSuccess}`);
  console.log(`Gagal: ${failed}`);
  console.log('==================================');

  if (failed > 0) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(
    `Kesalahan tak terduga: ${error.message}`
  );

  process.exitCode = 1;
});