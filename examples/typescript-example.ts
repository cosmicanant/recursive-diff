import { getDiff, applyDiff, rdiffResult } from 'recursive-diff';

function addNumbers(a: number, b: number) { 
  return a + b; 
} 
var sum: number = addNumbers(10, 4); 
console.log('Sum of the two numbers is: ' +sum); 

const x = [1, 2];
const y = 3;
const k:rdiffResult[] = getDiff([1, 2], 3);
console.log('diff', k);
const final = applyDiff(x, k);
console.log('applydiff', final);
