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

let shuffledQuestions, currentQuestionIndex, score, timer, timeLeft

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    setNextQuestion()
})

themeToggle.addEventListener('click', toggleTheme)

function toggleTheme() {
    document.body.classList.toggle('dark-mode')
    const isDark = document.body.classList.contains('dark-mode')
    themeToggle.textContent = isDark ? '☀️' : '🌙'
    localStorage.setItem('darkMode', isDark)
}

function loadTheme() {
    const isDark = localStorage.getItem('darkMode') === 'true'
    if (isDark) {
        document.body.classList.add('dark-mode')
        themeToggle.textContent = '☀️'
    }
}

loadTheme()

function startGame() {
    const category = categorySelect.value
    const difficulty = difficultySelect.value
    
    startButton.classList.add('hide')
    setupContainer.classList.add('hide')
    shuffledQuestions = getQuestionsByCategory(category, difficulty).sort(() => Math.random() - .5)
    currentQuestionIndex = 0
    score = 0
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
    question.answers.forEach(answer => {
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
}

function startTimer() {
    timeLeft = 15
    timerElement.textContent = timeLeft
    timer = setInterval(() => {
        timeLeft--
        timerElement.textContent = timeLeft
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
    return questionBank.filter(q => q.category === category && q.difficulty === difficulty)
}

function showFinalScore() {
    const percentage = Math.round(score/shuffledQuestions.length*100)
    const isNewRecord = saveHighScore(percentage)
    
    questionElement.innerText = `Quiz Complete! Your score: ${score}/${shuffledQuestions.length} (${percentage}%)${isNewRecord ? ' 🎉 New High Score!' : ''}`
    answerButtonsElement.innerHTML = ''
    explanationElement.classList.add('hide')
    progressElement.classList.add('hide')
    setupContainer.classList.remove('hide')
    startButton.innerText = 'Start New Quiz'
    startButton.classList.remove('hide')
}

const questionBank = [
    // JavaScript Questions
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
    // HTML Questions
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
        difficulty: 'intermediate',
        question: 'Which HTML element is used for the largest heading?',
        answers: [
            { text: '<h6>', correct: false },
            { text: '<h1>', correct: true },
            { text: '<header>', correct: false },
            { text: '<heading>', correct: false }
        ],
        explanation: '<h1> represents the most important heading, typically the largest by default.'
    },
    // CSS Questions
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
    // React Questions
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
        difficulty: 'intermediate',
        question: 'What is the purpose of useState hook?',
        answers: [
            { text: 'To manage component state', correct: true },
            { text: 'To handle user events', correct: false },
            { text: 'To fetch data from APIs', correct: false },
            { text: 'To style components', correct: false }
        ],
        explanation: 'useState is a Hook that lets you add React state to function components.'
    }
]
