// DOM elements
const questionElement = document.getElementById('question');
const choiceElements = document.getElementsByClassName('choice');
const resultMsg = document.getElementsByClassName('result-msg');
const selectAnswerMsg = document.getElementById('select-answer-msg');
const timerElement = document.getElementById('time');
const quizListElement = document.getElementById('quiz-list');
const userListElement = document.getElementById('user-list');
const submitChoiceBtn = document.getElementById('submit-btn');
const nextQuestionBtn = document.getElementById('next-btn');
const removeScoresBtn = document.getElementById('clear-scores-btn');

const choiceA = document.getElementById('choiceA');
const choiceB = document.getElementById('choiceB');
const choiceC = document.getElementById('choiceC');
const choiceD = document.getElementById('choiceD');

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

let currentAnswer;
let result = '';
let usedQuizItemIndex = [];
let time = (quizItems.length * 15);
let timer;
let userScore = 0;
let userInitials;
let users;
let responses = 0;

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
        displayQuizItem();
        submitChoiceBtn.addEventListener('click', function() {
            let userResponded = checkForUserResponse();
            if (userResponded) {
                responses++;
                evaluateUserChoice();
                displayResult();
                if (usedQuizItemIndex.length === quizItems.length) {
                    clearInterval(timer);
                    nextQuestionBtn.textContent = 'Finish quiz';
                }
            } else {
                selectAnswerMsg.textContent = 'Please select an answer';
            }
        });
        nextQuestionBtn.addEventListener('click', function() {
            clearQuiz();
            if (usedQuizItemIndex.length === quizItems.length) {
                clearInterval(timer);
                addBonusPoints();
                quizOver();
            } else {
                displayQuizItem();
            }  
        });
        saveInitialsBtn.addEventListener('click', function() {
            if (!initialsInput.value) {
                enterInitialsMsg.textContent = 'Please enter your initials';
                quizListElement.appendChild(enterInitialsMsg);
            } else {
                saveUserData();
                displaySavedMsg();
            }
        })
    } 
    if (document.querySelector('main').getAttribute('id') === 'highscores') {
        displaySavedData();
        removeScoresBtn.addEventListener('click', function() {
            clearUserData();
        })
    }
};

// Function to display a random quiz item
function displayQuizItem() {
    let itemIndex = Math.floor(Math.random() * quizItems.length);
    while (usedQuizItemIndex.indexOf(itemIndex) > -1) {
        itemIndex = Math.floor(Math.random() * quizItems.length);
    }
    usedQuizItemIndex.push(itemIndex);
    let currentItem = quizItems[itemIndex];
    //console.log(currentItem);
    let questionKey = Object.keys(currentItem)[0];
    //console.log(questionKey);
    let questionValue = currentItem[questionKey];
    //console.log(questionValue);
    questionElement.textContent = questionValue;
    let choicesKey = Object.keys(currentItem)[1];
    let choiceValues = currentItem[choicesKey];
    for (var i = 0; i < choiceElements.length; i++) {
        let choiceIndex = Math.floor(Math.random() * choiceValues.length);
        let currentChoice = choiceValues[choiceIndex];
        choiceElements[i].textContent = currentChoice;
        choiceValues.splice(choiceIndex, 1);
    }
    let answerKey = Object.keys(currentItem)[2];
    //console.log(answerKey);
    let answerValue = currentItem[answerKey];
    //console.log(answerValue);
    currentAnswer = answerValue;
    //console.log(currentAnswer);
}

// Function to start quiz timer and display time
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

// Function to find which radioBtn is checked by user
function getCheckedRadioBtn() {
    // loop through radioBtns 
    for (let i = 0; i < radioBtns.length; i++) {
        // determine if radioBtn is checked
        if (radioBtns[i].checked) {
            // if radioBtn in question is checked then get id attribute value of that radioBtn
            let radioBtnId = radioBtns[i].getAttribute('id');
            // return id value of radioBtn
            return radioBtnId;
        }
    } 
}

// Function to check if user has checked a radio button
function checkForUserResponse() {
    for (let i = 0; i < radioBtns.length; i++) {
        if (radioBtns[i].checked) {
            selectAnswerMsg.textContent = '';
            return true;
        } 
    }
}

// Function to get user choice associated with user checked radio btn
function getUserChoice() {
    // loop through choiceElements aka radioBtn label elements
    for (let i = 0; i < choiceElements.length; i ++) {
        // get label for attribute value
        let choiceForValue = choiceElements[i].getAttribute('for');
        // Call getCheckedRadioBtn function to get id of radioBtn checked by user
        let radioBtnId = getCheckedRadioBtn();
        // find the label with the for value that matches the radioBtn id 
        if (choiceForValue === radioBtnId) {
            // get choice that's been set to the textContent of that label
            let userChoiceValue = choiceElements[i].textContent;
            // return the choice selected by the user
            return userChoiceValue;
        }
    }
}

// Function to determine if choice user selected is the same as the answer and update quiz variables
function evaluateUserChoice() {
    // call getUserChoice function to output the value of the user's choice
    let userChoiceValue = getUserChoice();
    // check to see if the user's choice is the quiz item answer
    if (userChoiceValue === currentAnswer) {
        // if the user choice is the answer then assign "correct"
        result = 'correct!';
        // give the user a point
        userScore++;
        // give user more time
        time += 10;
    } else {
        // if the user choice is not the answer then assign "wrong"
        result = 'wrong';
        // take time away
        time -= 10;
        // if time is now 0 or less quiz is over
        if (time <= 0) {
            clearInterval(timer);
            clearQuiz();
            quizOver();
        }
    }
}

// Function to display result next to user choice
function displayResult() {
    // loop through resultMsg span elements
    for (let i = 0; i < resultMsg.length; i++) {
        let resultSpan = resultMsg[i];
        // traverse to label  element prior to span element
        let label = resultSpan.previousElementSibling;
        // get for attribute value of label
        let labelName = label.getAttribute('for');
        // get radioBtn that user checked
        let checkedRadioBtnId = getCheckedRadioBtn();
        // check to see if that this is the label for radioBtn
        if (checkedRadioBtnId === labelName) {
            // if label and radioBtn are a pair set span to quiz item result
            resultSpan.textContent = result;
        }
    }
}

// Function to add bonus points if user finishes quiz before time runs out
function addBonusPoints() {
    if (responses === quizItems.length && time > 0) {
        if (time <= 10) {
            userScore++;
        } else if (time <= 20) {
            userScore += 2;
        } else if (time <= 30) {
            userScore += 3;
        } else {
            userScore += 4;
        }
    }
}

// Function to clear checked radioBtn, resultMsg, choices and question
function clearQuiz() {
    for (let i = 0; i < resultMsg.length; i++) {
        resultMsg[i].textContent = '';
    }
    for (let i = 0; i < radioBtns.length; i++) {
        radioBtns[i].checked = false;
    }
    for (let i = 0; i < choiceElements.length; i++) {
        choiceElements[i].textContent = '';
    }
    questionElement.textContent = '';
}

// Function to hide quiz elements and display end-of-quiz elements when quiz is over
function quizOver() {
    // hide radio buttons, submit button and next button
    for (let i = 0; i < radioBtns.length; i++) {
        radioBtns[i].style.display = 'none';
    }
    submitChoiceBtn.style.display = 'none';
    nextQuestionBtn.style.display = 'none';
    
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
        // get user initials value
        let initials = user['initials'];
        // get user score value
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










