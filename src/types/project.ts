export interface IModernProject {
  _id?: string;
  name: string;
  slug: string; // Clean SEO-friendly URLs: /projects/zlocker
  tagline: string; // Crisp 1-2 sentence summary for project cards
  category:
    | "Full-Stack"
    | "Frontend"
    | "Backend"
    | "Security & Systems"
    | "AI & Realtime";
  featured: boolean; // Pinned to the top of your homepage
  status: "Completed" | "Production" | "Active";

  // Visual Media
  thumbnail: string; // Main hero / card image
  gallery?: string[]; // Screenshots (dashboard, mobile, modal views)

  // Tech & Architecture
  technologies:
    | {
        frontend?: string[];
        backend?: string[];
        database?: string[];
        devops?: string[];
      }
    | string[]; // Supports both categorized tags or flat array

  // Fast Recruiter Scan Badges
  keyHighlights: string[]; // 3-4 bullet points of real engineering achievements
  metrics?: { label: string; value: string }[]; // e.g. [{ label: "Encryption", value: "AES-256-GCM" }]

  // Links
  links: {
    live: string;
    githubClient?: string;
    githubServer?: string;
    apiDocs?: string;
    videoDemo?: string;
  };

  // Deep Dive Case Study (for /projects/[slug])
  caseStudy?: {
    theProblem: string;
    architectureOverview: string;
    technicalChallenges: string[];
    futureRoadmap?: string[];
  };

  createdAt?: string;
  updatedAt?: string;
}

export type TProject = IModernProject;

