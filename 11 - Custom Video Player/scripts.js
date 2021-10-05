const player = document.querySelector('.player');
const video = player.querySelector('.viewer');

const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');

const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');

toggle.addEventListener('click', handlePlayButton);
video.addEventListener('click', handlePlayButton);

video.addEventListener('play', updateButton);
video.addEventListener('pause', updateButton);

video.addEventListener('timeupdate', handleProgress);

let mouseDown = false;
progress.addEventListener('click', scrub );

progress.addEventListener('mousemove', scrub );
progress.addEventListener('mousedown', () => mouseDown = true );
progress.addEventListener('mouseup', () => mouseDown = false );
progress.addEventListener('mousedown', (e) => mouseDown && scrub(e))


skipButtons.forEach(skipButton => skipButton.addEventListener("click", handleSkipButton))
ranges.forEach(range => range.addEventListener("change", handleRangeUpdate));
ranges.forEach(range => range.addEventListener("mousemove", handleRangeUpdate));
ranges.forEach(range => range.addEventListener("dblclick", handleRestRangeUpdate)); // Reset lider on reset

async function playVideo() {
    try {
        await video.play();
    } catch (error) {
        console.error(error);
    }
}

function handlePlayButton() {
    if (video.paused) {
        playVideo();
    } else {
        video.pause();
    }
}

function updateButton() {
    toggle.innerHTML = this.paused ? '►' : '❚ ❚'; // this is equal to video
}

function handleSkipButton() {
    video.currentTime += parseFloat(this.dataset.skip); // this is skipButton
}

function handleRangeUpdate() {
    video[this.name] = this.value;
}

function handleRestRangeUpdate() {
    this.value = this.defaultValue
}

function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.flexBasis = `${percent}%`;
}

function scrub(e) {
    const scrubTime = (e.offsetX / progress.offsetWidth) * video.duration;
    video.currentTime = scrubTime;
}