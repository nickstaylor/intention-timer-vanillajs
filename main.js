//form section query selectors
var buttonSection = document.querySelector(".top-buttons")
var categoryButtons = document.querySelectorAll(".categories")
var errorMessages = document.querySelectorAll(".error-message")
var startButton = document.querySelector("#start-activity");
var taskInput = document.querySelector("#accomplish");
var minutesInput = document.querySelector("#minutes-input")
var secondsInput = document.querySelector("#seconds-input")
var formPage = document.querySelector(".user-form")
var leftSideHeader = document.querySelector(".left-side-header")
//timer section query selectors
var timerPage = document.querySelector(".timer-section")
var activityName = document.querySelector(".activity-name")
var timerDisplay = document.querySelector(".timer-display")
var timerButton = document.querySelector(".timer-circle-btn")
var logActivityButton = document.querySelector(".log-activity-btn")


//global variables
var chosenCategory = '';
var task = '';
var minutes = '';
var seconds = '';
var currentActivity = {};
var timer = null;

//event listeners
startButton.addEventListener('click', validateCreateActivity)
buttonSection.addEventListener('click', selectCategory)
minutesInput.addEventListener('keyup', validateMinSec)
secondsInput.addEventListener('keyup', validateMinSec)
timerButton.addEventListener('click', startTimer)
logActivityButton.addEventListener('click', logActivity)

////// FORM VALIDATION and ACTIVITY CREATION //////
function selectCategory(e) {
  let activity = e.target.dataset.id
  chosenCategory = activity

  //highlight/unhighlight proper button
  categoryButtons.forEach(button => {
    let buttonName = button.dataset.id
    if (activity === buttonName) {
      button.classList.add(`${activity}-border`)
      button.children[0].src = `assets/${activity}-active.svg`
      button.children[1].classList.add(`${activity}-active`)
    } else {
      button.classList.remove(`${buttonName}-border`)
      button.children[0].src = `assets/${buttonName}.svg`
      button.children[1].classList.remove(`${buttonName}-active`)
    }
  })
}

function validateMinSec() {
  minutesInput.value = minutesInput.value.replace(/[^0-9]/, "");
  secondsInput.value = secondsInput.value.replace(/[^0-9]/, "");
}

function validateInputs() {
  task = taskInput.value
  minutes = parseInt(minutesInput.value)
  seconds = parseInt(secondsInput.value)

  if (minutes < 0 || minutes > 60) {
    minutes = '';
  }
  if (seconds < 0 || seconds > 59) {
    seconds = '';
  }
  let inputsObject = {
    chosenCategory: chosenCategory,
    task: task,
    minutes: minutes,
    seconds: seconds,
    validTime: !(minutes === 0 && seconds === 0)
  };
  if (displayHideErrorMessages(inputsObject)) {
    return false
  }
  return inputsObject
}

function displayHideErrorMessages(inputsObject) {
  let errors = false
  errorMessages.forEach(div => {
    let input = inputsObject[div.dataset.id.split("-")[1]];
    if (!input && input !== 0) {
      div.classList.remove('hidden')
      errors = true
    } else {
      div.classList.add('hidden');
    }
  })
  return errors
}

function validateCreateActivity(e) {
  e.preventDefault();
  let validatedActivity = validateInputs();

  if (validatedActivity.validTime) {
    delete validatedActivity.validTime
    currentActivity = new Activity(validatedActivity)
    displayTimerPage();
  }
}
////// end of FORM VALIDATION and ACTIVITY CREATION //////

////// TIMER FUNCTIONS and ACTIVITY LOGGING //////

function displayTimerPage() {
  let activity = currentActivity
  formPage.classList.add('hidden');
  leftSideHeader.innerHTML = `Current Activity : <span class="${activity.category}-active">${activity.category}</span>`
  timerButton.classList.add(`${activity.category}-border`)
  activityName.innerText = `${activity.description}`
  timerDisplay.innerText = `${activity.minutes < 10 ? "0" + `${activity.minutes}` : `${activity.minutes}`}:${activity.seconds < 10 ? "0" + `${activity.seconds}` : `${activity.seconds}`}`
  timerPage.classList.remove('hidden');
}

function startTimer() {
  console.log('currentActivity', currentActivity)
}

function logActivity() {
  
}

////// end of TIMER FUNCTIONS and ACTIVITY LOGGING //////