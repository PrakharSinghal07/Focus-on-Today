// Initialize the count of filled goals to zero
let countGoalsFilled = 0;

const completionMsg = ['Raise the bar by completing your goals.', 'Well begun is half done!', 'Just a step away, keep going!', 'Whoa! You just completed all the goals, time for chill :)'];

// Get all elements with the 'svg' class and store them as an array
const radioBtn = [...document.querySelectorAll('.svg')];

// Load radio button status from localStorage or initialize it as an array of zeros if not present
let radioButtonStatus = JSON.parse(localStorage.getItem('radioStatus')) || new Array(radioBtn.length).fill(0);

// Define the SVG icons for checked and unchecked states of the radio button
const checkSvg = `<?xml version="1.0" encoding="utf-8"?> <svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <g> <path fill="none" d="M0 0h24v24H0z"/> <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-.997-4L6.76 11.757l1.414-1.414 2.829 2.829 5.656-5.657 1.415 1.414L11.003 16z"/> </g> </svg>`
const uncheckSvg = `<?xml version="1.0" encoding="utf-8"?> <svg width="800px" height="800px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"> <g> <path fill="none" d="M0 0h24v24H0z" /> <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16z" /> </g> </svg>`

// Get all input fields and some DOM elements for displaying warnings, messages, and progress bar
const input = [...document.querySelectorAll('input')]
const warning = document.querySelector('.card-warning');
const msgParagraph = document.querySelector('.card-msg').children[0];
const cardCompletionBar = document.querySelector('.card-completion-bar').children[0];
const cardCompletionBarMsg = document.querySelector('.card-completion-bar').children[0].children[0];

// Function to display the current goal completion status
const displayGoalCompletionStatus = (radioButtonStatus) => {
    // Count how many goals are marked as completed
    countGoalsFilled = radioButtonStatus.reduce((acc, btnValue) => acc + btnValue, 0);

    // Display the completion count in the progress bar if any goals are completed
    if(countGoalsFilled === 0){
        cardCompletionBarMsg.innerText = '';
    }
    else{
        cardCompletionBarMsg.innerText = `${countGoalsFilled} / 3 completed`;
    }
    cardCompletionBar.style.width = `${(countGoalsFilled/3)*100}%`;
    msgParagraph.innerText = completionMsg[countGoalsFilled];
}

// Function to check if all input fields have been filled
const areAllGoalsFilled = () => {
    // Return true if all input fields are non-empty
    return input.every((inputField) => inputField.value);
}

// Function to update the goal completion status and toggle button appearance
const updateGoalCompletionStatus = (radioButtonStatus, i) => {
    if (areAllGoalsFilled()) {
        // Toggle the 'card-todo-filled' class and update radio button status and SVG accordingly
        input[i].classList.toggle('card-todo-filled');
        radioButtonStatus[i] = input[i].classList.contains('card-todo-filled') ? 1 : 0;
        radioBtn[i].innerHTML = radioButtonStatus[i] ? checkSvg : uncheckSvg;

        // Disable input if the goal is marked complete, otherwise enable it
        input[i].toggleAttribute('disabled', radioButtonStatus[i]);
    } else {
        // Show a warning if not all goals are filled before toggling
        warning.classList.add('card-warning-show');
    }
    // Store the updated radio button status in localStorage
    localStorage.setItem('radioStatus', JSON.stringify(radioButtonStatus));
}

// Function to initialize the appearance of input fields and radio buttons on page load
const initializeElements = (i) => {
    input[i].classList.toggle('card-todo-filled', radioButtonStatus[i]);
    radioBtn[i].innerHTML = radioButtonStatus[i] ? checkSvg : uncheckSvg;
    input[i].toggleAttribute('disabled', radioButtonStatus[i]);
}

// Initialize the page by setting up the inputs and displaying the goal completion status
for(let i = 0; i < radioBtn.length; i++){
    initializeElements(i);
}
displayGoalCompletionStatus(radioButtonStatus);

// Add click event listeners to radio buttons to update goal completion status when clicked
radioBtn.forEach((btn, i) => {
    btn.addEventListener('click', () => {
        updateGoalCompletionStatus(radioButtonStatus, i);
        displayGoalCompletionStatus(radioButtonStatus);
    });
});

// Add click event listeners to input fields to hide the warning when they are clicked
input.forEach((inputField) => {
    inputField.addEventListener('click', () => {
        warning.classList.remove('card-warning-show');
        warning.classList.add('card-warning');
    });
});

// Load the text box values from localStorage or initialize an empty array
const textBox = JSON.parse(localStorage.getItem('textBox')) || [];

// Set input field values from localStorage and save changes to localStorage when the user types
input.forEach((inputField, i) => {
    inputField.value = textBox[i] || '';
    inputField.addEventListener('input', (e) => {
        textBox[i] = e.target.value;
        localStorage.setItem('textBox', JSON.stringify(textBox));
    });
});
