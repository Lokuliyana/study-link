export type OLQualification = 'Pass' | 'Fail' | 'None';
export type ALQualification = '3S' | '3C' | '3B' | 'None';
export type DegreeStatus = 'Completed' | 'Pending' | "Haven't done at all";
export type GPAScore = '2.0' | '2.5' | '3.0' | 'None';
export type DegreeClass = 'Second Class Lower' | 'Second Class Upper' | 'First Class' | 'None';
export type StudyLevel = 'UG' | 'PG' | 'Either';

export interface CustomField {
  key: string;
  label: string;
  options: string[];
}

export interface CountryRule {
  id: string;
  name: string;
  // Separate age limits for UG and PG
  ageLimitUG: number;
  ageLimitPG: number;
  // UG qualification gates
  acceptedOlQuals: OLQualification[];
  acceptedAlQuals: ALQualification[];
  // PG qualification gates
  acceptedDegreeStatus: DegreeStatus[];
  acceptedGpa: GPAScore[];
  acceptedDegreeClass: DegreeClass[];
  englishRequirement: string;
  bankProofAndCost: string;
  hookScript: string;
  customValues?: Record<string, string[]>;
}

// Returned by matcher — annotates which level each country is eligible for
export interface EligibleCountry extends CountryRule {
  eligibleFor: 'UG' | 'PG' | 'Both';
}

export interface StudentProfile {
  age: number;
  olQual: OLQualification;
  alQual: ALQualification;
  degreeStatus: DegreeStatus;
  gpa: GPAScore;
  degreeClass: DegreeClass;
  englishTest: string;
  // New expanded profile fields (not used in matching — stored for counselor reference)
  studyGap?: string;
  workExperience?: string;
  preferredField?: string;
  preferredStudyLevel?: StudyLevel;
  budget?: string;
  preferredCountry?: string;
  otherRequirements?: string;
  // Dynamic custom field values
  customValues?: Record<string, string>;
}

export type PipelineStage = 'New Lead' | 'Triaged' | 'Appointment Set' | 'File Opened' | 'Visa Lodged' | 'Closed / Enrolled';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  appointmentDate?: string;
  appointmentTime?: string;
  stage: PipelineStage;
  matchedCountry?: string;
  createdAt: string;
  needsFollowUp?: boolean;
  profile?: StudentProfile;
}
