// QUIZ FUNCTIONS

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

function initiateQuizTimer() {
    printTime();
    timer = setInterval( function() {
        if (seconds === 0) {
            seconds = 59;
            minutes--;
        } else {
            seconds--;
        }
        checkTime();
        printTime();
    }, 1000);
}

function printTime() {
    if (seconds < 10) {
        timerElement.textContent = minutes + ':0' + seconds
    } else {
        timerElement.textContent = minutes + ':' + seconds;
    } 
}

function checkTime() {
    if (seconds === 0 && minutes === 0) {
        userScore = 0;
        console.log("checkTime" + userScore);
        clearInterval(timer);
        clearQuiz();
        quizOver();
    } else if (seconds === 0) {
        minutes --;
        seconds += 60;
    } else if (seconds <= 30 && minutes === 0) {
        timerElement.style.color = "red";
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
        if (seconds < 10 && minutes > 0) {
            let timeRoll = 10 - seconds;
            seconds = 60 - timeRoll;
            minutes--;
        } else {
            seconds -= 10;
            if (seconds <= 0 && minutes <= 0) {
                userScore = 0;
                console.log('evaluateUserChoice' + userScore);
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
    quizListElement.appendChild(homePageLink);
    let homeButton = document.createElement('button');
    homeButton.textContent = 'Take quiz again';
    homePageLink.appendChild(homeButton);
}

// Function to display user data on highscores page
function displaySavedData() {
    if (users.length === 0) {
        let userListItem = document.createElement('li');
        userListItem.textContent = 'No saved scores';
        userListElement.appendChild(userListItem);
    } else {
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