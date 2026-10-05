// ===== RODA DE CORES PERSONALIZADA =====
// Usa os botões escondidos do script.js: ao escolher uma cor, ele "clica" no botão
// com a nova cor, e o próprio script.js aplica e salva a personalização.
(function () {
    const KEYS = {
        titleColorPicker: 'titleColor',
        textColorPicker: 'textColor',
        pageColorPicker: 'pageColor',
        accentColorPicker: 'accentColor',
        photoFramePicker: 'photoFrame',
        // Notas: não guardam cor padrão salva (a cor vai junto de cada nota)
        paperPicker: null,
        inkPicker: null,
        photoPaperPicker: null,
        photoInkPicker: null
    };

    let saved = {};
    try { saved = JSON.parse(localStorage.getItem('albumCustomization_v1')) || {}; } catch (e) { }

    Object.keys(KEYS).forEach((pickerId) => {
        const picker = document.getElementById(pickerId);
        if (!picker) return;
        const btn = picker.querySelector('.color-wheel-btn');
        const input = picker.querySelector('.color-wheel-input');
        const wrap = picker.querySelector('.color-wheel-wrap');
        if (!btn || !input || !wrap) return;

        const savedColor = KEYS[pickerId] ? saved[KEYS[pickerId]] : null;
        if (/^#[0-9a-f]{6}$/i.test(savedColor || '')) {
            input.value = savedColor;
            wrap.style.setProperty('--picked', savedColor);
        }

        input.addEventListener('input', () => {
            wrap.style.setProperty('--picked', input.value);
            btn.dataset.color = input.value;
            btn.click();
        });
    });
})();
