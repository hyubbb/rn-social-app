import { User as SupabaseUserType } from "@supabase/supabase-js";
import { ImagePickerAsset } from "expo-image-picker";

type FontWeight =
  | "100"
  | "200"
  | "300"
  | "400"
  | "500"
  | "600"
  | "700"
  | "800"
  | "900";

type ThemeFonts = {
  medium: FontWeight;
  semiBold: FontWeight;
  bold: FontWeight;
  extraBold: FontWeight;
};

type ThemeRadius = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
};

type ThemeColors = {
  primary: string;
  primaryDark: string;
  dark: string;
  darkLight: string;
  gray: string;
  text: string;
  textLight: string;
  textDark: string;
  rose: string;
  roseLight: string;
};

export type Theme = {
  colors: ThemeColors;
  fonts: ThemeFonts;
  radius: ThemeRadius;
};

export type UserType = {
  id: string;
  name: string;
  email?: string | "";
  address?: string | "";
  image?: string | null;
  created_at?: string | "";
  phoneNumber?: string | "";
  bio?: string | "";
};

export type SupabaseUser = SupabaseUserType;

export type PostType = {
  file: ImagePickerAsset;
  body: string;
  userId: string;
  created_at?: string;
  id?: string;
};
