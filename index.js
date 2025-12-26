import { setExtensionPrompt, extension_prompt_types, extension_prompt_roles } from '../../../../script.js';

const extensionName = 'fetish-manager';

const FETISHES = {
    bdsm: { name: "БДСМ", icon: "⛓️", cat: "power", prompt: `[FETISH: BDSM] {{char}} has interest in BDSM — bondage, discipline, dominance/submission, sadomasochism.` },
    domination: { name: "Доминирование", icon: "👑", cat: "power", prompt: `[FETISH: Domination] {{char}} derives pleasure from taking control.` },
    masochism: { name: "Мазохизм", icon: "🔥", cat: "power", prompt: `[FETISH: Masochism] {{char}} derives pleasure from receiving pain.` },
    bondage: { name: "Бондаж", icon: "🪢", cat: "power", prompt: `[FETISH: Bondage] {{char}} enjoys restraints — ropes, cuffs.` },
    brat_taming: { name: "Приручение", icon: "😈", cat: "power", prompt: `[FETISH: Brat Taming] {{char}} provokes to elicit punishment.` },
    freeuse: { name: "Свободное использование", icon: "🔓", cat: "power", prompt: `[FETISH: Free Use] {{char}} can be used anytime without permission.` },
    humiliation: { name: "Унижение", icon: "😳", cat: "psych", prompt: `[FETISH: Humiliation] {{char}} enjoys being humiliated.` },
    praise: { name: "Похвала", icon: "✨", cat: "psych", prompt: `[FETISH: Praise Kink] {{char}} loves praise — "good girl/boy".` },
    daddy: { name: "Папочка", icon: "🎩", cat: "psych", prompt: `[FETISH: Daddy Kink] {{char}} aroused by "Daddy" role.` },
    corruption: { name: "Развращение", icon: "🍎", cat: "psych", prompt: `[FETISH: Corruption] {{char}} aroused by corrupting innocence.` },
    public: { name: "Публичный секс", icon: "🏙️", cat: "risk", prompt: `[FETISH: Public Sex] {{char}} aroused by intimacy in public.` },
    risk: { name: "На грани", icon: "👀", cat: "risk", prompt: `[FETISH: Risk] {{char}} craves risk of discovery.` },
    voyeurism: { name: "Вуайеризм", icon: "🔭", cat: "risk", prompt: `[FETISH: Voyeurism] {{char}} enjoys watching others.` },
    anal: { name: "Анал", icon: "🍑", cat: "body", prompt: `[FETISH: Anal] {{char}} enjoys anal sex.` },
    gagging: { name: "Гаггинг", icon: "💦", cat: "body", prompt: `[FETISH: Gagging] {{char}} aroused by gagging sounds.` },
    impact: { name: "Шлепки", icon: "✋", cat: "body", prompt: `[FETISH: Impact Play] {{char}} enjoys spanking, slapping.` },
    groping: { name: "Лапанье", icon: "🤲", cat: "body", prompt: `[FETISH: Groping] {{char}} expresses attraction through touching.` },
    size_diff: { name: "Размеры", icon: "📏", cat: "body", prompt: `[FETISH: Size Difference] {{char}} aroused by size contrast.` },
    breasts: { name: "Грудь", icon: "🍈", cat: "body", prompt: `[FETISH: Breast Worship] {{char}} obsessed with breasts.` },
    foot: { name: "Футфетиш", icon: "🦶", cat: "body", prompt: `[FETISH: Foot Fetish] {{char}} aroused by feet.` },
    blood: { name: "Кровь", icon: "🩸", cat: "body", prompt: `[FETISH: Blood] {{char}} aroused by blood.` },
    pregnancy: { name: "Беременность", icon: "🤰", cat: "body", prompt: `[FETISH: Pregnancy] {{char}} aroused by pregnancy.` },
    blindfold: { name: "Повязка", icon: "🙈", cat: "sense", prompt: `[FETISH: Blindfold] {{char}} enjoys blindfolded sex.` },
    mirror: { name: "Зеркала", icon: "🪞", cat: "sense", prompt: `[FETISH: Mirror Sex] {{char}} watches in mirrors.` },
    latex: { name: "Латекс", icon: "🖤", cat: "sense", prompt: `[FETISH: Latex] {{char}} enjoys latex clothing.` },
    toys: { name: "Игрушки", icon: "🎀", cat: "sense", prompt: `[FETISH: Sex Toys] {{char}} uses toys actively.` },
    roleplay: { name: "Ролеплей", icon: "🎭", cat: "sense", prompt: `[FETISH: Roleplay] {{char}} enjoys costumes and roles.` },
    petplay: { name: "Петплей", icon: "🐾", cat: "sense", prompt: `[FETISH: Pet Play] {{char}} enjoys pet/owner play.` },
    aftercare: { name: "Aftercare", icon: "🫂", cat: "rel", prompt: `[FETISH: Aftercare] {{char}} devoted to post-sex care.` },
    dirty_talk: { name: "Dirty talk", icon: "🗣️", cat: "rel", prompt: `[FETISH: Dirty Talk] {{char}} enjoys explicit talk.` },
    worship: { name: "Поклонение", icon: "🛐", cat: "rel", prompt: `[FETISH: Worship] {{char}} worships partner.` },
    variety: { name: "Разнообразие", icon: "🎲", cat: "rel", prompt: `[FETISH: Variety] {{char}} craves diversity.` },
    gangbang: { name: "Групповой", icon: "👥", cat: "rel", prompt: `[FETISH: Gangbang] {{char}} enjoys group sex.` }
};

