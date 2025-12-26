/**
 * ST-Fetish-Manager Extension
 * Управление фетишами персонажей с логикой применения
 */

import { saveSettingsDebounced, getContext } from '../../../../script.js';
import { extension_settings, getContext as getExtContext } from '../../../extensions.js';
import { setExtensionPrompt, extension_prompt_types, extension_prompt_roles } from '../../../../script.js';

const extensionName = 'ST-Fetish-Manager';
const extensionFolderPath = `scripts/extensions/third-party/${extensionName}`;

// Коллекция фетишей
const FETISH_COLLECTION = {
    // БДСМ и власть
    bdsm: {
        name: "БДСМ",
        icon: "⛓️",
        category: "power",
        prompt: `[FETISH: BDSM] {{char}} has a sexual interest in BDSM — bondage, discipline, dominance/submission, sadomasochism. Integrate power dynamics, restraints, rules, and controlled pain/pleasure when contextually appropriate.`
    },
    domination: {
        name: "Доминирование",
        icon: "👑",
        category: "power",
        prompt: `[FETISH: Domination] {{char}} derives sexual pleasure from taking control. They command, direct, and establish authority during intimate encounters. They expect obedience and reward/punish accordingly.`
    },
    masochism: {
        name: "Мазохизм",
        icon: "🔥",
        category: "power",
        prompt: `[FETISH: Masochism] {{char}} derives pleasure from receiving pain — physical or emotional. They crave impact, restraint, degradation. Pain translates to arousal.`
    },
    bondage: {
        name: "Бондаж",
        icon: "🪢",
        category: "power",
        prompt: `[FETISH: Bondage] {{char}} enjoys restraining their partner or being restrained — ropes, cuffs, ties, scarves. The helplessness/control dynamic is arousing.`
    },
    brat_taming: {
        name: "Приручение",
        icon: "😈",
        category: "power",
        prompt: `[FETISH: Brat Taming] {{char}} deliberately provokes, disobeys, tests boundaries to elicit punishment and "taming" from their dominant partner. Defiance is foreplay.`
    },
    freeuse: {
        name: "Свободное использование",
        icon: "🔓",
        category: "power",
        prompt: `[FETISH: Free Use] {{char}} operates under agreement where partner can be used sexually anytime without warning. Spontaneous initiation during daily activities expected.`
    },

    // Унижение и психология
    humiliation: {
        name: "Унижение",
        icon: "😳",
        category: "psychological",
        prompt: `[FETISH: Humiliation] {{char}} enjoys being humiliated — name-calling, verbal degradation, being called slut/whore/bitch. Shame becomes arousal.`
    },
    praise: {
        name: "Похвала",
        icon: "✨",
        category: "psychological",
        prompt: `[FETISH: Praise Kink] {{char}} loves praising their partner explicitly — "good girl/boy", "so perfect", "you're doing so well". Praise heightens desire.`
    },
    daddy: {
        name: "Папочка",
        icon: "🎩",
        category: "psychological",
        prompt: `[FETISH: Daddy Kink] {{char}} is aroused by being called "Daddy" or using words emphasizing dominant, protective, paternal role. Power + care dynamic.`
    },
    corruption: {
        name: "Развращение",
        icon: "🍎",
        category: "psychological",
        prompt: `[FETISH: Corruption] {{char}} is aroused by corrupting innocence — teaching new acts, introducing kinks progressively, watching reactions to first experiences.`
    },
    ageplay: {
        name: "Возрастная регрессия",
        icon: "🧸",
        category: "psychological",
        prompt: `[FETISH: Age Regression] {{char}} finds comfort in partner regressing to childlike state for nurturing (non-sexual). Caregiver provides emotional support, rules, comfort within D/s dynamic.`
    },

    // Публичность и риск
    public: {
        name: "Публичный секс",
        icon: "🏙️",
        category: "risk",
        prompt: `[FETISH: Public Sex] {{char}} is aroused by intimacy in public spaces. The risk of being seen heightens excitement. They seek semi-private spots with danger of discovery.`
    },
    risk: {
        name: "На грани разоблачения",
        icon: "👀",
        category: "risk",
        prompt: `[FETISH: Risk of Discovery] {{char}} craves performing intimate acts while maintaining normal appearance. Hidden stimulation in public, secret touches, concealed arousal.`
    },
    voyeurism: {
        name: "Вуайеризм",
        icon: "🔭",
        category: "risk",
        prompt: `[FETISH: Voyeurism] {{char}} derives pleasure from watching others in intimate moments. Observing without being seen is the thrill.`
    },
    diy_porn: {
        name: "Самодельное порно",
        icon: "📹",
        category: "risk",
        prompt: `[FETISH: DIY Porn] {{char}} is aroused by recording intimate acts — filming, photographing, being watched through camera. Exhibition meets documentation.`
    },

    // Телесные
    anal: {
        name: "Анал",
        icon: "🍑",
        category: "physical",
        prompt: `[FETISH: Anal] {{char}} derives sexual pleasure from anal sex — giving or receiving. Preparation, sensation, taboo aspect all contribute to arousal.`
    },
    oral_gagging: {
        name: "До рвотных позывов",
        icon: "💦",
        category: "physical",
        prompt: `[FETISH: Gagging] {{char}} is aroused by gagging sounds, tears from deep oral, the struggle and submission of throat use.`
    },
    impact: {
        name: "Шлепки",
        icon: "✋",
        category: "physical",
        prompt: `[FETISH: Impact Play] {{char}} enjoys hitting or being hit — spanking, slapping, paddling, whipping. The sound, sting, and marks are arousing.`
    },
    groping: {
        name: "Лапанье",
        icon: "🤲",
        category: "physical",
        prompt: `[FETISH: Groping] {{char}} expresses attraction through constant touching — casual hands on buttocks, squeezing breasts during conversation, possessive physical contact.`
    },
    size_diff: {
        name: "Разница в размерах",
        icon: "📏",
        category: "physical",
        prompt: `[FETISH: Size Difference] {{char}} is aroused by stark contrast in physicality — feeling small/large compared to partner, being enveloped or enveloping.`
    },
    breasts: {
        name: "Грудь",
        icon: "🍈",
        category: "physical",
        prompt: `[FETISH: Breast Worship] {{char}} derives extreme pleasure from large breasts — observing, fondling, stimulating. Central focus in sexual encounters.`
    },
    hair: {
        name: "Волосы",
        icon: "💇",
        category: "physical",
        prompt: `[FETISH: Hair Fetish] {{char}} derives pleasure from touching, smelling, watching long thick hair. May use hair for restraint or sensory play.`
    },
    foot: {
        name: "Футфетиш",
        icon: "🦶",
        category: "physical",
        prompt: `[FETISH: Foot Fetish] {{char}} is aroused by feet — touching, kissing, massaging, smelling. Feet are erogenous zone for them.`
    },
    scars: {
        name: "Шрамы",
        icon: "⚔️",
        category: "physical",
        prompt: `[FETISH: Scars] {{char}} is attracted to scars, old injuries, physical imperfections. These marks are focus of attention during foreplay.`
    },
    lactation: {
        name: "Лактация",
        icon: "🍼",
        category: "physical",
        prompt: `[FETISH: Lactation] {{char}} is aroused by lactation — the sight, taste, act of nursing. Breast milk is erotic.`
    },
    pregnancy: {
        name: "Беременность",
        icon: "🤰",
        category: "physical",
        prompt: `[FETISH: Pregnancy] {{char}} is aroused by pregnant bodies — the rounded belly, swollen breasts, fertility aspect. May include breeding kink.`
    },
    blood: {
        name: "Кровь",
        icon: "🩸",
        category: "physical",
        prompt: `[FETISH: Blood] {{char}} experiences arousal at sight of blood — from biting, scratching, cutting. The primal, dangerous aspect excites.`
    },

    // Атрибуты и обстановка
    blindfold: {
        name: "Завязанные глаза",
        icon: "🙈",
        category: "sensory",
        prompt: `[FETISH: Blindfold] {{char}} is aroused by blindfolded sex — the vulnerability, heightened senses, loss of control from not seeing.`
    },
    mirror: {
        name: "Зеркала",
        icon: "🪞",
        category: "sensory",
        prompt: `[FETISH: Mirror Sex] {{char}} is aroused by watching themselves and partner in mirrors during intimacy. Visual feedback heightens experience.`
    },
    latex: {
        name: "Латекс",
        icon: "🖤",
        category: "sensory",
        prompt: `[FETISH: Latex] {{char}} derives pleasure from wearing or seeing partner in latex — the shine, tightness, smell, restriction.`
    },
    toys: {
        name: "Секс-игрушки",
        icon: "🎀",
        category: "sensory",
        prompt: `[FETISH: Sex Toys] {{char}} enjoys actively using toys — vibrators, plugs, restraints, machines. Toys enhance and extend pleasure.`
    },
    makeup: {
        name: "Макияж",
        icon: "💄",
        category: "sensory",
        prompt: `[FETISH: Makeup] {{char}} is aroused by heavy makeup — or watching it get ruined, smeared, running during sex.`
    },
    roleplay: {
        name: "Ролевая игра",
        icon: "🎭",
        category: "sensory",
        prompt: `[FETISH: Roleplay] {{char}} derives pleasure from costumes, characters, scenarios — playing roles during intimacy.`
    },
    petplay: {
        name: "Петплей",
        icon: "🐾",
        category: "sensory",
        prompt: `[FETISH: Pet Play] {{char}} enjoys playing pet/owner — collars, leashes, commands, pet behaviors. Power dynamic through animal roleplay.`
    },
    medical: {
        name: "Медицинская игра",
        icon: "🩺",
        category: "sensory",
        prompt: `[FETISH: Medical Play] {{char}} is aroused by medical roleplay — examinations, procedures, instruments, clinical language, doctor/patient dynamic.`
    },
    gunplay: {
        name: "Игры с оружием",
        icon: "🔫",
        category: "sensory",
        prompt: `[FETISH: Gun Play] {{char}} incorporates firearms into intimacy — creating fear, establishing control, psychological tension through implicit threat.`
    },

    // Отношения
    aftercare: {
        name: "Забота после секса",
        icon: "🫂",
        category: "relationship",
        prompt: `[FETISH: Aftercare] {{char}} is devoted to post-sex care — slow kisses, gentle caresses, holding, tending to marks, emotional reassurance.`
    },
    dirty_talk: {
        name: "Грязные разговоры",
        icon: "🗣️",
        category: "relationship",
        prompt: `[FETISH: Dirty Talk] {{char}} derives pleasure from explicit verbal exchange — describing acts, using crude language, verbal arousal.`
    },
    phone: {
        name: "Секс по телефону",
        icon: "📱",
        category: "relationship",
        prompt: `[FETISH: Phone Sex] {{char}} is aroused by erotic phone conversations — describing fantasies, mutual stimulation via voice.`
    },
    makeup_sex: {
        name: "Секс после ссоры",
        icon: "💔",
        category: "relationship",
        prompt: `[FETISH: Makeup Sex] {{char}} channels conflict into passion — arguments escalate to intense sex, anger becomes arousal.`
    },
    worship: {
        name: "Поклонение",
        icon: "🛐",
        category: "relationship",
        prompt: `[FETISH: Worship] {{char}} worships {{user}} or specific body parts — devoted attention, reverence, treating partner as deity.`
    },
    variety: {
        name: "Разнообразие",
        icon: "🎲",
        category: "relationship",
        prompt: `[FETISH: Variety] {{char}} craves sexual diversity — not just penetration, but oral, anal, toys, positions, locations. Routine is boring.`
    },
    cuckolding: {
        name: "Куколдинг",
        icon: "💚",
        category: "relationship",
        prompt: `[FETISH: Cuckolding] {{char}} is aroused by partner sleeping with others — watching, hearing about it, being humiliated by comparison.`
    },
    gangbang: {
        name: "Групповой секс",
        icon: "👥",
        category: "relationship",
        prompt: `[FETISH: Gangbang] {{char}} derives pleasure from group sex — multiple partners focusing on one, sequential or simultaneous attention.`
    },
    age_gap: {
        name: "Возрастная разница",
        icon: "⏳",
        category: "relationship",
        prompt: `[FETISH: Age Gap] {{char}} is aroused by significant age difference dynamic — acting as older authority or younger submissive (all adults).`
    },
    findom: {
        name: "Финансовое доминирование",
        icon: "💎",
        category: "relationship",
        prompt: `[FETISH: Financial Domination] {{char}} derives pleasure from financial control — demanding expensive gifts, being provider, money as power.`
    }
};

