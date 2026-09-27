import { StudentProfile, CountryRule } from './types';

export function matchCountries(profile: StudentProfile, rules: CountryRule[]): CountryRule[] {
  return rules.filter(rule => {
    // 1. Age Limit
    if (profile.age && profile.age > rule.ageLimit) return false;

    // 2. O/L
    if (profile.olQual && profile.olQual !== 'None' && rule.acceptedOlQuals?.length > 0) {
      if (!rule.acceptedOlQuals.includes(profile.olQual)) return false;
    }

    // 3. A/L
    if (profile.alQual && profile.alQual !== 'None' && rule.acceptedAlQuals?.length > 0) {
      if (!rule.acceptedAlQuals.includes(profile.alQual)) return false;
    }

    // 4. Degree Status
    if (rule.acceptedDegreeStatus?.length > 0) {
      if (!rule.acceptedDegreeStatus.includes(profile.degreeStatus)) return false;
    }

    // 5. GPA (only relevant if degree is completed/pending)
    if (profile.gpa && profile.gpa !== 'None' && rule.acceptedGpa?.length > 0) {
      if (!rule.acceptedGpa.includes(profile.gpa)) return false;
    }

    // 6. Degree Class
    if (profile.degreeClass && profile.degreeClass !== 'None' && rule.acceptedDegreeClass?.length > 0) {
      if (!rule.acceptedDegreeClass.includes(profile.degreeClass)) return false;
    }

    // 7. Custom dynamic fields
    if (profile.customValues && rule.customValues) {
      for (const key of Object.keys(profile.customValues)) {
        const profileVal = profile.customValues[key];
        const ruleAccepted = rule.customValues[key];
        if (profileVal && ruleAccepted && ruleAccepted.length > 0) {
          if (!ruleAccepted.includes(profileVal)) return false;
        }
      }
    }

    // 8. English Test
    if (profile.englishTest === 'None') {
      if (rule.id === 'germany' || rule.id === 'ireland') return false;
    }

    return true;
  });
}
