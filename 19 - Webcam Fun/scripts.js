const video = document.querySelector(".player");
const canvas = document.querySelector(".photo");
const ctx = canvas.getContext("2d");
const strip = document.querySelector(".strip");
const snap = document.querySelector(".snap");

function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true }) // Get User Video, Returns a Promis
    .then((localMediaStream) => {
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((err) => {
      console.log(`OH NO!! ${err}`);
    });
}

function painToCanvas() {
  // Get Video Size
  const width = video.videoWidth;
  const height = video.videoHeight;

  // Set Canvas Size to Video Size
  canvas.width = width;
  canvas.height = height;

  // Draw video frame every 16ms to canvas
  return setInterval(() => {
    ctx.drawImage(video, 0, 0, width, height);

    // Get Image Pixels
    let pixels = ctx.getImageData(0, 0, width, height);

    // Mess with them
    // pixels = redEffect(pixels);

    // pixels = rgbSplit(pixels);
    // ctx.globalAlpha = 0.2; // Ghosting Effect
    
    pixels = greenScreen(pixels);

    // Put them back
    ctx.putImageData(pixels, 0, 0);
  }, 16);
}

function takePhoto() {
  // played the sound
  snap.currentTime = 0;
  snap.play();

  // take the data out of the canvas
  const data = canvas.toDataURL("image/jpeg"); // Return base64 representation of image

  // Create Download Link to photo
  const link = document.createElement("a");

  link.href = data;
  link.setAttribute("download", "handsome");
  link.innerHTML = `<img src="${data}" alt="Handsome Man" />`;
  strip.insertBefore(link, strip.firstChild);
}

function redEffect(pixels) {
  // Pixels is a special array (designed for large number) therfore doesnt have all the normal array methods
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i + 0] = pixels.data[i + 0] + 100; // Red
    pixels.data[i + 1] = pixels.data[i + 1] - 50; // Green
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i - 150] = pixels.data[i + 0] + 100; // Red
    pixels.data[i + 300] = pixels.data[i + 1] - 50; // Green
    pixels.data[i - 350] = pixels.data[i + 2] * 0.5; // Blue
  }
  return pixels;
}

function greenScreen(pixels) {
  const levels = {};

  document.querySelectorAll(".rgb input").forEach((input) => {
    levels[input.name] = input.value;
  }); // Get Slider values and put into levels Object

  for (let i = 0; i < pixels.data.length; i += 4) {
    // Get rgb pixel
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    // If any pixel is between the r, g, b values specified by the sliders remove them by setting the alpha of the pixel to 0 (transparent)
    if (
      red >= levels.rmin &&
      green >= levels.gmin &&
      blue >= levels.bmin &&
      red <= levels.rmax &&
      green <= levels.gmax &&
      blue <= levels.bmax
    ) {
        pixels.data[i  + 3] = 0; // Make pixel transparent (i.e remove it)
    }
  }
  return pixels;
}

getVideo();
video.addEventListener("canplay", painToCanvas); // When video is up and running run painToCanvas
