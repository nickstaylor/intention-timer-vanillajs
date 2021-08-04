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
var clearLocalStorage = document.querySelector(".local-storage-clear")
//timer section query selectors
var timerPage = document.querySelector(".timer-section")
var timerInnerPage = document.querySelector(".timer-inner-section")
var activityName = document.querySelector(".activity-name")
var timerDisplay = document.querySelector(".timer-display")
var timerButton = document.querySelector(".timer-circle-btn")
var logActivityButton = document.querySelector(".log-activity-btn")
var createNewButtonSection = document.querySelector(".create-new-btn-section")
var createNewButton = document.querySelector(".create-new-activity-btn")
var noActivityMessage = document.querySelector(".no-activity-message")
var savedActivitiesSection = document.querySelector(".activities-section")
var showFavorites = document.querySelector(".show-favorites")



//global variables
var chosenCategory = '';
var task = '';
var minutes = '';
var seconds = '';
var currentActivity = {};
var savedActivities = [];
var favorites = [];
var showingFavorites = false;
let activeDelay;

//event listeners
startButton.addEventListener('click', validateCreateActivity)
buttonSection.addEventListener('click', selectCategory)
minutesInput.addEventListener('keyup', validateMinSec)
secondsInput.addEventListener('keyup', validateMinSec)
timerButton.addEventListener('click', startTimer)
logActivityButton.addEventListener('click', logActivity)
createNewButton.addEventListener('click', resetForm)
clearLocalStorage.addEventListener('click', clearLS)
showFavorites.addEventListener('click', displayFavorites)

////// Feltch activities from local storage //////

window.onload = function () {
  let activities = localStorage.getItem('activities')
  let allActivities = JSON.parse(activities)
  if (allActivities) {
    clearLocalStorage.classList.remove('hidden')
    allActivities.forEach(activity => {
      savedActivities.push(new Activity({
        chosenCategory: activity.category,
        task: activity.description,
        minutes: activity.minutes,
        seconds: activity.seconds,
        id: activity.id,
        favorite: activity.favorite
      }))
      if (activity.favorite) {
        favorites.push(activity.id)
      }
      insertSavedActivity(activity)
    })
  }
}

////// Clear Local Storage //////
function clearLS() {
    window.localStorage.clear();
    clearLocalStorage.classList.add("hidden");
}

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
  let activity = currentActivity;
  formPage.classList.add("hidden");
  leftSideHeader.innerHTML = `Current Activity : <span class="${activity.category}-active">${activity.category}</span>`;
  timerButton.classList.add(`${activity.category}-border`);
  activityName.innerText = `${activity.description}`;
  timerDisplay.innerText = `${activity.minutes < 10 ? "0" + `${activity.minutes}` : `${activity.minutes}`}:${activity.seconds < 10 ? "0" + `${activity.seconds}` : `${activity.seconds}`}`;
  timerPage.classList.remove("hidden");
}

function startTimer() {
  if (timerButton.innerText === 'PAUSE') {
    currentActivity.timerActive = false
    timerButton.innerText = 'start'
    currentActivity.startTimer({ timerDisplay, timerButton, logActivityButton });
    toggleReplayFavoriteButtons(currentActivity.timerActive);
    return
  }
  currentActivity.timerActive = true;
  currentActivity.startTimer({ timerDisplay, timerButton, logActivityButton });
  toggleReplayFavoriteButtons(currentActivity.timerActive)
}


function logActivity() {
  savedActivities.push(currentActivity)
  currentActivity.saveToStorage(savedActivities)
  clearLocalStorage.classList.remove('hidden')
  timerInnerPage.classList.add("hidden")
  createNewButtonSection.classList.remove('hidden')
  if (!showingFavorites) {
    insertSavedActivity(currentActivity)
  }
  toggleReplayFavoriteButtons(currentActivity.timerActive)
}

function showDelete(id) {
  let deleteSection = document.querySelector(`.delete-section-${id}`);
  let blackOutSection = document.querySelector(`.body-blackout-${id}`);
    console.log('show delete')
    activeDelay = setTimeout(function (id) {
          deleteSection.classList.remove("hidden");
          blackOutSection.classList.remove("hidden");
    }, 2500)

  }
  
function hideDelete(id) {
  clearTimeout(activeDelay)
  console.log('clear')
  let deleteSection = document.querySelector(`.delete-section-${id}`)
  let blackOutSection = document.querySelector(`.body-blackout-${id}`)
  deleteSection.classList.add('hidden')
  blackOutSection.classList.add('hidden')
}


function deleteActivity(id) {
 console.log(id)
}

