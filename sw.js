const CACHE='myfarm-v1';
const FILES=['/my-farm2/','/my-farm2/index.html','/my-farm2/manifest.json'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES).catch(()=>{})));
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch',e=>{
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});

self.addEventListener('push',e=>{
  const data=e.data?e.data.json():{title:'🌿 my farm',body:'تنبيه جديد'};
  e.waitUntil(self.registration.showNotification(data.title||'🌿 my farm',{
    body:data.body||'',
    icon:'/my-farm2/icon.png',
    badge:'/my-farm2/icon.png',
    vibrate:[200,100,200],
    dir:'rtl',
    lang:'ar'
  }));
});

self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(clients.openWindow('/my-farm2/'));
});
