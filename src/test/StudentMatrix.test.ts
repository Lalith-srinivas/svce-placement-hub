import { describe, it, expect } from "vitest";
import {
  calculateSkillGap,
  getReadinessColor,
  classifySkillCategory,
  calculateCompanyMatch,
  calculateGlobalMatrix,
  MATRIX_CATEGORIES,
} from "@/lib/studentMatrix";
import type { StudentSkill } from "@/types/studentProfile";

describe("Student Matrix Deterministic Calculation Engine", () => {
  describe("Gap Calculation & Status Classification", () => {
    it("calculates Gap = Required Level - Student Level", () => {
      const result = calculateSkillGap(8, 6);
      expect(result.gap).toBe(2);
      expect(result.status).toBe("Needs Improvement");
      expect(result.priority).toBe("Medium");
    });

    it("marks status as Completed when student level meets or exceeds required level", () => {
      const met = calculateSkillGap(8, 8);
      expect(met.gap).toBe(0);
      expect(met.status).toBe("Completed");

      const exceeded = calculateSkillGap(7, 9);
      expect(exceeded.gap).toBeLessThanOrEqual(0);
      expect(exceeded.status).toBe("Completed");
    });

    it("marks status as Missing when student level is 0", () => {
      const missing = calculateSkillGap(8, 0);
      expect(missing.gap).toBe(8);
      expect(missing.status).toBe("Missing");
      expect(missing.priority).toBe("Critical");
    });

    it("assigns priority based on gap magnitude", () => {
      expect(calculateSkillGap(10, 3).priority).toBe("Critical"); // gap 7
      expect(calculateSkillGap(8, 3).priority).toBe("High"); // gap 5
      expect(calculateSkillGap(7, 5).priority).toBe("Medium"); // gap 2
      expect(calculateSkillGap(6, 6).priority).toBe("Low"); // gap 0
    });
  });

  describe("Readiness Gauge Color Thresholds", () => {
    it("returns green for readiness above 85%", () => {
      expect(getReadinessColor(85)).toBe("green");
      expect(getReadinessColor(92)).toBe("green");
      expect(getReadinessColor(100)).toBe("green");
    });

    it("returns yellow for readiness between 60% and 84%", () => {
      expect(getReadinessColor(60)).toBe("yellow");
      expect(getReadinessColor(74)).toBe("yellow");
      expect(getReadinessColor(84)).toBe("yellow");
    });

    it("returns red for readiness below 60%", () => {
      expect(getReadinessColor(59)).toBe("red");
      expect(getReadinessColor(40)).toBe("red");
      expect(getReadinessColor(0)).toBe("red");
    });
  });

  describe("8 Skill Category Mapping", () => {
    it("defines exactly the 8 requested categories", () => {
      expect(MATRIX_CATEGORIES).toEqual([
        "Programming",
        "DSA",
        "Frontend",
        "Backend",
        "Database",
        "Cloud",
        "DevOps",
        "Soft Skills",
      ]);
    });

    it("correctly maps representative skills to each category", () => {
      expect(classifySkillCategory("Java")).toBe("Programming");
      expect(classifySkillCategory("Python")).toBe("Programming");
      expect(classifySkillCategory("Data Structures & Algorithms")).toBe("DSA");
      expect(classifySkillCategory("DSA")).toBe("DSA");
      expect(classifySkillCategory("React")).toBe("Frontend");
      expect(classifySkillCategory("HTML/CSS")).toBe("Frontend");
      expect(classifySkillCategory("Node.js")).toBe("Backend");
      expect(classifySkillCategory("System Design")).toBe("Backend");
      expect(classifySkillCategory("SQL & Relational Databases")).toBe("Database");
      expect(classifySkillCategory("PostgreSQL")).toBe("Database");
      expect(classifySkillCategory("AWS")).toBe("Cloud");
      expect(classifySkillCategory("Git & GitHub")).toBe("DevOps");
      expect(classifySkillCategory("Business Communication")).toBe("Soft Skills");
      expect(classifySkillCategory("Aptitude & Logical Reasoning")).toBe("Soft Skills");
    });
  });

  describe("Company Match Score & Eligibility", () => {
    const mockStudentSkills: StudentSkill[] = [
      { category: "Programming", skill_name: "Java", proficiency: 8 },
      { category: "DSA", skill_name: "Data Structures & Algorithms", proficiency: 8 },
      { category: "Database", skill_name: "SQL & Relational Databases", proficiency: 7 },
      { category: "Cloud", skill_name: "AWS", proficiency: 7 },
    ];

    const mockCompany = {
      companyId: 1,
      name: "Accenture",
      companyType: "Dream",
      skill_levels: [
        { skill_set_id: 1, skill_set_name: "Data Structures & Algorithms", required_level: 8 },
        { skill_set_id: 2, skill_set_name: "Object-Oriented Programming (Java/Python/C++)", required_level: 8 },
        { skill_set_id: 3, skill_set_name: "SQL & Relational Databases", required_level: 7 },
        { skill_set_id: 4, skill_set_name: "Cloud Computing Fundamentals (AWS/Azure/GCP)", required_level: 7 },
      ],
    };

    it("calculates 100% match when all required skills are fully met", () => {
      const match = calculateCompanyMatch(mockCompany, mockStudentSkills, null);
      expect(match.matchPercentage).toBe(100);
      expect(match.matchedSkillsCount).toBe(4);
      expect(match.missingSkillsCount).toBe(0);
      expect(match.totalSkillGap).toBe(0);
      expect(match.isEligible).toBe(true);
    });

    it("calculates proportional match when student has lower levels", () => {
      const partialSkills: StudentSkill[] = [
        { category: "DSA", skill_name: "Data Structures & Algorithms", proficiency: 4 }, // 4 / 8
        { category: "Programming", skill_name: "Java", proficiency: 4 }, // 4 / 8
      ];
      // Total required = 8 + 8 + 7 + 7 = 30. Student fulfilled = 4 + 4 + 0 + 0 = 8. Match % = 8/30 * 100 = 27%
      const match = calculateCompanyMatch(mockCompany, partialSkills, null);
      expect(match.matchPercentage).toBe(27);
      expect(match.matchedSkillsCount).toBe(0);
      expect(match.missingSkillsCount).toBe(2);
      expect(match.isEligible).toBe(false);
    });

    it("disqualifies eligibility if student has active backlogs", () => {
      const studentWithBacklogs = {
        id: "student-backlogs",
        personal: {
          full_name: "Test Student",
          register_number: "2127210501999",
          college_email: "test@svce.ac.in",
          personal_email: "test@gmail.com",
          phone_number: "9876543210",
          branch: "CSE",
          year: "4th Year",
          section: "A",
          cgpa: 9.0,
          active_backlogs: 1, // 1 backlog
        },
        links: { github_url: "", linkedin_url: "", portfolio_url: "", leetcode_url: "", hackerrank_url: "" },
        resume: null,
        skills: mockStudentSkills,
        projects: [],
        certifications: [],
        preferences: { preferred_role: "SDE", dream_companies: [], preferred_locations: [], expected_package: "", willing_to_relocate: true },
      };

      const match = calculateCompanyMatch(mockCompany, mockStudentSkills, studentWithBacklogs);
      expect(match.isEligible).toBe(false);
      expect(match.eligibilityReason).toContain("backlog");
    });
  });

  describe("Global Matrix & Company Ranking", () => {
    it("ranks all companies descending by match percentage", () => {
      const studentSkills: StudentSkill[] = [
        { category: "Programming", skill_name: "Java", proficiency: 9 },
        { category: "DSA", skill_name: "Data Structures & Algorithms", proficiency: 8 },
        { category: "Database", skill_name: "SQL & Relational Databases", proficiency: 7 },
      ];

      const metrics = calculateGlobalMatrix([], studentSkills, null);

      expect(metrics.rankedCompanies.length).toBeGreaterThan(0);
      expect(metrics.overallReadiness).toBeGreaterThan(0);

      // Verify descending order
      for (let i = 0; i < metrics.rankedCompanies.length - 1; i++) {
        expect(metrics.rankedCompanies[i].matchPercentage).toBeGreaterThanOrEqual(
          metrics.rankedCompanies[i + 1].matchPercentage
        );
      }
    });

    it("computes progress across all 8 categories", () => {
      const metrics = calculateGlobalMatrix([], [], null);
      expect(metrics.categoryProgress.length).toBe(8);
      const catNames = metrics.categoryProgress.map((c) => c.category);
      expect(catNames).toContain("Programming");
      expect(catNames).toContain("DSA");
      expect(catNames).toContain("Frontend");
      expect(catNames).toContain("Backend");
      expect(catNames).toContain("Database");
      expect(catNames).toContain("Cloud");
      expect(catNames).toContain("DevOps");
      expect(catNames).toContain("Soft Skills");
    });
  });
});
