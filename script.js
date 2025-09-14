const startButton = document.getElementById('start-btn')
const nextButton = document.getElementById('next-btn')
const questionContainerElement = document.getElementById('question-container')
const questionElement = document.getElementById('question')
const answerButtonsElement = document.getElementById('answer-buttons')
const progressElement = document.getElementById('progress')
const currentQuestionElement = document.getElementById('current-question')
const totalQuestionsElement = document.getElementById('total-questions')

let shuffledQuestions, currentQuestionIndex, score

startButton.addEventListener('click', startGame)
nextButton.addEventListener('click', () => {
    currentQuestionIndex++
    setNextQuestion()
})

function startGame() {
    startButton.classList.add('hide')
    shuffledQuestions = questions.sort(() => Math.random() - .5)
    currentQuestionIndex = 0
    score = 0
    questionContainerElement.classList.remove('hide')
    progressElement.classList.remove('hide')
    totalQuestionsElement.textContent = shuffledQuestions.length
    setNextQuestion()
}

function setNextQuestion() {
    resetState()
    showQuestion(shuffledQuestions[currentQuestionIndex])
    updateProgress()
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
}

function selectAnswer(e) {
    const selectedButton = e.target
    const correct = selectedButton.dataset.correct
    
    if (correct) score++
    
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

function showFinalScore() {
    questionElement.innerText = `Quiz Complete! Your score: ${score}/${shuffledQuestions.length} (${Math.round(score/shuffledQuestions.length*100)}%)`
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
