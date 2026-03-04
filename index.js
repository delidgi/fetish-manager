import { setExtensionPrompt, extension_prompt_types, eventSource, event_types } from '../../../../script.js';

const extensionName = 'fetish-manager';

const FETISHES = {
    bdsm: { name: "БДСМ", icon: "fa-solid fa-link", cat: "power", prompt: `[FETISH: BDSM] {{char}} has interest in BDSM.` },
    domination: { name: "Доминация", icon: "fa-solid fa-crown", cat: "power", prompt: `[FETISH: Domination] {{char}} takes control.` },
    masochism: { name: "Мазохизм", icon: "fa-solid fa-fire", cat: "power", prompt: `[FETISH: Masochism] {{char}} enjoys pain.` },
    bondage: { name: "Бондаж", icon: "fa-solid fa-hands-bound", cat: "power", prompt: `[FETISH: Bondage] {{char}} enjoys restraints.` },
    brat_taming: { name: "Приручение", icon: "fa-solid fa-bolt", cat: "power", prompt: `[FETISH: Brat Taming] {{char}} provokes punishment.` },
    freeuse: { name: "Freeuse", icon: "fa-solid fa-lock-open", cat: "power", prompt: `[FETISH: Free Use] {{char}} available anytime.` },
    humiliation: { name: "Унижение", icon: "fa-solid fa-face-flushed", cat: "psych", prompt: `[FETISH: Humiliation] {{char}} enjoys degradation.` },
    praise: { name: "Похвала", icon: "fa-solid fa-star", cat: "psych", prompt: `[FETISH: Praise] {{char}} loves praise.` },
    money: { name: "Фин.Доминирование", icon: "fa-solid fa-money-bill-wave", cat: "psych", prompt: `[FETISH: Financial dominance] {{char}} derives profound sexual and psychological pleasure from financially dominating their partner, which includes the mandatory purchase of expensive gifts, jewelry, or property. They must insist on the partner accepting large sums of money or having full financial reliance on them. The act of "gifting" is a core element of sexual arousal and control` },
    daddy: { name: "Папочка", icon: "fa-solid fa-user-tie", cat: "psych", prompt: `[FETISH: Daddy] {{char}} enjoys daddy role.` },
    lactation: { name: "Лактация", icon: "fa-solid fa-droplet", cat: "psych", prompt: `[FETISH: Lactation] {{char}} has a lactation fetish and focuses on breast milk and nursing.` },
    pregnancy: { name: "Беременность", icon: "fa-solid fa-person-pregnant", cat: "psych", prompt: `[FETISH: Pregnancy] {{char}} has a pregnancy fetish and focuses on the state of being pregnant and gravidity.` },
    corruption: { name: "Развращение", icon: "fa-solid fa-apple-whole", cat: "psych", prompt: `[FETISH: Corruption] {{char}} corrupts innocence.` },
    public: { name: "Публичный", icon: "fa-solid fa-city", cat: "risk", prompt: `[FETISH: Public] {{char}} enjoys public intimacy.` },
    risk: { name: "Риск", icon: "fa-solid fa-eye", cat: "risk", prompt: `[FETISH: Risk] {{char}} craves discovery risk.` },
    voyeurism: { name: "Вуайеризм", icon: "fa-solid fa-binoculars", cat: "risk", prompt: `[FETISH: Voyeurism] {{char}} watches others.` },
    anal: { name: "Анал", icon: "fa-solid fa-peach", cat: "body", prompt: `[FETISH: Anal] {{char}} enjoys anal.` },
    hair: { name: "Волосы", icon: "fa-solid fa-wand-magic-sparkles", cat: "body", prompt: `[FETISH: Long hair] {{char}} loves long hair on girls.` },
    impact: { name: "Шлепки", icon: "fa-solid fa-hand", cat: "body", prompt: `[FETISH: Impact] {{char}} enjoys spanking.` },
    groping: { name: "Лапанье", icon: "fa-solid fa-hands", cat: "body", prompt: `[FETISH: Groping] {{char}} touches constantly.` },
    breasts: { name: "Грудь", icon: "fa-solid fa-lemon", cat: "body", prompt: `[FETISH: Breasts] {{char}} obsessed with big breasts.` },
    foot: { name: "Ноги", icon: "fa-solid fa-socks", cat: "body", prompt: `[FETISH: Foot] {{char}} enjoys feet.` },
    blindfold: { name: "Повязка", icon: "fa-solid fa-eye-slash", cat: "sense", prompt: `[FETISH: Blindfold] {{char}} enjoys blindfolds.` },
    mirror: { name: "Зеркала", icon: "fa-solid fa-clone", cat: "sense", prompt: `[FETISH: Mirror] {{char}} watches in mirrors.` },
    toys: { name: "Игрушки", icon: "fa-solid fa-ribbon", cat: "sense", prompt: `[FETISH: Toys] {{char}} uses toys.` },
    roleplay: { name: "Ролеплей", icon: "fa-solid fa-masks-theater", cat: "sense", prompt: `[FETISH: Roleplay] {{char}} enjoys roles.` },
    petplay: { name: "Петплей", icon: "fa-solid fa-paw", cat: "sense", prompt: `[FETISH: Petplay] {{char}} enjoys pet play.` },
    aftercare: { name: "Aftercare", icon: "fa-solid fa-heart-pulse", cat: "rel", prompt: `[FETISH: Aftercare] {{char}} gives aftercare.` },
    dirty_talk: { name: "Dirty Talk", icon: "fa-solid fa-comment-dots", cat: "rel", prompt: `[FETISH: Dirty Talk] {{char}} talks dirty.` },
    worship: { name: "Поклонение", icon: "fa-solid fa-hand-holding-heart", cat: "rel", prompt: `[FETISH: Worship] {{char}} worships partner.` }
};

