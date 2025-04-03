```
 ____      _     ____      _ _           _             
/ ___|__ _| |_  / ___|___ | | | ___  ___| |_ ___  _ __ 
| |   / _` | __|| |   / _ \| | |/ _ \/ __| __/ _ \| '__|
| |__| (_| | |_ | |__| (_) | | |  __/ (__| || (_) | |   
\____\__,_|\__(_)____\___/|_|_|\___|\___|\__\___/|_|   
                                                       
 _   _                                 _____    _ _ _   _             
| | | |_   _ _ __ ___   __ _ _ __     | ____|__| (_) |_(_) ___  _ __  
| |_| | | | | '_ ` _ \ / _` | '_ \    |  _| / _` | | __| |/ _ \| '_ \ 
|  _  | |_| | | | | | | (_| | | | |   | |__| (_| | | |_| | (_) | | | |
|_| |_|\__,_|_| |_| |_|\__,_|_| |_|   |_____\__,_|_|\__|_|\___/|_| |_|
```

# Cat Collector - Human Edition

A text-based RPG where cats have become the dominant species and you're on a mission to collect and catalog humans for your Humadex!

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Game Setup](#game-setup)
  - [Basic Setup](#basic-setup)
  - [Gemini API Integration](#gemini-api-integration)
- [How to Play](#how-to-play)
- [Game Mechanics](#game-mechanics)
- [Technical Details](#technical-details)
- [Browser Compatibility](#browser-compatibility)
- [Troubleshooting](#troubleshooting)
- [Credits](#credits)

---

## Overview

In a world where cats have become the dominant species, you play as a feline explorer on a mission to collect and catalog the mysterious creatures known as "humans". Explore different locations, battle wild humans, and add them to your Humadex!

---

## Features

- **Text-based RPG gameplay** with multiple locations to explore
- **Turn-based battle system** with various actions and strategies
- **Humadex collection system** to catalog different human types
- **Character progression** with levels, stats, and abilities
- **Inventory system** for items and power-ups
- **Save/load functionality** using browser local storage
- **Optional Gemini API integration** for dynamic content generation

---

## Installation

Cat Collector - Human Edition runs entirely in your web browser. No installation required!

1. Download the game package
2. Extract all files to a directory of your choice
3. Open `index.html` in your web browser
4. Start playing!

---

## Game Setup

### Basic Setup

No additional setup is required to play the basic version of the game. Simply open `index.html` in your web browser and start your adventure!

### Gemini API Integration

For enhanced gameplay with dynamically generated content, you can integrate the Google Gemini API:

1. Visit [Google AI Studio](https://ai.google.dev/gemini-api)
2. Create an account or sign in
3. Generate an API key
4. In the game, go to Settings
5. Enable "Use Gemini API"
6. Enter your API key
7. Click "Test API Connection" to verify
8. Choose your preferred API usage level

```javascript
// Example of how the game uses the Gemini API
async function generateHumanDescription(humanType) {
  const prompt = `Create a humorous description for a ${humanType} in a world where cats are the dominant species.`;
  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

---

## How to Play

1. **Start a new game** from the title screen
2. **Explore locations** by selecting options in the narrative text
3. **Battle wild humans** when you encounter them
4. **Capture humans** to add them to your Humadex
5. **Level up** by gaining experience points
6. **Collect items** to help in your adventure
7. **Complete objectives** to unlock new areas

---

## Game Mechanics

### Character Stats
- **Floof**: Affects your defense and health
- **Agility**: Determines turn order and dodge chance
- **Charm**: Improves capture success rate and special abilities

### Battle System
- **Scratch Attack**: Basic attack with consistent damage
- **Special Ability**: Unique skills based on your cat's attributes
- **Capture**: Attempt to add the human to your Humadex
- **Flee**: Escape from battle (success based on Agility)

### Humadex Collection
Humans are categorized by rarity:
- **Common**: Easy to find and capture
- **Uncommon**: Moderately difficult to locate
- **Rare**: Challenging to find and capture
- **Legendary**: Extremely rare and difficult to capture

---

## Technical Details

- **Languages**: HTML5, CSS3, JavaScript
- **Storage**: Local Storage API for game saves
- **Optional API**: Google Gemini API for dynamic content
- **File Structure**:
  - `index.html`: Main game file
  - `css/styles.css`: Game styling
  - `js/game.js`: Game logic and functionality
  - `docs/`: Documentation files

---

## Browser Compatibility

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

---

## Troubleshooting

### Game Not Saving
- Ensure cookies and local storage are enabled in your browser
- Check that you have available storage space
- Try clearing your browser cache

### API Connection Issues
- Verify your API key is entered correctly
- Check your internet connection
- Ensure you haven't exceeded API rate limits
- Try refreshing the page and re-entering your API key

### Game Performance
- Close other browser tabs and applications
- Clear your browser cache
- Ensure your browser is updated to the latest version

---

## Credits

Cat Collector - Human Edition was created as a demonstration project for text-based RPG game development using HTML5, CSS3, and JavaScript.

All game content is fictional and created for entertainment purposes only.

---

*Last updated: April 3, 2025*