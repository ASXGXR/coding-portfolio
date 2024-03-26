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
        const scrollFactor = 0.5; // Adjust this value to control scroll sensitivity
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
