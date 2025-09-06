// ============================================================================
// GAME CONFIGURATION & CONSTANTS
// ============================================================================
// All game configuration values are centralized here for easy modification

const GAME_CONFIG = {
  BOX_LABELS: ['White and White', 'Red and Red', 'Red and White'],
  BOX_CONTENTS: ['white-white', 'red-red', 'red-white'],
  MAX_ATTEMPTS: 50, // Maximum attempts to generate a valid puzzle configuration
  BOX_COUNT: 3       // Number of matchboxes in the puzzle
};

const BOX_IDS = ['matchbox-1', 'matchbox-2', 'matchbox-3'];

// ============================================================================
// GAME STATE MANAGEMENT
// ============================================================================
// Centralized state management object that tracks all game state
// This replaces multiple global variables for better organization

const GameState = {
  boxes: BOX_IDS.map(id => ({
    id,
    contents: '',
    label: '',
    element: null
  })),

  selectedBox: null,
  hasCheckedBox: false,
  userLabelSelections: BOX_IDS.reduce((acc, id) => {
    acc[id] = '';
    return acc;
  }, {}),

  reset() {
    this.selectedBox = null;
    this.hasCheckedBox = false;
    this.userLabelSelections = BOX_IDS.reduce((acc, id) => {
      acc[id] = '';
      return acc;
    }, {});
    this.boxes.forEach(box => {
      box.contents = '';
      box.label = '';
      box.element = null;
    });
  }
};

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  initializeGame();
});

// ============================================================================
// DOM ELEMENT CREATION
// ============================================================================

/**
 * Creates a matchbox div element with label and specified properties
 * @param {Object} box - The box object containing properties for the matchbox
 * @param {string} box.id - The ID to assign to the matchbox element
 * @param {string} box.label - The label text to display on the matchbox
 * @param {string} box.contents - The contents of the box (used for validation)
 * @returns {HTMLDivElement} A div element with class 'matchbox', specified ID, and label
 */
function createMatchboxDiv(box) {
  const div = document.createElement('div');
  div.className = 'matchbox';
  div.id = box.id;

  const h4 = document.createElement('h4');
  h4.id = box.id + '-label';
  h4.className = 'matchbox-label';
  h4.innerText = box.label;
  div.appendChild(h4);

  return div;
}

/**
 * Creates a list item element containing a matchbox div
 * @param {Object} box - The box object containing properties for the matchbox
 * @param {string} box.id - The ID to assign to the matchbox element
 * @param {string} box.label - The label text to display on the matchbox
 * @param {string} box.contents - The contents of the box (used for validation)
 * @returns {HTMLLIElement} A list item element with class 'matchbox-list-item' containing the matchbox div
 */
function createMatchboxListItem(box) {
  const matchbox = createMatchboxDiv(box);

  const listItem = document.createElement('li');
  listItem.className = 'matchbox-list-item';
  listItem.id = box.id + '-list-item';
  listItem.appendChild(matchbox);

  const checkButton = document.createElement('button');
  checkButton.className = 'matchbox-check-btn';
  checkButton.innerText = 'Check Box';
  checkButton.id = box.id + '-check-btn';
  listItem.appendChild(checkButton);

  return listItem;
}

/**
 * Gets the matchboxes list element from the DOM
 * @returns {HTMLElement} The matchboxes list element
 */
function getMatchboxesList() {
  return document.getElementById('matchboxes-list');
}

// ============================================================================
// GAME LOGIC & VALIDATION
// ============================================================================

/**
 * Validates that a box's contents match its label
 * @param {Object} box - The box object to validate
 * @param {string} box.label - The label on the box (e.g., "Red and White")
 * @param {string} box.contents - The actual contents of the box (e.g., "red-white")
 * @returns {boolean} True if the contents match the label, false otherwise
 */
