import React, { useState } from 'react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<'request' | 'verify' | 'success'>('request');
  const [identifier, setIdentifier] = useState('01712345678');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setMsg('মোবাইল নম্বর বা ইমেইল দিন');
      return;
    }
    setIsLoading(true);
    setMsg('');
    setTimeout(() => {
      setIsLoading(false);
      setStep('verify');
    }, 600);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setMsg('সঠিক ৪-ডিজিট ওটিপি কোড দিন (যেমন: 1234)');
      return;
    }
    if (newPassword.length < 6) {
      setMsg('নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে');
      return;
    }
    setIsLoading(true);
    setMsg('');
    setTimeout(() => {
      setIsLoading(false);
      setStep('success');
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-6 shadow-2xl border border-outline-variant/40 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary-container">lock_reset</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">পাসওয়ার্ড পুনরুদ্ধার</h3>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface p-1 rounded-full hover:bg-surface-container cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {msg && (
          <div className="mb-4 p-2.5 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-base">info</span>
            <span>{msg}</span>
          </div>
        )}

        {step === 'request' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <p className="font-body-sm text-on-surface-variant">
              আপনার নিবন্ধিত মোবাইল নম্বর অথবা ইমেইল ঠিকানা দিন। আমরা আপনাকে একটি যাচাইকরণ ওটিপি পাঠাব।
            </p>
            <div>
              <label className="block font-label-md text-on-surface-variant mb-1.5">মোবাইল বা ইমেইল</label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="017xxxxxxxx বা user@mail.com"
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-primary-container to-secondary text-white font-label-md rounded-lg shadow-md hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>কোড পাঠানো হচ্ছে...</span>
                </>
              ) : (
                <span>ওটিপি কোড পাঠান</span>
              )}
            </button>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
              একটি পরীক্ষামূলক ওটিপি পাঠানো হয়েছে: <strong>১২২৪</strong> (বা যেকোনো ৪ সংখ্যা)
            </div>
            <div>
              <label className="block font-label-md text-on-surface-variant mb-1.5">৪-ডিজিট ওটিপি কোড</label>
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="1 2 3 4"
                className="w-full px-4 py-2.5 text-center tracking-widest text-lg font-bold bg-surface-container-low border border-outline-variant rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-container"
              />
            </div>
            <div>
              <label className="block font-label-md text-on-surface-variant mb-1.5">নতুন পাসওয়ার্ড</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="কমপক্ষে ৬ অক্ষর দিন"
                className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-primary-container to-secondary text-white font-label-md rounded-lg shadow-md hover:opacity-95 transition-all cursor-pointer"
            >
              {isLoading ? 'পাসওয়ার্ড আপডেট হচ্ছে...' : 'পাসওয়ার্ড পরিবর্তন করুন'}
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center py-4 space-y-4">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">check_circle</span>
            </div>
            <h4 className="font-headline-sm text-emerald-800">পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!</h4>
            <p className="font-body-sm text-on-surface-variant">
              এখন আপনি আপনার নতুন পাসওয়ার্ড দিয়ে লগইন করতে পারেন।
            </p>
            <button
              type="button"
              onClick={() => {
                setStep('request');
                onClose();
              }}
              className="w-full py-2.5 bg-primary-container text-white font-label-md rounded-lg hover:opacity-95 cursor-pointer"
            >
              লগইন পেজে ফিরে যান
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
