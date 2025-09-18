// ===== DOM ELEMENT REFERENCES =====
// Get references to all UI elements for manipulation
const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')
const progressElement = document.getElementById('progress')
const currentQuestionElement = document.getElementById('current-question')
const totalQuestionsElement = document.getElementById('total-questions')
const timerElement = document.getElementById('time-left')
const highScoreElement = document.getElementById('high-score')
const bestScoreElement = document.getElementById('best-score')
const themeToggle = document.getElementById('theme-toggle')
const categorySelect = document.getElementById('category-select')
const difficultySelect = document.getElementById('difficulty-select')
const setupContainer = document.getElementById('setup-container')
const explanationElement = document.getElementById('explanation')
const progressFill = document.getElementById('progress-fill')
const confettiContainer = document.getElementById('confetti-container')

// ===== GLOBAL VARIABLES =====
// Variables to track quiz state
let shuffledQuestions, currentQuestionIndex, score, timer, timeLeft

// ===== EVENT LISTENERS =====
// Set up event handlers for user interactions
startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    setNextQuestion()
})

themeToggle.addEventListener('click', toggleTheme)

// ===== THEME MANAGEMENT =====
/**
 * Toggle between light and dark themes
 * Saves preference to localStorage
 */
function toggleTheme() {
    document.body.classList.toggle('dark-mode')
    const isDark = document.body.classList.contains('dark-mode')
    themeToggle.textContent = isDark ? '☀️' : '🌙'
    localStorage.setItem('darkMode', isDark)
}

/**
 * Load saved theme preference from localStorage
 * Called on page load
 */
function loadTheme() {
    const isDark = localStorage.getItem('darkMode') === 'true'
    if (isDark) {
        document.body.classList.add('dark-mode')
        themeToggle.textContent = '☀️'
    }
}

// Initialize theme on page load
loadTheme()

// ===== GAME FLOW FUNCTIONS =====
/**
 * Initialize and start a new quiz
 * Gets selected category/difficulty and sets up the game state
 */
function startGame() {
    const category = categorySelect.value
    const difficulty = difficultySelect.value
    
    // Hide setup UI and show quiz UI
    startButton.classList.add('hide')
    setupContainer.classList.add('hide')
    
    // Get and shuffle questions for selected category/difficulty
    shuffledQuestions = getQuestionsByCategory(category, difficulty).sort(() => Math.random() - .5)
    
    // Initialize game state
    currentQuestionIndex = 0
    score = 0
    
    // Show quiz elements
    questionContainerElement.classList.remove('hide')
    progressElement.classList.remove('hide')
    totalQuestionsElement.textContent = shuffledQuestions.length
    
    loadHighScore()
    setNextQuestion()
}

function setNextQuestion() {
    resetState()
    showQuestion(shuffledQuestions[currentQuestionIndex])
    updateProgress()
    startTimer()
}

function showQuestion(question) {
    questionElement.innerText = question.question
    const shuffledAnswers = [...question.answers].sort(() => Math.random() - 0.5)
    shuffledAnswers.forEach(answer => {
        const button = document.createElement('button')
        button.innerText = answer.text
        button.classList.add('btn')
        // Setting this 'if' statement only if the answer is correct
        if (answer.correct) {
            button.dataset.correct = answer.correct
        }
        button.addEventListener('click', selectAnswer)
        answerButtonsElement.appendChild(button)
    })
}

function resetState() {
    clearStatusClass(document.body)
    nextButton.classList.add('hide')
    answerButtonsElement.innerHTML = ''
    explanationElement.classList.add('hide')
    timerElement.parentElement.classList.remove('warning')
    clearInterval(timer)
}

function selectAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    const currentQuestion = shuffledQuestions[currentQuestionIndex]
    
    clearInterval(timer)
    if (correct) {
        score++
        playSound('correct')
    } else {
        playSound('wrong')
    }
    
    setStatusClass(document.body, correct)
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
        button.disabled = true
    })
    
    showExplanation(currentQuestion, correct)
    
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide')
    } else {
        showFinalScore()
    }
}

function setStatusClass(element, correct) {
    clearStatusClass(element)
    if (correct) {
        element.classList.add('correct')
    } else {
        element.classList.add('wrong')
    }
}

function clearStatusClass(element) {
    element.classList.remove('correct', 'wrong')
}

function updateProgress() {
    currentQuestionElement.textContent = currentQuestionIndex + 1
    const percentage = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100
    progressFill.style.width = percentage + '%'
}

function startTimer() {
    timeLeft = 15
    timerElement.textContent = timeLeft
    timerElement.parentElement.classList.remove('warning')
    timer = setInterval(() => {
        timeLeft--
        timerElement.textContent = timeLeft
        if (timeLeft <= 5) {
            timerElement.parentElement.classList.add('warning')
        }
        if (timeLeft <= 0) {
            clearInterval(timer)
            timeUp()
        }
    }, 1000)
}

function timeUp() {
    playSound('wrong')
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct)
        button.disabled = true
    })
    setStatusClass(document.body, false)
    
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide')
    } else {
        showFinalScore()
    }
}

function loadHighScore() {
    const saved = localStorage.getItem('quizHighScore')
    if (saved) {
        bestScoreElement.textContent = saved
        highScoreElement.classList.remove('hide')
    }
}

function saveHighScore(percentage) {
    const current = localStorage.getItem('quizHighScore') || 0
    if (percentage > current) {
        localStorage.setItem('quizHighScore', percentage)
        bestScoreElement.textContent = percentage
        highScoreElement.classList.remove('hide')
        return true
    }
    return false
}

