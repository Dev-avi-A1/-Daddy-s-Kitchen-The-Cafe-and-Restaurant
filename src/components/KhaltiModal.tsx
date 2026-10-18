import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface KhaltiModalProps {
  orderId: string;
  orderNumber: string;
  amount: number;
  onSuccess: (txRef: string) => void;
  onCancel: () => void;
}

export const KhaltiModal: React.FC<KhaltiModalProps> = ({
  orderId,
  orderNumber,
  amount,
  onSuccess,
  onCancel,
}) => {
  const [mobileNumber, setMobileNumber] = useState('9802672008');
  const [mpin, setMpin] = useState('5678');
  const [otp, setOtp] = useState('112233');
  const [step, setStep] = useState<'credentials' | 'otp' | 'processing'>('credentials');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
  };

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setStep('processing');

    setTimeout(() => {
      const txRef = `KHALTI_SBX_${Date.now()}`;
      setIsVerifying(false);
      onSuccess(txRef);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-stone-200">
        {/* Khalti Header */}
        <div className="bg-[#5C2D91] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white text-[#5C2D91] flex items-center justify-center font-black text-sm shadow-xs">
              K
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-base block leading-tight">
                Khalti Sandbox
              </span>
              <span className="text-[10px] text-purple-200 block font-medium">
                Daddy's Kitchen – Butwal
              </span>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white p-1 rounded-full"
            aria-label="Cancel Khalti"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 flex items-center justify-between text-xs">
            <div>
              <span className="text-stone-500 block">Order Reference</span>
              <span className="font-bold text-stone-900">{orderNumber}</span>
            </div>
            <div className="text-right">
              <span className="text-stone-500 block">Payable</span>
              <span className="font-bold font-mono tabular-nums text-purple-900 text-sm">
                NPR {amount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-purple-900 bg-purple-50 p-2 rounded-lg border border-purple-200/80">
            <ShieldCheck className="w-4 h-4 text-[#5C2D91] shrink-0" />
            <span>Khalti Test Wallet Sandbox (Pre-populated demo credentials)</span>
          </div>

          {step === 'credentials' && (
            <form onSubmit={handleProceedToOtp} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Khalti Registered Phone
                </label>
                <input
                  type="text"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#5C2D91] focus:bg-white text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Khalti PIN (4 digits)
                </label>
                <input
                  type="password"
                  value={mpin}
                  onChange={(e) => setMpin(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#5C2D91] focus:bg-white text-stone-900"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#5C2D91] hover:bg-[#492275] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 mt-2"
              >
                <span>Request Verification Code</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleConfirmPayment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Khalti OTP Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-center tracking-widest font-mono text-stone-900 font-bold text-sm"
                  required
                />
                <span className="text-[10px] text-stone-500 mt-1 block text-center">
                  Sandbox verification code ready.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#5C2D91] hover:bg-[#492275] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Payment of NPR {amount}</span>
              </button>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-[#5C2D91] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-stone-700">
                Authorizing Khalti token...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
