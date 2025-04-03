/**
 * Cat Collector - Human Edition
 * A text-based RPG game where cats collect humans
 * 
 * This file implements the core game mechanics and Gemini API integration
 */

// ==========================================
// 1. GAME INITIALIZATION AND STATE MANAGEMENT
// ==========================================

// Game state object
const gameState = {
  // Player attributes
  player: {
    name: "Whiskers",
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    health: 100,
    maxHealth: 100,
    attack: 10,
    defense: 5,
    specialAbility: "Cute Meow",
    specialAbilityCooldown: 0,
    inventory: []
  },
  
  // Game progress
  gameProgress: {
    currentLocation: "Suburban Neighborhood",
    completedQuests: [],
    currentObjectives: ["Find your first human"],
    unlockedLocations: ["Suburban Neighborhood"],
    gameStage: 0,
    daysPassed: 1
  },
  
  // Collection of humans (Humadex)
  humadex: [],
  
  // Settings
  settings: {
    textSpeed: "normal", // slow, normal, fast
    volume: 0.7,
    apiKey: "",
    darkMode: true,
    difficultyLevel: "normal" // easy, normal, hard
  },
  
  // Current screen
  currentScreen: "start-screen",
  
  // Battle state
  battleState: {
    inBattle: false,
    opponent: null,
    playerTurn: true,
    turnCount: 0,
    battleLog: []
  },
  
  // Achievements
  achievements: []
};

// Human types with their rarity and characteristics
const humanTypes = {
  common: [
    { type: "Office Worker", catchRate: 0.7, baseStats: { health: 50, attack: 5, defense: 5 } },
    { type: "Student", catchRate: 0.8, baseStats: { health: 40, attack: 4, defense: 3 } },
    { type: "Jogger", catchRate: 0.6, baseStats: { health: 60, attack: 6, defense: 4 } }
  ],
  uncommon: [
    { type: "Teacher", catchRate: 0.5, baseStats: { health: 65, attack: 7, defense: 8 } },
    { type: "Chef", catchRate: 0.5, baseStats: { health: 70, attack: 8, defense: 6 } },
    { type: "Delivery Person", catchRate: 0.45, baseStats: { health: 60, attack: 7, defense: 7 } }
  ],
  rare: [
    { type: "Scientist", catchRate: 0.3, baseStats: { health: 75, attack: 9, defense: 8 } },
    { type: "Athlete", catchRate: 0.25, baseStats: { health: 85, attack: 10, defense: 7 } },
    { type: "Programmer", catchRate: 0.35, baseStats: { health: 70, attack: 8, defense: 9 } }
  ],
  legendary: [
    { type: "CEO", catchRate: 0.1, baseStats: { health: 100, attack: 12, defense: 12 } },
    { type: "Celebrity", catchRate: 0.08, baseStats: { health: 90, attack: 14, defense: 10 } },
    { type: "Politician", catchRate: 0.12, baseStats: { health: 95, attack: 11, defense: 13 } }
  ]
};

// Locations with their available human types
const gameLocations = [
  {
    name: "Suburban Neighborhood",
    description: "A quiet neighborhood with picket fences and well-maintained lawns.",
    availableHumans: {
      common: ["Office Worker", "Student"],
      uncommon: ["Teacher"],
      rare: ["Programmer"],
      legendary: []
    },
    unlockedAtLevel: 1
  },
  {
    name: "Downtown",
    description: "The bustling city center with tall buildings and busy streets.",
    availableHumans: {
      common: ["Office Worker", "Jogger"],
      uncommon: ["Delivery Person", "Chef"],
      rare: ["Athlete"],
      legendary: ["Celebrity"]
    },
    unlockedAtLevel: 3
  },
  {
    name: "University Campus",
    description: "A sprawling campus with academic buildings and student housing.",
    availableHumans: {
      common: ["Student"],
      uncommon: ["Teacher"],
      rare: ["Scientist", "Programmer"],
      legendary: []
    },
    unlockedAtLevel: 5
  },
  {
    name: "Corporate Park",
    description: "A collection of office buildings surrounded by manicured landscapes.",
    availableHumans: {
      common: ["Office Worker"],
      uncommon: ["Delivery Person"],
      rare: ["Programmer", "Scientist"],
      legendary: ["CEO", "Politician"]
    },
    unlockedAtLevel: 8
  }
];

// Gemini API Integration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let geminiModel = null;

async function initializeGeminiAPI() {
  if (!GEMINI_API_KEY) {
    console.warn('Gemini API key not found. Some features will be limited.');
    return;
  }

  try {
    const { GoogleGenerativeAI } = await import('https://esm.run/@google/generative-ai');
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    geminiModel = genAI.getGenerativeModel({ model: "gemini-pro" });
    updateAPIStatus('connected');
  } catch (error) {
    console.error('Failed to initialize Gemini API:', error);
    updateAPIStatus('error', error.message);
  }
}

async function generateStoryContent(prompt) {
  if (!geminiModel) {
    return "API not configured. Please set up your Gemini API key in settings.";
  }

  try {
    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content:', error);
    return "Error generating content. Please try again.";
  }
}

// Settings Management
function loadSettings() {
  const savedSettings = localStorage.getItem('catCollectorSettings');
  if (savedSettings) {
    return JSON.parse(savedSettings);
  }
  return {
    textSpeed: process.env.DEFAULT_TEXT_SPEED || 'medium',
    volume: parseFloat(process.env.DEFAULT_VOLUME) || 0.7,
    darkMode: process.env.DEFAULT_DARK_MODE === 'true',
    useGeminiAPI: !!GEMINI_API_KEY,
    geminiAPIKey: GEMINI_API_KEY || '',
    apiUsageLevel: 'balanced'
  };
}

