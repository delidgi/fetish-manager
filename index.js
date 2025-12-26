import { setExtensionPrompt, extension_prompt_types, extension_prompt_roles } from '../../../../script.js';
import { eventSource, event_types } from '../../../../script.js';

const extensionName = 'fetish-manager';

// Коллекция фетишей
const FETISHES = {
    // Власть
    bdsm: { name: "БДСМ", icon: "⛓️", cat: "power", prompt: `[FETISH: BDSM] {{char}} has a sexual interest in BDSM — bondage, discipline, dominance/submission, sadomasochism.` },
    domination: { name: "Доминирование", icon: "👑", cat: "power", prompt: `[FETISH: Domination] {{char}} derives sexual pleasure from taking control and establishing authority.` },
    masochism: { name: "Мазохизм", icon: "🔥", cat: "power", prompt: `[FETISH: Masochism] {{char}} derives pleasure from receiving pain — physical or emotional.` },
    bondage: { name: "Бондаж", icon: "🪢", cat: "power", prompt: `[FETISH: Bondage] {{char}} enjoys restraining their partner or being restrained.` },
    brat_taming: { name: "Приручение", icon: "😈", cat: "power", prompt: `[FETISH: Brat Taming] {{char}} deliberately provokes to elicit punishment.` },
    freeuse: { name: "Свободное использование", icon: "🔓", cat: "power", prompt: `[FETISH: Free Use] {{char}} can be used sexually anytime without permission.` },

    // Психология
    humiliation: { name: "Унижение", icon: "😳", cat: "psych", prompt: `[FETISH: Humiliation] {{char}} enjoys being humiliated — verbal degradation becomes arousal.` },
    praise: { name: "Похвала", icon: "✨", cat: "psych", prompt: `[FETISH: Praise Kink] {{char}} loves praising their partner — "good girl/boy".` },
    daddy: { name: "Папочка", icon: "🎩", cat: "psych", prompt: `[FETISH: Daddy Kink] {{char}} is aroused by being called "Daddy".` },
    corruption: { name: "Развращение", icon: "🍎", cat: "psych", prompt: `[FETISH: Corruption] {{char}} is aroused by corrupting innocence.` },

    // Риск
    public: { name: "Публичный секс", icon: "🏙️", cat: "risk", prompt: `[FETISH: Public Sex] {{char}} is aroused by intimacy in public spaces.` },
    risk: { name: "На грани", icon: "👀", cat: "risk", prompt: `[FETISH: Risk of Discovery] {{char}} craves performing intimate acts while risking discovery.` },
    voyeurism: { name: "Вуайеризм", icon: "🔭", cat: "risk", prompt: `[FETISH: Voyeurism] {{char}} derives pleasure from watching others.` },

    // Тело
    anal: { name: "Анал", icon: "🍑", cat: "body", prompt: `[FETISH: Anal] {{char}} derives sexual pleasure from anal sex.` },
    gagging: { name: "Гаггинг", icon: "💦", cat: "body", prompt: `[FETISH: Gagging] {{char}} is aroused by gagging sounds from deep oral.` },
    impact: { name: "Шлепки", icon: "✋", cat: "body", prompt: `[FETISH: Impact Play] {{char}} enjoys hitting or being hit — spanking, slapping.` },
    groping: { name: "Лапанье", icon: "🤲", cat: "body", prompt: `[FETISH: Groping] {{char}} expresses attraction through constant touching.` },
    size_diff: { name: "Размеры", icon: "📏", cat: "body", prompt: `[FETISH: Size Difference] {{char}} is aroused by stark contrast in physicality.` },
    breasts: { name: "Грудь", icon: "🍈", cat: "body", prompt: `[FETISH: Breast Worship] {{char}} derives extreme pleasure from breasts.` },
    foot: { name: "Футфетиш", icon: "🦶", cat: "body", prompt: `[FETISH: Foot Fetish] {{char}} is aroused by feet.` },
    blood: { name: "Кровь", icon: "🩸", cat: "body", prompt: `[FETISH: Blood] {{char}} experiences arousal at sight of blood.` },
    pregnancy: { name: "Беременность", icon: "🤰", cat: "body", prompt: `[FETISH: Pregnancy] {{char}} is aroused by pregnant bodies.` },

    // Сенсорика
    blindfold: { name: "Повязка", icon: "🙈", cat: "sense", prompt: `[FETISH: Blindfold] {{char}} is aroused by blindfolded sex.` },
    mirror: { name: "Зеркала", icon: "🪞", cat: "sense", prompt: `[FETISH: Mirror Sex] {{char}} is aroused by watching themselves in mirrors.` },
    latex: { name: "Латекс", icon: "🖤", cat: "sense", prompt: `[FETISH: Latex] {{char}} derives pleasure from latex clothing.` },
    toys: { name: "Игрушки", icon: "🎀", cat: "sense", prompt: `[FETISH: Sex Toys] {{char}} enjoys actively using toys.` },
    roleplay: { name: "Ролеплей", icon: "🎭", cat: "sense", prompt: `[FETISH: Roleplay] {{char}} derives pleasure from costumes and roles.` },
    petplay: { name: "Петплей", icon: "🐾", cat: "sense", prompt: `[FETISH: Pet Play] {{char}} enjoys playing pet/owner.` },

    // Отношения
    aftercare: { name: "Aftercare", icon: "🫂", cat: "rel", prompt: `[FETISH: Aftercare] {{char}} is devoted to post-sex care.` },
    dirty_talk: { name: "Dirty talk", icon: "🗣️", cat: "rel", prompt: `[FETISH: Dirty Talk] {{char}} derives pleasure from explicit verbal exchange.` },
    worship: { name: "Поклонение", icon: "🛐", cat: "rel", prompt: `[FETISH: Worship] {{char}} worships {{user}} with devoted attention.` },
    variety: { name: "Разнообразие", icon: "🎲", cat: "rel", prompt: `[FETISH: Variety] {{char}} craves sexual diversity.` },
    gangbang: { name: "Групповой", icon: "👥", cat: "rel", prompt: `[FETISH: Gangbang] {{char}} derives pleasure from group sex.` }
};

