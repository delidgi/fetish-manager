import { setExtensionPrompt, extension_prompt_types, extension_prompt_roles } from '../../../../script.js';

const extensionName = 'fetish-manager';

const FETISHES = {
   bdsm: { name: "БДСМ", icon: "⛓️", cat: "power", prompt: `{{char}} enjoys BDSM — bondage, discipline, dominance/submission.` },
        domination: { name: "Доминирование", icon: "👑", cat: "power", prompt: `{{char}} derives pleasure from taking control and authority.` },
        masochism: { name: "Мазохизм", icon: "🔥", cat: "power", prompt: `{{char}} derives pleasure from receiving pain.` },
        bondage: { name: "Бондаж", icon: "🪢", cat: "power", prompt: `{{char}} enjoys restraining or being restrained.` },
        brat_taming: { name: "Приручение", icon: "😈", cat: "power", prompt: `{{char}} provokes to elicit punishment and taming.` },
        freeuse: { name: "Свободное использование", icon: "🔓", cat: "power", prompt: `{{char}} can be used sexually anytime without warning.` },
        
        humiliation: { name: "Унижение", icon: "😳", cat: "psych", prompt: `{{char}} enjoys being humiliated and degraded.` },
        praise: { name: "Похвала", icon: "✨", cat: "psych", prompt: `{{char}} loves praising partner — "good girl/boy".` },
        daddy: { name: "Папочка", icon: "🎩", cat: "psych", prompt: `{{char}} aroused by being called "Daddy".` },
        corruption: { name: "Развращение", icon: "🍎", cat: "psych", prompt: `{{char}} enjoys corrupting innocence progressively.` },
        
        public: { name: "Публичный секс", icon: "🏙️", cat: "risk", prompt: `{{char}} aroused by intimacy in public spaces.` },
        risk: { name: "На грани", icon: "👀", cat: "risk", prompt: `{{char}} craves hidden intimacy while appearing normal.` },
        voyeurism: { name: "Вуайеризм", icon: "🔭", cat: "risk", prompt: `{{char}} derives pleasure from watching others.` },
        
        anal: { name: "Анал", icon: "🍑", cat: "body", prompt: `{{char}} derives pleasure from anal sex.` },
        gagging: { name: "Гаггинг", icon: "💦", cat: "body", prompt: `{{char}} aroused by gagging and deep oral.` },
        impact: { name: "Шлепки", icon: "✋", cat: "body", prompt: `{{char}} enjoys spanking and impact play.` },
        groping: { name: "Лапанье", icon: "🤲", cat: "body", prompt: `{{char}} constantly touches partner possessively.` },
        size_diff: { name: "Размеры", icon: "📏", cat: "body", prompt: `{{char}} aroused by size difference with partner.` },
        breasts: { name: "Грудь", icon: "🍈", cat: "body", prompt: `{{char}} obsessed with breasts.` },
        foot: { name: "Футфетиш", icon: "🦶", cat: "body", prompt: `{{char}} aroused by feet.` },
        blood: { name: "Кровь", icon: "🩸", cat: "body", prompt: `{{char}} aroused by sight of blood.` },
        pregnancy: { name: "Беременность", icon: "🤰", cat: "body", prompt: `{{char}} aroused by pregnancy.` },
        
        blindfold: { name: "Повязка", icon: "🙈", cat: "sense", prompt: `{{char}} aroused by blindfolded sex.` },
        mirror: { name: "Зеркала", icon: "🪞", cat: "sense", prompt: `{{char}} aroused by watching in mirrors.` },
        latex: { name: "Латекс", icon: "🖤", cat: "sense", prompt: `{{char}} aroused by latex clothing.` },
        toys: { name: "Игрушки", icon: "🎀", cat: "sense", prompt: `{{char}} enjoys using sex toys.` },
        roleplay: { name: "Ролеплей", icon: "🎭", cat: "sense", prompt: `{{char}} enjoys costumes and role-playing.` },
        petplay: { name: "Петплей", icon: "🐾", cat: "sense", prompt: `{{char}} enjoys pet/owner dynamics.` },
        
        aftercare: { name: "Aftercare", icon: "🫂", cat: "rel", prompt: `{{char}} devoted to post-sex care and comfort.` },
        dirty_talk: { name: "Dirty talk", icon: "🗣️", cat: "rel", prompt: `{{char}} enjoys explicit verbal exchange.` },
        worship: { name: "Поклонение", icon: "🛐", cat: "rel", prompt: `{{char}} worships partner's body.` },
        variety: { name: "Разнообразие", icon: "🎲", cat: "rel", prompt: `{{char}} craves sexual variety.` },
        gangbang: { name: "Групповой", icon: "👥", cat: "rel", prompt: `{{char}} enjoys group sex.` }
};

