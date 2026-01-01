// lib/constants/category-constants.ts
// Shared constants for category-related components
// ==========================================
import {
  Briefcase, Home, Users, Heart, BookOpen, DollarSign,
  Gamepad2, Palette, Car, Plane, Coffee, Music, Smartphone,
  Laptop, Wrench, ShoppingBag, Film, Dumbbell, LucideIcon
} from 'lucide-react';

export const CATEGORY_COLORS: string[] = [
  '#EF4444', '#F59E0B', '#10B981', '#3B82F6',
  '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'
];

export type CategoryColor = string;

export interface CategoryIconOption {
  key: string;
  Icon: LucideIcon;
}

export const CATEGORY_ICONS: CategoryIconOption[] = [
  { key: 'briefcase', Icon: Briefcase },
  { key: 'home', Icon: Home },
  { key: 'users', Icon: Users },
  { key: 'heart', Icon: Heart },
  { key: 'book', Icon: BookOpen },
  { key: 'dollar', Icon: DollarSign },
  { key: 'gamepad', Icon: Gamepad2 },
  { key: 'palette', Icon: Palette },
  { key: 'car', Icon: Car },
  { key: 'plane', Icon: Plane },
  { key: 'coffee', Icon: Coffee },
  { key: 'music', Icon: Music },
  { key: 'smartphone', Icon: Smartphone },
  { key: 'laptop', Icon: Laptop },
  { key: 'wrench', Icon: Wrench },
  { key: 'shopping', Icon: ShoppingBag },
  { key: 'film', Icon: Film },
  { key: 'dumbbell', Icon: Dumbbell },
];

export const DEFAULT_CATEGORY_COLOR = CATEGORY_COLORS[0];
export const DEFAULT_CATEGORY_ICON = CATEGORY_ICONS[0].key;
