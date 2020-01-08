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
                            userScore = minutes * 60 + seconds;
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

// Function to get and display a random quiz item
function renderQuizItem() {
    let itemIndex;
    // if a quiz item has already been used, pick another one
    do {
        itemIndex = Math.floor(Math.random() * quizItems.length);
    } while (usedQuizItemIndex.indexOf(itemIndex) > -1) 
    // once quiz item has been used add to usedQuizItem array
    usedQuizItemIndex.push(itemIndex);
    let currentItem = quizItems[itemIndex];
    let questionKey = Object.keys(currentItem)[0];
    let questionValue = currentItem[questionKey];
    // assign question value from current item to questionElement text content 
    questionElement.textContent = questionValue;
    let choicesKey = Object.keys(currentItem)[1];
    let choiceValues = currentItem[choicesKey];
    // loop through item choice values and assign them to choiceLabels randomly
    for (var i = 0; i < choiceLabels.length; i++) {
        let choiceIndex = Math.floor(Math.random() * choiceValues.length);
        let currentChoice = choiceValues[choiceIndex];
        choiceLabels[i].textContent = currentChoice;
        choiceValues.splice(choiceIndex, 1);
    }
    // get the item answer value and assign it to currentAnswer value
    let answerKey = Object.keys(currentItem)[2];
    let answerValue = currentItem[answerKey];
    currentAnswer = answerValue;
}

function startQuizTimer() {
    printTime();
    timer = setInterval( function() {
        if (seconds === 0) {
            seconds = 59;
            minutes--;
        } else {
            seconds--;
        }
        printTime();
        if (seconds === 0 && minutes === 0) {
            clearInterval(timer);
            userScore = minutes * 60 + seconds;
            clearQuiz();
            quizOver();
        } else if (seconds === 0) {
            minutes --;
            seconds += 60;
        }
    }, 1000);
}

function printTime() {
    if (seconds < 10) {
        timerElement.textContent = minutes + ':0' + seconds
    } else {
        timerElement.textContent = minutes + ':' + seconds;
    } 
}

// Function to get values of user choice
function getUserChoice() {
    // loop through buttons
    for (let i = 0; i < radioBtns.length; i++) {
        // if a button is checked assign values to choice variables
        if (radioBtns[i].checked) {
            userSelectedChoice = true;
            selectAnswerMsg.textContent = '';
            currentChoice = choiceLabels[i].textContent;
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
    currentResultMsgElement.removeAttribute('id');
    if (currentChoice === currentAnswer) {
        currentResultMsgElement.setAttribute('id', 'green');
        currentResultMsgElement.textContent = 'correct!';
        if (usedQuizItemIndex.length === quizItems.length) {
            clearInterval(timer);
        }
    } else {
        currentResultMsgElement.setAttribute('id', 'red');
        currentResultMsgElement.textContent = 'wrong';
        if (seconds <= 10) {
            let timeRoll = 10 - seconds;
            seconds = 60 - timeRoll;
            minutes--;
        } else {
            seconds -= 10;
            if (seconds <= 0 && minutes <= 0) {
                userScore = minutes * 60 + seconds;
                clearInterval(timer);
                clearQuiz();
                quizOver();
            }
        }
    }
}

// Function to clear current quiz question, choices, user choice, and result message
function clearQuiz() {
    questionElement.textContent = '';
    for (let i = 0; i < choiceLabels.length; i++) {
        choiceLabels[i].textContent = '';
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

function displayEnterInitialsMsg() {
    enterInitialsMsg.setAttribute('id', 'enter-initials-msg');
    enterInitialsMsg.textContent = 'Please enter your initials';
    quizListElement.appendChild(enterInitialsMsg);
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
        userInitialsSpan.textContent = initials + " : ";
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
};
