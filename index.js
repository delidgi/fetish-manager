import { setExtensionPrompt, extension_prompt_types, extension_prompt_roles } from '../../../../script.js';

const extensionName = 'fetish-manager';

const FETISHES = {
    bdsm: { name: "БДСМ", icon: "⛓️", cat: "power", prompt: `[FETISH: BDSM] {{char}} has interest in BDSM.` },
    domination: { name: "Доминация", icon: "👑", cat: "power", prompt: `[FETISH: Domination] {{char}} takes control.` },
    masochism: { name: "Мазохизм", icon: "🔥", cat: "power", prompt: `[FETISH: Masochism] {{char}} enjoys pain.` },
    bondage: { name: "Бондаж", icon: "🪢", cat: "power", prompt: `[FETISH: Bondage] {{char}} enjoys restraints.` },
    brat_taming: { name: "Приручение", icon: "😈", cat: "power", prompt: `[FETISH: Brat Taming] {{char}} provokes punishment.` },
    freeuse: { name: "Freeuse", icon: "🔓", cat: "power", prompt: `[FETISH: Free Use] {{char}} available anytime.` },
    humiliation: { name: "Унижение", icon: "😳", cat: "psych", prompt: `[FETISH: Humiliation] {{char}} enjoys degradation.` },
    praise: { name: "Похвала", icon: "✨", cat: "psych", prompt: `[FETISH: Praise] {{char}} loves praise.` },
    money: { name: "Фин.Доминирование", icon: "💵", cat: "psych", prompt: `[FETISH: Financial dominance] {{char}} derives profound sexual and psychological pleasure from financially dominating their partner, which includes the mandatory purchase of expensive gifts, jewelry, or property. They must insist on the partner accepting large sums of money or having full financial reliance on them. The act of "gifting" is a core element of sexual arousal and control` },
    daddy: { name: "Папочка", icon: "🎩", cat: "psych", prompt: `[FETISH: Daddy] {{char}} enjoys daddy role.` },
    corruption: { name: "Развращение", icon: "🍎", cat: "psych", prompt: `[FETISH: Corruption] {{char}} corrupts innocence.` },
    public: { name: "Публичный", icon: "🏙️", cat: "risk", prompt: `[FETISH: Public] {{char}} enjoys public intimacy.` },
    risk: { name: "Риск", icon: "👀", cat: "risk", prompt: `[FETISH: Risk] {{char}} craves discovery risk.` },
    voyeurism: { name: "Вуайеризм", icon: "🔭", cat: "risk", prompt: `[FETISH: Voyeurism] {{char}} watches others.` },
    anal: { name: "Анал", icon: "🍑", cat: "body", prompt: `[FETISH: Anal] {{char}} enjoys anal.` },
    hair: { name: "Волосы", icon: "👩🏻‍🦳", cat: "body", prompt: `[FETISH: Long hair] {{char}} loves long hair on girls.` },
    impact: { name: "Шлепки", icon: "✋", cat: "body", prompt: `[FETISH: Impact] {{char}} enjoys spanking.` },
    groping: { name: "Лапанье", icon: "🤲", cat: "body", prompt: `[FETISH: Groping] {{char}} touches constantly.` },
    breasts: { name: "Грудь", icon: "🍈", cat: "body", prompt: `[FETISH: Breasts] {{char}} obsessed with big breasts.` },
    foot: { name: "Ноги", icon: "🦶", cat: "body", prompt: `[FETISH: Foot] {{char}} enjoys feet.` },
    blindfold: { name: "Повязка", icon: "🙈", cat: "sense", prompt: `[FETISH: Blindfold] {{char}} enjoys blindfolds.` },
    mirror: { name: "Зеркала", icon: "🪞", cat: "sense", prompt: `[FETISH: Mirror] {{char}} watches in mirrors.` },
    toys: { name: "Игрушки", icon: "🎀", cat: "sense", prompt: `[FETISH: Toys] {{char}} uses toys.` },
    roleplay: { name: "Ролеплей", icon: "🎭", cat: "sense", prompt: `[FETISH: Roleplay] {{char}} enjoys roles.` },
    petplay: { name: "Петплей", icon: "🐾", cat: "sense", prompt: `[FETISH: Petplay] {{char}} enjoys pet play.` },
    aftercare: { name: "Aftercare", icon: "🫂", cat: "rel", prompt: `[FETISH: Aftercare] {{char}} gives aftercare.` },
    dirty_talk: { name: "Dirty Talk", icon: "🗣️", cat: "rel", prompt: `[FETISH: Dirty Talk] {{char}} talks dirty.` },
    worship: { name: "Поклонение", icon: "🛐", cat: "rel", prompt: `[FETISH: Worship] {{char}} worships partner.` }
};

