function requestNotificationPermission() {
  Notification.requestPermission().then((response) => {
    console.log(response);
  });
}

function createNotification() {
  const icon = "images/icons/Instablam-android-chrome-192x192.png";
  const message = "Welcome to Instablam";

  const notification = new Notification("Instablam", {
    body: message,
    icon: icon,
  });

  notification.addEventListener("click", (event) => {
    window.open("https://localhost:5500/");
  });
}

export { requestNotificationPermission, createNotification };
