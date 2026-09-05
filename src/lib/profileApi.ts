import { supabase } from "./supabase";
import type {
  CompleteStudentProfile,
  ResumeData,
} from "@/types/studentProfile";

const LOCAL_STORAGE_KEY_PREFIX = "svce_student_profile_";

/**
 * Helper to get cached profile from localStorage
 */
export function getLocalProfile(userId: string): CompleteStudentProfile | null {
  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Failed to read cached profile from localStorage", err);
  }
  return null;
}

/**
 * Helper to save profile to localStorage
 */
export function setLocalProfile(userId: string, profile: CompleteStudentProfile): void {
  try {
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${userId}`, JSON.stringify(profile));
  } catch (err) {
    console.warn("Failed to save profile to localStorage", err);
  }
}

/**
 * Fetch the complete student profile from Supabase (with fallback to localStorage)
 */
export async function fetchCompleteStudentProfile(userId: string): Promise<CompleteStudentProfile | null> {
  const cached = getLocalProfile(userId);

  if (!supabase) {
    return cached;
  }

  try {
    // 1. Fetch base profile
    const { data: profileRow, error: profileErr } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();

    if (profileErr) {
      console.warn("Supabase profiles select failed, falling back to cache:", profileErr.message);
      return cached;
    }

    if (!profileRow) {
      return cached;
    }

    // 2. Fetch skills
    const { data: skillsRows } = await supabase
      .from("student_skills")
      .select("*")
      .eq("profile_id", userId)
      .order("id", { ascending: true });

    // 3. Fetch projects
    const { data: projectsRows } = await supabase
      .from("projects")
      .select("*")
      .eq("profile_id", userId)
      .order("id", { ascending: true });

    // 4. Fetch certifications
    const { data: certsRows } = await supabase
      .from("certifications")
      .select("*")
      .eq("profile_id", userId)
      .order("id", { ascending: true });

    // 5. Fetch preferences
    const { data: prefRow } = await supabase
      .from("preferences")
      .select("*")
      .eq("profile_id", userId)
      .maybeSingle();

    // 6. Fetch resume
    const { data: resumeRow } = await supabase
      .from("resume")
      .select("*")
      .eq("profile_id", userId)
      .maybeSingle();

    const completeProfile: CompleteStudentProfile = {
      id: userId,
      personal: {
        full_name: profileRow.full_name || "",
        register_number: profileRow.register_number || "",
        college_email: profileRow.college_email || "",
        personal_email: profileRow.personal_email || "",
        phone_number: profileRow.phone_number || "",
        branch: profileRow.branch || "",
        year: profileRow.year || "",
        section: profileRow.section || "",
        cgpa: profileRow.cgpa ?? "",
        active_backlogs: profileRow.active_backlogs ?? 0,
      },
      links: {
        github_url: profileRow.github_url || "",
        linkedin_url: profileRow.linkedin_url || "",
        portfolio_url: profileRow.portfolio_url || "",
        leetcode_url: profileRow.leetcode_url || "",
        hackerrank_url: profileRow.hackerrank_url || "",
      },
      resume: resumeRow
        ? {
            file_name: resumeRow.file_name,
            file_url: resumeRow.file_url,
            file_size: Number(resumeRow.file_size || 0),
            uploaded_at: resumeRow.uploaded_at || new Date().toISOString(),
          }
        : cached?.resume || null,
      skills: (skillsRows || []).map((s: any) => ({
        id: s.id,
        category: s.category,
        skill_name: s.skill_name,
        proficiency: s.proficiency,
      })),
      projects: (projectsRows || []).map((p: any) => ({
        id: String(p.id),
        name: p.name,
        description: p.description,
        tech_stack: Array.isArray(p.tech_stack) ? p.tech_stack : [],
        github_url: p.github_url || "",
        demo_url: p.demo_url || "",
      })),
      certifications: (certsRows || []).map((c: any) => ({
        id: String(c.id),
        name: c.name,
        organization: c.organization,
        year: c.year,
        credential_url: c.credential_url || "",
      })),
      preferences: prefRow
        ? {
            preferred_role: prefRow.preferred_role || "",
            dream_companies: Array.isArray(prefRow.dream_companies) ? prefRow.dream_companies : [],
            preferred_locations: Array.isArray(prefRow.preferred_locations) ? prefRow.preferred_locations : [],
            expected_package: prefRow.expected_package || "",
            willing_to_relocate: prefRow.willing_to_relocate ?? true,
          }
        : cached?.preferences || {
            preferred_role: "",
            dream_companies: [],
            preferred_locations: [],
            expected_package: "",
            willing_to_relocate: true,
          },
      created_at: profileRow.created_at,
      updated_at: profileRow.updated_at,
    };

    // Cache locally
    setLocalProfile(userId, completeProfile);
    return completeProfile;
  } catch (err) {
    console.error("Error fetching complete student profile:", err);
    return cached;
  }
}

/**
 * Save / Update student profile across all normalized tables
 */
export async function saveCompleteStudentProfile(
  userId: string,
  data: Omit<CompleteStudentProfile, "id">
): Promise<CompleteStudentProfile> {
  const profileRecord: CompleteStudentProfile = {
    id: userId,
    ...data,
    updated_at: new Date().toISOString(),
  };

  // Always cache locally first so offline/instant response is guaranteed
  setLocalProfile(userId, profileRecord);

  if (!supabase) {
    return profileRecord;
  }

  try {
    // 1. Upsert profiles table
    const { error: profileErr } = await supabase.from("profiles").upsert(
      {
        id: userId,
        full_name: data.personal.full_name,
        register_number: data.personal.register_number,
        college_email: data.personal.college_email,
        personal_email: data.personal.personal_email,
        phone_number: data.personal.phone_number,
        branch: data.personal.branch,
        year: data.personal.year,
        section: data.personal.section,
        cgpa: parseFloat(String(data.personal.cgpa)) || 0.0,
        active_backlogs: parseInt(String(data.personal.active_backlogs), 10) || 0,
        github_url: data.links.github_url || null,
        linkedin_url: data.links.linkedin_url || null,
        portfolio_url: data.links.portfolio_url || null,
        leetcode_url: data.links.leetcode_url || null,
        hackerrank_url: data.links.hackerrank_url || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    );

    if (profileErr) {
      console.warn("Supabase profiles upsert error:", profileErr.message);
    }

    // 2. Sync student_skills (delete existing and insert current)
    await supabase.from("student_skills").delete().eq("profile_id", userId);
    if (data.skills && data.skills.length > 0) {
      const skillsToInsert = data.skills.map((s) => ({
        profile_id: userId,
        category: s.category,
        skill_name: s.skill_name,
        proficiency: s.proficiency,
      }));
      await supabase.from("student_skills").insert(skillsToInsert);
    }

    // 3. Sync projects (delete existing and insert current)
    await supabase.from("projects").delete().eq("profile_id", userId);
    if (data.projects && data.projects.length > 0) {
      const projectsToInsert = data.projects.map((p) => ({
        profile_id: userId,
        name: p.name,
        description: p.description,
        tech_stack: p.tech_stack,
        github_url: p.github_url || null,
        demo_url: p.demo_url || null,
      }));
      await supabase.from("projects").insert(projectsToInsert);
    }

    // 4. Sync certifications
    await supabase.from("certifications").delete().eq("profile_id", userId);
    if (data.certifications && data.certifications.length > 0) {
      const certsToInsert = data.certifications.map((c) => ({
        profile_id: userId,
        name: c.name,
        organization: c.organization,
        year: c.year,
        credential_url: c.credential_url || null,
      }));
      await supabase.from("certifications").insert(certsToInsert);
    }

    // 5. Sync preferences
    if (data.preferences) {
      await supabase.from("preferences").upsert(
        {
          profile_id: userId,
          preferred_role: data.preferences.preferred_role,
          dream_companies: data.preferences.dream_companies,
          preferred_locations: data.preferences.preferred_locations,
          expected_package: data.preferences.expected_package,
          willing_to_relocate: data.preferences.willing_to_relocate,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "profile_id" }
      );
    }

    // 6. Sync resume metadata if present
    if (data.resume) {
      await supabase.from("resume").upsert(
        {
          profile_id: userId,
          file_name: data.resume.file_name,
          file_url: data.resume.file_url,
          file_size: data.resume.file_size,
          uploaded_at: data.resume.uploaded_at,
        },
        { onConflict: "profile_id" }
      );
    }
  } catch (err) {
    console.error("Error saving complete student profile to Supabase:", err);
  }

  return profileRecord;
}

/**
 * Upload resume PDF to Supabase Storage
 */
export async function uploadResumeToSupabase(
  userId: string,
  file: File
): Promise<ResumeData> {
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    throw new Error("Invalid file type. Only PDF documents are allowed.");
  }

  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${userId}/${timestamp}_${sanitizedFileName}`;

  let publicUrl = "";

  if (supabase) {
    try {
      const { error: uploadError } = await supabase.storage
        .from("resumes")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: "application/pdf",
        });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("resumes")
          .getPublicUrl(filePath);
        publicUrl = urlData.publicUrl;
      } else {
        console.warn("Supabase storage upload error, creating object URL fallback:", uploadError.message);
        publicUrl = URL.createObjectURL(file);
      }
    } catch (storageErr) {
      console.warn("Storage exception, fallback to object URL:", storageErr);
      publicUrl = URL.createObjectURL(file);
    }
  } else {
    publicUrl = URL.createObjectURL(file);
  }

  const resumeData: ResumeData = {
    file_name: file.name,
    file_url: publicUrl,
    file_size: file.size,
    uploaded_at: new Date().toISOString(),
  };

  return resumeData;
}

