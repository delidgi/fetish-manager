/**
 * ST-Fetish-Manager Extension
 */

(function() {
    const extensionName = 'fetish-manager';

    const FETISHES = {
        bdsm: { name: "БДСМ", icon: "⛓️", cat: "power", prompt: `[FETISH: BDSM] {{char}} has a sexual interest in BDSM — bondage, discipline, dominance/submission, sadomasochism. Integrate power dynamics, restraints, rules, and controlled pain/pleasure when contextually appropriate.` },
        domination: { name: "Доминирование", icon: "👑", cat: "power", prompt: `[FETISH: Domination] {{char}} derives sexual pleasure from taking control. They command, direct, and establish authority during intimate encounters.` },
        masochism: { name: "Мазохизм", icon: "🔥", cat: "power", prompt: `[FETISH: Masochism] {{char}} derives pleasure from receiving pain — physical or emotional. Pain translates to arousal.` },
        bondage: { name: "Бондаж", icon: "🪢", cat: "power", prompt: `[FETISH: Bondage] {{char}} enjoys restraining their partner or being restrained — ropes, cuffs, ties.` },
        brat_taming: { name: "Приручение", icon: "😈", cat: "power", prompt: `[FETISH: Brat Taming] {{char}} deliberately provokes to elicit punishment and "taming" from their dominant partner.` },
        freeuse: { name: "Свободное использование", icon: "🔓", cat: "power", prompt: `[FETISH: Free Use] {{char}} operates under agreement where partner can be used sexually anytime without warning.` },
        
        humiliation: { name: "Унижение", icon: "😳", cat: "psych", prompt: `[FETISH: Humiliation] {{char}} enjoys being humiliated — name-calling, verbal degradation. Shame becomes arousal.` },
        praise: { name: "Похвала", icon: "✨", cat: "psych", prompt: `[FETISH: Praise Kink] {{char}} loves praising their partner explicitly — "good girl/boy". Praise heightens desire.` },
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
        
        const intText = { low: 'subtly, with light hints', medium: 'naturally, when context supports', high: 'prominently, as core sexual drive' };
        let p = `[FETISH SYSTEM]\nIntensity: ${intText[state.intensity]}\nTrigger chance: ${state.chance}%\n\nActive fetishes for {{char}}:\n`;
        
        state.active.forEach(k => {
            if (FETISHES[k]) p += '\n' + FETISHES[k].prompt;
        });
        
        p += `\n\n[FETISH LOGIC]\n- Roll 1d100 before each response\n- If roll ≤ ${state.chance}: incorporate active fetish naturally into scene\n- If roll > ${state.chance}: keep scene vanilla, but {{char}} may show subtle hints\n- Never force fetish into incompatible context\n- Build tension before explicit content`;
        
        return p;
    }

    function applyPrompt() {
        const prompt = buildPrompt();
        
        // Метод 1: через SillyTavern.getContext()
        try {
            if (typeof SillyTavern !== 'undefined' && SillyTavern.getContext) {
                const ctx = SillyTavern.getContext();
                if (ctx.setExtensionPrompt) {
                    ctx.setExtensionPrompt(extensionName, prompt, 1, 0, true, false);
                    console.log('[FM] Applied via setExtensionPrompt');
                    updateIndicator(true);
                    return;
                }
            }
        } catch(e) {
            console.log('[FM] setExtensionPrompt failed:', e);
        }
        
        // Метод 2: через eventSource
        try {
            if (typeof eventSource !== 'undefined') {
                eventSource.on('generate_before_combine_prompts', (data) => {
                    if (prompt && state.enabled) {
                        data.combinedPrompt = prompt + '\n\n' + data.combinedPrompt;
                    }
                });
                console.log('[FM] Applied via eventSource');
                updateIndicator(true);
                return;
            }
        } catch(e) {
            console.log('[FM] eventSource failed:', e);
        }
        
        // Метод 3: Сохраняем в глобальную переменную для ручного копирования
        window.FETISH_PROMPT = prompt;
        console.log('[FM] Prompt saved to window.FETISH_PROMPT');
        console.log('[FM] Prompt:', prompt);
        updateIndicator(prompt ? true : false);
    }

    function updateIndicator(active) {
        const btn = document.getElementById('fm-open');
        if (btn) {
            btn.style.boxShadow = active && state.active.length > 0 
                ? '0 0 15px rgba(0,255,100,0.7)' 
                : '0 3px 12px rgba(150,40,60,0.5)';
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
                    return f ? `<span class="fm-tag" data-f="${k}">${f.icon} ${f.name} ✕</span>` : '';
                }).join('');
            }
        }
        
        // Обновляем счётчик на кнопке
        const openBtn = document.getElementById('fm-open');
        if (openBtn) {
            openBtn.textContent = state.active.length > 0 ? `🔥${state.active.length}` : '🔥';
        }
    }

    function toggle(k) {
        const i = state.active.indexOf(k);
        if (i === -1) state.active.push(k);
        else state.active.splice(i, 1);
        updateUI();
        applyPrompt();
        saveState();
        showToast(i === -1 ? `${FETISHES[k].icon} ${FETISHES[k].name} добавлен` : `${FETISHES[k].name} убран`);
    }

    function showToast(msg) {
        const toast = document.createElement('div');
        toast.textContent = msg;
        toast.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:rgba(30,30,35,0.95);color:#fff;padding:8px 16px;border-radius:8px;z-index:100000;font-size:13px;border:1px solid rgba(150,40,60,0.5);';
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }

    function copyPrompt() {
        const prompt = buildPrompt();
        if (!prompt) {
            showToast('Нет активных фетишей');
            return;
        }
        navigator.clipboard.writeText(prompt).then(() => {
            showToast('Промпт скопирован!');
        }).catch(() => {
            console.log('[FM] Prompt to copy:', prompt);
            showToast('Смотри консоль (F12)');
        });
    }

    function createPanel() {
        const style = document.createElement('style');
        style.textContent = `
            #fm-panel{position:fixed;top:50px;right:15px;width:290px;max-height:75vh;background:rgba(20,20,25,0.98);border:1px solid rgba(255,80,100,0.5);border-radius:12px;z-index:99999;display:none;flex-direction:column;font-family:sans-serif;color:#eee;font-size:13px;box-shadow:0 8px 30px rgba(0,0,0,0.6)}
            #fm-panel.open{display:flex}
            .fm-head{display:flex;justify-content:space-between;align-items:center;padding:10px 14px;background:linear-gradient(135deg,rgba(150,40,60,0.6),rgba(80,20,40,0.5));border-radius:12px 12px 0 0}
            .fm-head h4{margin:0;font-size:14px}
            .fm-x{background:none;border:none;color:#fff;font-size:18px;cursor:pointer;opacity:0.7}
            .fm-x:hover{opacity:1}
            .fm-ctrl{padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.1);display:flex;flex-direction:column;gap:8px}
            .fm-row{display:flex;align-items:center;gap:8px}
            .fm-row label{flex:1}
            .fm-row select,.fm-row input{flex:1;background:rgba(40,40,50,0.9);border:1px solid rgba(255,255,255,0.2);color:#fff;padding:4px 8px;border-radius:4px}
            .fm-act{padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.1)}
            .fm-act-h{font-size:11px;opacity:0.7;margin-bottom:6px}
            #fm-list{display:flex;flex-wrap:wrap;gap:5px;min-height:24px}
            .fm-tag{background:rgba(150,40,60,0.7);padding:3px 8px;border-radius:10px;font-size:11px;cursor:pointer;transition:all 0.15s}
            .fm-tag:hover{background:rgba(180,50,70,0.9)}
            .fm-cats{flex:1;overflow-y:auto;padding:10px}
            .fm-cat{margin-bottom:10px}
            .fm-cat-h{font-size:12px;font-weight:bold;margin-bottom:6px;opacity:0.9;border-bottom:1px dashed rgba(255,255,255,0.2);padding-bottom:3px}
            .fm-cat-i{display:flex;flex-wrap:wrap;gap:4px}
            .fm-btn{display:flex;align-items:center;gap:3px;padding:5px 8px;background:rgba(50,50,60,0.8);border:1px solid rgba(255,255,255,0.15);border-radius:5px;color:#eee;font-size:11px;cursor:pointer;transition:all 0.15s}
            .fm-btn:hover{background:rgba(70,70,80,0.9);transform:translateY(-1px)}
            .fm-btn.active{background:linear-gradient(135deg,rgba(150,40,60,0.8),rgba(100,30,50,0.7));border-color:rgba(200,60,80,0.6);box-shadow:0 0 8px rgba(150,40,60,0.5)}
            .fm-btns{display:flex;gap:8px;margin:10px 14px}
            .fm-copy,.fm-clr{flex:1;padding:8px;border-radius:6px;color:#fff;cursor:pointer;font-size:12px;border:1px solid}
            .fm-copy{background:rgba(40,80,40,0.6);border-color:rgba(80,150,80,0.4)}
            .fm-copy:hover{background:rgba(50,100,50,0.8)}
            .fm-clr{background:rgba(60,20,20,0.6);border-color:rgba(120,40,40,0.4)}
            .fm-clr:hover{background:rgba(80,30,30,0.8)}
            #fm-open{position:fixed;top:70px;right:15px;min-width:42px;height:42px;padding:0 8px;background:linear-gradient(135deg,rgba(150,40,60,0.95),rgba(100,30,50,0.9));border:none;border-radius:21px;font-size:18px;cursor:pointer;z-index:99998;box-shadow:0 3px 12px rgba(150,40,60,0.5);transition:all 0.2s}
            #fm-open:hover{transform:scale(1.1)}
            .fm-cats::-webkit-scrollbar{width:4px}
            .fm-cats::-webkit-scrollbar-thumb{background:rgba(150,40,60,0.6);border-radius:2px}
            .fm-status{padding:6px 14px;font-size:11px;opacity:0.7;border-top:1px solid rgba(255,255,255,0.1);text-align:center}
        `;
        document.head.appendChild(style);

        let catsHtml = '';
        for (const [ck, c] of Object.entries(CATS)) {
            const items = Object.entries(FETISHES).filter(([_,f]) => f.cat === ck);
            let btns = items.map(([k, f]) => `<button class="fm-btn" data-f="${k}">${f.icon} ${f.name}</button>`).join('');
            catsHtml += `<div class="fm-cat"><div class="fm-cat-h">${c.icon} ${c.name}</div><div class="fm-cat-i">${btns}</div></div>`;
        }

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
                <div class="fm-btns">
                    <button class="fm-copy">📋 Копировать промпт</button>
                    <button class="fm-clr">🗑️ Очистить</button>
                </div>
                <div class="fm-status">Промпт применяется автоматически</div>
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
        document.querySelector('.fm-copy').onclick = copyPrompt;
        document.querySelector('.fm-clr').onclick = () => {
            state.active = [];
            updateUI();
            applyPrompt();
            saveState();
            showToast('Очищено');
        };

        updateUI();
    }

    // Запуск
    function init() {
        loadState();
        createPanel();
        applyPrompt();
        console.log('[Fetish Manager] Loaded! Active:', state.active.length);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
