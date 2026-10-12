// ===== SURPRESA: CORAÇÃO DE "EU TE AMO" (versão web do euteamo.py) =====
(function () {
    const PHRASES = [
        "I love you", "Seni seviyorum", "Te amo", "Je t'aime",
        "Ich liebe dich", "Ti amo", "Eu te amo", "Я тебя люблю",
        "사랑해", "愛してる", "我爱你", "मैं तुमसे प्यार करता हूँ",
        "Σ' αγαπώ", "Ik hou van jou", "Jag älskar dig", "Kocham cię",
        "ฉันรักเธอ", "Anh yêu em", "Aku cinta kamu", "Я тебе кохаю"
    ];
    const SIZES = [9, 10, 11, 12];
    const FONT = 'Arial, "Segoe UI", "Noto Sans", "Noto Sans CJK JP", "Noto Sans Devanagari", "Noto Sans Thai", sans-serif';
    const BG = '#060208';
    const BGC = [6 / 255, 2 / 255, 8 / 255];
    const FLASH = [1.0, 0.78, 0.78];
    const DURATION = 10000, TICK = 16, ANIM = 42, GAP = 7;

    const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
    const mix = (a, b, k) => a.map((p, i) => p + (b[i] - p) * k);
    const dim = (c, k) => c.map(v => v * k);
    const hx = c => '#' + c.map(v => Math.round(clamp(v) * 255).toString(16).padStart(2, '0')).join('');

    function mulberry32(a) {
        return function () {
            a |= 0; a = a + 0x6D2B79F5 | 0;
            let t = Math.imul(a ^ a >>> 15, 1 | a);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
        };
    }

    function heartPoint(a, SC) {
        const x = 16 * Math.pow(Math.sin(a), 3);
        const y = 13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a);
        return [x * SC, y * SC];
    }

    // Monta o desenho (posição, texto, tamanho e cor de cada frase)
    function buildLayout(W, H, measure) {
        const rng = mulberry32(11);
        const unit = Array.from({ length: 720 }, (_, i) => heartPoint(2 * Math.PI * i / 720, 1));
        const wUnit = Math.max(...unit.map(p => p[0])) - Math.min(...unit.map(p => p[0]));
        const hUnit = Math.max(...unit.map(p => p[1])) - Math.min(...unit.map(p => p[1]));
        const SC = Math.min(W * 0.94 / wUnit, H * 0.78 / hUnit);
        const fs = clamp(SC / 21, 0.8, 1.6);

        const POLY = Array.from({ length: 720 }, (_, i) => heartPoint(2 * Math.PI * i / 720, SC));
        const EDGES = POLY.map((p, i) => [p, POLY[(i + 1) % POLY.length]]);
        const YMAX = Math.max(...POLY.map(p => p[1]));
        const YMIN = Math.min(...POLY.map(p => p[1]));
        const CY = (YMAX + YMIN) / 2;

        function spans(y) {
            const xs = [];
            for (const [[x1, y1], [x2, y2]] of EDGES) {
                if ((y1 <= y && y < y2) || (y2 <= y && y < y1)) xs.push(x1 + (y - y1) * (x2 - x1) / (y2 - y1));
            }
            xs.sort((a, b) => a - b);
            const out = [];
            for (let i = 0; i + 1 < xs.length; i += 2) out.push([xs[i], xs[i + 1]]);
            return out;
        }

        function intersect(A, B) {
            const out = [];
            for (const a of A) for (const b of B) {
                const lo = Math.max(a[0], b[0]), hi = Math.min(a[1], b[1]);
                if (hi - lo > 14 * SC / 21) out.push([lo, hi]);
            }
            return out;
        }

        let order = [], pos = 0;
        function nextPhrase() {
            if (pos >= order.length) {
                order = PHRASES.slice();
                for (let i = order.length - 1; i > 0; i--) {
                    const j = Math.floor(rng() * (i + 1));
                    [order[i], order[j]] = [order[j], order[i]];
                }
                pos = 0;
            }
            return order[pos++];
        }

        const px = size => size * 1.3333 * fs;
        const rowH = Math.ceil(px(Math.max(...SIZES)) * 1.25) + 4 * fs;
        const half = rowH / 2;
        const gap = GAP * fs;
        const placed = [];

        let y = YMAX - half;
        while (y > YMIN + half) {
            const row = intersect(spans(y + half), spans(y - half));
            for (let [lo, hi] of row) {
                lo += 4 * fs; hi -= 4 * fs;
                let cur = lo + rng() * 8 * fs;
                const line = [];
                while (true) {
                    let fit = null;
                    for (let k = 0; k < 10; k++) {
                        const text = nextPhrase();
                        const size = SIZES[Math.floor(rng() * SIZES.length)];
                        const w = measure(text, px(size));
                        if (cur + w <= hi) { fit = [text, size, w]; break; }
                    }
                    if (!fit) break;
                    const [text, size, w] = fit;
                    line.push([cur + w / 2, text, size, w]);
                    cur += w + gap;
                }
                if (!line.length) continue;
                if (line.length > 1) {
                    const left = hi - (line[line.length - 1][0] + line[line.length - 1][3] / 2);
                    line.forEach((it, i) => { it[0] += left * i / (line.length - 1); });
                } else {
                    line[0][0] = (lo + hi) / 2;
                }
                line.forEach(([x, text, size], i) => {
                    placed.push({ x, y, text, size, px: px(size), edge: i === 0 || i === line.length - 1 });
                });
            }
            y -= rowH;
        }

        const wine = [0.58, 0.0, 0.09], crimson = [0.90, 0.05, 0.14], blood = [0.98, 0.10, 0.16];
        for (const p of placed) {
            const rad = Math.min(1, Math.hypot(p.x / (16 * SC), (p.y - CY) / (14.5 * SC)));
            let base = mix(wine, crimson, 0.25 + 0.75 * rad);
            base = mix(base, blood, rng() * 0.35 + (p.edge ? 0.3 : 0));
            p.color = base.map(v => Math.min(1, v));
            p.rad = rad;
        }

        const edges = placed.filter(p => p.edge).sort((a, b) =>
            (((Math.atan2(a.x, a.y - CY) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) -
            (((Math.atan2(b.x, b.y - CY) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)));
        const inner = placed.filter(p => !p.edge).map(p => [p, -p.rad + rng() * 0.08])
            .sort((a, b) => a[1] - b[1]).map(a => a[0]);
        return { items: edges.concat(inner), SC, fs, CY };
    }
    window.__heartBuild = buildLayout;

    // ----- Estilo do painel -----
    const style = document.createElement('style');
    style.textContent = `
    #heartSurprise{position:fixed;inset:0;z-index:99999;background:${BG};opacity:0;transition:opacity .6s ease}
    #heartSurprise.show{opacity:1}
    #heartSurprise canvas{width:100%;height:100%;display:block}
    #heartSurprise button{position:absolute;font-family:'Quicksand',Arial,sans-serif;cursor:pointer;border-radius:999px;
        border:1px solid rgba(255,255,255,.18);color:#fff;background:rgba(255,255,255,.08);padding:10px 18px;font-size:.95rem;
        backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
    #heartSurprise .hs-skip{top:calc(env(safe-area-inset-top,0px) + 14px);right:14px}
    #heartSurprise .hs-enter{bottom:calc(env(safe-area-inset-bottom,0px) + 28px);left:50%;transform:translate(-50%,12px);opacity:0;
        pointer-events:none;transition:opacity .8s ease,transform .8s ease;background:linear-gradient(135deg,#f2a7c3,#ecd6ae);
        color:#1a1424;border:0;font-weight:700;padding:13px 26px;font-size:1.05rem;box-shadow:0 10px 30px rgba(242,167,195,.35)}
    #heartSurprise .hs-enter.on{opacity:1;transform:translate(-50%,0);pointer-events:auto}`;
    document.head.appendChild(style);

    let running = false;

    function show() {
        if (running) return;
        running = true;

        const overlay = document.createElement('div');
        overlay.id = 'heartSurprise';
        overlay.innerHTML = '<canvas></canvas><button class="hs-skip" type="button">Pular ✕</button>' +
            '<button class="hs-enter" type="button">Entrar no álbum 💕</button>';
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('show'));

        const canvas = overlay.querySelector('canvas');
        const W = window.innerWidth, H = window.innerHeight;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = W * dpr; canvas.height = H * dpr;
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);

        const staticCv = document.createElement('canvas');
        staticCv.width = W * dpr; staticCv.height = H * dpr;
        const sctx = staticCv.getContext('2d');
        sctx.scale(dpr, dpr);

        const measure = (text, px) => { ctx.font = `bold ${px}px ${FONT}`; return ctx.measureText(text).width; };
        const { items, SC, fs, CY } = buildLayout(W, H, measure);
        const LIFT = 34 * SC / 21;
        const RATE = items.length / (DURATION / TICK);
        const sx = x => W / 2 + x;
        const sy = y => H / 2 - (y - CY);

        function draw(c2, text, x, y, px, color) {
            c2.font = `bold ${px}px ${FONT}`;
            c2.fillStyle = hx(color);
            c2.fillText(text, x, y);
        }
        [ctx, sctx].forEach(c2 => { c2.textAlign = 'center'; c2.textBaseline = 'middle'; });

        const enterBtn = overlay.querySelector('.hs-enter');
        let idx = 0, acc = 0, tickAcc = 0, spawning = true, finished = false;
        let active = [], shimmers = [], lastShimmer = 0, last = performance.now(), raf = 0;

        function settle(p) {
            const x = sx(p.x), y = sy(p.y);
            draw(sctx, p.text, x + 2 * fs, y + 3 * fs, p.px, dim(p.color, 0.30));
            draw(sctx, p.text, x, y, p.px + 1.3 * fs, dim(p.color, 0.20));
            draw(sctx, p.text, x, y, p.px, p.color);
        }

        function tick() {
            if (spawning) {
                acc += RATE;
                while (acc >= 1 && idx < items.length) { acc -= 1; const p = items[idx++]; p.f = 0; p.dx = (rng() * 20 - 10) * fs; active.push(p); }
                if (idx >= items.length) spawning = false;
            }
            active = active.filter(p => { p.f++; if (p.f >= ANIM) { settle(p); return false; } return true; });
            if (!spawning && !active.length && !finished) { finished = true; enterBtn.classList.add('on'); }
        }
        const rng = Math.random;

        function renderActive(p) {
            const u = clamp(p.f / ANIM), e = 1 - Math.pow(1 - u, 3);
            const x = sx(p.x), y = sy(p.y);
            const py = y - (1 - e) * LIFT, pxx = x + p.dx * (1 - e);
            draw(ctx, p.text, x + 2 * fs, y + 3 * fs, p.px, mix(BGC, dim(p.color, 0.30), e));
            draw(ctx, p.text, pxx, py, p.px + 1.3 * fs, mix(BGC, dim(p.color, 0.20), e * e));
            const flash = 0.75 * Math.sin(Math.PI * clamp((u - 0.55) / 0.45));
            draw(ctx, p.text, pxx, py, p.px, mix(mix(BGC, p.color, Math.pow(e, 1.5)), FLASH, flash));
        }

        function frame(now) {
            tickAcc += now - last; last = now;
            let n = 0;
            while (tickAcc >= TICK && n < 6) { tickAcc -= TICK; n++; tick(); }
            if (tickAcc >= TICK) tickAcc = 0;

            ctx.fillStyle = BG;
            ctx.fillRect(0, 0, W, H);
            ctx.drawImage(staticCv, 0, 0, W, H);
            active.forEach(renderActive);

            if (finished) {
                if (now - lastShimmer > 140) {
                    lastShimmer = now;
                    shimmers.push({ p: items[Math.floor(Math.random() * items.length)], t: now });
                }
                shimmers = shimmers.filter(s => now - s.t < 260);
                shimmers.forEach(s => draw(ctx, s.p.text, sx(s.p.x), sy(s.p.y), s.p.px, mix(s.p.color, FLASH, 0.6)));
            }
            raf = requestAnimationFrame(frame);
        }

        function close() {
            cancelAnimationFrame(raf);
            document.removeEventListener('keydown', onKey);
            overlay.classList.remove('show');
            setTimeout(() => { overlay.remove(); running = false; }, 600);
        }
        function onKey(e) { if (e.key === 'Escape') close(); }
        document.addEventListener('keydown', onKey);
        overlay.querySelector('.hs-skip').addEventListener('click', close);
        enterBtn.addEventListener('click', close);

        raf = requestAnimationFrame(t => { last = t; frame(t); });
    }

    window.showHeartSurprise = show;
})();
