'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const closeModalBtn = document.querySelector('.close-modal');
const showModalBtn = document.querySelectorAll('.show-modal');

const openModal = (showModal) => {
  showModal.addEventListener('click', () => {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  });
};

const closeModal = () => {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

showModalBtn.forEach(openModal);
closeModalBtn.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