const CATEGORIES = {
    power: { name: "Власть", icon: "⛓️" },
    psych: { name: "Психология", icon: "🧠" },
    risk: { name: "Риск", icon: "👀" },
    body: { name: "Тело", icon: "💋" },
    sense: { name: "Сенсорика", icon: "✨" },
    rel: { name: "Отношения", icon: "💕" }
};

// Состояние
let state = {
    enabled: true,
    active: [],
    intensity: 'medium',
    chance: 70,
    customFetishes: []
};

function loadState() {
    try {
        const saved = localStorage.getItem('fm_state');
        if (saved) state = { ...state, ...JSON.parse(saved) };
    } catch(e) {
        console.log('[FM] Failed to load state');
    }
}

function saveState() {
    localStorage.setItem('fm_state', JSON.stringify(state));
}

function buildPrompt() {
    if (!state.enabled || state.active.length === 0) return '';
    
    const intText = {
        low: 'subtly, with light hints only',
        medium: 'naturally, when context supports',
        high: 'prominently, as core sexual drive'
    };
    
    let p = `[FETISH SYSTEM]\nIntensity: ${intText[state.intensity]}\nTrigger chance: ${state.chance}%\n\nActive fetishes:\n`;
    
    state.active.forEach(k => {
        if (FETISHES[k]) {
            p += '\n' + FETISHES[k].prompt;
        }
        const custom = state.customFetishes.find(f => f.id === k);
        if (custom) {
            p += '\n' + custom.prompt;
        }
    });
    
    p += `\n\n[LOGIC]\n- Roll 1d100 before each response\n- If roll ≤ ${state.chance}: incorporate fetish naturally\n- If roll > ${state.chance}: keep scene vanilla`;
    
    return p;
}

function applyPrompt() {
    const prompt = buildPrompt();
    setExtensionPrompt(
        extensionName,
        prompt,
        extension_prompt_types.IN_CHAT,
        0,
        true,
        false,
        null,
        extension_prompt_roles.SYSTEM
    );
    console.log('[FM] Prompt applied:', prompt ? 'yes' : 'empty');
}

function showToast(msg) {
    if (typeof toastr !== 'undefined') {
        toastr.info(msg, 'Fetish Manager', { timeOut: 2000 });
    }
}