function checkContentsMatchLabel(box) {
  const normalizedLabel = box.label.toLowerCase().replace(' and ', '-');
  return normalizedLabel === box.contents;
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Adds click event listeners to all matchbox check buttons
 */
function addCheckButtonListeners() {
  GameState.boxes.forEach(box => {
    const checkButton = document.getElementById(box.id + '-check-btn');
    if (checkButton) {
      checkButton.addEventListener('click', () => selectMatchbox(box));
    }
  });
}

/**
 * Selects a matchbox and updates the detail display
 * @param {Object} box - The box object to select
 */
function selectMatchbox(box) {
  // If a box has already been checked, don't allow another selection
  if (GameState.hasCheckedBox) {
    return;
  }

  // Mark that a box has been checked
  GameState.hasCheckedBox = true;

  // Set new selection
  GameState.selectedBox = box;

  // Add visual feedback to selected button and matchbox
  const checkButton = document.getElementById(box.id + '-check-btn');
  const matchboxElement = document.getElementById(box.id);

  if (checkButton) {
    checkButton.classList.add('selected');
    checkButton.disabled = true;
  }

  if (matchboxElement) {
    matchboxElement.classList.add('checked');
  }

  // Disable all other check buttons
  GameState.boxes.forEach(otherBox => {
    if (otherBox.id !== box.id) {
      const otherButton = document.getElementById(otherBox.id + '-check-btn');
      if (otherButton) {
        otherButton.disabled = true;
        otherButton.classList.add('disabled');
      }
    }
  });

  // Update detail display
  updateDetailDisplay(box);

  // Show label selection interface
  displayLabelSelectionInterface();
}

// ============================================================================
// DISPLAY FUNCTIONS
// ============================================================================

/**
 * Updates the detail display with the selected matchbox's content
 * @param {Object} box - The box object to display details for
 */
function updateDetailDisplay(box) {
  const detailDisplay = document.querySelector('.matchbox-detail-display');
  if (!detailDisplay) return;

  // Create content based on box properties
  const content = `
    <div class="detail-content">
      <h3>Selected Box: ${box.label}</h3>
      <div class="marble-visualization">
        <h4>Marble:</h4>
        <div class="marbles">
          ${getMarbleVisualization(box.contents)}
        </div>
      </div>
    </div>
  `;

  detailDisplay.innerHTML = content;
}

/**
 * Creates a visual representation of the marbles in a box
 * @param {string} contents - The contents string (e.g., "red-white", "white-white", "red-red")
 * @returns {string} HTML string representing the marbles
 */
function getMarbleVisualization(contents) {
  const marbles = contents.split('-');
  const randomIndex = Math.floor(Math.random() * marbles.length);
  const marble = marbles[randomIndex]; // Show a random marble
  return `<div class="marble ${marble}">${marble.charAt(0).toUpperCase() + marble.slice(1)}</div>`;
}

/**
 * Shows a placeholder message in the detail display when no box is selected
 */
function displayPlaceholderMessage() {
  const detailDisplay = document.querySelector('.matchbox-detail-display');
  if (!detailDisplay) return;

  const placeholderContent = `
		<div class="placeholder-content">
			<div class="placeholder-icon">🎯</div>
			<h3>Select a Matchbox</h3>
			<p>Click on any "Check Box" button above to see the contents of that matchbox.</p>
			<p class="placeholder-hint">Remember: You can only peek inside ONE box and look at exactly ONE marble! Once you check a box, you cannot check any others.</p>
		</div>
	`;

  detailDisplay.innerHTML = placeholderContent;
}

/**
 * Shows the label selection interface after a box has been checked
 */
function displayLabelSelectionInterface() {
  const labelSelectionContainer = document.getElementById('label-selection-container');
  if (labelSelectionContainer) {
    labelSelectionContainer.style.display = 'block';

    // Initialize dropdown options (all available initially)
    updateDropdownOptions();

    // Add event listeners to label selectors
    addLabelSelectionListeners();

    // Add event listener to submit button
    addSubmitButtonListener();

    // Add event listener to reset button
    addResetButtonListener();
  }
}

// ============================================================================
// LABEL SELECTION FUNCTIONS
// ============================================================================

/**
 * Updates dropdown options to prevent duplicate selections
 */
function updateDropdownOptions() {
  // Get all currently selected values
  const selectedValues = Object.values(GameState.userLabelSelections).filter(value => value !== '');

  GameState.boxes.forEach((box, index) => {
    const selectElement = document.getElementById(`box-${index + 1}-label-select`);
    if (selectElement) {
      const currentValue = GameState.userLabelSelections[box.id];

      // Clear all options except the placeholder
      selectElement.innerHTML = '<option value="">Select label...</option>';

      // Add options that are not selected by other dropdowns
      GAME_CONFIG.BOX_LABELS.forEach(label => {
        // Only add this label if it's not selected by another dropdown
        // OR if it's the current selection for this dropdown
        if (!selectedValues.includes(label) || label === currentValue) {
          const option = document.createElement('option');
          option.value = label;
          option.textContent = label;
          selectElement.appendChild(option);
        }
      });

      // Restore the current selection if it exists
      if (currentValue) {
        selectElement.value = currentValue;
      }
    }
  });
}

/**
 * Adds event listeners to all label select elements
 */
function addLabelSelectionListeners() {
  GameState.boxes.forEach((box, index) => {
    const selectElement = document.getElementById(`box-${index + 1}-label-select`);
    if (selectElement) {
      selectElement.addEventListener('change', (e) => {
        GameState.userLabelSelections[box.id] = e.target.value;
        updateDropdownOptions();
        updateSubmitButtonState();
      });
    }
  });
}

/**
 * Adds event listener to the submit answers button
 */
function addSubmitButtonListener() {
  const submitButton = document.getElementById('submit-answers-btn');
  if (submitButton) {
    submitButton.addEventListener('click', checkAnswers);
  }
}

/**
 * Adds event listener to the reset puzzle button
 */
function addResetButtonListener() {
  const resetButton = document.getElementById('reset-puzzle-btn');
  if (resetButton) {
    resetButton.addEventListener('click', resetPuzzle);
  }
}

/**
 * Updates the submit button state based on whether all labels are selected
 */
function updateSubmitButtonState() {
  const submitButton = document.getElementById('submit-answers-btn');
  if (!submitButton) return;

  const allSelected = Object.values(GameState.userLabelSelections).every(label => label !== '');
  submitButton.disabled = !allSelected;
  submitButton.classList.toggle('disabled', !allSelected);
}

// ============================================================================
// ANSWER CHECKING & RESULTS
// ============================================================================

/**
 * Checks the user's answers and displays results
 */
function checkAnswers() {
  const results = calculateResults();
  displayResults(results);
}

/**
 * Calculates the results of the user's label selections
 * @returns {Object} Results object with correct/incorrect information
 */
function calculateResults() {
  const results = {
    correct: 0,
    total: GameState.boxes.length,
    details: []
  };

  GameState.boxes.forEach((box, index) => {
    const userSelection = GameState.userLabelSelections[box.id];
    const correctLabel = getCorrectLabelForBox(box);
    const isCorrect = userSelection === correctLabel;

    if (isCorrect) {
      results.correct++;
    }

    results.details.push({
      boxId: box.id,
      boxNumber: index + 1,
      userSelection: userSelection,
      correctLabel: correctLabel,
      actualContents: box.contents,
      isCorrect: isCorrect
    });
  });

  return results;
}

/**
 * Determines the correct label for a box based on its actual contents
 * @param {Object} box - The box object
 * @returns {string} The correct label for the box
 */
function getCorrectLabelForBox(box) {
  const contentsToLabel = {
    'white-white': 'White and White',
    'red-red': 'Red and Red',
    'red-white': 'Red and White'
  };

  return contentsToLabel[box.contents] || '';
}

/**
 * Displays the results of the answer checking
 * @param {Object} results - The results object from calculateResults
 */
function displayResults(results) {
  const resultDisplay = document.getElementById('result-display');
  if (!resultDisplay) return;

  const isPerfect = results.correct === results.total;
  const resultClass = isPerfect ? 'success' : 'partial';

  let resultContent = `
    <div class="result-content ${resultClass}">
      <div class="result-header">
        <h3>${isPerfect ? '🎉 Congratulations!' : '📝 Results'}</h3>
        <p class="score">You got ${results.correct} out of ${results.total} correct!</p>
      </div>
      <div class="result-details">
  `;

  results.details.forEach(detail => {
    const statusIcon = detail.isCorrect ? '✅' : '❌';
    const statusClass = detail.isCorrect ? 'correct' : 'incorrect';

    resultContent += `
      <div class="result-detail ${statusClass}">
        <div class="detail-header">
          <span class="status-icon">${statusIcon}</span>
          <span class="box-name">Box ${detail.boxNumber}</span>
        </div>
        <div class="detail-content">
          <p><strong>Your answer:</strong> ${detail.userSelection}</p>
          <p><strong>Correct answer:</strong> ${detail.correctLabel}</p>
          <p><strong>Actual contents:</strong> ${formatContents(detail.actualContents)}</p>
        </div>
      </div>
    `;
  });

  resultContent += `
      </div>
      <div class="result-actions">
        <button id="play-again-btn" class="play-again-btn">Play Again</button>
      </div>
    </div>
  `;

  resultDisplay.innerHTML = resultContent;
  resultDisplay.style.display = 'block';

  // Add event listener to play again button
  const playAgainBtn = document.getElementById('play-again-btn');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', resetGame);
  }
}

