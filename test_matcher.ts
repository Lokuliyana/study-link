import { matchCountries } from './lib/matcher';
import { StudentProfile, CountryRule } from './lib/types';

const rules: CountryRule[] = [
  {
    id: 'test',
    name: 'Test Country',
    ageLimit: 30,
    gapYearsAccepted: 5,
    acceptedOlQuals: ['Pass'], // only accepts Pass
    acceptedAlQuals: [],
    acceptedDegreeStatus: [],
    acceptedGpa: [],
    acceptedDegreeClass: [],
    englishRequirement: 'None',
    bankProofAndCost: 'None',
    hookScript: 'None'
  }
];

const profile: StudentProfile = {
  age: 20,
  gapYears: 0,
  olQual: 'None',
  alQual: '3S',
  degreeStatus: "Haven't done at all",
  gpa: 'None',
  degreeClass: 'None',
  englishTest: 'None'
};

console.log(matchCountries(profile, rules));
