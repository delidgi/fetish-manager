import { setExtensionPrompt, extension_prompt_types, extension_prompt_roles } from '../../../../script.js';

const extensionName = 'fetish-manager';

const FETISHES = {
    bdsm: { name: "БДСМ", icon: "⛓️", cat: "power", prompt: `[FETISH: BDSM] {{char}} has interest in BDSM.` },
    domination: { name: "Доминирование", icon: "👑", cat: "power", prompt: `[FETISH: Domination] {{char}} takes control.` },
    masochism: { name: "Мазохизм", icon: "🔥", cat: "power", prompt: `[FETISH: Masochism] {{char}} enjoys pain.` },
    bondage: { name: "Бондаж", icon: "🪢", cat: "power", prompt: `[FETISH: Bondage] {{char}} enjoys restraints.` },
    brat_taming: { name: "Приручение", icon: "😈", cat: "power", prompt: `[FETISH: Brat Taming] {{char}} provokes punishment.` },
    freeuse: { name: "Freeuse", icon: "🔓", cat: "power", prompt: `[FETISH: Free Use] {{char}} available anytime.` },
    humiliation: { name: "Унижение", icon: "😳", cat: "psych", prompt: `[FETISH: Humiliation] {{char}} enjoys degradation.` },
    praise: { name: "Похвала", icon: "✨", cat: "psych", prompt: `[FETISH: Praise] {{char}} loves praise.` },
    daddy: { name: "Папочка", icon: "🎩", cat: "psych", prompt: `[FETISH: Daddy] {{char}} enjoys daddy role.` },
    corruption: { name: "Развращение", icon: "🍎", cat: "psych", prompt: `[FETISH: Corruption] {{char}} corrupts innocence.` },
    public: { name: "Публичный", icon: "🏙️", cat: "risk", prompt: `[FETISH: Public] {{char}} enjoys public intimacy.` },
    risk: { name: "Риск", icon: "👀", cat: "risk", prompt: `[FETISH: Risk] {{char}} craves discovery risk.` },
    voyeurism: { name: "Вуайеризм", icon: "🔭", cat: "risk", prompt: `[FETISH: Voyeurism] {{char}} watches others.` },
    anal: { name: "Анал", icon: "🍑", cat: "body", prompt: `[FETISH: Anal] {{char}} enjoys anal.` },
    gagging: { name: "Гаггинг", icon: "💦", cat: "body", prompt: `[FETISH: Gagging] {{char}} enjoys gagging.` },
    impact: { name: "Шлепки", icon: "✋", cat: "body", prompt: `[FETISH: Impact] {{char}} enjoys spanking.` },
    groping: { name: "Лапанье", icon: "🤲", cat: "body", prompt: `[FETISH: Groping] {{char}} touches constantly.` },
    size_diff: { name: "Размеры", icon: "📏", cat: "body", prompt: `[FETISH: Size Diff] {{char}} enjoys size contrast.` },
    breasts: { name: "Грудь", icon: "🍈", cat: "body", prompt: `[FETISH: Breasts] {{char}} obsessed with breasts.` },
    foot: { name: "Ноги", icon: "🦶", cat: "body", prompt: `[FETISH: Foot] {{char}} enjoys feet.` },
    blindfold: { name: "Повязка", icon: "🙈", cat: "sense", prompt: `[FETISH: Blindfold] {{char}} enjoys blindfolds.` },
    mirror: { name: "Зеркала", icon: "🪞", cat: "sense", prompt: `[FETISH: Mirror] {{char}} watches in mirrors.` },
    latex: { name: "Латекс", icon: "🖤", cat: "sense", prompt: `[FETISH: Latex] {{char}} enjoys latex.` },
    toys: { name: "Игрушки", icon: "🎀", cat: "sense", prompt: `[FETISH: Toys] {{char}} uses toys.` },
    roleplay: { name: "Ролеплей", icon: "🎭", cat: "sense", prompt: `[FETISH: Roleplay] {{char}} enjoys roles.` },
    petplay: { name: "Петплей", icon: "🐾", cat: "sense", prompt: `[FETISH: Petplay] {{char}} enjoys pet play.` },
    aftercare: { name: "Aftercare", icon: "🫂", cat: "rel", prompt: `[FETISH: Aftercare] {{char}} gives aftercare.` },
    dirty_talk: { name: "Грязный разговор", icon: "🗣️", cat: "rel", prompt: `[FETISH: Dirty Talk] {{char}} talks dirty.` },
    worship: { name: "Поклонение", icon: "🛐", cat: "rel", prompt: `[FETISH: Worship] {{char}} worships partner.` },
    gangbang: { name: "Групповой", icon: "👥", cat: "rel", prompt: `[FETISH: Gangbang] {{char}} enjoys groups.` }
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

function prompt() {
    if (!state.enabled || !state.active.length) return '';
    let p = `[FETISH: ${state.intensity}, ${state.chance}%]\n`;
    state.active.forEach(k => { if(FETISHES[k]) p += FETISHES[k].prompt + '\n'; });
    return p;
}

function apply() {
    setExtensionPrompt(extensionName, prompt(), extension_prompt_types.IN_CHAT, 0, true, false, null, extension_prompt_roles.SYSTEM);
}

function ui() {
    $('.fm-b').each(function() { $(this).toggleClass('on', state.active.includes($(this).data('k'))); });
    const h = state.active.map(k => FETISHES[k] ? `<span class="fm-t" data-k="${k}">${FETISHES[k].icon}✕</span>` : '').join('') || '<i>—</i>';
    $('#fm-list').html(h);
    $('#fm-btn').text(state.active.length ? `🔥${state.active.length}` : '🔥');
}

function toggle(k) {
    const i = state.active.indexOf(k);
    if (i < 0) state.active.push(k); else state.active.splice(i, 1);
    ui(); apply(); save();
}

jQuery(() => {
    load();
    
    // Стили — ИНЛАЙН, без внешних зависимостей
    $('head').append(`<style>
#fm-btn{position:fixed!important;bottom:120px!important;right:8px!important;width:48px!important;height:48px!important;background:#8b3a50!important;border:2px solid #c46!important;border-radius:50%!important;font-size:18px!important;color:#fff!important;cursor:pointer!important;z-index:99999!important;display:flex!important;align-items:center!important;justify-content:center!important;box-shadow:0 4px 15px rgba(0,0,0,0.5)!important;-webkit-tap-highlight-color:transparent!important}
#fm-p{display:none;position:fixed!important;bottom:180px!important;right:8px!important;width:280px!important;max-width:90vw!important;max-height:60vh!important;background:#1a1a1f!important;border:1px solid #a55!important;border-radius:12px!important;z-index:99999!important;flex-direction:column!important;font:13px system-ui,sans-serif!important;color:#eee!important;box-shadow:0 8px 30px rgba(0,0,0,0.7)!important;overflow:hidden!important}
#fm-p.open{display:flex!important}
.fm-h{display:flex!important;justify-content:space-between!important;align-items:center!important;padding:10px 12px!important;background:linear-gradient(135deg,#8b3a50,#5a2535)!important;font-weight:600!important}
.fm-x{background:none!important;border:none!important;color:#fff!important;font-size:22px!important;cursor:pointer!important;padding:8px!important}
.fm-c{padding:10px 12px!important;border-bottom:1px solid #333!important}
.fm-r{display:flex!important;align-items:center!important;gap:8px!important;margin:6px 0!important}
.fm-r select,.fm-r input[type=range]{flex:1!important;background:#333!important;border:1px solid #555!important;color:#fff!important;padding:4px!important;border-radius:4px!important}
#fm-list{display:flex!important;flex-wrap:wrap!important;gap:4px!important;padding:8px 12px!important;min-height:30px!important;border-bottom:1px solid #333!important}
.fm-t{background:#a55!important;padding:4px 8px!important;border-radius:10px!important;font-size:11px!important;cursor:pointer!important}
.fm-s{flex:1!important;overflow-y:auto!important;padding:8px!important;-webkit-overflow-scrolling:touch!important}
.fm-g{margin-bottom:10px!important}
.fm-g-h{font-size:11px!important;font-weight:600!important;margin-bottom:5px!important;opacity:0.7!important}
.fm-g-i{display:flex!important;flex-wrap:wrap!important;gap:4px!important}
.fm-b{padding:6px 8px!important;background:#333!important;border:1px solid #444!important;border-radius:6px!important;color:#ccc!important;font-size:11px!important;cursor:pointer!important}
.fm-b.on{background:linear-gradient(135deg,#8b3a50,#6a2a40)!important;border-color:#c66!important;color:#fff!important}
.fm-f{padding:8px 12px!important;border-top:1px solid #333!important}
.fm-clr{width:100%!important;padding:8px!important;background:#533!important;border:none!important;border-radius:6px!important;color:#fff!important;cursor:pointer!important}
</style>`);
    
    // HTML
    let cats = '';
    for (const [ck, c] of Object.entries(CATEGORIES)) {
        const bs = Object.entries(FETISHES).filter(([_,f])=>f.cat===ck).map(([k,f])=>`<button class="fm-b" data-k="${k}">${f.icon} ${f.name}</button>`).join('');
        cats += `<div class="fm-g"><div class="fm-g-h">${c.icon} ${c.name}</div><div class="fm-g-i">${bs}</div></div>`;
    }
    
    $('body').append(`
<button id="fm-btn">🔥</button>
<div id="fm-p">
<div class="fm-h"><span>🔥 Fetish Manager</span><button class="fm-x">✕</button></div>
<div class="fm-c">
<div class="fm-r"><label><input type="checkbox" id="fm-on" checked> Вкл</label></div>
<div class="fm-r"><span>Сила:</span><select id="fm-int"><option value="low">Слабо</option><option value="medium" selected>Средне</option><option value="high">Сильно</option></select></div>
<div class="fm-r"><span>Шанс: <b id="fm-cv">70</b>%</span><input type="range" id="fm-ch" min="10" max="100" value="70" step="10"></div>
</div>
<div id="fm-list"><i>—</i></div>
<div class="fm-s">${cats}</div>
<div class="fm-f"><button class="fm-clr" id="fm-clr">🗑️ Очистить</button></div>
</div>
`);
    
    // События
    $('#fm-btn').on('click', function(e) { e.preventDefault(); e.stopPropagation(); $('#fm-p').toggleClass('open'); });
    $('.fm-x').on('click', function() { $('#fm-p').removeClass('open'); });
    
    $('#fm-on').prop('checked', state.enabled).on('change', function() { state.enabled = this.checked; apply(); save(); });
    $('#fm-int').val(state.intensity).on('change', function() { state.intensity = this.value; apply(); save(); });
    $('#fm-ch').val(state.chance).on('input', function() { state.chance = +this.value; $('#fm-cv').text(this.value); apply(); save(); });
    
    $(document).on('click', '.fm-b', function(e) { e.preventDefault(); toggle($(this).data('k')); });
    $(document).on('click', '.fm-t', function(e) { e.preventDefault(); toggle($(this).data('k')); });
    $('#fm-clr').on('click', function() { state.active = []; ui(); apply(); save(); });
    
    ui();
    apply();
    
    console.log('[FM] v7 ready');
});
