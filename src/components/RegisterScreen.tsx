import React, { useState } from 'react';
import { UserProfile } from '../types';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
  onRegisterSuccess: (user: UserProfile) => void;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onNavigateToLogin,
  onRegisterSuccess,
}) => {
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName.trim()) {
      setError('আপনার পূর্ণ নাম লিখুন');
      return;
    }
    if (!mobileNumber.trim()) {
      setError('আপনার মোবাইল নম্বর দিন');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('একটি সঠিক ইমেইল ঠিকানা দিন');
      return;
    }
    if (!password || password.length < 6) {
      setError('পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে');
      return;
    }
    if (password !== confirmPassword) {
      setError('পাসওয়ার্ড দুটি মেলেনি, পুনরায় যাচাই করুন');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const generatedCode = 'SHOP' + Math.floor(1000 + Math.random() * 9000);
      const newUser: UserProfile = {
        id: 'usr_' + Date.now(),
        name: fullName.trim(),
        email: email.trim(),
        phone: mobileNumber.trim(),
        myReferralCode: generatedCode,
        usedReferralCode: referralCode.trim() || undefined,
        balance: 100, // ৳100 welcome bonus for new affiliate!
        totalEarnings: 100,
        todayEarnings: 100,
        totalSales: 0,
        tier: 'ব্রোঞ্জ',
        joinedDate: 'আজ',
      };

      localStorage.setItem('shopcommission_current_user', JSON.stringify(newUser));
      onRegisterSuccess(newUser);
    }, 700);
  };

  const handleQuickFill = () => {
    setFullName('মাহমুদুল হাসান মারুফ');
    setMobileNumber('01712345678');
    setEmail('ytmaruf2000@gmail.com');
    setPassword('shop@1234');
    setConfirmPassword('shop@1234');
    setReferralCode('SHOP99');
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#e2dfff] selection:text-[#0f0069] bg-surface">
      {/* Header Gradient Banner */}
      <div className="relative bg-gradient-to-br from-[#4f46e5] via-[#712ae2] to-[#4f46e5] text-white px-6 pt-12 pb-16 rounded-b-[2.5rem] shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-md mx-auto relative z-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur-md mb-4 shadow-inner">
            <span className="material-symbols-outlined text-white text-2xl">rocket_launch</span>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile mb-2">নতুন অ্যাকাউন্ট তৈরি করুন</h1>
          <p className="font-body-sm text-white/90">ShopCommission পরিবারে যুক্ত হয়ে আয় শুরু করুন</p>
        </div>
      </div>

      {/* Registration Card Container */}
      <main className="max-w-md w-full mx-auto px-4 -mt-8 mb-12 relative z-20">
        <div className="bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(79,70,229,0.06)] border border-outline-variant/40 p-6 sm:p-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-label-sm text-on-surface-variant">
              নতুন মেম্বারদের জন্য ১০০৳ জয়েনিং বোনাস!
            </span>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[11px] font-label-sm px-2.5 py-1 rounded bg-primary-fixed text-on-primary-fixed hover:bg-primary-container hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xs">bolt</span>
              অটো ফিল
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-base">error</span>
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            {/* Full Name */}
            <div>
              <label className="block font-label-md text-on-surface-variant mb-1.5">পূর্ণ নাম</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-xl">person</span>
                </span>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-lg font-body-md text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#3525cd]/20 transition-all duration-200"
                  placeholder="আপনার পূর্ণ নাম লিখুন"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="block font-label-md text-on-surface-variant mb-1.5">মোবাইল নম্বর</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-xl">smartphone</span>
                </span>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-lg font-body-md text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#3525cd]/20 transition-all duration-200"
                  placeholder="আপনার মোবাইল নম্বর দিন"
                  type="tel"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block font-label-md text-on-surface-variant mb-1.5">ইমেইল</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-xl">mail</span>
                </span>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-lg font-body-md text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#3525cd]/20 transition-all duration-200"
                  placeholder="আপনার ইমেইল ঠিকানা দিন"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block font-label-md text-on-surface-variant mb-1.5">পাসওয়ার্ড</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-xl">lock</span>
                </span>
                <input
                  className="w-full pl-10 pr-12 py-3 bg-surface-container-low border border-outline-variant/60 rounded-lg font-body-md text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#3525cd]/20 transition-all duration-200"
                  placeholder="শক্তিশালী পাসওয়ার্ড দিন"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-on-surface cursor-pointer"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-label-md text-on-surface-variant mb-1.5">পাসওয়ার্ড নিশ্চিত করুন</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-xl">lock_reset</span>
                </span>
                <input
                  className="w-full pl-10 pr-12 py-3 bg-surface-container-low border border-outline-variant/60 rounded-lg font-body-md text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#3525cd]/20 transition-all duration-200"
                  placeholder="পুনরায় পাসওয়ার্ড দিন"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-on-surface cursor-pointer"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showConfirmPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Referral Code */}
            <div>
              <label className="block font-label-md text-on-surface-variant mb-1.5">Referral Code (Optional)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-xl">card_giftcard</span>
                </span>
                <input
                  className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant/60 rounded-lg font-body-md text-on-surface placeholder:text-outline/70 focus:outline-none focus:border-primary focus:ring-2 focus:ring-[#3525cd]/20 transition-all duration-200 uppercase"
                  placeholder="রেফারেল কোড (যদি থাকে)"
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                className="w-full py-3.5 px-4 bg-gradient-to-r from-primary-container to-secondary text-white font-label-md rounded-lg shadow-md hover:opacity-95 active:scale-[0.98] transition-all duration-200 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-70"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>অ্যাকাউন্ট তৈরি হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <span>অ্যাকাউন্ট তৈরি করুন</span>
                    <span className="material-symbols-outlined text-lg">arrow_forward</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="font-label-md text-primary hover:underline cursor-pointer"
            >
              ইতিমধ্যে অ্যাকাউন্ট আছে? লগইন করুন
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-outline font-label-sm">
        <p>© ShopCommission. সমস্ত অধিকার সংরক্ষিত।</p>
      </footer>
    </div>
  );
};
