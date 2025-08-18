const timersContainer = document.getElementById("timers-container");

class CountdownTimer {

  constructor(index) {
    this.index = index;
    this.timer = null;
    this.initialDuration = 0; 
    this.duration = 0;
    this.endTime = 0;
    this.isRunning = false;
    this.hasStartedBefore = false; 

    this.createElements();
    this.populatePickers();
    this.attachEvents();
  }

  createElements() {
    const wrapper = document.createElement("div");
    wrapper.className = "timer";

    wrapper.innerHTML = `
      <div class="picker">
        <select class="hoursSelect"></select> :
        <select class="minutesSelect"></select> :
        <select class="secondsSelect"></select>
      </div>
      <div class="display">00:00:00:00</div>
      <div class="controls">
        <button class="startBtn">Start</button>
        <button class="stopBtn">Stop</button>
        <button class="resetBtn">Reset</button>
      </div>
    `;

    this.wrapper = wrapper;
    this.hoursSelect = wrapper.querySelector(".hoursSelect");
    this.minutesSelect = wrapper.querySelector(".minutesSelect");
    this.secondsSelect = wrapper.querySelector(".secondsSelect");
    this.display = wrapper.querySelector(".display");
    this.startBtn = wrapper.querySelector(".startBtn");
    this.stopBtn = wrapper.querySelector(".stopBtn");
    this.resetBtn = wrapper.querySelector(".resetBtn");

    timersContainer.appendChild(wrapper);
  }

  populatePickers() {
    this.populateSelect(this.hoursSelect, 23);
    this.populateSelect(this.minutesSelect, 59);
    this.populateSelect(this.secondsSelect, 59);
  }

  populateSelect(select, max) {
    for (let i = 0; i <= max; i++) {
      const option = document.createElement("option");
      option.value = i;
      option.textContent = String(i).padStart(2, "0");
      select.appendChild(option);
    }
  }

  attachEvents() {
    this.startBtn.addEventListener("click", () => this.start());
    this.stopBtn.addEventListener("click", () => this.stop());
    this.resetBtn.addEventListener("click", () => this.reset());
  }

  start() {
    if (this.isRunning) return;

  // ⏱️ If first start, calculate full duration from pickers
    if (!this.hasStartedBefore || this.duration === 0) {
      const h = parseInt(this.hoursSelect.value);
      const m = parseInt(this.minutesSelect.value);
      const s = parseInt(this.secondsSelect.value);
      this.initialDuration = (h * 3600 + m * 60 + s) * 1000;
      this.duration = this.initialDuration;

      if (this.duration <= 0) {
        alert(`Timer ${this.index + 1}: Please set a time`);
        return;
      }

      this.hasStartedBefore = true;
    }

    // 🕒 Set new endTime and start interval
    this.endTime = Date.now() + this.duration;
    this.timer = setInterval(() => this.update(), 10);
    this.isRunning = true;
  }

  stop() {
    if (!this.isRunning) return;

    clearInterval(this.timer);
    this.duration = this.endTime - Date.now(); // Save remaining
    this.isRunning = false;

    const alarm = document.getElementById("alarmSound");
        if (alarm) {
        alarm.pause();
        alarm.currentTime = 0;
        }
    this.wrapper.classList.remove("blink-border");

  }

  reset() {
    clearInterval(this.timer);
    this.isRunning = false;
    this.hasStartedBefore = false;
    this.display.textContent = "00:00:00:00";
    const alarm = document.getElementById("alarmSound");
    if (alarm) {
        alarm.pause();
        alarm.currentTime = 0;
    }
    this.wrapper.classList.remove("blink-border");

  }

  update() {
    const remaining = this.endTime - Date.now();
    if (remaining <= 0) {
      clearInterval(this.timer);
      this.display.textContent = "00:00:00:00";
      this.isRunning = false;
      const alarm = document.getElementById("alarmSound");
      if (alarm) alarm.play();
      if (navigator.vibrate) {
        navigator.vibrate([300, 100, 300]); 
      }
      this.wrapper.classList.add("blink-border");
      return;
    }

    let hours = Math.floor(remaining / (1000 * 60 * 60));
    let minutes = Math.floor((remaining / (1000 * 60)) % 60);
    let seconds = Math.floor((remaining / 1000) % 60);
    let milliseconds = Math.floor((remaining % 1000) / 10);

    hours = String(hours).padStart(2, "0");
    minutes = String(minutes).padStart(2, "0");
    seconds = String(seconds).padStart(2, "0");
    milliseconds = String(milliseconds).padStart(2, "0");

    this.display.textContent = `${hours}:${minutes}:${seconds}:${milliseconds}`;
    
  }
}

// Create 5 timers
window.addEventListener("DOMContentLoaded", () => {
  for (let i = 0; i < 100; i++) {
    new CountdownTimer(i);
  }
});
