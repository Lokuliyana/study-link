import { StudentProfile, CountryRule, EligibleCountry } from './types';

export function matchCountries(profile: StudentProfile, rules: CountryRule[]): EligibleCountry[] {
  const results: EligibleCountry[] = [];

  for (const rule of rules) {
    const ugEligible = checkUGEligibility(profile, rule);
    const pgEligible = checkPGEligibility(profile, rule);

    if (!ugEligible && !pgEligible) continue;

    const eligibleFor = ugEligible && pgEligible ? 'Both' : ugEligible ? 'UG' : 'PG';
    results.push({ ...rule, eligibleFor });
  }

  return results;
}

function checkUGEligibility(profile: StudentProfile, rule: CountryRule): boolean {
  // Age check for UG
  if (profile.age && profile.age > rule.ageLimitUG) return false;

  // O/L check
  if (profile.olQual && profile.olQual !== 'None' && rule.acceptedOlQuals?.length > 0) {
    if (!rule.acceptedOlQuals.includes(profile.olQual)) return false;
  }

  // A/L check
  if (profile.alQual && profile.alQual !== 'None' && rule.acceptedAlQuals?.length > 0) {
    if (!rule.acceptedAlQuals.includes(profile.alQual)) return false;
  }

  // English
  if (profile.englishTest === 'None') {
    if (rule.id === 'germany' || rule.id === 'ireland') return false;
  }

  return checkCustomFields(profile, rule);
}

function checkPGEligibility(profile: StudentProfile, rule: CountryRule): boolean {
  // Age check for PG
  if (profile.age && profile.age > rule.ageLimitPG) return false;

  // For PG, degree status is critical
  if (rule.acceptedDegreeStatus?.length > 0) {
    if (!rule.acceptedDegreeStatus.includes(profile.degreeStatus)) return false;
  }

  // GPA
  if (profile.gpa && profile.gpa !== 'None' && rule.acceptedGpa?.length > 0) {
    if (!rule.acceptedGpa.includes(profile.gpa)) return false;
  }

  // Degree class
  if (profile.degreeClass && profile.degreeClass !== 'None' && rule.acceptedDegreeClass?.length > 0) {
    if (!rule.acceptedDegreeClass.includes(profile.degreeClass)) return false;
  }

  // English
  if (profile.englishTest === 'None') {
    if (rule.id === 'germany' || rule.id === 'ireland') return false;
  }

  return checkCustomFields(profile, rule);
}

function checkCustomFields(profile: StudentProfile, rule: CountryRule): boolean {
  if (profile.customValues && rule.customValues) {
    for (const key of Object.keys(profile.customValues)) {
      const profileVal = profile.customValues[key];
      const ruleAccepted = rule.customValues[key];
      if (profileVal && ruleAccepted && ruleAccepted.length > 0) {
        if (!ruleAccepted.includes(profileVal)) return false;
      }
    }
  }
  return true;
}
