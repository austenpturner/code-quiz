const questionElement = document.getElementById('question');
const choiceElements = document.getElementsByClassName('choice');
const resultMsg = document.getElementsByClassName('result-msg');
const submitAnswerBtn = document.getElementById('submit-btn');
const nextQuestionBtn = document.getElementById('next-btn');
const timerElement = document.getElementById('time');
const userListElement = document.getElementById('user-list');
const removeScoresBtn = document.getElementById('clear-scores-btn');

let finalScoreMsg = document.createElement('p');
let initialsLabel = document.createElement('label');
let initialsInput = document.createElement('input');
let submitInitialsBtn = document.createElement('button');

let userInitialsElement = document.getElementsByClassName('user-initials');
let userScoreElement = document.getElementsByClassName('user-score');

const choiceA = document.getElementById('choiceA');
const choiceB = document.getElementById('choiceB');
const choiceC = document.getElementById('choiceC');
const choiceD = document.getElementById('choiceD');

const radioBtns = [choiceA, choiceB, choiceC, choiceD];

const quizItems = [
    { 
        question: "this is a question",
        choices: ['answer1', 'answer2', 'answer3', 'answer4'],
        answer: "answer1"
    },
    { 
        question: "this is another question",
        choices: ['answer5', 'answer6', 'answer7', 'answer8'],
        answer: "answer8"
    },
    { 
        question: "this is a different question",
        choices: ['answer9', 'answer10', 'answer11', 'answer12'],
        answer: "answer10"
    }
];

let result = '';
let usedQuizItemIndex = [];
let time = 10;
let timer;
let userScore = 0;
let userInitials;
let users;

if (JSON.parse(localStorage.getItem('Users')) != null) {
    users = JSON.parse(localStorage.getItem('Users'))
} else {
    users = [];
}

window.onload = function() {
    if (document.querySelector('main').getAttribute('id') === 'quiz') {
        submitAnswerBtn.addEventListener('click', function() {
            getResult();
            displayResult();
        });
        nextQuestionBtn.addEventListener('click', function() {
            clearQuiz();
            if (usedQuizItemIndex.length === quizItems.length) {
                clearInterval(timer);
                quizOver();
            } else {
                getQuizItem();
            }
        });
        submitInitialsBtn.addEventListener('click', function() {
            saveUserData();
        })
        quizTimer();
        getQuizItem();
    } 
    
    if (document.querySelector('main').getAttribute('id') === 'highscores') {
        displayUsers();
        removeScoresBtn.addEventListener('click', function() {
            clearUserData();
        })
    }
};

function getQuizItem() {
    // get a random index from quizItems array
    let itemIndex = Math.floor(Math.random() * quizItems.length);
    // check to see if that index has been used yet
    while (usedQuizItemIndex.indexOf(itemIndex) > -1) {
        // keep looking for a index that has not been used
        itemIndex = Math.floor(Math.random() * quizItems.length);
    }
    // now add index to the array of used index
    usedQuizItemIndex.push(itemIndex);
    // get the item object at that index
    let currentItem = quizItems[itemIndex];
    // get the question key of that item
    let questionKey = Object.keys(currentItem)[0];
    // get the string value for that question
    let questionValue = currentItem[questionKey];
    // set questionElement.textContent to string value
    questionElement.textContent = questionValue;
    // get the choices key of that item
    let choicesKey = Object.keys(currentItem)[1];
    // get the choices array values, loop through them and randomly assign them to answerElement.textContent
    let choiceValues = currentItem[choicesKey];
    for (var i = 0; i < choiceElements.length; i++) {
        let choiceIndex = Math.floor(Math.random() * choiceValues.length);
        let currentChoice = choiceValues[choiceIndex];
        choiceElements[i].textContent = currentChoice;
        choiceValues.splice(choiceIndex, 1);
    }
}

// Function to get answer for current quiz question

function getItemAnswer() {
    // loop through quizItems array
    for (var i = 0; i < quizItems.length; i++) {
        // get question for each quizItem array object
        questionValue = quizItems[i]['question'];
        // check to see if that question is the question currently written to the page
        if (questionElement.textContent === questionValue) {
            // if it is the current question on the page get the answer value of that question object
            answerValue = quizItems[i]['answer'];
            // return that answer
            return answerValue;
        }
    }
}

// Function to get radioBtn checked by user