const CATEGORIES = {
    power: { name: "Власть", icon: "⛓️" },
    psych: { name: "Психология", icon: "🧠" },
    risk: { name: "Риск", icon: "👀" },
    body: { name: "Тело", icon: "💋" },
    sense: { name: "Сенсорика", icon: "✨" },
    rel: { name: "Отношения", icon: "💕" }
};

let state = { enabled: true, active: [], intensity: 'medium', chance: 70, customFetishes: [] };

function loadState() {
    try {
        const saved = localStorage.getItem('fm_state');
        if (saved) state = { ...state, ...JSON.parse(saved) };
    } catch(e) {}
}

function saveState() {
    localStorage.setItem('fm_state', JSON.stringify(state));
}

function buildPrompt() {
    if (!state.enabled || state.active.length === 0) return '';
    const intText = { low: 'subtly', medium: 'naturally', high: 'prominently' };
    let p = `[FETISH SYSTEM] Intensity: ${intText[state.intensity]}, Chance: ${state.chance}%\n`;
    state.active.forEach(k => {
        if (FETISHES[k]) p += FETISHES[k].prompt + '\n';
        const c = state.customFetishes.find(f => f.id === k);
        if (c) p += c.prompt + '\n';
    });
    return p;
}

function applyPrompt() {
    setExtensionPrompt(extensionName, buildPrompt(), extension_prompt_types.IN_CHAT, 0, true, false, null, extension_prompt_roles.SYSTEM);
}

function toast(msg) {
    if (typeof toastr !== 'undefined') toastr.info(msg, 'FM', { timeOut: 1500 });
}

function updateUI() {
    $('.fm-btn').each(function() { $(this).toggleClass('active', state.active.includes($(this).data('f'))); });
    const $list = $('#fm-active-list');
    if (state.active.length === 0) {
        $list.html('<em>Не выбрано</em>');
    } else {
        $list.html(state.active.map(k => {
            const f = FETISHES[k] || state.customFetishes.find(c => c.id === k);
            return f ? `<span class="fm-tag" data-f="${k}">${f.icon} ${f.name} ✕</span>` : '';
        }).join(''));
    }
    $('#fm-open-btn').text(state.active.length > 0 ? `🔥${state.active.length}` : '🔥');
    renderCustom();
}

function toggle(k) {
    const i = state.active.indexOf(k);
    const f = FETISHES[k] || state.customFetishes.find(c => c.id === k);
    if (i === -1) { state.active.push(k); toast(`${f?.icon||''} ${f?.name||k} +`); }
    else { state.active.splice(i, 1); toast(`${f?.name||k} −`); }
    updateUI(); applyPrompt(); saveState();
}

function renderCustom() {
    const $c = $('#fm-custom-list');
    if (state.customFetishes.length === 0) { $c.html('<em>Нет</em>'); return; }
    $c.html(state.customFetishes.map(f => `
        <div class="fm-custom-item ${state.active.includes(f.id)?'active':''}">
            <span class="fm-custom-toggle" data-f="${f.id}">${f.icon} ${f.name}</span>
            <span class="fm-custom-del" data-id="${f.id}">✕</span>
        </div>
    `).join(''));
}