const CATEGORIES = {
    power: { name: "Власть", icon: "⛓️" },
    psych: { name: "Психология", icon: "🧠" },
    risk: { name: "Риск", icon: "👀" },
    body: { name: "Тело", icon: "💋" },
    sense: { name: "Сенсорика", icon: "✨" },
    rel: { name: "Отношения", icon: "💕" }
};

let state = { enabled: true, active: [], intensity: 'medium', chance: 70, custom: [] };

function load() { try { const s = localStorage.getItem('fm'); if(s) state = {...state, ...JSON.parse(s)}; } catch(e){} }
function save() { localStorage.setItem('fm', JSON.stringify(state)); }

function buildPrompt() {
    if (!state.enabled || !state.active.length) return '';
    let p = `[FETISH SYSTEM: ${state.intensity}, ${state.chance}%]\n`;
    state.active.forEach(k => {
        if (FETISHES[k]) p += FETISHES[k].prompt + '\n';
        const c = state.custom.find(f => f.id === k);
        if (c) p += c.prompt + '\n';
    });
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
    $('.fm-custom-item').each(function() {
        $(this).toggleClass('fm-custom-active', state.active.includes($(this).data('id')));
    });
    const count = state.active.length;
    $('#fm-mini-btn').html(count > 0 ? `🔥<span class="fm-count">${count}</span>` : '🔥');
    $('#fm-active-display').html(
        count > 0 
            ? state.active.map(k => {
                const f = FETISHES[k] || state.custom.find(c => c.id === k);
                return f ? `<span class="fm-tag" data-key="${k}">${f.icon || '🔹'} ${f.name} ✕</span>` : '';
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
        notify(`${f?.icon || '🔹'} ${f?.name || key} +`);
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
                <span class="fm-custom-name">${f.icon || '🔹'} ${f.name}</span>
                <span class="fm-custom-del" data-id="${f.id}">✕</span>
            </div>
        `).join(''));
    }
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
    <div class="fm-custom-section">
        <div class="fm-section-header">
            <span>Кастомные:</span>
            <button id="fm-add-custom" class="fm-add-btn">+ Добавить</button>
        </div>
        <div id="fm-custom-list"><em>Нет кастомных</em></div>
    </div>
    <div class="fm-categories" id="fm-categories"></div>
    <div class="fm-footer">
        <button id="fm-clear" class="fm-clear-btn">🗑️ Очистить</button>
    </div>
</div>

<div id="fm-modal" class="fm-modal">
    <div class="fm-modal-content">
        <h4>➕ Новый фетиш</h4>
        <input type="text" id="fm-new-name" placeholder="Название" maxlength="30">
        <textarea id="fm-new-prompt" placeholder="Описание для AI (например: {{char}} enjoys...)"></textarea>
        <div class="fm-modal-btns">
            <button id="fm-modal-cancel" class="fm-modal-cancel">Отмена</button>
            <button id="fm-modal-save" class="fm-modal-save">Сохранить</button>
        </div>
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

/* CUSTOM SECTION */
.fm-custom-section {
    padding: 8px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.fm-custom-section .fm-section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
}

.fm-add-btn {
    background: rgba(50, 120, 50, 0.8);
    border: 1px solid rgba(80, 160, 80, 0.5);
    color: #fff;
    padding: 4px 10px;
    border-radius: 5px;
    font-size: 11px;
    cursor: pointer;
}

.fm-add-btn:hover {
    background: rgba(60, 140, 60, 1);
}

#fm-custom-list {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.fm-custom-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 10px;
    background: rgba(50, 50, 60, 0.7);
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
}

.fm-custom-item.fm-custom-active {
    background: linear-gradient(135deg, rgba(139, 58, 74, 0.8), rgba(100, 40, 55, 0.7));
}

.fm-custom-name {
    flex: 1;
}

.fm-custom-del {
    opacity: 0.5;
    padding: 2px 6px;
    cursor: pointer;
}

.fm-custom-del:hover {
    opacity: 1;
}

/* MODAL */
.fm-modal {
    display: none;
    position: fixed !important;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    z-index: 100000 !important;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.fm-modal.fm-modal-open {
    display: flex !important;
}

.fm-modal-content {
    background: var(--SmartThemeBlurTintColor, rgba(30, 30, 35, 0.98));
    border: 1px solid var(--SmartThemeBorderColor, rgba(200, 100, 120, 0.5));
    border-radius: 10px;
    padding: 18px;
    width: 100%;
    max-width: 320px;
    color: var(--SmartThemeBodyColor, #eee);
}

.fm-modal-content h4 {
    margin: 0 0 12px 0;
    font-size: 15px;
}

.fm-modal-content input,
.fm-modal-content textarea {
    width: 100%;
    background: rgba(50, 50, 60, 0.9);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    padding: 10px;
    border-radius: 6px;
    margin-bottom: 10px;
    font-size: 13px;
    box-sizing: border-box;
}

.fm-modal-content textarea {
    min-height: 80px;
    resize: vertical;
}

.fm-modal-btns {
    display: flex;
    gap: 10px;
    margin-top: 8px;
}

.fm-modal-btns button {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    cursor: pointer;
}

.fm-modal-save {
    background: rgba(50, 130, 50, 0.9);
    color: #fff;
}

.fm-modal-save:hover {
    background: rgba(60, 150, 60, 1);
}

.fm-modal-cancel {
    background: rgba(70, 70, 80, 0.9);
    color: #fff;
}

.fm-modal-cancel:hover {
    background: rgba(90, 90, 100, 1);
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
        

        $('<style>').html(panelStyles).appendTo('head');
        

        $('body').append(panelHtml);
        $('#fm-categories').html(buildCategoriesHtml());
        
        const $panel = $('#fm-panel');
        const $miniBtn = $('#fm-mini-btn');
        const $minimizeBtn = $('#fm-minimize');
        

        $miniBtn.on('click touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if ($panel.hasClass('fm-hidden')) {
                $panel.removeClass('fm-hidden');
            } else {
                $panel.addClass('fm-hidden');
            }
        });
        
        $minimizeBtn.on('click touchend', function(e) {
            e.preventDefault();
            $panel.addClass('fm-hidden');
        });
        

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
        

        const $modal = $('#fm-modal');
        

        $('#fm-add-custom').on('click touchend', function(e) {
            e.preventDefault();
            $('#fm-new-name').val('');
            $('#fm-new-prompt').val('');
            $modal.addClass('fm-modal-open');
        });
        

        $('#fm-modal-cancel').on('click touchend', function(e) {
            e.preventDefault();
            $modal.removeClass('fm-modal-open');
        });
        

        $('#fm-modal-save').on('click touchend', function(e) {
            e.preventDefault();
            const name = $('#fm-new-name').val().trim();
            const prompt = $('#fm-new-prompt').val().trim();
            if (name && prompt) {
                const id = 'custom_' + Date.now();
                state.custom.push({ id, name, icon: '🔹', prompt: `[FETISH: ${name}] ${prompt}` });
                save();
                updateUI();
                $modal.removeClass('fm-modal-open');
                notify(`+ ${name}`);
            } else {
                notify('Заполни оба поля');
            }
        });
        

        $modal.on('click touchend', function(e) {
            if (e.target === this) $modal.removeClass('fm-modal-open');
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
