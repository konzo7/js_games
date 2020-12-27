'use strict';

const checkbtn = document.querySelector('.check');
let score = 20;
let highScore = 0;

const displaMessage = (message) => {
  document.querySelector('.message').textContent = message;
};

const setNumberTextContent = (value) => {
  document.querySelector('.number').textContent = value;
};

const setNumberStyle = (value) => {
  document.querySelector('.number').style.width = value;
};

const setScore = (score) => {
  document.querySelector('.score').textContent = score;
};

// The secret random number
let secretNum = Math.trunc(Math.random() * 20) + 1;

checkbtn.addEventListener('click', () => {
  const guess = Number(document.querySelector('.guess').value);

  if (!guess) {
    displaMessage('No number! Pass in a number!');
  } else if (guess === secretNum) {
    displaMessage('The Number is correct!');
    setNumberTextContent(secretNum);

    document.querySelector('body').style.backgroundColor = '#60b347';
    setNumberStyle('30rem');

    if (score > highScore) {
      highScore = score;

      document.querySelector('.highscore').textContent = highScore;
    }
  } else if (guess !== secretNum) {
    if (score > 1) {
      document.querySelector('.message').textContent =
        guess > secretNum ? 'Too high!' : 'Too low!';
      setScore(--score);
    } else {
      displaMessage('You have lost the game!');
      setScore(0);
    }
  }
});

// Resting the game
const replay = document.querySelector('.again');

replay.addEventListener('click', () => {
  displaMessage('Start guessing..');
  score = 20;

  setScore(score);

  document.querySelector('.guess').value = '';

  document.querySelector('body').style.backgroundColor = '#000';

  setNumberStyle('15rem');
  setNumberTextContent('?');

  secretNum = Math.trunc(Math.random() * 20) + 1;
});