function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const oscillator = audioContext.createOscillator()
    const gainNode = audioContext.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContext.destination)
    
    if (type === 'correct') {
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1)
    } else {
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime)
        oscillator.frequency.setValueAtTime(196, audioContext.currentTime + 0.1)
    }
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
    
    oscillator.start(audioContext.currentTime)
    oscillator.stop(audioContext.currentTime + 0.3)
}

function showExplanation(question, wasCorrect) {
    if (question.explanation) {
        explanationElement.innerHTML = `<strong>${wasCorrect ? 'Correct!' : 'Incorrect.'}</strong> ${question.explanation}`
        explanationElement.className = `explanation ${wasCorrect ? 'correct' : 'wrong'}`
        explanationElement.classList.remove('hide')
    }
}

function getQuestionsByCategory(category, difficulty) {
    const questions = questionBank.filter(q => q.category === category && q.difficulty === difficulty)
    const questionCounts = {
        beginner: 10,
        intermediate: 7,
        advanced: 5
    }
    return questions.slice(0, questionCounts[difficulty])
}

function createConfetti() {
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div')
        confetti.className = 'confetti'
        confetti.style.left = Math.random() * 100 + '%'
        confetti.style.animationDelay = Math.random() * 3 + 's'
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's'
        confettiContainer.appendChild(confetti)
        
        setTimeout(() => confetti.remove(), 5000)
    }
}

function showFinalScore() {
    const percentage = Math.round(score/shuffledQuestions.length*100)
    const isNewRecord = saveHighScore(percentage)
    
    if (percentage >= 80 || isNewRecord) {
        createConfetti()
    }
    
    questionElement.innerText = `Quiz Complete! Your score: ${score}/${shuffledQuestions.length} (${percentage}%)${isNewRecord ? ' 🎉 New High Score!' : ''}`
    answerButtonsElement.innerHTML = ''
    explanationElement.classList.add('hide')
    progressElement.classList.add('hide')
    setupContainer.classList.remove('hide')
    startButton.innerText = 'Start New Quiz'
    startButton.classList.remove('hide')
    progressFill.style.width = '0%'
}