function saveSettings(settings) {
  localStorage.setItem('catCollectorSettings', JSON.stringify(settings));
  updateSettingsDisplay();
}

function updateSettingsDisplay() {
  const settings = loadSettings();
  
  // Update text speed
  document.getElementById('text-speed').value = settings.textSpeed;
  
  // Update sound settings
  document.getElementById('sound-toggle').checked = settings.volume > 0;
  document.getElementById('music-toggle').checked = settings.volume > 0;
  
  // Update API settings
  document.getElementById('api-toggle').checked = settings.useGeminiAPI;
  document.getElementById('gemini-api-key').value = settings.geminiAPIKey;
  document.getElementById('api-usage').value = settings.apiUsageLevel;
  
  // Update dark mode
  document.body.classList.toggle('dark-mode', settings.darkMode);
}

function updateAPIStatus(status, message = '') {
  const statusElement = document.getElementById('api-status');
  statusElement.className = `status-indicator ${status}`;
  
  switch (status) {
    case 'connected':
      statusElement.textContent = 'Connected';
      break;
    case 'error':
      statusElement.textContent = `Error: ${message}`;
      break;
    default:
      statusElement.textContent = 'Not Configured';
  }
}

// Event Listeners for Settings
document.getElementById('settings-btn').addEventListener('click', () => {
  showScreen('settings-screen');
  updateSettingsDisplay();
});

document.getElementById('save-settings-btn').addEventListener('click', () => {
  const settings = {
    textSpeed: document.getElementById('text-speed').value,
    volume: document.getElementById('sound-toggle').checked ? 0.7 : 0,
    darkMode: document.body.classList.contains('dark-mode'),
    useGeminiAPI: document.getElementById('api-toggle').checked,
    geminiAPIKey: document.getElementById('gemini-api-key').value,
    apiUsageLevel: document.getElementById('api-usage').value
  };
  
  saveSettings(settings);
  showNotification('Settings saved successfully!');
});

document.getElementById('test-api-btn').addEventListener('click', async () => {
  const apiKey = document.getElementById('gemini-api-key').value;
  if (!apiKey) {
    updateAPIStatus('error', 'Please enter an API key');
    return;
  }
  
  try {
    const { GoogleGenerativeAI } = await import('https://esm.run/@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    await model.generateContent('Test connection');
    updateAPIStatus('connected');
    showNotification('API connection successful!');
  } catch (error) {
    updateAPIStatus('error', error.message);
    showNotification('API connection failed: ' + error.message, 'error');
  }
});

// Initialize game with Gemini API
window.addEventListener('DOMContentLoaded', () => {
  initializeGeminiAPI();
  initGame();
});

// Initialize game
function initGame() {
  loadGameState();
  updateUI();
  addEventListeners();
  showScreen("start-screen");
}

// Save game state to local storage
function saveGameState() {
  localStorage.setItem("catCollectorSave", JSON.stringify(gameState));
  showNotification("Game saved successfully!");
}

// Load game state from local storage
function loadGameState() {
  const savedGame = localStorage.getItem("catCollectorSave");
  if (savedGame) {
    try {
      const parsedState = JSON.parse(savedGame);
      // Merge saved state with default state to ensure all properties exist
      Object.assign(gameState, parsedState);
      showNotification("Game loaded successfully!");
    } catch (error) {
      console.error("Error loading saved game:", error);
      showNotification("Error loading saved game. Starting new game.", "error");
    }
  }
}

// Reset game state
function resetGame() {
  if (confirm("Are you sure you want to reset your game? All progress will be lost.")) {
    localStorage.removeItem("catCollectorSave");
    location.reload();
  }
}

// ==========================================
// 2. SCREEN NAVIGATION AND UI MANAGEMENT
// ==========================================

// Show a specific screen and hide others
function showScreen(screenId) {
  // Hide all screens
  document.querySelectorAll('.game-screen').forEach(screen => {
    screen.classList.remove('active');
    screen.classList.add('hidden');
  });
  
  // Show the requested screen
  const targetScreen = document.getElementById(screenId);
  if (targetScreen) {
    targetScreen.classList.remove('hidden');
    targetScreen.classList.add('active');
    gameState.currentScreen = screenId;
    
    // Special handling for specific screens
    if (screenId === 'humadex-screen') {
      updateHumadexDisplay();
    } else if (screenId === 'settings-screen') {
      updateSettingsDisplay();
    } else if (screenId === 'main-game-screen') {
      updateGameDisplay();
    }
  }
}

// Update the entire UI based on current game state
function updateUI() {
  updatePlayerStats();
  updateInventoryDisplay();
  
  // Update specific screen content if it's active
  if (gameState.currentScreen === 'humadex-screen') {
    updateHumadexDisplay();
  } else if (gameState.currentScreen === 'battle-screen' && gameState.battleState.inBattle) {
    updateBattleDisplay();
  }
}

// Update player stats display
function updatePlayerStats() {
  const player = gameState.player;
  document.getElementById('player-name').textContent = player.name;
  document.getElementById('player-level').textContent = player.level;
  document.getElementById('player-xp').textContent = `${player.xp}/${player.xpToNextLevel}`;
  document.getElementById('player-treats').textContent = player.treats;
  document.getElementById('player-floof').textContent = player.floof;
  document.getElementById('player-agility').textContent = player.agility;
  document.getElementById('player-charm').textContent = player.charm;
  document.getElementById('humans-collected').textContent = `${player.humansCollected}/25`;
}

// Update inventory display
function updateInventoryDisplay() {
  const inventoryList = document.getElementById('inventory-list');
  inventoryList.innerHTML = '';
  
  gameState.player.inventory.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} (${item.quantity})`;
    li.addEventListener('click', () => useItem(item));
    inventoryList.appendChild(li);
  });
}

// Show notification message
function showNotification(message, type = "info") {
  const dialog = document.getElementById('notification-dialog');
  const messageElement = document.getElementById('notification-message');
  
  messageElement.textContent = message;
  dialog.className = `dialog ${type}`;
  dialog.style.display = 'flex';
  
  // Auto-hide after 3 seconds
  setTimeout(() => {
    dialog.style.display = 'none';
  }, 3000);
}

// Update game display with narrative text
function updateGameDisplay() {
  const narrativeArea = document.getElementById('narrative-text');
  const location = gameState.gameProgress.currentLocation;
  const locationInfo = gameLocations.find(loc => loc.name === location);
  
  let narrativeText = `<p><strong>Day ${gameState.gameProgress.daysPassed}</strong> - You are in <strong>${location}</strong>.</p>`;
  narrativeText += `<p>${locationInfo.description}</p>`;
  
  // Add contextual narrative based on game progress
  if (gameState.humadex.length === 0) {
    narrativeText += `<p>You haven't collected any humans yet. It's time to start your collection!</p>`;
  } else {
    narrativeText += `<p>You've collected ${gameState.humadex.length} humans so far. The hunt continues...</p>`;
  }
  
  narrativeArea.innerHTML = narrativeText;
  
  // Update available actions
  updateAvailableActions();
}