const CATEGORIES = {
    power: { name: "Власть", icon: "fa-solid fa-link" },
    psych: { name: "Психология", icon: "fa-solid fa-brain" },
    risk: { name: "Риск", icon: "fa-solid fa-eye" },
    body: { name: "Тело", icon: "fa-solid fa-heart" },
    sense: { name: "Сенсорика", icon: "fa-solid fa-wand-sparkles" },
    rel: { name: "Отношения", icon: "fa-solid fa-heart-pulse" }
};

let state = { enabled: true, active: [], intensity: 'medium', chance: 70, custom: [], showFloating: true };

function load() { try { const s = localStorage.getItem('fm'); if(s) state = {...state, ...JSON.parse(s)}; } catch(e){} }
function save() { localStorage.setItem('fm', JSON.stringify(state)); }

function buildPrompt() {
    if (!state.enabled || !state.active.length) return '';

    const intensityMap = {
        low: 'очень лёгкие намёки, едва заметно',
        medium: 'умеренно, естественно вплетать',
        high: 'ярко выражено, акцент на фетише'
    };

    let fetishList = [];
    state.active.forEach(k => {
        if (FETISHES[k]) fetishList.push(FETISHES[k].prompt);
        const c = state.custom.find(f => f.id === k);
        if (c) fetishList.push(c.prompt);
    });

    const roll = Math.floor(Math.random() * 100) + 1;
    const triggered = roll <= state.chance;

    const randomFetishKey = state.active[Math.floor(Math.random() * state.active.length)];
    const randomFetish = FETISHES[randomFetishKey] || state.custom.find(f => f.id === randomFetishKey);

    let p = `[OOC: FETISH SYSTEM]
━━━━━━━━━━━━━━━━━━━━━━━━━━
БРОСОК: ${roll} из 100 (порог: ${state.chance}%)
${triggered ? `СРАБОТАЛО! Фетиш этого ответа: ${randomFetish?.name || randomFetishKey}` : `НЕ СРАБОТАЛО — пиши ВАНИЛЬНО (без фетишей)`}

Интенсивность: ${state.intensity} (${intensityMap[state.intensity]})

ВСЕ АКТИВНЫЕ ФЕТИШИ (для справки):
${fetishList.join('\n')}

ПРАВИЛА:
${triggered
    ? `• Интегрируй "${randomFetish?.name || randomFetishKey}" ЕСТЕСТВЕННО в сцену
• НЕ объявляй фетиш словами, просто покажи через действия/диалог
• Если контекст неподходящий (не интим) — добавь лёгкий намёк или отложи`
    : `• Пиши ВАНИЛЬНУЮ сцену БЕЗ явных фетишей
• Можно добавить ОЧЕНЬ лёгкий намёк, но не более
• НЕ ФОРСЬ фетиши — бросок не прошёл!`}
━━━━━━━━━━━━━━━━━━━━━━━━━━]
`;
    return p;
}