function insertSavedActivity(activity) {
  noActivityMessage.classList.add('hidden')
  savedActivitiesSection.insertAdjacentHTML(
    "afterbegin",
    `
    <div class="activity-container activity-${activity.id}" onmouseenter="showDelete(${activity.id}, true)" onmouseleave="hideDelete(${activity.id}, false)" data-id=${
      activity.id
    }>
      <section class="delete-section delete-section-${activity.id} hidden">
        <p class="delete-activity" onclick="deleteActivity(${
          activity.id
        })" >Delete Activity?</>
      </section>
      <div class="body-blackout body-blackout-${activity.id} hidden"></div>
      <section class="top-of-activity-card activity-card-${activity.category}">
        <p class="activity-card-category">${activity.category}</p>
        <p class="activity-card-time">${activity.minutes} minutes ${
      activity.seconds
    } Seconds</p>
      </section>
      <section class="botton-of-activity-card">
        <p class="activity-card-desc">${activity.description}</p>
        <div class="replay-favorite-images">
          <img src="assets/replay-hollow.svg" class="replay-img" onclick="replayActivity(${
            activity.id
          })" />
          <img src="assets/heart-${
            activity.favorite ? "filled.svg" : "outline.svg"
          }" class="favorite-img" id="${
      activity.id
    }" onclick="favoriteActivity(${activity.id})" />
        </div>
      </section>
    </div>
    `
  );
  }
  
function displayFavorites() {
  showingFavorites = !showingFavorites
  if (showingFavorites) {
    showFavorites.src = "assets/heart-filled.svg"
  } else {
    showFavorites.src = "assets/heart-outline.svg"
  }
  displayFavoritesOnCard();
}

function displayFavoritesOnCard() {
  savedActivitiesSection.innerHTML = ''
  savedActivities.forEach(activity => {
    if (activity.favorite && showingFavorites) {
      insertSavedActivity(activity)
    }
    if (!showingFavorites) {
      insertSavedActivity(activity)
    }
  })
  }
  
function replayActivity(id) {
  let activity = savedActivities.find(act => id === act.id)
  console.log('activity', activity)
}

function toggleReplayFavoriteButtons(timerActive) {
  var replayFavoriteImages = Array.from(
    document.querySelectorAll(".replay-favorite-images")
  );
  replayFavoriteImages.push(showFavorites)

  replayFavoriteImages.forEach(image => {
    if (timerActive) {
      image.classList.add('pointer-events')
    } else {
      image.classList.remove('pointer-events')
    }
    })
  }
  
  
  function favoriteActivity(id) {
    let alreadyFavorite = alreadyFavorited(id)
    
    let favorite = savedActivities.find(act => id === act.id)
    var activityCards = Array.from(document.querySelectorAll('.activity-container'));
    activityCards.forEach(card => {
      if (parseInt(card.dataset.id) === id) {
        let image = card.querySelector(".favorite-img")
        if (alreadyFavorite) {
          image.src = 'assets/heart-outline.svg'
          favorite.favorite = false;
        } else {
          image.src = 'assets/heart-filled.svg'
          favorite.favorite = true;
        }
      }
    })
    favorite.saveToStorage(savedActivities)
    if (showingFavorites) {
      displayFavoritesOnCard()
    }
  }
    
function alreadyFavorited(id) {
  let alreadyFavorited = favorites.find(fav => id === fav)
  if (!alreadyFavorited) {
    favorites.push(id)
    return false
  } else {
    let filtered = favorites.filter(fav => fav !== id)
    favorites = filtered
    return true
  }
  
}

////// end of TIMER FUNCTIONS and ACTIVITY LOGGING //////

////// RESET FUNCTIONS //////
function resetForm() {
  resetCategoryButtons(chosenCategory)
  resetTimerPage(currentActivity);
  resetGlobalVariables();
  taskInput.value = '';
  minutesInput.value = '';
  secondsInput.value = '';
  leftSideHeader.innerHTML = "New Activity"
  timerPage.classList.add("hidden");
  formPage.classList.remove("hidden");
}
    
function resetGlobalVariables() {
  currentActivity = {};
  chosenCategory = '';
  task = '';
  minutes = '';
  seconds = '';
}

function resetTimerPage(activity) {
  timerButton.classList.remove(`${activity.category}-border`);
  timerInnerPage.classList.remove("hidden")
  logActivityButton.classList.add("hidden")
  createNewButtonSection.classList.add("hidden")
  timerButton.innerText = 'start';
  
}

function resetCategoryButtons(chosenCategory) {
  categoryButtons.forEach((button) => {
    let buttonName = button.dataset.id;
    if (chosenCategory === buttonName) {
      button.classList.remove(`${buttonName}-border`);
      button.children[0].src = `assets/${buttonName}.svg`;
      button.children[1].classList.remove(`${buttonName}-active`);
    }
  });
}
    
////// end of RESET FUNCTIONS //////
    
