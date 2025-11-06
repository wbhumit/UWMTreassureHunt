// UWM Treasure Hunt - Game Logic
// Educational demonstration for UWM Data Science Club

/**
 * GAME STATE MANAGEMENT
 * Uses sessionStorage to persist game state across page reloads
 * State includes: current location, found locations, start time, etc.
 */

// Game state object
let gameState = {
    currentLocationId: 1,
    foundLocations: [],
    startTime: null,
    isGameActive: false,
    timerInterval: null
};

// QR Scanner instance
let html5QrCode = null;
let isScanning = false;

/**
 * INITIALIZATION
 * Load game state and check for QR code redirects
 */
document.addEventListener('DOMContentLoaded', () => {
    // Load saved game state
    loadGameState();

    // Check if redirected from a QR code scan (URL parameter)
    const urlParams = new URLSearchParams(window.location.search);
    const locationId = urlParams.get('location');

    if (locationId) {
        // Remove the URL parameter for cleaner URLs
        window.history.replaceState({}, document.title, window.location.pathname);

        // If game is active, verify the scanned location
        if (gameState.isGameActive) {
            verifyLocation(parseInt(locationId));
        } else {
            // Start the game if not active
            startGame();
        }
    }

    // Display best time if available
    displayBestTime();
});

/**
 * GAME STATE PERSISTENCE
 * Save and load game state from sessionStorage
 */

function saveGameState() {
    sessionStorage.setItem('uwmTreasureHunt', JSON.stringify({
        currentLocationId: gameState.currentLocationId,
        foundLocations: gameState.foundLocations,
        startTime: gameState.startTime,
        isGameActive: gameState.isGameActive
    }));
}

function loadGameState() {
    const saved = sessionStorage.getItem('uwmTreasureHunt');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            gameState.currentLocationId = parsed.currentLocationId || 1;
            gameState.foundLocations = parsed.foundLocations || [];
            gameState.startTime = parsed.startTime;
            gameState.isGameActive = parsed.isGameActive || false;

            // Resume game if it was active
            if (gameState.isGameActive) {
                showScreen('clue-screen');
                updateProgress();
                updateClueDisplay();
                startTimer();
            }
        } catch (error) {
            console.error('Error loading game state:', error);
            resetGameState();
        }
    }
}

function resetGameState() {
    gameState = {
        currentLocationId: 1,
        foundLocations: [],
        startTime: null,
        isGameActive: false,
        timerInterval: null
    };
    sessionStorage.removeItem('uwmTreasureHunt');
}

/**
 * SCREEN NAVIGATION
 * Show/hide different game screens
 */

function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Show the requested screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
    }

    // Special handling for certain screens
    if (screenId === 'clue-screen' || screenId === 'found-screen' || screenId === 'victory-screen') {
        document.getElementById('progress-container').style.display = 'block';
    } else {
        document.getElementById('progress-container').style.display = 'none';
    }
}

/**
 * GAME FLOW FUNCTIONS
 */

async function startGame() {
    // Reset game state
    resetGameState();

    gameState.isGameActive = true;
    gameState.startTime = Date.now();
    gameState.currentLocationId = 1;

    saveGameState();

    // Show clue screen and start timer
    showScreen('clue-screen');
    updateProgress();
    updateClueDisplay();
    startTimer();
}

async function updateClueDisplay() {
    try {
        // Fetch the current location data
        const response = await fetch(`/api/location/${gameState.currentLocationId}`);
        const location = await response.json();

        // For the first location, show the start clue
        if (gameState.currentLocationId === 1 && gameState.foundLocations.length === 0) {
            document.getElementById('current-clue').textContent = location.startClue;
        } else {
            // This shouldn't happen in normal flow, but just in case
            document.getElementById('current-clue').textContent = "Scan the QR code at your current location to continue.";
        }

        document.getElementById('current-location-number').textContent = gameState.currentLocationId;

    } catch (error) {
        console.error('Error loading clue:', error);
        showError('Failed to load location data. Please try again.');
    }
}

function updateProgress() {
    const foundCount = gameState.foundLocations.length;
    const totalLocations = 10;
    const percentage = (foundCount / totalLocations) * 100;

    document.getElementById('progress-fill').style.width = percentage + '%';
    document.getElementById('progress-text').textContent = `${foundCount}/${totalLocations} Locations Found`;
}

