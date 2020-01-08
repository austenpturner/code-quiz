const quizItems = [
    {
        question: 'What goes in the head of an HTML document?',
        choices: ['the main navigation', 'links to JavaScript files', 'information about the author', 'meta information'],
        answer: 'meta information'
    },
    {
        question: 'Of the following way to add CSS to an HTML page, which is the most powerful?',
        choices: ['inline styles', 'internal styles', 'external stylesheet', 'CSS import statements'],
        answer: 'inline styles'
    },
    {
        question: 'How does the browser know which radio buttons are grouped together?',
        choices: ['if the have the same id value', 'if they are siblings', 'if they have the same name attribute value', 'if they have the same label'],
        answer: 'if they have the same name attribute value'
    },
    {
        question: 'What does setting an element\'s margins to auto do?',
        choices: ['it will reset the element\'s margins', 'it will make margins equal on all sides', 'it will account for differences across browsers', 'it will align an element to the left side of the page'],
        answer: 'it will make margins equal on all sides'
    },
    {
        question: 'Which of the following elements is considered an inline element?',
        choices: ['button', 'list item', 'paragraph', 'article'],
        answer: 'button'
    },
    {
        question: 'What is the correct order of the box model, listing the properties from outer-most to inner-most layer?',
        choices: ['padding, border, margin', 'border, margin, padding', 'margin, border, padding', 'border, margin, padding'],
        answer: 'margin, border, padding'
    },
    {
        question: 'What does the CSS property border-box do?',
        choices: ['apply a border to all sides of the selected elements', 'force an element\'s padding and border into it\'s specified width and height values', 'center an element inside of it\'s parent element', 'keep an element from overflowing from it\'s container'],
        answer: 'force an element\'s padding and border into it\'s specified width and height values'
    },
    {
        question: 'Which CSS property and value would you apply to an HTML element if you do not want it to show up on the page or take up space?',
        choices: ['display: none', 'visibility: hidden', 'opacity: 0', 'opacity: 1'],
        answer: 'display: none'
    },
    {
        question: 'What is the value of the .indexOf() method if the value is not found in the specified array?',
        choices: ['null', 'undefined', '0', '-1'],
        answer: '-1'
    },
    {
        question: 'Consider the statement Math.floor(Math.round() * 10, what is the range of the possible outputs?',
        choices: ['0 to 10', '1 to 10', '0 to 9', '1 to 9'],
        answer: '0 to 9'
    },
    {
        question: 'Which method will remove the first value from an array?',
        choices: ['.push()', '.pop()', '.shift()', '.unshift()'],
        answer: '.shift()'
    },
    {
        question: 'Where does the method .appendChild() insert an element into the DOM?',
        choices: ['as the last child element of the appended element', 'as a sibling of the appended element', 'as the first child element the appended element', 'as the only child of the appended element, replacing any existing child elements'],
        answer: 'as the last child element of the appended element'
    },
    {
        question: 'What semantic information does a div tag represent?',
        choices: ['an important section of the document', 'the main section of the document', 'it holds no important semantic information', 'a section of the document that could be removed'],
        answer: 'it holds no important semantic information'
    },
    {
        question: 'Consider the selector .main-nav { background-color: grey }, what is the selector using to target an HTML element?',
        choices: ['tag name', 'pseudo-class', 'id', 'class'],
        answer: 'class'
    },
    {
        question: 'JavaScript loops will repeat a block of code over and over again until',
        choices: ['the condition is false', 'the condition is true', 'it gets to the end of the code block it is running', 'there are no more items to iterate through'],
        answer: 'the condition is false'
    },
    {
        question: 'What is the relationship between the last index position in an array and the value of array.length?',
        choices: ['they will always be equal', 'array.length will always be one more than the last index position', 'array.length will always be one less than the last index position', 'it depends on the array'],
        answer: 'array.length will always be one more than the last index position'
    }
];


