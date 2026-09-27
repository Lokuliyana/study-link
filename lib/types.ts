export type OLQualification = 'Pass' | 'Fail' | 'None';
export type ALQualification = '3S' | '3C' | '3B' | 'None';
export type DegreeStatus = 'Completed' | 'Pending' | "Haven't done at all";
export type GPAScore = '2.0' | '2.5' | '3.0' | 'None';
export type DegreeClass = 'Second Class Lower' | 'Second Class Upper' | 'First Class' | 'None';

export interface CustomField {
  key: string;       // e.g. "acceptedWorkExp"
  label: string;     // e.g. "Work Experience"
  options: string[]; // e.g. ["None", "1-2 years", "3+ years"]
}

export interface CountryRule {
  id: string;
  name: string;
  ageLimit: number;
  acceptedOlQuals: OLQualification[];
  acceptedAlQuals: ALQualification[];
  acceptedDegreeStatus: DegreeStatus[];
  acceptedGpa: GPAScore[];
  acceptedDegreeClass: DegreeClass[];
  englishRequirement: string;
  bankProofAndCost: string;
  hookScript: string;
  // Dynamic custom fields values, keyed by field.key
  customValues?: Record<string, string[]>;
}

export interface StudentProfile {
  age: number;
  olQual: OLQualification;
  alQual: ALQualification;
  degreeStatus: DegreeStatus;
  gpa: GPAScore;
  degreeClass: DegreeClass;
  englishTest: string;
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
