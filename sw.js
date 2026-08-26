// ===== SERVICE WORKER =====
const CACHE_NAME = 'album-amor-v1';
const ASSETS = [
    'index.html',
    'style.css',
    'script.js',
    'manifest.json',
    'icons/icon-192.png',
    'icons/icon-512.png'
];

// Instalação
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache aberto');
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Ativação
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - retorna do cache
                if (response) {
                    return response;
                }

                // Clona a requisição
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then((response) => {
                    // Verifica se é uma resposta válida
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clona a resposta
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            // Não armazena imagens grandes (fotos do usuário)
                            if (!event.request.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                                cache.put(event.request, responseToCache);
                            }
                        });

                    return response;
                }).catch(() => {
                    // Offline fallback para páginas
                    if (event.request.mode === 'navigate') {
                        return caches.match('index.html');
                    }
                });
            })
    );
});