/**
 * Calculate Profile Completion Percentage dynamically
 */
export function calculateProfileCompletion(profile: CompleteStudentProfile | null): {
  percentage: number;
  completedTasks: string[];
  pendingTasks: string[];
} {
  if (!profile) {
    return {
      percentage: 0,
      completedTasks: [],
      pendingTasks: ["Complete Personal Details", "Upload Resume", "Add Skills", "Add Projects"],
    };
  }

  const tasks = [
    {
      name: "Personal Details & CGPA",
      weight: 20,
      done: Boolean(
        profile.personal.full_name &&
        profile.personal.register_number &&
        profile.personal.college_email &&
        profile.personal.cgpa
      ),
    },
    {
      name: "Professional Links",
      weight: 15,
      done: Boolean(profile.links.github_url || profile.links.linkedin_url),
    },
    {
      name: "Resume Upload (PDF)",
      weight: 20,
      done: Boolean(profile.resume?.file_url),
    },
    {
      name: "Technical Skills (3+ selected)",
      weight: 15,
      done: profile.skills.length >= 3,
    },
    {
      name: "Projects (1+ added)",
      weight: 15,
      done: profile.projects.length >= 1,
    },
    {
      name: "Certifications",
      weight: 5,
      done: profile.certifications.length >= 1,
    },
    {
      name: "Placement Preferences",
      weight: 10,
      done: Boolean(
        profile.preferences.preferred_role &&
        profile.preferences.dream_companies.length > 0 &&
        profile.preferences.expected_package
      ),
    },
  ];

  let percentage = 0;
  const completedTasks: string[] = [];
  const pendingTasks: string[] = [];

  for (const t of tasks) {
    if (t.done) {
      percentage += t.weight;
      completedTasks.push(t.name);
    } else {
      pendingTasks.push(t.name);
    }
  }

  return { percentage: Math.min(100, percentage), completedTasks, pendingTasks };
}
