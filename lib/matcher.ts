import { StudentProfile, CountryRule } from './types';

export function matchCountries(profile: StudentProfile, rules: CountryRule[]): CountryRule[] {
  return rules.filter(rule => {
    // 1. Age Limit
    if (profile.age > rule.ageLimit) return false;

    // 2. Gap Years
    if (profile.gapYears > rule.gapYearsAccepted) return false;

    // 3. Qualifications
    if (rule.acceptedOlQuals?.length > 0) {
      if (!rule.acceptedOlQuals.includes(profile.olQual)) return false;
    }

    if (rule.acceptedAlQuals?.length > 0) {
      if (!rule.acceptedAlQuals.includes(profile.alQual)) return false;
    }

    if (rule.acceptedDegreeStatus?.length > 0) {
      if (!rule.acceptedDegreeStatus.includes(profile.degreeStatus)) return false;
    }

    if (rule.acceptedGpa?.length > 0) {
      if (!rule.acceptedGpa.includes(profile.gpa)) return false;
    }

    if (rule.acceptedDegreeClass?.length > 0) {
      if (!rule.acceptedDegreeClass.includes(profile.degreeClass)) return false;
    }

    // 4. English Test
    if (profile.englishTest === 'None') {
      // Basic strict check. We could make this an array property on rules too, but this suffices for now.
      if (rule.id === 'germany' || rule.id === 'ireland') return false;
    }

    return true;
  });
}
