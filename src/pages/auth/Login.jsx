import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { login } from "../../services/auth";
import AuthLayout from "../../layouts/AuthLayout";
import Button from "../../components/common/Button";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await login(email, password);

      if (result.profile.role === "student") {
        navigate("/student/dashboard");
      }

      if (result.profile.role === "teacher") {
        navigate("/teacher/dashboard");
      }
    } catch (error) {
      console.error("MarzaLearn login failed:", error);
      if (error.code === "PROFILE_UNAVAILABLE") {
        setError("Login berhasil, tetapi profil akun belum tersedia atau belum dapat dibaca. Hubungi administrator untuk memperbaiki data profiles/RLS.");
      } else if (error.code === "email_not_confirmed") {
        setError("Email akun belum dikonfirmasi. Periksa inbox akun tersebut atau minta administrator mengonfirmasi akun.");
      } else if (/failed to fetch|networkerror|load failed|fetch failed/i.test(error.message ?? "")) {
        setError("Tidak dapat terhubung ke server login. Periksa koneksi internet, URL Supabase, status project Supabase, atau pengaturan firewall.");
      } else if (error.code === "invalid_credentials" || /invalid login credentials/i.test(error.message ?? "")) {
        setError("Email atau password tidak cocok. Silakan periksa kembali.");
      } else {
        setError(error.message || "Login gagal. Periksa koneksi Supabase dan konfigurasi akun.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="rounded-[28px] border border-[#E3E9E5] bg-white/88 p-6 shadow-[0_24px_70px_rgba(36,51,45,0.09)] backdrop-blur-xl sm:p-9"
      >
        <div className="mb-8">
          <span className="ml-eyebrow">Student & Teacher Access</span>
          <h1 className="mt-3 text-[2rem] font-extrabold tracking-[-0.045em] text-[#24332D] sm:text-[2.35rem]">
            Welcome back.
          </h1>
          <p className="mt-2 text-sm leading-6 text-[#6C7973]">
            Sign in with the school account that has been prepared for you.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label htmlFor="email" className="ml-label">
              Email
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#829089]"
              />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ml-input !pl-12"
                placeholder="name@school.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="ml-label">
              Password
            </label>
            <div className="relative">
              <LockKeyhole
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#829089]"
              />
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="ml-input !pl-12"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <p
              className="rounded-[14px] border border-[#E9C8C3] bg-[#FAECE9] px-4 py-3 text-sm font-semibold leading-5 text-[#944A40]"
              role="alert"
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="group mt-1 w-full"
          >
            {loading ? "Checking account..." : "Sign in"}
            {!loading && (
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            )}
          </Button>
        </form>

        <div className="mt-7 border-t border-[#EEF1EF] pt-5 text-center">
          <p className="text-xs font-medium leading-5 text-[#8A9690]">
            Accounts are created by the teacher. Registration is not required.
          </p>
        </div>
      </motion.section>
    </AuthLayout>
  );
}