/**
 * Formats the contents string for display
 * @param {string} contents - The contents string (e.g., "red-white")
 * @returns {string} Formatted contents string
 */
function formatContents(contents) {
  return contents.split('-').map(color =>
    color.charAt(0).toUpperCase() + color.slice(1)
  ).join(' and ');
}

// ============================================================================
// GAME CONTROL FUNCTIONS
// ============================================================================

/**
 * Resets the puzzle to allow user to make a new selection
 */
function resetPuzzle() {
  // Reset all variables
  GameState.reset();

  // Clear the matchboxes list
  const matchboxesList = getMatchboxesList();
  matchboxesList.innerHTML = '';

  // Hide result and label selection displays
  const resultDisplay = document.getElementById('result-display');
  const labelSelectionContainer = document.getElementById('label-selection-container');

  if (resultDisplay) resultDisplay.style.display = 'none';
  if (labelSelectionContainer) labelSelectionContainer.style.display = 'none';

  // Reset label selectors
  for (let i = 1; i <= GAME_CONFIG.BOX_COUNT; i++) {
    const selectElement = document.getElementById(`box-${i}-label-select`);
    if (selectElement) {
      selectElement.value = '';
    }
  }

  // Restore all dropdown options
  updateDropdownOptions();

  // Generate a new puzzle configuration
  generatePuzzleConfiguration();

  // Recreate the matchboxes
  GameState.boxes.forEach((box, index) => {
    box.element = createMatchboxListItem(box);
    matchboxesList.appendChild(box.element);
  });

  // Add click event listeners to all check buttons
  addCheckButtonListeners();

  // Initialize detail display with placeholder
  displayPlaceholderMessage();
}

