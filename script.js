document.getElementById('start-btn').addEventListener('click', startQuiz);
document.getElementById('next-btn').addEventListener('click', nextQuestion);
// document.getElementById('prev-btn').addEventListener('click', prevQuestion);

let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let answered = false;

async function fetchQuestions() {
    const proxyUrl = 'https://api.allorigins.win/get?url=';
    const targetUrl = 'https://api.jsonserve.com/Uw5CrX';

    try {
        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
        const data = await response.json();
        const quizData = JSON.parse(data.contents);

        const rawQuestions = quizData.questions;
        questions = rawQuestions.map(q => ({
            question: q.description,
            options: q.options.map(option => option.description),
            answer: q.options.find(option => option.is_correct).description,
        }));

    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load quiz data.');
    }
}

async function startQuiz() {
    await fetchQuestions();
    if (questions.length === 0) return;
    document.getElementById('start-btn').style.display = 'none';
    document.querySelector('.button-container').style.display = 'block'; // Show Previous and Next buttons
    showQuestion();
}

function showQuestion() {
    let quizDiv = document.getElementById('quiz');
    quizDiv.innerHTML = ''; // Clear previous question
    answered = false;

    // Display the question text
    let question = document.createElement('h2');
    question.textContent = questions[currentQuestionIndex].question;
    quizDiv.appendChild(question);

    // Create an ordered list for options
    let ol = document.createElement('ol');
    questions[currentQuestionIndex].options.forEach(option => {
        let li = document.createElement('li');

        let label = document.createElement('label');
        label.setAttribute('for', option);
        label.textContent = option;

        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = option;
        checkbox.id = option;

        li.appendChild(label);
        li.appendChild(checkbox);

        li.onclick = () => handleAnswer(option);

        ol.appendChild(li);
    });

    quizDiv.appendChild(ol);
}

function handleAnswer(option) {
    if (!answered) {
        if (option === questions[currentQuestionIndex].answer) {
            score++;
        }
        answered = true;
        document.getElementById('next-btn').disabled = false; // Enable next button after answering
    }
}

function nextQuestion() {
    if (answered) {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
            document.getElementById('prev-btn').style.display = 'block'; // Show previous button when navigating
        } else {
            showResult();
        }
        document.getElementById('next-btn').disabled = true; // Disable next button until the answer is selected again
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        showQuestion();
        document.getElementById('next-btn').disabled = true; // Disable next button until answered
    }
    if (currentQuestionIndex === 0) {
        document.getElementById('prev-btn').style.display = 'none'; // Hide previous button at the first question
    }
}

function showResult() {
    document.getElementById('quiz').style.display = 'none';
    document.querySelector('.button-container').style.display = 'none'; // Hide both buttons when showing result
    let resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.textContent = `Quiz Completed! Your score: ${score}/${questions.length}`;
}
