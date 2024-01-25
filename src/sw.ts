// sw.ts

self.addEventListener('push', (event: any) => {
  const options = {
    body: event.data.text(),
  };

  event.waitUntil(
    self.registration.showNotification('Notification Title', options)
  );
});