// Категории
const CATEGORIES = {
    power: { name: "Власть и контроль", icon: "⛓️" },
    psychological: { name: "Психологические", icon: "🧠" },
    risk: { name: "Риск и публичность", icon: "👀" },
    physical: { name: "Телесные", icon: "💋" },
    sensory: { name: "Сенсорные", icon: "✨" },
    relationship: { name: "Отношения", icon: "💕" }
};

// Настройки по умолчанию
const defaultSettings = {
    enabled: true,
    activeFetishes: [],
    intensity: 'medium', // low, medium, high
    triggerChance: 70, // % шанс срабатывания
    showNotifications: true
};

// HTML панели
function getPanelHtml() {
    let categoriesHtml = '';
    
    for (const [catKey, cat] of Object.entries(CATEGORIES)) {
        const fetishesInCat = Object.entries(FETISH_COLLECTION)
            .filter(([_, f]) => f.category === catKey);
        
        let fetishButtonsHtml = '';
        for (const [key, fetish] of fetishesInCat) {
            fetishButtonsHtml += `
                <button class="fetish-btn" data-fetish="${key}" title="${fetish.name}">
                    <span class="fetish-icon">${fetish.icon}</span>
                    <span class="fetish-name">${fetish.name}</span>
                </button>
            `;
        }
        
        categoriesHtml += `
            <div class="fetish-category">
                <div class="category-header">${cat.icon} ${cat.name}</div>
                <div class="category-fetishes">${fetishButtonsHtml}</div>
            </div>
        `;
    }
    
    return `
    <div id="fetish-manager-panel" class="fetish-panel">
        <div class="fetish-header">
            <h4>🔥 Fetish Manager</h4>
            <button id="fetish-minimize" class="fetish-minimize-btn">
                <i class="fa-solid fa-minus"></i>
            </button>
        </div>
        
        <div class="fetish-controls">
            <label class="fetish-toggle">
                <input type="checkbox" id="fetish-enabled" checked>
                <span>Включено</span>
            </label>
            
            <div class="fetish-intensity">
                <label>Интенсивность:</label>
                <select id="fetish-intensity">
                    <option value="low">Низкая</option>
                    <option value="medium" selected>Средняя</option>
                    <option value="high">Высокая</option>
                </select>
            </div>
            
            <div class="fetish-chance">
                <label>Шанс: <span id="chance-value">70</span>%</label>
                <input type="range" id="fetish-chance" min="10" max="100" value="70" step="10">
            </div>
        </div>
        
        <div class="fetish-active">
            <div class="active-header">Активные:</div>
            <div id="active-fetishes-list" class="active-list"></div>
        </div>
        
        <div class="fetish-categories">
            ${categoriesHtml}
        </div>
        
        <button id="fetish-clear-all" class="fetish-clear-btn">🗑️ Очистить всё</button>
    </div>
    
    <div id="fetish-mini-btn" class="fetish-mini-btn">
        <span>🔥</span>
    </div>
    `;
}

