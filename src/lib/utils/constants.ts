export const APP_NAME = "Seedance";
export const APP_DESCRIPTION =
  "Your all-in-one AI director for video, image, avatar, voice, and music.";

export const CREDITS = {
  FREE_TRIAL: 20,
  PLANS: {
    LITE: { credits: 200, price: 20, resolution: "720P" },
    PRO: { credits: 600, price: 25, resolution: "1080P" },
    PREMIUM: { credits: 3000, price: 119, resolution: "1080P" },
  },
};

export const MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB
export const MAX_PROMPT_LENGTH = 2000;

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  badge?: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Agent", href: "/agent", icon: "Bot" },
  { label: "AI Video", href: "/video", icon: "Video" },
  { label: "AI Image", href: "/image", icon: "Image" },
  { label: "AI Audio", href: "/audio", icon: "Music" },
  { label: "Canvas", href: "/canvas", icon: "Pen" },
  { label: "Studio", href: "/studio", icon: "Layout" },
  { label: "Viral Studio", href: "/viral-studio", icon: "TrendingUp", badge: "New" },
  { label: "Avatar", href: "/avatar", icon: "User" },
  { label: "Translator", href: "/translator", icon: "Languages" },
  { label: "Assets", href: "/assets", icon: "FolderOpen" },
  { label: "Explore", href: "/explore", icon: "Compass" },
];
