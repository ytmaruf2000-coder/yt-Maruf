import React, { useState } from 'react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const [topic, setTopic] = useState('পেমেন্ট ও উইথড্র');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setIsSent(true);
    setTimeout(() => {
      setIsSent(false);
      setMessage('');
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-surface-container-lowest rounded-2xl w-full max-w-md p-6 shadow-2xl border border-outline-variant/40 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">support_agent</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface">গ্রাহক সেবা ও সহায়তা</h3>
          </div>
          <button
            onClick={onClose}
            className="text-outline hover:text-on-surface p-1 rounded-full hover:bg-surface-container cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {isSent ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-2xl">check</span>
            </div>
            <h4 className="font-headline-sm text-emerald-800">আপনার বার্তা সফলভাবে পাঠানো হয়েছে!</h4>
            <p className="font-body-sm text-on-surface-variant">আমাদের সাপোর্ট এক্সিকিউটিভ দ্রুত আপনার সাথে যোগাযোগ করবেন।</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Quick channels */}
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://wa.me/8801712345678"
                target="_blank"
                rel="noreferrer"
                className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 hover:bg-emerald-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">
                  WA
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-emerald-900">হোয়াটসঅ্যাপ সাপোর্ট</div>
                  <div className="text-[11px] text-emerald-700">২৪/৭ লাইভ চ্যাট</div>
                </div>
              </a>

              <a
                href="tel:16216"
                className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center gap-2.5 hover:bg-indigo-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">call</span>
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-indigo-900">হটলাইন কল</div>
                  <div className="text-[11px] text-indigo-700">16216 (টোল ফ্রি)</div>
                </div>
              </a>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block font-label-md text-on-surface-variant mb-1">সমস্যার বিষয়</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                >
                  <option value="পেমেন্ট ও উইথড্র">পেমেন্ট ও উইথড্র সংক্রান্ত</option>
                  <option value="কমিশন হিসাব">কমিশন হিসাব ও ট্র্যাকিং</option>
                  <option value="লগইন বা একাউন্ট">লগইন বা একাউন্ট সমস্যা</option>
                  <option value="অন্যান্য">অন্যান্য অনুসন্ধান</option>
                </select>
              </div>

              <div>
                <label className="block font-label-md text-on-surface-variant mb-1">আপনার সমস্যা বিস্তারিত লিখুন</label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="আমরা কিভাবে আপনাকে সাহায্য করতে পারি?"
                  className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-primary-container to-secondary text-white font-label-md rounded-lg shadow-md hover:opacity-95 transition-all cursor-pointer"
              >
                মেসেজ পাঠান
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