const questionBank = [
    // JavaScript Beginner Questions (10 questions)
    {
        category: 'javascript',
        difficulty: 'beginner',
        question: 'What does "let" do in JavaScript?',
        answers: [
            { text: 'Declares a block-scoped variable', correct: true },
            { text: 'Creates a global variable', correct: false },
            { text: 'Defines a constant', correct: false },
            { text: 'Creates a function', correct: false }
        ],
        explanation: 'let declares variables that are limited to the scope of a block statement.'
    },
    {
        category: 'javascript',
        difficulty: 'beginner',
        question: 'Which method adds an element to the end of an array?',
        answers: [
            { text: 'unshift()', correct: false },
            { text: 'push()', correct: true },
            { text: 'pop()', correct: false },
            { text: 'shift()', correct: false }
        ],
        explanation: 'push() adds one or more elements to the end of an array and returns the new length.'
    },
    {
        category: 'javascript',
        difficulty: 'beginner',
        question: 'How do you write "Hello World" in an alert box?',
        answers: [
            { text: 'alert("Hello World")', correct: true },
            { text: 'msg("Hello World")', correct: false },
            { text: 'alertBox("Hello World")', correct: false },
            { text: 'msgBox("Hello World")', correct: false }
        ],
        explanation: 'alert() displays an alert dialog with the specified message.'
    },
    {
        category: 'javascript',
        difficulty: 'beginner',
        question: 'Which operator is used to assign a value to a variable?',
        answers: [
            { text: '=', correct: true },
            { text: '==', correct: false },
            { text: '===', correct: false },
            { text: '*', correct: false }
        ],
        explanation: 'The = operator assigns a value to a variable.'
    },
    {
        category: 'javascript',
        difficulty: 'beginner',
        question: 'What will typeof null return?',
        answers: [
            { text: '"null"', correct: false },
            { text: '"undefined"', correct: false },
            { text: '"object"', correct: true },
            { text: '"boolean"', correct: false }
        ],
        explanation: 'typeof null returns "object" due to a legacy bug in JavaScript.'
    },
    {
        category: 'javascript',
        difficulty: 'beginner',
        question: 'How do you create a function in JavaScript?',
        answers: [
            { text: 'function myFunction() {}', correct: true },
            { text: 'create myFunction() {}', correct: false },
            { text: 'function = myFunction() {}', correct: false },
            { text: 'def myFunction() {}', correct: false }
        ],
        explanation: 'Functions are declared using the function keyword followed by the function name.'
    },
    {
        category: 'javascript',
        difficulty: 'beginner',
        question: 'Which method removes the last element from an array?',
        answers: [
            { text: 'pop()', correct: true },
            { text: 'push()', correct: false },
            { text: 'shift()', correct: false },
            { text: 'unshift()', correct: false }
        ],
        explanation: 'pop() removes and returns the last element from an array.'
    },
    {
        category: 'javascript',
        difficulty: 'beginner',
        question: 'What is the correct way to write a JavaScript array?',
        answers: [
            { text: 'var colors = ["red", "green", "blue"]', correct: true },
            { text: 'var colors = "red", "green", "blue"', correct: false },
            { text: 'var colors = (1:"red", 2:"green", 3:"blue")', correct: false },
            { text: 'var colors = 1 = ("red"), 2 = ("green"), 3 = ("blue")', correct: false }
        ],
        explanation: 'Arrays are created using square brackets with comma-separated values.'
    },
    {
        category: 'javascript',
        difficulty: 'beginner',
        question: 'How do you write "Hello World" to the console?',
        answers: [
            { text: 'console.log("Hello World")', correct: true },
            { text: 'print("Hello World")', correct: false },
            { text: 'echo("Hello World")', correct: false },
            { text: 'write("Hello World")', correct: false }
        ],
        explanation: 'console.log() outputs messages to the browser console.'
    },
    {
        category: 'javascript',
        difficulty: 'beginner',
        question: 'Which event occurs when the user clicks on an HTML element?',
        answers: [
            { text: 'onclick', correct: true },
            { text: 'onchange', correct: false },
            { text: 'onmouseclick', correct: false },
            { text: 'onmouseover', correct: false }
        ],
        explanation: 'The onclick event occurs when an element is clicked.'
    },
    // JavaScript Intermediate Questions (7 questions)
    {
        category: 'javascript',
        difficulty: 'intermediate',
        question: 'What is the result of "3" + 2 in JavaScript?',
        answers: [
            { text: '5', correct: false },
            { text: '"32"', correct: true },
            { text: 'Error', correct: false },
            { text: 'undefined', correct: false }
        ],
        explanation: 'JavaScript performs type coercion, converting the number 2 to a string and concatenating.'
    },
    {
        category: 'javascript',
        difficulty: 'intermediate',
        question: 'What does the "this" keyword refer to?',
        answers: [
            { text: 'The current function', correct: false },
            { text: 'The object that owns the code', correct: true },
            { text: 'The previous element', correct: false },
            { text: 'The global window', correct: false }
        ],
        explanation: '"this" refers to the object that the function is a property of.'
    },
    {
        category: 'javascript',
        difficulty: 'intermediate',
        question: 'Which method is used to convert JSON string to JavaScript object?',
        answers: [
            { text: 'JSON.parse()', correct: true },
            { text: 'JSON.stringify()', correct: false },
            { text: 'JSON.convert()', correct: false },
            { text: 'JSON.object()', correct: false }
        ],
        explanation: 'JSON.parse() converts a JSON string into a JavaScript object.'
    },
    {
        category: 'javascript',
        difficulty: 'intermediate',
        question: 'What is the difference between == and ===?',
        answers: [
            { text: '== checks type and value, === checks only value', correct: false },
            { text: '== checks only value, === checks type and value', correct: true },
            { text: 'No difference', correct: false },
            { text: '=== is faster than ==', correct: false }
        ],
        explanation: '== performs type coercion, while === checks both type and value without coercion.'
    },
    {
        category: 'javascript',
        difficulty: 'intermediate',
        question: 'What does the map() method do?',
        answers: [
            { text: 'Creates a new array with results of calling a function for every element', correct: true },
            { text: 'Filters elements from an array', correct: false },
            { text: 'Sorts an array', correct: false },
            { text: 'Finds an element in an array', correct: false }
        ],
        explanation: 'map() creates a new array with the results of calling a function for every array element.'
    },
    {
        category: 'javascript',
        difficulty: 'intermediate',
        question: 'What is hoisting in JavaScript?',
        answers: [
            { text: 'Moving variables and functions to the top of their scope', correct: true },
            { text: 'Lifting heavy objects', correct: false },
            { text: 'A way to optimize code', correct: false },
            { text: 'A method to handle errors', correct: false }
        ],
        explanation: 'Hoisting is JavaScript\'s behavior of moving declarations to the top of their scope.'
    },
    {
        category: 'javascript',
        difficulty: 'intermediate',
        question: 'What is the purpose of the setTimeout() function?',
        answers: [
            { text: 'To execute code after a specified delay', correct: true },
            { text: 'To stop code execution', correct: false },
            { text: 'To measure execution time', correct: false },
            { text: 'To handle timeouts', correct: false }
        ],
        explanation: 'setTimeout() executes a function after a specified number of milliseconds.'
    },
    // JavaScript Advanced Questions (5 questions)
    {
        category: 'javascript',
        difficulty: 'advanced',
        question: 'What is a closure in JavaScript?',
        answers: [
            { text: 'A way to close browser windows', correct: false },
            { text: 'A function with access to outer scope variables', correct: true },
            { text: 'A method to end loops', correct: false },
            { text: 'A type of error handling', correct: false }
        ],
        explanation: 'A closure gives you access to an outer function\'s scope from an inner function.'
    },
    {
        category: 'javascript',
        difficulty: 'advanced',
        question: 'What is the event loop in JavaScript?',
        answers: [
            { text: 'A mechanism that handles asynchronous operations', correct: true },
            { text: 'A way to loop through events', correct: false },
            { text: 'A method to prevent infinite loops', correct: false },
            { text: 'A debugging tool', correct: false }
        ],
        explanation: 'The event loop handles the execution of multiple chunks of your program over time.'
    },
    {
        category: 'javascript',
        difficulty: 'advanced',
        question: 'What is prototypal inheritance?',
        answers: [
            { text: 'Objects can inherit directly from other objects', correct: true },
            { text: 'Classes inherit from parent classes', correct: false },
            { text: 'Functions inherit from prototypes', correct: false },
            { text: 'Variables inherit types', correct: false }
        ],
        explanation: 'JavaScript uses prototypal inheritance where objects can inherit directly from other objects.'
    },
    {
        category: 'javascript',
        difficulty: 'advanced',
        question: 'What does "use strict" do?',
        answers: [
            { text: 'Enables strict mode for better error checking', correct: true },
            { text: 'Makes code run faster', correct: false },
            { text: 'Enables new JavaScript features', correct: false },
            { text: 'Compresses the code', correct: false }
        ],
        explanation: 'Strict mode catches common coding mistakes and prevents unsafe actions.'
    },
    {
        category: 'javascript',
        difficulty: 'advanced',
        question: 'What is the difference between call() and apply()?',
        answers: [
            { text: 'call() takes arguments separately, apply() takes an array', correct: true },
            { text: 'apply() is faster than call()', correct: false },
            { text: 'call() is for objects, apply() is for functions', correct: false },
            { text: 'No difference', correct: false }
        ],
        explanation: 'call() takes arguments individually, while apply() takes arguments as an array.'
    },
    // HTML Beginner Questions (10 questions)
    {
        category: 'html',
        difficulty: 'beginner',
        question: 'What does HTML stand for?',
        answers: [
            { text: 'HyperText Markup Language', correct: true },
            { text: 'High Tech Modern Language', correct: false },
            { text: 'Home Tool Markup Language', correct: false },
            { text: 'Hyperlink and Text Markup Language', correct: false }
        ],
        explanation: 'HTML stands for HyperText Markup Language, the standard markup language for web pages.'
    },
    {
        category: 'html',
        difficulty: 'beginner',
        question: 'Which HTML element is used for the largest heading?',
        answers: [
            { text: '<h6>', correct: false },
            { text: '<h1>', correct: true },
            { text: '<header>', correct: false },
            { text: '<heading>', correct: false }
        ],
        explanation: '<h1> represents the most important heading, typically the largest by default.'
    },
    {
        category: 'html',
        difficulty: 'beginner',
        question: 'What is the correct HTML element for inserting a line break?',
        answers: [
            { text: '<br>', correct: true },
            { text: '<lb>', correct: false },
            { text: '<break>', correct: false },
            { text: '<newline>', correct: false }
        ],
        explanation: 'The <br> tag inserts a single line break.'
    },
    {
        category: 'html',
        difficulty: 'beginner',
        question: 'Which attribute specifies the URL of the page the link goes to?',
        answers: [
            { text: 'href', correct: true },
            { text: 'src', correct: false },
            { text: 'link', correct: false },
            { text: 'url', correct: false }
        ],
        explanation: 'The href attribute specifies the URL of the page the link goes to.'
    },
    {
        category: 'html',
        difficulty: 'beginner',
        question: 'What is the correct HTML for creating a hyperlink?',
        answers: [
            { text: '<a href="http://example.com">Example</a>', correct: true },
            { text: '<a url="http://example.com">Example</a>', correct: false },
            { text: '<link href="http://example.com">Example</link>', correct: false },
            { text: '<hyperlink>http://example.com</hyperlink>', correct: false }
        ],
        explanation: 'The <a> tag with href attribute creates hyperlinks.'
    },
    {
        category: 'html',
        difficulty: 'beginner',
        question: 'Which HTML element is used to specify a footer for a document?',
        answers: [
            { text: '<footer>', correct: true },
            { text: '<bottom>', correct: false },
            { text: '<section>', correct: false },
            { text: '<foot>', correct: false }
        ],
        explanation: 'The <footer> element represents a footer for its nearest sectioning content.'
    },
    {
        category: 'html',
        difficulty: 'beginner',
        question: 'What is the correct HTML for making a text input field?',
        answers: [
            { text: '<input type="text">', correct: true },
            { text: '<textfield>', correct: false },
            { text: '<input type="textfield">', correct: false },
            { text: '<textinput>', correct: false }
        ],
        explanation: '<input type="text"> creates a single-line text input field.'
    },
    {
        category: 'html',
        difficulty: 'beginner',
        question: 'Which HTML attribute is used to define inline styles?',
        answers: [
            { text: 'style', correct: true },
            { text: 'css', correct: false },
            { text: 'class', correct: false },
            { text: 'font', correct: false }
        ],
        explanation: 'The style attribute is used to add inline CSS styles to HTML elements.'
    },
    {
        category: 'html',
        difficulty: 'beginner',
        question: 'What is the correct HTML for making a checkbox?',
        answers: [
            { text: '<input type="checkbox">', correct: true },
            { text: '<checkbox>', correct: false },
            { text: '<check>', correct: false },
            { text: '<input type="check">', correct: false }
        ],
        explanation: '<input type="checkbox"> creates a checkbox input.'
    },
    {
        category: 'html',
        difficulty: 'beginner',
        question: 'Which HTML element is used to display a scalar measurement within a range?',
        answers: [
            { text: '<meter>', correct: true },
            { text: '<gauge>', correct: false },
            { text: '<measure>', correct: false },
            { text: '<range>', correct: false }
        ],
        explanation: 'The <meter> element represents a scalar measurement within a known range.'
    },
    // HTML Intermediate Questions (7 questions)
    {
        category: 'html',
        difficulty: 'intermediate',
        question: 'What is the purpose of the <meta> tag?',
        answers: [
            { text: 'To provide metadata about the HTML document', correct: true },
            { text: 'To create meta-functions', correct: false },
            { text: 'To define meta-classes', correct: false },
            { text: 'To create metadata variables', correct: false }
        ],
        explanation: '<meta> tags provide metadata about the HTML document.'
    },
    {
        category: 'html',
        difficulty: 'intermediate',
        question: 'Which HTML5 element is used for navigation links?',
        answers: [
            { text: '<nav>', correct: true },
            { text: '<navigation>', correct: false },
            { text: '<menu>', correct: false },
            { text: '<links>', correct: false }
        ],
        explanation: 'The <nav> element represents a section of navigation links.'
    },
    {
        category: 'html',
        difficulty: 'intermediate',
        question: 'What is the difference between <div> and <span>?',
        answers: [
            { text: '<div> is block-level, <span> is inline', correct: true },
            { text: '<div> is inline, <span> is block-level', correct: false },
            { text: 'No difference', correct: false },
            { text: '<div> is for text, <span> is for images', correct: false }
        ],
        explanation: '<div> is a block-level element, while <span> is an inline element.'
    },
    {
        category: 'html',
        difficulty: 'intermediate',
        question: 'Which attribute makes an input field required?',
        answers: [
            { text: 'required', correct: true },
            { text: 'mandatory', correct: false },
            { text: 'needed', correct: false },
            { text: 'must', correct: false }
        ],
        explanation: 'The required attribute specifies that an input field must be filled out.'
    },
    {
        category: 'html',
        difficulty: 'intermediate',
        question: 'What does the <canvas> element do?',
        answers: [
            { text: 'Provides a drawing surface for graphics', correct: true },
            { text: 'Creates a text canvas', correct: false },
            { text: 'Defines a painting area', correct: false },
            { text: 'Creates an art gallery', correct: false }
        ],
        explanation: 'The <canvas> element provides a drawing surface for graphics via JavaScript.'
    },
    {
        category: 'html',
        difficulty: 'intermediate',
        question: 'Which HTML5 input type is used for email addresses?',
        answers: [
            { text: 'email', correct: true },
            { text: 'mail', correct: false },
            { text: 'e-mail', correct: false },
            { text: 'address', correct: false }
        ],
        explanation: '<input type="email"> is specifically designed for email addresses.'
    },
    {
        category: 'html',
        difficulty: 'intermediate',
        question: 'What is the purpose of the alt attribute in images?',
        answers: [
            { text: 'Provides alternative text for accessibility', correct: true },
            { text: 'Sets the image alignment', correct: false },
            { text: 'Defines alternative image source', correct: false },
            { text: 'Changes image altitude', correct: false }
        ],
        explanation: 'The alt attribute provides alternative text for screen readers and when images fail to load.'
    },
    // HTML Advanced Questions (5 questions)
    {
        category: 'html',
        difficulty: 'advanced',
        question: 'What is the Shadow DOM?',
        answers: [
            { text: 'Encapsulated DOM tree attached to an element', correct: true },
            { text: 'A dark theme for DOM', correct: false },
            { text: 'Hidden DOM elements', correct: false },
            { text: 'DOM elements with shadows', correct: false }
        ],
        explanation: 'Shadow DOM allows encapsulated DOM trees to be attached to elements.'
    },
    {
        category: 'html',
        difficulty: 'advanced',
        question: 'What are Web Components?',
        answers: [
            { text: 'Reusable custom elements with encapsulated functionality', correct: true },
            { text: 'Website building blocks', correct: false },
            { text: 'Web page components', correct: false },
            { text: 'Internet components', correct: false }
        ],
        explanation: 'Web Components are reusable custom elements with encapsulated functionality.'
    },
    {
        category: 'html',
        difficulty: 'advanced',
        question: 'What is the purpose of the <template> element?',
        answers: [
            { text: 'Holds client-side content that is not rendered', correct: true },
            { text: 'Creates page templates', correct: false },
            { text: 'Defines template functions', correct: false },
            { text: 'Makes template variables', correct: false }
        ],
        explanation: 'The <template> element holds client-side content that is not rendered when the page loads.'
    },
    {
        category: 'html',
        difficulty: 'advanced',
        question: 'What is the difference between sessionStorage and localStorage?',
        answers: [
            { text: 'sessionStorage expires when tab closes, localStorage persists', correct: true },
            { text: 'localStorage expires when tab closes, sessionStorage persists', correct: false },
            { text: 'No difference', correct: false },
            { text: 'sessionStorage is faster', correct: false }
        ],
        explanation: 'sessionStorage data expires when the tab closes, localStorage persists until explicitly cleared.'
    },
    {
        category: 'html',
        difficulty: 'advanced',
        question: 'What is the Intersection Observer API used for?',
        answers: [
            { text: 'Observing changes in element visibility', correct: true },
            { text: 'Finding intersecting lines', correct: false },
            { text: 'Observing API intersections', correct: false },
            { text: 'Watching element interactions', correct: false }
        ],
        explanation: 'Intersection Observer API observes changes in the intersection of a target element with an ancestor.'
    }
]
// CSS Questions will be added here
const cssQuestions = [
    // CSS Beginner Questions (10 questions)
    {
        category: 'css',
        difficulty: 'beginner',
        question: 'Which property is used to change the background color?',
        answers: [
            { text: 'color', correct: false },
            { text: 'background-color', correct: true },
            { text: 'bgcolor', correct: false },
            { text: 'background', correct: false }
        ],
        explanation: 'background-color sets the background color of an element.'
    },
    {
        category: 'css',
        difficulty: 'beginner',
        question: 'How do you make text bold in CSS?',
        answers: [
            { text: 'font-weight: bold', correct: true },
            { text: 'text-style: bold', correct: false },
            { text: 'font-style: bold', correct: false },
            { text: 'text-weight: bold', correct: false }
        ],
        explanation: 'font-weight: bold makes text appear bold.'
    },
    {
        category: 'css',
        difficulty: 'beginner',
        question: 'Which CSS property controls the text size?',
        answers: [
            { text: 'font-size', correct: true },
            { text: 'text-size', correct: false },
            { text: 'font-style', correct: false },
            { text: 'text-style', correct: false }
        ],
        explanation: 'font-size controls the size of text.'
    },
    {
        category: 'css',
        difficulty: 'beginner',
        question: 'How do you select an element with id "header"?',
        answers: [
            { text: '#header', correct: true },
            { text: '.header', correct: false },
            { text: 'header', correct: false },
            { text: '*header', correct: false }
        ],
        explanation: 'The # symbol is used to select elements by their id attribute.'
    },
    {
        category: 'css',
        difficulty: 'beginner',
        question: 'Which property is used to change the text color?',
        answers: [
            { text: 'color', correct: true },
            { text: 'text-color', correct: false },
            { text: 'font-color', correct: false },
            { text: 'text-style', correct: false }
        ],
        explanation: 'The color property sets the color of text.'
    },
    {
        category: 'css',
        difficulty: 'beginner',
        question: 'How do you make a list that lists items with bullets?',
        answers: [
            { text: 'list-style-type: disc', correct: true },
            { text: 'list-style-type: bullet', correct: false },
            { text: 'list-type: bullets', correct: false },
            { text: 'list: bullets', correct: false }
        ],
        explanation: 'list-style-type: disc creates bulleted lists.'
    },
    {
        category: 'css',
        difficulty: 'beginner',
        question: 'Which property is used to change the margin?',
        answers: [
            { text: 'margin', correct: true },
            { text: 'padding', correct: false },
            { text: 'spacing', correct: false },
            { text: 'border', correct: false }
        ],
        explanation: 'The margin property sets the outer spacing of an element.'
    },
    {
        category: 'css',
        difficulty: 'beginner',
        question: 'How do you select elements with class "container"?',
        answers: [
            { text: '.container', correct: true },
            { text: '#container', correct: false },
            { text: 'container', correct: false },
            { text: '*container', correct: false }
        ],
        explanation: 'The . symbol is used to select elements by their class attribute.'
    },
    {
        category: 'css',
        difficulty: 'beginner',
        question: 'Which property is used to change the font of an element?',
        answers: [
            { text: 'font-family', correct: true },
            { text: 'font-type', correct: false },
            { text: 'font-style', correct: false },
            { text: 'text-font', correct: false }
        ],
        explanation: 'font-family specifies the font for an element.'
    },
    {
        category: 'css',
        difficulty: 'beginner',
        question: 'What does CSS stand for?',
        answers: [
            { text: 'Cascading Style Sheets', correct: true },
            { text: 'Computer Style Sheets', correct: false },
            { text: 'Creative Style Sheets', correct: false },
            { text: 'Colorful Style Sheets', correct: false }
        ],
        explanation: 'CSS stands for Cascading Style Sheets.'
    },
    // CSS Intermediate Questions (7 questions)
    {
        category: 'css',
        difficulty: 'intermediate',
        question: 'What does "display: flex" do?',
        answers: [
            { text: 'Makes text flexible', correct: false },
            { text: 'Creates a flexible layout container', correct: true },
            { text: 'Flexes the browser window', correct: false },
            { text: 'Makes images flexible', correct: false }
        ],
        explanation: 'display: flex creates a flex container, enabling flexible layouts for child elements.'
    },
    {
        category: 'css',
        difficulty: 'intermediate',
        question: 'What is the CSS Box Model?',
        answers: [
            { text: 'Content, padding, border, margin', correct: true },
            { text: 'Width, height, color, font', correct: false },
            { text: 'Top, right, bottom, left', correct: false },
            { text: 'Block, inline, flex, grid', correct: false }
        ],
        explanation: 'The CSS Box Model consists of content, padding, border, and margin.'
    },
    {
        category: 'css',
        difficulty: 'intermediate',
        question: 'What does "position: absolute" do?',
        answers: [
            { text: 'Positions element relative to nearest positioned ancestor', correct: true },
            { text: 'Positions element relative to viewport', correct: false },
            { text: 'Positions element in normal flow', correct: false },
            { text: 'Makes element absolutely centered', correct: false }
        ],
        explanation: 'position: absolute positions an element relative to its nearest positioned ancestor.'
    },
    {
        category: 'css',
        difficulty: 'intermediate',
        question: 'What is the difference between padding and margin?',
        answers: [
            { text: 'Padding is inside border, margin is outside', correct: true },
            { text: 'Margin is inside border, padding is outside', correct: false },
            { text: 'No difference', correct: false },
            { text: 'Padding is for text, margin is for images', correct: false }
        ],
        explanation: 'Padding is the space inside the border, margin is the space outside the border.'
    },
    {
        category: 'css',
        difficulty: 'intermediate',
        question: 'What does "z-index" control?',
        answers: [
            { text: 'Stacking order of elements', correct: true },
            { text: 'Zoom level', correct: false },
            { text: 'Z-axis rotation', correct: false },
            { text: 'Element size', correct: false }
        ],
        explanation: 'z-index controls the stacking order of positioned elements.'
    },
    {
        category: 'css',
        difficulty: 'intermediate',
        question: 'What is a CSS pseudo-class?',
        answers: [
            { text: 'A class that defines special states of elements', correct: true },
            { text: 'A fake CSS class', correct: false },
            { text: 'A class that doesn\'t exist', correct: false },
            { text: 'A temporary class', correct: false }
        ],
        explanation: 'Pseudo-classes define special states of elements (like :hover, :focus).'
    },
    {
        category: 'css',
        difficulty: 'intermediate',
        question: 'What does "overflow: hidden" do?',
        answers: [
            { text: 'Hides content that overflows the element', correct: true },
            { text: 'Hides the entire element', correct: false },
            { text: 'Makes element transparent', correct: false },
            { text: 'Reduces element size', correct: false }
        ],
        explanation: 'overflow: hidden clips content that overflows the element\'s box.'
    },
    // CSS Advanced Questions (5 questions)
    {
        category: 'css',
        difficulty: 'advanced',
        question: 'What is CSS Grid?',
        answers: [
            { text: 'A 2D layout system for CSS', correct: true },
            { text: 'A CSS framework', correct: false },
            { text: 'A grid of CSS rules', correct: false },
            { text: 'A layout grid tool', correct: false }
        ],
        explanation: 'CSS Grid is a powerful 2D layout system that allows you to create complex layouts.'
    },
    {
        category: 'css',
        difficulty: 'advanced',
        question: 'What are CSS Custom Properties (CSS Variables)?',
        answers: [
            { text: 'Reusable values defined with --', correct: true },
            { text: 'Custom CSS functions', correct: false },
            { text: 'User-defined CSS rules', correct: false },
            { text: 'Custom CSS selectors', correct: false }
        ],
        explanation: 'CSS Custom Properties are reusable values defined with -- prefix.'
    },
    {
        category: 'css',
        difficulty: 'advanced',
        question: 'What is the CSS "contain" property used for?',
        answers: [
            { text: 'Optimizes rendering by isolating subtrees', correct: true },
            { text: 'Contains element overflow', correct: false },
            { text: 'Contains CSS rules', correct: false },
            { text: 'Contains element content', correct: false }
        ],
        explanation: 'The contain property optimizes rendering by isolating subtrees from the rest of the page.'
    },
    {
        category: 'css',
        difficulty: 'advanced',
        question: 'What is the difference between "rem" and "em" units?',
        answers: [
            { text: 'rem is relative to root, em is relative to parent', correct: true },
            { text: 'em is relative to root, rem is relative to parent', correct: false },
            { text: 'No difference', correct: false },
            { text: 'rem is pixels, em is percentage', correct: false }
        ],
        explanation: 'rem units are relative to the root element, em units are relative to the parent element.'
    },
    {
        category: 'css',
        difficulty: 'advanced',
        question: 'What is CSS Houdini?',
        answers: [
            { text: 'APIs that expose CSS engine functionality', correct: true },
            { text: 'A CSS magic trick library', correct: false },
            { text: 'A CSS escape technique', correct: false },
            { text: 'A CSS animation library', correct: false }
        ],
        explanation: 'CSS Houdini is a set of APIs that expose parts of the CSS engine to developers.'
    }
];

