const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./lib/data/country-rules.json', 'utf8'));

const newData = data.map(rule => {
  const ageLimit = Math.max(rule.ageLimitUG || 0, rule.ageLimitPG || 0);
  return {
    id: rule.id,
    name: rule.name,
    ageLimit,
    gapYearsAccepted: rule.gapYearsAccepted,
    acceptedOlQuals: ["Pass", "Fail"],
    acceptedAlQuals: ["3S", "3C", "3B"],
    acceptedDegreeStatus: ["Completed", "Pending"],
    acceptedGpa: ["2.0", "2.5", "3.0"],
    acceptedDegreeClass: ["Second Class Lower", "Second Class Upper", "First Class"],
    englishRequirement: rule.englishRequirement,
    bankProofAndCost: rule.bankProofAndCost,
    hookScript: rule.hookScript
  };
});

fs.writeFileSync('./lib/data/country-rules.json', JSON.stringify(newData, null, 2));
console.log('JSON updated.');
