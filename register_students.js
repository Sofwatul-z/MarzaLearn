import { createClient } from '@supabase/supabase-js';

// Ganti dengan URL dan Anon Key Supabase Anda yang ada di file .env
const supabaseUrl = 'https://jymvbnqduaodvhkcbdcg.supabase.co';
const supabaseKey = 'sb_publishable_Y604RpXoUJlppG3ff6FPzQ_klOOplRt';
const supabase = createClient(supabaseUrl, supabaseKey);

const studentsClassD = [
  { name: "Ahmad Putra Rohman", email: "XD48291@school.com", password: "739204", class: "Class D" },
  { name: "Alfani Zafira Nur Rianti", email: "XD73158@school.com", password: "582961", class: "Class D" },
  { name: "Acha Mezza Al Afif", email: "XD90537@school.com", password: "416839", class: "Class D" },
  { name: "Aulia Luthfi Makhun", email: "XD26480@school.com", password: "927514", class: "Class D" },
  { name: "Baraka Toti Ilyasa", email: "XD61849@school.com", password: "305782", class: "Class D" },
  { name: "Boby Marthia Alifah Putri Aira", email: "XD84726@school.com", password: "694138", class: "Class D" },
  { name: "Chelsea Efrilia Puteri", email: "XD39074@school.com", password: "851627", class: "Class D" },
  { name: "Citra Vira Nabila", email: "XD72695@school.com", password: "248593", class: "Class D" },
  { name: "Dwi Putri Rahayu", email: "XD15983@school.com", password: "760421", class: "Class D" },
  { name: "Elvina Meiza Nanda Fiona", email: "XD53826@school.com", password: "913075", class: "Class D" },
  { name: "Farid Athaya Ramadhani", email: "XD68491@school.com", password: "527806", class: "Class D" },
  { name: "Fauzan Taufiq Rahman", email: "XD97245@school.com", password: "364918", class: "Class D" },
  { name: "Fiza Fazzana Abidah", email: "XD41670@school.com", password: "805239", class: "Class D" },
  { name: "Ibrahim Abyyu Permana", email: "XD75384@school.com", password: "691457", class: "Class D" },
  { name: "Indriani Awanda Sonya M.K", email: "XD29061@school.com", password: "438925", class: "Class D" },
  { name: "Intan Nurhafizah Arlyanti", email: "XD86539@school.com", password: "702846", class: "Class D" },
  { name: "Kafa Hiyal Khowim", email: "XD34792@school.com", password: "916304", class: "Class D" },
  { name: "Kalila Tirta Khairani", email: "XD62958@school.com", password: "274860", class: "Class D" },
  { name: "Lukman Hakim", email: "XD78403@school.com", password: "539712", class: "Class D" },
  { name: "Muzhdi Reza At Tamani", email: "XD95162@school.com", password: "680435", class: "Class D" },
  { name: "Muhammad Bintang Prayogo", email: "XD32875@school.com", password: "247906", class: "Class D" },
  { name: "Muhammad Fawwaz Habiburrohman", email: "XD59684@school.com", password: "813527", class: "Class D" },
  { name: "Muhammad Mahmud Al Fatih", email: "XD84029@school.com", password: "465193", class: "Class D" },
  { name: "Muhammad Rizky Hafidz", email: "XD21796@school.com", password: "908642", class: "Class D" },
  { name: "Nathen Febriyanti Hali Komari", email: "XD67431@school.com", password: "352789", class: "Class D" },
  { name: "Nur An Sanna Laila Salsabila", email: "XD90368@school.com", password: "724051", class: "Class D" },
  { name: "Qulutan Tsaqila", email: "XD45187@school.com", password: "869230", class: "Class D" },
  { name: "Rifqi Myangala Liano", email: "XD73840@school.com", password: "516974", class: "Class D" },
  { name: "Risma Safa’atul Putri", email: "XD28569@school.com", password: "930617", class: "Class D" },
  { name: "Siffa Nur Aini", email: "XD61973@school.com", password: "482705", class: "Class D" },
  { name: "Silfia Eka Saputri", email: "XD86420@school.com", password: "751396", class: "Class D" },
  { name: "Ulya Alifia Rahma", email: "XD39751@school.com", password: "628940", class: "Class D" },
  { name: "Walid Hasan Nur Fauzi", email: "XD58274@school.com", password: "304861", class: "Class D" },
  { name: "Wayan Pricylva Putri Ramadhany", email: "XD94635@school.com", password: "879214", class: "Class D" },
  { name: "Zahra Al Marsha", email: "XD71390@school.com", password: "526783", class: "Class D" },
  { name: "Zahra Octavia", email: "XD26854@school.com", password: "941620", class: "Class D" }
];