const CATEGORIES = {
    power: { name: "Власть", icon: "⛓️" },
    psych: { name: "Психология", icon: "🧠" },
    risk: { name: "Риск", icon: "👀" },
    body: { name: "Тело", icon: "💋" },
    sense: { name: "Сенсорика", icon: "✨" },
    rel: { name: "Отношения", icon: "💕" }
};

let state = { enabled: true, active: [], intensity: 'medium', chance: 70 };

function load() { try { const s = localStorage.getItem('fm'); if(s) state = {...state, ...JSON.parse(s)}; } catch(e){} }
function save() { localStorage.setItem('fm', JSON.stringify(state)); }

function buildPrompt() {
    if (!state.enabled || !state.active.length) return '';
    let p = `[FETISH SYSTEM: ${state.intensity}, ${state.chance}%]\n`;
    state.active.forEach(k => { if(FETISHES[k]) p += FETISHES[k].prompt + '\n'; });
    return p;
}

function apply() {
    setExtensionPrompt(extensionName, buildPrompt(), extension_prompt_types.IN_CHAT, 0, true, false, null, extension_prompt_roles.SYSTEM);
}

function notify(msg) {
    if (typeof toastr !== 'undefined') {
        toastr.info(msg, 'Fetish Manager', { timeOut: 2000, positionClass: 'toast-top-center' });
    }
}

function updateUI() {
    $('.fm-fetish-btn').each(function() {
        $(this).toggleClass('fm-active', state.active.includes($(this).data('key')));
    });
    const count = state.active.length;
    $('#fm-mini-btn').html(count > 0 ? `🔥<span class="fm-count">${count}</span>` : '🔥');
    $('#fm-active-display').html(
        count > 0 
            ? state.active.map(k => FETISHES[k] ? `<span class="fm-tag" data-key="${k}">${FETISHES[k].icon} ${FETISHES[k].name} ✕</span>` : '').join('')
            : '<em>Не выбрано</em>'
    );
}

function toggle(key) {
    const i = state.active.indexOf(key);
    const f = FETISHES[key];
    if (i < 0) {
        state.active.push(key);
        notify(`${f?.icon || ''} ${f?.name || key} +`);
    } else {
        state.active.splice(i, 1);
        notify(`${f?.name || key} −`);
    }
    updateUI();
    apply();
    save();
}

// HTML
function buildCategoriesHtml() {
    let html = '';
    for (const [ck, c] of Object.entries(CATEGORIES)) {
        const btns = Object.entries(FETISHES)
            .filter(([_, f]) => f.cat === ck)
            .map(([k, f]) => `<button class="fm-fetish-btn" data-key="${k}">${f.icon} ${f.name}</button>`)
            .join('');
        html += `<div class="fm-category"><div class="fm-cat-header">${c.icon} ${c.name}</div><div class="fm-cat-items">${btns}</div></div>`;
    }
    return html;
}

const panelHtml = `
<div id="fm-panel" class="fm-container fm-hidden">
    <div class="fm-header">
        <h4 id="fm-drag-handle">🔥 Fetish Manager</h4>
        <button id="fm-minimize" class="fm-minimize-btn"><i class="fa-solid fa-minus"></i></button>
    </div>
    <div class="fm-controls">
        <label><input type="checkbox" id="fm-enabled" checked> Включено</label>
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
    <div class="fm-categories" id="fm-categories"></div>
    <div class="fm-footer">
        <button id="fm-clear" class="fm-clear-btn">🗑️ Очистить</button>
    </div>
</div>

<div id="fm-mini-btn" class="fm-mini-btn">🔥</div>
`;

