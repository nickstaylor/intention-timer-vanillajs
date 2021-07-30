var buttonSection = document.querySelector(".top-buttons")
var categoryButtons = document.querySelectorAll(".categories")
var errorMessages = document.querySelectorAll(".error-message")
var startButton = document.querySelector("#start-activity");
var taskInput = document.querySelector("#accomplish");
var minutesInput = document.querySelector("#minutes-input")
var secondsInput = document.querySelector("#seconds-input")
var timerPage = document.querySelector(".timer-section")
var formPage = document.querySelector(".user-form")


//global variables
var chosenCategory = '';
var task = '';
var minutes = '';
var seconds = '';
var timer = null;

//event listeners
startButton.addEventListener('click', startActivity)
buttonSection.addEventListener('click', selectCategory)
minutesInput.addEventListener('keyup', validateMinSec)
secondsInput.addEventListener('keyup', validateMinSec)


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

function checkInputs() {
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

function startActivity(e) {
  e.preventDefault();
  let validated = checkInputs();
  if (validated.validTime) {
    formPage.classList.add('hidden');
    timerPage.classList.remove('hidden');
  }
}