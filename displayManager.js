// displayManager.js
const CARDS_PER_PAGE = 10;
let currentPage = 0;

export function updateDisplay(cards, container, infoElement, controls) {
  const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE) * 2;
  container.innerHTML = '';
  const isTermPage = currentPage % 2 === 0;
  const setIndex = Math.floor(currentPage / 2);
  const startIdx = setIndex * CARDS_PER_PAGE;

  infoElement.textContent = `Page ${currentPage + 1} of ${totalPages} - ${isTermPage ? 'Terms' : 'Definitions'}`;
  infoElement.classList.remove('hidden');
  controls.classList.remove('hidden');

  const grid = document.createElement('div');
  grid.className = 'flashcard-grid';

  for (let i = 0; i < CARDS_PER_PAGE; i++) {
    const itemIndex = startIdx + i;
    if (itemIndex >= cards.length) break;

    const cardData = cards[itemIndex];
    const card = document.createElement('div');
    card.className = 'card-item';
    const label = isTermPage ? `TERM ${itemIndex + 1}` : `DEFINITION ${itemIndex + 1}`;
    const content = isTermPage ? cardData.term : cardData.definition;
    card.innerHTML = `<span class="label">${label}</span>${content.replace(/\n/g, '<br>')}`;
    grid.appendChild(card);
  }

  container.appendChild(grid);
}

export function setupPagination(nextBtn, prevBtn, onChange) {
  nextBtn.addEventListener('click', () => {
    currentPage++;
    onChange(currentPage);
  });
  prevBtn.addEventListener('click', () => {
    currentPage--;
    onChange(currentPage);
  });
}

export function resetPage() {
  currentPage = 0;
}
