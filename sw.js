//Lyssnar på event om användaren trycker på stäng på notisen
self.addEventListener("notificationclose", () => {
  console.log("Notification closed");
});

//Lyssnar på event om användaren klickar på notisen
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
});

self.addEventListener("install", (event) => {
  console.log("SW installed at: ", new Date().toLocaleTimeString());
  event.waitUntil(
    caches.open("v1").then((cache) => {
      return cache.addAll([
        "index.html",
        "css/styles.css",
        "js/index.js",
        "offline.html",
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  console.log("SW activated at: ", new Date().toLocaleTimeString());
});

/* self.addEventListener("fetch", (event) => {
      event.respondWith(
        caches.match(event.request).then((response) => {
          if (!navigator.onLine) {
            if (response) {
              return response;
            } else {
              return caches.match(new Request("offline.html"));
            }
            if (event.request.method === "GET") {
              return updateCache(event.request);
            } else {
              return fetch(event.request);
            }
            /*          } else {
                    return updateCache(event.request) 
          }
        })
      );
    }); */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (!navigator.onLine) {
        if (response) {
          return response;
        } else {
          return caches.match(new Request("offline.html"));
        }
      } else {
        if (event.request.method === "GET") {
          return updateCache(event.request);
        } else {
          return fetch(event.request);
        }
      }
    })
  );
});

//Lyssnar efter push notiser
self.addEventListener("push", (event) => {
  if (event.data) {
    createNotification(event.data.text());
  }
});

//Skapar en notifikation med Web notifications API
const createNotification = (text) => {
  self.registration.showNotification("Instablam", {
    body: text,
    icon: "images/icons/Instablam-favicon-32x32.png",
  });
};

async function updateCache(request) {
  return fetch(request).then((response) => {
    //§
    if (response) {
      return caches.open("v1").then((cache) => {
        return cache.put(request, response.clone()).then(() => {
          return response;
        });
      });
    }
  });
}
