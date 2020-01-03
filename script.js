// DOM elements
const timerElement = document.getElementById('time');
const questionElement = document.getElementById('question');
const choiceA = document.getElementById('choiceA');
const choiceB = document.getElementById('choiceB');
const choiceC = document.getElementById('choiceC');
const choiceD = document.getElementById('choiceD');
const choiceElements = document.getElementsByClassName('choice');
const resultMsgElements = document.getElementsByClassName('result-msg');
const selectAnswerMsg = document.getElementById('select-answer-msg');
const submitChoiceBtn = document.getElementById('submit-btn');

const quizListElement = document.getElementById('quiz-list');
const userListElement = document.getElementById('user-list');
const removeScoresBtn = document.getElementById('clear-scores-btn');

let userInitialsElement = document.getElementsByClassName('user-initials');
let userScoreElement = document.getElementsByClassName('user-score');

// Elements added to DOM
let finalScoreMsg = document.createElement('p');
let initialsLabel = document.createElement('label');
let initialsInput = document.createElement('input');
let saveInitialsBtn = document.createElement('button');
let enterInitialsMsg = document.createElement('p');

// Quiz variables
const radioBtns = [choiceA, choiceB, choiceC, choiceD];

const quizItems = [
    { 
        question: 'this is a question',
        choices: ['choice1', 'choice2', 'choice3', 'choice4'],
        answer: 'choice1'
    },
    { 
        question: 'this is another question',
        choices: ['choice5', 'choice6', 'choice7', 'choice8'],
        answer: 'choice8'
    },
    { 
        question: 'this is a different question',
        choices: ['choice9', 'choice10', 'choice11', 'choice12'],
        answer: 'choice10'
    }
];

let time = (quizItems.length * 15);
let timer;
let currentAnswer;
let usedQuizItemIndex = [];
let userSelectedChoice;
let currentChoice;
let currentResultMsgElement;
let userScore;
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
    if (document.querySelector('main').getAttribute('id') === 'home') {
        timerElement.textContent = 'Time: ' + time;
    }
    if (document.querySelector('main').getAttribute('id') === 'quiz') {
        startQuizTimer();
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
                        clearInterval(timer);
                        quizOver();
                    } else {
                        // otherwise, get another quiz item and enable the submit button
                        renderQuizItem();
                        submitChoiceBtn.removeAttribute('disabled');
                    }
                }, 1500);
            }
        });
        saveInitialsBtn.addEventListener('click', function() {
            // if the user did not enter their initials ask them to do so
            if (!initialsInput.value) {
                enterInitialsMsg.textContent = 'Please enter your initials';
                quizListElement.appendChild(enterInitialsMsg);
            // if they did enter their initials then save their data and display saved message
            } else {
                saveUserData();
                displaySavedMsg();
            }
        })
    } 
    if (document.querySelector('main').getAttribute('id') === 'highscores') {
        // display user initials and scores from local storage
        displaySavedData();
        // delete local storage data and clear page if user clicks remove scores button
        removeScoresBtn.addEventListener('click', function() {
            clearUserData();
        })
    }
};

// Function to get and display a random quiz item
function renderQuizItem() {
    let itemIndex = Math.floor(Math.random() * quizItems.length);
    // if a quiz item has already been used, pick another one
    while (usedQuizItemIndex.indexOf(itemIndex) > -1) {
        itemIndex = Math.floor(Math.random() * quizItems.length);
    }
    // once quiz item has been used add to usedQuizItem array
    usedQuizItemIndex.push(itemIndex);
    let currentItem = quizItems[itemIndex];
    let questionKey = Object.keys(currentItem)[0];
    let questionValue = currentItem[questionKey];
    // assign question value from current item to questionElement text content 
    questionElement.textContent = questionValue;
    let choicesKey = Object.keys(currentItem)[1];
    let choiceValues = currentItem[choicesKey];
    // loop through item choice values and assign them to choiceElements randomly
    for (var i = 0; i < choiceElements.length; i++) {
        let choiceIndex = Math.floor(Math.random() * choiceValues.length);
        let currentChoice = choiceValues[choiceIndex];
        choiceElements[i].textContent = currentChoice;
        choiceValues.splice(choiceIndex, 1);
    }
    // get the item answer value and assign it to currentAnswer value
    let answerKey = Object.keys(currentItem)[2];
    let answerValue = currentItem[answerKey];
    currentAnswer = answerValue;
}

// Function to display time and start quiz timer
function startQuizTimer() {
    timerElement.textContent = 'Time: ' + time;
    timer = setInterval( function() {
        time--;
        timerElement.textContent = 'Time: ' + time;
        // if the timer reaches 0 then stop the timer and end the quiz
        if (time === 0) {
            clearInterval(timer);
            clearQuiz();
            quizOver();
        }
    }, 1000)
}