const styles = `
#fm-open-btn {
    position: fixed;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    width: 40px;
    min-height: 50px;
    padding: 8px 4px;
    background: linear-gradient(180deg, #963c50 0%, #5a2030 100%);
    border: none;
    border-radius: 12px 0 0 12px;
    font-size: 16px;
    cursor: pointer;
    z-index: 9999;
    box-shadow: -2px 0 15px rgba(0,0,0,0.4);
    color: #fff;
    writing-mode: vertical-rl;
    text-orientation: mixed;
    transition: all 0.2s;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
}
#fm-open-btn:hover, #fm-open-btn:active { width: 45px; background: linear-gradient(180deg, #a84860 0%, #6a2840 100%); }

#fm-panel {
    position: fixed;
    top: 50px;
    right: -320px;
    width: 310px;
    max-width: calc(100vw - 20px);
    max-height: calc(100vh - 100px);
    background: rgba(20,20,25,0.97);
    border: 1px solid rgba(200,80,100,0.4);
    border-radius: 12px;
    z-index: 10000;
    display: flex;
    flex-direction: column;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 13px;
    color: #eee;
    box-shadow: 0 8px 40px rgba(0,0,0,0.6);
    transition: right 0.3s ease;
    touch-action: pan-y;
}
#fm-panel.open { right: 10px; }

.fm-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    background: linear-gradient(135deg, rgba(150,60,80,0.5), rgba(90,30,50,0.3));
    border-radius: 12px 12px 0 0;
    border-bottom: 1px solid rgba(255,255,255,0.1);
}
.fm-head h4 { margin: 0; font-size: 15px; font-weight: 600; }
.fm-x {
    background: none;
    border: none;
    color: #fff;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: -8px -10px -8px 0;
    opacity: 0.7;
    touch-action: manipulation;
}
.fm-x:hover, .fm-x:active { opacity: 1; }

.fm-ctrl {
    padding: 12px 15px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    display: flex;
    flex-direction: column;
    gap: 10px;
}
.fm-row { display: flex; align-items: center; gap: 10px; }
.fm-row label { flex: 1; display: flex; align-items: center; gap: 6px; }
.fm-row select, .fm-row input[type="range"] {
    flex: 1;
    background: rgba(50,50,60,0.9);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    padding: 6px;
    border-radius: 6px;
}
.fm-row input[type="checkbox"] { width: 18px; height: 18px; }

.fm-act { padding: 10px 15px; border-bottom: 1px solid rgba(255,255,255,0.1); }
.fm-act-h { font-size: 11px; opacity: 0.5; margin-bottom: 8px; text-transform: uppercase; }
#fm-active-list { display: flex; flex-wrap: wrap; gap: 6px; min-height: 26px; }
.fm-tag {
    background: rgba(150,60,80,0.8);
    padding: 5px 10px;
    border-radius: 15px;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s;
    touch-action: manipulation;
}
.fm-tag:active { background: rgba(180,70,90,1); transform: scale(0.95); }

.fm-custom { padding: 10px 15px; border-bottom: 1px solid rgba(255,255,255,0.1); }
.fm-custom-h { font-size: 11px; opacity: 0.5; margin-bottom: 8px; display: flex; justify-content: space-between; }
.fm-custom-add {
    background: rgba(50,120,50,0.8);
    border: none;
    color: #fff;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    cursor: pointer;
    touch-action: manipulation;
}
.fm-custom-add:active { background: rgba(60,140,60,1); }
#fm-custom-list { display: flex; flex-direction: column; gap: 5px; }
.fm-custom-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 10px;
    background: rgba(50,50,60,0.7);
    border-radius: 6px;
    font-size: 12px;
}
.fm-custom-item.active { background: rgba(150,60,80,0.5); }
.fm-custom-toggle { cursor: pointer; flex: 1; touch-action: manipulation; }
.fm-custom-del { cursor: pointer; opacity: 0.5; padding: 4px 8px; touch-action: manipulation; }
.fm-custom-del:active { opacity: 1; }

.fm-cats { flex: 1; overflow-y: auto; padding: 10px 15px; -webkit-overflow-scrolling: touch; }
.fm-cat { margin-bottom: 12px; }
.fm-cat-h { font-size: 12px; font-weight: 600; opacity: 0.8; margin-bottom: 6px; padding-bottom: 4px; border-bottom: 1px dashed rgba(255,255,255,0.15); }
.fm-cat-i { display: flex; flex-wrap: wrap; gap: 5px; }
.fm-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 7px 10px;
    background: rgba(50,50,60,0.8);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 8px;
    color: #ddd;
    font-size: 11px;
    cursor: pointer;
    transition: all 0.15s;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
}
.fm-btn:active { background: rgba(70,70,80,1); transform: scale(0.97); }
.fm-btn.active {
    background: linear-gradient(135deg, rgba(150,60,80,0.9), rgba(100,40,60,0.8));
    border-color: rgba(200,80,100,0.5);
    box-shadow: 0 0 12px rgba(150,60,80,0.4);
    color: #fff;
}

.fm-footer { padding: 10px 15px; border-top: 1px solid rgba(255,255,255,0.1); }
.fm-clr {
    width: 100%;
    padding: 10px;
    background: rgba(80,30,30,0.8);
    border: none;
    border-radius: 8px;
    color: #fff;
    font-size: 13px;
    cursor: pointer;
    touch-action: manipulation;
}
.fm-clr:active { background: rgba(100,40,40,1); }

#fm-modal {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.8);
    z-index: 10001;
    display: none;
    align-items: center;
    justify-content: center;
    padding: 20px;
}
#fm-modal.open { display: flex; }
.fm-modal-content {
    background: rgba(25,25,30,0.98);
    border: 1px solid rgba(200,80,100,0.4);
    border-radius: 12px;
    padding: 20px;
    width: 100%;
    max-width: 340px;
}
#fm-modal h4 { margin: 0 0 15px; font-size: 16px; }
#fm-modal input, #fm-modal textarea {
    width: 100%;
    background: rgba(50,50,60,0.9);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    padding: 10px;
    border-radius: 8px;
    margin-bottom: 10px;
    font-size: 14px;
    box-sizing: border-box;
}
#fm-modal textarea { min-height: 90px; resize: vertical; }
.fm-modal-btns { display: flex; gap: 10px; margin-top: 10px; }
.fm-modal-btns button {
    flex: 1;
    padding: 12px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    cursor: pointer;
    touch-action: manipulation;
}
.fm-modal-save { background: rgba(50,130,50,0.9); color: #fff; }
.fm-modal-save:active { background: rgba(60,150,60,1); }
.fm-modal-cancel { background: rgba(70,70,80,0.9); color: #fff; }
.fm-modal-cancel:active { background: rgba(90,90,100,1); }

.fm-cats::-webkit-scrollbar { width: 4px; }
.fm-cats::-webkit-scrollbar-thumb { background: rgba(150,60,80,0.5); border-radius: 2px; }

@media (max-width: 480px) {
    #fm-panel { width: calc(100vw - 20px); right: -100vw; top: 10px; max-height: calc(100vh - 20px); }
    #fm-panel.open { right: 10px; }
    #fm-open-btn { top: auto; bottom: 100px; }
}
`;

