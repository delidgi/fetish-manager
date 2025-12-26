/**
 * ST-Fetish-Manager Extension
 */

(function() {
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

    const CATS = {
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
        chance: 70
    };

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
        
        const intText = { low: 'subtle', medium: 'moderate', high: 'prominent' };
        let p = `[FETISH] Intensity: ${intText[state.intensity]} | Chance: ${state.chance}%\n`;
        
        state.active.forEach(k => {
            if (FETISHES[k]) p += FETISHES[k].prompt + '\n';
        });
        
        p += `Roll 1d100: if ≤${state.chance} integrate fetish, else vanilla with hints.`;
        return p;
    }

    function applyPrompt() {
        const prompt = buildPrompt();
        try {
            if (window.SillyTavern && SillyTavern.getContext) {
                const ctx = SillyTavern.getContext();
                if (ctx.setExtensionPrompt) {
                    ctx.setExtensionPrompt(extensionName, prompt, 1, 0);
                }
            }
        } catch(e) {
            console.log('[FM] Prompt ready:', prompt.slice(0, 100) + '...');
        }
    }

    function updateUI() {
        document.querySelectorAll('.fm-btn').forEach(b => {
            b.classList.toggle('active', state.active.includes(b.dataset.f));
        });
        
        const list = document.getElementById('fm-list');
        if (list) {
            if (state.active.length === 0) {
                list.innerHTML = '<em>Не выбрано</em>';
            } else {
                list.innerHTML = state.active.map(k => {
                    const f = FETISHES[k];
                    return f ? `<span class="fm-tag" data-f="${k}">${f.icon}${f.name} ✕</span>` : '';
                }).join('');
            }
        }
    }

    function toggle(k) {
        const i = state.active.indexOf(k);
        if (i === -1) state.active.push(k);
        else state.active.splice(i, 1);
        updateUI();
        applyPrompt();
        saveState();
    }

    function createPanel() {
        // Стили
        const style = document.createElement('style');
        style.textContent = `
            #fm-panel{position:fixed;top:50px;right:15px;width:280px;max-height:70vh;background:rgba(20,20,25,0.97);border:1px solid rgba(255,80,100,0.4);border-radius:10px;z-index:99999;display:none;flex-direction:column;font-family:sans-serif;color:#eee;font-size:13px;box-shadow:0 5px 25px rgba(0,0,0,0.5)}
            #fm-panel.open{display:flex}
            .fm-head{display:flex;justify-content:space-between;align-items:center;padding:8px 12px;background:linear-gradient(135deg,rgba(150,40,60,0.5),rgba(80,20,40,0.4));border-radius:10px 10px 0 0}
            .fm-head h4{margin:0;font-size:14px}
            .fm-x{background:none;border:none;color:#fff;font-size:18px;cursor:pointer;opacity:0.7}
            .fm-x:hover{opacity:1}
            .fm-ctrl{padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;flex-direction:column;gap:6px}
            .fm-row{display:flex;align-items:center;gap:8px}
            .fm-row label{flex:1}
            .fm-row select,.fm-row input{flex:1;background:rgba(40,40,50,0.9);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:3px 6px;border-radius:4px}
            .fm-act{padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.1)}
            .fm-act-h{font-size:11px;opacity:0.7;margin-bottom:4px}
            #fm-list{display:flex;flex-wrap:wrap;gap:4px;min-height:20px}
            .fm-tag{background:rgba(150,40,60,0.6);padding:2px 6px;border-radius:8px;font-size:11px;cursor:pointer}
            .fm-tag:hover{background:rgba(180,50,70,0.8)}
            .fm-cats{flex:1;overflow-y:auto;padding:8px}
            .fm-cat{margin-bottom:8px}
            .fm-cat-h{font-size:11px;font-weight:bold;margin-bottom:4px;opacity:0.8;border-bottom:1px dashed rgba(255,255,255,0.2);padding-bottom:2px}
            .fm-cat-i{display:flex;flex-wrap:wrap;gap:3px}
            .fm-btn{display:flex;align-items:center;gap:3px;padding:4px 7px;background:rgba(50,50,60,0.8);border:1px solid rgba(255,255,255,0.15);border-radius:4px;color:#eee;font-size:11px;cursor:pointer;transition:all 0.15s}
            .fm-btn:hover{background:rgba(70,70,80,0.9)}
            .fm-btn.active{background:linear-gradient(135deg,rgba(150,40,60,0.7),rgba(100,30,50,0.6));border-color:rgba(200,60,80,0.5);box-shadow:0 0 6px rgba(150,40,60,0.4)}
            .fm-clr{margin:8px 12px;padding:6px;background:rgba(60,20,20,0.6);border:1px solid rgba(120,40,40,0.4);border-radius:5px;color:#fff;cursor:pointer;font-size:12px}
            .fm-clr:hover{background:rgba(80,30,30,0.8)}
            #fm-open{position:fixed;top:70px;right:15px;width:40px;height:40px;background:linear-gradient(135deg,rgba(150,40,60,0.9),rgba(100,30,50,0.8));border:none;border-radius:50%;font-size:20px;cursor:pointer;z-index:99998;box-shadow:0 3px 12px rgba(150,40,60,0.5)}
            #fm-open:hover{transform:scale(1.1)}
            .fm-cats::-webkit-scrollbar{width:3px}
            .fm-cats::-webkit-scrollbar-thumb{background:rgba(150,40,60,0.5);border-radius:2px}
        `;
        document.head.appendChild(style);

        // Категории
        let catsHtml = '';
        for (const [ck, c] of Object.entries(CATS)) {
            const items = Object.entries(FETISHES).filter(([_,f]) => f.cat === ck);
            let btns = items.map(([k, f]) => `<button class="fm-btn" data-f="${k}">${f.icon}${f.name}</button>`).join('');
            catsHtml += `<div class="fm-cat"><div class="fm-cat-h">${c.icon} ${c.name}</div><div class="fm-cat-i">${btns}</div></div>`;
        }

        // Панель
        const panel = document.createElement('div');
        panel.innerHTML = `
            <div id="fm-panel">
                <div class="fm-head"><h4>🔥 Fetish Manager</h4><button class="fm-x">✕</button></div>
                <div class="fm-ctrl">
                    <div class="fm-row"><label><input type="checkbox" id="fm-on" checked> Включено</label></div>
                    <div class="fm-row"><label>Сила:</label><select id="fm-int"><option value="low">Слабо</option><option value="medium" selected>Средне</option><option value="high">Сильно</option></select></div>
                    <div class="fm-row"><label>Шанс: <span id="fm-ch-v">70</span>%</label><input type="range" id="fm-ch" min="10" max="100" value="70" step="10"></div>
                </div>
                <div class="fm-act"><div class="fm-act-h">Активные:</div><div id="fm-list"><em>Не выбрано</em></div></div>
                <div class="fm-cats">${catsHtml}</div>
                <button class="fm-clr">🗑️ Очистить</button>
            </div>
            <button id="fm-open">🔥</button>
        `;
        document.body.appendChild(panel);

        // События
        document.getElementById('fm-open').onclick = () => {
            document.getElementById('fm-panel').classList.toggle('open');
        };
        document.querySelector('.fm-x').onclick = () => {
            document.getElementById('fm-panel').classList.remove('open');
        };
        document.getElementById('fm-on').checked = state.enabled;
        document.getElementById('fm-on').onchange = function() {
            state.enabled = this.checked;
            applyPrompt();
            saveState();
        };
        document.getElementById('fm-int').value = state.intensity;
        document.getElementById('fm-int').onchange = function() {
            state.intensity = this.value;
            applyPrompt();
            saveState();
        };
        document.getElementById('fm-ch').value = state.chance;
        document.getElementById('fm-ch-v').textContent = state.chance;
        document.getElementById('fm-ch').oninput = function() {
            state.chance = parseInt(this.value);
            document.getElementById('fm-ch-v').textContent = this.value;
            applyPrompt();
            saveState();
        };
        document.querySelectorAll('.fm-btn').forEach(b => {
            b.onclick = () => toggle(b.dataset.f);
        });
        document.getElementById('fm-list').onclick = (e) => {
            if (e.target.classList.contains('fm-tag')) {
                toggle(e.target.dataset.f);
            }
        };
        document.querySelector('.fm-clr').onclick = () => {
            state.active = [];
            updateUI();
            applyPrompt();
            saveState();
        };

        updateUI();
    }

    // Запуск
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    function init() {
        loadState();
        createPanel();
        applyPrompt();
        console.log('[Fetish Manager] Loaded!');
    }
})();
