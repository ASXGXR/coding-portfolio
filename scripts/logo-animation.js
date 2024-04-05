// logo-animation.js

document.addEventListener('DOMContentLoaded', () => {

  let frameCount = 147,
    urls = new Array(frameCount).fill().map((o, i) => `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${(i + 1).toString().padStart(4, '0')}.jpg`);

  imageSequence({
    urls, // Array of image URLs
    canvas: "#image-sequence",
    scrollTrigger: {
      start: 0,   // start at the very top
      end: "max", // entire page
      scrub: true, // important!
    }
  });

  function imageSequence(config) {
    let playhead = { frame: 0 },
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