function apply() {
    const prompt = buildPrompt();
    setExtensionPrompt(extensionName, prompt, extension_prompt_types.IN_CHAT, 0);
    console.log('[Fetish Manager] Prompt applied:', prompt ? 'YES' : 'empty');
}

function notify(msg) {
    if (typeof toastr !== 'undefined') {
        toastr.info(msg, 'Fetish Manager', { timeOut: 2000, positionClass: 'toast-top-center' });
    }
}

function faIcon(cls, extra = '') {
    return `<i class="${cls}${extra ? ' ' + extra : ''}"></i>`;
}

function updateUI() {
    $('.fm-fetish-btn').each(function() {
        $(this).toggleClass('fm-active', state.active.includes($(this).data('key')));
    });
    $('.fm-custom-item').each(function() {
        $(this).toggleClass('fm-custom-active', state.active.includes($(this).data('id')));
    });
    const count = state.active.length;
    $('#fm-mini-btn').html(count > 0
        ? `${faIcon('fa-solid fa-fire')}<span class="fm-count">${count}</span>`
        : faIcon('fa-solid fa-fire'));
    // Update extension panel button counter too
    $('#fm-ext-count').text(count > 0 ? count : '');
    $('#fm-active-display').html(
        count > 0
            ? state.active.map(k => {
                const f = FETISHES[k] || state.custom.find(c => c.id === k);
                return f ? `<span class="fm-tag" data-key="${k}">${faIcon(f.icon || 'fa-solid fa-circle')} ${f.name} <i class="fa-solid fa-xmark fm-tag-x"></i></span>` : '';
            }).join('')
            : '<em>Не выбрано</em>'
    );
    renderCustomList();
}

function toggle(key) {
    const i = state.active.indexOf(key);
    const f = FETISHES[key] || state.custom.find(c => c.id === key);
    if (i < 0) {
        state.active.push(key);
        notify(`${f?.name || key} +`);
    } else {
        state.active.splice(i, 1);
        notify(`${f?.name || key} −`);
    }
    updateUI();
    apply();
    save();
}

function renderCustomList() {
    const $list = $('#fm-custom-list');
    if (state.custom.length === 0) {
        $list.html('<em>Нет кастомных</em>');
    } else {
        $list.html(state.custom.map(f => `
            <div class="fm-custom-item ${state.active.includes(f.id) ? 'fm-custom-active' : ''}" data-id="${f.id}">
                <span class="fm-custom-name">${faIcon(f.icon || 'fa-solid fa-circle')} ${f.name}</span>
                <span class="fm-custom-del" data-id="${f.id}"><i class="fa-solid fa-xmark"></i></span>
            </div>
        `).join(''));
    }
}

function buildCategoriesHtml() {
    let html = '';
    for (const [ck, c] of Object.entries(CATEGORIES)) {
        const btns = Object.entries(FETISHES)
            .filter(([_, f]) => f.cat === ck)
            .map(([k, f]) => `<button class="fm-fetish-btn" data-key="${k}">${faIcon(f.icon)} ${f.name}</button>`)
            .join('');
        html += `<div class="fm-category"><div class="fm-cat-header">${faIcon(c.icon)} ${c.name}</div><div class="fm-cat-items">${btns}</div></div>`;
    }
    return html;
}

