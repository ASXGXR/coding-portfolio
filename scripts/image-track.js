document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById("image-track");
  let isTrackMoving = false;
  let movementTimer = null;

  // Function to update the cursor style
  const updateCursorStyle = () => {
    const cursorStyle = isTrackMoving ? 'grabbing' : 'pointer';
    for (const image of track.getElementsByClassName("image")) {
      image.style.cursor = cursorStyle;
    }
  };

  const showScrollMessage = () => {
    const message = document.getElementById("scroll-message");
    clearTimeout(movementTimer);
    movementTimer = setTimeout(() => {
      message.classList.add("show");
    }, 5000); // 5 seconds
  };

  const hideScrollMessage = () => {
    const message = document.getElementById("scroll-message");
    message.classList.remove("show");
    clearTimeout(movementTimer);
  };

  const handleOnDown = e => {
    hideScrollMessage();
    track.dataset.mouseDownAt = e.clientX;
    isTrackMoving = true;
    updateCursorStyle();
  };

  const handleOnUp = () => {
    showScrollMessage();
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
    isTrackMoving = false;
    updateCursorStyle();
  };

  const handleOnMove = e => {
    if (track.dataset.mouseDownAt === "0") return;
    hideScrollMessage();

    isTrackMoving = true;
    updateCursorStyle();

    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
      maxDelta = window.innerWidth / 2;
    const percentage = (mouseDelta / maxDelta) * -100,
      nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
      nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

    track.dataset.percentage = nextPercentage;
    updatePercentageMeter(nextPercentage);

    track.animate({
      transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: 1200, fill: "forwards" });

    for (const image of track.getElementsByClassName("image")) {
      image.animate({
        objectPosition: `${100 + nextPercentage}% center`
      }, { duration: 1200, fill: "forwards" });
    }
  };

  const handleOnScroll = e => {
    hideScrollMessage();

    isTrackMoving = true;
    updateCursorStyle();

    const delta = e.deltaY || e.detail || e.wheelDelta;
    const scrollStrength = 0.5;
    const maxDelta = window.innerWidth / 2;

    const percentage = (delta * scrollStrength / maxDelta) * -100,
      nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage || 0) + percentage,
      nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

    track.dataset.prevPercentage = nextPercentage;
    track.dataset.percentage = nextPercentage;
    updatePercentageMeter(nextPercentage);

    track.animate({
      transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: 1200, fill: "forwards" });

    for (const image of track.getElementsByClassName("image")) {
      image.animate({
        objectPosition: `${100 + nextPercentage}% center`
      }, { duration: 1200, fill: "forwards" });
    }

    setTimeout(() => {
      isTrackMoving = false;
      updateCursorStyle();
      showScrollMessage(); // Start the timer for showing the message after scrolling stops
    }, 500);
  };

  // Function to update the percentage meter based on the current position
  const updatePercentageMeter = (percentage) => {
    const meter = document.getElementById("percentage-meter");
    const adjustedPercentage = 100 + percentage;
    const leftPosition = adjustedPercentage - (50 / window.innerWidth * 100);
    meter.style.left = `${leftPosition}%`;
  };

  // Event listeners for mouse and touch events
  window.onmousedown = e => handleOnDown(e);
  window.ontouchstart = e => handleOnDown(e.touches[0]);
  window.onmouseup = handleOnUp;
  window.ontouchend = handleOnUp;
  window.onmousemove = e => handleOnMove(e);
  window.ontouchmove = e => handleOnMove(e.touches[0]);
  window.onwheel = e => handleOnScroll(e);
  window.onmousewheel = e => handleOnScroll(e);
  window.onMozMousePixelScroll = e => handleOnScroll(e);

  // Initialize the timer for the scroll message when the page loads
  showScrollMessage();
});