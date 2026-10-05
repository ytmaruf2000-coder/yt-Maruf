import React, { useState } from 'react';
import { initialProducts, initialReferrals, initialTransactions, initialWithdrawals } from '../data/mockData';
import { CommissionTransaction, ProductItem, ReferralMember, UserProfile, WithdrawalRequest } from '../types';

interface DashboardProps {
  user: UserProfile;
  onLogout: () => void;
  onOpenSupport: () => void;
  onSwitchToLoginScreen: () => void;
  onSwitchToRegisterScreen: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user: initialUserData,
  onLogout,
  onOpenSupport,
  onSwitchToLoginScreen,
  onSwitchToRegisterScreen,
}) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(initialUserData);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'referrals' | 'withdrawals' | 'profile'>('overview');
  
  // Data states
  const [transactions, setTransactions] = useState<CommissionTransaction[]>(initialTransactions);
  const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>(initialWithdrawals);
  const [referrals] = useState<ReferralMember[]>(initialReferrals);
  const [products] = useState<ProductItem[]>(initialProducts);
  
  // UI filter states
  const [trxFilter, setTrxFilter] = useState<'all' | 'অনুমোদিত' | 'পেন্ডিং' | 'পেইড'>('all');
  const [productCategory, setProductCategory] = useState<string>('all');
  const [productSearch, setProductSearch] = useState<string>('');
  
  // Link generation modal / state
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [selectedProductForLink, setSelectedProductForLink] = useState<ProductItem | null>(null);
  
  // Withdrawal Form State
  const [withdrawMethod, setWithdrawMethod] = useState<'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer'>('bKash');
  const [withdrawAccount, setWithdrawAccount] = useState('01712-345678');
  const [withdrawAmount, setWithdrawAmount] = useState('2000');
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Profile Edit State
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone);
  const [profileSaved, setProfileSaved] = useState(false);

  // Copy helper
  const handleCopyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLinkId(id);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  // Withdraw action
  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = Number(withdrawAmount);
    if (isNaN(amountNum) || amountNum < 500) {
      alert('ন্যূনতম উত্তোলনের পরিমাণ ৫০০ টাকা');
      return;
    }
    if (amountNum > currentUser.balance) {
      alert('আপনার পর্যাপ্ত ব্যালেন্স নেই');
      return;
    }

    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      const newBalance = currentUser.balance - amountNum;
      const updatedUser = { ...currentUser, balance: newBalance };
      setCurrentUser(updatedUser);
      localStorage.setItem('shopcommission_current_user', JSON.stringify(updatedUser));

      const newTrx: WithdrawalRequest = {
        id: 'wd_' + Date.now().toString().slice(-4),
        method: withdrawMethod,
        accountNumber: withdrawAccount,
        amount: amountNum,
        date: 'আজ, ' + new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }),
        status: 'প্রক্রিয়াধীন',
        trxId: 'TX' + Math.random().toString(36).substring(2, 8).toUpperCase(),
      };
      setWithdrawals([newTrx, ...withdrawals]);
      setWithdrawSuccessMsg(`৳${amountNum} উত্তোলনের অনুরোধ সফলভাবে গ্রহণ করা হয়েছে!`);
      setTimeout(() => setWithdrawSuccessMsg(''), 4000);
    }, 800);
  };

  // Save profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = { ...currentUser, name: profileName, phone: profilePhone };
    setCurrentUser(updated);
    localStorage.setItem('shopcommission_current_user', JSON.stringify(updated));
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2500);
  };

  const filteredTransactions = transactions.filter((t) => {
    if (trxFilter === 'all') return true;
    return t.status === trxFilter;
  });

  const filteredProducts = products.filter((p) => {
    const matchesCat = productCategory === 'all' || p.category === productCategory;
    const matchesSearch =
      p.titleBn.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.title.toLowerCase().includes(productSearch.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] pb-16">
      {/* Top Navigation */}
      <header className="bg-surface-container-lowest border-b border-outline-variant/40 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-container to-secondary flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-2xl">storefront</span>
            </div>
            <div>
              <span className="font-headline-sm text-lg font-bold text-on-surface tracking-tight">ShopCommission</span>
              <span className="hidden sm:inline-block ml-2 text-xs px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-medium">
                {currentUser.tier} পার্টনার
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Balance Badge */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low border border-outline-variant/60">
              <span className="text-xs text-on-surface-variant">ব্যালেন্স:</span>
              <span className="text-sm font-bold text-primary">৳ {currentUser.balance.toLocaleString('bn-BD')}</span>
            </div>

            {/* Support button */}
            <button
              onClick={onOpenSupport}
              className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors cursor-pointer"
              title="সহায়তা কেন্দ্র"
            >
              <span className="material-symbols-outlined text-xl">help_outline</span>
            </button>

            {/* Logout button */}
            <button
              onClick={onLogout}
              className="px-3 py-1.5 text-xs font-label-md text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              <span className="hidden sm:inline">লগআউট</span>
            </button>
          </div>
        </div>

        {/* Dashboard Subtabs Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto scrollbar-none gap-2 py-2 border-t border-outline-variant/20">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg text-sm font-label-md transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-primary-container text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-base">dashboard</span>
            ড্যাশবোর্ড ও সেলস
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-lg text-sm font-label-md transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'products'
                ? 'bg-primary-container text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-base">sell</span>
            প্রোডাক্টস ও লিংক
          </button>

          <button
            onClick={() => setActiveTab('referrals')}
            className={`px-4 py-2 rounded-lg text-sm font-label-md transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'referrals'
                ? 'bg-primary-container text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-base">group_add</span>
            রেফারেল প্রোগ্রাম
          </button>

          <button
            onClick={() => setActiveTab('withdrawals')}
            className={`px-4 py-2 rounded-lg text-sm font-label-md transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'withdrawals'
                ? 'bg-primary-container text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-base">account_balance_wallet</span>
            উত্তোলন / ক্যাশআউট
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-lg text-sm font-label-md transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-primary-container text-white shadow-xs'
                : 'text-on-surface-variant hover:bg-surface-container-low'
            }`}
          >
            <span className="material-symbols-outlined text-base">manage_accounts</span>
            প্রোফাইল সেটিংস
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Banner with Greeting & Quick Links */}
        <div className="relative rounded-2xl bg-gradient-to-r from-primary-container via-secondary to-primary-container p-6 sm:p-8 text-white shadow-lg overflow-hidden mb-8">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-xs font-label-sm mb-3">
                <span className="material-symbols-outlined text-sm">verified</span>
                অ্যাফিলিয়েট আইডি: {currentUser.myReferralCode}
              </div>
              <h2 className="font-headline-md text-2xl sm:text-3xl text-white mb-2">
                স্বাগতম, {currentUser.name}!
              </h2>
              <p className="text-white/85 font-body-md max-w-xl">
                আপনার অ্যাফিলিয়েট লিংক শেয়ার করুন এবং প্রতিটি সফল অর্ডারে আকর্ষণীয় কমিশন আয় করুন।
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  setActiveTab('products');
                }}
                className="px-5 py-2.5 bg-white text-primary font-label-md rounded-xl shadow-md hover:bg-white/90 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">link</span>
                লিংক তৈরি করুন
              </button>

              <button
                onClick={() => {
                  setActiveTab('withdrawals');
                }}
                className="px-5 py-2.5 bg-white/20 backdrop-blur-md text-white border border-white/30 font-label-md rounded-xl hover:bg-white/30 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">payments</span>
                উত্তোলন করুন
              </button>
            </div>
          </div>
        </div>

        {/* 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Total Earnings */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-[0px_4px_20px_rgba(79,70,229,0.04)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-label-md text-on-surface-variant">মোট কমিশন আর্নিংস</span>
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">monetization_on</span>
              </div>
            </div>
            <div className="font-headline-md text-2xl text-on-surface mb-1">
              ৳ {currentUser.totalEarnings.toLocaleString('bn-BD')}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-label-sm">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span>গত মাসের তুলনায় +১৮.৪% বৃদ্ধি</span>
            </div>
          </div>

          {/* Card 2: Today's Earnings */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-[0px_4px_20px_rgba(79,70,229,0.04)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-label-md text-on-surface-variant">আজকের কমিশন</span>
              <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">today</span>
              </div>
            </div>
            <div className="font-headline-md text-2xl text-on-surface mb-1">
              ৳ {currentUser.todayEarnings.toLocaleString('bn-BD')}
            </div>
            <div className="text-xs text-on-surface-variant">
              আজ মোট ৩টি অর্ডার থেকে আয়
            </div>
          </div>

          {/* Card 3: Available Balance */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-[0px_4px_20px_rgba(79,70,229,0.04)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-label-md text-on-surface-variant">উত্তোলনযোগ্য ব্যালেন্স</span>
              <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
              </div>
            </div>
            <div className="font-headline-md text-2xl text-emerald-600 mb-1">
              ৳ {currentUser.balance.toLocaleString('bn-BD')}
            </div>
            <div className="text-xs text-on-surface-variant">
              বিকাশ / নগদ / রকেটে ক্যাশআউট করুন
            </div>
          </div>

          {/* Card 4: Total Sales */}
          <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 shadow-[0px_4px_20px_rgba(79,70,229,0.04)]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-label-md text-on-surface-variant">মোট সেলস ভলিউম</span>
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">shopping_cart_checkout</span>
              </div>
            </div>
            <div className="font-headline-md text-2xl text-on-surface mb-1">
              ৳ {currentUser.totalSales.toLocaleString('bn-BD')}
            </div>
            <div className="text-xs text-on-surface-variant">
              মোট ৯২+ সফল অর্ডার ডেলিভারি
            </div>
          </div>
        </div>

        {/* TAB 1: OVERVIEW & SALES */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Share Referral Box */}
            <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-2xl">share</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-base text-on-surface">আপনার ব্যক্তিগত রেফারেল লিংক</h4>
                  <p className="text-xs text-on-surface-variant">
                    বন্ধুদের জয়েন করান এবং তাদের প্রতিটি বিক্রয় থেকে অতিরিক্ত ৫% লাইফটাইম কমিশন লাভ করুন।
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <input
                  type="text"
                  readOnly
                  value={`https://shopcommission.com/register?ref=${currentUser.myReferralCode}`}
                  className="bg-surface-container-low border border-outline-variant px-3 py-2 rounded-lg text-xs font-mono-data text-on-surface flex-grow md:w-64"
                />
                <button
                  onClick={() =>
                    handleCopyLink(
                      `https://shopcommission.com/register?ref=${currentUser.myReferralCode}`,
                      'ref_main'
                    )
                  }
                  className="px-4 py-2 bg-primary-container text-white text-xs font-label-md rounded-lg hover:opacity-90 flex items-center gap-1 shrink-0 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">
                    {copiedLinkId === 'ref_main' ? 'check' : 'content_copy'}
                  </span>
                  <span>{copiedLinkId === 'ref_main' ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                </button>
              </div>
            </div>

            {/* Commission Sales Table */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-hidden shadow-xs">
              <div className="p-5 border-b border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-headline-sm text-lg text-on-surface">সাম্প্রতিক সেলস ও কমিশন লেনদেন</h3>
                  <p className="text-xs text-on-surface-variant">আপনার লিঙ্ক ব্যবহার করে কেনা পণ্যের কমিশন বিবরণ</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setTrxFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-label-sm cursor-pointer ${
                      trxFilter === 'all'
                        ? 'bg-primary-container text-white'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    সকল ({transactions.length})
                  </button>
                  <button
                    onClick={() => setTrxFilter('অনুমোদিত')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-label-sm cursor-pointer ${
                      trxFilter === 'অনুমোদিত'
                        ? 'bg-primary-container text-white'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    অনুমোদিত
                  </button>
                  <button
                    onClick={() => setTrxFilter('পেন্ডিং')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-label-sm cursor-pointer ${
                      trxFilter === 'পেন্ডিং'
                        ? 'bg-primary-container text-white'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    পেন্ডিং
                  </button>
                  <button
                    onClick={() => setTrxFilter('পেইড')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-label-sm cursor-pointer ${
                      trxFilter === 'পেইড'
                        ? 'bg-primary-container text-white'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    পেইড
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-surface-container-low text-on-surface-variant text-xs font-label-md border-b border-outline-variant/40">
                    <tr>
                      <th className="px-5 py-3.5">অর্ডার আইডি</th>
                      <th className="px-5 py-3.5">পণ্য</th>
                      <th className="px-5 py-3.5">মূল্য</th>
                      <th className="px-5 py-3.5">কমিশন হার</th>
                      <th className="px-5 py-3.5">অর্জিত কমিশন</th>
                      <th className="px-5 py-3.5">তারিখ ও সময়</th>
                      <th className="px-5 py-3.5">স্ট্যাটাস</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/20">
                    {filteredTransactions.map((trx) => (
                      <tr key={trx.id} className="hover:bg-surface-container-lowest transition-colors">
                        <td className="px-5 py-4 font-mono-data text-xs font-semibold text-primary">
                          {trx.orderId}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={trx.productImage}
                              alt={trx.productName}
                              className="w-10 h-10 rounded-lg object-cover border border-outline-variant/30"
                            />
                            <div>
                              <div className="font-medium text-on-surface text-xs max-w-xs truncate">
                                {trx.productName}
                              </div>
                              <div className="text-[11px] text-on-surface-variant">ক্রেতা: {trx.customerName}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs font-mono-data">
                          ৳ {trx.orderValue.toLocaleString('bn-BD')}
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-xs font-medium">
                            {trx.commissionRate}%
                          </span>
                        </td>
                        <td className="px-5 py-4 font-bold text-xs text-emerald-600 font-mono-data">
                          + ৳ {trx.commissionAmount.toLocaleString('bn-BD')}
                        </td>
                        <td className="px-5 py-4 text-xs text-on-surface-variant">
                          {trx.date}
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium inline-flex items-center gap-1 ${
                              trx.status === 'অনুমোদিত'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : trx.status === 'পেন্ডিং'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                trx.status === 'অনুমোদিত'
                                  ? 'bg-emerald-500'
                                  : trx.status === 'পেন্ডিং'
                                  ? 'bg-amber-500'
                                  : 'bg-blue-500'
                              }`}
                            />
                            {trx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS & AFFILIATE LINKS */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Search & Filter Header */}
            <div className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/40 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-80">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-lg">search</span>
                </span>
                <input
                  type="text"
                  placeholder="পণ্য খুঁজুন..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                <button
                  onClick={() => setProductCategory('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-label-sm whitespace-nowrap cursor-pointer ${
                    productCategory === 'all'
                      ? 'bg-primary-container text-white'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  সব ক্যাটাগরি
                </button>
                <button
                  onClick={() => setProductCategory('Electronics')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-label-sm whitespace-nowrap cursor-pointer ${
                    productCategory === 'Electronics'
                      ? 'bg-primary-container text-white'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  ইলেকট্রনিক্স
                </button>
                <button
                  onClick={() => setProductCategory('Beauty')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-label-sm whitespace-nowrap cursor-pointer ${
                    productCategory === 'Beauty'
                      ? 'bg-primary-container text-white'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  বিউটি ও রূপচর্চা
                </button>
                <button
                  onClick={() => setProductCategory('Fashion')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-label-sm whitespace-nowrap cursor-pointer ${
                    productCategory === 'Fashion'
                      ? 'bg-primary-container text-white'
                      : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
                  }`}
                >
                  ফ্যাশন
                </button>
              </div>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((prod) => {
                const affiliateLink = `https://shopcommission.com/item/${prod.id}?ref=${currentUser.myReferralCode}`;
                const isCopied = copiedLinkId === prod.id;

                return (
                  <div
                    key={prod.id}
                    className="bg-surface-container-lowest rounded-xl border border-outline-variant/40 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-48 overflow-hidden bg-surface-container-low">
                        <img
                          src={prod.image}
                          alt={prod.titleBn}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 bg-secondary text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                          {prod.commissionPercent}% কমিশন
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px] text-amber-400">star</span>
                          {prod.rating} ({prod.salesCount})
                        </div>
                      </div>

                      <div className="p-4">
                        <span className="text-[11px] text-primary font-medium">{prod.categoryBn}</span>
                        <h4 className="font-headline-sm text-sm text-on-surface mt-1 line-clamp-2">
                          {prod.titleBn}
                        </h4>

                        <div className="flex items-baseline gap-2 mt-2">
                          <span className="text-base font-bold text-on-surface font-mono-data">
                            ৳ {prod.price.toLocaleString('bn-BD')}
                          </span>
                          <span className="text-xs text-outline line-through font-mono-data">
                            ৳ {prod.originalPrice.toLocaleString('bn-BD')}
                          </span>
                        </div>

                        <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200/60 rounded-lg flex items-center justify-between">
                          <span className="text-xs text-emerald-800 font-label-md">প্রতি বিক্রয়ে আপনার আয়:</span>
                          <span className="text-sm font-bold text-emerald-600 font-mono-data">
                            + ৳ {prod.commissionAmount.toLocaleString('bn-BD')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 pt-0 space-y-2">
                      <button
                        onClick={() => handleCopyLink(affiliateLink, prod.id)}
                        className={`w-full py-2.5 rounded-lg text-xs font-label-md flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          isCopied
                            ? 'bg-emerald-600 text-white'
                            : 'bg-primary-container text-white hover:bg-primary-container/90'
                        }`}
                      >
                        <span className="material-symbols-outlined text-sm">
                          {isCopied ? 'check' : 'link'}
                        </span>
                        <span>{isCopied ? 'লিংক কপি হয়েছে!' : 'অ্যাফিলিয়েট লিংক কপি করুন'}</span>
                      </button>

                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedProductForLink(prod)}
                          className="flex-1 py-2 bg-surface-container-low hover:bg-surface-container text-on-surface text-xs font-medium rounded-lg border border-outline-variant/60 flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-sm">qr_code</span>
                          শেয়ার টুলস
                        </button>
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(
                            `দারুণ অফার! ${prod.titleBn} মাত্র ৳${prod.price} টাকায় কিনুন: ${affiliateLink}`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-200 flex items-center justify-center"
                          title="WhatsApp এ পাঠান"
                        >
                          WA
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: REFERRAL PROGRAM */}
        {activeTab === 'referrals' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left 2 Cols: Referral Info */}
              <div className="md:col-span-2 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 space-y-6">
                <div>
                  <h3 className="font-headline-sm text-lg text-on-surface">ShopCommission রেফারেল আর্নিং প্রোগ্রাম</h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    আপনার রেফারেল কোড দিয়ে অন্য মার্কেটার বা বন্ধুদের রেজিস্ট্রেশন করান। তাদের আয়কৃত মোট কমিশনের ৫% আপনি
                    লাইফটাইম বোনাস হিসেবে পাবেন!
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-on-surface-variant block mb-1">আপনার ইউনিক রেফারেল কোড:</span>
                    <span className="text-2xl font-mono-data font-bold text-primary tracking-wider">
                      {currentUser.myReferralCode}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyLink(currentUser.myReferralCode, 'code_only')}
                    className="px-4 py-2 bg-primary-container text-white text-xs font-label-md rounded-lg shadow-sm hover:opacity-90 flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">
                      {copiedLinkId === 'code_only' ? 'check' : 'content_copy'}
                    </span>
                    <span>{copiedLinkId === 'code_only' ? 'কপি হয়েছে' : 'কোড কপি করুন'}</span>
                  </button>
                </div>

                {/* Referred Members Table */}
                <div>
                  <h4 className="font-headline-sm text-sm text-on-surface mb-3">
                    আপনার রেফারেল টিম ({referrals.length} জন সক্রিয় পার্টনার)
                  </h4>
                  <div className="overflow-x-auto border border-outline-variant/30 rounded-xl">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-surface-container-low text-on-surface-variant font-label-md">
                        <tr>
                          <th className="px-4 py-3">নাম</th>
                          <th className="px-4 py-3">ফোন নম্বর</th>
                          <th className="px-4 py-3">জয়েন তারিখ</th>
                          <th className="px-4 py-3">অর্ডার সংখ্যা</th>
                          <th className="px-4 py-3">আপনার বোনাস আয়</th>
                          <th className="px-4 py-3">স্ট্যাটাস</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/20">
                        {referrals.map((ref) => (
                          <tr key={ref.id} className="hover:bg-surface-container-low">
                            <td className="px-4 py-3 font-medium text-on-surface">{ref.name}</td>
                            <td className="px-4 py-3 font-mono-data text-outline">{ref.phone}</td>
                            <td className="px-4 py-3 text-on-surface-variant">{ref.joinDate}</td>
                            <td className="px-4 py-3 font-mono-data">{ref.ordersCount} টি</td>
                            <td className="px-4 py-3 font-bold text-emerald-600 font-mono-data">
                              + ৳ {ref.earnedBonus.toLocaleString('bn-BD')}
                            </td>
                            <td className="px-4 py-3">
                              <span className="px-2 py-0.5 rounded-full text-[11px] bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {ref.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Right Col: Tier Progression */}
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">military_tech</span>
                </div>
                <h4 className="font-headline-sm text-base text-on-surface">পার্টনার লেভেল: গোল্ড</h4>
                <p className="text-xs text-on-surface-variant">
                  আপনি পরবর্তী প্ল্যাটিনাম লেভেলে উন্নীত হতে আর মাত্র ৮টি সফল ডেলিভারি প্রয়োজন।
                </p>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs font-medium">
                    <span>অগ্রগতি</span>
                    <span>৭২%</span>
                  </div>
                  <div className="w-full bg-surface-container-low rounded-full h-2 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full w-[72%]" />
                  </div>
                </div>

                <div className="p-3 bg-surface-container-low rounded-lg text-xs text-on-surface-variant space-y-2">
                  <div className="font-bold text-on-surface">লেভেলের সুবিধাসমূহ:</div>
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>এক্সক্লুসিভ ২০% পর্যন্ত কমিশন</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>২৪ ঘণ্টার মধ্যে দ্রুত উইথড্রয়াল</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    <span>ডেডিকেটেড অ্যাকাউন্ট ম্যানেজার</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: WITHDRAWALS */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Col: Request Withdrawal Form */}
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 space-y-5">
                <div>
                  <h3 className="font-headline-sm text-lg text-on-surface">টাকা উত্তোলন (Cashout)</h3>
                  <p className="text-xs text-on-surface-variant">
                    আপনার অর্জিত ব্যালেন্স নিরাপদে ব্যাংক বা মোবাইল ব্যাংকিংয়ে নিন।
                  </p>
                </div>

                {withdrawSuccessMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">check_circle</span>
                    <span>{withdrawSuccessMsg}</span>
                  </div>
                )}

                <div className="p-4 bg-surface-container-low rounded-xl flex items-center justify-between">
                  <span className="text-xs font-label-md text-on-surface-variant">উত্তোলনযোগ্য ব্যালেন্স:</span>
                  <span className="text-lg font-bold text-primary font-mono-data">
                    ৳ {currentUser.balance.toLocaleString('bn-BD')}
                  </span>
                </div>

                <form onSubmit={handleWithdrawSubmit} className="space-y-4">
                  {/* Select Method */}
                  <div>
                    <label className="block text-xs font-label-md text-on-surface-variant mb-1.5">
                      পেমেন্ট মেথড
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['bKash', 'Nagad', 'Rocket', 'Bank Transfer'] as const).map((m) => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setWithdrawMethod(m)}
                          className={`p-2.5 rounded-lg text-xs font-label-md border transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                            withdrawMethod === m
                              ? 'bg-primary-container text-white border-primary-container'
                              : 'bg-surface-container-low text-on-surface border-outline-variant/60 hover:bg-surface-container'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm">
                            {m === 'Bank Transfer' ? 'account_balance' : 'smartphone'}
                          </span>
                          <span>{m}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Account Number */}
                  <div>
                    <label className="block text-xs font-label-md text-on-surface-variant mb-1.5">
                      {withdrawMethod === 'Bank Transfer' ? 'ব্যাংক একাউন্ট নম্বর' : `${withdrawMethod} নম্বর`}
                    </label>
                    <input
                      type="text"
                      value={withdrawAccount}
                      onChange={(e) => setWithdrawAccount(e.target.value)}
                      placeholder="017xxxxxxxx"
                      className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container"
                      required
                    />
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-xs font-label-md text-on-surface-variant mb-1.5">
                      উত্তোলনের পরিমাণ (৳)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-xs font-bold text-outline">
                        ৳
                      </span>
                      <input
                        type="number"
                        min="500"
                        max={currentUser.balance}
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="ন্যূনতম ৫০০ টাকা"
                        className="w-full pl-8 pr-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-xs font-mono-data focus:outline-none focus:ring-2 focus:ring-primary-container"
                        required
                      />
                    </div>
                    <span className="text-[11px] text-outline mt-1 block">ন্যূনতম ৫০০ টাকা হতে হবে।</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isWithdrawing || currentUser.balance < 500}
                    className="w-full py-3 bg-gradient-to-r from-primary-container to-secondary text-white font-label-md rounded-lg shadow-md hover:opacity-95 transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isWithdrawing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>প্রক্রিয়াধীন...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">send</span>
                        <span>উত্তোলন অনুরোধ পাঠান</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Right 2 Cols: Withdrawal History */}
              <div className="md:col-span-2 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-headline-sm text-lg text-on-surface">উত্তোলনের হিস্ট্রি ও রেকর্ড</h3>
                  <span className="text-xs text-on-surface-variant">মোট পরিশোধিত: ৳ ২৫,৫০০</span>
                </div>

                <div className="overflow-x-auto border border-outline-variant/30 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-surface-container-low text-on-surface-variant font-label-md">
                      <tr>
                        <th className="px-4 py-3">ট্রানজেকশন আইডি</th>
                        <th className="px-4 py-3">মেথড ও নম্বর</th>
                        <th className="px-4 py-3">পরিমাণ</th>
                        <th className="px-4 py-3">তারিখ</th>
                        <th className="px-4 py-3">স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      {withdrawals.map((w) => (
                        <tr key={w.id} className="hover:bg-surface-container-low">
                          <td className="px-4 py-3 font-mono-data font-semibold text-primary">{w.trxId || w.id}</td>
                          <td className="px-4 py-3">
                            <span className="font-medium text-on-surface">{w.method}</span>
                            <span className="text-outline block text-[11px] font-mono-data">{w.accountNumber}</span>
                          </td>
                          <td className="px-4 py-3 font-bold text-on-surface font-mono-data">
                            ৳ {w.amount.toLocaleString('bn-BD')}
                          </td>
                          <td className="px-4 py-3 text-on-surface-variant">{w.date}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                                w.status === 'সম্পন্ন'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : w.status === 'প্রক্রিয়াধীন'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-red-50 text-red-700 border border-red-200'
                              }`}
                            >
                              {w.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/40 space-y-6">
            <div>
              <h3 className="font-headline-sm text-lg text-on-surface">প্রোফাইল ও অ্যাকাউন্ট সেটিংস</h3>
              <p className="text-xs text-on-surface-variant">আপনার ব্যক্তিগত তথ্য এবং যোগাযোগের নম্বর আপডেট করুন</p>
            </div>

            {profileSaved && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-base">check_circle</span>
                <span>প্রোফাইল তথ্য সফলভাবে সংরক্ষিত হয়েছে!</span>
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-label-md text-on-surface-variant mb-1.5">পূর্ণ নাম</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-sm font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-label-md text-on-surface-variant mb-1.5">ইমেইল ঠিকানা</label>
                <input
                  type="email"
                  value={currentUser.email}
                  readOnly
                  className="w-full px-4 py-2.5 bg-surface-container border border-outline-variant/60 rounded-lg text-sm font-body-md text-outline cursor-not-allowed"
                />
                <span className="text-[11px] text-outline mt-1 block">ইমেইল পরিবর্তন করতে সাপোর্টে যোগাযোগ করুন।</span>
              </div>

              <div>
                <label className="block text-xs font-label-md text-on-surface-variant mb-1.5">মোবাইল নম্বর</label>
                <input
                  type="text"
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-sm font-body-md focus:outline-none focus:ring-2 focus:ring-primary-container"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-primary-container text-white font-label-md text-sm rounded-lg hover:opacity-90 transition-all cursor-pointer"
                >
                  পরিবর্তন সংরক্ষণ করুন
                </button>
              </div>
            </form>

            <div className="pt-6 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h5 className="font-label-md text-sm text-on-surface">আসল মকআপ স্ক্রিন প্রিভিউ</h5>
                <p className="text-xs text-on-surface-variant">লগইন বা রেজিস্ট্রেশন স্ক্রিনের ডিজাইন পুনরায় দেখতে চান?</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onSwitchToLoginScreen}
                  className="px-3 py-1.5 bg-surface-container-low hover:bg-surface-container text-xs font-label-md rounded-lg border border-outline-variant cursor-pointer"
                >
                  লগইন স্ক্রিন দেখুন
                </button>
                <button
                  type="button"
                  onClick={onSwitchToRegisterScreen}
                  className="px-3 py-1.5 bg-surface-container-low hover:bg-surface-container text-xs font-label-md rounded-lg border border-outline-variant cursor-pointer"
                >
                  রেজিস্টার স্ক্রিন দেখুন
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Share / QR Modal */}
      {selectedProductForLink && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-sm p-6 shadow-2xl border border-outline-variant/40 animate-in fade-in zoom-in-95 duration-200 text-center">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-headline-sm text-base text-on-surface">অ্যাফিলিয়েট শেয়ার টুলস</h4>
              <button
                onClick={() => setSelectedProductForLink(null)}
                className="text-outline hover:text-on-surface p-1 rounded-full cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <img
              src={selectedProductForLink.image}
              alt={selectedProductForLink.titleBn}
              className="w-24 h-24 object-cover rounded-xl mx-auto mb-3 border border-outline-variant/40"
            />
            <h5 className="font-headline-sm text-sm text-on-surface line-clamp-1 mb-1">
              {selectedProductForLink.titleBn}
            </h5>
            <p className="text-xs text-emerald-600 font-bold mb-4">
              আপনার কমিশন: ৳ {selectedProductForLink.commissionAmount}
            </p>

            <div className="p-4 bg-white border border-outline-variant/40 rounded-xl inline-block mb-4 shadow-inner">
              {/* Clean simulated QR code */}
              <div className="w-32 h-32 bg-indigo-50 border-2 border-indigo-200 rounded-lg p-2 flex flex-col items-center justify-center">
                <span className="material-symbols-outlined text-4xl text-primary mb-1">qr_code_2</span>
                <span className="text-[10px] text-primary font-mono font-bold">{currentUser.myReferralCode}</span>
                <span className="text-[9px] text-on-surface-variant">স্ক্যান করে কিনুন</span>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() =>
                  handleCopyLink(
                    `https://shopcommission.com/item/${selectedProductForLink.id}?ref=${currentUser.myReferralCode}`,
                    'modal_link'
                  )
                }
                className="w-full py-2.5 bg-primary-container text-white font-label-md text-xs rounded-lg hover:opacity-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-sm">
                  {copiedLinkId === 'modal_link' ? 'check' : 'content_copy'}
                </span>
                <span>{copiedLinkId === 'modal_link' ? 'লিংক কপি হয়েছে!' : 'লিংক কপি করুন'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