/**
 * QR CODE SCANNER
 * Uses html5-qrcode library for camera-based scanning
 */

async function openScanner() {
    showScreen('scanner-screen');

    try {
        // Initialize QR scanner if not already created
        if (!html5QrCode) {
            html5QrCode = new Html5Qrcode("reader");
        }

        // Start scanning
        if (!isScanning) {
            await html5QrCode.start(
                { facingMode: "environment" }, // Use back camera on mobile
                {
                    fps: 10, // Scans per second
                    qrbox: { width: 250, height: 250 } // Scanning area
                },
                onScanSuccess,
                onScanError
            );
            isScanning = true;
            updateScannerStatus('Scanning... Position QR code in the frame');
        }

    } catch (error) {
        console.error('Scanner error:', error);

        if (error.name === 'NotAllowedError') {
            showError('Camera access denied. Please allow camera access and try again.');
        } else if (error.name === 'NotFoundError') {
            showError('No camera found on this device.');
        } else {
            showError('Failed to start camera: ' + error.message);
        }

        closeScanner();
    }
}

function onScanSuccess(decodedText, decodedResult) {
    // Extract location ID from the URL
    // Expected format: http://domain/location/1 or https://domain/location/1
    const match = decodedText.match(/\/location\/(\d+)/);

    if (match) {
        const scannedLocationId = parseInt(match[1]);
        console.log('Scanned location:', scannedLocationId);

        // Stop scanning and verify location
        closeScanner();
        verifyLocation(scannedLocationId);
    } else {
        updateScannerStatus('Invalid QR code. Please scan a UWM Treasure Hunt code.');
    }
}

function onScanError(errorMessage) {
    // Scan errors are normal and happen continuously while scanning
    // We only log them for debugging, don't show to user
    // console.log('Scan error:', errorMessage);
}

function updateScannerStatus(message) {
    const statusElement = document.getElementById('scanner-status');
    if (statusElement) {
        statusElement.innerHTML = `<p>${message}</p>`;
    }
}

async function closeScanner() {
    if (html5QrCode && isScanning) {
        try {
            await html5QrCode.stop();
            isScanning = false;
        } catch (error) {
            console.error('Error stopping scanner:', error);
        }
    }
    showScreen('clue-screen');
}

/**
 * LOCATION VERIFICATION
 * Verify scanned QR code matches expected location
 */

async function verifyLocation(scannedLocationId) {
    try {
        // Check if this is the correct location
        if (scannedLocationId !== gameState.currentLocationId) {
            showError(`Wrong location! You scanned location ${scannedLocationId}, but you need to find location ${gameState.currentLocationId}.`);
            return;
        }

        // Fetch location details
        const response = await fetch(`/api/location/${scannedLocationId}`);
        const location = await response.json();

        // Mark location as found
        gameState.foundLocations.push(scannedLocationId);
        saveGameState();

        // Display location found screen
        displayLocationFound(location);

        // Update progress
        updateProgress();

    } catch (error) {
        console.error('Error verifying location:', error);
        showError('Failed to verify location. Please try again.');
    }
}

function displayLocationFound(location) {
    showScreen('found-screen');

    // Display location name and fun fact
    document.getElementById('found-location-name').textContent = location.name;
    document.getElementById('fun-fact').textContent = location.funFact;

    // Check if this is the last location
    if (location.isLast) {
        // Hide next clue, show victory button
        document.getElementById('next-clue-container').style.display = 'none';
        document.getElementById('continue-btn').textContent = 'See Results! 🏆';
    } else {
        // Show next clue
        document.getElementById('next-clue-container').style.display = 'block';
        document.getElementById('next-clue').textContent = location.clue;
        document.getElementById('continue-btn').textContent = 'Continue Hunt →';
    }
}

async function continueToNextLocation() {
    // Check if game is complete
    if (gameState.foundLocations.length >= 10) {
        showVictory();
    } else {
        // Move to next location
        gameState.currentLocationId++;
        saveGameState();

        // Show clue screen
        showScreen('clue-screen');
        updateClueDisplay();
    }
}

/**
 * VICTORY & COMPLETION
 */

