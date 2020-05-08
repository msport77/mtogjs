var UA = '';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener("message", function(event) {
  UA = event.data;
}, false);

self.addEventListener('push', function (event) {
  if (!(self.Notification && self.Notification.permission === 'granted')) {
    return;
  }

  const sendNotification = params => {
    const notif = JSON.parse(params);
    const title = notif.title;
    const body = notif.body;
    const icon = notif.icon;
    const data = {
      open: notif.data.open,
      click: (UA == 'mobile' ? notif.data.click_mobile : notif.data.click_desktop)
    };

    fetch(data.open);

    return self.registration.showNotification(title, {
      body: body,
      icon: icon,
      data: data
    });
  };

  if (event.data) {
    const message = event.data.text();
    event.waitUntil(sendNotification(message));
  }
});

self.addEventListener('notificationclick', function(event) {
  let url = event.notification.data.click;
  if (url.indexOf('BASE_URL') > -1) {
    url = url.replace('BASE_URL', encodeURIComponent(self.location.origin));
  }
  event.notification.close(); // Android needs explicit close.
  event.waitUntil(
      clients.matchAll({type: 'window'}).then( windowClients => {
          // Open the target URL in a new window/tab.
          if (clients.openWindow) {
              return clients.openWindow(url);
          }
      })
  );
});