/**
 * Resets the game to its initial state
 */
function resetGame() {
  // Reset all variables
  GameState.reset();

  // Clear the matchboxes list
  const matchboxesList = getMatchboxesList();
  matchboxesList.innerHTML = '';

  // Hide result and label selection displays
  const resultDisplay = document.getElementById('result-display');
  const labelSelectionContainer = document.getElementById('label-selection-container');

  if (resultDisplay) resultDisplay.style.display = 'none';
  if (labelSelectionContainer) labelSelectionContainer.style.display = 'none';

  // Reset label selectors
  for (let i = 1; i <= GAME_CONFIG.BOX_COUNT; i++) {
    const selectElement = document.getElementById(`box-${i}-label-select`);
    if (selectElement) {
      selectElement.value = '';
    }
  }

  // Restore all dropdown options
  updateDropdownOptions();

  // Reinitialize the game
  initializeGame();
}

/**
 * Initializes the game (extracted from DOMContentLoaded for reuse)
 */
function initializeGame() {
  const matchboxesList = getMatchboxesList();

  // Generate a valid puzzle configuration ensuring no duplicates
  generatePuzzleConfiguration();

  GameState.boxes.forEach((box, index) => {
    box.element = createMatchboxListItem(box);
    matchboxesList.appendChild(box.element);
  });

  // Add click event listeners to all check buttons
  addCheckButtonListeners();

  // Initialize detail display with placeholder
  displayPlaceholderMessage();
}

