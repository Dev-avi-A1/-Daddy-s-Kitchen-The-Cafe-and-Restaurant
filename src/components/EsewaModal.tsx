import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';

interface EsewaModalProps {
  orderId: string;
  orderNumber: string;
  amount: number;
  onSuccess: (txRef: string) => void;
  onCancel: () => void;
}

export const EsewaModal: React.FC<EsewaModalProps> = ({
  orderId,
  orderNumber,
  amount,
  onSuccess,
  onCancel,
}) => {
  const [esewaId, setEsewaId] = useState('9802672008');
  const [mpin, setMpin] = useState('1234');
  const [otp, setOtp] = useState('889900');
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
      const txRef = `ESEWA_SBX_${Date.now()}`;
      setIsVerifying(false);
      onSuccess(txRef);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-stone-200">
        {/* eSewa Header */}
        <div className="bg-[#60BB46] p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white text-[#60BB46] flex items-center justify-center font-extrabold text-sm shadow-xs">
              e
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-base block leading-tight">
                eSewa Sandbox Gateway
              </span>
              <span className="text-[10px] text-emerald-100 block font-medium">
                Merchant: Daddy's Kitchen Butwal
              </span>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-white/80 hover:text-white p-1 rounded-full"
            aria-label="Cancel eSewa"
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
              <span className="text-stone-500 block">Payable Amount</span>
              <span className="font-bold font-mono tabular-nums text-emerald-700 text-sm">
                NPR {amount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200/80">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Interactive Nepal Digital Wallet Test Mode (Pre-filled credentials)</span>
          </div>

          {step === 'credentials' && (
            <form onSubmit={handleProceedToOtp} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  eSewa ID (Mobile Number)
                </label>
                <input
                  type="text"
                  value={esewaId}
                  onChange={(e) => setEsewaId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#60BB46] focus:bg-white text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  eSewa Password / MPIN
                </label>
                <input
                  type="password"
                  value={mpin}
                  onChange={(e) => setMpin(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-[#60BB46] focus:bg-white text-stone-900"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#60BB46] hover:bg-[#52a53b] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 mt-2"
              >
                <span>Continue to OTP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleConfirmPayment} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  SMS Verification Code (OTP)
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-xs p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-center tracking-widest font-mono text-stone-900 font-bold text-sm"
                  required
                />
                <span className="text-[10px] text-stone-500 mt-1 block text-center">
                  Sandbox simulation code auto-filled.
                </span>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#60BB46] hover:bg-[#52a53b] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Payment of NPR {amount}</span>
              </button>
            </form>
          )}

          {step === 'processing' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-10 h-10 border-3 border-[#60BB46] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs font-semibold text-stone-700">
                Verifying payment with eSewa servers...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