function buildHTML() {
    let cats = '';
    for (const [ck, c] of Object.entries(CATEGORIES)) {
        const btns = Object.entries(FETISHES).filter(([_,f]) => f.cat === ck)
            .map(([k,f]) => `<button class="fm-btn" data-f="${k}">${f.icon} ${f.name}</button>`).join('');
        cats += `<div class="fm-cat"><div class="fm-cat-h">${c.icon} ${c.name}</div><div class="fm-cat-i">${btns}</div></div>`;
    }
    return `
        <button id="fm-open-btn">🔥</button>
        <div id="fm-panel">
            <div class="fm-head"><h4>🔥 Fetish Manager</h4><button class="fm-x">✕</button></div>
            <div class="fm-ctrl">
                <div class="fm-row"><label><input type="checkbox" id="fm-enabled" checked> Включено</label></div>
                <div class="fm-row"><label>Сила:</label><select id="fm-intensity"><option value="low">Слабо</option><option value="medium" selected>Средне</option><option value="high">Сильно</option></select></div>
                <div class="fm-row"><label>Шанс: <span id="fm-chance-val">70</span>%</label><input type="range" id="fm-chance" min="10" max="100" value="70" step="10"></div>
            </div>
            <div class="fm-act"><div class="fm-act-h">Активные</div><div id="fm-active-list"><em>Не выбрано</em></div></div>
            <div class="fm-custom"><div class="fm-custom-h"><span>Кастомные</span><button class="fm-custom-add" id="fm-add-custom">+ Добавить</button></div><div id="fm-custom-list"><em>Нет</em></div></div>
            <div class="fm-cats">${cats}</div>
            <div class="fm-footer"><button class="fm-clr" id="fm-clear">🗑️ Очистить</button></div>
        </div>
        <div id="fm-modal">
            <div class="fm-modal-content">
                <h4>➕ Новый фетиш</h4>
                <input type="text" id="fm-new-name" placeholder="Название" maxlength="30">
                <textarea id="fm-new-prompt" placeholder="Описание для AI"></textarea>
                <div class="fm-modal-btns">
                    <button class="fm-modal-cancel" id="fm-modal-cancel">Отмена</button>
                    <button class="fm-modal-save" id="fm-modal-save">Сохранить</button>
                </div>
            </div>
        </div>
    `;
}