// Update available actions based on current location and game state
function updateAvailableActions() {
  const actionsContainer = document.getElementById('game-choices');
  actionsContainer.innerHTML = '';
  
  // Standard actions
  const standardActions = [
    { text: "Explore Area", action: exploreArea },
    { text: "Rest (Recover Health)", action: restAndHeal },
    { text: "Check Humadex", action: () => showScreen('humadex-screen') }
  ];
  
  // Add location-specific actions
  if (gameState.gameProgress.currentLocation === "Downtown") {
    standardActions.push({ text: "Visit Shop", action: visitShop });
  }
  
  // Add travel options if player has unlocked multiple locations
  if (gameState.gameProgress.unlockedLocations.length > 1) {
    standardActions.push({ text: "Travel", action: showTravelOptions });
  }
  
  // Create buttons for each action
  standardActions.forEach(actionInfo => {
    const button = document.createElement('button');
    button.textContent = actionInfo.text;
    button.classList.add('game-button');
    button.addEventListener('click', actionInfo.action);
    actionsContainer.appendChild(button);
  });
}

// Show travel options to other locations
function showTravelOptions() {
  const actionsContainer = document.getElementById('game-choices');
  actionsContainer.innerHTML = '<h3>Where would you like to go?</h3>';
  
  // Add a button for each unlocked location
  gameState.gameProgress.unlockedLocations.forEach(locationName => {
    if (locationName !== gameState.gameProgress.currentLocation) {
      const button = document.createElement('button');
      button.textContent = locationName;
      button.classList.add('game-button');
      button.addEventListener('click', () => travelToLocation(locationName));
      actionsContainer.appendChild(button);
    }
  });
  
  // Add back button
  const backButton = document.createElement('button');
  backButton.textContent = "Cancel";
  backButton.classList.add('game-button', 'cancel-button');
  backButton.addEventListener('click', updateAvailableActions);
  actionsContainer.appendChild(backButton);
}

// Travel to a new location
function travelToLocation(locationName) {
  gameState.gameProgress.currentLocation = locationName;
  gameState.gameProgress.daysPassed++;
  
  // Check if new locations should be unlocked based on player level
  checkLocationUnlocks();
  
  updateGameDisplay();
  showNotification(`You have traveled to ${locationName}`);
}

// Check and unlock new locations based on player level
function checkLocationUnlocks() {
  gameLocations.forEach(location => {
    if (
      gameState.player.level >= location.unlockedAtLevel && 
      !gameState.gameProgress.unlockedLocations.includes(location.name)
    ) {
      gameState.gameProgress.unlockedLocations.push(location.name);
      showNotification(`New location unlocked: ${location.name}!`, "success");
    }
  });
}

// ==========================================
// 3. CORE GAMEPLAY MECHANICS
// ==========================================

// Explore the current area (chance to find humans)
function exploreArea() {
  const narrativeArea = document.getElementById('narrative-text');
  let narrativeText = `<p>You prowl through ${gameState.gameProgress.currentLocation}, your whiskers twitching...</p>`;
  
  // Random chance to encounter a human
  const encounterChance = Math.random();
  
  if (encounterChance < 0.7) { // 70% chance to find a human
    const human = generateRandomHuman();
    narrativeText += `<p>You spot a <strong>${human.type}</strong> in their natural habitat!</p>`;
    
    // Start battle with the human
    startBattle(human);
  } else {
    // Find an item instead
    const items = ["Catnip", "Tuna Can", "Yarn Ball", "Scratching Post Piece"];
    const foundItem = items[Math.floor(Math.random() * items.length)];
    
    narrativeText += `<p>You didn't find any humans, but you discovered a <strong>${foundItem}</strong>!</p>`;
    addItemToInventory(foundItem);
    
    // Update narrative and actions
    narrativeArea.innerHTML = narrativeText;
    updateAvailableActions();
  }
}

// Rest to recover health
function restAndHeal() {
  const healAmount = Math.floor(gameState.player.maxHealth * 0.3); // Heal 30% of max health
  gameState.player.health = Math.min(gameState.player.health + healAmount, gameState.player.maxHealth);
  gameState.gameProgress.daysPassed++;
  
  const narrativeArea = document.getElementById('narrative-text');
  narrativeArea.innerHTML = `
    <p>You find a cozy spot in ${gameState.gameProgress.currentLocation} and take a well-deserved cat nap.</p>
    <p>You recovered ${healAmount} health points!</p>
  `;
  
  updatePlayerStats();
  updateAvailableActions();
}

