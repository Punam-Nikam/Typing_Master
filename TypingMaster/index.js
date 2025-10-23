const quotes = [
  'The quick brown fox jumps over the lazy dog.',
  'Practice makes a man perfect.',
  'Never give up because great things take time.',
  'Believe you can and you are halfway there.',
  'There is nothing more deceptive than an obvious fact.', 
  'I ought to know by this time that when a fact appears to be opposed to a long train of deductions it invariably proves to be capable of bearing some other interpretation.',
  'I never make exceptions. An exception disproves the rule.', 
  'What one man can invent another can discover.', 
  'Nothing clears up a case so much as stating it to another person.',
  'Education never ends, Watson. It is a series of lessons, with the greatest for the last.',
  'Success is not final, failure is not fatal,it is the courage to continue that counts.'
];

let words = [];
let wordIndex = 0;
let quoteIndex = 0;
let startTime = 0;
let totalTypedChars = 0;
let totalErrors = 0;
let gameRunning = false;

// UI elements
const quoteElement = document.getElementById('quote');
const messageElement = document.getElementById('message');
const typedValueElement = document.getElementById('typed-value');
const startButton = document.getElementById('start');
const endButton = document.getElementById('end');

// Start game
startButton.addEventListener('click', startGame);
endButton.addEventListener('click', endGame);

function startGame() {
  quoteIndex = 0;
  totalTypedChars = 0;
  totalErrors = 0;
  startTime = new Date().getTime();
  messageElement.innerText = '';
  typedValueElement.disabled = false;
  gameRunning = true;
  endButton.disabled = false;
  showNextQuote();
}

function showNextQuote() {
  if (quoteIndex >= quotes.length) {
    endGame();
    return;
  }

  words = quotes[quoteIndex].split(' ');
  wordIndex = 0;

  const spanWords = words.map(word => `<span>${word} </span>`);
  quoteElement.innerHTML = spanWords.join('');
  quoteElement.childNodes[0].className = 'highlight';

  typedValueElement.value = '';
  typedValueElement.focus();
}

function endGame() {
  if (!gameRunning) return;

  gameRunning = false;
  const totalTime = (new Date().getTime() - startTime) / 1000; // seconds
  const totalWords = quotes.slice(0, quoteIndex + 1).join(' ').split(' ').length;
  const wpm = (totalWords / totalTime) * 60;
  const accuracy = totalTypedChars > 0
    ? ((totalTypedChars - totalErrors) / totalTypedChars) * 100
    : 0;

  messageElement.innerHTML = `
    🏁 <b>Practice Ended!</b><br>
    ⏱ Time: ${totalTime.toFixed(2)} sec<br>
    💨 Speed: ${wpm.toFixed(1)} WPM<br>
    🎯 Accuracy: ${accuracy.toFixed(2)}%
  `;

  quoteElement.innerHTML = '';
  typedValueElement.value = '';
  typedValueElement.disabled = true;
  endButton.disabled = true;
}

typedValueElement.addEventListener('input', () => {
  if (!gameRunning) return;

  const currentWord = words[wordIndex];
  const typedValue = typedValueElement.value;

  totalTypedChars++;

  if (typedValue === currentWord && wordIndex === words.length - 1) {
    quoteIndex++;
    showNextQuote();
  } 
  else if (typedValue.endsWith(' ') && typedValue.trim() === currentWord) {
    typedValueElement.value = '';
    wordIndex++;

    for (const wordElement of quoteElement.childNodes) {
      wordElement.className = '';
    }
    quoteElement.childNodes[wordIndex]?.classList.add('highlight');
  } 
  else if (currentWord.startsWith(typedValue)) {
    typedValueElement.className = '';
  } 
  else {
    typedValueElement.className = 'error';
    totalErrors++;
  }
});