function getCheckedRadioBtn() {
    // loop through radioBtns 
    for (let i = 0; i < radioBtns.length; i++) {
        // determine if radioBtn is checked
        if (radioBtns[i].checked) {
            // if radioBtn in question is checked then get id attribute value of that radioBtn
            let radioBtnId= radioBtns[i].getAttribute("id");
            // return id value of radioBtn checked by the user
            return radioBtnId;
        }
    } 
}

// Function to get choice associated with checked radio btn

function getUserChoice() {
    // loop through choiceElements aka radioBtn label elements
    for (let i = 0; i < choiceElements.length; i ++) {
        // get label for attribute value
        let choiceForValue = choiceElements[i].getAttribute('for');
        // Call getCheckedRadioBtn function and get id of radioBtn checked by user
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

// Function to get result of quiz item and assign result "correct" or "wrong" string value

function getResult() {
    // call getUserChoice function to output the value of the user's choice
    let userChoiceValue = getUserChoice();
    // call the getItemAnswer function to outout the answer to the current quiz item
    let itemAnswer = getItemAnswer();
    // check to see if the user's choice is the quiz item answer
    if (userChoiceValue === itemAnswer) {
        // if the user choice is the answer then return "correct"
        result = 'correct';
        userScore++;
        time += 10;
        // if the user choice is not the answer then return "wrong"
    } else {
        result = 'wrong';
        time -= 10;
    }
}

// Function to display result on screen for user to see

function displayResult() {
    for (let i = 0; i < resultMsg.length; i++) {
        let resultSpan = resultMsg[i];
        let label = resultSpan.previousElementSibling;
        let labelName = label.getAttribute('for');
        let checkedRadioBtnId = getCheckedRadioBtn();
        if (checkedRadioBtnId === labelName) {
            resultSpan.textContent = result;
        } else {
            resultSpan.textContent = '';
        }
    }
}

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

function quizOver() {
    // hide radio buttons, submit button and next button
    for (let i = 0; i < radioBtns.length; i++) {
        radioBtns[i].style.display = "none";
    }
    submitAnswerBtn.style.display = "none";
    nextQuestionBtn.style.display = "none";
    
    questionElement.textContent = "The quiz is over";
    
    finalScoreMsg.textContent = 'Your final score: ' + userScore;
    document.querySelector('ul').appendChild(finalScoreMsg);
    
    initialsLabel.setAttribute('for', 'initials-input');
    initialsLabel.textContent = 'Enter initials:';
    document.querySelector('ul').appendChild(initialsLabel);
    
    initialsInput.setAttribute('id', 'initials-input');
    document.querySelector('ul').appendChild(initialsInput);
    
    submitInitialsBtn.textContent = 'submit';
    document.querySelector('ul').appendChild(submitInitialsBtn);
}

function quizTimer() {
    timerElement.textContent = 'Time: ' + time;
    timer = setInterval( function() {
        time--;
        timerElement.textContent = 'Time: ' + time;
        if (time === 0) {
            clearInterval(timer);
            clearQuiz();
            quizOver();
        }
    }, 1000)
}

function saveUserData() {
    userInitials = initialsInput.value;
    console.log(userInitials);
    console.log(userScore);

    let user = {
        initials: userInitials,
        score: userScore
    };
    console.log(user);

    users.push(user);
    console.log(users);

    localStorage.setItem('Users', JSON.stringify(users));

    console.log(JSON.parse(localStorage.getItem('Users')));
}

function displayUsers() {
    for (let i = 0; i < users.length; i++) {
        let user = users[i];
        let initials = user['initials'];
        let score = user['score'];

        let userListItem = document.createElement('li');
        userListElement.appendChild(userListItem);

        let userInitialsSpan = document.createElement('span');
        userInitialsSpan.setAttribute('class', 'user-initials');
        userInitialsSpan.textContent = initials;
        userListItem.appendChild(userInitialsSpan);

        let userScoreSpan = document.createElement('span');
        userScoreSpan.setAttribute('class', 'user-score');
        userScoreSpan.textContent = score;
        userListItem.appendChild(userScoreSpan);
    }
}

function clearUserData() {
    for (let i = 0; i < userInitialsElement.length; i++) {
        userInitialsElement[i].textContent = ''
    }
    for (let i = 0; i < userScoreElement.length; i++) {
        userScoreElement[i].textContent = ''
    }
    localStorage.removeItem('Users');
}