// Add item to inventory
function addItemToInventory(itemName) {
  const existingItem = gameState.player.inventory.find(item => item.name === itemName);
  
  if (existingItem) {
    existingItem.quantity++;
  } else {
    gameState.player.inventory.push({
      name: itemName,
      quantity: 1,
      // Define item effects based on name
      effect: getItemEffect(itemName)
    });
  }
  
  updateInventoryDisplay();
}

// Get item effect based on name
function getItemEffect(itemName) {
  switch (itemName) {
    case "Catnip":
      return { type: "buff", stat: "attack", amount: 5, duration: 3 };
    case "Tuna Can":
      return { type: "heal", amount: 30 };
    case "Yarn Ball":
      return { type: "distract", chance: 0.3 };
    case "Scratching Post Piece":
      return { type: "buff", stat: "defense", amount: 3, duration: 3 };
    default:
      return { type: "heal", amount: 10 };
  }
}

// Use item from inventory
function useItem(item) {
  if (gameState.battleState.inBattle) {
    useItemInBattle(item);
  } else {
    useItemOutsideBattle(item);
  }
  
  // Remove item if quantity reaches 0
  item.quantity--;
  if (item.quantity <= 0) {
    const index = gameState.player.inventory.indexOf(item);
    gameState.player.inventory.splice(index, 1);
  }
  
  updateInventoryDisplay();
}

// Use item outside of battle
function useItemOutsideBattle(item) {
  const effect = item.effect;
  
  if (effect.type === "heal") {
    gameState.player.health = Math.min(gameState.player.health + effect.amount, gameState.player.maxHealth);
    showNotification(`You used ${item.name} and recovered ${effect.amount} health!`);
  } else {
    showNotification(`This item is best used during battle.`);
    // Return the item (don't consume it)
    return false;
  }
  
  updatePlayerStats();
  return true;
}

// Use item during battle
function useItemInBattle(item) {
  const effect = item.effect;
  const battleLog = document.getElementById('battle-log');
  
  switch (effect.type) {
    case "heal":
      gameState.player.health = Math.min(gameState.player.health + effect.amount, gameState.player.maxHealth);
      battleLog.innerHTML += `<p>You used ${item.name} and recovered ${effect.amount} health!</p>`;
      break;
    case "buff":
      gameState.player[effect.stat] += effect.amount;
      gameState.battleState.activeBuffs = gameState.battleState.activeBuffs || [];
      gameState.battleState.activeBuffs.push({
        stat: effect.stat,
        amount: effect.amount,
        turnsLeft: effect.duration
      });
      battleLog.innerHTML += `<p>You used ${item.name} and increased your ${effect.stat} by ${effect.amount}!</p>`;
      break;
    case "distract":
      if (Math.random() < effect.chance) {
        gameState.battleState.opponentStunned = true;
        battleLog.innerHTML += `<p>You used ${item.name} and distracted the human! They'll skip their next turn.</p>`;
      } else {
        battleLog.innerHTML += `<p>You used ${item.name} but the human wasn't interested.</p>`;
      }
      break;
  }
  
  // End player's turn
  gameState.battleState.playerTurn = false;
  updateBattleDisplay();
  
  // Process opponent's turn after a short delay
  setTimeout(opponentTurn, 1500);
}

// Generate a random human based on location and rarity
function generateRandomHuman() {
  const location = gameState.gameProgress.currentLocation;
  const locationInfo = gameLocations.find(loc => loc.name === location);
  
  // Determine rarity tier
  const rarityRoll = Math.random();
  let rarityTier;
  
  if (rarityRoll < 0.05) {
    rarityTier = "legendary";
  } else if (rarityRoll < 0.2) {
    rarityTier = "rare";
  } else if (rarityRoll < 0.5) {
    rarityTier = "uncommon";
  } else {
    rarityTier = "common";
  }
  
  // Get available human types for this location and rarity
  const availableTypes = locationInfo.availableHumans[rarityTier];
  
  // If no humans of this rarity at this location, fall back to common
  if (!availableTypes || availableTypes.length === 0) {
    rarityTier = "common";
  }
  
  // Select a random human type from the available ones
  const humanType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
  
  // Find the base stats for this human type
  const humanTypeInfo = humanTypes[rarityTier].find(h => h.type === humanType);
  
  // Generate a unique human with some randomization
  const human = {
    id: Date.now(), // Unique ID
    type: humanType,
    rarity: rarityTier,
    name: generateHumanName(),
    level: Math.max(1, gameState.player.level - 1 + Math.floor(Math.random() * 3)), // Level close to player's
    catchRate: humanTypeInfo.catchRate,
    health: calculateHumanStat(humanTypeInfo.baseStats.health),
    maxHealth: calculateHumanStat(humanTypeInfo.baseStats.health),
    attack: calculateHumanStat(humanTypeInfo.baseStats.attack),
    defense: calculateHumanStat(humanTypeInfo.baseStats.defense),
    specialTrait: generateSpecialTrait(humanType),
    description: "", // Will be filled by Gemini API
    captureDate: null,
    location: location
  };
  
  return human;
}

// Calculate human stat with some randomization
function calculateHumanStat(baseStat) {
  // Add +/- 10% randomization
  const randomFactor = 0.9 + (Math.random() * 0.2);
  return Math.floor(baseStat * randomFactor);
}

// Generate a random human name
function generateHumanName() {
  const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Susan", "Richard", "Jessica", "Joseph", "Sarah", "Thomas", "Karen", "Charles", "Nancy"];
  const lastNames = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson"];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
}

