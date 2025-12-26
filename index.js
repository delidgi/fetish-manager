import { setExtensionPrompt, extension_prompt_types, extension_prompt_roles } from '../../../../script.js';
import { eventSource, event_types } from '../../../../script.js';

const extensionName = 'fetish-manager';


const FETISHES = {

    bdsm: { name: "БДСМ", icon: "⛓️", cat: "power", prompt: `[FETISH: BDSM] {{char}} has a sexual interest in BDSM — bondage, discipline, dominance/submission, sadomasochism. Integrate power dynamics, restraints, and controlled pain/pleasure when appropriate.` },
    domination: { name: "Доминирование", icon: "👑", cat: "power", prompt: `[FETISH: Domination] {{char}} derives sexual pleasure from taking control. They command and establish authority during intimate encounters.` },
    masochism: { name: "Мазохизм", icon: "🔥", cat: "power", prompt: `[FETISH: Masochism] {{char}} derives pleasure from receiving pain — physical or emotional. Pain translates to arousal.` },
    bondage: { name: "Бондаж", icon: "🪢", cat: "power", prompt: `[FETISH: Bondage] {{char}} enjoys restraining their partner or being restrained — ropes, cuffs, ties.` },
    brat_taming: { name: "Приручение", icon: "😈", cat: "power", prompt: `[FETISH: Brat Taming] {{char}} deliberately provokes to elicit punishment and "taming".` },
    freeuse: { name: "Свободное использование", icon: "🔓", cat: "power", prompt: `[FETISH: Free Use] {{char}} can be used sexually anytime without warning or permission.` },


    humiliation: { name: "Унижение", icon: "😳", cat: "psych", prompt: `[FETISH: Humiliation] {{char}} enjoys being humiliated — name-calling, verbal degradation. Shame becomes arousal.` },
    praise: { name: "Похвала", icon: "✨", cat: "psych", prompt: `[FETISH: Praise Kink] {{char}} loves praising their partner — "good girl/boy". Praise heightens desire.` },
    daddy: { name: "Папочка", icon: "🎩", cat: "psych", prompt: `[FETISH: Daddy Kink] {{char}} is aroused by being called "Daddy" or using dominant, protective role.` },
    corruption: { name: "Развращение", icon: "🍎", cat: "psych", prompt: `[FETISH: Corruption] {{char}} is aroused by corrupting innocence — teaching new acts progressively.` },


    public: { name: "Публичный секс", icon: "🏙️", cat: "risk", prompt: `[FETISH: Public Sex] {{char}} is aroused by intimacy in public spaces. Risk of being seen heightens excitement.` },
    risk: { name: "На грани", icon: "👀", cat: "risk", prompt: `[FETISH: Risk of Discovery] {{char}} craves performing intimate acts while maintaining normal appearance.` },
    voyeurism: { name: "Вуайеризм", icon: "🔭", cat: "risk", prompt: `[FETISH: Voyeurism] {{char}} derives pleasure from watching others in intimate moments.` },


    anal: { name: "Анал", icon: "🍑", cat: "body", prompt: `[FETISH: Anal] {{char}} derives sexual pleasure from anal sex — giving or receiving.` },
    gagging: { name: "Гаггинг", icon: "💦", cat: "body", prompt: `[FETISH: Gagging] {{char}} is aroused by gagging sounds, tears from deep oral.` },
    impact: { name: "Шлепки", icon: "✋", cat: "body", prompt: `[FETISH: Impact Play] {{char}} enjoys hitting or being hit — spanking, slapping, paddling.` },
    groping: { name: "Лапанье", icon: "🤲", cat: "body", prompt: `[FETISH: Groping] {{char}} expresses attraction through constant touching — casual hands on body.` },
    size_diff: { name: "Размеры", icon: "📏", cat: "body", prompt: `[FETISH: Size Difference] {{char}} is aroused by stark contrast in physicality with partner.` },
    breasts: { name: "Грудь", icon: "🍈", cat: "body", prompt: `[FETISH: Breast Worship] {{char}} derives extreme pleasure from breasts — observing, fondling.` },
    foot: { name: "Футфетиш", icon: "🦶", cat: "body", prompt: `[FETISH: Foot Fetish] {{char}} is aroused by feet — touching, kissing, massaging.` },
    blood: { name: "Кровь", icon: "🩸", cat: "body", prompt: `[FETISH: Blood] {{char}} experiences arousal at sight of blood.` },
    pregnancy: { name: "Беременность", icon: "🤰", cat: "body", prompt: `[FETISH: Pregnancy] {{char}} is aroused by pregnant bodies, fertility aspect.` },


    blindfold: { name: "Повязка", icon: "🙈", cat: "sense", prompt: `[FETISH: Blindfold] {{char}} is aroused by blindfolded sex — vulnerability, heightened senses.` },
    mirror: { name: "Зеркала", icon: "🪞", cat: "sense", prompt: `[FETISH: Mirror Sex] {{char}} is aroused by watching themselves in mirrors during intimacy.` },
    latex: { name: "Латекс", icon: "🖤", cat: "sense", prompt: `[FETISH: Latex] {{char}} derives pleasure from wearing or seeing partner in latex.` },
    toys: { name: "Игрушки", icon: "🎀", cat: "sense", prompt: `[FETISH: Sex Toys] {{char}} enjoys actively using toys — vibrators, plugs.` },
    roleplay: { name: "Ролеплей", icon: "🎭", cat: "sense", prompt: `[FETISH: Roleplay] {{char}} derives pleasure from costumes and playing roles.` },
    petplay: { name: "Петплей", icon: "🐾", cat: "sense", prompt: `[FETISH: Pet Play] {{char}} enjoys playing pet/owner — collars, leashes, commands.` },


    aftercare: { name: "Aftercare", icon: "🫂", cat: "rel", prompt: `[FETISH: Aftercare] {{char}} is devoted to post-sex care — gentle caresses, emotional reassurance.` },
    dirty_talk: { name: "Dirty talk", icon: "🗣️", cat: "rel", prompt: `[FETISH: Dirty Talk] {{char}} derives pleasure from explicit verbal exchange during intimacy.` },
    worship: { name: "Поклонение", icon: "🛐", cat: "rel", prompt: `[FETISH: Worship] {{char}} worships {{user}} or specific body parts with devoted attention.` },
    variety: { name: "Разнообразие", icon: "🎲", cat: "rel", prompt: `[FETISH: Variety] {{char}} craves sexual diversity — not just penetration.` },
    gangbang: { name: "Групповой", icon: "👥", cat: "rel", prompt: `[FETISH: Gangbang] {{char}} derives pleasure from group sex with multiple partners.` }
};