function showVictory() {
    showScreen('victory-screen');

    // Stop timer
    stopTimer();

    // Calculate final time
    const totalTime = Date.now() - gameState.startTime;
    const formattedTime = formatTime(totalTime);

    document.getElementById('final-time').textContent = formattedTime;

    // Save best time
    saveBestTime(totalTime);

    // Display list of visited locations
    displayVisitedLocations();

    // Celebrate with confetti!
    launchConfetti();
}

async function displayVisitedLocations() {
    const list = document.getElementById('locations-visited');
    list.innerHTML = '';

    try {
        const response = await fetch('/api/locations');
        const locations = await response.json();

        locations.forEach(location => {
            const li = document.createElement('li');
            li.textContent = `✓ ${location.name}`;
            list.appendChild(li);
        });
    } catch (error) {
        console.error('Error loading locations:', error);
    }
}

function launchConfetti() {
    // Launch confetti animation
    const duration = 3 * 1000; // 3 seconds
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            clearInterval(interval);
            return;
        }

        // Launch confetti from both sides
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#FFB81C', '#000000', '#ffd700']
        });

        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#FFB81C', '#000000', '#ffd700']
        });
    }, 50);
}

/**
 * TIMER FUNCTIONALITY
 */

function startTimer() {
    // Clear any existing timer
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }

    // Update timer display every second
    gameState.timerInterval = setInterval(() => {
        if (gameState.startTime) {
            const elapsed = Date.now() - gameState.startTime;
            const formatted = formatTime(elapsed);
            document.getElementById('timer-display').textContent = formatted;
        }
    }, 1000);
}

function stopTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
}

function formatTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/**
 * BEST TIME TRACKING
 */

function saveBestTime(time) {
    const bestTime = localStorage.getItem('uwmTreasureHuntBestTime');

    if (!bestTime || time < parseInt(bestTime)) {
        localStorage.setItem('uwmTreasureHuntBestTime', time.toString());
    }
}

function displayBestTime() {
    const bestTime = localStorage.getItem('uwmTreasureHuntBestTime');

    if (bestTime) {
        const formatted = formatTime(parseInt(bestTime));
        document.getElementById('best-time-display').textContent = formatted;
        document.getElementById('welcome-timer').style.display = 'block';
    }
}

/**
 * ERROR HANDLING
 */

function showError(message) {
    document.getElementById('error-message').textContent = message;
    showScreen('error-screen');
}

function closeError() {
    // Return to the appropriate screen
    if (gameState.isGameActive) {
        if (gameState.foundLocations.length > 0 && gameState.foundLocations.includes(gameState.currentLocationId - 1)) {
            showScreen('found-screen');
        } else {
            showScreen('clue-screen');
        }
    } else {
        showScreen('welcome-screen');
    }
}

/**
 * GAME CONTROLS
 */

function resetGame() {
    if (confirm('Are you sure you want to reset the game? All progress will be lost.')) {
        stopTimer();

        if (html5QrCode && isScanning) {
            closeScanner();
        }

        resetGameState();
        showScreen('welcome-screen');
    }
}

function playAgain() {
    stopTimer();

    if (html5QrCode && isScanning) {
        closeScanner();
    }

    resetGameState();
    showScreen('welcome-screen');
}

function shareResults() {
    const totalTime = formatTime(Date.now() - gameState.startTime);
    const shareText = `I just completed the UWM Treasure Hunt in ${totalTime}! 🏆 Can you beat my time?`;

    // Try to use native share API if available (mobile)
    if (navigator.share) {
        navigator.share({
            title: 'UWM Treasure Hunt',
            text: shareText,
            url: window.location.origin
        }).catch(error => console.log('Error sharing:', error));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText + ' ' + window.location.origin)
            .then(() => alert('Results copied to clipboard!'))
            .catch(() => alert(shareText));
    }
}

/**
 * UTILITY FUNCTIONS
 */

// Prevent page refresh during active game
window.addEventListener('beforeunload', (event) => {
    if (gameState.isGameActive) {
        event.preventDefault();
        event.returnValue = 'Game in progress. Are you sure you want to leave?';
    }
});

// Clean up scanner when page is hidden
document.addEventListener('visibilitychange', () => {
    if (document.hidden && isScanning) {
        closeScanner();
    }
});

console.log('🎮 UWM Treasure Hunt initialized!');
console.log('📱 Ready to scan QR codes and explore campus!');