/* ── Extension panel settings HTML (inside #extensions_settings2) ── */
const extSettingsHtml = `
<div id="fm-ext-settings" class="fm-ext-block">
    <div class="inline-drawer">
        <div class="inline-drawer-toggle inline-drawer-header">
            <b>Fetish Manager</b>
            <span id="fm-ext-count" class="fm-ext-badge"></span>
            <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
        </div>
        <div class="inline-drawer-content">
            <div class="fm-ext-row">
                <label class="checkbox_label">
                    <input type="checkbox" id="fm-ext-show-float">
                    <span>Плавающая кнопка</span>
                </label>
            </div>
            <div class="fm-ext-row">
                <button id="fm-ext-open" class="menu_button">
                    <i class="fa-solid fa-fire"></i> Открыть панель
                </button>
            </div>
        </div>
    </div>
</div>
`;

/* ── Floating panel HTML ── */
const panelHtml = `
<div id="fm-panel" class="fm-container fm-hidden">
    <div class="fm-header">
        <h4 id="fm-drag-handle"><i class="fa-solid fa-fire"></i> Fetish Manager</h4>
        <button id="fm-minimize" class="fm-minimize-btn"><i class="fa-solid fa-minus"></i></button>
    </div>
    <div class="fm-scrollable">
        <div class="fm-controls">
            <label class="checkbox_label"><input type="checkbox" id="fm-enabled" checked> Включено</label>
            <div class="fm-row">
                <span>Сила:</span>
                <select id="fm-intensity">
                    <option value="low">Слабо</option>
                    <option value="medium" selected>Средне</option>
                    <option value="high">Сильно</option>
                </select>
            </div>
            <div class="fm-row">
                <span>Шанс: <b id="fm-chance-val">70</b>%</span>
                <input type="range" id="fm-chance" min="10" max="100" value="70" step="10">
            </div>
        </div>
        <div class="fm-active-section">
            <div class="fm-section-header">Активные:</div>
            <div id="fm-active-display"><em>Не выбрано</em></div>
        </div>
        <div class="fm-custom-section">
            <div class="fm-section-header">
                <span>Кастомные:</span>
                <button id="fm-add-custom" class="fm-add-btn"><i class="fa-solid fa-plus"></i> Добавить</button>
            </div>
            <div id="fm-custom-list"><em>Нет кастомных</em></div>
        </div>
        <div class="fm-categories" id="fm-categories"></div>
    </div>
    <div class="fm-footer">
        <button id="fm-clear" class="fm-clear-btn"><i class="fa-solid fa-trash-can"></i> Очистить</button>
    </div>
</div>

<div id="fm-mini-btn" class="fm-mini-btn"><i class="fa-solid fa-fire"></i></div>
`;

