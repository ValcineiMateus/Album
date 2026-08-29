// ===== SERVICE WORKER =====
const CACHE_NAME = 'album-amor-v2';
const ASSETS = [
    'index.html',
    'style.css',
    'script.js',
    'firebase-config.js',
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
// FIX: antes era "cache primeiro" (só buscava na internet se não achasse no
// cache) — então mesmo com internet, o app continuava servindo a versão
// antiga guardada no aparelho e nunca via as atualizações que você subia
// no Git. Agora é "rede primeiro": sempre tenta buscar a versão mais nova
// online; só usa o que está guardado no aparelho se a pessoa estiver
// offline (sem internet).
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request.clone())
            .then((response) => {
                // Verifica se é uma resposta válida
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clona a resposta e guarda uma cópia atualizada no cache,
                // pra caso a pessoa fique offline mais tarde
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    // Não armazena imagens grandes (fotos do usuário)
                    if (!event.request.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
                        cache.put(event.request, responseToCache);
                    }
                });

                return response;
            })
            .catch(() => {
                // Sem internet: usa o que já está guardado no aparelho
                return caches.match(event.request).then((cached) => {
                    if (cached) return cached;
                    if (event.request.mode === 'navigate') {
                        return caches.match('index.html');
                    }
                });
            })
    );
});