// Generate special trait based on human type
function generateSpecialTrait(humanType) {
  const traits = {
    "Office Worker": ["Coffee Addict", "Stapler Hoarder", "Meeting Scheduler", "Email Enthusiast"],
    "Student": ["Procrastinator", "Note Taker", "Caffeine Dependent", "All-Nighter"],
    "Jogger": ["Early Riser", "Health Nut", "Hydration Expert", "Endorphin Junkie"],
    "Teacher": ["Red Pen Wielder", "Patience Master", "Knowledge Keeper", "Homework Assigner"],
    "Chef": ["Knife Skills", "Taste Tester", "Recipe Innovator", "Kitchen Commander"],
    "Delivery Person": ["Navigation Expert", "Quick Mover", "Package Handler", "Doorbell Ringer"],
    "Scientist": ["Hypothesis Former", "Data Analyzer", "Lab Coat Wearer", "Research Obsessed"],
    "Athlete": ["Endurance Champion", "Protein Consumer", "Trophy Collector", "Early Trainer"],
    "Programmer": ["Bug Creator", "Coffee Converter", "Night Owl", "Stack Overflow Searcher"],
    "CEO": ["Decision Maker", "Meeting Caller", "Delegation Master", "Vision Haver"],
    "Celebrity": ["Attention Seeker", "Camera Ready", "Autograph Giver", "Trend Setter"],
    "Politician": ["Promise Maker", "Hand Shaker", "Speech Giver", "Opinion Haver"]
  };
  
  const typeTraits = traits[humanType] || ["Adaptable", "Resourceful", "Unpredictable", "Curious"];
  return typeTraits[Math.floor(Math.random() * typeTraits.length)];
}

// ==========================================
// 4. BATTLE SYSTEM
// ==========================================

// Start a battle with a human
function startBattle(human) {
  gameState.battleState = {
    inBattle: true,
    opponent: human,
    playerTurn: true,
    turnCount: 0,
    battleLog: [],
    activeBuffs: []
  };
  
  showScreen('battle-screen');
  updateBattleDisplay();
  
  // If we have an API key, generate a description for this human
  if (gameState.settings.apiKey) {
    generateHumanDescription(human);
  }
}

// Update battle display
function updateBattleDisplay() {
  if (!gameState.battleState.inBattle) return;
  
  const human = gameState.battleState.opponent;
  const battleScreen = document.getElementById('battle-screen');
  
  // Update human info
  document.getElementById('human-name').textContent = human.name;
  document.getElementById('human-type').textContent = human.type;
  document.getElementById('human-level').textContent = human.level;
  document.getElementById('human-rarity').textContent = human.rarity.toUpperCase();
  
  // Update health bars
  const humanHealthPercent = (human.health / human.maxHealth) * 100;
  document.getElementById('human-health-bar-fill').style.width = `${humanHealthPercent}%`;
  document.getElementById('human-health-text').textContent = `${human.health}/${human.maxHealth} HP`;
  
  const playerHealthPercent = (gameState.player.health / gameState.player.maxHealth) * 100;
  document.getElementById('battle-player-health-bar-fill').style.width = `${playerHealthPercent}%`;
  document.getElementById('battle-player-health-text').textContent = `${gameState.player.health}/${gameState.player.maxHealth} HP`;
  
  // Update battle log
  const battleLog = document.getElementById('battle-log');
  if (gameState.battleState.turnCount === 0) {
    battleLog.innerHTML = `<p>A wild ${human.type} appeared!</p>`;
    battleLog.innerHTML += `<p>It's ${human.name}, a level ${human.level} human with the "${human.specialTrait}" trait.</p>`;
  }
  
  // Show/hide action buttons based on whose turn it is
  const actionButtons = document.getElementById('battle-actions');
  actionButtons.style.display = gameState.battleState.playerTurn ? 'flex' : 'none';
  
  // Show turn indicator
  document.getElementById('turn-indicator').textContent = gameState.battleState.playerTurn ? 
    "Your Turn" : "Human's Turn";
}

// Player attack action
function playerAttack() {
  if (!gameState.battleState.inBattle || !gameState.battleState.playerTurn) return;
  
  const human = gameState.battleState.opponent;
  const battleLog = document.getElementById('battle-log');
  
  // Calculate damage
  const damage = Math.max(1, gameState.player.attack - Math.floor(human.defense / 2));
  human.health = Math.max(0, human.health - damage);
  
  // Update battle log
  battleLog.innerHTML += `<p>You scratch ${human.name} for ${damage} damage!</p>`;
  
  // Check if human is defeated
  if (human.health <= 0) {
    endBattle(true);
    return;
  }
  
  // End player's turn
  gameState.battleState.playerTurn = false;
  gameState.battleState.turnCount++;
  updateBattleDisplay();
  
  // Process opponent's turn after a short delay
  setTimeout(opponentTurn, 1500);
}

// Player special ability action
function playerSpecialAbility() {
  if (!gameState.battleState.inBattle || !gameState.battleState.playerTurn) return;
  
  const human = gameState.battleState.opponent;
  const battleLog = document.getElementById('battle-log');
  
  // Calculate special ability effect based on player's special ability
  switch (gameState.player.specialAbility) {
    case "Cute Meow":
      // Cute Meow has a chance to stun the opponent
      const stunChance = 0.4; // 40% chance
      if (Math.random() < stunChance) {
        gameState.battleState.opponentStunned = true;
        battleLog.innerHTML += `<p>You use your Cute Meow! ${human.name} is charmed and will skip their next turn!</p>`;
      } else {
        battleLog.innerHTML += `<p>You use your Cute Meow, but ${human.name} seems unimpressed.</p>`;
      }
      break;
    case "Pounce":
      // Pounce does extra damage
      const damage = Math.max(1, Math.floor(gameState.player.attack * 1.5) - Math.floor(human.defense / 2));
      human.health = Math.max(0, human.health - damage);
      battleLog.innerHTML += `<p>You pounce on ${human.name} for ${damage} damage!</p>`;
      
      // Check if human is defeated
      if (human.health <= 0) {
        endBattle(true);
        return;
      }
      break;
    case "Hiss":
      // Hiss reduces opponent's attack
      human.attack = Math.max(1, human.attack - 2);
      battleLog.innerHTML += `<p>You hiss menacingly at ${human.name}, reducing their attack!</p>`;
      break;
  }
  
  // End player's turn
  gameState.battleState.playerTurn = false;
  gameState.battleState.turnCount++;
  updateBattleDisplay();
  
  // Process opponent's turn after a short delay
  setTimeout(opponentTurn, 1500);
}