function updateUI() {
    document.querySelectorAll('.fm-btn').forEach(btn => {
        btn.classList.toggle('fm-btn-active', state.active.includes(btn.dataset.f));
    });
    
    const list = document.getElementById('fm-active-list');
    if (list) {
        if (state.active.length === 0) {
            list.innerHTML = '<em class="fm-empty">Не выбрано</em>';
        } else {
            list.innerHTML = state.active.map(k => {
                const f = FETISHES[k] || state.customFetishes.find(c => c.id === k);
                if (!f) return '';
                return `<span class="fm-tag" data-f="${k}">${f.icon || '🔹'} ${f.name} ✕</span>`;
            }).join('');
        }
    }
    
    const btn = document.getElementById('fm-open-btn');
    if (btn) {
        btn.textContent = state.active.length > 0 ? `🔥${state.active.length}` : '🔥';
    }
    
    renderCustomList();
}

function toggle(k) {
    const i = state.active.indexOf(k);
    const f = FETISHES[k] || state.customFetishes.find(c => c.id === k);
    
    if (i === -1) {
        state.active.push(k);
        showToast(`${f?.icon || '🔹'} ${f?.name || k} добавлен`);
    } else {
        state.active.splice(i, 1);
        showToast(`${f?.name || k} убран`);
    }
    
    updateUI();
    applyPrompt();
    saveState();
}

function addCustomFetish(name, prompt) {
    const id = 'custom_' + Date.now();
    state.customFetishes.push({
        id,
        name,
        icon: '🔹',
        prompt: `[FETISH: ${name}] ${prompt}`
    });
    saveState();
    renderCustomList();
    showToast(`Добавлен: ${name}`);
}

function removeCustomFetish(id) {
    state.customFetishes = state.customFetishes.filter(f => f.id !== id);
    state.active = state.active.filter(a => a !== id);
    saveState();
    updateUI();
    applyPrompt();
    showToast('Удалён');
}

function renderCustomList() {
    const container = document.getElementById('fm-custom-list');
    if (!container) return;
    
    if (state.customFetishes.length === 0) {
        container.innerHTML = '<em class="fm-empty">Нет кастомных</em>';
        return;
    }
    
    container.innerHTML = state.customFetishes.map(f => {
        const isActive = state.active.includes(f.id);
        return `
            <div class="fm-custom-item ${isActive ? 'fm-custom-item-active' : ''}" data-id="${f.id}">
                <span class="fm-custom-toggle" data-f="${f.id}">${f.icon} ${f.name}</span>
                <span class="fm-custom-del" data-id="${f.id}">🗑️</span>
            </div>
        `;
    }).join('');
}

