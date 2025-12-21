// lib/config/categoryIcons.tsx
// ==========================================
import { 
  Briefcase, Home, Users, Heart, BookOpen, DollarSign,
  Gamepad2, Palette, Car, Plane, Coffee, Music,
  Smartphone, Laptop, Wrench, ShoppingBag, Film, Dumbbell
} from 'lucide-react';

export const CATEGORY_ICONS = {
  briefcase: Briefcase,
  home: Home,
  users: Users,
  heart: Heart,
  book: BookOpen,
  dollar: DollarSign,
  gamepad: Gamepad2,
  palette: Palette,
  car: Car,
  plane: Plane,
  coffee: Coffee,
  music: Music,
  smartphone: Smartphone,
  laptop: Laptop,
  wrench: Wrench,
  shopping: ShoppingBag,
  film: Film,
  dumbbell: Dumbbell,
};

export type CategoryIconKey = keyof typeof CATEGORY_ICONS;

export const getCategoryIcon = (iconKey: string) => {
  return CATEGORY_ICONS[iconKey as CategoryIconKey] || Briefcase;
};