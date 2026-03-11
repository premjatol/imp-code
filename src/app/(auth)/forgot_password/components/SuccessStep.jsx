import { HiOutlineCheckCircle, HiArrowRight } from "react-icons/hi";

export default function SuccessStep({ onLogin }) {
  return (
    <div className="text-center py-4">
      <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
        <HiOutlineCheckCircle className="w-10 h-10" />
      </div>
      <h2 className="text-2xl font-bold mb-3">Verification Email Sent</h2>
      <p className="text-slate-500 text-xs leading-relaxed mb-8">
        {/* Your password has been successfully updated. You can now log in with
        your new password. */}
        A verification link has been sent to your registered email address.
        Kindly check your inbox and complete the verification process.
      </p>
      <button
        onClick={onLogin}
        className="w-full py-4 px-6 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold 
          flex items-center justify-center transition-all shadow-xl shadow-slate-200 cursor-pointer text-sm"
      >
        Back to Log in <HiArrowRight className="ml-2 w-5 h-5" />
      </button>
    </div>
  );
}