// Try to capture the human
function tryCapture() {
  if (!gameState.battleState.inBattle || !gameState.battleState.playerTurn) return;
  
  const human = gameState.battleState.opponent;
  const battleLog = document.getElementById('battle-log');
  
  // Capture chance increases as human health decreases
  const healthPercentage = human.health / human.maxHealth;
  const baseChance = human.catchRate;
  const captureChance = baseChance * (2 - healthPercentage); // Higher chance when health is low
  
  battleLog.innerHTML += `<p>You attempt to add ${human.name} to your collection...</p>`;
  
  if (Math.random() < captureChance) {
    // Successful capture
    human.captureDate = new Date().toISOString();
    gameState.humadex.push(human);
    
    battleLog.innerHTML += `<p>Success! ${human.name} has been added to your Humadex!</p>`;
    
    // Award XP and check for level up
    const xpGained = calculateXPGain(human);
    awardXP(xpGained);
    
    // End battle with success
    setTimeout(() => {
      endBattle(true);
    }, 2000);
  } else {
    // Failed capture
    battleLog.innerHTML += `<p>Oh no! ${human.name} escaped your grasp!</p>`;
    
    // End player's turn
    gameState.battleState.playerTurn = false;
    gameState.battleState.turnCount++;
    updateBattleDisplay();
    
    // Process opponent's turn after a short delay
    setTimeout(opponentTurn, 1500);
  }
}

// Flee from battle
function fleeBattle() {
  if (!gameState.battleState.inBattle) return;
  
  const battleLog = document.getElementById('battle-log');
  const fleeChance = 0.7; // 70% chance to successfully flee
  
  if (Math.random() < fleeChance) {
    battleLog.innerHTML += `<p>You successfully fled from the battle!</p>`;
    
    // End battle without capturing
    setTimeout(() => {
      endBattle(false);
    }, 1500);
  } else {
    battleLog.innerHTML += `<p>You couldn't escape!</p>`;
    
    // End player's turn
    gameState.battleState.playerTurn = false;
    gameState.battleState.turnCount++;
    updateBattleDisplay();
    
    // Process opponent's turn after a short delay
    setTimeout(opponentTurn, 1500);
  }
}

// Process opponent's turn
function opponentTurn() {
  if (!gameState.battleState.inBattle || gameState.battleState.playerTurn) return;
  
  const human = gameState.battleState.opponent;
  const battleLog = document.getElementById('battle-log');
  
  // Check if opponent is stunned
  if (gameState.battleState.opponentStunned) {
    battleLog.innerHTML += `<p>${human.name} is stunned and can't move!</p>`;
    gameState.battleState.opponentStunned = false;
  } else {
    // Opponent attacks
    const damage = Math.max(1, human.attack - Math.floor(gameState.player.defense / 2));
    gameState.player.health = Math.max(0, gameState.player.health - damage);
    
    // Update battle log with a random attack message
    const attackMessages = [
      `${human.name} swats at you for ${damage} damage!`,
      `${human.name} tries to shoo you away, dealing ${damage} damage!`,
      `${human.name} throws a shoe at you for ${damage} damage!`,
      `${human.name} yells loudly, causing ${damage} damage to your sensitive ears!`
    ];
    const randomMessage = attackMessages[Math.floor(Math.random() * attackMessages.length)];
    battleLog.innerHTML += `<p>${randomMessage}</p>`;
    
    // Check if player is defeated
    if (gameState.player.health <= 0) {
      endBattle(false);
      return;
    }
  }
  
  // Process active buffs
  if (gameState.battleState.activeBuffs && gameState.battleState.activeBuffs.length > 0) {
    for (let i = gameState.battleState.activeBuffs.length - 1; i >= 0; i--) {
      const buff = gameState.battleState.activeBuffs[i];
      buff.turnsLeft--;
      
      if (buff.turnsLeft <= 0) {
        // Remove the buff
        gameState.player[buff.stat] -= buff.amount;
        battleLog.innerHTML += `<p>Your ${buff.stat} boost has worn off.</p>`;
        gameState.battleState.activeBuffs.splice(i, 1);
      }
    }
  }
  
  // Start player's turn
  gameState.battleState.playerTurn = true;
  updateBattleDisplay();
  updatePlayerStats();
}

