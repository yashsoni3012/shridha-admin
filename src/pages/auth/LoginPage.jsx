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
import black_logo_img from "../../assets/black_logo_img.png";

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
      {/* Custom keyframes – keep animations */}
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

      {/* Main container with background image and subtle overlay */}
      <div
        className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden"
        style={{
          backgroundImage: `url(${login_img})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Light transparent overlay – lets background image be visible */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />

        {/* Subtle radial glow (optional, keeps a bit of warmth) */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,121,42,0.1)_0%,_transparent_70%)]" />

        {/* Login card – white background with black text, shadow, and animations */}
        <div
          className="relative w-full max-w-md rounded-3xl p-8 bg-white/95 backdrop-blur-sm border border-white/20 shadow-2xl shadow-black/20 animate-floatIn"
          style={{ animationDelay: "0.1s" }}
        >
          {/* Logo and brand */}
          <div className="flex items-center gap-3 mb-8">
            <img src={black_logo_img} alt="Shridha" className="h-14 object-contain" />
            {/* Optional: brand name next to logo */}
          </div>

          {/* Heading with black text */}
          <div className="mb-6">
            <h1 className="font-serif text-4xl font-extrabold text-gray-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Sign in to access your admin panel.
            </p>
          </div>

          {/* Demo credentials box – light version */}
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-lg text-amber-700">
              🔑
            </div>
            <div>
              <p className="font-mono text-[10px] text-amber-700 uppercase tracking-widest">
                Demo Credentials
              </p>
              <p className="font-mono text-sm text-amber-800 leading-relaxed">
                admin@shridha.com
                <br />
                admin123
              </p>
            </div>
          </div>

          {/* Form – inputs with light background and dark text */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Email */}
            <div className="mb-4">
              <label className="block font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 font-sans ${
                  errors.email
                    ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                    : "border-gray-200 hover:border-gray-300 focus:border-[#d4792a] focus:ring-4 focus:ring-amber-100"
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
                <p className="text-red-600 text-xs font-sans mt-1">
                  ⚠ {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-2">
              <div className="flex justify-between items-center mb-2">
                <label className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`w-full px-4 py-3 pr-12 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 outline-none transition-all duration-200 font-sans ${
                    errors.password
                      ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100"
                      : "border-gray-200 hover:border-gray-300 focus:border-[#d4792a] focus:ring-4 focus:ring-amber-100"
                  }`}
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-xs font-sans mt-1">
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
          <p className="mt-8 text-center text-gray-400 text-xs font-mono tracking-wide">
            © {new Date().getFullYear()} Shridha. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
}