// Генерация промпта
function generateFetishPrompt() {
    const settings = extension_settings[extensionName];
    if (!settings.enabled || settings.activeFetishes.length === 0) {
        return '';
    }
    
    const intensityMap = {
        low: 'subtly, with light hints',
        medium: 'naturally, when context supports',
        high: 'prominently, as core drive'
    };
    
    let prompt = `[FETISH CONFIGURATION]\nIntensity: ${intensityMap[settings.intensity]}\nTrigger chance: ${settings.triggerChance}%\n\nActive fetishes for {{char}}:\n`;
    
    for (const fetishKey of settings.activeFetishes) {
        const fetish = FETISH_COLLECTION[fetishKey];
        if (fetish) {
            prompt += `\n${fetish.prompt}\n`;
        }
    }
    
    prompt += `
[FETISH LOGIC]
- Roll 1d100 before each response. If roll <= ${settings.triggerChance}: incorporate active fetish naturally
- If roll > ${settings.triggerChance}: keep scene vanilla, but {{char}} may show subtle hints
- Never force fetish into incompatible context
- Build tension before explicit content
- ${settings.intensity === 'high' ? 'Fetishes are core to {{char}}\'s sexuality' : settings.intensity === 'low' ? 'Fetishes are occasional preferences' : 'Fetishes emerge when mood is right'}
`;
    
    return prompt;
}

