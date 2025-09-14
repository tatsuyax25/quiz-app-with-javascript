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
    startButton.classList.add('hide')
    shuffledQuestions = questions.sort(() => Math.random() - .5)
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
    clearInterval(timer)
}

function selectAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    
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

function showFinalScore() {
    const percentage = Math.round(score/shuffledQuestions.length*100)
    const isNewRecord = saveHighScore(percentage)
    
    questionElement.innerText = `Quiz Complete! Your score: ${score}/${shuffledQuestions.length} (${percentage}%)${isNewRecord ? ' 🎉 New High Score!' : ''}`
    answerButtonsElement.innerHTML = ''
    progressElement.classList.add('hide')
    startButton.innerText = 'Restart Quiz'
    startButton.classList.remove('hide')
}

const questions = [
    {
        question: 'What does "let" do in JavaScript?',
        answers: [
            { text: 'Declares a block-scoped variable', correct: true },
            { text: 'Creates a global variable', correct: false },
            { text: 'Defines a constant', correct: false },
            { text: 'Creates a function', correct: false }
        ]
    },
    {
        question: 'Which method adds an element to the end of an array?',
        answers: [
            { text: 'unshift()', correct: false },
            { text: 'push()', correct: true },
            { text: 'pop()', correct: false },
            { text: 'shift()', correct: false }
        ]
    },
    {
        question: 'What is the result of "3" + 2 in JavaScript?',
        answers: [
            { text: '5', correct: false },
            { text: '"32"', correct: true },
            { text: 'Error', correct: false },
            { text: 'undefined', correct: false }
        ]
    },
    {
        question: 'Which operator checks for strict equality?',
        answers: [
            { text: '==', correct: false },
            { text: '===', correct: true },
            { text: '=', correct: false },
            { text: '!=', correct: false }
        ]
    },
    {
        question: 'What does DOM stand for?',
        answers: [
            { text: 'Document Object Model', correct: true },
            { text: 'Data Object Management', correct: false },
            { text: 'Dynamic Object Method', correct: false },
            { text: 'Document Oriented Model', correct: false }
        ]
    },
    {
        question: 'Which method removes the last element from an array?',
        answers: [
            { text: 'pop()', correct: true },
            { text: 'push()', correct: false },
            { text: 'shift()', correct: false },
            { text: 'splice()', correct: false }
        ]
    }
]
