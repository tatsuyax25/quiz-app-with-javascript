# Frontend Dev Quiz 🚀

A modern, interactive quiz application for testing frontend development knowledge across HTML, CSS, JavaScript, and React. Features a beautiful UI with dark/light themes, animated backgrounds, timer functionality, and comprehensive question explanations.

## 📸 Screenshots

### Light Theme - Quiz Setup
![Quiz Setup Light](https://imgur.com/iTHidiT.png)
*Choose your category and difficulty level with the clean, modern interface*

### Dark Theme - Quiz Setup
![Quiz Setup Dark](https://imgur.com/dbIQtuO.png)
*Elegant dark mode with gradient backgrounds and smooth animations*

### Quiz in Progress
![Quiz Progress](https://imgur.com/Bpceizl.png)
*Interactive quiz interface with timer, progress bar, and animated elements*

### Answer Explanation
![Answer Explanation](https://imgur.com/ewpwQCz.png)
*Educational explanations help you learn from each question*

### Quiz Completion
![Quiz Complete](https://imgur.com/wPNfyq0.png)
*Celebrate your results with confetti animation and score tracking*

### Mobile Responsive
![Mobile View](https://imgur.com/3NxOSNk.png)
*Fully responsive design works perfectly on all devices*

## ✨ Features

### 🎯 **Core Functionality**
- **88 comprehensive questions** across 4 categories (HTML, CSS, JavaScript, React)
- **3 difficulty levels** with varying question counts (Beginner: 10, Intermediate: 7, Advanced: 5)
- **Randomized answers** - correct answers appear in different positions each time
- **15-second timer** per question with visual warning system
- **Score tracking** with localStorage persistence for high scores

### 🎨 **Modern UI/UX**
- **Dark/Light theme toggle** with smooth transitions
- **Animated gradient backgrounds** with floating particles
- **Glassmorphism design** with backdrop blur effects
- **Confetti celebrations** for high scores and achievements
- **Smooth animations** and interactive button effects
- **Fully responsive** design for all screen sizes

### 🔊 **Interactive Elements**
- **Sound effects** for correct/wrong answers using Web Audio API
- **Visual feedback** with color-coded themes for answer states
- **Progress bar animation** showing quiz completion
- **Ripple effects** on button interactions

### 📚 **Educational Value**
- **Detailed explanations** for each question to enhance learning
- **Progressive difficulty** following frontend development roadmap
- **Category-specific content** tailored to each technology
- **Learning roadmap order**: HTML → CSS → JavaScript → React

### ♿ **Accessibility**
- **ARIA labels** and semantic HTML structure
- **Keyboard navigation** support
- **Screen reader friendly** with proper heading hierarchy
- **High contrast** color schemes in both themes

## 🛠️ Technologies Used

- **HTML5** - Semantic structure with accessibility features
- **CSS3** - Modern styling with custom properties, gradients, and animations
- **Vanilla JavaScript** - No frameworks, pure ES6+ features
- **Web Audio API** - Dynamic sound generation
- **LocalStorage API** - Persistent data storage
- **CSS Grid & Flexbox** - Responsive layout system

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional dependencies required!

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/frontend-dev-quiz.git
   cd frontend-dev-quiz
   ```

2. **Open in browser**
   ```bash
   # Simply open index.html in your browser
   open index.html
   # Or use a local server
   python -m http.server 8000
   # Then visit http://localhost:8000
   ```

3. **Start learning!**
   - Select your category and difficulty
   - Answer questions within the time limit
   - Learn from detailed explanations
   - Track your progress and beat your high score

## 📁 Project Structure

```
frontend-dev-quiz/
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── script.js           # Quiz logic and interactions
├── screenshots/        # UI screenshots for README
└── README.md          # Project documentation
```

## 🎮 How to Play

1. **Choose Category**: Select from HTML, CSS, JavaScript, or React
2. **Select Difficulty**: Pick Beginner, Intermediate, or Advanced
3. **Start Quiz**: Click "Start Quiz" to begin
4. **Answer Questions**: You have 15 seconds per question
5. **Learn**: Read explanations after each answer
6. **Track Progress**: Watch your score and try to beat your high score!

## 🎯 Question Categories

### 🏗️ **HTML** (22 questions)
- **Beginner**: Basic tags, attributes, forms, semantic elements
- **Intermediate**: HTML5 features, accessibility, meta tags
- **Advanced**: Shadow DOM, Web Components, modern APIs

### 🎨 **CSS** (22 questions)
- **Beginner**: Selectors, properties, basic styling, box model
- **Intermediate**: Flexbox, positioning, pseudo-classes, responsive design
- **Advanced**: Grid, custom properties, CSS Houdini, advanced layouts

### ⚡ **JavaScript** (22 questions)
- **Beginner**: Variables, functions, arrays, basic syntax
- **Intermediate**: Objects, this keyword, JSON, array methods, hoisting
- **Advanced**: Closures, prototypes, event loop, async programming

### ⚛️ **React** (22 questions)
- **Beginner**: JSX, components, props, basic hooks, events
- **Intermediate**: useEffect, Context, controlled components, optimization
- **Advanced**: Fiber, SSR, Suspense, Portals, advanced patterns

## 🎨 Customization

### Adding New Questions

1. Open `script.js`
2. Add questions to the `questionBank` array:

```javascript
{
    category: 'javascript',
    difficulty: 'beginner',
    question: 'Your question here?',
    answers: [
        { text: 'Option 1', correct: false },
        { text: 'Correct Answer', correct: true },
        { text: 'Option 3', correct: false },
        { text: 'Option 4', correct: false }
    ],
    explanation: 'Detailed explanation of why this answer is correct.'
}
```

### Modifying Themes

1. Open `styles.css`
2. Update CSS custom properties in `:root`:

```css
:root {
    --hue-neutral: 200;  /* Change base color */
    --hue-wrong: 0;      /* Wrong answer color */
    --hue-correct: 145;  /* Correct answer color */
}
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Add your changes**: New questions, UI improvements, bug fixes
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Ideas for Contributions
- 📝 Add more questions for existing categories
- 🆕 Add new categories (TypeScript, Node.js, etc.)
- 🎨 Create new themes or animations
- 🐛 Fix bugs or improve performance
- 📱 Enhance mobile experience
- ♿ Improve accessibility features

## 📈 Performance

- **Lightweight**: No external dependencies
- **Fast loading**: Optimized CSS and JavaScript
- **Smooth animations**: Hardware-accelerated CSS transitions
- **Efficient DOM manipulation**: Minimal reflows and repaints
- **Memory conscious**: Proper cleanup of timers and event listeners

## 🌐 Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Design inspiration**: Modern web design trends and glassmorphism
- **Question content**: Based on industry best practices and documentation
- **Icons**: Emoji icons for better visual appeal
- **Animations**: CSS animations for enhanced user experience

---

[![Netlify Status](https://api.netlify.com/api/v1/badges/d682efed-20ea-466a-9bff-da62ec3b04c2/deploy-status)](https://app.netlify.com/projects/amazingquizjs/deploys)

**Made with ❤️ for the frontend development community**

*Happy coding and keep learning! 🚀*
