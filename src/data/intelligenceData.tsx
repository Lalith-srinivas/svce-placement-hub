import {
  Fingerprint, Compass, Users2, Landmark, Globe2, Package,
  Cpu, Handshake, Swords, TrendingUp, Gem, HeartHandshake,
  Newspaper, LineChart, ShieldAlert, MapPinned, ShieldCheck,
  GraduationCap, Award, Wallet, Radar, Mail, type LucideIcon,
} from "lucide-react";
import type { JsonRecord } from "@/lib/companyData";

export type FieldType = "url" | "video" | "rating" | "list" | "paragraph" | "auto";

export interface FieldDef {
  key: string;
  label: string;
  type?: FieldType;
}

export interface SectionDef {
  id: string;
  index: number;
  title: string;
  eyebrow: string;
  icon: LucideIcon;
  fields: FieldDef[];
}

const S = (id: string, title: string, eyebrow: string, icon: LucideIcon, fields: FieldDef[]) => ({
  id, title, eyebrow, icon, fields,
});

const BASE_SECTIONS: Omit<SectionDef, "index">[] = [
  S("identity", "Company Identity", "Who they are", Fingerprint, [
    { key: "name", label: "Legal name" },
    { key: "short_name", label: "Known as" },
    { key: "category", label: "Category" },
    { key: "nature_of_company", label: "Nature" },
    { key: "incorporation_year", label: "Incorporated" },
    { key: "company_maturity", label: "Maturity stage" },
  ]),
  S("overview", "Overview & Vision", "The world they're building", Compass, [
    { key: "overview_text", label: "Overview", type: "paragraph" },
    { key: "vision_statement", label: "Vision", type: "paragraph" },
    { key: "mission_statement", label: "Mission", type: "paragraph" },
    { key: "core_values", label: "Core values", type: "list" },
    { key: "history_timeline", label: "History highlights", type: "list" },
  ]),
  S("leadership", "Leadership", "Who runs the room", Users2, [
    { key: "ceo_name", label: "CEO" },
    { key: "ceo_linkedin_url", label: "CEO LinkedIn", type: "url" },
    { key: "key_leaders", label: "Key leaders", type: "list" },
    { key: "board_members", label: "Board members", type: "list" },
    { key: "warm_intro_pathways", label: "Warm intro pathways", type: "list" },
    { key: "decision_maker_access", label: "Decision-maker access", type: "paragraph" },
  ]),
  S("financials", "Funding & Financials", "The money story", Landmark, [
    { key: "annual_revenue", label: "Annual revenue" },
    { key: "annual_profit", label: "Annual profit" },
    { key: "revenue_mix", label: "Revenue mix", type: "list" },
    { key: "valuation", label: "Valuation" },
    { key: "yoy_growth_rate", label: "YoY growth" },
    { key: "profitability_status", label: "Profitability" },
    { key: "key_investors", label: "Key investors", type: "list" },
    { key: "recent_funding_rounds", label: "Recent funding" },
    { key: "total_capital_raised", label: "Total capital raised" },
    { key: "burn_rate", label: "Burn rate" },
    { key: "runway_months", label: "Runway" },
    { key: "burn_multiplier", label: "Burn multiplier" },
  ]),
  S("presence", "Global Presence", "Where they operate", Globe2, [
    { key: "headquarters_address", label: "Headquarters" },
    { key: "operating_countries", label: "Operating countries", type: "list" },
    { key: "office_count", label: "Office count" },
    { key: "office_locations", label: "Office locations", type: "list" },
    { key: "employee_size", label: "Employee size" },
  ]),
  S("products", "Products & Services", "What they sell", Package, [
    { key: "offerings_description", label: "Offerings", type: "list" },
    { key: "focus_sectors", label: "Focus sectors", type: "list" },
    { key: "top_customers", label: "Top customers", type: "list" },
    { key: "pain_points_addressed", label: "Pain points addressed", type: "list" },
    { key: "case_studies", label: "Case studies", type: "list" },
    { key: "product_pipeline", label: "Product pipeline", type: "list" },
  ]),
  S("tech", "Technology Stack", "What they build with", Cpu, [
    { key: "tech_stack", label: "Tech stack", type: "list" },
    { key: "technology_partners", label: "Technology partners", type: "list" },
    { key: "ai_ml_adoption_level", label: "AI/ML adoption", type: "paragraph" },
    { key: "r_and_d_investment", label: "R&D investment" },
    { key: "intellectual_property", label: "Intellectual property", type: "list" },
    { key: "cybersecurity_posture", label: "Cybersecurity posture", type: "list" },
    { key: "tech_adoption_rating", label: "Tech adoption rating", type: "paragraph" },
  ]),
  S("partnerships", "Partnerships & Ecosystem", "Who they build alongside", Handshake, [
    { key: "partnership_ecosystem", label: "Partnership ecosystem", type: "list" },
    { key: "industry_associations", label: "Industry associations", type: "list" },
    { key: "event_participation", label: "Event participation", type: "list" },
    { key: "go_to_market_strategy", label: "Go-to-market strategy", type: "paragraph" },
  ]),
  S("competitive", "Competitive Landscape", "Who they're up against", Swords, [
    { key: "key_competitors", label: "Key competitors", type: "list" },
    { key: "competitive_advantages", label: "Competitive advantages", type: "list" },
    { key: "weaknesses_gaps", label: "Weaknesses & gaps", type: "list" },
    { key: "unique_differentiators", label: "Unique differentiators", type: "list" },
    { key: "benchmark_vs_peers", label: "Benchmark vs peers", type: "paragraph" },
    { key: "market_share_percentage", label: "Market share" },
  ]),
  S("market", "Market Opportunity", "How big the field is", TrendingUp, [
    { key: "tam", label: "TAM" },
    { key: "sam", label: "SAM" },
    { key: "som", label: "SOM" },
    { key: "future_projections", label: "Future projections", type: "paragraph" },
    { key: "strategic_priorities", label: "Strategic priorities", type: "list" },
    { key: "innovation_roadmap", label: "Innovation roadmap", type: "list" },
    { key: "key_challenges_needs", label: "Key challenges", type: "list" },
  ]),
  S("value-esg", "Core Value Proposition & ESG", "Why clients — and the planet — choose them", Gem, [
    { key: "core_value_proposition", label: "Core value proposition", type: "list" },
    { key: "esg_ratings", label: "ESG ratings", type: "list" },
    { key: "sustainability_csr", label: "Sustainability & CSR", type: "list" },
    { key: "carbon_footprint", label: "Carbon footprint", type: "paragraph" },
    { key: "ethical_sourcing", label: "Ethical sourcing", type: "paragraph" },
  ]),
  S("culture", "Culture & Work Life", "What a normal Tuesday feels like", HeartHandshake, [
    { key: "work_culture_summary", label: "Work culture", type: "paragraph" },
    { key: "manager_quality", label: "Manager quality" },
    { key: "psychological_safety", label: "Psychological safety" },
    { key: "feedback_culture", label: "Feedback culture" },
    { key: "diversity_inclusion_score", label: "Diversity & inclusion" },
    { key: "diversity_metrics", label: "Diversity metrics" },
    { key: "ethical_standards", label: "Ethical standards" },
    { key: "mission_clarity", label: "Mission clarity" },
    { key: "burnout_risk", label: "Burnout risk" },
    { key: "layoff_history", label: "Layoff history" },
    { key: "crisis_behavior", label: "Crisis behavior" },
  ]),
  S("news", "Recent News & Milestones", "What's happened lately", Newspaper, [
    { key: "recent_news", label: "Recent news", type: "list" },
    { key: "marketing_video_url", label: "Marketing video", type: "video" },
    { key: "customer_testimonials", label: "Customer testimonials", type: "list" },
  ]),
  S("sales", "Sales & Customer Metrics", "How revenue actually moves", LineChart, [
    { key: "sales_motion", label: "Sales motion" },
    { key: "customer_concentration_risk", label: "Customer concentration risk" },
    { key: "customer_acquisition_cost", label: "CAC" },
    { key: "customer_lifetime_value", label: "LTV" },
    { key: "cac_ltv_ratio", label: "CAC:LTV ratio" },
    { key: "churn_rate", label: "Churn rate" },
    { key: "net_promoter_score", label: "NPS" },
    { key: "exit_strategy_history", label: "Exit strategy history" },
  ]),
  S("risk", "Risk & Compliance", "What could go wrong", ShieldAlert, [
    { key: "regulatory_status", label: "Regulatory status", type: "list" },
    { key: "legal_issues", label: "Legal issues", type: "paragraph" },
    { key: "supply_chain_dependencies", label: "Supply chain dependencies", type: "list" },
    { key: "geopolitical_risks", label: "Geopolitical risks", type: "list" },
    { key: "macro_risks", label: "Macro risks", type: "list" },
  ]),
  S("location", "Work Location & Commute", "Getting there and back", MapPinned, [
    { key: "remote_policy_details", label: "Remote policy" },
    { key: "typical_hours", label: "Typical hours" },
    { key: "overtime_expectations", label: "Overtime expectations" },
    { key: "weekend_work", label: "Weekend work" },
    { key: "flexibility_level", label: "Flexibility level" },
    { key: "location_centrality", label: "Location centrality" },
    { key: "public_transport_access", label: "Public transport access" },
    { key: "cab_policy", label: "Cab policy" },
    { key: "airport_commute_time", label: "Airport commute time" },
    { key: "office_zone_type", label: "Office zone type" },
  ]),
  S("safety", "Safety & Wellbeing", "Feeling secure on the job", ShieldCheck, [
    { key: "area_safety", label: "Area safety" },
    { key: "safety_policies", label: "Safety policies", type: "list" },
    { key: "infrastructure_safety", label: "Infrastructure safety", type: "list" },
    { key: "emergency_preparedness", label: "Emergency preparedness", type: "list" },
    { key: "health_support", label: "Health support", type: "list" },
    { key: "family_health_insurance", label: "Family health insurance" },
  ]),
  S("career", "Career Growth & Learning", "Where this role leads", GraduationCap, [
    { key: "training_spend", label: "Training spend" },
    { key: "onboarding_quality", label: "Onboarding quality" },
    { key: "learning_culture", label: "Learning culture", type: "list" },
    { key: "exposure_quality", label: "Exposure quality" },
    { key: "mentorship_availability", label: "Mentorship availability", type: "list" },
    { key: "internal_mobility", label: "Internal mobility" },
    { key: "promotion_clarity", label: "Promotion clarity" },
    { key: "tools_access", label: "Tools access", type: "list" },
    { key: "role_clarity", label: "Role clarity" },
    { key: "early_ownership", label: "Early ownership" },
    { key: "work_impact", label: "Work impact" },
    { key: "execution_thinking_balance", label: "Execution vs thinking balance" },
    { key: "automation_level", label: "Automation level" },
    { key: "cross_functional_exposure", label: "Cross-functional exposure", type: "list" },
    { key: "exit_opportunities", label: "Exit opportunities", type: "list" },
    { key: "skill_relevance", label: "Skill relevance" },
    { key: "external_recognition", label: "External recognition" },
    { key: "network_strength", label: "Network strength" },
    { key: "global_exposure", label: "Global exposure" },
  ]),
  S("brand", "Brand & Reputation", "How the world sees them", Award, [
    { key: "brand_value", label: "Brand value" },
    { key: "brand_sentiment_score", label: "Brand sentiment" },
    { key: "website_quality", label: "Website quality" },
    { key: "awards_recognitions", label: "Awards & recognitions", type: "list" },
    { key: "client_quality", label: "Client quality" },
  ]),
  S("compensation", "Compensation & Benefits", "What comes with the offer", Wallet, [
    { key: "leave_policy", label: "Leave policy" },
    { key: "fixed_vs_variable_pay", label: "Fixed vs variable pay" },
    { key: "bonus_predictability", label: "Bonus predictability" },
    { key: "esops_incentives", label: "ESOPs & incentives" },
    { key: "relocation_support", label: "Relocation support" },
    { key: "lifestyle_benefits", label: "Lifestyle benefits" },
    { key: "hiring_velocity", label: "Hiring velocity", type: "list" },
    { key: "employee_turnover", label: "Employee turnover" },
    { key: "avg_retention_tenure", label: "Avg. retention tenure" },
  ]),
  S("digital", "Digital Presence & Ratings", "Their footprint online", Radar, [
    { key: "website_url", label: "Website", type: "url" },
    { key: "website_rating", label: "Website rating", type: "rating" },
    { key: "website_traffic_rank", label: "Traffic rank" },
    { key: "social_media_followers", label: "Social followers" },
    { key: "glassdoor_rating", label: "Glassdoor rating", type: "rating" },
    { key: "indeed_rating", label: "Indeed rating", type: "rating" },
    { key: "google_rating", label: "Google rating", type: "rating" },
    { key: "linkedin_url", label: "LinkedIn", type: "url" },
    { key: "twitter_handle", label: "X / Twitter" },
    { key: "facebook_url", label: "Facebook", type: "url" },
    { key: "instagram_url", label: "Instagram", type: "url" },
  ]),
  S("contact", "Contact Information", "Who to reach", Mail, [
    { key: "contact_person_name", label: "Contact person" },
    { key: "contact_person_title", label: "Title" },
    { key: "contact_person_email", label: "Contact email" },
    { key: "contact_person_phone", label: "Contact phone" },
    { key: "primary_contact_email", label: "Primary contact email" },
    { key: "primary_phone_number", label: "Primary phone" },
  ]),
];

export function buildIntelligenceSections(profile?: JsonRecord): SectionDef[] {
  return BASE_SECTIONS.map((s, i) => ({ ...s, index: i + 1 }));
}

export const TOTAL_SECTIONS = BASE_SECTIONS.length;
