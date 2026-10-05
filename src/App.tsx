import React, { useEffect, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { ForgotPasswordModal } from './components/ForgotPasswordModal';
import { LoginScreen } from './components/LoginScreen';
import { RegisterScreen } from './components/RegisterScreen';
import { AppScreen, ScreenSwitcherBanner } from './components/ScreenSwitcherBanner';
import { SupportModal } from './components/SupportModal';
import { initialUser } from './data/mockData';
import { UserProfile } from './types';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('login');
  const [user, setUser] = useState<UserProfile>(initialUser);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileFrame, setIsMobileFrame] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);

  // Load saved user session on mount
  useEffect(() => {
    const savedUserStr = localStorage.getItem('shopcommission_current_user');
    if (savedUserStr) {
      try {
        const parsed = JSON.parse(savedUserStr);
        setUser(parsed);
      } catch {
        // fallback
      }
    }
  }, []);

  const handleLoginSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
  };

  const handleRegisterSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    setIsLoggedIn(true);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('login');
  };

  // Helper to render inside phone shell if mobile frame is toggled on
  const wrapWithPhoneFrame = (content: React.ReactNode, titleLabel?: string) => {
    if (!isMobileFrame) return content;

    return (
      <div className="py-8 px-4 flex flex-col items-center justify-center min-h-[calc(100vh-48px)] bg-slate-200">
        {titleLabel && (
          <div className="mb-3 px-3 py-1 bg-white/80 backdrop-blur-xs text-xs font-semibold text-slate-700 rounded-full border border-slate-300 shadow-xs">
            {titleLabel}
          </div>
        )}
        <div className="w-[390px] min-h-[844px] bg-[#f7f9fb] rounded-[44px] shadow-2xl border-[10px] border-slate-900 overflow-hidden relative flex flex-col">
          {/* iOS Dynamic Island / Speaker */}
          <div className="w-full pt-3 pb-1 flex justify-center bg-transparent z-30">
            <div className="w-28 h-5 bg-slate-900 rounded-full flex items-center justify-end px-3">
              <div className="w-2.5 h-2.5 bg-[#1a237e]/40 rounded-full ring-1 ring-slate-800" />
            </div>
          </div>
          {/* Screen Content */}
          <div className="flex-1 overflow-y-auto">{content}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] flex flex-col">
      {/* Top Interactive Switcher to test either screen effortlessly */}
      <ScreenSwitcherBanner
        currentScreen={currentScreen}
        onSelectScreen={(screen) => setCurrentScreen(screen)}
        isMobileFrame={isMobileFrame}
        onToggleMobileFrame={() => setIsMobileFrame(!isMobileFrame)}
      />

      {/* Screen Render */}
      <div className="flex-1 flex flex-col">
        {currentScreen === 'login' && (
          <div className="flex-1 flex flex-col justify-center items-center p-4">
            {wrapWithPhoneFrame(
              <LoginScreen
                onNavigateToRegister={() => setCurrentScreen('register')}
                onLoginSuccess={handleLoginSuccess}
                onForgotPassword={() => setShowForgotModal(true)}
                onOpenSupport={() => setShowSupportModal(true)}
              />,
              'Image 1: লগইন স্ক্রিন প্রিভিউ'
            )}
          </div>
        )}

        {currentScreen === 'register' && (
          <div className="flex-1">
            {wrapWithPhoneFrame(
              <RegisterScreen
                onNavigateToLogin={() => setCurrentScreen('login')}
                onRegisterSuccess={handleRegisterSuccess}
              />,
              'Image 3: নতুন অ্যাকাউন্ট স্ক্রিন প্রিভিউ'
            )}
          </div>
        )}

        {currentScreen === 'dashboard' && (
          <Dashboard
            user={user}
            onLogout={handleLogout}
            onOpenSupport={() => setShowSupportModal(true)}
            onSwitchToLoginScreen={() => setCurrentScreen('login')}
            onSwitchToRegisterScreen={() => setCurrentScreen('register')}
          />
        )}

        {currentScreen === 'compare' && (
          <div className="flex-1 p-6 lg:p-10 max-w-7xl mx-auto w-full">
            <div className="text-center mb-8">
              <h2 className="font-headline-md text-2xl text-on-surface">স্ক্রিন ডিজাইন তুলনা</h2>
              <p className="font-body-sm text-on-surface-variant mt-1">
                Image 1 (লগইন) এবং Image 3 (রেজিস্ট্রেশন) স্ক্রিনের পাশাপাশি প্রিভিউ
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              {/* Screen 1 Preview */}
              <div className="bg-white p-4 rounded-2xl border border-outline-variant/40 shadow-md">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                      ১
                    </span>
                    <span className="font-headline-sm text-sm">Image 1: লগইন স্ক্রিন</span>
                  </div>
                  <button
                    onClick={() => setCurrentScreen('login')}
                    className="text-xs text-primary font-medium hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>স্ক্রিনে যান</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
                <div className="max-w-md mx-auto">
                  <LoginScreen
                    onNavigateToRegister={() => setCurrentScreen('register')}
                    onLoginSuccess={handleLoginSuccess}
                    onForgotPassword={() => setShowForgotModal(true)}
                    onOpenSupport={() => setShowSupportModal(true)}
                  />
                </div>
              </div>

              {/* Screen 2 Preview */}
              <div className="bg-white p-4 rounded-2xl border border-outline-variant/40 shadow-md">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-outline-variant/30">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-secondary text-white text-xs flex items-center justify-center font-bold">
                      ২
                    </span>
                    <span className="font-headline-sm text-sm">Image 3: নতুন একাউন্ট তৈরি</span>
                  </div>
                  <button
                    onClick={() => setCurrentScreen('register')}
                    className="text-xs text-primary font-medium hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>স্ক্রিনে যান</span>
                    <span className="material-symbols-outlined text-xs">arrow_forward</span>
                  </button>
                </div>
                <div className="max-w-md mx-auto">
                  <RegisterScreen
                    onNavigateToLogin={() => setCurrentScreen('login')}
                    onRegisterSuccess={handleRegisterSuccess}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
      />

      <SupportModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </div>
  );
}