const panelStyles = `
/* МИНИ-КНОПКА - ВСЕГДА ВИДНА */
.fm-mini-btn {
    position: fixed !important;
    z-index: 99999 !important;
    top: 120px;
    right: 15px;
    width: 50px;
    height: 50px;
    background: var(--SmartThemeBlurTintColor, rgba(139, 58, 74, 0.95)) !important;
    border: 2px solid var(--SmartThemeBorderColor, rgba(200, 100, 120, 0.6)) !important;
    border-radius: 50%;
    display: flex !important;
    align-items: center;
    justify-content: center;
    color: var(--SmartThemeBodyColor, #fff) !important;
    font-size: 1.4em;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
}

.fm-mini-btn:hover {
    background: var(--SmartThemeBorderColor, rgba(180, 70, 90, 1)) !important;
    transform: scale(1.1);
}

.fm-mini-btn .fm-count {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #e74c3c;
    color: white;
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 10px;
    font-weight: bold;
}

/* ОСНОВНАЯ ПАНЕЛЬ */
.fm-container {
    position: fixed !important;
    z-index: 99999 !important;
    top: 50px;
    right: 15px;
    width: 280px;
    max-height: 75vh;
    background: var(--SmartThemeBlurTintColor, rgba(25, 25, 30, 0.97)) !important;
    border: 1px solid var(--SmartThemeBorderColor, rgba(200, 100, 120, 0.5)) !important;
    border-radius: 10px;
    display: flex !important;
    flex-direction: column;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 13px;
    color: var(--SmartThemeBodyColor, #eee) !important;
    overflow: hidden;
}

.fm-container.fm-hidden {
    display: none !important;
}

/* HEADER */
.fm-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 12px;
    background: linear-gradient(135deg, rgba(139, 58, 74, 0.6), rgba(90, 35, 50, 0.4));
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.fm-header h4 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    cursor: move;
    flex-grow: 1;
    text-align: center;
}

.fm-minimize-btn {
    background: none;
    border: none;
    color: var(--SmartThemeBodyColor, #fff);
    font-size: 16px;
    cursor: pointer;
    padding: 5px 8px;
    opacity: 0.7;
}

.fm-minimize-btn:hover {
    opacity: 1;
}

/* CONTROLS */
.fm-controls {
    padding: 10px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.fm-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.fm-controls select,
.fm-controls input[type="range"] {
    flex: 1;
    background: var(--SmartThemeBlurTintColor, rgba(50, 50, 60, 0.9));
    border: 1px solid var(--SmartThemeBorderColor, rgba(255, 255, 255, 0.2));
    color: var(--SmartThemeBodyColor, #fff);
    padding: 5px;
    border-radius: 5px;
}

.fm-controls input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin-right: 5px;
}

/* ACTIVE SECTION */
.fm-active-section {
    padding: 8px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.fm-section-header {
    font-size: 11px;
    opacity: 0.6;
    margin-bottom: 6px;
    text-transform: uppercase;
}

#fm-active-display {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    min-height: 24px;
}

.fm-tag {
    background: rgba(139, 58, 74, 0.8);
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 11px;
    cursor: pointer;
}

.fm-tag:hover {
    background: rgba(180, 70, 90, 1);
}

/* CATEGORIES */
.fm-categories {
    flex: 1;
    overflow-y: auto;
    padding: 8px 12px;
    -webkit-overflow-scrolling: touch;
}

.fm-category {
    margin-bottom: 12px;
}

.fm-cat-header {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 6px;
    opacity: 0.8;
    padding-bottom: 3px;
    border-bottom: 1px dashed rgba(255, 255, 255, 0.15);
}

.fm-cat-items {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
}

.fm-fetish-btn {
    padding: 6px 9px;
    background: var(--SmartThemeBlurTintColor, rgba(50, 50, 60, 0.8));
    border: 1px solid var(--SmartThemeBorderColor, rgba(255, 255, 255, 0.15));
    border-radius: 6px;
    color: var(--SmartThemeBodyColor, #ddd);
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s ease;
}

.fm-fetish-btn:hover {
    background: var(--SmartThemeBorderColor, rgba(70, 70, 80, 0.9));
    transform: translateY(-1px);
}

.fm-fetish-btn.fm-active {
    background: linear-gradient(135deg, rgba(139, 58, 74, 0.9), rgba(100, 40, 55, 0.8)) !important;
    border-color: rgba(200, 80, 100, 0.6) !important;
    color: #fff !important;
    box-shadow: 0 0 10px rgba(139, 58, 74, 0.4);
}

/* FOOTER */
.fm-footer {
    padding: 8px 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.fm-clear-btn {
    width: 100%;
    padding: 8px;
    background: rgba(80, 30, 30, 0.8);
    border: 1px solid rgba(150, 50, 50, 0.5);
    border-radius: 6px;
    color: #fff;
    cursor: pointer;
    font-size: 12px;
}

.fm-clear-btn:hover {
    background: rgba(100, 40, 40, 1);
}

/* SCROLLBAR */
.fm-categories::-webkit-scrollbar {
    width: 4px;
}

.fm-categories::-webkit-scrollbar-thumb {
    background: rgba(139, 58, 74, 0.5);
    border-radius: 2px;
}
`;

