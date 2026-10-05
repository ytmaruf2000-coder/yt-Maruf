import React, { useState } from 'react';
import { initialUser } from '../data/mockData';
import { UserProfile } from '../types';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
  onLoginSuccess: (user: UserProfile) => void;
  onForgotPassword: () => void;
  onOpenSupport: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onNavigateToRegister,
  onLoginSuccess,
  onForgotPassword,
  onOpenSupport,
}) => {
  const [identifier, setIdentifier] = useState('01712345678');
  const [password, setPassword] = useState('shop@1234');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim()) {
      setErrorMessage('অনুগ্রহ করে আপনার মোবাইল নম্বর অথবা ইমেইল দিন');
      return;
    }

    if (!password) {
      setErrorMessage('অনুগ্রহ করে পাসওয়ার্ড লিখুন');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Retrieve registered accounts or use default user
      const savedUserStr = localStorage.getItem('shopcommission_current_user');
      if (savedUserStr) {
        try {
          const savedUser = JSON.parse(savedUserStr);
          onLoginSuccess(savedUser);
          return;
        } catch {
          // fallback to default
        }
      }
      onLoginSuccess(initialUser);
    }, 700);
  };

  const handleQuickDemo = () => {
    setIdentifier('01712345678');
    setPassword('shop@1234');
    setErrorMessage('');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(79,70,229,0.08)] overflow-hidden border border-outline-variant/30">
      {/* Header Gradient Section */}
      <div className="bg-gradient-to-r from-primary-container to-secondary p-space-xl text-center relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-black/10 rounded-full blur-xl pointer-events-none" />
        
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 backdrop-blur-md mb-4 text-white shadow-sm ring-1 ring-white/20">
          <span className="material-symbols-outlined text-3xl">storefront</span>
        </div>
        <h1 className="font-headline-md text-headline-md text-white mb-2 tracking-tight">ShopCommission</h1>
        <p className="text-white/80 font-body-sm">আপনার ড্যাশবোর্ড এবং আর্নিংস অ্যাক্সেস করতে লগইন করুন</p>
      </div>

      {/* Form Body */}
      <div className="p-space-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-headline-sm text-headline-sm text-on-surface">আপনার অ্যাকাউন্টে লগইন করুন</h2>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="text-[11px] font-label-sm px-2.5 py-1 rounded bg-primary-fixed text-on-primary-fixed hover:bg-primary-container hover:text-white transition-colors flex items-center gap-1"
            title="ডেমো তথ্য পূরণ করুন"
          >
            <span className="material-symbols-outlined text-xs">bolt</span>
            ডেমো ফিল
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form className="space-y-space-md" onSubmit={handleSubmit}>
          {/* Mobile/Email Field */}
          <div>
            <label className="block font-label-md text-on-surface-variant mb-2">মোবাইল নম্বর / ইমেইল</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined text-xl">person</span>
              </span>
              <input
                className="w-full pl-10 pr-4 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-surface transition-all"
                placeholder="আপনার মোবাইল নম্বর বা ইমেইল দিন"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block font-label-md text-on-surface-variant mb-2">পাসওয়ার্ড</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                <span className="material-symbols-outlined text-xl">lock</span>
              </span>
              <input
                className="w-full pl-10 pr-10 py-3 bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container focus:bg-surface transition-all"
                placeholder="আপনার পাসওয়ার্ড দিন"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors cursor-pointer"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
              >
                <span className="material-symbols-outlined text-xl">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onForgotPassword}
              className="font-label-sm text-primary hover:underline font-medium cursor-pointer"
            >
              পাসওয়ার্ড ভুলে গেছেন?
            </button>
          </div>

          {/* Primary Login Button */}
          <button
            className="w-full py-3 px-4 bg-gradient-to-r from-primary-container to-secondary text-white font-label-md rounded-lg shadow-[0px_4px_12px_rgba(79,70,229,0.25)] hover:opacity-95 active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>লগইন হচ্ছে...</span>
              </>
            ) : (
              <span>লগইন করুন</span>
            )}
          </button>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-outline-variant" />
            <span className="flex-shrink mx-4 text-outline font-label-sm">অথবা</span>
            <div className="flex-grow border-t border-outline-variant" />
          </div>

          {/* Secondary Create Account Button */}
          <button
            className="w-full py-3 px-4 bg-transparent border border-outline-variant text-on-surface font-label-md rounded-lg hover:bg-surface-container-low active:scale-[0.98] transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
            type="button"
            onClick={onNavigateToRegister}
          >
            <span className="material-symbols-outlined text-lg text-primary">person_add</span>
            <span>অ্যাকাউন্ট তৈরি করুন</span>
          </button>
        </form>
      </div>

      {/* Footer Help */}
      <div className="bg-surface-container-low p-4 text-center border-t border-outline-variant/50">
        <p className="font-body-sm text-on-surface-variant">
          কোনো সমস্যা হচ্ছে?{' '}
          <button
            type="button"
            onClick={onOpenSupport}
            className="text-primary font-medium hover:underline cursor-pointer"
          >
            সাপোর্ট টিমের সাথে যোগাযোগ করুন
          </button>
        </p>
      </div>
    </div>
  );
};