// End battle
function endBattle(wasSuccessful) {
  const battleLog = document.getElementById('battle-log');
  
  if (gameState.player.health <= 0) {
    // Player was defeated
    battleLog.innerHTML += `<p>You were defeated! You scurry away to safety...</p>`;
    
    // Reduce player health but don't let them die completely
    gameState.player.health = Math.max(1, Math.floor(gameState.player.maxHealth * 0.1));
    
    setTimeout(() => {
      gameState.battleState.inBattle = false;
      showScreen('main-game-screen');
      updateGameDisplay();
      updatePlayerStats();
    }, 2000);
  } else if (wasSuccessful) {
    // Player won or captured the human
    const human = gameState.battleState.opponent;
    
    if (human.health <= 0) {
      battleLog.innerHTML += `<p>You defeated ${human.name}!</p>`;
      
      // Award XP
      const xpGained = calculateXPGain(human);
      awardXP(xpGained);
    }
    
    setTimeout(() => {
      gameState.battleState.inBattle = false;
      showScreen('main-game-screen');
      updateGameDisplay();
      updatePlayerStats();
      
      // Check for completed objectives
      checkObjectives();
    }, 2000);
  } else {
    // Player fled
    setTimeout(() => {
      gameState.battleState.inBattle = false;
      showScreen('main-game-screen');
      updateGameDisplay();
    }, 1500);
  }
}

// Calculate XP gain from battle
function calculateXPGain(human) {
  // Base XP based on human level and rarity
  let baseXP = human.level * 10;
  
  // Multiplier based on rarity
  const rarityMultipliers = {
    common: 1,
    uncommon: 1.5,
    rare: 2,
    legendary: 3
  };
  
  return Math.floor(baseXP * rarityMultipliers[human.rarity]);
}

// Award XP to player and check for level up
function awardXP(amount) {
  const battleLog = document.getElementById('battle-log');
  gameState.player.xp += amount;
  battleLog.innerHTML += `<p>You gained ${amount} XP!</p>`;
  
  // Check for level up
  while (gameState.player.xp >= gameState.player.xpToNextLevel) {
    gameState.player.xp -= gameState.player.xpToNextLevel;
    gameState.player.level++;
    
    // Increase stats
    gameState.player.maxHealth += 10;
    gameState.player.health = gameState.player.maxHealth;
    gameState.player.attack += 2;
    gameState.player.defense += 1;
    
    // Increase XP required for next level
    gameState.player.xpToNextLevel = Math.floor(gameState.player.xpToNextLevel * 1.2);
    
    battleLog.innerHTML += `<p>Level up! You are now level ${gameState.player.level}!</p>`;
    
    // Check for new special abilities
    if (gameState.player.level === 5) {
      gameState.player.specialAbility = "Pounce";
      battleLog.innerHTML += `<p>You learned a new special ability: Pounce!</p>`;
    } else if (gameState.player.level === 10) {
      gameState.player.specialAbility = "Hiss";
      battleLog.innerHTML += `<p>You learned a new special ability: Hiss!</p>`;
    }
    
    // Check for new location unlocks
    checkLocationUnlocks();
  }
  
  updatePlayerStats();
}

// Check for completed objectives
function checkObjectives() {
  // Check if player has collected their first human
  if (gameState.humadex.length === 1 && gameState.gameProgress.currentObjectives.includes("Find your first human")) {
    // Update objective
    const index = gameState.gameProgress.currentObjectives.indexOf("Find your first human");
    gameState.gameProgress.currentObjectives.splice(index, 1);
    gameState.gameProgress.currentObjectives.push("Collect 5 different humans");
    
    showNotification("Objective completed: Find your first human!", "success");
  }
  
  // Check if player has collected 5 different humans
  if (gameState.humadex.length >= 5 && gameState.gameProgress.currentObjectives.includes("Collect 5 different humans")) {
    // Update objective
    const index = gameState.gameProgress.currentObjectives.indexOf("Collect 5 different humans");
    gameState.gameProgress.currentObjectives.splice(index, 1);
    gameState.gameProgress.currentObjectives.push("Collect a rare human");
    
    showNotification("Objective completed: Collect 5 different humans!", "success");
  }
  
  // Check if player has collected a rare human
  const hasRareHuman = gameState.humadex.some(human => human.rarity === "rare");
  if (hasRareHuman && gameState.gameProgress.currentObjectives.includes("Collect a rare human")) {
    // Update objective
    const index = gameState.gameProgress.currentObjectives.indexOf("Collect a rare human");
    gameState.gameProgress.currentObjectives.splice(index, 1);
    gameState.gameProgress.currentObjectives.push("Collect a legendary human");
    
    showNotification("Objective completed: Collect a rare human!", "success");
  }
  
  // Check if player has collected a legendary human
  const hasLegendaryHuman = gameState.humadex.some(human => human.rarity === "legendary");
  if (hasLegendaryHuman && gameState.gameProgress.currentObjectives.includes("Collect a legendary human")) {
    // Update objective
    const index = gameState.gameProgress.currentObjectives.indexOf("Collect a legendary human");
    gameState.gameProgress.currentObjectives.splice(index, 1);
    gameState.gameProgress.currentObjectives.push("Complete your Humadex");
    
    showNotification("Objective completed: Collect a legendary human!", "success");
  }
}

// ==========================================
// 5. HUMADEX FUNCTIONALITY
// ==========================================

// Update Humadex display
function updateHumadexDisplay() {
  const humadexGrid = document.getElementById('humadex-grid');
  const humadexDetails = document.getElementById('humadex-details');
  
  // Clear previous content
  humadexGrid.innerHTML = '';
  humadexDetails.innerHTML = '<h3>Select a human to view details</h3>';
  
  // Get active filter
  const activeFilter = document.querySelector('.humadex-filters .filter-btn.active');
  const rarityFilter = activeFilter ? activeFilter.textContent.toLowerCase() : 'all';
  
  // Filter humans based on rarity
  let filteredHumans = gameState.humadex;
  if (rarityFilter !== 'all') {
    filteredHumans = filteredHumans.filter(human => human.rarity === rarityFilter);
  }
  
  // Display filtered humans
  if (filteredHumans.length === 0) {
    humadexGrid.innerHTML = '<p class="no-results">No humans match your filters</p>';
  } else {
    filteredHumans.forEach(human => {
      const humanCard = document.createElement('div');
      humanCard.className = `humadex-card ${human.rarity}`;
      humanCard.innerHTML = `
        <h4>${human.name}</h4>
        <p>${human.type}</p>
        <span class="rarity-badge">${human.rarity}</span>
      `;
      
      humanCard.addEventListener('click', () => showHumanDetails(human));
      humadexGrid.appendChild(humanCard);
    });
  }
  
  // Update Humadex stats
  updateHumadexStats();
}

