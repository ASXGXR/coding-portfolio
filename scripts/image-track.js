document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById("image-track");
  let isTrackMoving = false;
  let movementTimer = null;

  // Modify these values to adjust the slow-down effect
  const animationDuration = 3000;
  const easingFunction = 'ease-out';

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
    }, { duration: animationDuration, fill: "forwards", easing: easingFunction });

    for (const image of track.getElementsByClassName("image")) {
      image.animate({
        objectPosition: `${100 + nextPercentage}% center`
      }, { duration: animationDuration, fill: "forwards", easing: easingFunction });
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

    // Specify easing within the animate function for a smooth halt
    track.animate({
      transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: animationDuration, fill: "forwards", easing: easingFunction });

    for (const image of track.getElementsByClassName("image")) {
      image.animate({
        objectPosition: `${100 + nextPercentage}% center`
      }, { duration: animationDuration, fill: "forwards", easing: easingFunction });
    }

    setTimeout(() => {
      isTrackMoving = false;
      updateCursorStyle();
      showScrollMessage();
    }, animationDuration);
  };


  // Function to update the percentage meter based on the current position
  const updatePercentageMeter = (percentage) => {
    const meter = document.getElementById("percentage-meter");
    const meter2 = document.getElementById("percentage-meter-2");
    const adjustedPercentage = 102 - (percentage + 100);
    const pixelOffset = 25; // Half of the meter's width
    const viewportWidth = window.innerWidth;
    const percentageOffset = (pixelOffset / viewportWidth) * 100;

    const leftPosition = adjustedPercentage - percentageOffset; // Center the meter
    const leftPosition2 = 197 - (percentage + 100) - percentageOffset;

    meter.style.left = `${leftPosition}%`;
    meter2.style.left = `${leftPosition2}%`;
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