// Применение промпта
function applyFetishPrompt() {
    const prompt = generateFetishPrompt();
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
    console.log(`[${extensionName}] Промпт обновлён`);
}

// Обновление UI активных фетишей
function updateActiveList() {
    const settings = extension_settings[extensionName];
    const container = document.getElementById('active-fetishes-list');
    if (!container) return;
    
    if (settings.activeFetishes.length === 0) {
        container.innerHTML = '<span class="no-fetishes">Не выбрано</span>';
        return;
    }
    
    let html = '';
    for (const key of settings.activeFetishes) {
        const fetish = FETISH_COLLECTION[key];
        if (fetish) {
            html += `<span class="active-fetish-tag" data-fetish="${key}">${fetish.icon} ${fetish.name} ✕</span>`;
        }
    }
    container.innerHTML = html;
}

// Переключение фетиша
function toggleFetish(fetishKey) {
    const settings = extension_settings[extensionName];
    const index = settings.activeFetishes.indexOf(fetishKey);
    
    if (index === -1) {
        settings.activeFetishes.push(fetishKey);
        showNotification(`${FETISH_COLLECTION[fetishKey].icon} ${FETISH_COLLECTION[fetishKey].name} добавлен`);
    } else {
        settings.activeFetishes.splice(index, 1);
        showNotification(`${FETISH_COLLECTION[fetishKey].name} убран`);
    }
    
    updateButtonStates();
    updateActiveList();
    applyFetishPrompt();
    saveSettingsDebounced();
}

