// sw.ts

export {};

const swSelf = self as any;

swSelf.addEventListener('push', (event: any) => {
  const options = {
    body: event.data.text(),
  };

  event.waitUntil(
    swSelf.registration.showNotification('Notification Title', options)
  );
});