const studentsClassC = [
  { name: "Alexandria Michelle Navara", email: "XC48291@school.com", password: "739204", class: "Class C" },
  { name: "Aliya Hikmatul Maula", email: "XC73158@school.com", password: "582961", class: "Class C" },
  { name: "Alina Mawaddati", email: "XC90537@school.com", password: "416839", class: "Class C" },
  { name: "Amelia Purnama Sari", email: "XC26480@school.com", password: "927514", class: "Class C" },
  { name: "Aqila Azalea Ramadhani", email: "XC61849@school.com", password: "305782", class: "Class C" },
  { name: "Asyifa Eka Suraning Tyas", email: "XC84726@school.com", password: "694138", class: "Class C" },
  { name: "Azbara Arifin Putri", email: "XC39074@school.com", password: "851627", class: "Class C" },
  { name: "Azka Zaenurifki", email: "XC72695@school.com", password: "248593", class: "Class C" },
  { name: "Bryan Adam Saputra", email: "XC15983@school.com", password: "760421", class: "Class C" },
  { name: "Diva Zulyana Puspitasari", email: "XC53826@school.com", password: "913075", class: "Class C" },
  { name: "El-Khawarizmi Kinan Syuja", email: "XC68491@school.com", password: "527806", class: "Class C" },
  { name: "Hilmy Naufal Abdillah", email: "XC97245@school.com", password: "364918", class: "Class C" },
  { name: "Inas Selena Ramadhani", email: "XC41670@school.com", password: "805239", class: "Class C" },
  { name: "Indah Tri Riyanti", email: "XC75384@school.com", password: "691457", class: "Class C" },
  { name: "Luthfiana Rosidah", email: "XC29061@school.com", password: "438925", class: "Class C" },
  { name: "Mohamad Raya Adriansyah", email: "XC86539@school.com", password: "702846", class: "Class C" },
  { name: "Mohammad Rafi Ni’amul Kafa", email: "XC34792@school.com", password: "916304", class: "Class C" },
  { name: "Muhammad Fadhil Maulana", email: "XC62958@school.com", password: "274860", class: "Class C" },
  { name: "Najla Safa Salsabila", email: "XC78403@school.com", password: "539712", class: "Class C" },
  { name: "Naja Ahmad Adzhuri", email: "XC95162@school.com", password: "680435", class: "Class C" },
  { name: "Najma Azzahira", email: "XC32875@school.com", password: "247906", class: "Class C" },
  { name: "Nanda Wijaya Nugraha", email: "XC59684@school.com", password: "813527", class: "Class C" },
  { name: "Naura Nuzulia Rachma", email: "XC84029@school.com", password: "465193", class: "Class C" },
  { name: "Radhwa Amira Li’ilmi Mufida", email: "XC21796@school.com", password: "908642", class: "Class C" },
  { name: "Regan Ahmad Rizqulloh", email: "XC67431@school.com", password: "352789", class: "Class C" },
  { name: "Safira Kiraina Rahmadani", email: "XC90368@school.com", password: "724051", class: "Class C" },
  { name: "Salma Humaira Annjana", email: "XC45187@school.com", password: "869230", class: "Class C" },
  { name: "Salsabila Karuniasari", email: "XC73840@school.com", password: "516974", class: "Class C" },
  { name: "Saskia Nur Sahira", email: "XC28569@school.com", password: "930617", class: "Class C" },
  { name: "Shafa Nisa Aqilla Syahira", email: "XC61973@school.com", password: "482705", class: "Class C" },
  { name: "Sidna Fidila Kafabil", email: "XC86420@school.com", password: "751396", class: "Class C" },
  { name: "Syaefudin Yoga Pratama", email: "XC39751@school.com", password: "628940", class: "Class C" },
  { name: "Syafa Nazran Iftikhar", email: "XC58274@school.com", password: "304861", class: "Class C" },
  { name: "Zahira Nadylla Alfunisa", email: "XC94635@school.com", password: "879214", class: "Class C" },
  { name: "Zahra Dwi Amelia", email: "XC71390@school.com", password: "526783", class: "Class C" }
];

const allStudents = [...studentsClassD, ...studentsClassC];

async function registerStudents() {
  console.log(`Memulai pendaftaran ${allStudents.length} siswa...`);
  
  for (let i = 0; i < allStudents.length; i++) {
    const student = allStudents[i];
    
    // 1. Buat User di Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: student.email,
      password: student.password,
      options: {
        data: {
          full_name: student.name,
          role: 'student',
          target_class: student.class // Asumsi ada field class di metadata
        }
      }
    });

    if (error) {
      console.error(`[GAGAL] ${student.name} (${student.email}):`, error.message);
    } else {
      console.log(`[SUKSES] ${i + 1}/${allStudents.length} - ${student.name} didaftarkan.`);
      
      // Jika profil belum terbuat otomatis oleh trigger Supabase, buat secara manual
      // dengan cara uncomment blok di bawah ini jika diperlukan:
      /*
      await supabase.from('profiles').insert({
        id: data.user.id,
        role: 'student',
        full_name: student.name,
        target_class: student.class
      });
      */
    }
    
    // Beri delay sedikit agar API tidak limit
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log("SELESAI!");
}

registerStudents();
