import { Suspense } from "react";
import SetPassword from "./components/SetPassword";

export default function AccountActivation() {
  return (
    <div className="min-h-screen bg-linear-to-br from-white via-slate-50 to-blue-50 text-slate-900 font-sans">
      {/* Decorative background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-12 w-72 h-72 border border-blue-100 rounded-full rotate-45" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl" />
      </div>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <Suspense fallback={null}>
          <SetPassword />
        </Suspense>
      </main>
    </div>
  );
}
