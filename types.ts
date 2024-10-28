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
  user_id: string;
  created_at?: string;
  id?: string;
};

export type PostLike = {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
};

export type PostWithUser = {
  body?: string;
  created_at?: string;
  file?: ImagePickerAsset | string | null;
  id?: string;
  user?: UserType;
  user_id?: string;
  postLikes?: PostLike[];
};

export type PostWithUserAndComments = PostWithUser & {
  comments: CommentType[];
  commentCount: { count: number }[];
};

export type CommentType = {
  id?: string;
  post_id?: string;
  user_id?: string;
  text?: string;
  created_at?: string;
  user: UserType;
};

export type NotificationType = {
  id: string;
  data: {
    post_id: string;
    comment_id: string;
  };
  receiver_id: string;
  sender_id: string;
  title: string;
  created_at: string;
};

export type ChatUserType = {
  id: string;
  user_id: string;
  room_id: string;
  created_at: string;
  last_read_at: string;
};

export type MessageListType = {
  id: string;
  other_user_id: string;
  room_id: string;
  user_id: string;
  last_read_at: string;
  created_at: string;
  users: UserType;
};

// 채팅 메시지 타입
export type MessageType = {
  id: string;
  user_id: string;
  room_id: string;
  content: string;
  type: "text" | "image";
  created_at: string;
  is_read: boolean;
};

// 채팅 메시지 타입
export type MessageTypeWithUser = MessageType & {
  user: UserType;
};
