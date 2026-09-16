(function () {
    // ===== BIBLIOTECA DE MÚSICAS ONLINE =====
    const MUSIC_LIBRARY = [
        { name: "Perfect", artist: "Ed Sheeran", category: "Romântica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
        { name: "All of Me", artist: "John Legend", category: "Romântica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
        { name: "Thinking Out Loud", artist: "Ed Sheeran", category: "Romântica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
        { name: "A Thousand Years", artist: "Christina Perri", category: "Romântica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
        { name: "Just the Way You Are", artist: "Bruno Mars", category: "Romântica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
        { name: "Happy", artist: "Pharrell Williams", category: "Animada", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3" },
        { name: "Can't Stop the Feeling", artist: "Justin Timberlake", category: "Animada", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3" },
        { name: "Canon in D", artist: "Pachelbel", category: "Clássica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3" },
        { name: "Clair de Lune", artist: "Debussy", category: "Clássica", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3" },
        { name: "Blinding Lights", artist: "The Weeknd", category: "Moderna", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-21.mp3" },
        { name: "Levitating", artist: "Dua Lipa", category: "Moderna", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-22.mp3" },
        { name: "As It Was", artist: "Harry Styles", category: "Moderna", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-26.mp3" }
    ];

    // ===== CONSTANTES =====
    const CUSTOM_KEY = 'albumCustomization_v1';
    const COVER_KEY = 'albumCover_v1';
    const COVER_OPEN_KEY = 'albumCoverOpen_v1';

    // ===== ESTADO =====
    let groups = [];
    let currentEditId = null;
    let isNightMode = false;
    let showStats = true;
    let previewAudio = null;

    let currentNoteId = null;
    let selectedNoteFont = "'Caveat', cursive";
    let selectedNotePaper = "#fdfaf0";
    let selectedNoteInk = "#2a2a2a";

    let currentPhotoNoteGroupId = null;
    let currentPhotoNoteIndex = null;
    let selectedPhotoNoteFont = "'Caveat', cursive";
    let selectedPhotoNotePaper = "#fdfaf0";
    let selectedPhotoNoteInk = "#2a2a2a";
    let selectedPhotoNoteSize = "medium";

    let lightboxImages = [];
    let lightboxCurrentIndex = 0;
    let lightboxGroups = [];
    let lightboxPhotoNotes = {};

    let customization = {
        theme: 'wood-light',
        titleFont: "'Great Vibes', cursive",
        titleColor: '#c9a86a',
        textFont: "'Great Vibes', cursive",
        textColor: '#f5f5f5',
        pageColor: '#1a1a1a',
        accentColor: '#c9a86a',
        photoFrame: '#fefefe'
    };

    const loadedFonts = new Set(['Great Vibes', 'Dancing Script', 'Sacramento', 'Caveat', 'Indie Flower', 'Shadows Into Light', 'Kalam', 'Playfair Display', 'Quicksand']);

    // ===== DOM =====
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

    const groupsCollection = db.collection('groups');
    const TOGETHER_SINCE = new Date(2026, 5, 16, 0, 0, 0);

    // ===== PREFERÊNCIAS =====
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

    // ===== FIREBASE =====
    function subscribeToGroups() {
        groupsCollection.orderBy('createdAt', 'asc').onSnapshot((snapshot) => {
            groups = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            render();
        }, (error) => {
            console.error('Erro Firebase:', error);
        });
    }

    // ===== AUXILIARES =====
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

    function getGroupTimestamp(g) {
        return (g.createdAt && typeof g.createdAt.toMillis === 'function') ? g.createdAt.toMillis() : 0;
    }

    // ===== CONTADOR =====
    function updateTogetherCounter() {
        const now = new Date();
        let years = now.getFullYear() - TOGETHER_SINCE.getFullYear();
        let months = now.getMonth() - TOGETHER_SINCE.getMonth();
        let days = now.getDate() - TOGETHER_SINCE.getDate();
        let hours = now.getHours() - TOGETHER_SINCE.getHours();
        let minutes = now.getMinutes() - TOGETHER_SINCE.getMinutes();
        let seconds = now.getSeconds() - TOGETHER_SINCE.getSeconds();

        if (seconds < 0) { seconds += 60; minutes--; }
        if (minutes < 0) { minutes += 60; hours--; }
        if (hours < 0) { hours += 24; days--; }
        if (days < 0) {
            const diasDoMesAnterior = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            days += diasDoMesAnterior;
            months--;
        }
        if (months < 0) { months += 12; years--; }

        const elY = document.getElementById('counterYears');
        if (elY) elY.textContent = years;
        const elM = document.getElementById('counterMonths');
        if (elM) elM.textContent = months;
        const elD = document.getElementById('counterDays');
        if (elD) elD.textContent = days;
        const elH = document.getElementById('counterHours');
        if (elH) elH.textContent = String(hours).padStart(2, '0');
        const elMi = document.getElementById('counterMinutes');
        if (elMi) elMi.textContent = String(minutes).padStart(2, '0');
        const elS = document.getElementById('counterSeconds');
        if (elS) elS.textContent = String(seconds).padStart(2, '0');
    }

    // ===== FILTROS =====
    function populateFilters() {
        const filteredForFilters = groups.filter(g => !g.isFreeNote);
        const months = new Set();
        const years = new Set();
        filteredForFilters.forEach(g => {
            if (g.date) {
                const my = getMonthYear(g.date);
                if (my) { months.add(my.month); years.add(my.year); }
            }
        });

        const sortedMonths = Array.from(months).sort((a, b) => a - b);
        const sortedYears = Array.from(years).sort((a, b) => b - a);

        const currentMonth = filterMonth.value;
        filterMonth.innerHTML = '<option value="all">Todos os meses</option>';
        sortedMonths.forEach(m => {
            const opt = document.createElement('option');
            opt.value = m;
            opt.textContent = getMonthName(m);
            filterMonth.appendChild(opt);
        });
        if (sortedMonths.includes(parseInt(currentMonth))) filterMonth.value = currentMonth;

        const currentYear = filterYear.value;
        filterYear.innerHTML = '<option value="all">Todos os anos</option>';
        sortedYears.forEach(y => {
            const opt = document.createElement('option');
            opt.value = y;
            opt.textContent = y;
            filterYear.appendChild(opt);
        });
        if (sortedYears.includes(parseInt(currentYear))) filterYear.value = currentYear;
    }

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

    // ===== STATS =====
    function updateStats() {
        const allGroups = groups;
        const photoGroups = allGroups.filter(g => !g.isFreeNote);
        const totalGroups = photoGroups.length;
        const totalPhotos = photoGroups.reduce((acc, g) => acc + (g.images ? g.images.length : 0), 0);
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

        const setTxt = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
        setTxt('statGroups', totalGroups);
        setTxt('statPhotos', totalPhotos);
        setTxt('statMonths', monthsWithPhotos.size);
        setTxt('statPeriod', daysDiff);
        setTxt('statAvgPhotos', avgPhotos);
        setTxt('statWithMusic', withMusic);

        const monthData = {};
        allGroups.forEach(g => {
            if (g.date) {
                const my = getMonthYear(g.date);
                if (my) {
                    const sortKey = `${my.year}-${String(my.month).padStart(2, '0')}`;
                    if (!monthData[sortKey]) {
                        monthData[sortKey] = { label: `${getMonthName(my.month)}/${my.year}`, count: 0 };
                    }
                    monthData[sortKey].count += (g.images ? g.images.length : 0);
                }
            }
        });

        const sortedKeys = Object.keys(monthData).sort();
        const maxMonthPhotos = Math.max(...sortedKeys.map(k => monthData[k].count), 1);
        const monthlyBars = document.getElementById('monthlyBars');
        if (monthlyBars) {
            monthlyBars.innerHTML = '';
            sortedKeys.slice(-6).forEach(key => {
                const { label, count } = monthData[key];
                const pct = (count / maxMonthPhotos) * 100;
                const div = document.createElement('div');
                div.className = 'bar-item';
                div.innerHTML = `<span class="bar-label">${label}</span><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div><span class="bar-value">${count}</span>`;
                monthlyBars.appendChild(div);
            });
        }

        const musicBars = document.getElementById('musicBars');
        if (musicBars) {
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
                div.innerHTML = `<span class="bar-label">${item.label}</span><div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div><span class="bar-value">${item.count}</span>`;
                musicBars.appendChild(div);
            });
        }
    }

    // ===== BIBLIOTECA MÚSICA =====
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
                if (music.url === editMusic.value) item.classList.add('selected');

                const info = document.createElement('div');
                info.innerHTML = `<div class="name">${music.name}</div><div class="artist">${music.artist}</div>`;

                const previewBtn = document.createElement('button');
                previewBtn.className = 'preview-btn';
                previewBtn.textContent = '▶️';
                previewBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    previewMusic(music.url);
                });

                item.appendChild(info);
                item.appendChild(previewBtn);

                item.addEventListener('click', () => {
                    ensureMusicOption(music);
                    editMusic.value = music.url;
                    customMusicDiv.style.display = 'none';
                    document.querySelectorAll('.music-item').forEach(el => el.classList.remove('selected'));
                    item.classList.add('selected');
                });

                musicLibrary.appendChild(item);
            });
        });
    }

    function previewMusic(url) {
        if (previewAudio) { previewAudio.pause(); previewAudio = null; }
        previewAudio = new Audio(url);
        previewAudio.volume = 0.3;
        previewAudio.play().catch(e => { });
        setTimeout(() => {
            if (previewAudio) { previewAudio.pause(); previewAudio.currentTime = 0; previewAudio = null; }
        }, 5000);
    }

    // ===== MÚSICA EMBED =====
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
            if (url.includes('youtube.com/watch?v=')) videoId = url.split('v=')[1]?.split('&')[0] || '';
            else if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
            else if (url.includes('youtube.com/embed/')) videoId = url.split('embed/')[1]?.split('?')[0] || '';
            if (videoId) return { type: 'youtube', html: `<iframe src="https://www.youtube.com/embed/${videoId}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` };
        }

        if (type === 'spotify') {
            let trackId = '';
            if (url.includes('spotify.com/track/')) trackId = url.split('track/')[1]?.split('?')[0] || '';
            else if (url.includes('spotify.com/embed/track/')) trackId = url.split('track/')[1]?.split('?')[0] || '';
            if (trackId) return { type: 'spotify', html: `<iframe src="https://open.spotify.com/embed/track/${trackId}" allow="encrypted-media"></iframe>` };
        }

        if (type === 'soundcloud') {
            return { type: 'soundcloud', html: `<iframe width="100%" height="120" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23c9a86a&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false"></iframe>` };
        }

        if (type === 'mp3' || type === 'custom') {
            return { type: 'mp3', html: `<audio controls style="width:100%;"><source src="${url}">Seu navegador não suporta áudio.</audio>` };
        }

        return null;
    }

    // ===== PERSONALIZAÇÃO =====
    function applyCustomization() {
        document.body.classList.remove('theme-wood-light', 'theme-wood-dark', 'theme-paper', 'theme-white', 'theme-black', 'theme-pink', 'theme-mint', 'theme-lavender');
        document.body.classList.add('theme-' + customization.theme);

        document.documentElement.style.setProperty('--title-font', customization.titleFont);
        document.documentElement.style.setProperty('--title-color', customization.titleColor);
        document.documentElement.style.setProperty('--text-font', customization.textFont);
        document.documentElement.style.setProperty('--text-color', customization.textColor);
        document.documentElement.style.setProperty('--page-color', customization.pageColor);
        document.documentElement.style.setProperty('--accent-color', customization.accentColor);
        document.documentElement.style.setProperty('--photo-frame', customization.photoFrame);

        localStorage.setItem(CUSTOM_KEY, JSON.stringify(customization));
    }

    function loadCustomization() {
        const saved = localStorage.getItem(CUSTOM_KEY);
        if (saved) {
            try { Object.assign(customization, JSON.parse(saved)); } catch (e) { }
        }
        applyCustomization();
    }

    function loadGoogleFont(fontFamily) {
        if (!fontFamily) return;
        const cleanName = fontFamily.replace(/['"]/g, '').trim();
        if (loadedFonts.has(cleanName)) return;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(cleanName).replace(/%20/g, '+')}:wght@300;400;600;700&display=swap`;
        link.onload = () => { loadedFonts.add(cleanName); if (typeof render === 'function') render(); };
        link.onerror = () => alert('Não foi possível carregar a fonte "' + cleanName + '".');
        document.head.appendChild(link);
    }

    function openCustomizeModal() {
        filterDropdown.classList.add('hidden');
        document.querySelectorAll('#themePicker .theme-option').forEach(btn => btn.classList.toggle('active', btn.dataset.theme === customization.theme));
        document.querySelectorAll('#titleColorPicker .color-option').forEach(btn => btn.classList.toggle('active', btn.dataset.color === customization.titleColor));
        document.querySelectorAll('#textColorPicker .color-option').forEach(btn => btn.classList.toggle('active', btn.dataset.color === customization.textColor));
        document.querySelectorAll('#pageColorPicker .color-option').forEach(btn => btn.classList.toggle('active', btn.dataset.color === customization.pageColor));
        document.querySelectorAll('#accentColorPicker .color-option').forEach(btn => btn.classList.toggle('active', btn.dataset.color === customization.accentColor));
        document.querySelectorAll('#photoFramePicker .color-option').forEach(btn => btn.classList.toggle('active', btn.dataset.color === customization.photoFrame));
        document.getElementById('customizeModal').classList.remove('hidden');
    }

    function closeCustomizeModal() {
        document.getElementById('customizeModal').classList.add('hidden');
    }

    function resetCustomization() {
        if (!confirm('Restaurar as configurações padrão?')) return;
        customization = {
            theme: 'wood-light',
            titleFont: "'Great Vibes', cursive",
            titleColor: '#c9a86a',
            textFont: "'Great Vibes', cursive",
            textColor: '#f5f5f5',
            pageColor: '#1a1a1a',
            accentColor: '#c9a86a',
            photoFrame: '#fefefe'
        };
        applyCustomization();
        openCustomizeModal();
    }

    // ===== LEMBRETE =====
    function openNoteModal(groupId) {
        const group = groups.find(g => g.id === groupId);
        if (!group) return;
        currentNoteId = groupId;
        const note = group.note || {};

        document.getElementById('noteText').value = note.text || '';
        selectedNoteFont = note.font || "'Caveat', cursive";
        selectedNotePaper = note.paper || "#fdfaf0";
        selectedNoteInk = note.ink || "#2a2a2a";

        document.querySelectorAll('#fontPicker .font-option').forEach(btn => btn.classList.toggle('active', btn.dataset.font === selectedNoteFont));
        document.querySelectorAll('#paperPicker .color-option').forEach(btn => btn.classList.toggle('active', btn.dataset.color === selectedNotePaper));
        document.querySelectorAll('#inkPicker .color-option').forEach(btn => btn.classList.toggle('active', btn.dataset.color === selectedNoteInk));

        const ta = document.getElementById('noteText');
        ta.style.fontFamily = selectedNoteFont;
        ta.style.background = selectedNotePaper;
        ta.style.color = selectedNoteInk;

        document.getElementById('noteModal').classList.remove('hidden');
        setTimeout(() => ta.focus(), 100);
    }

    function closeNoteModal() {
        document.getElementById('noteModal').classList.add('hidden');
        currentNoteId = null;
    }

    function saveNote() {
        if (currentNoteId === null) return;
        const text = document.getElementById('noteText').value.trim();

        if (!text) {
            groupsCollection.doc(currentNoteId).update({ note: firebase.firestore.FieldValue.delete() }).catch(err => alert('Erro: ' + err.message));
            closeNoteModal();
            return;
        }

        groupsCollection.doc(currentNoteId).update({
            note: { text, font: selectedNoteFont, paper: selectedNotePaper, ink: selectedNoteInk }
        }).catch(err => alert('Erro: ' + err.message));

        closeNoteModal();
    }

    function removeNote(groupId) {
        if (!confirm('Remover este lembrete?')) return;
        groupsCollection.doc(groupId).update({ note: firebase.firestore.FieldValue.delete() }).catch(err => alert('Erro: ' + err.message));
    }

    function buildNoteElement(group) {
        const note = group.note;
        if (!note || !note.text) {
            const addBtn = document.createElement('button');
            addBtn.className = 'add-note-btn';
            addBtn.textContent = '✎ Adicionar Lembrete';
            addBtn.addEventListener('click', () => openNoteModal(group.id));
            return addBtn;
        }

        const noteCard = document.createElement('div');
        noteCard.className = 'note-card';
        noteCard.style.background = note.paper || '#fdfaf0';
        noteCard.style.color = note.ink || '#2a2a2a';
        noteCard.style.fontFamily = note.font || "'Caveat', cursive";

        const textDiv = document.createElement('div');
        textDiv.className = 'note-text';
        textDiv.textContent = note.text;

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'note-actions';

        const editBtn = document.createElement('button');
        editBtn.textContent = '✏️ Editar';
        editBtn.addEventListener('click', () => openNoteModal(group.id));

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '🗑️ Remover';
        removeBtn.addEventListener('click', () => removeNote(group.id));

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(removeBtn);
        noteCard.appendChild(textDiv);
        noteCard.appendChild(actionsDiv);
        return noteCard;
    }

    // ===== LEMBRETE POR FOTO =====
    function openPhotoNoteModal(groupId, photoIndex) {
        const group = groups.find(g => g.id === groupId);
        if (!group) return;

        currentPhotoNoteGroupId = groupId;
        currentPhotoNoteIndex = photoIndex;
        const note = (group.photoNotes && group.photoNotes[photoIndex]) || {};

        document.getElementById('photoNoteText').value = note.text || '';
        selectedPhotoNoteFont = note.font || "'Caveat', cursive";
        selectedPhotoNotePaper = note.paper || "#fdfaf0";
        selectedPhotoNoteInk = note.ink || "#2a2a2a";
        selectedPhotoNoteSize = note.size || "medium";

        document.querySelectorAll('#photoFontPicker .font-option').forEach(btn => btn.classList.toggle('active', btn.dataset.font === selectedPhotoNoteFont));
        document.querySelectorAll('#photoPaperPicker .color-option').forEach(btn => btn.classList.toggle('active', btn.dataset.color === selectedPhotoNotePaper));
        document.querySelectorAll('#photoInkPicker .color-option').forEach(btn => btn.classList.toggle('active', btn.dataset.color === selectedPhotoNoteInk));
        document.querySelectorAll('#photoSizePicker .size-option').forEach(btn => btn.classList.toggle('active', btn.dataset.size === selectedPhotoNoteSize));

        const ta = document.getElementById('photoNoteText');
        ta.style.fontFamily = selectedPhotoNoteFont;
        ta.style.background = selectedPhotoNotePaper;
        ta.style.color = selectedPhotoNoteInk;

        document.getElementById('photoNoteModal').classList.remove('hidden');
        setTimeout(() => ta.focus(), 100);
    }

    function closePhotoNoteModal() {
        document.getElementById('photoNoteModal').classList.add('hidden');
        currentPhotoNoteGroupId = null;
        currentPhotoNoteIndex = null;
    }

    function savePhotoNote() {
        if (currentPhotoNoteGroupId === null || currentPhotoNoteIndex === null) return;
        const text = document.getElementById('photoNoteText').value.trim();
        const groupRef = groupsCollection.doc(currentPhotoNoteGroupId);
        const group = groups.find(g => g.id === currentPhotoNoteGroupId);
        const existingNotes = (group && group.photoNotes) ? { ...group.photoNotes } : {};

        if (!text) {
            delete existingNotes[currentPhotoNoteIndex];
            if (Object.keys(existingNotes).length === 0) {
                groupRef.update({ photoNotes: firebase.firestore.FieldValue.delete() }).catch(err => alert('Erro: ' + err.message));
            } else {
                groupRef.update({ photoNotes: existingNotes }).catch(err => alert('Erro: ' + err.message));
            }
            closePhotoNoteModal();
            return;
        }

        existingNotes[currentPhotoNoteIndex] = {
            text, font: selectedPhotoNoteFont, paper: selectedPhotoNotePaper,
            ink: selectedPhotoNoteInk, size: selectedPhotoNoteSize
        };

        groupRef.update({ photoNotes: existingNotes }).catch(err => alert('Erro: ' + err.message));
        closePhotoNoteModal();
    }

    function buildPhotoWrapper(group, imgData, photoIndex) {
        const wrapper = document.createElement('div');
        wrapper.className = 'photo-wrapper';

        const img = document.createElement('img');
        img.src = imgData;
        img.alt = group.text || 'Foto';
        img.loading = 'lazy';
        img.addEventListener('click', () => {
            const allImages = group.images;
            const groupData = allImages.map((_, i) => ({
                text: group.text,
                date: group.date,
                photoNote: (group.photoNotes && group.photoNotes[i]) || null
            }));
            openLightbox(allImages, photoIndex, groupData, group.photoNotes || {});
        });

        wrapper.appendChild(img);

        const note = (group.photoNotes && group.photoNotes[photoIndex]) || null;
        if (note && note.text) {
            const noteEl = document.createElement('div');
            noteEl.className = `photo-note size-${note.size || 'medium'}`;
            noteEl.style.background = note.paper || '#fdfaf0';
            noteEl.style.color = note.ink || '#2a2a2a';
            noteEl.style.fontFamily = note.font || "'Caveat', cursive";
            noteEl.textContent = note.text;
            noteEl.addEventListener('click', (e) => {
                e.stopPropagation();
                openPhotoNoteModal(group.id, photoIndex);
            });
            wrapper.appendChild(noteEl);
        } else {
            const addBtn = document.createElement('button');
            addBtn.className = 'photo-note-add-btn';
            addBtn.textContent = '+';
            addBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openPhotoNoteModal(group.id, photoIndex);
            });
            wrapper.appendChild(addBtn);
        }

        return wrapper;
    }

    // ===== LEMBRETE SOLTO =====
    async function createFreeNote() {
        try {
            const novoDoc = await groupsCollection.add({
                text: '', date: new Date().toISOString().slice(0, 10), music: '',
                frameBg: '#f7faf7', frameBorder: '#dce8dc', frameTextColor: '#2d1b1b',
                images: [], isFreeNote: true,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            setTimeout(() => openNoteModal(novoDoc.id), 300);
        } catch (err) {
            alert('Erro ao criar lembrete solto: ' + err.message);
        }
    }

    // ===== SELETOR DE DIA =====
    function openPickDayModal() {
        const list = document.getElementById('noteDayList');
        list.innerHTML = '';

        const sorted = [...groups].sort((a, b) => {
            if (a.date && b.date) return b.date.localeCompare(a.date);
            if (a.date) return -1;
            if (b.date) return 1;
            return getGroupTimestamp(b) - getGroupTimestamp(a);
        });

        if (sorted.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'note-day-empty';
            empty.innerHTML = `<strong>Nenhum dia ainda...</strong>Adicione fotos primeiro.`;
            list.appendChild(empty);
        } else {
            sorted.forEach(group => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'note-day-item';

                const thumb = document.createElement('div');
                thumb.className = 'note-day-thumb';
                if (group.images && group.images.length > 0) thumb.style.backgroundImage = `url('${group.images[0]}')`;
                else thumb.style.background = '#2a2a2a';

                const info = document.createElement('div');
                info.className = 'note-day-info';

                const title = document.createElement('div');
                title.className = 'note-day-title';
                title.textContent = group.text || '📷 Sem legenda';

                const meta = document.createElement('div');
                meta.className = 'note-day-meta';
                const dateTxt = group.date ? formatDate(group.date) : 'Sem data';
                const photoTxt = group.isFreeNote ? 'só texto' : `${group.images.length} foto${group.images.length !== 1 ? 's' : ''}`;
                meta.innerHTML = `<span>📅 ${dateTxt}</span><span>📷 ${photoTxt}</span>`;

                info.appendChild(title);
                info.appendChild(meta);
                item.appendChild(thumb);
                item.appendChild(info);

                if (group.note && group.note.text) {
                    const badge = document.createElement('span');
                    badge.className = 'note-day-has-note';
                    badge.textContent = '✓ tem';
                    item.appendChild(badge);
                }

                item.addEventListener('click', () => {
                    closePickDayModal();
                    setTimeout(() => openNoteModal(group.id), 150);
                });

                list.appendChild(item);
            });
        }

        document.getElementById('notePickDayModal').classList.remove('hidden');
    }

    function closePickDayModal() {
        document.getElementById('notePickDayModal').classList.add('hidden');
    }

    // ===== FREE NOTE CARD =====
    function renderFreeNoteCard(group, idx) {
        const card = document.createElement('div');
        card.className = 'photo-card free-note-card';

        const badge = document.createElement('div');
        badge.className = 'free-note-badge';
        badge.textContent = '✎ Lembrete';
        card.appendChild(badge);

        const note = group.note || {};
        const paper = document.createElement('div');
        paper.className = 'free-note-paper';
        paper.style.background = note.paper || '#fdfaf0';
        paper.style.color = note.ink || '#2a2a2a';

        const text = document.createElement('div');
        text.className = 'free-note-text';
        text.style.fontFamily = note.font || "'Caveat', cursive";
        const size = note.size || 'medium';
        text.style.fontSize = size === 'small' ? '1rem' : size === 'large' ? '1.6rem' : '1.25rem';
        text.textContent = note.text || '✎ Clique em "Editar" para escrever...';
        if (!note.text) { text.style.opacity = '0.5'; text.style.fontStyle = 'italic'; }

        paper.appendChild(text);
        card.appendChild(paper);

        const footer = document.createElement('div');
        footer.className = 'free-note-footer';
        const dateEl = document.createElement('div');
        dateEl.className = 'free-note-date';
        dateEl.textContent = group.date ? formatDate(group.date) : 'Sem data';
        footer.appendChild(dateEl);
        card.appendChild(footer);

        const actions = document.createElement('div');
        actions.className = 'free-note-actions';

        const btnEdit = document.createElement('button');
        btnEdit.textContent = '✏️ Editar';
        btnEdit.addEventListener('click', () => openNoteModal(group.id));

        const btnDate = document.createElement('button');
        btnDate.textContent = '📅 Data';
        btnDate.addEventListener('click', () => openEditModal(group.id));

        const btnRemove = document.createElement('button');
        btnRemove.className = 'btn-remove';
        btnRemove.textContent = '🗑️ Remover';
        btnRemove.addEventListener('click', () => removeGroup(group.id));

        actions.appendChild(btnEdit);
        actions.appendChild(btnDate);
        actions.appendChild(btnRemove);
        card.appendChild(actions);

        grid.appendChild(card);
    }

    // ===== RENDER =====
    function render() {
        const filtered = getFilteredGroups();
        // ORDENAÇÃO: MAIS RECENTE PRIMEIRO
        const sorted = [...filtered].sort((a, b) => {
            if (a.date && b.date) return b.date.localeCompare(a.date);
            if (a.date) return -1;
            if (b.date) return 1;
            return getGroupTimestamp(b) - getGroupTimestamp(a);
        });

        const totalFotos = sorted.reduce((acc, g) => acc + (g.images ? g.images.length : 0), 0);
        if (filterStats) filterStats.textContent = `📸 ${sorted.length} ${sorted.length === 1 ? 'grupo' : 'grupos'} (${totalFotos} fotos)`;

        grid.innerHTML = '';
        if (sorted.length === 0) {
            grid.appendChild(emptyMsg);
        } else {
            sorted.forEach((group, idx) => {
                if (group.isFreeNote) { renderFreeNoteCard(group, idx); return; }

                const card = document.createElement('div');
                card.className = 'photo-card';

                const badge = document.createElement('div');
                badge.className = 'photo-badge';
                badge.textContent = `#${idx + 1}`;

                const countBadge = document.createElement('div');
                countBadge.className = 'photo-count-badge';
                countBadge.textContent = `📷 ${group.images.length}`;

                const photoGrid = document.createElement('div');
                const gridClass = getGridClass(group.images.length);
                photoGrid.className = `photo-grid ${gridClass}`;

                group.images.forEach((imgData, photoIndex) => {
                    photoGrid.appendChild(buildPhotoWrapper(group, imgData, photoIndex));
                });

                const info = document.createElement('div');
                info.className = 'photo-info';

                const textP = document.createElement('div');
                textP.className = 'photo-text';
                textP.textContent = group.text || '📷 Sem legenda';

                const dateP = document.createElement('div');
                dateP.className = 'photo-date';
                dateP.textContent = group.date ? `📅 ${formatDate(group.date)}` : '📅 Sem data';

                info.appendChild(textP);
                info.appendChild(dateP);

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
                        player.appendChild(label);
                    }
                    info.appendChild(player);
                }

                info.appendChild(buildNoteElement(group));

                const actions = document.createElement('div');
                actions.className = 'edit-actions';

                const btnEdit = document.createElement('button');
                btnEdit.textContent = '✏️ Editar Dia';
                btnEdit.addEventListener('click', () => openEditModal(group.id));

                const btnAddMore = document.createElement('button');
                btnAddMore.textContent = '➕ Add Fotos';
                btnAddMore.addEventListener('click', () => addMorePhotos(group.id));

                const btnRemove = document.createElement('button');
                btnRemove.textContent = '🗑️ Remover';
                btnRemove.className = 'btn-remove';
                btnRemove.addEventListener('click', () => removeGroup(group.id));

                actions.appendChild(btnEdit);
                actions.appendChild(btnAddMore);
                actions.appendChild(btnRemove);

                card.appendChild(badge);
                card.appendChild(countBadge);
                card.appendChild(photoGrid);
                card.appendChild(info);
                card.appendChild(actions);
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
            if (!g.date || g.isFreeNote) return;
            const my = getMonthYear(g.date);
            if (!my) return;
            const key = `${my.year}-${String(my.month).padStart(2, '0')}`;
            if (!groupsData[key]) groupsData[key] = { year: my.year, month: my.month, count: 0, fotos: 0 };
            groupsData[key].count++;
            groupsData[key].fotos += (g.images ? g.images.length : 0);
        });

        // TIMELINE: MAIS RECENTE PRIMEIRO
        const keys = Object.keys(groupsData).sort().reverse();
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

    // ===== CLOUDINARY =====
    async function uploadFileToCloudinary(file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
            { method: 'POST', body: formData }
        );
        if (!response.ok) throw new Error('Falha ao enviar a foto.');
        const data = await response.json();
        return data.secure_url;
    }

    async function uploadPhotosToGroup(groupId, files) {
        const urls = [];
        for (const file of files) {
            const url = await uploadFileToCloudinary(file);
            urls.push(url);
        }
        await groupsCollection.doc(groupId).update({
            images: firebase.firestore.FieldValue.arrayUnion(...urls)
        });
    }

    // ===== ADD FOTOS =====
    function addPhotos() {
        filterDropdown.classList.add('hidden');
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = async function (e) {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;

            try {
                const novoDoc = await groupsCollection.add({
                    text: '', date: '', music: '',
                    frameBg: '#f7faf7', frameBorder: '#dce8dc', frameTextColor: '#2d1b1b',
                    images: [],
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                await uploadPhotosToGroup(novoDoc.id, files);
                setTimeout(() => openEditModal(novoDoc.id), 400);
            } catch (err) {
                alert('Erro ao enviar: ' + err.message);
            }
        };
        input.click();
    }

    function addMorePhotos(groupId) {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.multiple = true;
        input.onchange = async function (e) {
            const files = Array.from(e.target.files);
            if (files.length === 0) return;
            try { await uploadPhotosToGroup(groupId, files); }
            catch (err) { alert('Erro: ' + err.message); }
        };
        input.click();
    }

    async function removeGroup(id) {
        const group = groups.find(g => g.id === id);
        if (!group) return;
        const msg = group.isFreeNote ? 'Remover este lembrete solto?' : `Remover este dia (${group.images.length} fotos)?`;
        if (!confirm(msg)) return;
        try { await groupsCollection.doc(id).delete(); }
        catch (err) { alert('Erro: ' + err.message); }
    }

    // ===== MODAL EDIT =====
    function openEditModal(id) {
        const group = groups.find(g => g.id === id);
        if (!group) return;
        currentEditId = id;
        editText.value = group.text || '';
        editDate.value = group.date || '';

        if (group.music) {
            const found = MUSIC_LIBRARY.find(m => m.url === group.music);
            if (found) {
                ensureMusicOption(found);
                editMusic.value = found.url;
                customMusicDiv.style.display = 'none';
            } else {
                editMusic.value = 'custom';
                customMusicDiv.style.display = 'block';
                editCustomMusic.value = group.music;
            }
        } else {
            editMusic.value = '';
            customMusicDiv.style.display = 'none';
        }

        renderMusicLibrary(musicSearch.value);
        modal.classList.remove('hidden');
        editText.focus();
    }

    function saveEdit() {
        if (currentEditId === null) return;
        let music = '';
        const musicSelect = editMusic.value;
        if (musicSelect === 'custom') music = editCustomMusic.value.trim();
        else if (musicSelect !== '') music = musicSelect;

        groupsCollection.doc(currentEditId).update({
            text: editText.value.trim(),
            date: editDate.value,
            music: music
        }).catch(err => alert('Erro: ' + err.message));
        closeModal();
    }

    function closeModal() {
        modal.classList.add('hidden');
        currentEditId = null;
        if (previewAudio) { previewAudio.pause(); previewAudio = null; }
    }

    // ===== NIGHT / STATS =====
    function toggleNight() {
        isNightMode = !isNightMode;
        body.classList.toggle('night-mode');
        btnNight.textContent = isNightMode ? '☀️' : '🌙';
        savePreferences();
    }

    function toggleStats() {
        showStats = !showStats;
        statsPanel.classList.toggle('hidden');
        filterDropdown.classList.add('hidden');
        savePreferences();
    }

    // ===== LIGHTBOX =====
    function openLightbox(images, startIndex, groupData, photoNotes = {}) {
        lightboxImages = images;
        lightboxCurrentIndex = startIndex;
        lightboxGroups = groupData;
        lightboxPhotoNotes = photoNotes;
        updateLightbox();
        document.getElementById('lightbox').classList.remove('hidden');
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

        const oldNote = document.querySelector('.lightbox-photo-note');
        if (oldNote) oldNote.remove();

        if (lightboxGroups && lightboxGroups.length > 0) {
            const group = lightboxGroups[lightboxCurrentIndex];
            info.innerHTML = `
                <div class="lb-text">${group.text || '📷 Sem legenda'}</div>
                <div class="lb-date">${group.date ? `📅 ${formatDate(group.date)}` : '📅 Sem data'}</div>
            `;

            const note = lightboxPhotoNotes[lightboxCurrentIndex];
            if (note && note.text) {
                const noteEl = document.createElement('div');
                noteEl.className = 'lightbox-photo-note';
                noteEl.style.background = note.paper || '#fdfaf0';
                noteEl.style.color = note.ink || '#2a2a2a';
                noteEl.style.fontFamily = note.font || "'Caveat', cursive";
                noteEl.textContent = note.text;
                info.parentNode.insertBefore(noteEl, info.nextSibling);
            }
        }
        counter.textContent = `${lightboxCurrentIndex + 1} / ${lightboxImages.length}`;
    }

    function lightboxPrev() { if (lightboxCurrentIndex > 0) { lightboxCurrentIndex--; updateLightbox(); } }
    function lightboxNext() { if (lightboxCurrentIndex < lightboxImages.length - 1) { lightboxCurrentIndex++; updateLightbox(); } }

    // ===== CAPA =====
    function openAlbum() {
        document.getElementById('coverScreen').classList.add('closed');
        document.body.classList.remove('cover-closed');
        localStorage.setItem(COVER_OPEN_KEY, 'true');
    }

    function closeAlbum() {
        document.getElementById('coverScreen').classList.remove('closed');
        document.body.classList.add('cover-closed');
        localStorage.setItem(COVER_OPEN_KEY, 'false');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function saveCover() {
        const cover = {
            title: document.getElementById('coverTitle').textContent.trim() || 'Nosso Álbum',
            subtitle: document.getElementById('coverSubtitle').textContent.trim() || 'de Amor',
            names: document.getElementById('coverNames').textContent.trim() || 'Você & Eu'
        };
        localStorage.setItem(COVER_KEY, JSON.stringify(cover));
        document.getElementById('miniCoverTitle').textContent = cover.title;
    }

    function loadCover() {
        const saved = localStorage.getItem(COVER_KEY);
        if (saved) {
            try {
                const cover = JSON.parse(saved);
                if (cover.title) document.getElementById('coverTitle').textContent = cover.title;
                if (cover.subtitle) document.getElementById('coverSubtitle').textContent = cover.subtitle;
                if (cover.names) document.getElementById('coverNames').textContent = cover.names;
                if (cover.title) document.getElementById('miniCoverTitle').textContent = cover.title;
            } catch (e) { }
        }
    }

    function initCoverState() {
        const isMobile = window.matchMedia('(max-width: 700px)').matches;
        if (isMobile) {
            document.getElementById('coverScreen').classList.remove('closed');
            document.body.classList.add('cover-closed');
        } else {
            document.getElementById('coverScreen').classList.add('closed');
            document.body.classList.remove('cover-closed');
        }
    }

    // ===== EVENTOS =====
    // Capa
    document.getElementById('coverOpenBtn').addEventListener('click', openAlbum);
    document.getElementById('miniCoverBtn').addEventListener('click', closeAlbum);
    document.getElementById('btnBackToCover').addEventListener('click', () => {
        closeAlbum();
        filterDropdown.classList.add('hidden');
    });

    ['coverTitle', 'coverSubtitle', 'coverNames'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('blur', saveCover);
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); el.blur(); }
        });
        el.addEventListener('click', (e) => e.stopPropagation());
    });

    let touchStartX = 0, touchStartY = 0;
    const coverScreen = document.getElementById('coverScreen');
    coverScreen.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    coverScreen.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (dx < -60 && Math.abs(dy) < Math.abs(dx)) openAlbum();
    }, { passive: true });

    // Menu dropdown
    document.getElementById('btnOpenCustomize').addEventListener('click', openCustomizeModal);
    document.getElementById('btnCloseCustomize').addEventListener('click', closeCustomizeModal);
    document.getElementById('btnResetCustomize').addEventListener('click', resetCustomization);
    document.getElementById('customizeModal').addEventListener('click', function (e) {
        if (e.target === this) closeCustomizeModal();
    });

    document.querySelectorAll('#themePicker .theme-option').forEach(btn => {
        btn.addEventListener('click', () => {
            customization.theme = btn.dataset.theme;
            document.querySelectorAll('#themePicker .theme-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyCustomization();
        });
    });

    document.getElementById('titleFontSelect').addEventListener('change', function () {
        if (this.value === '__custom__') {
            document.getElementById('customTitleFontDiv').classList.remove('hidden');
            document.getElementById('customTitleFontInput').focus();
        } else {
            document.getElementById('customTitleFontDiv').classList.add('hidden');
            customization.titleFont = this.value;
            applyCustomization();
        }
    });

    document.getElementById('textFontSelect').addEventListener('change', function () {
        if (this.value === '__custom__') {
            document.getElementById('customTextFontDiv').classList.remove('hidden');
            document.getElementById('customTextFontInput').focus();
        } else {
            document.getElementById('customTextFontDiv').classList.add('hidden');
            customization.textFont = this.value;
            applyCustomization();
        }
    });

    document.getElementById('customTitleFontInput').addEventListener('change', function () {
        const name = this.value.trim();
        if (!name) return;
        customization.titleFont = `'${name}', cursive`;
        loadGoogleFont(name);
        applyCustomization();
    });

    document.getElementById('customTextFontInput').addEventListener('change', function () {
        const name = this.value.trim();
        if (!name) return;
        customization.textFont = `'${name}', cursive`;
        loadGoogleFont(name);
        applyCustomization();
    });

    document.querySelectorAll('#titleColorPicker .color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            customization.titleColor = btn.dataset.color;
            document.querySelectorAll('#titleColorPicker .color-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyCustomization();
        });
    });

    document.querySelectorAll('#textColorPicker .color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            customization.textColor = btn.dataset.color;
            document.querySelectorAll('#textColorPicker .color-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyCustomization();
        });
    });

    document.querySelectorAll('#pageColorPicker .color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            customization.pageColor = btn.dataset.color;
            document.querySelectorAll('#pageColorPicker .color-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyCustomization();
        });
    });

    document.querySelectorAll('#accentColorPicker .color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            customization.accentColor = btn.dataset.color;
            document.querySelectorAll('#accentColorPicker .color-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyCustomization();
        });
    });

    document.querySelectorAll('#photoFramePicker .color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            customization.photoFrame = btn.dataset.color;
            document.querySelectorAll('#photoFramePicker .color-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            applyCustomization();
        });
    });

    // Menu dropdown: filtros
    btnFilterMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        filterDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
        if (!filterDropdown.classList.contains('hidden') &&
            !filterDropdown.contains(e.target) &&
            e.target !== btnFilterMenu) {
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

    // Botões do menu
    btnAdd.addEventListener('click', addPhotos);
    document.getElementById('btnAddNote').addEventListener('click', () => {
        filterDropdown.classList.add('hidden');
        openPickDayModal();
    });
    document.getElementById('btnAddFreeNote').addEventListener('click', () => {
        filterDropdown.classList.add('hidden');
        createFreeNote();
    });
    btnToggleStats.addEventListener('click', toggleStats);

    // Modais de lembrete
    document.getElementById('btnSaveNote').addEventListener('click', saveNote);
    document.getElementById('btnCancelNote').addEventListener('click', closeNoteModal);
    document.getElementById('noteModal').addEventListener('click', function (e) {
        if (e.target === this) closeNoteModal();
    });

    document.getElementById('btnSavePhotoNote').addEventListener('click', savePhotoNote);
    document.getElementById('btnCancelPhotoNote').addEventListener('click', closePhotoNoteModal);
    document.getElementById('photoNoteModal').addEventListener('click', function (e) {
        if (e.target === this) closePhotoNoteModal();
    });

    document.querySelectorAll('#photoFontPicker .font-option').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedPhotoNoteFont = btn.dataset.font;
            document.querySelectorAll('#photoFontPicker .font-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('photoNoteText').style.fontFamily = selectedPhotoNoteFont;
        });
    });

    document.querySelectorAll('#photoPaperPicker .color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedPhotoNotePaper = btn.dataset.color;
            document.querySelectorAll('#photoPaperPicker .color-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('photoNoteText').style.background = selectedPhotoNotePaper;
        });
    });

    document.querySelectorAll('#photoInkPicker .color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedPhotoNoteInk = btn.dataset.color;
            document.querySelectorAll('#photoInkPicker .color-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('photoNoteText').style.color = selectedPhotoNoteInk;
        });
    });

    document.querySelectorAll('#photoSizePicker .size-option').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedPhotoNoteSize = btn.dataset.size;
            document.querySelectorAll('#photoSizePicker .size-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    document.getElementById('btnCancelPickDay').addEventListener('click', closePickDayModal);
    document.getElementById('notePickDayModal').addEventListener('click', function (e) {
        if (e.target === this) closePickDayModal();
    });

    document.querySelectorAll('#fontPicker .font-option').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedNoteFont = btn.dataset.font;
            document.querySelectorAll('#fontPicker .font-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('noteText').style.fontFamily = selectedNoteFont;
        });
    });

    document.querySelectorAll('#paperPicker .color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedNotePaper = btn.dataset.color;
            document.querySelectorAll('#paperPicker .color-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('noteText').style.background = selectedNotePaper;
        });
    });

    document.querySelectorAll('#inkPicker .color-option').forEach(btn => {
        btn.addEventListener('click', () => {
            selectedNoteInk = btn.dataset.color;
            document.querySelectorAll('#inkPicker .color-option').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById('noteText').style.color = selectedNoteInk;
        });
    });

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

    btnSave.addEventListener('click', saveEdit);
    btnCancel.addEventListener('click', closeModal);
    btnNight.addEventListener('click', toggleNight);

    modal.addEventListener('click', function (e) {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeModal();
            closeCustomizeModal();
            closeNoteModal();
            closePickDayModal();
            closePhotoNoteModal();
            filterDropdown.classList.add('hidden');
        }
    });

    // Lightbox
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

    // PWA
    let deferredPrompt;
    const installBanner = document.getElementById('installBanner');
    const btnInstall = document.getElementById('btnInstall');
    const btnCloseInstall = document.getElementById('btnCloseInstall');

    if (installBanner) {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            installBanner.classList.remove('hidden');
        });

        if (btnInstall) {
            btnInstall.addEventListener('click', async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const result = await deferredPrompt.userChoice;
                    if (result.outcome === 'accepted') installBanner.classList.add('hidden');
                    deferredPrompt = null;
                }
            });
        }

        if (btnCloseInstall) {
            btnCloseInstall.addEventListener('click', () => installBanner.classList.add('hidden'));
        }

        if (window.matchMedia('(display-mode: standalone)').matches) {
            installBanner.classList.add('hidden');
        }
    }

    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js').catch((err) => console.log('Erro SW:', err));
        });
    }

    // ===== INIT =====
    loadCover();
    initCoverState();
    loadCustomization();
    loadPreferences();
    subscribeToGroups();
    if (isNightMode) btnNight.textContent = '☀️';
    updateTogetherCounter();
    setInterval(updateTogetherCounter, 1000);

})();