jQuery(async () => {
    try {
        load();
        
        // Добавляем стили
        $('<style>').html(panelStyles).appendTo('head');
        
        // Добавляем HTML
        $('body').append(panelHtml);
        $('#fm-categories').html(buildCategoriesHtml());
        
        const $panel = $('#fm-panel');
        const $miniBtn = $('#fm-mini-btn');
        const $minimizeBtn = $('#fm-minimize');
        
        // МИНИ-КНОПКА: показать/скрыть панель
        $miniBtn.on('click touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($panel.hasClass('fm-hidden')) {
                $panel.removeClass('fm-hidden');
            } else {
                $panel.addClass('fm-hidden');
            }
        });
        
        // Кнопка сворачивания
        $minimizeBtn.on('click touchend', function(e) {
            e.preventDefault();
            $panel.addClass('fm-hidden');
        });
        
        // Настройки
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
        
        // Клики по фетишам
        $(document).on('click touchend', '.fm-fetish-btn', function(e) {
            e.preventDefault();
            toggle($(this).data('key'));
        });
        
        // Удаление из активных
        $(document).on('click touchend', '.fm-tag', function(e) {
            e.preventDefault();
            toggle($(this).data('key'));
        });
        
        // Очистить
        $('#fm-clear').on('click touchend', function(e) {
            e.preventDefault();
            state.active = [];
            updateUI();
            apply();
            save();
            notify('Очищено');
        });
        
        // ДРАГ ПАНЕЛИ
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
        
        // ДРАГ МИНИ-КНОПКИ
        let isMiniDragging = false;
        let miniOffset = { x: 0, y: 0 };
        
        $miniBtn.on('mousedown touchstart', function(e) {
            isMiniDragging = true;
            const pos = $miniBtn.position();
            $miniBtn.css({ top: pos.top + 'px', left: pos.left + 'px', right: 'auto', bottom: 'auto' });
            const coords = getCoords(e);
            miniOffset = { x: coords.x - pos.left, y: coords.y - pos.top };
            e.preventDefault();
            e.stopPropagation();
        });
        
        $(document).on('mousemove touchmove', function(e) {
            if (!isMiniDragging) return;
            const coords = getCoords(e);
            $miniBtn.css({ top: (coords.y - miniOffset.y) + 'px', left: (coords.x - miniOffset.x) + 'px' });
            e.preventDefault();
        });
        
        $(document).on('mouseup touchend', function() {
            isMiniDragging = false;
        });
        
        updateUI();
        apply();
        
        console.log('[Fetish Manager] v8 Ready!');
        
    } catch (error) {
        console.error('[Fetish Manager] Error:', error);
    }
});
