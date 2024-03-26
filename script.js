document.addEventListener('DOMContentLoaded', (event) => {
    // Image Sequence Animation
    let frameCount = 147,
        urls = new Array(frameCount).fill().map((o, i) => `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${(i+1).toString().padStart(4, '0')}.jpg`);

    function imageSequence(config) {
        let playhead = { frame: 0 },
            canvas = document.querySelector(config.canvas),
            ctx = canvas.getContext("2d"),
            images = config.urls.map(url => {
                let img = new Image();
                img.src = url;
                return img;
            });

        gsap.to(playhead, {
            frame: frameCount - 1,
            ease: "none",
            onUpdate: () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(images[Math.round(playhead.frame)], 0, 0);
            },
            scrollTrigger: {
                trigger: canvas,
                start: "top top",
                end: "+=3000", // Adjust the length according to your needs
                scrub: true
            }
        });
    }

    imageSequence({
        urls,
        canvas: "#image-sequence"
    });

    // Image Track Dragging and Scrolling
    const track = document.getElementById("image-track");

    const handleOnDown = e => {
        track.dataset.mouseDownAt = e.clientX;
        track.dataset.prevPercentage = track.dataset.percentage || "0";
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
        const nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage || "0") + percentage;
        const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

        track.dataset.percentage = nextPercentage;

        track.animate({
            transform: `translate(${nextPercentage}%, -50%)`
        }, { duration: 1200, fill: "forwards" });

        for (const image of track.getElementsByClassName("image")) {
            image.animate({
                objectPosition: `${100 + nextPercentage}% center`
            }, { duration: 1200, fill: "forwards" });
        }

        if (isScroll) {
            track.dataset.prevPercentage = nextPercentage.toString();
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
