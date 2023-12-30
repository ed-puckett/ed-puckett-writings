/* from https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos */

(() => {
    let width, height;

    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.

    let video  = null;
    let canvas = null;

    function startup() {
        video  = document.getElementById("video");
        canvas = document.getElementById("canvas");

        navigator.mediaDevices
            .getUserMedia({ video: true, audio: false })
            .then((stream) => {
                video.srcObject = stream;
                video.play();
            })
            .catch((err) => {
                console.error(`An error occurred: ${err}`);
            });

        video.addEventListener("canplay", (event) => {
            video.style.width  = `${video.videoWidth}px`;
            video.style.height = `${video.videoHeight}px`;
            canvas.style.width  = `${video.videoWidth}px`;
            canvas.style.height = `${video.videoHeight}px`;
            canvas.width  = video.videoWidth;
            canvas.height = video.videoHeight;
            width  = video.videoWidth;
            height = video.videoHeight;
        }, {
            once: true,
        });

        video.addEventListener("timeupdate", (ev) => {
            takepicture();
        });

        clearphoto();
    }

    // Fill the photo with an indication that none has been
    // captured.
    function clearphoto() {
        const context = canvas.getContext("2d");
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.
    let rot = 0;
    function takepicture() {
        const context = canvas.getContext("2d");
        context.globalAlpha = 0.2;
        context.globalCompositeOperation = "source-over";
        context.translate(canvas.width/2, canvas.height/2);
        context.rotate(0.2);
        context.translate(-canvas.width/2, -canvas.height/2);
        context.drawImage(video, 0, 0, width, height);
    }

    startup();
})();