// Стили — ИЗОЛИРОВАННЫЕ через #fm-root
const styles = `
/* Контейнер — изолирует все стили */
#fm-root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 13px;
    line-height: 1.4;
    color: #eee;
    -webkit-tap-highlight-color: transparent;
}

#fm-root * {
    box-sizing: border-box;
}

/* Кнопка открытия — вне потока, не блокирует клики */
#fm-open-btn {
    position: fixed;
    bottom: 80px;
    right: 10px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #8b3a4a, #5a2030);
    border: 2px solid rgba(200,100,120,0.5);
    border-radius: 50%;
    font-size: 20px;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 4px 15px rgba(0,0,0,0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    touch-action: manipulation;
    -webkit-user-select: none;
    user-select: none;
}

#fm-open-btn:active {
    transform: scale(0.95);
}

/* Панель */
#fm-panel {
    display: none;
    position: fixed;
    bottom: 140px;
    right: 10px;
    width: 300px;
    max-width: calc(100vw - 20px);
    max-height: 70vh;
    background: rgba(25, 25, 30, 0.98);
    border: 1px solid rgba(200,100,120,0.4);
    border-radius: 12px;
    z-index: 1001;
    flex-direction: column;
    box-shadow: 0 8px 30px rgba(0,0,0,0.5);
    overflow: hidden;
}

#fm-panel.fm-open {
    display: flex;
}

/* Шапка */
#fm-panel .fm-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 14px;
    background: linear-gradient(135deg, rgba(139,58,74,0.6), rgba(90,32,48,0.4));
    border-bottom: 1px solid rgba(255,255,255,0.1);
    flex-shrink: 0;
}

#fm-panel .fm-head h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
}

#fm-panel .fm-x {
    background: none;
    border: none;
    color: #fff;
    font-size: 22px;
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

#fm-panel .fm-x:active {
    opacity: 1;
}

/* Настройки */
#fm-panel .fm-ctrl {
    padding: 12px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    display: flex;
    flex-direction: column;
    gap: 10px;
    flex-shrink: 0;
}

#fm-panel .fm-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

#fm-panel .fm-row label {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
}

#fm-panel .fm-row select,
#fm-panel .fm-row input[type="range"] {
    flex: 1;
    min-width: 100px;
    background: rgba(50,50,60,0.9);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    padding: 6px 8px;
    border-radius: 6px;
    font-size: 13px;
}

#fm-panel .fm-row input[type="checkbox"] {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

/* Активные фетиши */
#fm-panel .fm-act {
    padding: 10px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    flex-shrink: 0;
}

#fm-panel .fm-act-h {
    font-size: 11px;
    opacity: 0.6;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

#fm-panel #fm-active-list {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    min-height: 28px;
}

#fm-panel .fm-tag {
    background: rgba(139,58,74,0.8);
    padding: 5px 10px;
    border-radius: 12px;
    font-size: 12px;
    cursor: pointer;
    touch-action: manipulation;
    -webkit-user-select: none;
    user-select: none;
}

#fm-panel .fm-tag:active {
    background: rgba(180,70,90,0.9);
}

#fm-panel .fm-empty {
    opacity: 0.4;
    font-size: 12px;
}

/* Кастомные */
#fm-panel .fm-custom {
    padding: 10px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.1);
    flex-shrink: 0;
}

#fm-panel .fm-custom-h {
    font-size: 11px;
    opacity: 0.6;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

#fm-panel .fm-custom-add {
    background: rgba(50,100,50,0.7);
    border: 1px solid rgba(80,150,80,0.5);
    color: #fff;
    padding: 5px 10px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 11px;
    touch-action: manipulation;
}

#fm-panel .fm-custom-add:active {
    background: rgba(60,120,60,0.9);
}

#fm-panel #fm-custom-list {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

#fm-panel .fm-custom-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 10px;
    background: rgba(50,50,60,0.7);
    border-radius: 6px;
    font-size: 12px;
}

#fm-panel .fm-custom-item-active {
    background: rgba(139,58,74,0.6);
}

#fm-panel .fm-custom-toggle {
    cursor: pointer;
    flex: 1;
    touch-action: manipulation;
}

#fm-panel .fm-custom-del {
    cursor: pointer;
    opacity: 0.5;
    padding: 5px;
    font-size: 14px;
    touch-action: manipulation;
}

#fm-panel .fm-custom-del:active {
    opacity: 1;
}

/* Категории */
#fm-panel .fm-cats {
    flex: 1;
    overflow-y: auto;
    padding: 10px 14px;
    -webkit-overflow-scrolling: touch;
}

#fm-panel .fm-cat {
    margin-bottom: 14px;
}

#fm-panel .fm-cat-h {
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 8px;
    opacity: 0.8;
    border-bottom: 1px dashed rgba(255,255,255,0.2);
    padding-bottom: 4px;
}

#fm-panel .fm-cat-i {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

#fm-panel .fm-btn {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 8px 10px;
    background: rgba(50,50,60,0.8);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 8px;
    color: #eee;
    font-size: 12px;
    cursor: pointer;
    touch-action: manipulation;
    -webkit-user-select: none;
    user-select: none;
    min-height: 36px;
}

#fm-panel .fm-btn:active {
    background: rgba(70,70,80,0.9);
}

#fm-panel .fm-btn-active {
    background: linear-gradient(135deg, rgba(139,58,74,0.9), rgba(100,40,55,0.8));
    border-color: rgba(200,80,100,0.6);
    box-shadow: 0 0 10px rgba(139,58,74,0.4);
}

/* Футер */
#fm-panel .fm-footer {
    padding: 10px 14px;
    border-top: 1px solid rgba(255,255,255,0.1);
    flex-shrink: 0;
}

#fm-panel .fm-clr {
    width: 100%;
    padding: 10px;
    background: rgba(80,30,30,0.7);
    border: 1px solid rgba(150,50,50,0.5);
    border-radius: 8px;
    color: #fff;
    font-size: 13px;
    cursor: pointer;
    touch-action: manipulation;
}

#fm-panel .fm-clr:active {
    background: rgba(100,40,40,0.9);
}

/* Модальное окно */
#fm-modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.8);
    z-index: 1002;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

#fm-modal.fm-open {
    display: flex;
}

#fm-modal .fm-modal-content {
    background: rgba(30,30,35,0.98);
    border: 1px solid rgba(200,100,120,0.4);
    border-radius: 12px;
    padding: 20px;
    width: 100%;
    max-width: 350px;
}

#fm-modal h4 {
    margin: 0 0 15px 0;
    font-size: 16px;
}

#fm-modal input,
#fm-modal textarea {
    width: 100%;
    background: rgba(50,50,60,0.9);
    border: 1px solid rgba(255,255,255,0.2);
    color: #fff;
    padding: 10px 12px;
    border-radius: 8px;
    margin-bottom: 12px;
    font-family: inherit;
    font-size: 14px;
}

#fm-modal textarea {
    min-height: 100px;
    resize: vertical;
}

#fm-modal .fm-modal-btns {
    display: flex;
    gap: 10px;
    margin-top: 5px;
}

#fm-modal .fm-modal-btns button {
    flex: 1;
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    border: none;
    touch-action: manipulation;
    min-height: 44px;
}

#fm-modal .fm-modal-save {
    background: rgba(50,120,50,0.9);
    color: #fff;
}

#fm-modal .fm-modal-save:active {
    background: rgba(60,140,60,1);
}

#fm-modal .fm-modal-cancel {
    background: rgba(70,70,80,0.9);
    color: #fff;
}

#fm-modal .fm-modal-cancel:active {
    background: rgba(90,90,100,1);
}

/* Скроллбар */
#fm-panel .fm-cats::-webkit-scrollbar {
    width: 4px;
}

#fm-panel .fm-cats::-webkit-scrollbar-thumb {
    background: rgba(139,58,74,0.6);
    border-radius: 2px;
}
`;

