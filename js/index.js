import {
  requestNotificationPermission,
  createNotification,
} from "./notifications.js";
import push from "./push-notifications.js";

// Declare variables

let stream = {};
let revertBtn = document.getElementById("removeFilter");
let downloadBtn = document.getElementById("download");
const canvas = document.getElementById("photo");
let imgUrl;
let previousValue = 0;

// Caman render function

function renderCaman() {
  Caman("#photo", imgUrl, function () {
    this.render();
  });
}
// Filters

// Functions triggered when a single filter starts and finishes rendering.

Caman.Event.listen("processStart", function (job) {
  console.log("Start:", job.name);
});

Caman.Event.listen("processComplete", function (job) {
  console.log("Finished:", job.name);
});

// Change brightness of the image

function changeBrightness(value) {
  Caman("#photo", imgUrl, function (test) {
    console.log(previousValue, value);
    if (value == 0) {
      this.revert();
    }
    console.log(value - previousValue);
    this.brightness(value - previousValue);
    previousValue = value;
    this.render();
  });
}

document.querySelector("#brightness").addEventListener("input", (event) => {
  let newValue = parseInt(event.target.value);
  console.log(event.target.value);
  changeBrightness(newValue);
});

// Change hue of the image

function changeHue(value) {
  Caman("#photo", imgUrl, function (test) {
    if (value == 0) {
      this.revert();
    }
    console.log(value - previousValue);
    this.hue(value - previousValue);
    previousValue = value;
    this.render();
  });
}

document.querySelector("#hue").addEventListener("input", (event) => {
  let newValue = parseInt(event.target.value);
  console.log(event.target.value);
  changeHue(newValue);
});

// Change contrast of the image

function changeContrast(value) {
  Caman("#photo", imgUrl, function (test) {
    if (value == 0) {
      this.revert();
    }
    console.log(value - previousValue);
    this.contrast(value - previousValue);
    previousValue = value;
    this.render();
  });
}

document.querySelector("#contrast").addEventListener("input", (event) => {
  let newValue = parseInt(event.target.value);
  console.log(event.target.value);
  changeContrast(newValue);
});

// Change sepia of the image

function changeSepia(value) {
  Caman("#photo", imgUrl, function (test) {
    if (value == 0) {
      this.revert();
    }
    console.log(value - previousValue);
    this.sepia(value - previousValue);
    previousValue = value;
    this.render();
  });
}

document.querySelector("#sepia").addEventListener("input", (event) => {
  let newValue = parseInt(event.target.value);
  console.log(event.target.value);
  changeSepia(newValue);
});

// Change exposure of the image

function changeExposure(value) {
  Caman("#photo", imgUrl, function (test) {
    if (value == 0) {
      this.revert();
    }
    console.log(value - previousValue);
    this.exposure(value - previousValue);
    previousValue = value;
    this.render();
  });
}

document.querySelector("#exposure").addEventListener("input", (event) => {
  let newValue = parseInt(event.target.value);
  console.log(event.target.value);
  changeExposure(newValue);
});

// change stackBlur

function changestackBlur(value) {
  Caman("#photo", imgUrl, function (test) {
    if (value == 0) {
      this.revert();
    }
    console.log(value - previousValue);
    this.stackBlur(value - previousValue);
    previousValue = value;
    this.render();
  });
}

document.querySelector("#stackBlur").addEventListener("input", (event) => {
  let newValue = parseInt(event.target.value);
  console.log(event.target.value);
  changestackBlur(newValue);
});

//  Capture image

async function captureImage(stream) {
  const mediaTrack = stream.getVideoTracks()[0];
  console.log(mediaTrack);
  const captureImg = new ImageCapture(mediaTrack);
  const photo = await captureImg.takePhoto();
  console.log(photo);
  //fileName = photo;
  imgUrl = URL.createObjectURL(photo);
  console.log(imgUrl);
  setTimeout(() => {
    renderCaman();
  }, 1000);
}

//Remove filters

revertBtn.addEventListener("click", (e) => {
  Caman("#photo", imgUrl, function () {
    this.revert();
  });
});

//Download image

downloadBtn.addEventListener("click", (e) => {
  const link = document.createElement("a");
  link.setAttribute("download", "editedImg.png");

  //get a data-URL of the canvas
  link.href = canvas.toDataURL("image/png", 0.8);

  //  download only when online
  if (!navigator.onLine) {
    link.removeAttribute("download");
    console.log("Download disabled");
    displayOfflineMsg();
  } else {
    e = new MouseEvent("click");
    link.dispatchEvent(e);
    console.log("Downloaded");
  }
});

// Display offline msg-unable to download image when offline.

function displayOfflineMsg() {
  var offline = document.querySelector(".offline");
  if (!navigator.onLine) {
    offline.classList.remove("hide");
    offline.classList.add("show");
  } else {
    offline.classList.remove("show");
    offline.classList.add("hide");
  }
}
// Get video

async function getMedia() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const videoElem = document.querySelector("#me");
    videoElem.srcObject = stream;
    videoElem.addEventListener("loadedmetadata", () => {
      videoElem.play();
      createNotification();
    });
    console.log(stream);
  } catch (error) {
    console.log(error);
  }
}

getMedia();

document.querySelector("#addImage").addEventListener("click", (event) => {
  captureImage(stream);
});

//Registeration of Service Worker

function registrateServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("../sw.js")
      .then((registration) => {
        console.log("Registered service worker");
        push();
      })
      .catch((error) => console.log("Error with register service worker"));
  }
}

registrateServiceWorker();
requestNotificationPermission();