// Show details for a specific human
function showHumanDetails(human) {
  const humadexDetails = document.getElementById('humadex-details');
  
  // Format capture date
  const captureDate = human.captureDate ? new Date(human.captureDate).toLocaleDateString() : 'Unknown';
  
  humadexDetails.innerHTML = `
    <h3>${human.name}</h3>
    <div class="human-details-grid">
      <div class="detail-item">
        <span class="detail-label">Type:</span>
        <span class="detail-value">${human.type}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Rarity:</span>
        <span class="detail-value ${human.rarity}">${human.rarity.toUpperCase()}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Level:</span>
        <span class="detail-value">${human.level}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Special Trait:</span>
        <span class="detail-value">${human.specialTrait}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Captured At:</span>
        <span class="detail-value">${human.location}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Capture Date:</span>
        <span class="detail-value">${captureDate}</span>
      </div>
    </div>
    
    <div class="human-stats">
      <div class="stat-bar">
        <span class="stat-label">Health:</span>
        <div class="stat-bar-container">
          <div class="stat-bar-fill" style="width: ${(human.maxHealth / 100) * 100}%"></div>
        </div>
        <span class="stat-value">${human.maxHealth}</span>
      </div>
      <div class="stat-bar">
        <span class="stat-label">Attack:</span>
        <div class="stat-bar-container">
          <div class="stat-bar-fill" style="width: ${(human.attack / 15) * 100}%"></div>
        </div>
        <span class="stat-value">${human.attack}</span>
      </div>
      <div class="stat-bar">
        <span class="stat-label">Defense:</span>
        <div class="stat-bar-container">
          <div class="stat-bar-fill" style="width: ${(human.defense / 15) * 100}%"></div>
        </div>
        <span class="stat-value">${human.defense}</span>
      </div>
    </div>
    
    <div class="human-description">
      ${human.description || "<p>No detailed information available for this human.</p>"}
    </div>
  `;
}

// Update Humadex statistics
function updateHumadexStats() {
  const totalCount = gameState.humadex.length;
  const commonCount = gameState.humadex.filter(h => h.rarity === 'common').length;
  const uncommonCount = gameState.humadex.filter(h => h.rarity === 'uncommon').length;
  const rareCount = gameState.humadex.filter(h => h.rarity === 'rare').length;
  const legendaryCount = gameState.humadex.filter(h => h.rarity === 'legendary').length;
  
  // Calculate total possible humans
  const totalPossible = Object.values(humanTypes).reduce((sum, arr) => sum + arr.length, 0);
  
  document.getElementById('humadex-count').textContent = `${totalCount}/${totalPossible}`;
  document.getElementById('common-count').textContent = commonCount;
  document.getElementById('uncommon-count').textContent = uncommonCount;
  document.getElementById('rare-count').textContent = rareCount;
  document.getElementById('legendary-count').textContent = legendaryCount;
  
  // Update completion percentage
  const completionPercent = Math.floor((totalCount / totalPossible) * 100);
  document.getElementById('completion-percent').textContent = `${completionPercent}%`;
}

// Populate type filter with available human types
function populateTypeFilter() {
  const filterButtons = document.querySelectorAll('.humadex-filters .filter-btn');
  
  // Add click event listeners to filter buttons
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.humadex-filters .filter-btn').forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      updateHumadexDisplay();
    });
  });
}

// ==========================================
// 6. EVENT LISTENERS AND INITIALIZATION
// ==========================================

// Add event listeners to UI elements
function addEventListeners() {
  // Helper function to safely add event listeners
  function addListener(id, event, callback) {
    const element = document.getElementById(id);
    if (element) {
      element.addEventListener(event, callback);
    }
  }

  // Navigation buttons
  addListener('new-game-btn', 'click', () => {
    showScreen('main-game-screen');
    updateGameDisplay();
  });
  
  addListener('settings-btn', 'click', () => {
    showScreen('settings-screen');
  });
  
  addListener('humadex-btn', 'click', () => {
    showScreen('humadex-screen');
  });
  
  addListener('back-from-humadex', 'click', () => {
    showScreen('main-game-screen');
  });
  
  addListener('back-from-settings', 'click', () => {
    showScreen('start-screen');
  });
  
  // Battle buttons
  addListener('attack-btn', 'click', playerAttack);
  addListener('special-btn', 'click', playerSpecialAbility);
  addListener('capture-btn', 'click', tryCapture);
  addListener('flee-btn', 'click', fleeBattle);
  
  // Settings buttons
  addListener('save-settings-btn', 'click', saveSettings);
  addListener('test-api-btn', 'click', testAPIKey);
  addListener('save-game-btn', 'click', saveGameState);
  addListener('reset-game-btn', 'click', resetGame);
  
  // Volume slider
  const volumeSlider = document.getElementById('volume-slider');
  const volumeValue = document.getElementById('volume-value');
  if (volumeSlider && volumeValue) {
    volumeSlider.addEventListener('input', (e) => {
      volumeValue.textContent = e.target.value + '%';
    });
  }
  
  // Humadex filters
  const filterButtons = document.querySelectorAll('.humadex-filters .filter-btn');
  if (filterButtons.length > 0) {
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        updateHumadexDisplay();
      });
    });
  }
}