export type SocialPlatform =
  | "email"
  | "phone"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "x"
  | "youtube"
  | "linkedin"
  | "whatsapp";

/** أيقونات بسيطة (خطوط) لكل منصة - بنفس روح الأيقونات التانية في المشروع */
export default function SocialIcon({ platform }: { platform: SocialPlatform }) {
  const common = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none" as const,
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (platform) {
    case "email":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );
    case "phone":
      return (
        <svg {...common}>
          <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8Z" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M15 8.5h-1.5A2 2 0 0 0 11.5 10.5V12.5H9.5V15.5H11.5V21H14.5V15.5H16.5L17 12.5H14.5V11A1 1 0 0 1 15.5 10H17V8.5Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          <path d="M14 3v10.5a3.5 3.5 0 1 1-3-3.46" />
          <path d="M14 3a5.5 5.5 0 0 0 5 5.3V12A8.6 8.6 0 0 1 14 9.5" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M5 5l14 14M19 5 5 19" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <rect x="2.5" y="6" width="19" height="12" rx="4" />
          <path d="M10.5 9.7v4.6l4-2.3Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="3" />
          <path d="M7.5 10.5v6" />
          <circle cx="7.5" cy="7.5" r="0.9" fill="currentColor" stroke="none" />
          <path d="M11.5 16.5v-4M11.5 12.5c0-1.1.9-2 2-2s2 .9 2 2v4" />
        </svg>
      );
    case "whatsapp":
      return (
        <svg {...common}>
          <path d="M21 11.5a8.5 8.5 0 0 1-12.4 7.6L4 20l1-4.4A8.5 8.5 0 1 1 21 11.5Z" />
          <path d="M8.7 9.6c.2-.5.7-.5 1-.1l.6.9c.2.3.2.5 0 .8-.3.3-.5.5-.3.9.3.5 1.1 1.4 1.7 1.7.4.2.6 0 .9-.3.3-.2.5-.2.8 0l.9.6c.4.3.4.8 0 1-1.3.7-2.9.3-4.2-1-1.3-1.3-1.7-2.9-1-4.2Z" />
        </svg>
      );
  }
}
