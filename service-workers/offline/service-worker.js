/* global self, caches, fetch, URL */
'use strict';

const version = '1.0.0.0';
const currentCacheKey = `store-${version}`;
const preCacheItem = [
  '/static/http-unsplash.it-458-354.jpg',
  '/static/app.js',
  '/static/style.css',
  '/offline.html',
  '/'
];

function offline() {
  return caches.match('/offline.html');
}

const installWorker = event => {
  const onInstall = () => {
    return caches
      .open(currentCacheKey)
      .then(cache => cache.addAll(preCacheItem));
  };

  event.waitUntil(onInstall().then(() => self.skipWaiting()));
};

const activateWorker = event => {
  function onActivate() {
    return caches
      .keys()
      .then(cacheKeys => {
        const oldCacheKeys = cacheKeys
          .filter(key => key.indexOf(currentCacheKey) !== 0);

        const deletePromises = oldCacheKeys
          .map(oldKey => caches.delete(oldKey));

        return Promise.all(deletePromises);
      });
  }

  event.waitUntil(onActivate().then(() => self.clients.claim()));
};


function addToCache(request, response) {
  if(response.ok && !request.url.includes('/do-not-cache/')) {
    const copy = response.clone();
    caches
      .open(currentCacheKey)
      .then(cache => cache.put(request, copy));
  }
  return response;
}

const shouldInterceptFetch = event => {
  const request = event.request;
  const isHttpGet = request.method === 'GET';

  const url = new URL(request.url);
  const hasSameOrigin = url.origin === self.location.origin;

  const cachePattern = /(.html|\/static\/)(?!service-worker.js)/;
  const matchesCachePattern = cachePattern.test(url.pathname);

  return isHttpGet && hasSameOrigin && matchesCachePattern;
};

const ignoreFetch = event => !shouldInterceptFetch(event);

const shouldReadFromCacheFirst =
  request => !request.headers.get('Accept').includes('text/html');

const readFromCacheFirst =(event, request) => {
  return loadFromCache(event)
    .catch(() => fetch(request))
      .then(response => addToCache(request, response))
      .catch(() => offline());
};

const readFromNetworkFirst =(event, request) => {
  return fetch(request)
    .then(response => addToCache(request, response))
    .catch(() => loadFromCache(event))
      .catch(() => offline());
};

const onFetch = event => {
  if(ignoreFetch(event)) {
    return;
  }

  const request = event.request;
  const response = shouldReadFromCacheFirst(request)
    ? readFromCacheFirst(event, request)
    : readFromNetworkFirst(event, request);

  event.respondWith(response);
};

function loadFromCache(event) {
  return caches.match(event.request).then(response => {
    // todo: change to catch or something else
    if(!response) {
      throw Error(`${event.request.url} not found in cache`);
    }
    return response;
  });
}

self.addEventListener('install', installWorker);
self.addEventListener('activate', activateWorker);
self.addEventListener('fetch', onFetch);