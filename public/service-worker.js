self.addEventListener('push', event => {
  console.log('push');
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: 'favicon.ico',
      badge: 'favicon.ico'
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });
  
  self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
      clients.openWindow('/')
    );
  });