const CATEGORIES = {
    power: { name: "Власть", icon: "⛓️" },
    psych: { name: "Психология", icon: "🧠" },
    risk: { name: "Риск", icon: "👀" },
    body: { name: "Тело", icon: "💋" },
    sense: { name: "Сенсорика", icon: "✨" },
    rel: { name: "Отношения", icon: "💕" }
};


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
    
    let p = `[FETISH SYSTEM]\nIntensity: ${intText[state.intensity]}\nTrigger chance: ${state.chance}%\n\nActive fetishes for {{char}}:\n`;
    
    state.active.forEach(k => {

        if (FETISHES[k]) {
            p += '\n' + FETISHES[k].prompt;
        }

        const custom = state.customFetishes.find(f => f.id === k);
        if (custom) {
            p += '\n' + custom.prompt;
        }
    });
    
    p += `\n\n[FETISH LOGIC]\n- Roll 1d100 before each response\n- If roll ≤ ${state.chance}: incorporate active fetish naturally into scene\n- If roll > ${state.chance}: keep scene vanilla, {{char}} may show subtle hints\n- Never force fetish into incompatible context`;
    
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
    console.log('[FM] Prompt applied:', prompt ? 'yes (' + state.active.length + ' fetishes)' : 'empty');
}

function clearPrompt() {
    setExtensionPrompt(extensionName, '', extension_prompt_types.IN_CHAT, 0, false, true, null, extension_prompt_roles.SYSTEM);
    console.log('[FM] Prompt cleared');
}

function showToast(msg) {
    if (typeof toastr !== 'undefined') {
        toastr.info(msg, 'Fetish Manager', { timeOut: 2000, positionClass: 'toast-top-center' });
    } else {
        const toast = $('<div>').css({
            position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(30,30,35,0.95)', color: '#fff', padding: '10px 20px',
            borderRadius: '8px', zIndex: 100001, fontSize: '13px'
        }).text(msg);
        $('body').append(toast);
        setTimeout(() => toast.remove(), 2500);
    }
}