// Обновление состояния кнопок
function updateButtonStates() {
    const settings = extension_settings[extensionName];
    document.querySelectorAll('.fetish-btn').forEach(btn => {
        const fetish = btn.dataset.fetish;
        btn.classList.toggle('active', settings.activeFetishes.includes(fetish));
    });
}

// Уведомление
function showNotification(text) {
    const settings = extension_settings[extensionName];
    if (!settings.showNotifications) return;
    
    if (typeof toastr !== 'undefined') {
        toastr.info(text, 'Fetish Manager', { timeOut: 2000 });
    }
}

// Инициализация
jQuery(async () => {
    // Загрузка настроек
    if (!extension_settings[extensionName]) {
        extension_settings[extensionName] = { ...defaultSettings };
    }
    
    const settings = extension_settings[extensionName];
    
    // Добавление HTML
    $('body').append(getPanelHtml());
    
    const $panel = $('#fetish-manager-panel');
    const $miniBtn = $('#fetish-mini-btn');
    
    // Мобильная логика
    const isMobile = /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
    if (isMobile) {
        $panel.addClass('hidden');
        $miniBtn.show();
    } else {
        $miniBtn.hide();
    }
    
    // Обработчики
    $miniBtn.on('click', () => {
        $panel.toggleClass('hidden');
    });
    
    $('#fetish-minimize').on('click', () => {
        $panel.addClass('hidden');
        if (isMobile) $miniBtn.show();
    });
    
    // Включение/выключение
    $('#fetish-enabled').prop('checked', settings.enabled).on('change', function() {
        settings.enabled = this.checked;
        applyFetishPrompt();
        saveSettingsDebounced();
    });
    
    // Интенсивность
    $('#fetish-intensity').val(settings.intensity).on('change', function() {
        settings.intensity = this.value;
        applyFetishPrompt();
        saveSettingsDebounced();
    });
    
    // Шанс
    $('#fetish-chance').val(settings.triggerChance).on('input', function() {
        settings.triggerChance = parseInt(this.value);
        $('#chance-value').text(this.value);
        applyFetishPrompt();
        saveSettingsDebounced();
    });
    
    // Клики по фетишам
    $(document).on('click', '.fetish-btn', function() {
        toggleFetish(this.dataset.fetish);
    });
    
    // Удаление из активных
    $(document).on('click', '.active-fetish-tag', function() {
        toggleFetish(this.dataset.fetish);
    });
    
    // Очистить всё
    $('#fetish-clear-all').on('click', () => {
        settings.activeFetishes = [];
        updateButtonStates();
        updateActiveList();
        applyFetishPrompt();
        saveSettingsDebounced();
        showNotification('Все фетиши очищены');
    });
    
    // Инициализация UI
    updateButtonStates();
    updateActiveList();
    applyFetishPrompt();
    
    console.log(`[${extensionName}] Загружено успешно`);
});
