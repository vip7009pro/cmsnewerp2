export {};

interface ServiceWorkerGlobalScope extends EventTarget {
  readonly registration: {
    showNotification(title: string, options?: any): Promise<void>;
  };
}

declare const self: ServiceWorkerGlobalScope;


self.addEventListener('push', (event: any) => {
  const options = {
    body: event.data.text(),
  };

  event.waitUntil(
    self.registration.showNotification('Notification Title', options)
  );
});

