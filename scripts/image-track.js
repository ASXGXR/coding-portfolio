document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById("image-track");
  let isTrackMoving = false;
  let cursorStyle = 'pointer';

  const updateCursorStyle = () => {
    for (const image of track.getElementsByClassName("image")) {
      image.style.cursor = cursorStyle;
    }
  };

  const handleOnDown = (e) => {
    track.dataset.mouseDownAt = e.clientX;
    isTrackMoving = true;
    cursorStyle = 'grabbing';
    requestAnimationFrame(updateCursorStyle);
  };

  const handleOnUp = () => {
    track.dataset.mouseDownAt = "0";
    track.dataset.prevPercentage = track.dataset.percentage;
    isTrackMoving = false;
    cursorStyle = 'pointer';
    requestAnimationFrame(updateCursorStyle);
  };

  const handleOnMove = (e) => {
    if (track.dataset.mouseDownAt === "0") return;
    isTrackMoving = true;
    cursorStyle = 'grabbing';
    requestAnimationFrame(updateCursorStyle);

    const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
      maxDelta = window.innerWidth / 2;
    const percentage = (mouseDelta / maxDelta) * -100,
      nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage,
      nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

    track.dataset.percentage = nextPercentage;
    track.animate({
      transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: 400, fill: "forwards" }); // Decreased animation duration to 400ms

    for (const image of track.getElementsByClassName("image")) {
      image.animate({
        objectPosition: `${100 + nextPercentage}% center`
      }, { duration: 400, fill: "forwards" }); // Decreased animation duration to 400ms
    }
  };

  const handleOnScroll = (e) => {
    isTrackMoving = true;
    cursorStyle = 'grabbing';
    requestAnimationFrame(updateCursorStyle);

    const delta = e.deltaY || e.detail || e.wheelDelta;
    const scrollStrength = 0.5;
    const maxDelta = window.innerWidth / 2;
    const percentage = (delta * scrollStrength / maxDelta) * -100;
    const nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage || 0) + percentage;
    const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

    track.dataset.prevPercentage = nextPercentage;
    track.dataset.percentage = nextPercentage;

    track.animate({
      transform: `translate(${nextPercentage}%, -50%)`
    }, { duration: 400, fill: "forwards" });

    for (const image of track.getElementsByClassName("image")) {
      image.animate({
        objectPosition: `${100 + nextPercentage}% center`
      }, { duration: 400, fill: "forwards" });
    }

    // Update cursor style after the animation is complete
    setTimeout(() => {
      isTrackMoving = false;
      cursorStyle = 'pointer';
      requestAnimationFrame(updateCursorStyle);
    }, 400);
  };

  window.onmousedown = (e) => handleOnDown(e);
  window.ontouchstart = (e) => handleOnDown(e.touches[0]);
  window.onmouseup = handleOnUp;
  window.ontouchend = handleOnUp;
  window.onmousemove = (e) => handleOnMove(e);
  window.ontouchmove = (e) => handleOnMove(e.touches[0]);
  window.onwheel = (e) => handleOnScroll(e);
  window.onmousewheel = (e) => handleOnScroll(e);
  window.onMozMousePixelScroll = (e) => handleOnScroll(e);
});