jQuery(async () => {
    try {
        load();

        $('body').append(panelHtml);
        $('#extensions_settings2').append(extSettingsHtml);
        $('#fm-categories').html(buildCategoriesHtml());

        const $panel = $('#fm-panel');
        const $miniBtn = $('#fm-mini-btn');

        /* ── Floating button visibility ── */
        function applyFloatVisibility() {
            $miniBtn.toggle(!!state.showFloating);
        }
        $('#fm-ext-show-float').prop('checked', state.showFloating).on('change', function() {
            state.showFloating = this.checked;
            applyFloatVisibility();
            save();
        });
        applyFloatVisibility();

        /* ── Open panel from extension settings ── */
        $('#fm-ext-open').on('click', function(e) {
            e.preventDefault();
            $panel.removeClass('fm-hidden');
        });

        /* ── Floating mini button ── */
        let miniClickAllowed = true;
        $miniBtn.on('click touchend', function(e) {
            if (!miniClickAllowed) return;
            e.preventDefault();
            e.stopPropagation();
            $panel.toggleClass('fm-hidden');
        });

        $('#fm-minimize').on('click touchend', function(e) {
            e.preventDefault();
            $panel.addClass('fm-hidden');
        });

        /* ── Controls ── */
        $('#fm-enabled').prop('checked', state.enabled).on('change', function() {
            state.enabled = this.checked;
            apply();
            save();
        });

        $('#fm-intensity').val(state.intensity).on('change', function() {
            state.intensity = this.value;
            apply();
            save();
        });

        $('#fm-chance').val(state.chance);
        $('#fm-chance-val').text(state.chance);
        $('#fm-chance').on('input', function() {
            state.chance = parseInt(this.value);
            $('#fm-chance-val').text(this.value);
            apply();
            save();
        });

        /* ── Fetish buttons ── */
        $(document).on('click touchend', '.fm-fetish-btn', function(e) {
            e.preventDefault();
            toggle($(this).data('key'));
        });

        $(document).on('click touchend', '.fm-tag', function(e) {
            e.preventDefault();
            toggle($(this).data('key'));
        });

        $('#fm-clear').on('click touchend', function(e) {
            e.preventDefault();
            state.active = [];
            updateUI();
            apply();
            save();
            notify('Очищено');
        });

        /* ── Custom fetishes ── */
        $('#fm-add-custom').on('click touchend', function(e) {
            e.preventDefault();
            const name = prompt('Название фетиша:');
            if (!name || !name.trim()) return;

            const desc = prompt('Описание для AI (например: {{char}} enjoys...):');
            if (!desc || !desc.trim()) return;

            const id = 'custom_' + Date.now();
            state.custom.push({
                id,
                name: name.trim(),
                icon: 'fa-solid fa-circle',
                prompt: `[FETISH: ${name.trim()}] ${desc.trim()}`
            });
            save();
            updateUI();
            notify(`+ ${name.trim()}`);
        });

        $(document).on('click touchend', '.fm-custom-name', function(e) {
            e.preventDefault();
            const id = $(this).closest('.fm-custom-item').data('id');
            toggle(id);
        });

        $(document).on('click touchend', '.fm-custom-del', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const id = $(this).data('id');
            state.custom = state.custom.filter(f => f.id !== id);
            state.active = state.active.filter(a => a !== id);
            save();
            updateUI();
            apply();
            notify('Удалён');
        });

        /* ── Drag: panel ── */
        const $handle = $('#fm-drag-handle');
        let isDragging = false;
        let offset = { x: 0, y: 0 };

        function getCoords(e) {
            if (e.type.startsWith('touch') && e.touches && e.touches[0]) {
                return { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
            return { x: e.clientX, y: e.clientY };
        }

        $handle.on('mousedown touchstart', function(e) {
            isDragging = true;
            const pos = $panel.position();
            $panel.css({ top: pos.top + 'px', left: pos.left + 'px', right: 'auto', bottom: 'auto' });
            const coords = getCoords(e);
            offset = { x: coords.x - pos.left, y: coords.y - pos.top };
            e.preventDefault();
        });

        $(document).on('mousemove touchmove', function(e) {
            if (!isDragging) return;
            const coords = getCoords(e);
            $panel.css({ top: (coords.y - offset.y) + 'px', left: (coords.x - offset.x) + 'px' });
        });

        $(document).on('mouseup touchend', function() {
            isDragging = false;
        });

        /* ── Drag: mini button ── */
        let isMiniDragging = false;
        let miniOffset = { x: 0, y: 0 };
        let miniMoved = false;

        $miniBtn.on('mousedown touchstart', function(e) {
            isMiniDragging = true;
            miniMoved = false;
            miniClickAllowed = true;
            const pos = $miniBtn.position();
            $miniBtn.css({ top: pos.top + 'px', left: pos.left + 'px', right: 'auto', bottom: 'auto' });
            const coords = getCoords(e);
            miniOffset = { x: coords.x - pos.left, y: coords.y - pos.top };
            e.preventDefault();
            e.stopPropagation();
        });

        $(document).on('mousemove touchmove', function(e) {
            if (!isMiniDragging) return;
            miniMoved = true;
            miniClickAllowed = false;
            const coords = getCoords(e);
            $miniBtn.css({ top: (coords.y - miniOffset.y) + 'px', left: (coords.x - miniOffset.x) + 'px' });
            e.preventDefault();
        });

        $(document).on('mouseup touchend', function() {
            if (isMiniDragging) {
                isMiniDragging = false;
                if (miniMoved) {
                    setTimeout(() => { miniClickAllowed = true; }, 50);
                }
            }
        });

        updateUI();
        apply();

        eventSource.on(event_types.MESSAGE_SENT, () => {
            console.log('[Fetish Manager] New roll before AI response...');
            apply();
        });

        console.log('[Fetish Manager] v12 Ready!');

    } catch (error) {
        console.error('[Fetish Manager] Error:', error);
    }
});
