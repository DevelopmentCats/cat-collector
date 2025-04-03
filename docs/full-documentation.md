# Cat Collector - Human Edition

**A text-based RPG where cats have become the dominant species and you collect humans for your Humadex**

## 🐱 Game Overview

### Concept and Storyline
In a world where cats have become the dominant species, you play as a feline collector named Whiskers on a mission to capture and catalog the most interesting human specimens. As a skilled cat explorer, you'll travel through various locations, encounter different types of humans, and build your collection in your Humadex.

### Key Features
- **Text-based RPG Gameplay**: Navigate through a story-driven adventure with meaningful choices
- **Human Collection System**: Encounter, battle, and capture humans of varying rarities
- **Humadex Catalog**: Document and view details about your collected humans
- **Battle System**: Strategic turn-based battles against wild humans
- **Location Exploration**: Discover new areas as you level up
- **AI-Generated Content**: Optional Gemini API integration for dynamic human descriptions and encounters

## 🛠️ Setup Instructions

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Internet connection (optional, for Gemini API features)

### Installation
1. Download the game package containing:
   - `index.html`
   - `styles.css`
   - `game.js`

2. Keep all files in the same directory

### Local Execution
1. Simply open the `index.html` file in your web browser
2. No server required - the game runs entirely in your browser

### Gemini API Setup (Optional)
The game can use Google's Gemini API to generate unique human descriptions and enhance gameplay. To set this up:

1. Create or use an existing Google account
2. Visit [Google AI Studio](https://ai.google.dev/gemini-api)
3. Click "Get API key in Google AI Studio"
4. Review and approve the terms
5. Generate and copy your API key
6. In the game, go to Settings and paste your API key in the designated field
7. Click "Save & Test" to verify your API key works

## 🎮 Gameplay Guide

### Controls and User Interface
- **Start Screen**: The game begins at the Start screen with options to Start Game, Load Game, or access Settings
- **Main Game Screen**: Navigate the world, explore locations, and manage your cat's stats
- **Battle Screen**: Engage in turn-based battles with humans you encounter
- **Humadex Screen**: View and filter your collected humans by type, rarity, or name
- **Settings Screen**: Configure game options and set up your Gemini API key

### Game Mechanics

#### Exploration
- Explore different locations like Suburban Neighborhood, Downtown, and Corporate Park to find humans
- Each location has different types of humans with varying rarities
- New locations unlock as you level up

#### Battle System
- **Turn-based Combat**: Take turns attacking or using special abilities against humans
- **Health Points (HP)**: Reduce a human's HP to make them easier to capture
- **Special Abilities**: Use your cat's special abilities like "Cute Meow", "Pounce", and "Hiss" for strategic advantage
- **Capture System**: Attempt to capture humans when their HP is low
  - Rarer humans are harder to capture
  - Each human type has a different catch rate

#### Human Collection (Humadex)
- **Rarity Tiers**: Humans come in four rarity levels:
  - Common (70% encounter rate)
  - Uncommon (30% encounter rate)
  - Rare (15% encounter rate)
  - Legendary (5% encounter rate)
- **Human Types**: Various human types including:
  - Common: Office Worker, Student, Jogger
  - Uncommon: Teacher, Chef, Delivery Person
  - Rare: Programmer, Scientist, Athlete
  - Legendary: Celebrity, Politician
- **Special Traits**: Each human has unique traits like "Coffee Addict", "Stack Overflow Searcher", "Health Nut", or "Camera Ready"
- **Humadex Completion**: Track your collection progress with statistics and filters

### Tips and Strategies
- Weaken humans before attempting to capture them
- Different locations have different types of humans - explore widely
- Use your special ability strategically during difficult battles
- Rest to recover health between explorations
- Legendary humans are extremely rare - be persistent!
- Use the Gemini API for more immersive and unique human descriptions
- Collect items like Catnip, Tuna Can, and Yarn Ball to help in your adventures

## 🔧 Technical Information

### File Structure
- `index.html` - Main game HTML structure (13487 bytes)
- `styles.css` - Game styling and visual effects (13840 bytes)
- `game.js` - Game logic and mechanics (54626 bytes)

### Technologies Used
- **HTML5**: Game structure and content
- **CSS3**: Styling and animations
- **JavaScript**: Game logic and mechanics
- **Local Storage API**: Save game progress under "catCollectorSave"
- **Google Gemini API** (optional): AI-generated content

### API Integration
The game optionally integrates with Google's Gemini API to generate:
- Unique human descriptions
- Dynamic encounter narratives
- Location descriptions

API calls are made directly from the client-side using your provided API key. The game functions without the API, but with reduced narrative content.

### Browser Compatibility
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🙏 Credits and Acknowledgments

- **Game Concept & Development**: Cat Collector Development Team
- **Artwork**: Text-based game with minimal graphics
- **Special Thanks**: Google Gemini API for enhanced narrative content

---

## License
This game is provided for entertainment purposes only. All rights reserved.

## Support
For issues or questions, please contact the development team through the game's official channels.