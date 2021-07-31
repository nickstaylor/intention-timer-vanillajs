class Activity {
  constructor({ chosenCategory, task, minutes, seconds }) {
    this.category = chosenCategory;
    this.description = task;
    this.minutes = minutes;
    this.seconds = seconds;
    this.completed = false;
    this.id = Date.now();
  }

  countDown() {
    //timer logic here
  }

  markComplete() {
    this.complete = true;
    //insert adjcacent html for 'create a new activity'
    //inset adjacent html logic here for each activity
  }

  saveToStorage() {
    //local storage logic here
  }
}