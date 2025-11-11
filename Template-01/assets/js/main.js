(function () {
    const JSON_PATH = './manifest.json';
    // ==== Add near top-level scope ====
    let userZoom = 1;     // 1.0 = 100%
    let fitMode = true;   // true = auto fit-to-viewport active
    const byPath = (obj, path) =>
        path.split('.').reduce((o, k) => (o && o[k] != null ? o[k] : undefined), obj);

    const setText = (el, value) => {
        if (el.tagName === 'TITLE') document.title = value ?? '';
        el.textContent = value ?? '';
    };
    const setAttrOrText = (el, value, key) => {
        if (el.tagName === 'IMG') {
            if (typeof value === 'string') el.src = value;
            else if (value && value.src) el.src = value.src;
            if (value && value.alt) el.alt = value.alt;
            return;
        }
        if (el.tagName === 'A' && key.endsWith('.href')) {
            if (typeof value === 'string') el.href = value;
            else if (value && value.href) el.href = value.href;
            return;
        }
        if (typeof value === 'string' || typeof value === 'number') {
            setText(el, value);
        } else if (value && value.text) {
            setText(el, value.text);
        }
    };
    const applyStyles = (el, stylesObj = {}) => {
        Object.entries(stylesObj).forEach(([k, v]) => {
            if (k.startsWith('--')) el.style.setProperty(k, v);
            else el.style[k] = v;
        });
    };
    const ensureFontLinks = (fonts = []) => {
        fonts.forEach(f => {
            const href = typeof f === 'string' ? f : f.href;
            if (!href) return;
            if (!document.querySelector(`link[data-font="${href}"]`)) {
                const l = document.createElement('link');
                l.rel = 'stylesheet';
                l.href = href;
                l.setAttribute('data-font', href);
                document.head.appendChild(l);
            }
        });
    };
    const applyThemeVars = (vars = {}) => {
        Object.entries(vars).forEach(([k, v]) => {
            document.documentElement.style.setProperty(`--${k}`, v);
        });
    };
    const applyBackgrounds = (rules = []) => {
        rules.forEach(r => {
            const els = document.querySelectorAll(r.selector);
            els.forEach(el => {
                if (r.image) el.style.backgroundImage = `url("${r.image}")`;
                if (r.size) el.style.backgroundSize = r.size;
                if (r.position) el.style.backgroundPosition = r.position;
                if (r.repeat) el.style.backgroundRepeat = r.repeat;
            });
        });
    };
    const applyAnimations = (rules = []) => {
        rules.forEach(r => {
            const els = document.querySelectorAll(r.selector);
            els.forEach(el => {
                if (r.class) el.classList.add(r.class);
                if (r.delayMs) el.style.animationDelay = `${r.delayMs}ms`;
            });
        });
    };

    // ---- NEW: Card sizing & export helpers ----
    let manifestCache = null;

    const px = v => (typeof v === 'number' ? `${v}px` : v);

    function applyCardSizing(cardCfg = {}) {
        const card = document.getElementById('card');
        const safe = document.getElementById('card-safe');
        if (!card || !safe) return;

        const width = cardCfg.size?.width ?? 1050;   // px
        const height = cardCfg.size?.height ?? 1500; // px
        const safePadding = cardCfg.safePadding ?? 36;
        const bg = cardCfg.backgroundColor ?? '#ffffff';

        card.style.width = px(width);
        card.style.height = px(height);
        card.style.background = bg;
        safe.style.padding = px(safePadding);

        const label = document.getElementById('card-size-label');
        if (label) {
            const dpi = cardCfg.dpi ?? 300;
            const inchesW = (width / dpi).toFixed(2);
            const inchesH = (height / dpi).toFixed(2);
            label.textContent = `${width}×${height}px  •  ~${inchesW}×${inchesH}" @ ${dpi} DPI`;
        }

        // Fit-to-viewport scaling (without breaking export size)
        autoScaleToViewport();
    }

    function autoScaleToViewport() {
        const wrap = document.getElementById('card-wrap');
        const card = document.getElementById('card');
        if (!wrap || !card) return;

        const stagePadding = 24; // approx
        const vw = window.innerWidth - stagePadding * 2;
        const vh = window.innerHeight - stagePadding * 2 - 100; // leave space for header

        const scaleX = vw / card.offsetWidth;
        const scaleY = vh / card.offsetHeight;
        const scale = Math.min(1, scaleX, scaleY); // never scale up; only down for preview
        wrap.style.setProperty('--scale', scale);
    }

    async function downloadPNG() {
        const card = document.getElementById('card');
        if (!card || !window.htmlToImage) return;

        const cfg = manifestCache?.card?.export || {};
        const scale = cfg.scale ?? 2;
        const filename = cfg.filename ?? 'invitation.png';
        const bg = manifestCache?.card?.transparentBackground ? undefined : (manifestCache?.card?.backgroundColor || '#ffffff');

        try {
            const dataUrl = await window.htmlToImage.toPng(card, {
                cacheBust: true,
                pixelRatio: scale,
                backgroundColor: bg
            });
            const a = document.createElement('a');
            a.href = dataUrl;
            a.download = filename;
            a.click();
        } catch (err) {
            console.error('PNG export failed:', err);
            alert('PNG export failed. See console for details.');
        }
    }

    async function shareLink() {
        const url = location.href;
        // Try advanced share with file if supported
        try {
            if (navigator.canShare && window.htmlToImage) {
                const card = document.getElementById('card');
                const cfg = manifestCache?.card?.export || {};
                const scale = cfg.scale ?? 2;
                const bg = manifestCache?.card?.transparentBackground ? undefined : (manifestCache?.card?.backgroundColor || '#ffffff');
                const dataUrl = await window.htmlToImage.toPng(card, { cacheBust: true, pixelRatio: scale, backgroundColor: bg });
                const res = await fetch(dataUrl);
                const blob = await res.blob();
                const file = new File([blob], cfg.filename || 'invitation.png', { type: 'image/png' });

                if (navigator.canShare({ files: [file], url })) {
                    await navigator.share({ files: [file], title: document.title, text: 'Check out this invitation', url });
                    return;
                }
            }
        } catch (_) {}

        // Fallback: Web Share API with URL only
        if (navigator.share) {
            try {
                await navigator.share({ title: document.title, text: 'Check out this invitation', url });
                return;
            } catch (_) {}
        }

        // Fallback: copy URL
        try {
            await navigator.clipboard.writeText(url);
            alert('Link copied to clipboard!');
        } catch (err) {
            prompt('Copy this link:', url);
        }
    }

    // ---- Existing binding flow + card integration ----
    const buildForm = (config = {}) => {
        const holder = document.querySelector('[data-form-fields]');
        if (!holder) return;
        holder.innerHTML = '';

        (config.fields || []).forEach(field => {
            const wrap = document.createElement('div');
            wrap.className = field.fullWidth ? 'full' : '';
            const label = document.createElement('label');
            label.textContent = field.label || '';
            label.setAttribute('for', field.id);

            let input;
            if (field.type === 'textarea') input = document.createElement('textarea');
            else if (field.type === 'select') {
                input = document.createElement('select');
                (field.options || []).forEach(opt => {
                    const o = document.createElement('option');
                    o.value = opt.value;
                    o.textContent = opt.label;
                    input.appendChild(o);
                });
            } else {
                input = document.createElement('input');
                input.type = field.type || 'text';
            }

            input.id = field.id;
            input.name = field.name || field.id;
            input.placeholder = field.placeholder || '';
            if (field.required) input.required = true;

            wrap.appendChild(label);
            wrap.appendChild(input);
            holder.appendChild(wrap);
        });

        const submitBtn = document.querySelector('#rsvp-form button[type="submit"]');
        if (submitBtn && config.submit?.label) submitBtn.textContent = config.submit.label;
    };

    function applyBindings(json) {
        manifestCache = json;

        // Theme & fonts
        if (json.theme?.vars) applyThemeVars(json.theme.vars);
        if (json.theme?.fonts) ensureFontLinks(json.theme.fonts);

        // Card sizing first (so text wraps correctly)
        if (json.card) applyCardSizing(json.card);

        // Content bindings
        document.querySelectorAll('[data-bind]').forEach(el => {
            const key = el.getAttribute('data-bind');
            const value = byPath(json, key);
            setAttrOrText(el, value, key);

            const styleKey = `styles.${key.replaceAll('.', '_')}`;
            const styleObj = byPath(json, styleKey);
            if (styleObj) applyStyles(el, styleObj);
        });

        // Backgrounds & animations
        if (json.backgrounds) applyBackgrounds(json.backgrounds);
        if (json.animations) applyAnimations(json.animations);

        // Buttons
        if (json.buttons) {
            json.buttons.forEach(btn => {
                const el = document.querySelector(btn.selector);
                if (!el) return;
                if (btn.variant === 'outline') {
                    el.classList.add('ghost');
                }
                if (btn.styles) applyStyles(el, btn.styles);
                if (btn.href) el.setAttribute('href', btn.href);
            });
        }

        // Form
        if (json.form) {
            buildForm(json.form);
            const note = document.querySelector('.form-note');
            if (note && json.form.note) note.textContent = json.form.note;
        }
    }

    function wireUI() {
        const dl = document.getElementById('btn-download');
        const sh = document.getElementById('btn-share');
        if (dl) dl.addEventListener('click', downloadPNG);
        if (sh) sh.addEventListener('click', shareLink);
        window.addEventListener('resize', autoScaleToViewport);
    }



    const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
    const setWrapZoomVars = () => {
        const wrap = document.getElementById('card-wrap');
        if (wrap) wrap.style.setProperty('--zoom', String(userZoom));
    };

// (You likely already have this)
    function autoScaleToViewport() {
        const wrap = document.getElementById('card-wrap');
        const card = document.getElementById('card');
        if (!wrap || !card) return;

        const stagePadding = 24;
        const vw = window.innerWidth - stagePadding * 2;
        const vh = window.innerHeight - stagePadding * 2 - 100; // leave header

        const scaleX = vw / card.offsetWidth;
        const scaleY = vh / card.offsetHeight;
        const fitScale = Math.min(1, scaleX, scaleY); // don't upscale

        wrap.style.setProperty('--scale', fitMode ? fitScale : 1);
        setWrapZoomVars();
    }

// ==== Wire zoom UI ====
    function wireZoomUI() {
        const minus = document.getElementById('z-out');
        const plus = document.getElementById('z-in');
        const reset = document.getElementById('z-reset');
        const fit = document.getElementById('z-fit');
        const range = document.getElementById('z-range');
        const label = document.getElementById('z-label');

        const syncLabel = () => {
            const pct = Math.round(userZoom * 100);
            if (label) label.textContent = `${pct}%`;
            if (range) range.value = String(pct);
        };

        const applyZoom = (zoomVal) => {
            userZoom = clamp(zoomVal, 0.25, 4); // 25%–400%
            fitMode = false;                    // manual zoom disables fit
            autoScaleToViewport();              // recompute --scale + --zoom
            syncLabel();
        };

        minus?.addEventListener('click', () => applyZoom(userZoom - 0.1));
        plus?.addEventListener('click', () => applyZoom(userZoom + 0.1));
        reset?.addEventListener('click', () => { userZoom = 1; fitMode = false; autoScaleToViewport(); syncLabel(); });
        fit?.addEventListener('click', () => { fitMode = true; userZoom = 1; autoScaleToViewport(); syncLabel(); });
        range?.addEventListener('input', (e) => {
            const val = Number(e.target.value || 100) / 100;
            applyZoom(val);
        });

        // Mouse wheel + Ctrl/Cmd → zoom; wheel alone → let page scroll
        const wrap = document.getElementById('card-wrap');
        wrap?.addEventListener('wheel', (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = e.deltaY < 0 ? 0.1 : -0.1;
                applyZoom(userZoom + delta);
            }
        }, { passive: false });

        // Double-click to zoom in; Shift + double-click to zoom out
        wrap?.addEventListener('dblclick', (e) => {
            e.preventDefault();
            applyZoom(userZoom + (e.shiftKey ? -0.2 : 0.2));
        });

        // Keyboard shortcuts: + / - / 0 / f
        window.addEventListener('keydown', (e) => {
            if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;
            if (e.key === '+' || e.key === '=') { applyZoom(userZoom + 0.1); }
            if (e.key === '-' || e.key === '_') { applyZoom(userZoom - 0.1); }
            if (e.key === '0') { userZoom = 1; fitMode = false; autoScaleToViewport(); syncLabel(); }
            if (e.key.toLowerCase() === 'f') { fitMode = true; userZoom = 1; autoScaleToViewport(); syncLabel(); }
        });

        syncLabel();
    }


    let introPlayedOnce = false;

    function shouldPlayIntro(manifest) {
        const enabled = !!manifest?.intro?.enabled;
        const useOnce = manifest?.intro?.useOnce !== false; // default true
        const seen = localStorage.getItem('inviteIntroPlayed') === '1';
        return enabled && (!useOnce || !seen);
    }

    function playEnvelopeIntro(manifest) {
        const layer = document.getElementById('intro-layer');
        if (!layer) return Promise.resolve();

        // Apply optional pattern asset from JSON
        const patternEl = document.getElementById('intro-envelope-pattern');
        if (patternEl && manifest?.intro?.patternImage) {
            patternEl.src = manifest.intro.patternImage;
            patternEl.classList.remove('hidden');
        }

        // show overlay
        layer.classList.remove('hidden');
        layer.classList.add('flex');

        // find elements
        const flap = layer.querySelector('.envelope-flap');
        const letter = layer.querySelector('.letter');

        // timing (defaults)
        const t = manifest?.intro?.timing || { flap: 900, letter: 1200, fade: 450, holdAfter: 300 };

        // play animations
        requestAnimationFrame(() => {
            flap?.classList.add('play-flap');
            letter?.classList.add('play-letter');
        });

        // finish sequence: fade out and resolve
        return new Promise((resolve) => {
            const total = Math.max(t.flap, t.letter) + t.fade + (t.holdAfter || 0);
            setTimeout(() => {
                layer.classList.add('play-fadeout');
                setTimeout(() => {
                    layer.classList.add('hidden');
                    layer.classList.remove('flex');
                    localStorage.setItem('inviteIntroPlayed', '1');
                    introPlayedOnce = true;
                    resolve();
                }, t.fade + 50);
            }, Math.max(t.flap, t.letter) + (t.holdAfter || 0));
        });
    }

    async function maybeRunIntroAndReveal(manifest) {
        if (shouldPlayIntro(manifest)) {
            // hide the real card until intro finishes (but keep layout computed)
            const wrap = document.getElementById('card-wrap');
            if (wrap) wrap.style.visibility = 'hidden';
            await playEnvelopeIntro(manifest);
            if (wrap) wrap.style.visibility = '';
        }
    }

    // Boot
    fetch('./manifest.json', { cache: 'no-store' })
        .then(r => r.json())
        .then(async (d) => {
            applyBindings(d);      // your existing function
            wireUI();              // download/share
            wireZoomUI();          // zoom bar
            autoScaleToViewport(); // initial fit
            await maybeRunIntroAndReveal(d); // <-- play intro, then reveal
        })
        .catch(err => {
            console.error('Failed to load mainfast.json', err);
            wireUI();
            wireZoomUI();
            autoScaleToViewport();
        });
    window.addEventListener('resize', autoScaleToViewport);
})();


