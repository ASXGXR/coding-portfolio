/* ANIMATION SEQUENCE */

let frameCount = 147,
    urls = new Array(frameCount).fill().map((o, i) => `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${(i+1).toString().padStart(4, '0')}.jpg`);

function imageSequence(config) {
  let playhead = {frame: 0},
      canvas = gsap.utils.toArray(config.canvas)[0] || console.warn("canvas not defined"),
      ctx = canvas.getContext("2d"),
      curFrame = -1,
      onUpdate = config.onUpdate,
      images,
      updateImage = function() {
        let frame = Math.round(playhead.frame);
        if (frame !== curFrame) { // only draw if necessary
          config.clear && ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(images[Math.round(playhead.frame)], 0, 0);
          curFrame = frame;
          onUpdate && onUpdate.call(this, frame, images[frame]);
        }
      };
  images = config.urls.map((url, i) => {
    let img = new Image();
    img.src = url;
    i || (img.onload = updateImage);
    return img;
  });
  return gsap.to(playhead, {
    frame: images.length - 1,
    ease: "none",
    onUpdate: updateImage,
    duration: images.length / (config.fps || 30),
    paused: !!config.paused,
    scrollTrigger: config.scrollTrigger
  });
}

imageSequence({
    urls: urls, // Array of image URLs
    canvas: "#image-sequence", // The <canvas> object to draw images to
    scrollTrigger: {
      trigger: "#animation", // The section to pin and trigger the animation
      start: "top top", // Start pinning at the top of the viewport
      end: "+=" + (frameCount * 3), // End after scrolling (3 pixels per frame)
      scrub: true, // Smooth scrubbing
      pin: true, // Pin the trigger element (#animation section)
      anticipatePin: 1, // Prep for pinning before the scroll reaches the start point
    }
  });


/* IMAGE SCROLLER */

// Image Track ScrollTrigger
gsap.to("#image-track", {
    scrollTrigger: {
        trigger: "#image-track-container",
        start: "center center", // Start pinning when the center of the container hits the center of the viewport
        end: "bottom top",
        scrub: true,
        pin: true,
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    const track = document.getElementById("image-track");

    const handleOnDown = e => {
        track.dataset.mouseDownAt = e.clientX;
        track.dataset.prevPercentage = track.dataset.percentage || "0"; // Ensure prevPercentage is set
    };

    const handleOnUp = () => {
        track.dataset.mouseDownAt = "0";
    };

    const handleOnMove = (e, isScroll = false) => {
        if (!isScroll && track.dataset.mouseDownAt === "0") return;

        const inputX = isScroll ? e : e.clientX;
        const mouseDelta = isScroll ? e : parseFloat(track.dataset.mouseDownAt) - inputX;
        const maxDelta = window.innerWidth / 2;

        const percentage = (mouseDelta / maxDelta) * -100;
        const nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage || "0") + percentage; // Use current or fallback
        const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

        track.dataset.percentage = nextPercentage; // Update current percentage

        track.animate({
            transform: `translate(${nextPercentage}%, -50%)`
        }, { duration: 1200, fill: "forwards" });

        for (const image of track.getElementsByClassName("image")) {
            image.animate({
                objectPosition: `${100 + nextPercentage}% center`
            }, { duration: 1200, fill: "forwards" });
        }

        if (isScroll) {
            track.dataset.prevPercentage = nextPercentage.toString(); // Update prevPercentage after scroll
        }
    };

    const handleScroll = e => {
        const scrollDelta = e.deltaY;
        const scrollFactor = 0.3; // Adjust this value to control scroll sensitivity
        handleOnMove(scrollDelta * scrollFactor, true);
    };

    window.onmousedown = e => handleOnDown(e);
    window.ontouchstart = e => handleOnDown(e.touches[0]);
    window.onmouseup = handleOnUp;
    window.ontouchend = e => handleOnUp(e.changedTouches[0]);
    window.onmousemove = e => handleOnMove(e);
    window.ontouchmove = e => handleOnMove(e.touches[0]);
    window.addEventListener('wheel', handleScroll);
});
