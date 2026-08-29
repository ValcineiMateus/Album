(function () {
    // ===== BIBLIOTECA DE MÚSICAS ONLINE =====
    const MUSIC_LIBRARY = [
        // Românticas
        { name: "Perfect", artist: "Ed Sheeran", category: "Romântica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { name: "All of Me", artist: "John Legend", category: "Romântica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
        { name: "Thinking Out Loud", artist: "Ed Sheeran", category: "Romântica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
        { name: "I Will Always Love You", artist: "Whitney Houston", category: "Romântica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
        { name: "My Heart Will Go On", artist: "Celine Dion", category: "Romântica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
        { name: "Someone Like You", artist: "Adele", category: "Romântica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
        { name: "Make You Feel My Love", artist: "Adele", category: "Romântica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
        { name: "A Thousand Years", artist: "Christina Perri", category: "Romântica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
        { name: "Just the Way You Are", artist: "Bruno Mars", category: "Romântica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
        { name: "Marry Me", artist: "Train", category: "Romântica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },

        // Animadas
        { name: "Happy", artist: "Pharrell Williams", category: "Animada", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3" },
        { name: "Can't Stop the Feeling", artist: "Justin Timberlake", category: "Animada", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3" },
        { name: "Shake It Off", artist: "Taylor Swift", category: "Animada", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3" },
        { name: "Uptown Funk", artist: "Mark Ronson", category: "Animada", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3" },
        { name: "Dancing Queen", artist: "ABBA", category: "Animada", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" },

        // Clássicas
        { name: "Canon in D", artist: "Pachelbel", category: "Clássica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3" },
        { name: "Clair de Lune", artist: "Debussy", category: "Clássica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3" },
        { name: "Für Elise", artist: "Beethoven", category: "Clássica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-18.mp3" },
        { name: "Nocturne Op. 9 No. 2", artist: "Chopin", category: "Clássica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-19.mp3" },
        { name: "Moonlight Sonata", artist: "Beethoven", category: "Clássica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-20.mp3" },

        // Modernas
        { name: "Blinding Lights", artist: "The Weeknd", category: "Moderna", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-21.mp3" },
        { name: "Levitating", artist: "Dua Lipa", category: "Moderna", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-22.mp3" },
        { name: "Save Your Tears", artist: "The Weeknd", category: "Moderna", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-23.mp3" },
        { name: "Watermelon Sugar", artist: "Harry Styles", category: "Moderna", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-24.mp3" },
        { name: "Drivers License", artist: "Olivia Rodrigo", category: "Moderna", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-25.mp3" },
        { name: "As It Was", artist: "Harry Styles", category: "Moderna", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-26.mp3" },
        { name: "About Damn Time", artist: "Lizzo", category: "Moderna", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-27.mp3" },
        { name: "Heat Waves", artist: "Glass Animals", category: "Moderna", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-28.mp3" },
        { name: "Stay", artist: "The Kid LAROI", category: "Moderna", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-29.mp3" },
        { name: "Good 4 U", artist: "Olivia Rodrigo", category: "Moderna", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-30.mp3" }
    ];

    // ===== ESTADO =====
    let groups = [];
    let currentEditId = null;
    let isNightMode = false;
    let showStats = true;
    let previewAudio = null;

    // Estado do lightbox
    let lightboxImages = [];
    let lightboxCurrentIndex = 0;
    let lightboxGroups = [];

    // ===== DOM REFS =====
    const grid = document.getElementById('albumGrid');
    const emptyMsg = document.getElementById('emptyMessage');
    const timelineScroll = document.getElementById('timelineScroll');
    const filterMonth = document.getElementById('filterMonth');
    const filterYear = document.getElementById('filterYear');
    const filterStats = document.getElementById('filterStats');
    const btnClearFilter = document.getElementById('btnClearFilter');
    const modal = document.getElementById('editModal');
    const editText = document.getElementById('editText');
    const editDate = document.getElementById('editDate');
    const editMusic = document.getElementById('editMusic');
    const editCustomMusic = document.getElementById('editCustomMusic');
    const customMusicDiv = document.getElementById('customMusicDiv');
    const musicLibrary = document.getElementById('musicLibrary');
    const musicSearch = document.getElementById('musicSearch');
    const btnSave = document.getElementById('btnSaveEdit');
    const btnCancel = document.getElementById('btnCancelEdit');
    const btnAdd = document.getElementById('btnAddPhotos');
    const btnNight = document.getElementById('btnToggleNight');
    const btnToggleStats = document.getElementById('btnToggleStats');
    const statsPanel = document.getElementById('statsPanel');
    const btnFilterMenu = document.getElementById('btnFilterMenu');
    const filterDropdown = document.getElementById('filterDropdown');
    const body = document.body;

    // Referência da coleção de "dias" (grupos de fotos) no Firestore
    const groupsCollection = db.collection('groups');

    // Data em que vocês começaram a namorar — usada pelo contador "Juntos há"
    const TOGETHER_SINCE = new Date(2026, 5, 16, 0, 0, 0); // mês 5 = junho (contagem começa em 0)

    // ===== SALVAR / CARREGAR PREFERÊNCIAS (por aparelho) =====
    // Modo noturno e mostrar/ocultar estatísticas são preferências de cada
    // aparelho, então continuam no localStorage. Os grupos de fotos (texto,
    // data, música, imagens) agora moram no Firestore — veja
    // subscribeToGroups() logo abaixo, que substitui o antigo loadData/saveData
    // dos grupos e mantém todos os aparelhos sincronizados em tempo real.
    function savePreferences() {
        localStorage.setItem('albumNightMode_v5', JSON.stringify(isNightMode));
        localStorage.setItem('albumShowStats_v5', JSON.stringify(showStats));
    }

    function loadPreferences() {
        const night = localStorage.getItem('albumNightMode_v5');
        if (night !== null) {
            isNightMode = JSON.parse(night);
            if (isNightMode) body.classList.add('night-mode');
        }

        const stats = localStorage.getItem('albumShowStats_v5');
        if (stats !== null) {
            showStats = JSON.parse(stats);
            if (!showStats) statsPanel.classList.add('hidden');
        }
    }

    // Escuta o Firestore em tempo real: sempre que qualquer aparelho
    // adiciona, edita ou remove um dia, todos os outros recebem a
    // atualização automaticamente, sem precisar recarregar a página.
    function subscribeToGroups() {
        groupsCollection.orderBy('createdAt', 'asc').onSnapshot((snapshot) => {
            groups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            render();
        }, (error) => {
            console.error('Erro ao sincronizar com o Firebase:', error);
            alert('Não foi possível conectar ao banco de dados. Verifique sua internet ou as configurações do Firebase.');
        });
    }

    // ===== FUNÇÕES AUXILIARES =====
    function formatDate(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return `${parts[2]} ${meses[parseInt(parts[1]) - 1]} ${parts[0]}`;
    }

    function getMonthYear(dateStr) {
        if (!dateStr) return null;
        const parts = dateStr.split('-');
        if (parts.length !== 3) return null;
        return { month: parseInt(parts[1]), year: parseInt(parts[0]) };
    }

    function getMonthName(m) {
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
        return meses[m - 1] || m;
    }

    function getGridClass(count) {
        if (count <= 1) return 'grid-1';
        if (count === 2) return 'grid-2';
        if (count === 3) return 'grid-3';
        if (count === 4) return 'grid-4';
        if (count === 5) return 'grid-5';
        return 'grid-6';
    }

    function getMusicName(url) {
        if (!url) return 'Nenhuma';
        const found = MUSIC_LIBRARY.find(m => m.url === url);
        if (found) return `${found.name} - ${found.artist}`;
        return '🎵 Personalizada';
    }

    // Garante que existe uma <option> no <select id="editMusic"> com essa URL.
    // O select do HTML só vem com as opções "" e "custom" — sem isso, o navegador
    // não consegue selecionar uma música da biblioteca (o .value fica vazio).
    function ensureMusicOption(music) {
        let opt = editMusic.querySelector(`option[value="${CSS.escape(music.url)}"]`);
        if (!opt) {
            opt = document.createElement('option');
            opt.value = music.url;
            opt.textContent = `${music.name} - ${music.artist}`;
            opt.hidden = true;
            editMusic.appendChild(opt);
        }
        return opt;
    }

    // ===== CONTADOR "JUNTOS HÁ" =====
    function updateTogetherCounter() {
        const now = new Date();

        let years = now.getFullYear() - TOGETHER_SINCE.getFullYear();
        let months = now.getMonth() - TOGETHER_SINCE.getMonth();
        let days = now.getDate() - TOGETHER_SINCE.getDate();
        let hours = now.getHours() - TOGETHER_SINCE.getHours();
        let minutes = now.getMinutes() - TOGETHER_SINCE.getMinutes();
        let seconds = now.getSeconds() - TOGETHER_SINCE.getSeconds();

        // "Empresta" da casa da esquerda sempre que um valor fica negativo,
        // igual quando fazemos conta de subtração com "vai um"
        if (seconds < 0) { seconds += 60; minutes--; }
        if (minutes < 0) { minutes += 60; hours--; }
        if (hours < 0) { hours += 24; days--; }
        if (days < 0) {
            const diasDoMesAnterior = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            days += diasDoMesAnterior;
            months--;
        }
        if (months < 0) { months += 12; years--; }

        document.getElementById('counterYears').textContent = years;
        document.getElementById('counterMonths').textContent = months;
        document.getElementById('counterDays').textContent = days;
        document.getElementById('counterHours').textContent = String(hours).padStart(2, '0');
        document.getElementById('counterMinutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('counterSeconds').textContent = String(seconds).padStart(2, '0');
    }

    // ===== EXTRAIR DADOS PARA FILTROS =====
    function getAvailableFilters() {
        const months = new Set();
        const years = new Set();
        groups.forEach(g => {
            if (g.date) {
                const my = getMonthYear(g.date);
                if (my) {
                    months.add(my.month);
                    years.add(my.year);
                }
            }
        });
        return {
            months: Array.from(months).sort((a, b) => a - b),
            years: Array.from(years).sort((a, b) => b - a)
        };
    }

    // ===== POPULAR FILTROS =====
    function populateFilters() {
        const { months, years } = getAvailableFilters();

        const currentMonth = filterMonth.value;
        filterMonth.innerHTML = '<option value="all">Todos os meses</option>';
        months.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = getMonthName(m);
            filterMonth.appendChild(opt);
        });
        if (months.includes(parseInt(currentMonth))) filterMonth.value = currentMonth;

        const currentYear = filterYear.value;
        filterYear.innerHTML = '<option value="all">Todos os anos</option>';
        years.forEach(y => {
            const opt = document.createElement('option');
            opt.value = y;
            opt.textContent = y;
            filterYear.appendChild(opt);
        });
        if (years.includes(parseInt(currentYear))) filterYear.value = currentYear;
    }

    // ===== FILTRAR GRUPOS =====
    function getFilteredGroups() {
        const month = parseInt(filterMonth.value);
        const year = parseInt(filterYear.value);
        const filterMonthVal = isNaN(month) ? 'all' : month;
        const filterYearVal = isNaN(year) ? 'all' : year;

        return groups.filter(g => {
            if (!g.date) return true;
            const my = getMonthYear(g.date);
            if (!my) return true;
            let match = true;
            if (filterMonthVal !== 'all' && my.month !== filterMonthVal) match = false;
            if (filterYearVal !== 'all' && my.year !== filterYearVal) match = false;
            return match;
        });
    }

    // ===== ATUALIZAR ESTATÍSTICAS =====
    function updateStats() {
        const allGroups = groups;
        const totalGroups = allGroups.length;
        const totalPhotos = allGroups.reduce((acc, g) => acc + g.images.length, 0);
        const monthsWithPhotos = new Set();
        const withMusic = allGroups.filter(g => g.music && g.music.trim() !== '').length;

        let earliestDate = null;
        let latestDate = null;

        allGroups.forEach(g => {
            if (g.date) {
                const my = getMonthYear(g.date);
                if (my) monthsWithPhotos.add(`${my.year}-${my.month}`);
                if (!earliestDate || g.date < earliestDate) earliestDate = g.date;
                if (!latestDate || g.date > latestDate) latestDate = g.date;
            }
        });

        let daysDiff = 0;
        if (earliestDate && latestDate) {
            const start = new Date(earliestDate);
            const end = new Date(latestDate);
            daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        }

        const avgPhotos = totalGroups > 0 ? (totalPhotos / totalGroups).toFixed(1) : 0;

        document.getElementById('statGroups').textContent = totalGroups;
        document.getElementById('statPhotos').textContent = totalPhotos;
        document.getElementById('statMonths').textContent = monthsWithPhotos.size;
        document.getElementById('statPeriod').textContent = daysDiff;
        document.getElementById('statAvgPhotos').textContent = avgPhotos;
        document.getElementById('statWithMusic').textContent = withMusic;

        // Gráfico de barras - fotos por mês
        // FIX: a chave de ordenação agora é "AAAA-MM" (numérica), não o nome do mês em texto.
        // Antes, a ordenação comparava "Abr" com "Jan" como texto e saía fora de ordem cronológica.
        const monthData = {};
        allGroups.forEach(g => {
            if (g.date) {
                const my = getMonthYear(g.date);
                if (my) {
                    const sortKey = `${my.year}-${String(my.month).padStart(2, '0')}`;
                    if (!monthData[sortKey]) {
                        monthData[sortKey] = { label: `${getMonthName(my.month)}/${my.year}`, count: 0 };
                    }
                    monthData[sortKey].count += g.images.length;
                }
            }
        });

        const sortedKeys = Object.keys(monthData).sort();
        const maxMonthPhotos = Math.max(...sortedKeys.map(k => monthData[k].count), 1);
        const monthlyBars = document.getElementById('monthlyBars');
        monthlyBars.innerHTML = '';
        sortedKeys.slice(-6).forEach(key => {
            const { label, count } = monthData[key];
            const pct = (count / maxMonthPhotos) * 100;
            const div = document.createElement('div');
            div.className = 'bar-item';
            div.innerHTML = `
                    <span class="bar-label">${label}</span>
                    <div class="bar-track">
                        <div class="bar-fill" style="width:${pct}%"></div>
                    </div>
                    <span class="bar-value">${count}</span>
                `;
            monthlyBars.appendChild(div);
        });

        // Gráfico de músicas
        const musicBars = document.getElementById('musicBars');
        musicBars.innerHTML = '';
        const withMusicCount = withMusic;
        const withoutMusicCount = totalGroups - withMusicCount;
        const maxMusic = Math.max(withMusicCount, withoutMusicCount, 1);

        [
            { label: '🎵 Com música', count: withMusicCount },
            { label: '🔇 Sem música', count: withoutMusicCount }
        ].forEach(item => {
            const pct = (item.count / maxMusic) * 100;
            const div = document.createElement('div');
            div.className = 'bar-item';
            div.innerHTML = `
                    <span class="bar-label">${item.label}</span>
                    <div class="bar-track">
                        <div class="bar-fill" style="width:${pct}%;background:${item.count > 0 ? 'linear-gradient(90deg, #4a7a6b, #7ab8a0)' : '#ccc'}"></div>
                    </div>
                    <span class="bar-value">${item.count}</span>
                `;
            musicBars.appendChild(div);
        });
    }

    // ===== RENDERIZAR BIBLIOTECA DE MÚSICAS =====
    function renderMusicLibrary(searchTerm = '') {
        musicLibrary.innerHTML = '';

        let filtered = MUSIC_LIBRARY;
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase().trim();
            filtered = MUSIC_LIBRARY.filter(m =>
                m.name.toLowerCase().includes(term) ||
                m.artist.toLowerCase().includes(term) ||
                m.category.toLowerCase().includes(term)
            );
        }

        const categories = {};
        filtered.forEach(m => {
            if (!categories[m.category]) categories[m.category] = [];
            categories[m.category].push(m);
        });

        Object.keys(categories).forEach(cat => {
            const catDiv = document.createElement('div');
            catDiv.className = 'music-category';
            catDiv.textContent = cat;
            musicLibrary.appendChild(catDiv);

            categories[cat].forEach(music => {
                const item = document.createElement('div');
                item.className = 'music-item';

                const currentMusic = editMusic.value;
                if (music.url === currentMusic) {
                    item.classList.add('selected');
                }

                const info = document.createElement('div');
                info.innerHTML = `
                        <div class="name">${music.name}</div>
                        <div class="artist">${music.artist}</div>
                    `;

                const previewBtn = document.createElement('button');
                previewBtn.className = 'preview-btn';
                previewBtn.textContent = '▶️';
                previewBtn.title = 'Prévia da música';
                previewBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    previewMusic(music.url);
                });

                item.appendChild(info);
                item.appendChild(previewBtn);

                item.addEventListener('click', () => {
                    // FIX: o <select> só tem as opções "" e "custom" no HTML.
                    // Tentar colocar a URL da música direto em editMusic.value não
                    // funcionava (o navegador ignora valores sem <option> correspondente
                    // e o .value volta a ficar vazio) — então a escolha da biblioteca
                    // era perdida silenciosamente ao salvar. Agora criamos essa <option>
                    // dinamicamente antes de selecionar.
                    ensureMusicOption(music);
                    editMusic.value = music.url;
                    customMusicDiv.style.display = 'none';
                    document.querySelectorAll('.music-item').forEach(el => el.classList.remove('selected'));
                    item.classList.add('selected');
                    const label = document.querySelector('label[for="editMusic"]');
                    if (label) {
                        label.textContent = `🎵 Música selecionada: ${music.name} - ${music.artist}`;
                    }
                });

                musicLibrary.appendChild(item);
            });
        });

        if (filtered.length === 0) {
            const empty = document.createElement('div');
            empty.style.cssText = 'text-align:center;padding:20px;opacity:0.5;font-size:0.9rem;';
            empty.textContent = '🔍 Nenhuma música encontrada';
            musicLibrary.appendChild(empty);
        }
    }

    // ===== PRÉVIA DA MÚSICA =====
    function previewMusic(url) {
        if (previewAudio) {
            previewAudio.pause();
            previewAudio = null;
        }

        previewAudio = new Audio(url);
        previewAudio.volume = 0.3;
        previewAudio.play().catch(e => console.log('Preview não disponível'));

        setTimeout(() => {
            if (previewAudio) {
                previewAudio.pause();
                previewAudio.currentTime = 0;
                previewAudio = null;
            }
        }, 5000);

        document.querySelectorAll('.preview-btn').forEach(btn => {
            btn.textContent = '▶️';
        });
        const clickedBtn = Array.from(document.querySelectorAll('.preview-btn')).find(
            btn => btn.closest('.music-item').querySelector('.name')?.textContent ===
                MUSIC_LIBRARY.find(m => m.url === url)?.name
        );
        if (clickedBtn) {
            clickedBtn.textContent = '⏹️';
            setTimeout(() => { clickedBtn.textContent = '▶️'; }, 5000);
        }
    }

    // ===== DETECTAR TIPO DE MÚSICA =====
    function detectMusicType(url) {
        if (!url) return 'none';
        if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
        if (url.includes('spotify.com')) return 'spotify';
        if (url.includes('soundcloud.com')) return 'soundcloud';
        if (url.match(/\.(mp3|wav|ogg|m4a)$/i)) return 'mp3';
        return 'custom';
    }

    function getMusicEmbed(url) {
        const type = detectMusicType(url);

        if (type === 'youtube') {
            let videoId = '';
            if (url.includes('youtube.com/watch?v=')) {
                videoId = url.split('v=')[1]?.split('&')[0] || '';
            } else if (url.includes('youtu.be/')) {
                videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
            } else if (url.includes('youtube.com/embed/')) {
                videoId = url.split('embed/')[1]?.split('?')[0] || '';
            }

            if (videoId) {
                return {
                    type: 'youtube',
                    html: `<iframe src="https://www.youtube.com/embed/${videoId}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                };
            }
        }

        if (type === 'spotify') {
            let trackId = '';
            if (url.includes('spotify.com/track/')) {
                trackId = url.split('track/')[1]?.split('?')[0] || '';
            } else if (url.includes('spotify.com/embed/track/')) {
                trackId = url.split('track/')[1]?.split('?')[0] || '';
            }

            if (trackId) {
                return {
                    type: 'spotify',
                    html: `<iframe src="https://open.spotify.com/embed/track/${trackId}" allow="encrypted-media"></iframe>`
                };
            }
        }

        if (type === 'soundcloud') {
            return {
                type: 'soundcloud',
                html: `<iframe width="100%" height="120" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%237a3b4a&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false"></iframe>`
            };
        }

        if (type === 'mp3' || type === 'custom') {
            // FIX: antes o <source> vinha sempre com type="audio/mpeg", mesmo para
            // arquivos .wav, .ogg ou .m4a. Isso faz alguns navegadores recusarem
            // tocar o áudio por o tipo declarado não bater com o real.
            // Agora deixamos o navegador detectar o formato sozinho pelo cabeçalho
            // do arquivo, o que é mais confiável (principalmente com links que têm
            // parâmetros depois da extensão, tipo "musica.mp3?token=123").
            return {
                type: 'mp3',
                html: `<audio controls style="width:100%;"><source src="${url}">Seu navegador não suporta áudio.</audio>`
            };
        }

        return null;
    }

    // O Firestore usa ids em texto (não números), então não dá mais pra
    // ordenar por "a.id - b.id" como antes. Usamos a data de criação
    // (createdAt) guardada em cada documento.
    function getGroupTimestamp(g) {
        return (g.createdAt && typeof g.createdAt.toMillis === 'function') ? g.createdAt.toMillis() : 0;
    }

    // ===== RENDERIZAR =====
    function render() {
        const filtered = getFilteredGroups();
        const sorted = [...filtered].sort((a, b) => {
            if (a.date && b.date) return a.date.localeCompare(b.date);
            if (a.date) return -1;
            if (b.date) return 1;
            return getGroupTimestamp(a) - getGroupTimestamp(b);
        });

        const totalFotos = sorted.reduce((acc, g) => acc + (g.images ? g.images.length : 0), 0);
        filterStats.textContent = `📸 ${sorted.length} ${sorted.length === 1 ? 'grupo' : 'grupos'} (${totalFotos} fotos)`;

        grid.innerHTML = '';
        if (sorted.length === 0) {
            grid.appendChild(emptyMsg);
        } else {
            sorted.forEach((group, idx) => {
                const card = document.createElement('div');
                card.className = 'photo-card';
                if (group.frameBg) card.style.backgroundColor = group.frameBg;
                if (group.frameBorder) card.style.borderColor = group.frameBorder;

                const badge = document.createElement('div');
                badge.className = 'photo-badge';
                badge.textContent = `#${idx + 1}`;

                const countBadge = document.createElement('div');
                countBadge.className = 'photo-count-badge';
                countBadge.textContent = `📷 ${group.images.length}`;

                const photoGrid = document.createElement('div');
                const gridClass = getGridClass(group.images.length);
                photoGrid.className = `photo-grid ${gridClass}`;

                // FIX: antes havia dois listeners de clique — um abria a imagem em nova aba
                // e outro montava os dados do lightbox mas nunca chamava openLightbox().
                // As imagens também só eram adicionadas ao grid dentro desse listener quebrado.
                // Agora a imagem é adicionada ao grid na hora, e o clique abre o lightbox de verdade.
                group.images.forEach(imgData => {
                    const img = document.createElement('img');
                    img.src = imgData;
                    img.alt = group.text || 'Foto';
                    img.loading = 'lazy';
                    img.addEventListener('click', () => {
                        const allImages = group.images;
                        const currentIndex = allImages.indexOf(imgData);
                        const groupData = allImages.map(() => ({
                            text: group.text,
                            date: group.date
                        }));
                        openLightbox(allImages, currentIndex, groupData);
                    });
                    photoGrid.appendChild(img);
                });

                const info = document.createElement('div');
                info.className = 'photo-info';

                const textP = document.createElement('div');
                textP.className = 'photo-text';
                textP.textContent = group.text || '📷 Sem legenda';
                if (group.frameTextColor) textP.style.color = group.frameTextColor;

                const dateP = document.createElement('div');
                dateP.className = 'photo-date';
                dateP.textContent = group.date ? `📅 ${formatDate(group.date)}` : '📅 Sem data';
                if (group.frameTextColor) dateP.style.color = group.frameTextColor;

                info.appendChild(textP);
                info.appendChild(dateP);

                // Player de música
                if (group.music && group.music.trim() !== '') {
                    const player = document.createElement('div');
                    player.className = 'music-player';

                    const label = document.createElement('div');
                    label.className = 'music-label';

                    const musicEmbed = getMusicEmbed(group.music);

                    if (musicEmbed) {
                        label.textContent = `🎵 ${getMusicName(group.music)}`;

                        const embedDiv = document.createElement('div');
                        embedDiv.className = `music-player-embed ${musicEmbed.type}`;
                        embedDiv.innerHTML = musicEmbed.html;

                        player.appendChild(label);
                        player.appendChild(embedDiv);
                    } else {
                        label.textContent = `🎵 ${getMusicName(group.music)}`;
                        const link = document.createElement('a');
                        link.href = group.music;
                        link.target = '_blank';
                        link.textContent = ' 🔗 Abrir música';
                        link.style.cssText = 'font-size:0.8rem;color:#7a3b4a;text-decoration:none;';
                        player.appendChild(label);
                        player.appendChild(link);
                    }

                    info.appendChild(player);
                }

                const actions = document.createElement('div');
                actions.className = 'edit-actions';

                const btnEdit = document.createElement('button');
                btnEdit.textContent = '✏️ Editar Dia';
                btnEdit.addEventListener('click', () => openEditModal(group.id));

                const btnAddMore = document.createElement('button');
                btnAddMore.textContent = '➕ Add Fotos';
                btnAddMore.style.background = '#4a7a6b';
                btnAddMore.style.color = 'white';
                btnAddMore.addEventListener('click', () => addMorePhotos(group.id));

                const btnRemove = document.createElement('button');
                btnRemove.textContent = '🗑️ Remover';
                btnRemove.className = 'btn-remove';
                btnRemove.addEventListener('click', () => removeGroup(group.id));

                actions.appendChild(btnEdit);
                actions.appendChild(btnAddMore);
                actions.appendChild(btnRemove);

                const frameControls = document.createElement('div');
                frameControls.className = 'frame-controls';

                const colors = [
                    { label: 'Fundo', key: 'frameBg', default: '#f7faf7' },
                    { label: 'Borda', key: 'frameBorder', default: '#dce8dc' },
                    { label: 'Texto', key: 'frameTextColor', default: '#2d1b1b' }
                ];

                colors.forEach(c => {
                    const label = document.createElement('label');
                    label.textContent = c.label + ':';
                    const input = document.createElement('input');
                    input.type = 'color';
                    input.value = group[c.key] || c.default;

                    // 'input' dispara a cada movimento no seletor de cor — usamos
                    // só para a pré-visualização instantânea na tela.
                    input.addEventListener('input', (e) => {
                        if (c.key === 'frameBg') card.style.backgroundColor = e.target.value;
                        if (c.key === 'frameBorder') card.style.borderColor = e.target.value;
                        if (c.key === 'frameTextColor') {
                            textP.style.color = e.target.value;
                            dateP.style.color = e.target.value;
                        }
                    });

                    // 'change' dispara só quando a pessoa termina de escolher a cor —
                    // é aí que gravamos no Firestore, pra não lotar de gravações.
                    input.addEventListener('change', (e) => {
                        groupsCollection.doc(group.id).update({ [c.key]: e.target.value })
                            .catch(err => alert('Erro ao salvar a cor: ' + err.message));
                    });

                    frameControls.appendChild(label);
                    frameControls.appendChild(input);
                });

                card.appendChild(badge);
                card.appendChild(countBadge);
                card.appendChild(photoGrid);
                card.appendChild(info);
                card.appendChild(actions);
                card.appendChild(frameControls);
                grid.appendChild(card);
            });
        }

        renderTimeline(sorted);
        populateFilters();
        updateStats();
    }

    // ===== TIMELINE =====
    function renderTimeline(filteredGroups) {
        timelineScroll.innerHTML = '';

        const groupsData = {};
        filteredGroups.forEach(g => {
            if (!g.date) return;
            const my = getMonthYear(g.date);
            if (!my) return;
            const key = `${my.year}-${String(my.month).padStart(2, '0')}`;
            if (!groupsData[key]) {
                groupsData[key] = { year: my.year, month: my.month, count: 0, fotos: 0 };
            }
            groupsData[key].count++;
            groupsData[key].fotos += g.images.length;
        });

        const keys = Object.keys(groupsData).sort();
        if (keys.length === 0) {
            const empty = document.createElement('div');
            empty.style.cssText = 'padding:20px;opacity:0.5;font-size:0.9rem;';
            empty.textContent = 'Adicione grupos com data para ver a linha do tempo';
            timelineScroll.appendChild(empty);
            return;
        }

        keys.forEach(key => {
            const g = groupsData[key];
            const item = document.createElement('div');
            item.className = 'timeline-item';

            const dot = document.createElement('div');
            dot.className = 'timeline-dot';

            const monthLabel = document.createElement('div');
            monthLabel.className = 'month-label';
            monthLabel.textContent = getMonthName(g.month);

            const yearLabel = document.createElement('div');
            yearLabel.className = 'year-label';
            yearLabel.textContent = g.year;

            const badge = document.createElement('div');
            badge.className = 'count-badge';
            badge.textContent = `${g.count} 📷${g.fotos}`;

            item.appendChild(dot);
            item.appendChild(monthLabel);
            item.appendChild(yearLabel);
            item.appendChild(badge);

            item.addEventListener('click', () => {
                filterMonth.value = g.month;
                filterYear.value = g.year;
                render();
                document.querySelector('.album-header').scrollIntoView({ behavior: 'smooth' });
            });

            timelineScroll.appendChild(item);
        });
    }

    // Sobe uma lista de arquivos para o Firebase Storage e adiciona as URLs
    // resultantes no campo "images" do dia (documento) já existente.
    async function uploadPhotosToGroup(groupId, files) {
        const urls = [];
        for (const file of files) {
            const caminho = `photos/${groupId}/${Date.now()}-${file.name}`;
            const ref = storage.ref(caminho);
            await ref.put(file);
            const url = await ref.getDownloadURL();
            urls.push(url);
        }
        await groupsCollection.doc(groupId).update({
            images: firebase.firestore.FieldValue.arrayUnion(...urls)
        });
    }

    // ===== ADICIONAR FOTOS =====
    function addPhotos() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = async function (e) {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;

            const textoOriginal = btnAdd.textContent;
            btnAdd.disabled = true;
            btnAdd.textContent = '⏳ Enviando...';

            try {
                // Cria o "dia" no banco de dados primeiro, ainda sem fotos
                const novoDoc = await groupsCollection.add({
                    text: '',
                    date: '',
                    music: '',
                    frameBg: '#f7faf7',
                    frameBorder: '#dce8dc',
                    frameTextColor: '#2d1b1b',
                    images: [],
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                await uploadPhotosToGroup(novoDoc.id, files);
                setTimeout(() => openEditModal(novoDoc.id), 400);
            } catch (err) {
                alert('Erro ao enviar as fotos: ' + err.message);
            } finally {
                btnAdd.disabled = false;
                btnAdd.textContent = textoOriginal;
            }
        };
        input.click();
    }

    // ===== ADICIONAR MAIS FOTOS =====
    function addMorePhotos(groupId) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = async function (e) {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;

            try {
                await uploadPhotosToGroup(groupId, files);
            } catch (err) {
                alert('Erro ao enviar as fotos: ' + err.message);
            }
        };
        input.click();
    }

    // ===== REMOVER GRUPO =====
    async function removeGroup(id) {
        const group = groups.find(g => g.id === id);
        if (!group) return;
        if (!confirm(`Remover este dia (${group.images.length} fotos)?`)) return;

        try {
            // Apaga as fotos do Storage (melhor esforço — se uma falhar,
            // seguimos removendo as outras e o registro do dia mesmo assim)
            await Promise.all((group.images || []).map(url =>
                storage.refFromURL(url).delete().catch(() => {})
            ));
            await groupsCollection.doc(id).delete();
        } catch (err) {
            alert('Erro ao remover: ' + err.message);
        }
    }

    // ===== MODAL =====
    function openEditModal(id) {
        const group = groups.find(g => g.id === id);
        if (!group) return;
        currentEditId = id;
        editText.value = group.text || '';
        editDate.value = group.date || '';

        const musicSelect = editMusic;
        const label = document.querySelector('label[for="editMusic"]');

        if (group.music) {
            const found = MUSIC_LIBRARY.find(m => m.url === group.music);
            if (found) {
                // FIX: antes o rótulo sempre voltava a mostrar "🎵 Música do Dia"
                // (genérico), mesmo quando já havia uma música da biblioteca
                // escolhida — porque a página recém-carregada ainda não tinha a
                // <option> daquela URL, então editMusic.value ficava vazio e a
                // seleção "sumia" visualmente (o áudio continuava tocando certo,
                // só a tela de edição não mostrava qual era).
                ensureMusicOption(found);
                musicSelect.value = found.url;
                customMusicDiv.style.display = 'none';
                if (label) label.textContent = `🎵 Música selecionada: ${found.name} - ${found.artist}`;
            } else {
                musicSelect.value = 'custom';
                customMusicDiv.style.display = 'block';
                editCustomMusic.value = group.music;
                if (label) label.textContent = '🎵 Música do Dia (URL personalizada)';
            }
        } else {
            musicSelect.value = '';
            customMusicDiv.style.display = 'none';
            if (label) label.textContent = '🎵 Música do Dia';
        }

        renderMusicLibrary(musicSearch.value);

        modal.classList.remove('hidden');
        editText.focus();
    }

    function saveEdit() {
        if (currentEditId === null) return;

        let music = '';
        const musicSelect = editMusic.value;
        if (musicSelect === 'custom') {
            music = editCustomMusic.value.trim();
        } else if (musicSelect !== '') {
            music = musicSelect;
        }

        groupsCollection.doc(currentEditId).update({
            text: editText.value.trim(),
            date: editDate.value,
            music: music
        }).catch(err => alert('Erro ao salvar: ' + err.message));

        closeModal();
    }

    function closeModal() {
        modal.classList.add('hidden');
        currentEditId = null;
        if (previewAudio) {
            previewAudio.pause();
            previewAudio = null;
        }
    }

    // ===== NIGHT MODE =====
    function toggleNight() {
        isNightMode = !isNightMode;
        body.classList.toggle('night-mode');
        btnNight.textContent = isNightMode ? '☀️ Modo Claro' : '🌙 Modo Noturno';
        savePreferences();
    }

    // ===== TOGGLE STATS =====
    function toggleStats() {
        showStats = !showStats;
        statsPanel.classList.toggle('hidden');
        btnToggleStats.textContent = showStats ? '📊 Estatísticas' : '📊 Mostrar Stats';
        savePreferences();
    }

    // ===== LIGHTBOX =====
    function openLightbox(images, startIndex, groupData) {
        lightboxImages = images;
        lightboxCurrentIndex = startIndex;
        lightboxGroups = groupData;

        const overlay = document.getElementById('lightbox');
        updateLightbox();
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        document.getElementById('lightbox').classList.add('hidden');
        document.body.style.overflow = '';
    }

    function updateLightbox() {
        const img = document.getElementById('lightboxImg');
        const info = document.getElementById('lightboxInfo');
        const counter = document.getElementById('lightboxCounter');

        img.src = lightboxImages[lightboxCurrentIndex];

        if (lightboxGroups && lightboxGroups.length > 0) {
            const group = lightboxGroups[lightboxCurrentIndex];
            info.innerHTML = `
                <div class="lb-text">${group.text || '📷 Sem legenda'}</div>
                <div class="lb-date">${group.date ? `📅 ${formatDate(group.date)}` : '📅 Sem data'}</div>
            `;
        }

        counter.textContent = `${lightboxCurrentIndex + 1} / ${lightboxImages.length}`;
    }

    function lightboxPrev() {
        if (lightboxCurrentIndex > 0) {
            lightboxCurrentIndex--;
            updateLightbox();
        }
    }

    function lightboxNext() {
        if (lightboxCurrentIndex < lightboxImages.length - 1) {
            lightboxCurrentIndex++;
            updateLightbox();
        }
    }

    // ===== EVENTOS DO MODAL =====
    editMusic.addEventListener('change', function () {
        if (this.value === 'custom') {
            customMusicDiv.style.display = 'block';
            editCustomMusic.focus();
        } else {
            customMusicDiv.style.display = 'none';
        }
    });

    musicSearch.addEventListener('input', function () {
        renderMusicLibrary(this.value);
    });

    // ===== EVENTOS =====
    btnAdd.addEventListener('click', addPhotos);
    btnSave.addEventListener('click', saveEdit);
    btnCancel.addEventListener('click', closeModal);
    btnNight.addEventListener('click', toggleNight);
    btnToggleStats.addEventListener('click', toggleStats);

    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
            filterDropdown.classList.add('hidden');
        }
    });

    filterMonth.addEventListener('change', render);
    filterYear.addEventListener('change', render);
    btnClearFilter.addEventListener('click', () => {
        filterMonth.value = 'all';
        filterYear.value = 'all';
        render();
    });

    // ===== MENU DE FILTROS (3 pontinhos) =====
    btnFilterMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        filterDropdown.classList.toggle('hidden');
    });

    // Fecha o menu se clicar fora dele
    document.addEventListener('click', (e) => {
        if (!filterDropdown.classList.contains('hidden') &&
            !filterDropdown.contains(e.target) &&
            e.target !== btnFilterMenu) {
            filterDropdown.classList.add('hidden');
        }
    });

    // ===== EVENTOS LIGHTBOX =====
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', lightboxPrev);
    document.getElementById('lightboxNext').addEventListener('click', lightboxNext);

    document.addEventListener('keydown', function (e) {
        if (!document.getElementById('lightbox').classList.contains('hidden')) {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') lightboxPrev();
            if (e.key === 'ArrowRight') lightboxNext();
        }
    });

    document.getElementById('lightbox').addEventListener('click', function (e) {
        if (e.target === this) closeLightbox();
    });

    // ===== PWA - INSTALAÇÃO =====
    let deferredPrompt;
    const installBanner = document.getElementById('installBanner');
    const btnInstall = document.getElementById('btnInstall');
    const btnCloseInstall = document.getElementById('btnCloseInstall');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        installBanner.classList.remove('hidden');
    });

    btnInstall.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const result = await deferredPrompt.userChoice;
            if (result.outcome === 'accepted') {
                console.log('Usuário aceitou a instalação');
                installBanner.classList.add('hidden');
            }
            deferredPrompt = null;
        }
    });

    btnCloseInstall.addEventListener('click', () => {
        installBanner.classList.add('hidden');
    });

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(() => {
                    console.log('Service Worker registrado com sucesso!');
                })
                .catch((err) => {
                    console.log('Erro ao registrar Service Worker:', err);
                });
        });
    }

    if (window.matchMedia('(display-mode: standalone)').matches) {
        installBanner.classList.add('hidden');
    }

    // ===== INICIALIZAR =====
    loadPreferences();
    subscribeToGroups(); // busca os dias do Firestore e chama render() sozinho
    if (isNightMode) btnNight.textContent = '☀️ Modo Claro';
    if (!showStats) btnToggleStats.textContent = '📊 Mostrar Stats';

    updateTogetherCounter();
    setInterval(updateTogetherCounter, 1000);

})();