// Инициализация через jQuery — гарантированно работает в ST
jQuery(() => {
    loadState();
    
    $('head').append(`<style>${styles}</style>`);
    $('body').append(buildHTML());
    
    const $panel = $('#fm-panel');
    const $modal = $('#fm-modal');
    
    // Открытие/закрытие
    $('#fm-open-btn').on('click touchend', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $panel.toggleClass('open');
    });
    
    $('.fm-x').on('click touchend', function(e) {
        e.preventDefault();
        $panel.removeClass('open');
    });
    
    // Настройки
    $('#fm-enabled').prop('checked', state.enabled).on('change', function() {
        state.enabled = this.checked;
        applyPrompt();
        saveState();
    });
    
    $('#fm-intensity').val(state.intensity).on('change', function() {
        state.intensity = this.value;
        applyPrompt();
        saveState();
    });
    
    $('#fm-chance').val(state.chance);
    $('#fm-chance-val').text(state.chance);
    $('#fm-chance').on('input', function() {
        state.chance = parseInt(this.value);
        $('#fm-chance-val').text(this.value);
        applyPrompt();
        saveState();
    });
    
    // Клики — делегирование
    $(document).on('click touchend', '.fm-btn', function(e) {
        e.preventDefault();
        toggle($(this).data('f'));
    });
    
    $(document).on('click touchend', '.fm-tag', function(e) {
        e.preventDefault();
        toggle($(this).data('f'));
    });
    
    $(document).on('click touchend', '.fm-custom-toggle', function(e) {
        e.preventDefault();
        toggle($(this).data('f'));
    });
    
    $(document).on('click touchend', '.fm-custom-del', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const id = $(this).data('id');
        state.customFetishes = state.customFetishes.filter(f => f.id !== id);
        state.active = state.active.filter(a => a !== id);
        saveState();
        updateUI();
        applyPrompt();
    });
    
    $('#fm-clear').on('click touchend', function(e) {
        e.preventDefault();
        state.active = [];
        updateUI();
        applyPrompt();
        saveState();
        toast('Очищено');
    });
    
    // Модалка
    $('#fm-add-custom').on('click touchend', function(e) {
        e.preventDefault();
        $('#fm-new-name').val('');
        $('#fm-new-prompt').val('');
        $modal.addClass('open');
    });
    
    $('#fm-modal-cancel').on('click touchend', function(e) {
        e.preventDefault();
        $modal.removeClass('open');
    });
    
    $('#fm-modal-save').on('click touchend', function(e) {
        e.preventDefault();
        const name = $('#fm-new-name').val().trim();
        const prompt = $('#fm-new-prompt').val().trim();
        if (name && prompt) {
            const id = 'c_' + Date.now();
            state.customFetishes.push({ id, name, icon: '🔹', prompt: `[FETISH: ${name}] ${prompt}` });
            saveState();
            renderCustom();
            $modal.removeClass('open');
            toast(`+ ${name}`);
        }
    });
    
    $modal.on('click touchend', function(e) {
        if (e.target === this) $modal.removeClass('open');
    });
    
    updateUI();
    applyPrompt();
    
    console.log('[FM] Ready!');
});
