const fs = require('fs');
const { JSDOM } = require('jsdom');

// Test configuration
const TESTS = [
  { name: 'HTML file exists', points: 5 },
  { name: 'Valid HTML structure', points: 10 },
  { name: 'Semantic HTML elements', points: 25 },
  { name: 'Images with proper attributes', points: 15 },
  { name: 'Links with href attributes', points: 10 },
  { name: 'Proper heading hierarchy', points: 15 },
  { name: 'Lists (ordered and unordered)', points: 10 },
  { name: 'Text formatting elements', points: 10 }
];

let totalPoints = 0;
let maxPoints = TESTS.reduce((sum, test) => sum + test.points, 0);

function runTest(testName, testFunction, points) {
  try {
    const result = testFunction();
    if (result) {
      console.log(`✅ ${testName} (${points} points)`);
      totalPoints += points;
      return true;
    } else {
      console.log(`❌ ${testName} (0 points)`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${testName} - Error: ${error.message} (0 points)`);
    return false;
  }
}

// Test 1: Check if HTML file exists
runTest('HTML file exists', () => {
  return fs.existsSync('index.html') || fs.existsSync('main.html') || fs.existsSync('assignment.html');
}, 5);

// Find the HTML file
let htmlFile = 'index.html';
if (!fs.existsSync('index.html')) {
  if (fs.existsSync('main.html')) htmlFile = 'main.html';
  else if (fs.existsSync('assignment.html')) htmlFile = 'assignment.html';
  else {
    console.log('No HTML file found!');
    process.exit(1);
  }
}

// Read and parse HTML
const htmlContent = fs.readFileSync(htmlFile, 'utf8');
const dom = new JSDOM(htmlContent);
const document = dom.window.document;

// Test 2: Valid HTML structure
runTest('Valid HTML structure', () => {
  const hasDoctype = htmlContent.toLowerCase().includes('<!doctype html>');
  const hasHtml = document.querySelector('html');
  const hasHead = document.querySelector('head');
  const hasBody = document.querySelector('body');
  const hasTitle = document.querySelector('title');
  const hasCharset = document.querySelector('meta[charset]');
  
  return hasDoctype && hasHtml && hasHead && hasBody && hasTitle && hasCharset;
}, 10);

// Test 3: Semantic HTML elements
runTest('Semantic HTML elements', () => {
  const requiredElements = ['header', 'article', 'aside', 'footer', 'nav'];
  return requiredElements.every(element => document.querySelector(element));
}, 25);

// Test 4: Images with proper attributes
runTest('Images with proper attributes', () => {
  const images = document.querySelectorAll('img');
  if (images.length < 4) return false; // Should have at least 4 images based on expected.html
  
  return Array.from(images).every(img => {
    return img.hasAttribute('src') && 
           img.hasAttribute('alt') && 
           img.getAttribute('alt').length > 0;
  });
}, 15);

// Test 5: Links with href attributes
runTest('Links with href attributes', () => {
  const links = document.querySelectorAll('a');
  if (links.length < 4) return false; // Should have multiple links
  
  return Array.from(links).every(link => link.hasAttribute('href'));
}, 10);

// Test 6: Proper heading hierarchy
runTest('Proper heading hierarchy', () => {
  const h1 = document.querySelector('h1');
  const h2 = document.querySelector('h2');
  const h3 = document.querySelectorAll('h3');
  const h4 = document.querySelector('h4');
  
  return h1 && h2 && h3.length >= 2 && h4; // Based on expected structure
}, 15);

// Test 7: Lists (ordered and unordered)
runTest('Lists (ordered and unordered)', () => {
  const ol = document.querySelector('ol');
  const ul = document.querySelectorAll('ul');
  
  return ol && ul.length >= 2; // Should have 1 ordered list and at least 2 unordered lists
}, 10);

// Test 8: Text formatting elements
runTest('Text formatting elements', () => {
  const strong = document.querySelectorAll('strong');
  const em = document.querySelector('em');
  
  return strong.length >= 4 && em; // Based on expected structure
}, 10);

// Final score
console.log(`\n📊 Final Score: ${totalPoints}/${maxPoints} (${Math.round((totalPoints/maxPoints)*100)}%)`);

// Exit with appropriate code for GitHub Classroom
process.exit(totalPoints === maxPoints ? 0 : 1);
