export type UGQualification = 'O/L Only' | 'A/L (2 Passes)' | 'A/L (3 Passes)' | 'A/L (High Grades)' | 'Foundation';
export type PGQualification = 'Diploma' | '3-Year Degree' | '4-Year Degree' | 'High GPA Degree';

export interface CountryRule {
  id: string;
  name: string;
  ageLimitUG: number;
  ageLimitPG: number;
  gapYearsAccepted: number;
  acceptedUgQuals: UGQualification[];
  acceptedPgQuals: PGQualification[];
  englishRequirement: string;
  bankProofAndCost: string;
  hookScript: string;
}

export interface StudentProfile {
  age: number;
  gapYears: number;
  level: 'UG' | 'PG';
  ugQual?: UGQualification;
  pgQual?: PGQualification;
  englishTest: string;
}

export type PipelineStage = 'New Lead' | 'Triaged' | 'Appointment Set' | 'File Opened' | 'Visa Lodged' | 'Closed / Enrolled';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  targetIntake: string;
  stage: PipelineStage;
  matchedCountry?: string;
  createdAt: string;
  needsFollowUp?: boolean;
}
