// main.js
import { updateAuthUI } from './authUI.js';
import { saveFlashcardSet, loadSet } from './flashcardData.js';
import { updateDisplay, setupPagination, resetPage } from './displayManager.js';

document.addEventListener('DOMContentLoaded', async () => {
  await updateAuthUI();

  const displayArea = document.getElementById('flashcard-display');
  const cardsContainer = document.getElementById('cards-container');
  const pageInfo = document.getElementById('page-info');
  const controls = document.querySelector('.controls');
  const nextBtn = document.getElementById('next-page');
  const prevBtn = document.getElementById('prev-page');

  const exampleCards = [
    { term: 'JavaScript', definition: 'A scripting language for web development' },
    { term: 'DOM', definition: 'Document Object Model' }
  ];

  updateDisplay(exampleCards, cardsContainer, pageInfo, controls);
  setupPagination(nextBtn, prevBtn, () => {
    updateDisplay(exampleCards, cardsContainer, pageInfo, controls);
  });
});
