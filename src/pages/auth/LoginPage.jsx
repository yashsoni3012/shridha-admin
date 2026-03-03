import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { useLogin } from "../../hooks/useAuth";
import login_img from "../../assets/login_img.png";
import logo_img from "../../assets/logo_img.png";

export default function LoginPage() {
  const [showPass, setShowPass] = useState(false);
  const { mutate: login, isPending } = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => login(data);

  return (
    <>
      {/* Custom keyframes – keep the animations */}
      <style>{`
        @keyframes floatIn {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes glowBorder {
          0%,100% { box-shadow: 0 0 0 0 rgba(212,121,42,0); }
          50%     { box-shadow: 0 0 0 8px rgba(212,121,42,0.12); }
        }
        .animate-floatIn {
          animation: floatIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .animate-spin-slow {
          animation: spin 0.8s linear infinite;
        }
        .glow-border {
          animation: glowBorder 3s ease-in-out infinite;
        }
      `}</style>

      {/* Main container with background image and overlay */}
      <div
        className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
        style={{
          backgroundImage: `url(${login_img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/80" />

        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,121,42,0.15)_0%,_transparent_70%)]" />

        {/* Login card – glassmorphism */}
        <div
          className="relative w-full max-w-md rounded-3xl p-8 backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl animate-floatIn"
          style={{ animationDelay: "0.1s" }}
        >
          {/* Logo and brand */}
          <div className="flex items-center gap-3 mb-8">
            <img src={logo_img} alt="Shridha" className="h-10 object-cover" />
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h1 className="font-serif text-4xl font-extrabold text-white tracking-tight">
              Welcome back
            </h1>
            <p className="text-white/40 text-sm mt-1">
              Sign in to access your admin panel.
            </p>
          </div>

          {/* Demo credentials box */}
          <div className="mb-6 p-4 bg-[#d4792a]/10 border border-[#d4792a]/20 rounded-xl flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#d4792a]/20 flex items-center justify-center text-lg">
              🔑
            </div>
            <div>
              <p className="font-mono text-[10px] text-[#d4792a]/60 uppercase tracking-widest">
                Demo Credentials
              </p>
              <p className="font-mono text-sm text-[#eab97d] leading-relaxed">
                admin@shridha.com
                <br />
                admin123
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <div className="mb-4">
              <label className="block font-mono text-[10px] text-white/40 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className={`w-full px-4 py-3 bg-white/5 border rounded-xl text-white placeholder-white/20 outline-none transition-all duration-200 font-sans ${
                  errors.email
                    ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                    : "border-white/10 hover:border-white/20 focus:border-[#d4792a]/60 focus:ring-4 focus:ring-[#d4792a]/10"
                }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Enter a valid email",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-400 text-xs font-sans mt-1">
                  ⚠ {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <label className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                  Password
                </label>
                <button
                  type="button"
                  className="text-[#d4792a] text-xs font-sans hover:underline"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 pr-12 bg-white/5 border rounded-xl text-white placeholder-white/20 outline-none transition-all duration-200 font-sans ${
                    errors.password
                      ? "border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10"
                      : "border-white/10 hover:border-white/20 focus:border-[#d4792a]/60 focus:ring-4 focus:ring-[#d4792a]/10"
                  }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs font-sans mt-1">
                  ⚠ {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit button */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 px-6 flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4792a] via-[#c4611f] to-[#a34b1b] text-white font-semibold rounded-xl shadow-lg shadow-[#d4792a]/30 hover:shadow-xl hover:shadow-[#d4792a]/40 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin-slow" />
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in to Shridha <ArrowRight size={15} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Footer */}
          <p className="mt-8 text-center text-white/20 text-xs font-mono tracking-wide">
            © {new Date().getFullYear()} Shridha. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}