function updateUI() {

    $('.fm-btn').each(function() {
        $(this).toggleClass('active', state.active.includes($(this).data('f')));
    });
    

    const $list = $('#fm-active-list');
    if ($list.length) {
        if (state.active.length === 0) {
            $list.html('<em>Не выбрано</em>');
        } else {
            let html = '';
            state.active.forEach(k => {
                const f = FETISHES[k] || state.customFetishes.find(c => c.id === k);
                if (f) {
                    html += `<span class="fm-tag" data-f="${k}">${f.icon || '🔹'} ${f.name} ✕</span>`;
                }
            });
            $list.html(html);
        }
    }
    

    const $btn = $('#fm-open-btn');
    if ($btn.length) {
        $btn.text(state.active.length > 0 ? `🔥${state.active.length}` : '🔥');
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
    showToast('Фетиш удалён');
}

function renderCustomList() {
    const $container = $('#fm-custom-list');
    if (!$container.length) return;
    
    if (state.customFetishes.length === 0) {
        $container.html('<em style="opacity:0.5;font-size:11px;">Нет кастомных</em>');
        return;
    }
    
    let html = '';
    state.customFetishes.forEach(f => {
        const isActive = state.active.includes(f.id);
        html += `
            <div class="fm-custom-item ${isActive ? 'active' : ''}" data-id="${f.id}">
                <span class="fm-custom-toggle" data-f="${f.id}">${f.icon} ${f.name}</span>
                <span class="fm-custom-del" data-id="${f.id}">🗑️</span>
            </div>
        `;
    });
    $container.html(html);
}


const styles = `
#fm-panel{position:fixed;top:50px;right:15px;width:300px;max-height:80vh;background:var(--SmartThemeBlurTintColor,rgba(20,20,25,0.97));border:1px solid var(--SmartThemeBorderColor,rgba(255,80,100,0.4));border-radius:12px;z-index:99999;display:none;flex-direction:column;font-family:sans-serif;color:var(--SmartThemeBodyColor,#eee);font-size:13px;box-shadow:0 8px 30px rgba(0,0,0,0.5)}
#fm-panel.open{display:flex}
.fm-head{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:linear-gradient(135deg,rgba(150,40,60,0.5),rgba(80,20,40,0.4));border-radius:12px 12px 0 0;cursor:move}
.fm-head h4{margin:0;font-size:14px}
.fm-x{background:none;border:none;color:var(--SmartThemeBodyColor,#fff);font-size:18px;cursor:pointer;opacity:0.7}
.fm-x:hover{opacity:1}
.fm-ctrl{padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;flex-direction:column;gap:8px}
.fm-row{display:flex;align-items:center;gap:8px}
.fm-row label{flex:1}
.fm-row select,.fm-row input[type="range"]{flex:1;background:var(--SmartThemeBlurTintColor,rgba(40,40,50,0.9));border:1px solid var(--SmartThemeBorderColor,rgba(255,255,255,0.2));color:var(--SmartThemeBodyColor,#fff);padding:4px;border-radius:4px}
.fm-act{padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.1)}
.fm-act-h{font-size:11px;opacity:0.7;margin-bottom:6px}
#fm-active-list{display:flex;flex-wrap:wrap;gap:5px;min-height:24px}
.fm-tag{background:rgba(150,40,60,0.7);padding:3px 8px;border-radius:10px;font-size:11px;cursor:pointer;transition:all 0.15s}
.fm-tag:hover{background:rgba(180,50,70,0.9)}
.fm-cats{flex:1;overflow-y:auto;padding:10px}
.fm-cat{margin-bottom:12px}
.fm-cat-h{font-size:12px;font-weight:bold;margin-bottom:6px;opacity:0.9;border-bottom:1px dashed rgba(255,255,255,0.2);padding-bottom:3px}
.fm-cat-i{display:flex;flex-wrap:wrap;gap:4px}
.fm-btn{display:inline-flex;align-items:center;gap:3px;padding:5px 8px;background:var(--SmartThemeBlurTintColor,rgba(50,50,60,0.8));border:1px solid var(--SmartThemeBorderColor,rgba(255,255,255,0.15));border-radius:5px;color:var(--SmartThemeBodyColor,#eee);font-size:11px;cursor:pointer;transition:all 0.15s}
.fm-btn:hover{background:rgba(70,70,80,0.9);transform:translateY(-1px)}
.fm-btn.active{background:linear-gradient(135deg,rgba(150,40,60,0.8),rgba(100,30,50,0.7));border-color:rgba(200,60,80,0.6);box-shadow:0 0 8px rgba(150,40,60,0.5)}
.fm-footer{padding:10px 14px;border-top:1px solid rgba(255,255,255,0.1);display:flex;gap:8px}
.fm-footer button{flex:1;padding:8px;border-radius:6px;color:#fff;cursor:pointer;font-size:12px;border:1px solid}
.fm-clr{background:rgba(60,20,20,0.6);border-color:rgba(120,40,40,0.4)}
.fm-clr:hover{background:rgba(80,30,30,0.8)}
#fm-open-btn{position:fixed;top:70px;right:15px;min-width:45px;height:45px;padding:0 10px;background:linear-gradient(135deg,rgba(150,40,60,0.95),rgba(100,30,50,0.9));border:none;border-radius:23px;font-size:18px;cursor:pointer;z-index:99998;box-shadow:0 4px 15px rgba(150,40,60,0.5);transition:all 0.2s;color:#fff}
#fm-open-btn:hover{transform:scale(1.1)}
.fm-cats::-webkit-scrollbar{width:4px}
.fm-cats::-webkit-scrollbar-thumb{background:rgba(150,40,60,0.6);border-radius:2px}
.fm-custom{padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.1)}
.fm-custom-h{font-size:11px;opacity:0.7;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center}
.fm-custom-add{background:rgba(40,80,40,0.6);border:1px solid rgba(80,150,80,0.4);color:#fff;padding:3px 8px;border-radius:4px;cursor:pointer;font-size:10px}
.fm-custom-add:hover{background:rgba(50,100,50,0.8)}
#fm-custom-list{display:flex;flex-direction:column;gap:4px}
.fm-custom-item{display:flex;justify-content:space-between;align-items:center;padding:4px 8px;background:rgba(50,50,60,0.6);border-radius:4px;font-size:11px}
.fm-custom-item.active{background:linear-gradient(135deg,rgba(150,40,60,0.6),rgba(100,30,50,0.5))}
.fm-custom-toggle{cursor:pointer;flex:1}
.fm-custom-del{cursor:pointer;opacity:0.6;font-size:10px}
.fm-custom-del:hover{opacity:1}
.fm-modal{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:100000;display:none;align-items:center;justify-content:center}
.fm-modal.open{display:flex}
.fm-modal-content{background:var(--SmartThemeBlurTintColor,rgba(30,30,35,0.98));border:1px solid var(--SmartThemeBorderColor,rgba(255,100,120,0.4));border-radius:12px;padding:20px;width:90%;max-width:400px}
.fm-modal h4{margin:0 0 15px 0;font-size:16px}
.fm-modal input,.fm-modal textarea{width:100%;background:rgba(40,40,50,0.9);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:8px;border-radius:6px;margin-bottom:10px;font-family:inherit}
.fm-modal textarea{min-height:80px;resize:vertical}
.fm-modal-btns{display:flex;gap:10px;margin-top:15px}
.fm-modal-btns button{flex:1;padding:10px;border-radius:6px;cursor:pointer;font-size:13px;border:none}
.fm-modal-save{background:rgba(40,100,40,0.8);color:#fff}
.fm-modal-save:hover{background:rgba(50,120,50,0.9)}
.fm-modal-cancel{background:rgba(60,60,70,0.8);color:#fff}
.fm-modal-cancel:hover{background:rgba(80,80,90,0.9)}
`;


function buildHTML() {
    let catsHtml = '';
    for (const [ck, c] of Object.entries(CATEGORIES)) {
        const items = Object.entries(FETISHES).filter(([_, f]) => f.cat === ck);
        let btns = items.map(([k, f]) => `<button class="fm-btn" data-f="${k}">${f.icon} ${f.name}</button>`).join('');
        catsHtml += `<div class="fm-cat"><div class="fm-cat-h">${c.icon} ${c.name}</div><div class="fm-cat-i">${btns}</div></div>`;
    }

    return `
        <div id="fm-panel">
            <div class="fm-head" id="fm-drag-handle">
                <h4>🔥 Fetish Manager</h4>
                <button class="fm-x">✕</button>
            </div>
            <div class="fm-ctrl">
                <div class="fm-row"><label><input type="checkbox" id="fm-enabled" checked> Включено</label></div>
                <div class="fm-row"><label>Сила:</label><select id="fm-intensity"><option value="low">Слабо</option><option value="medium" selected>Средне</option><option value="high">Сильно</option></select></div>
                <div class="fm-row"><label>Шанс: <span id="fm-chance-val">70</span>%</label><input type="range" id="fm-chance" min="10" max="100" value="70" step="10"></div>
            </div>
            <div class="fm-act">
                <div class="fm-act-h">Активные:</div>
                <div id="fm-active-list"><em>Не выбрано</em></div>
            </div>
            <div class="fm-custom">
                <div class="fm-custom-h">
                    <span>Кастомные фетиши:</span>
                    <button class="fm-custom-add" id="fm-add-custom">+ Добавить</button>
                </div>
                <div id="fm-custom-list"><em style="opacity:0.5;font-size:11px;">Нет кастомных</em></div>
            </div>
            <div class="fm-cats">${catsHtml}</div>
            <div class="fm-footer">
                <button class="fm-clr" id="fm-clear">🗑️ Очистить</button>
            </div>
        </div>
        <button id="fm-open-btn">🔥</button>
        
        <div id="fm-modal" class="fm-modal">
            <div class="fm-modal-content">
                <h4>➕ Добавить фетиш</h4>
                <input type="text" id="fm-new-name" placeholder="Название (например: Латекс)" maxlength="30">
                <textarea id="fm-new-prompt" placeholder="Описание для AI (например: {{char}} derives pleasure from latex clothing, the shine and tightness)"></textarea>
                <div class="fm-modal-btns">
                    <button class="fm-modal-cancel" id="fm-modal-cancel">Отмена</button>
                    <button class="fm-modal-save" id="fm-modal-save">Сохранить</button>
                </div>
            </div>
        </div>
    `;
}


jQuery(async () => {
    try {
        loadState();
        

        $('head').append(`<style>${styles}</style>`);
        

        $('body').append(buildHTML());
        
        const $panel = $('#fm-panel');
        const $openBtn = $('#fm-open-btn');
        const $modal = $('#fm-modal');
        

        $openBtn.on('click', () => $panel.toggleClass('open'));
        $('.fm-x').on('click', () => $panel.removeClass('open'));
        

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
        

        $(document).on('click', '.fm-btn', function() {
            toggle($(this).data('f'));
        });
        
        $(document).on('click', '.fm-tag', function() {
            toggle($(this).data('f'));
        });
        

        $(document).on('click', '.fm-custom-toggle', function() {
            toggle($(this).data('f'));
        });
        

        $(document).on('click', '.fm-custom-del', function(e) {
            e.stopPropagation();
            removeCustomFetish($(this).data('id'));
        });
        

        $('#fm-clear').on('click', () => {
            state.active = [];
            updateUI();
            applyPrompt();
            saveState();
            showToast('Очищено');
        });
        

        $('#fm-add-custom').on('click', () => {
            $('#fm-new-name').val('');
            $('#fm-new-prompt').val('');
            $modal.addClass('open');
        });
        
        $('#fm-modal-cancel').on('click', () => $modal.removeClass('open'));
        
        $('#fm-modal-save').on('click', () => {
            const name = $('#fm-new-name').val().trim();
            const prompt = $('#fm-new-prompt').val().trim();
            if (name && prompt) {
                addCustomFetish(name, prompt);
                $modal.removeClass('open');
            } else {
                showToast('Заполни оба поля');
            }
        });
        

        $modal.on('click', function(e) {
            if (e.target === this) $modal.removeClass('open');
        });
        

        let isDragging = false;
        let offset = { x: 0, y: 0 };
        
        $('#fm-drag-handle').on('mousedown touchstart', function(e) {
            isDragging = true;
            const rect = $panel[0].getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            offset = { x: clientX - rect.left, y: clientY - rect.top };
            $panel.css({ right: 'auto', bottom: 'auto' });
            e.preventDefault();
        });
        
        $(document).on('mousemove touchmove', function(e) {
            if (!isDragging) return;
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            $panel.css({ left: clientX - offset.x + 'px', top: clientY - offset.y + 'px' });
        });
        
        $(document).on('mouseup touchend', () => isDragging = false);
        

        updateUI();
        applyPrompt();
        
        console.log('[Fetish Manager] Loaded! Active fetishes:', state.active.length);
        
    } catch (error) {
        console.error('[Fetish Manager] Error:', error);
    }
});
