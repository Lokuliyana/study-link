import { StudentProfile, CountryRule } from './types';

export function matchCountries(profile: StudentProfile, rules: CountryRule[]): CountryRule[] {
  return rules.filter(rule => {
    // 1. Age Limit
    const ageLimit = profile.level === 'UG' ? rule.ageLimitUG : rule.ageLimitPG;
    if (profile.age > ageLimit) return false;

    // 2. Gap Years
    if (profile.gapYears > rule.gapYearsAccepted) return false;

    // 3. Qualifications
    if (profile.level === 'UG' && profile.ugQual) {
      if (!rule.acceptedUgQuals.includes(profile.ugQual)) return false;
    }

    if (profile.level === 'PG' && profile.pgQual) {
      if (!rule.acceptedPgQuals.includes(profile.pgQual)) return false;
    }

    // 4. English Test
    if (profile.englishTest === 'None') {
      // Basic strict check. We could make this an array property on rules too, but this suffices for now.
      if (rule.id === 'germany' || rule.id === 'ireland') return false;
    }

    return true;
  });
}
