class Activity {
  constructor({ chosenCategory, task, minutes, seconds }) {
    this.category = chosenCategory;
    this.description = task;
    this.minutes = minutes;
    this.seconds = seconds;
    this.completed = false;
    this.id = Date.now();
    this.totalTime = (this.minutes * 60) + this.seconds;
    this.timerActive = false
  }
  

  startTimer({ timerDisplay, timerButton, logActivityButton }) {
    let countDown = () => {
      if (!this.timerActive) {
        clearInterval(timer)
        return
      }
      let minutes = Math.floor(this.totalTime / 60)
      let seconds = (this.totalTime-1) % 60
      if (minutes && seconds === 59) {
        minutes = minutes - 1
      }
       if (minutes < 10) {
         minutes = "0" + minutes;
       }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }

      timerDisplay.innerText = `${minutes}:${seconds}`
      this.totalTime--
      if (this.totalTime < 1) {
        clearInterval(timer)
        this.markComplete(timerButton, logActivityButton)
      }
    }

    let timer = null;
    console.log('this.timerActive', this.timerActive)
    if (this.timerActive) {
      timer = setInterval(countDown, 1000)
      timerButton.innerText = "pause"
    } 
  }
  
  
  markComplete(timerButton) {
    this.completed = true;
    this.timerActive = false;
    this.totalTime = this.minutes * 60 + this.seconds;
    timerButton.innerText = "congrats!"
    logActivityButton.classList.remove('hidden')
  }

  saveToStorage() {
    //local storage logic here
  }
}