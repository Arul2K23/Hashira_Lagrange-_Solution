
const data = require('./testcase2.json');

const { n, k } = data.keys;
console.log(`\n Config → n: ${n} (total shares), k: ${k} (threshold)\n`);

function decodePoint(id, entry) {
  const x = parseInt(id);
  const y = parseInt(entry.value, parseInt(entry.base));
  return { x, y };
}

const allPoints = Object.entries(data)
  .filter(([key]) => key !== 'keys')     
  .map(([key, val]) => decodePoint(key, val));

console.log(' Decoded Points:');
allPoints.forEach(p =>
  console.log(`   x = ${p.x},  y = ${p.y}`)
);

const points = allPoints.slice(0, k);
console.log(`\n Using first ${k} points for interpolation:`);
points.forEach(p => console.log(`   (${p.x}, ${p.y})`));

function lagrangeAtZero(points) {
  const xVals = points.map(p => p.x);
  const yVals = points.map(p => p.y);
  let secret = 0;

  for (let i = 0; i < points.length; i++) {
    let numerator   = 1;
    let denominator = 1;

    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;

      numerator   *= (0 - xVals[j]);
      denominator *= (xVals[i] - xVals[j]);
    }

    const lagrangeBasis = numerator / denominator;
    secret += yVals[i] * lagrangeBasis;
    
    // console.log(`\n   L_${i}(0):`);
    // console.log(`     Numerator   = ${numerator}`);
    // console.log(`     Denominator = ${denominator}`);
    // console.log(`     Basis       = ${lagrangeBasis.toFixed(6)}`);
    // console.log(`     Term        = ${yVals[i]} × ${lagrangeBasis.toFixed(6)} = ${(yVals[i] * lagrangeBasis).toFixed(6)}`);
  }

  return Math.round(secret); 
}

console.log('\nLagrange Interpolation Steps:');
const secret = lagrangeAtZero(points);

console.log('\n─────────────────────────────────────');
console.log(` Constant Term f(0) = SECRET = ${secret}`);
console.log('─────────────────────────────────────\n');