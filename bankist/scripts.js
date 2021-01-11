'use strict';

// BANKIST APP

// Data
const account1 = {
  owner: 'Muana Mola',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'de-DE', // de-DE
};

const account2 = {
  owner: 'Bolingo Lingo',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

// const account3 = {
//   owner: 'Nzinga Mpesa',
//   movements: [200, -200, 340, -300, -20, 50, 400, -460],
//   interestRate: 0.7,
//   pin: 3333,
// };

// const account4 = {
//   owner: 'Nzola Bikua',
//   movements: [430, 1000, 700, 50, 90],
//   interestRate: 1,
//   pin: 4444,
// };

const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formatMovementDate = (date) => {
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;
  else {
    const day = `${date.getDate()}`.padStart(2, 0);
    const month = `${date.getMonth() + 1}`.padStart(2, 0);
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
};

const displayMovements = (acc, sorting = false) => {
  // Empty the container first
  containerMovements.innerHTML = '';

  const movs = sorting
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((move, i) => {
    const type = move > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);

    const displayDate = formatMovementDate(date);

    const html = `
      <div class="movements__row">
          <div class="movements__type
              movements__type--${type}">${i + 1} ${type}</div>
              <div class="movements__date">${displayDate}</div>
          <div class="movements__value">${move.toFixed(2)}€</div>
      </div>`;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = (acc) => {
  acc.balance = acc.movements.reduce((ac, mov) => ac + mov, 0);

  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;
  //console.log(balance);
};

const calcDisplaySummary = (acc) => {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const outcomes = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((inte, i, arr) => inte >= 1)
    .reduce((acc, inte) => acc + inte, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = (accs) => {
  accs.forEach((acc) => {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(' ')
      .map((name) => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = (acc) => {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

// Event handler
let currentAccount;

// Fake allways logged in
currentAccount = account1;
updateUI(currentAccount);
containerApp.style.opacity = 1;

btnLogin.addEventListener('click', (e) => {
  e.preventDefault();
  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  //console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and welcome message
    labelWelcome.textContent = `Welcombe back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      week: 'long',
    };
    labelDate.textContent = new Intl.DateTimeFormat(locale, options).format(
      now
    );

    // Create current date and time
    // const now = new Date();
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hour = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${month}/${year} ${hour}:${min}`;

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    // Updating the UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();

  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  // Clear input fields
  inputTransferTo.value = inputTransferAmount.value = '';
  inputTransferAmount.blur();

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    // Doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Add transfer date
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAcc.movementsDates.push(new Date().toISOString());

    // Updating the UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', (e) => {
  e.preventDefault();

  const amount = +inputLoanAmount.value;

  let percent = currentAccount.movements.some((mov) => mov >= amount * 0.1);
  if (amount > 0 && percent) {
    // Add movements
    currentAccount.movements.push(amount);

    // Add loan date
    currentAccount.movementsDates.push(new Date().toISOString());

    // Update the UI
    updateUI(currentAccount);
  }

  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', (e) => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    updateUI(currentAccount);
    // Delete account
    accounts.splice(index, 1);
    console.log(currentAccount);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', (e) => {
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
  console.log('Sorted');
});
