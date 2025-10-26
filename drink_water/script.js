// --- Element Selectors ---
const cupsContainer = document.getElementById('cups-container');
const liters = document.getElementById('liters');
const percentage = document.getElementById('percentage');
const remained = document.getElementById('remained');
const goalInput = document.getElementById('goal');
const resetButton = document.getElementById('reset-btn');
const celebration = document.getElementById('celebration');

// --- Constants and State ---
const CUP_SIZE_ML = 250;
let goalLiters = parseFloat(localStorage.getItem('waterGoal')) || 2;
goalInput.value = goalLiters;
let smallCups = []; // This will be populated dynamically

// --- Functions ---

/**
 * Generates the small cup buttons based on the daily goal.
 */
function generateCups() {
    cupsContainer.innerHTML = ''; // Clear existing cups
    const numCups = Math.ceil((goalLiters * 1000) / CUP_SIZE_ML);

    for (let i = 0; i < numCups; i++) {
        const cup = document.createElement('button'); // Use <button> for accessibility
        cup.classList.add('cup', 'cup-small');
        cup.innerText = `${CUP_SIZE_ML} ml`;
        cup.addEventListener('click', () => highlightCups(i));
        cupsContainer.appendChild(cup);
    }
    
    smallCups = document.querySelectorAll('.cup-small');
}

/**
 * Toggles the 'full' class on cups up to the clicked index.
 * @param {number} idx - The index of the clicked cup.
 */
function highlightCups(idx) {
    // If the clicked cup is full and is the last filled one, unfill it.
    if (smallCups[idx].classList.contains('full') && (idx === smallCups.length - 1 || !smallCups[idx + 1].classList.contains('full'))) {
        idx--;
    }

    smallCups.forEach((cup, idx2) => {
        cup.classList.toggle('full', idx2 <= idx);
    });

    updateBigCup();
}

/**
 * Updates the main cup display based on filled cups.
 */
function updateBigCup() {
    const fullCups = document.querySelectorAll('.cup-small.full').length;
    const litersDrank = (CUP_SIZE_ML * fullCups) / 1000;

    if (fullCups === 0) {
        percentage.style.visibility = 'hidden';
        percentage.style.height = 0;
    } else {
        percentage.style.visibility = 'visible';
        const percentComplete = Math.min((litersDrank / goalLiters) * 100, 100);
        const bigCupHeight = 330; // Max height of the big cup
        percentage.style.height = `${(percentComplete / 100) * bigCupHeight}px`;
        percentage.innerText = `${Math.round(percentComplete)}%`;
    }

    // Check if the goal is met to trigger celebration
    if (litersDrank >= goalLiters) {
        remained.style.visibility = 'hidden';
        remained.style.height = 0;
        if (!celebration.classList.contains('show')) {
            triggerCelebration();
        }
    } else {
        remained.style.visibility = 'visible';
        const litersRemaining = goalLiters - litersDrank;
        liters.innerText = `${litersRemaining.toFixed(2)}L`;
    }
}

/**
 * Shows the celebration animation.
 */
function triggerCelebration() {
    celebration.classList.remove('hidden');
    celebration.classList.add('show');
    setTimeout(() => {
        celebration.classList.remove('show');
        celebration.classList.add('hidden');
    }, 1500); // Must match the animation duration in CSS
}

/**
 * Resets the cups to empty.
 */
function reset() {
    smallCups.forEach(cup => cup.classList.remove('full'));
    updateBigCup();
}

// --- Event Listeners ---
resetButton.addEventListener('click', reset);

goalInput.addEventListener('input', (e) => {
    const newGoal = parseFloat(e.target.value);
    if (newGoal && newGoal > 0) {
        goalLiters = newGoal;
        localStorage.setItem('waterGoal', goalLiters);
        generateCups(); // Regenerate cups for the new goal
        updateBigCup();
    }
});


// --- Initial App Start ---
function init() {
    generateCups();
    updateBigCup();
}

init();