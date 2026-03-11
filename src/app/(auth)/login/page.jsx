import LoginForm from "./components/LoginForm";

export default function LoginPage() {
   return (
    <div className="min-h-screen bg-linear-to-br from-white via-slate-50 to-blue-50 text-slate-900 overflow-hidden font-sans">
      {/* Background Decorative elements (Softened for light theme) */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-64 h-64 border border-blue-200 rounded-full transform rotate-45"></div>
        <div className="absolute bottom-1/4 right-20 w-96 h-96 border border-purple-200 rounded-full transform -rotate-12"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-cyan-100 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        <main className="flex flex-col lg:flex-row items-center justify-center min-h-[85vh]">
          {/* Login Form Section */}
          <div className="w-full lg:w-1/2 max-w-md p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] mb-10 lg:mb-0 lg:mr-8 transform transition-all duration-500 hover:shadow-blue-500/10">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-extrabold mb-3 tracking-tight text-slate-900">
                Welcome Back
              </h2>
              <p className="text-slate-500">
                Sign in to explore your 3D workspace
              </p>
            </div>

            <LoginForm />
          </div>

          {/* Visualization Section */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
              <div className="absolute inset-0 transform transition-all duration-1000 hover:scale-105">
                {/* Visual Cards - Light Mode Accents */}
                <div className="absolute w-full h-full bg-white border border-slate-100 shadow-2xl rounded-4xl flex items-center justify-center z-20">
                  <div className="text-center">
                    <div className="text-6xl font-black text-slate-900 mb-2">
                      2D
                    </div>
                    <div className="text-slate-400 font-medium uppercase tracking-widest text-xs">
                      Navigation
                    </div>
                  </div>
                </div>

                <div className="absolute w-full h-full bg-blue-600 border border-blue-500 shadow-xl rounded-4xl transform rotate-6 translate-x-6 translate-y-6 z-10 flex items-center justify-center">
                  <div className="text-white text-4xl">→</div>
                </div>

                <div className="absolute w-full h-full bg-slate-100 border border-slate-200 rounded-4xl transform -rotate-6 -translate-x-6 -translate-y-6 -z-10"></div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