// ============================================================================
// PUZZLE GENERATION
// ============================================================================

/**
 * Generates a valid puzzle configuration ensuring no duplicate labels or contents
 * and that no box has matching contents and labels
 */
function generatePuzzleConfiguration() {
  let attempts = 0;
  const maxAttempts = GAME_CONFIG.MAX_ATTEMPTS;

  while (attempts < maxAttempts) {
    if (tryGenerateValidConfiguration()) {
      return; // Success!
    }
    attempts++;
  }

  // Fallback to guaranteed valid configuration
  setFallbackConfiguration();
}

/**
 * Attempts to generate a valid configuration by shuffling and assigning contents/labels
 * @returns {boolean} True if a valid configuration was found, false otherwise
 */
function tryGenerateValidConfiguration() {
  // Reset all boxes
  GameState.boxes.forEach(box => {
    box.contents = '';
    box.label = '';
  });

  // Shuffle available contents and labels
  const shuffledContents = [...GAME_CONFIG.BOX_CONTENTS].sort(() => Math.random() - 0.5);
  const shuffledLabels = [...GAME_CONFIG.BOX_LABELS].sort(() => Math.random() - 0.5);

  const usedContents = new Set();
  const usedLabels = new Set();

  // Try to assign contents and labels to each box
  for (const box of GameState.boxes) {
    if (!assignContentToBox(box, shuffledContents, usedContents) ||
      !assignLabelToBox(box, shuffledLabels, usedLabels)) {
      return false; // Failed to assign valid content/label
    }
  }

  return true; // Successfully assigned all boxes
}

/**
 * Assigns a content to a box from the available shuffled contents
 * @param {Object} box - The box to assign content to
 * @param {Array} shuffledContents - Array of shuffled contents
 * @param {Set} usedContents - Set of already used contents
 * @returns {boolean} True if content was assigned, false otherwise
 */
function assignContentToBox(box, shuffledContents, usedContents) {
  for (const content of shuffledContents) {
    if (!usedContents.has(content)) {
      box.contents = content;
      usedContents.add(content);
      return true;
    }
  }
  return false;
}

/**
 * Assigns a label to a box from the available shuffled labels
 * @param {Object} box - The box to assign label to
 * @param {Array} shuffledLabels - Array of shuffled labels
 * @param {Set} usedLabels - Set of already used labels
 * @returns {boolean} True if label was assigned, false otherwise
 */
function assignLabelToBox(box, shuffledLabels, usedLabels) {
  for (const label of shuffledLabels) {
    if (!usedLabels.has(label)) {
      // Check if this label would match the content (we want mismatches)
      const testBox = { contents: box.contents, label: label };
      if (!checkContentsMatchLabel(testBox)) {
        box.label = label;
        usedLabels.add(label);
        return true;
      }
    }
  }
  return false;
}

/**
 * Sets a fallback configuration that is guaranteed to be valid
 */
function setFallbackConfiguration() {
  GameState.boxes[0].contents = 'white-white';
  GameState.boxes[0].label = 'Red and Red';
  GameState.boxes[1].contents = 'red-red';
  GameState.boxes[1].label = 'Red and White';
  GameState.boxes[2].contents = 'red-white';
  GameState.boxes[2].label = 'White and White';
}
