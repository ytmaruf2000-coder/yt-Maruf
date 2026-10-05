export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  myReferralCode: string;
  usedReferralCode?: string;
  balance: number;
  totalEarnings: number;
  todayEarnings: number;
  totalSales: number;
  tier: 'ব্রোঞ্জ' | 'সিলভার' | 'গোল্ড' | 'প্ল্যাটিনাম';
  joinedDate: string;
}

export interface CommissionTransaction {
  id: string;
  orderId: string;
  productName: string;
  productImage: string;
  category: string;
  orderValue: number;
  commissionRate: number;
  commissionAmount: number;
  date: string;
  status: 'অনুমোদিত' | 'পেন্ডিং' | 'পেইড';
  customerName: string;
}

export interface ProductItem {
  id: string;
  title: string;
  titleBn: string;
  category: string;
  categoryBn: string;
  price: number;
  originalPrice: number;
  commissionPercent: number;
  commissionAmount: number;
  image: string;
  rating: number;
  salesCount: number;
  inStock: boolean;
}

export interface WithdrawalRequest {
  id: string;
  method: 'bKash' | 'Nagad' | 'Rocket' | 'Bank Transfer';
  accountNumber: string;
  amount: number;
  date: string;
  status: 'সম্পন্ন' | 'প্রক্রিয়াধীন' | 'বাতিল';
  trxId?: string;
}

export interface ReferralMember {
  id: string;
  name: string;
  phone: string;
  joinDate: string;
  ordersCount: number;
  earnedBonus: number;
  status: 'অ্যাক্টিভ' | 'নতুন';
}
