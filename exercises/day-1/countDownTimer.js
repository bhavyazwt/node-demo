let seconds = process.argv[2];

const timer = setInterval(() => {
  console.log(--seconds);
  if (seconds === 0) {
    console.log("Time's Up");
    clearTimer();
  }
}, 1000);

function clearTimer() {
  clearInterval(timer);
}
