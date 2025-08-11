export type Locale = "hi" | "en";

export type StateMeta = {
  id: string;
  hi: string;
  en: string;
  emoji: string;
  icon?: string;
  priority?: number;
};

export const STATES: StateMeta[] = [
  { id: "uttar-pradesh", hi: "उत्तर प्रदेश", en: "Uttar Pradesh", emoji: "🛕", icon: "Landmark", priority: 95 },
  { id: "tamil-nadu", hi: "तमिलनाडु", en: "Tamil Nadu", emoji: "🚗", icon: "Car", priority: 92 },
  { id: "chhattisgarh", hi: "छत्तीसगढ़", en: "Chhattisgarh", emoji: "🌾", icon: "Factory", priority: 99 },
  { id: "telangana", hi: "तेलंगाना", en: "Telangana", emoji: "💻", icon: "Cpu", priority: 90 },
  { id: "andhra-pradesh", hi: "आंध्र प्रदेश", en: "Andhra Pradesh", emoji: "🌶️", icon: "Pepper", priority: 80 },
  { id: "arunachal-pradesh", hi: "अरुणाचल प्रदेश", en: "Arunachal Pradesh", emoji: "🏞️", icon: "Leaf", priority: 60 },
  { id: "assam", hi: "असम", en: "Assam", emoji: "🍵", icon: "Coffee", priority: 70 },
  { id: "bihar", hi: "बिहार", en: "Bihar", emoji: "🕌", icon: "Landmark", priority: 75 },
  { id: "goa", hi: "गोवा", en: "Goa", emoji: "🏖️", icon: "Umbrella", priority: 65 },
  { id: "gujarat", hi: "गुजरात", en: "Gujarat", emoji: "💎", icon: "Gem", priority: 93 },
  { id: "haryana", hi: "हरियाणा", en: "Haryana", emoji: "🌾", icon: "Wheat", priority: 78 },
  { id: "himachal-pradesh", hi: "हिमाचल प्रदेश", en: "Himachal Pradesh", emoji: "🍎", icon: "Apple", priority: 72 },
  { id: "jharkhand", hi: "झारखण्ड", en: "Jharkhand", emoji: "⛏️", icon: "Hammer", priority: 76 },
  { id: "karnataka", hi: "कर्नाटक", en: "Karnataka", emoji: "☕", icon: "Coffee", priority: 88 },
  { id: "kerala", hi: "केरल", en: "Kerala", emoji: "🏝️", icon: "Ship", priority: 74 },
  { id: "madhya-pradesh", hi: "मध्य प्रदेश", en: "Madhya Pradesh", emoji: "🐅", icon: "Mountain", priority: 82 },
  { id: "maharashtra", hi: "महाराष्ट्र", en: "Maharashtra", emoji: "🏙️", icon: "Building2", priority: 97 },
  { id: "manipur", hi: "मणिपुर", en: "Manipur", emoji: "⚽", icon: "Shield", priority: 55 },
  { id: "meghalaya", hi: "मेघालय", en: "Meghalaya", emoji: "☁️", icon: "CloudRain", priority: 58 },
  { id: "mizoram", hi: "मिजोरम", en: "Mizoram", emoji: "🏞️", icon: "Trees", priority: 54 },
  { id: "nagaland", hi: "नगालैंड", en: "Nagaland", emoji: "🎸", icon: "Music", priority: 56 },
  { id: "odisha", hi: "ओडिशा", en: "Odisha", emoji: "🏛️", icon: "Landmark", priority: 84 },
  { id: "punjab", hi: "पंजाब", en: "Punjab", emoji: "🌾", icon: "Wheat", priority: 86 },
  { id: "rajasthan", hi: "राजस्थान", en: "Rajasthan", emoji: "🏜️", icon: "Castle", priority: 85 },
  { id: "sikkim", hi: "सिक्किम", en: "Sikkim", emoji: "🏔️", icon: "Mountain", priority: 57 },
  { id: "tripura", hi: "त्रिपुरा", en: "Tripura", emoji: "🍍", icon: "Apple", priority: 53 },
  { id: "uttarakhand", hi: "उत्तराखंड", en: "Uttarakhand", emoji: "🌲", icon: "Mountain", priority: 73 },
  { id: "west-bengal", hi: "पश्चिम बंगाल", en: "West Bengal", emoji: "🕌", icon: "Landmark", priority: 91 }
];

export function pickDisplayStates(
  newsCounts: Record<string, number>,
  limit = 4
): StateMeta[] {
  const withNews = STATES
    .map(s => ({ s, n: newsCounts[s.id] || 0 }))
    .filter(x => x.n > 0)
    .sort((a, b) => b.n - a.n)
    .map(x => x.s);

  const chosen = [...withNews];
  if (chosen.length < limit) {
    const byPriority = STATES
      .filter(s => !chosen.some(c => c.id === s.id))
      .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    chosen.push(...byPriority.slice(0, limit - chosen.length));
  }
  return chosen.slice(0, limit);
}

