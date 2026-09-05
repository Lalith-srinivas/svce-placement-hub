export interface StudentPersonalDetails {
  full_name: string;
  register_number: string;
  college_email: string;
  personal_email: string;
  phone_number: string;
  branch: string;
  year: string;
  section: string;
  cgpa: number | string;
  active_backlogs: number | string;
}

export interface StudentLinks {
  github_url: string;
  linkedin_url: string;
  portfolio_url: string;
  leetcode_url: string;
  hackerrank_url: string;
}

export interface ResumeData {
  file_name: string;
  file_url: string;
  file_size: number;
  uploaded_at: string;
}

export interface StudentSkill {
  id?: number | string;
  category: string;
  skill_name: string;
  proficiency: number; // 1-10
}

export interface StudentProject {
  id?: string;
  name: string;
  description: string;
  tech_stack: string[];
  github_url: string;
  demo_url: string;
}

export interface StudentCertification {
  id?: string;
  name: string;
  organization: string;
  year: string;
  credential_url: string;
}

export interface StudentPreferences {
  preferred_role: string;
  dream_companies: string[];
  preferred_locations: string[];
  expected_package: string;
  willing_to_relocate: boolean;
}

export interface CompleteStudentProfile {
  id: string; // user id
  personal: StudentPersonalDetails;
  links: StudentLinks;
  resume: ResumeData | null;
  skills: StudentSkill[];
  projects: StudentProject[];
  certifications: StudentCertification[];
  preferences: StudentPreferences;
  created_at?: string;
  updated_at?: string;
}

export const SKILL_CATEGORIES: Record<string, string[]> = {
  "Programming Languages": ["Java", "Python", "C", "C++", "JavaScript", "TypeScript"],
  "Frontend": ["HTML", "CSS", "React", "Next.js", "Angular"],
  "Backend": ["Node.js", "Express", "FastAPI", "Spring Boot"],
  "Database": ["MySQL", "PostgreSQL", "MongoDB", "Firebase"],
  "Cloud": ["AWS", "Azure", "GCP"],
  "DevOps": ["Git", "GitHub", "Docker", "Linux"],
  "AI": ["Machine Learning", "Deep Learning", "LangChain", "RAG", "Prompt Engineering"],
};

export const BRANCH_OPTIONS = [
  "Computer Science and Engineering (CSE)",
  "Information Technology (IT)",
  "Artificial Intelligence and Data Science (AIDS)",
  "Artificial Intelligence and Machine Learning (AIML)",
  "Computer Science and Business Systems (CSBS)",
  "Electronics and Communication Engineering (ECE)",
  "Electrical and Electronics Engineering (EEE)",
  "Mechanical Engineering (MECH)",
  "Civil Engineering (CIVIL)",
  "Biotechnology (BIO-TECH)",
  "Chemical Engineering (CHEM)",
  "Marine Engineering (MARINE)",
];

export const YEAR_OPTIONS = ["1st Year", "2nd Year", "3rd Year", "4th Year (Final Year)"];

export const SECTION_OPTIONS = ["A", "B", "C", "D"];

export const POPULAR_DREAM_COMPANIES = [
  "Accenture",
  "Google",
  "Microsoft",
  "Amazon",
  "Zoho",
  "Cisco",
  "TCS",
  "Infosys",
  "Cognizant",
  "Wipro",
  "IBM",
  "Oracle",
  "Qualcomm",
  "Ford",
  "PayPal",
  "Freshworks",
];

export const POPULAR_LOCATIONS = [
  "Chennai",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Coimbatore",
  "Mumbai",
  "Delhi NCR",
  "Remote",
];

export const PACKAGE_OPTIONS = [
  "4 - 6 LPA (Regular)",
  "6 - 10 LPA (Standard)",
  "10 - 15 LPA (Dream)",
  "15 - 25 LPA (Super Dream)",
  "25+ LPA (Tier-1 Elite)",
];
