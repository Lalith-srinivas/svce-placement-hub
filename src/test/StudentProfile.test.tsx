import { describe, it, expect } from "vitest";
import { calculateProfileCompletion, getLocalProfile, setLocalProfile } from "@/lib/profileApi";
import { SKILL_CATEGORIES, BRANCH_OPTIONS, type CompleteStudentProfile } from "@/types/studentProfile";

describe("Student Profile Module", () => {
  it("defines all requested skill categories", () => {
    expect(SKILL_CATEGORIES).toHaveProperty("Programming Languages");
    expect(SKILL_CATEGORIES).toHaveProperty("Frontend");
    expect(SKILL_CATEGORIES).toHaveProperty("Backend");
    expect(SKILL_CATEGORIES).toHaveProperty("Database");
    expect(SKILL_CATEGORIES).toHaveProperty("Cloud");
    expect(SKILL_CATEGORIES).toHaveProperty("DevOps");
    expect(SKILL_CATEGORIES).toHaveProperty("AI");

    expect(SKILL_CATEGORIES["Programming Languages"]).toEqual([
      "Java", "Python", "C", "C++", "JavaScript", "TypeScript"
    ]);

    expect(SKILL_CATEGORIES["AI"]).toEqual([
      "Machine Learning", "Deep Learning", "LangChain", "RAG", "Prompt Engineering"
    ]);
  });

  it("calculates profile completion correctly", () => {
    // Empty profile
    const emptyResult = calculateProfileCompletion(null);
    expect(emptyResult.percentage).toBe(0);
    expect(emptyResult.pendingTasks.length).toBeGreaterThan(0);

    // Full profile
    const fullProfile: CompleteStudentProfile = {
      id: "student-123",
      personal: {
        full_name: "Lalith Srinivas",
        register_number: "2127210501001",
        college_email: "lalith@svce.ac.in",
        personal_email: "lalith@gmail.com",
        phone_number: "+91 9876543210",
        branch: "Computer Science and Engineering (CSE)",
        year: "4th Year (Final Year)",
        section: "A",
        cgpa: 8.92,
        active_backlogs: 0,
      },
      links: {
        github_url: "https://github.com/lalith",
        linkedin_url: "https://linkedin.com/in/lalith",
        portfolio_url: "https://lalith.dev",
        leetcode_url: "https://leetcode.com/u/lalith",
        hackerrank_url: "https://hackerrank.com/profile/lalith",
      },
      resume: {
        file_name: "Lalith_Srinivas_Resume.pdf",
        file_url: "https://supabase.co/storage/v1/object/public/resumes/resume.pdf",
        file_size: 1048576,
        uploaded_at: new Date().toISOString(),
      },
      skills: [
        { category: "Programming Languages", skill_name: "Java", proficiency: 9 },
        { category: "Frontend", skill_name: "React", proficiency: 9 },
        { category: "Backend", skill_name: "Node.js", proficiency: 8 },
        { category: "Database", skill_name: "PostgreSQL", proficiency: 8 },
      ],
      projects: [
        {
          id: "p1",
          name: "SVCE Placement Hub",
          description: "Full-stack campus placement portal",
          tech_stack: ["React", "TypeScript", "Tailwind CSS", "Supabase"],
          github_url: "https://github.com/user/project",
          demo_url: "https://project.vercel.app",
        },
      ],
      certifications: [
        {
          id: "c1",
          name: "AWS Certified Developer",
          organization: "Amazon Web Services",
          year: "2025",
          credential_url: "https://credly.com/badge",
        },
      ],
      preferences: {
        preferred_role: "Software Development Engineer",
        dream_companies: ["Accenture", "Google", "Amazon"],
        preferred_locations: ["Chennai", "Bangalore"],
        expected_package: "10 - 15 LPA (Dream)",
        willing_to_relocate: true,
      },
    };

    const fullResult = calculateProfileCompletion(fullProfile);
    expect(fullResult.percentage).toBe(100);
    expect(fullResult.pendingTasks.length).toBe(0);
    expect(fullResult.completedTasks.length).toBe(7);
  });

  it("saves and retrieves student profiles from local cache accurately", () => {
    const mockId = "test-profile-id-456";
    const testData: CompleteStudentProfile = {
      id: mockId,
      personal: {
        full_name: "Test Student",
        register_number: "2127210501999",
        college_email: "test@svce.ac.in",
        personal_email: "test@gmail.com",
        phone_number: "9876543210",
        branch: BRANCH_OPTIONS[0],
        year: "3rd Year",
        section: "B",
        cgpa: 8.5,
        active_backlogs: 0,
      },
      links: {
        github_url: "https://github.com/test",
        linkedin_url: "https://linkedin.com/in/test",
        portfolio_url: "",
        leetcode_url: "",
        hackerrank_url: "",
      },
      resume: null,
      skills: [
        { category: "AI", skill_name: "Machine Learning", proficiency: 8 },
      ],
      projects: [],
      certifications: [],
      preferences: {
        preferred_role: "Data Scientist",
        dream_companies: ["Accenture"],
        preferred_locations: ["Chennai"],
        expected_package: "8 - 12 LPA",
        willing_to_relocate: true,
      },
    };

    setLocalProfile(mockId, testData);
    const retrieved = getLocalProfile(mockId);
    expect(retrieved).not.toBeNull();
    expect(retrieved?.personal.full_name).toBe("Test Student");
    expect(retrieved?.skills[0].skill_name).toBe("Machine Learning");
  });
});