// React Questions
const reactQuestions = [
    // React Beginner Questions (10 questions)
    {
        category: 'react',
        difficulty: 'beginner',
        question: 'What is JSX in React?',
        answers: [
            { text: 'A database query language', correct: false },
            { text: 'JavaScript XML syntax extension', correct: true },
            { text: 'A CSS framework', correct: false },
            { text: 'A testing library', correct: false }
        ],
        explanation: 'JSX is a syntax extension for JavaScript that looks similar to XML/HTML.'
    },
    {
        category: 'react',
        difficulty: 'beginner',
        question: 'What is the purpose of useState hook?',
        answers: [
            { text: 'To manage component state', correct: true },
            { text: 'To handle user events', correct: false },
            { text: 'To fetch data from APIs', correct: false },
            { text: 'To style components', correct: false }
        ],
        explanation: 'useState is a Hook that lets you add React state to function components.'
    },
    {
        category: 'react',
        difficulty: 'beginner',
        question: 'How do you create a React component?',
        answers: [
            { text: 'function MyComponent() { return <div>Hello</div>; }', correct: true },
            { text: 'create MyComponent() { return <div>Hello</div>; }', correct: false },
            { text: 'component MyComponent() { return <div>Hello</div>; }', correct: false },
            { text: 'react MyComponent() { return <div>Hello</div>; }', correct: false }
        ],
        explanation: 'React components are JavaScript functions that return JSX.'
    },
    {
        category: 'react',
        difficulty: 'beginner',
        question: 'What is props in React?',
        answers: [
            { text: 'Data passed from parent to child components', correct: true },
            { text: 'Component properties', correct: false },
            { text: 'React properties', correct: false },
            { text: 'Component methods', correct: false }
        ],
        explanation: 'Props are arguments passed into React components, like function parameters.'
    },
    {
        category: 'react',
        difficulty: 'beginner',
        question: 'How do you handle events in React?',
        answers: [
            { text: 'onClick={handleClick}', correct: true },
            { text: 'onclick="handleClick()"', correct: false },
            { text: 'onEvent={handleClick}', correct: false },
            { text: 'event={handleClick}', correct: false }
        ],
        explanation: 'React uses camelCase event handlers like onClick, onChange, etc.'
    },
    {
        category: 'react',
        difficulty: 'beginner',
        question: 'What is the Virtual DOM?',
        answers: [
            { text: 'A JavaScript representation of the real DOM', correct: true },
            { text: 'A virtual reality DOM', correct: false },
            { text: 'A fake DOM', correct: false },
            { text: 'A DOM simulator', correct: false }
        ],
        explanation: 'Virtual DOM is a JavaScript representation of the real DOM kept in memory.'
    },
    {
        category: 'react',
        difficulty: 'beginner',
        question: 'How do you render a list in React?',
        answers: [
            { text: 'items.map(item => <li key={item.id}>{item.name}</li>)', correct: true },
            { text: 'items.forEach(item => <li>{item.name}</li>)', correct: false },
            { text: 'for(item in items) <li>{item.name}</li>', correct: false },
            { text: 'items.render(item => <li>{item.name}</li>)', correct: false }
        ],
        explanation: 'Use the map() method to render lists, and don\'t forget the key prop.'
    },
    {
        category: 'react',
        difficulty: 'beginner',
        question: 'What is the key prop used for?',
        answers: [
            { text: 'To help React identify which items have changed', correct: true },
            { text: 'To unlock components', correct: false },
            { text: 'To create unique components', correct: false },
            { text: 'To set component passwords', correct: false }
        ],
        explanation: 'Keys help React identify which items have changed, are added, or are removed.'
    },
    {
        category: 'react',
        difficulty: 'beginner',
        question: 'How do you conditionally render in React?',
        answers: [
            { text: '{condition && <Component />}', correct: true },
            { text: 'if(condition) <Component />', correct: false },
            { text: '<Component if={condition} />', correct: false },
            { text: 'condition ? <Component /> : null', correct: false }
        ],
        explanation: 'Use logical && operator or ternary operator for conditional rendering.'
    },
    {
        category: 'react',
        difficulty: 'beginner',
        question: 'What is the default export in React?',
        answers: [
            { text: 'export default ComponentName', correct: true },
            { text: 'export ComponentName', correct: false },
            { text: 'default export ComponentName', correct: false },
            { text: 'module.exports = ComponentName', correct: false }
        ],
        explanation: 'Use export default to export a single component as the default export.'
    },
    // React Intermediate Questions (7 questions)
    {
        category: 'react',
        difficulty: 'intermediate',
        question: 'What is useEffect hook used for?',
        answers: [
            { text: 'Side effects and lifecycle methods', correct: true },
            { text: 'Creating visual effects', correct: false },
            { text: 'Handling user effects', correct: false },
            { text: 'Effect animations', correct: false }
        ],
        explanation: 'useEffect lets you perform side effects in function components.'
    },
    {
        category: 'react',
        difficulty: 'intermediate',
        question: 'What is React Context?',
        answers: [
            { text: 'A way to pass data through component tree without props', correct: true },
            { text: 'The context of React application', correct: false },
            { text: 'React environment context', correct: false },
            { text: 'Component context menu', correct: false }
        ],
        explanation: 'Context provides a way to pass data through the component tree without passing props manually.'
    },
    {
        category: 'react',
        difficulty: 'intermediate',
        question: 'What is the difference between controlled and uncontrolled components?',
        answers: [
            { text: 'Controlled components have React-managed state, uncontrolled use DOM', correct: true },
            { text: 'Controlled components are faster', correct: false },
            { text: 'Uncontrolled components are more secure', correct: false },
            { text: 'No difference', correct: false }
        ],
        explanation: 'Controlled components have their state managed by React, uncontrolled components store state in the DOM.'
    },
    {
        category: 'react',
        difficulty: 'intermediate',
        question: 'What is useCallback hook used for?',
        answers: [
            { text: 'Memoizing callback functions', correct: true },
            { text: 'Calling back functions', correct: false },
            { text: 'Creating callback functions', correct: false },
            { text: 'Handling callbacks', correct: false }
        ],
        explanation: 'useCallback returns a memoized callback function to optimize performance.'
    },
    {
        category: 'react',
        difficulty: 'intermediate',
        question: 'What is React.memo()?',
        answers: [
            { text: 'Higher-order component for memoization', correct: true },
            { text: 'A memory management tool', correct: false },
            { text: 'A memo-taking component', correct: false },
            { text: 'A memory storage hook', correct: false }
        ],
        explanation: 'React.memo is a higher-order component that memoizes the result if props haven\'t changed.'
    },
    {
        category: 'react',
        difficulty: 'intermediate',
        question: 'What is the purpose of useReducer?',
        answers: [
            { text: 'Managing complex state logic', correct: true },
            { text: 'Reducing component size', correct: false },
            { text: 'Reducing render time', correct: false },
            { text: 'Reducing memory usage', correct: false }
        ],
        explanation: 'useReducer is used for managing complex state logic with actions and reducers.'
    },
    {
        category: 'react',
        difficulty: 'intermediate',
        question: 'What are React Fragments?',
        answers: [
            { text: 'A way to group elements without extra DOM nodes', correct: true },
            { text: 'Broken React components', correct: false },
            { text: 'Partial React components', correct: false },
            { text: 'React code snippets', correct: false }
        ],
        explanation: 'Fragments let you group a list of children without adding extra nodes to the DOM.'
    },
    // React Advanced Questions (5 questions)
    {
        category: 'react',
        difficulty: 'advanced',
        question: 'What is React Fiber?',
        answers: [
            { text: 'React\'s reconciliation algorithm', correct: true },
            { text: 'A React networking library', correct: false },
            { text: 'A React fiber optic connection', correct: false },
            { text: 'A React threading system', correct: false }
        ],
        explanation: 'React Fiber is the new reconciliation algorithm that enables incremental rendering.'
    },
    {
        category: 'react',
        difficulty: 'advanced',
        question: 'What is Server-Side Rendering (SSR) in React?',
        answers: [
            { text: 'Rendering React components on the server', correct: true },
            { text: 'Rendering on the server side of screen', correct: false },
            { text: 'Server-side React installation', correct: false },
            { text: 'Rendering servers with React', correct: false }
        ],
        explanation: 'SSR renders React components on the server and sends HTML to the client.'
    },
    {
        category: 'react',
        difficulty: 'advanced',
        question: 'What is React Suspense?',
        answers: [
            { text: 'A component for handling loading states', correct: true },
            { text: 'A way to suspend React execution', correct: false },
            { text: 'A suspenseful React feature', correct: false },
            { text: 'A React debugging tool', correct: false }
        ],
        explanation: 'Suspense lets components "wait" for something before rendering, showing fallback content.'
    },
    {
        category: 'react',
        difficulty: 'advanced',
        question: 'What is the Concurrent Mode in React?',
        answers: [
            { text: 'A set of features for better user experience', correct: true },
            { text: 'Running multiple React apps concurrently', correct: false },
            { text: 'Concurrent programming in React', correct: false },
            { text: 'Multi-threaded React rendering', correct: false }
        ],
        explanation: 'Concurrent Mode is a set of features that help React apps stay responsive.'
    },
    {
        category: 'react',
        difficulty: 'advanced',
        question: 'What are React Portals?',
        answers: [
            { text: 'A way to render children into different DOM subtree', correct: true },
            { text: 'Gateways between React components', correct: false },
            { text: 'React transportation system', correct: false },
            { text: 'React entry points', correct: false }
        ],
        explanation: 'Portals provide a way to render children into a DOM node outside the parent component.'
    }
];

// Merge all questions into the main questionBank
questionBank.push(...cssQuestions, ...reactQuestions);