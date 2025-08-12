import { Landmark, TrendingUp, Newspaper } from "lucide-react";

export type StateConfig = {
  id: string;
  nameHi: string;
  nameEn: string;
  icon: 'Landmark' | 'TrendingUp' | 'Newspaper';
  color: string;
};

export const states: StateConfig[] = [
  { id: 'chhattisgarh', nameHi: 'छत्तीसगढ़', nameEn: 'Chhattisgarh', icon: 'Landmark', color: '#8FD14F' },
  { id: 'maharashtra', nameHi: 'महाराष्ट्र', nameEn: 'Maharashtra', icon: 'TrendingUp', color: '#F0A500' },
  { id: 'uttar-pradesh', nameHi: 'उत्तर प्रदेश', nameEn: 'Uttar Pradesh', icon: 'Newspaper', color: '#C88639' },
  { id: 'delhi', nameHi: 'दिल्ली', nameEn: 'Delhi', icon: 'Landmark', color: '#9A5C1A' },
];

export function getIcon(name: StateConfig['icon']) {
  switch (name) {
    case 'Landmark': return Landmark;
    case 'TrendingUp': return TrendingUp;
    default: return Newspaper;
  }
}