// HTML
function buildHTML() {
    let catsHtml = '';
    for (const [ck, c] of Object.entries(CATEGORIES)) {
        const items = Object.entries(FETISHES).filter(([_, f]) => f.cat === ck);
        let btns = items.map(([k, f]) => `<button class="fm-btn" data-f="${k}">${f.icon} ${f.name}</button>`).join('');
        catsHtml += `<div class="fm-cat"><div class="fm-cat-h">${c.icon} ${c.name}</div><div class="fm-cat-i">${btns}</div></div>`;
    }

    return `
        <div id="fm-root">
            <button id="fm-open-btn">🔥</button>
            
            <div id="fm-panel">
                <div class="fm-head">
                    <h4>🔥 Fetish Manager</h4>
                    <button class="fm-x">✕</button>
                </div>
                <div class="fm-ctrl">
                    <div class="fm-row">
                        <label><input type="checkbox" id="fm-enabled" checked> Включено</label>
                    </div>
                    <div class="fm-row">
                        <label>Сила:</label>
                        <select id="fm-intensity">
                            <option value="low">Слабо</option>
                            <option value="medium" selected>Средне</option>
                            <option value="high">Сильно</option>
                        </select>
                    </div>
                    <div class="fm-row">
                        <label>Шанс: <span id="fm-chance-val">70</span>%</label>
                        <input type="range" id="fm-chance" min="10" max="100" value="70" step="10">
                    </div>
                </div>
                <div class="fm-act">
                    <div class="fm-act-h">Активные</div>
                    <div id="fm-active-list"><em class="fm-empty">Не выбрано</em></div>
                </div>
                <div class="fm-custom">
                    <div class="fm-custom-h">
                        <span>Кастомные</span>
                        <button class="fm-custom-add" id="fm-add-custom">+ Добавить</button>
                    </div>
                    <div id="fm-custom-list"><em class="fm-empty">Нет кастомных</em></div>
                </div>
                <div class="fm-cats">${catsHtml}</div>
                <div class="fm-footer">
                    <button class="fm-clr" id="fm-clear">🗑️ Очистить всё</button>
                </div>
            </div>
            
            <div id="fm-modal">
                <div class="fm-modal-content">
                    <h4>➕ Добавить фетиш</h4>
                    <input type="text" id="fm-new-name" placeholder="Название" maxlength="30">
                    <textarea id="fm-new-prompt" placeholder="Описание для AI"></textarea>
                    <div class="fm-modal-btns">
                        <button class="fm-modal-cancel" id="fm-modal-cancel">Отмена</button>
                        <button class="fm-modal-save" id="fm-modal-save">Сохранить</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Инициализация
jQuery(async () => {
    try {
        loadState();
        
        // Добавляем стили
        const styleEl = document.createElement('style');
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
        
        // Добавляем HTML
        const container = document.createElement('div');
        container.innerHTML = buildHTML();
        document.body.appendChild(container.firstElementChild);
        
        const panel = document.getElementById('fm-panel');
        const openBtn = document.getElementById('fm-open-btn');
        const modal = document.getElementById('fm-modal');
        
        // Открыть/закрыть панель
        openBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('fm-open');
        });
        
        document.querySelector('#fm-panel .fm-x').addEventListener('click', () => {
            panel.classList.remove('fm-open');
        });
        
        // Закрыть по клику вне
        document.addEventListener('click', (e) => {
            if (!panel.contains(e.target) && e.target !== openBtn) {
                panel.classList.remove('fm-open');
            }
        });
        
        // Включение
        document.getElementById('fm-enabled').checked = state.enabled;
        document.getElementById('fm-enabled').addEventListener('change', function() {
            state.enabled = this.checked;
            applyPrompt();
            saveState();
        });
        
        // Интенсивность
        document.getElementById('fm-intensity').value = state.intensity;
        document.getElementById('fm-intensity').addEventListener('change', function() {
            state.intensity = this.value;
            applyPrompt();
            saveState();
        });
        
        // Шанс
        document.getElementById('fm-chance').value = state.chance;
        document.getElementById('fm-chance-val').textContent = state.chance;
        document.getElementById('fm-chance').addEventListener('input', function() {
            state.chance = parseInt(this.value);
            document.getElementById('fm-chance-val').textContent = this.value;
            applyPrompt();
            saveState();
        });
        
        // Клик по фетишу (делегирование)
        document.getElementById('fm-panel').addEventListener('click', (e) => {
            const btn = e.target.closest('.fm-btn');
            if (btn) {
                e.preventDefault();
                toggle(btn.dataset.f);
            }
            
            const tag = e.target.closest('.fm-tag');
            if (tag) {
                e.preventDefault();
                toggle(tag.dataset.f);
            }
            
            const customToggle = e.target.closest('.fm-custom-toggle');
            if (customToggle) {
                e.preventDefault();
                toggle(customToggle.dataset.f);
            }
            
            const customDel = e.target.closest('.fm-custom-del');
            if (customDel) {
                e.preventDefault();
                e.stopPropagation();
                removeCustomFetish(customDel.dataset.id);
            }
        });
        
        // Очистить
        document.getElementById('fm-clear').addEventListener('click', () => {
            state.active = [];
            updateUI();
            applyPrompt();
            saveState();
            showToast('Очищено');
        });
        
        // Модальное окно
        document.getElementById('fm-add-custom').addEventListener('click', () => {
            document.getElementById('fm-new-name').value = '';
            document.getElementById('fm-new-prompt').value = '';
            modal.classList.add('fm-open');
        });
        
        document.getElementById('fm-modal-cancel').addEventListener('click', () => {
            modal.classList.remove('fm-open');
        });
        
        document.getElementById('fm-modal-save').addEventListener('click', () => {
            const name = document.getElementById('fm-new-name').value.trim();
            const prompt = document.getElementById('fm-new-prompt').value.trim();
            if (name && prompt) {
                addCustomFetish(name, prompt);
                modal.classList.remove('fm-open');
            } else {
                showToast('Заполни оба поля');
            }
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('fm-open');
        });
        
        // Инициализация UI
        updateUI();
        applyPrompt();
        
        console.log('[Fetish Manager] Loaded!');
        
    } catch (error) {
        console.error('[Fetish Manager] Error:', error);
    }
});
