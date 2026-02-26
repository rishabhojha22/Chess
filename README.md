# Chess Game

A modern, feature-rich chess application built with **Next.js** and **React**. Designed for chess players of all levels, it offers a soft, responsive interface, customizable settings, multilingual support, and a smooth gameplay experience.
---

## Features

- Interactive Chess Board: Drag-and-drop or click-to-move piece movement.
- Game Rules Enforcement: Full chess rules including castling, en passant, and checkmate detection.
- Multilingual Support: Available in 12 languages for global accessibility.
- Customizable Themes: Light, dark, or system theme options.
- Responsive Design: Optimized for desktop, tablet, and mobile devices.
- Game Timer: Optional 10-minute timer for timed matches.
- Move History: Real-time tracking in standard chess notation.
- Game Statistics: Displays captured pieces, move count, and game phase.
- Particle Background: Dynamic, interactive background animation.
- Keyboard Shortcuts: Comprehensive controls for all major actions.
- Fullscreen Mode: Toggle for a distraction-free experience.
- Accessibility Features: Tooltips and built-in help system.
- High Performance: Fast load times and smooth gameplay.

---

## Getting Started

Set up and run Chess Game locally with these steps.

### Prerequisites

- **Node.js**: Version 18.0 or higher
- **Package Manager**: `npm` or `yarn`

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/rishabhojha22/Chess.git
   ```

2. **Navigate to the Project Directory**
   ```bash
   cd Chess
   ```

3. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open **[http://localhost:3000](http://localhost:3000)** in your browser to start playing.

---

## Usage

Once the application is running, you can explore and customize it. Below are key sections and how to use them effectively.

### Getting Started
- Launch the development server as described above.
- Click "Start Playing" on the home page to begin a game with white to move.
- Use the board controls or keyboard shortcuts to play.

### Chess Board
- **Purpose**: Play chess with an interactive board.
- **How to Use**: Click a piece to select it, then click a valid square to move. Drag-and-drop also supported.

### Game Controls
- **Purpose**: Manage gameplay with intuitive controls.
- **How to Use**: Use buttons below the board to undo, redo, reset, flip, or toggle fullscreen mode.

### Settings
- **Purpose**: Customize the game experience.
- **How to Use**: Access the settings menu to adjust themes, fonts, language, and timer options.

---

## Project Structure

```plaintext
chess/
├── app/                  # Next.js app directory
│   ├── game/             # Game page
│   ├── providers.tsx     # Context providers
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # Reusable React components
│   ├── custom-chessboard.tsx  # Chess board component
│   ├── game-stats.tsx    # Game statistics widget
│   ├── move-history.tsx  # Move history widget
│   └── ...               # Other UI components
├── lib/                  # Utility functions
│   └── translations.ts   # Translation system
├── hooks/                # Custom React hooks
├── public/               # Static assets
│   ├── images/           # Images and icons
│   └── ...               # Other public files
├── styles/               # Global styles
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies and scripts
```

---

## Built With

- [Next.js](https://nextjs.org/) - React framework for production-grade apps
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript for reliability
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [chess.js](https://github.com/jhlywa/chess.js) - Chess logic engine
- [tsparticles](https://particles.js.org/) - Particle effects
- [react-hotkeys-hook](https://github.com/JohannesKlauss/react-hotkeys-hook) - Keyboard shortcuts
- [Lucide Icons](https://lucide.dev/) - Consistent icon set
- [shadcn/ui](https://ui.shadcn.com/) - Reusable UI components

---

## Dependencies

To run this project, the following Node.js packages are required (listed in `package.json`):
- `next` - Core framework
- `react` and `react-dom` - React libraries
- `typescript` - Type checking
- `tailwindcss` - Styling
- `framer-motion` - Animations
- `chess.js` - Chess logic
- `tsparticles` - Particle effects
- `react-hotkeys-hook` - Keyboard shortcuts
- `@lucide/react` - Icons
- Various `shadcn/ui` dependencies (e.g., `@radix-ui/*`)

Install them with:
```bash
npm install
```

---

## Key Features Explained

### Interactive Chess Board
A fully functional board with drag-and-drop or click-to-move mechanics, powered by `chess.js` and `custom-chessboard.tsx`.

### Multilingual Support
Supports 12 languages with a custom translation system in `lib/translations.ts`.

### Particle Background
Dynamic particle effects using `tsparticles`, enhancing visual appeal.

### Keyboard Shortcuts
Comprehensive controls implemented with `react-hotkeys-hook` for efficient gameplay.

---

## License

This project is licensed under the [MIT License](LICENSE). See the license file for details.

---

## Acknowledgments

- [chess.js](https://github.com/jhlywa/chess.js) - Robust chess logic
- [tsparticles](https://particles.js.org/) - Particle animations
- [shadcn/ui](https://ui.shadcn.com/) - Reusable UI components
- [Lucide Icons](https://lucide.dev/) - Beautiful icon library
- [Framer Motion](https://www.framer.com/motion/) - Smooth animations
- [Tailwind CSS](https://tailwindcss.com/) - Efficient styling
- [Next.js](https://nextjs.org/) - Robust framework

---

**Developed by Rishabh Ojha**   
© 2026 Chess Game. All rights reserved.
