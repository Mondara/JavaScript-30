let countdown;

const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');

const buttons = document.querySelectorAll('[data-time');

function timer(seconds) {
    // clear any existing timers
    clearInterval(countdown);

    const now = Date.now();
    const then = now + (seconds * 1000);

    displayTimeLeft(seconds);
    displayEndTime(then);

    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);

        if (secondsLeft < 0) {
            clearInterval(countdown);
            return;
        }
        // display it
        displayTimeLeft(secondsLeft);
    }, 1000)
}

function displayTimeLeft(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainderSeconds = seconds % 60;
    const display = `${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;

    timerDisplay.textContent = display;
    document.title = display; // Add the countdown to tab title
}

function displayEndTime(timestamp) {
    const end = new Date(timestamp);

    const hours = end.getHours();
    const minutes = end.getMinutes();

    endTime.textContent = `Be Back At ${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
}


function startTimer() {
    const seconds = parseInt(this.dataset.time); // get and convert data-set value into number
    timer(seconds);
}

buttons.forEach(btn => btn.addEventListener('click', startTimer));

document.customForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const mins = this.minutes.value;
    timer(mins * 60);
    
    this.reset(); // Clear Input

}) // Select by name attribute