// Function to get values of user choice
function getUserChoice() {
    // loop through buttons
    for (let i = 0; i < radioBtns.length; i++) {
        // if a button is checked assign values to choice variables
        if (radioBtns[i].checked) {
            userSelectedChoice = true;
            selectAnswerMsg.textContent = '';
            currentChoice = choiceElements[i].textContent;
            currentResultMsgElement = resultMsgElements[i];
            return;
        }
    }
    // if a button is not checked tell user to pick a choice
    userSelectedChoice = false;
    selectAnswerMsg.textContent = 'Please select an answer';
}

// Function to determine if choice user selected is the same as the answer and update quiz variables
function evaluateUserChoice() {
    if (currentChoice === currentAnswer) {
        currentResultMsgElement.textContent = 'correct!';
        if (usedQuizItemIndex.length === quizItems.length) {
            clearInterval(timer);
        }
    } else {
        currentResultMsgElement.textContent = 'wrong';
        time -= 10;
        // if time is now 0 or less quiz is over
        if (time <= 0) {
            clearInterval(timer);
            clearQuiz();
            quizOver();
        }
    }
}

// Function to clear current quiz question, choices, user choice, and result message
function clearQuiz() {
    questionElement.textContent = '';
    for (let i = 0; i < choiceElements.length; i++) {
        choiceElements[i].textContent = '';
    }
    for (let i = 0; i < radioBtns.length; i++) {
        radioBtns[i].checked = false;
    }
    for (let i = 0; i < resultMsgElements.length; i++) {
        resultMsgElements[i].textContent = '';
    }
}

// Function to hide quiz elements and display end-of-quiz elements when quiz is over
function quizOver() {
    userScore = time;
    // hide radio buttons, submit button and next button
    for (let i = 0; i < radioBtns.length; i++) {
        radioBtns[i].style.display = 'none';
    }
    submitChoiceBtn.style.display = 'none';
    
    // display end-of-quiz message
    questionElement.textContent = 'The quiz is over';
    // display user score
    finalScoreMsg.textContent = 'Your final score: ' + userScore;
    quizListElement.appendChild(finalScoreMsg);
    // display user initials input label
    initialsLabel.setAttribute('for', 'initials-input');
    initialsLabel.textContent = 'Enter initials:';
    quizListElement.appendChild(initialsLabel);
    // display user initials input
    initialsInput.setAttribute('id', 'initials-input');
    quizListElement.appendChild(initialsInput);
    // display submit button
    saveInitialsBtn.textContent = 'Save score';
    quizListElement.appendChild(saveInitialsBtn);
}

// Function to save user initials and score to local storage
function saveUserData() {
    userInitials = initialsInput.value;
    // create user object
    let user = {
        initials: userInitials,
        score: userScore
    };
    // add user object to users array
    users.push(user);
    localStorage.setItem('Users', JSON.stringify(users));
}

// Function to change page display after user saves their score
function displaySavedMsg() {
    enterInitialsMsg.textContent = '';
    initialsLabel.style.display = 'none';
    initialsInput.style.display = 'none'; 
    saveInitialsBtn.style.display = 'none';
    finalScoreMsg.textContent = 'Your score has been saved';
    let homePageLink = document.createElement('a');
    homePageLink.setAttribute('href', 'index.html');
    finalScoreMsg.appendChild(homePageLink);
    let homeButton = document.createElement('button');
    homeButton.textContent = 'Take quiz again';
    homePageLink.appendChild(homeButton);
}

// Function to display user data on highscores page
function displaySavedData() {
    // loop through users array
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        let initials = user['initials'];
        let score = user['score'];
        // create new list item and add it to the user list
        let userListItem = document.createElement('li');
        userListElement.appendChild(userListItem);
        // create new span element, give it a class, set it's content to user initials, append to list item
        let userInitialsSpan = document.createElement('span');
        userInitialsSpan.setAttribute('class', 'user-initials');
        userInitialsSpan.textContent = initials;
        userListItem.appendChild(userInitialsSpan);
        // create new span element, give it a class, set it's content to user score, append to list item
        let userScoreSpan = document.createElement('span');
        userScoreSpan.setAttribute('class', 'user-score');
        userScoreSpan.textContent = score;
        userListItem.appendChild(userScoreSpan);
    }
}

// Function to remove user data
function clearUserData() {
    // clear user data displayed in browser
    for (let i = 0; i < userInitialsElement.length; i++) {
        userInitialsElement[i].textContent = ''
    }
    for (let i = 0; i < userScoreElement.length; i++) {
        userScoreElement[i].textContent = ''
    }
    // remove user data from local storage
    localStorage.removeItem('Users');
}










