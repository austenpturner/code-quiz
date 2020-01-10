// DOM elements
const timerElement = document.getElementById('time');
const questionElement = document.getElementById('question');
const quizListElement = document.getElementById('quiz-list');
const radioBtns = document.getElementsByClassName('radio-btn');
const choiceLabels = document.getElementsByClassName('choice');
const resultMsgElements = document.getElementsByClassName('result-msg');
const submitChoiceBtn = document.getElementById('submit-btn');
const selectAnswerMsg = document.getElementById('select-answer-msg');

const userListElement = document.getElementById('user-list');
const removeScoresBtn = document.getElementById('remove-scores-btn');

let userInitialsElement = document.getElementsByClassName('user-initials');
let userScoreElement = document.getElementsByClassName('user-score');

// Elements added to DOM
let finalScoreMsg = document.createElement('p');
let initialsLabel = document.createElement('label');
let initialsInput = document.createElement('input');
let saveInitialsBtn = document.createElement('button');
let enterInitialsMsg = document.createElement('p');

// Quiz variables
let timerValue = quizItems.length * 15;
let seconds = timerValue % 60;
let minutes = (timerValue - seconds) / 60;
let userScore;
let timer;
let currentAnswer;
let usedQuizItemIndex = [];
let userSelectedChoice;
let currentChoice;
let currentResultMsgElement;
let userInitials;
let users;

// Condition to set users array to user data saved in local storage
if (JSON.parse(localStorage.getItem('Users')) != null) {
    users = JSON.parse(localStorage.getItem('Users'))
} else {
    users = [];
}

// Function to add button click events and call quiz functions when page is loaded
window.onload = function() {
    let currentPage = document.querySelector('main').getAttribute('id');
    switch (currentPage) {
        case 'home' :
            printTime();
            break;
        case 'quiz' :
            initiateQuizTimer();
            renderQuizItem();
            submitChoiceBtn.addEventListener('click', function() {
                getUserChoice();
                if (userSelectedChoice) {
                    // disable submit button while user choice is evaluated
                    submitChoiceBtn.setAttribute('disabled', true);
                    evaluateUserChoice();
                    // pause user interaction and show resultMsg for 1.5 seconds
                    setTimeout(function() {
                        clearQuiz();
                        // if there are not more questions, the quiz is over
                        if (usedQuizItemIndex.length === quizItems.length) {
                            if (seconds < 0 && minutes === 0) {
                                userScore = 0;
                            } else {
                                userScore = minutes * 60 + seconds;
                            }
                            clearInterval(timer);
                            quizOver();
                        } else {
                            // otherwise, get another quiz item and enable the submit button
                            renderQuizItem();
                            submitChoiceBtn.removeAttribute('disabled');
                        }
                    }, 1000);
                }
            });
            saveInitialsBtn.addEventListener('click', function() {
                if (!initialsInput.value) {
                    displayEnterInitialsMsg();
                } else {
                    saveUserData();
                    displaySavedMsg();
                }
            })
            break;
        case 'highscores' : 
            displaySavedData();
            removeScoresBtn.addEventListener('click', function() {
                clearUserData();
            });
    }
};


