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
  const manualInputArea = document.getElementById('manual-input-area');
  const termDefInputs = document.getElementById('term-def-inputs');
  const setNameInput = document.getElementById('modal-set-name-input');

  const urlParams = new URLSearchParams(window.location.search);
  const setId = urlParams.get('set_id');

  let flashcardData = [];

  if (setId) {
    try {
      const { title, cards } = await loadSet(setId);
      setNameInput.value = title;

      // Remove any existing rows
      termDefInputs.innerHTML = '';

      // Populate each card into manual input UI
      cards.forEach((card, index) => {
        const row = document.createElement('div');
        row.className = 'input-row';
        row.innerHTML = `
          <input type="text" class="term" placeholder="Term ${index + 1}" value="${card.term}" />
          <input type="text" class="definition" placeholder="Definition ${index + 1}" value="${card.definition}" />
          <button type="button" class="delete-row-btn">Delete</button>
        `;
        termDefInputs.appendChild(row);
      });

      flashcardData = [...cards];

      // Show manual input area (optional)
      manualInputArea.classList.remove('hidden');
    } catch (err) {
      console.error('Failed to load set:', err);
    }
  } else {
    // Optionally load default state if no setId
    flashcardData = [
      { term: 'JavaScript', definition: 'A scripting language for web development' },
      { term: 'DOM', definition: 'Document Object Model' }
    ];
  }

  updateDisplay(flashcardData, cardsContainer, pageInfo, controls);

  setupPagination(nextBtn, prevBtn, () => {
    updateDisplay(flashcardData, cardsContainer, pageInfo, controls);
  });
});
