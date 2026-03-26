/**
 * =====================================================
 * 🦠 محاكاة زراعة البكتيريا على طبق بتري
 * bacteria-lab.js — المنطق الكامل للتجربة التفاعلية
 * =====================================================
 */

'use strict';

/* ============================================================
   📊 بيانات النشاط: الأدوات والخطوات والنتائج والحقائق العلمية
   ============================================================ */

/** @type {Object[]} بيانات الأدوات المخبرية */
const TOOLS_DATA = [
    { id: 'gloves',   emoji: '🧤', name: 'قفازات',       tooltip: 'ارتدِ القفازات لحماية نفسك والعينة' },
    { id: 'sterilize',emoji: '🧴', name: 'معقم',         tooltip: 'عقّم الأسطح والأدوات قبل البدء' },
    { id: 'pipette',  emoji: '💉', name: 'ماصة',         tooltip: 'انقل العينة بدقة إلى الطبق' },
    { id: 'petri',    emoji: '🟢', name: 'طبق بتري',     tooltip: 'الطبق الزجاجي لحضن العينة' },
    { id: 'medium',   emoji: '🧫', name: 'وسط غذائي',    tooltip: 'الوسط الذي تنمو فيه البكتيريا' },
    { id: 'incubator',emoji: '🔥', name: 'حاضنة',        tooltip: 'توفر درجة الحرارة المثالية للنمو' },
    { id: 'sample',   emoji: '🧪', name: 'عينة',         tooltip: 'العينة البيولوجية المراد زراعتها' },
    { id: 'label',    emoji: '🏷️', name: 'ملصق ترقيم',  tooltip: 'لتعريف وتتبع الطبق' },
];

/** @type {Object[]} أنواع العينات */
const SAMPLE_TYPES = [
    { id: 'water',  name: 'ماء',            emoji: '💧', risk: 'low' },
    { id: 'food',   name: 'عينة طعام',      emoji: '🍞', risk: 'medium' },
    { id: 'blood',  name: 'عينة دم',        emoji: '🩸', risk: 'high' },
    { id: 'swab',   name: 'مسحة سطح',      emoji: '🫧', risk: 'medium' },
];

/** @type {Object[]} أنواع الوسط الغذائي */
const MEDIUM_TYPES = [
    { id: 'agar',    name: 'آغار عام',         emoji: '🟩', suitable: ['water','food','swab','blood'], optimal: true },
    { id: 'blood_a', name: 'آغار الدم',         emoji: '🟥', suitable: ['blood'], optimal: true },
    { id: 'selective',name:'وسط انتقائي',       emoji: '🟦', suitable: ['food','swab'], optimal: true },
    { id: 'sugar',   name: 'مرق السكر',        emoji: '🟨', suitable: [], optimal: false },
];

/** @type {Object[]} تعريف خطوات النشاط بالترتيب */
const STEPS_DATA = [
    {
        id: 'select_sample',
        title: 'اختيار نوع العينة',
        desc: 'اختر نوع العينة البيولوجية التي تريد زراعتها. لكل عينة خصائص ومتطلبات مختلفة.',
        hint: '💡 العينات المختلفة تحتاج أوساط غذائية مختلفة — اختر بعناية!',
        type: 'options_sample',
    },
    {
        id: 'wear_gloves',
        title: 'ارتداء القفازات',
        desc: 'السلامة المختبرية تبدأ بحماية يديك. ارتدِ القفازات قبل التعامل مع أي مواد.',
        hint: '💡 العمل بدون قفازات يُلوّث العينة ويُعرّضك للخطر.',
        type: 'drag_tool',
        requiredTool: 'gloves',
    },
    {
        id: 'sterilize_tools',
        title: 'تعقيم الأدوات',
        desc: 'عقّم جميع الأدوات والسطح قبل البدء لضمان نتائج دقيقة وتفادي التلوث.',
        hint: '💡 التعقيم يقتل أي بكتيريا عشوائية قد تُفسد التجربة.',
        type: 'drag_tool',
        requiredTool: 'sterilize',
    },
    {
        id: 'select_medium',
        title: 'اختيار الوسط الغذائي',
        desc: 'اختر الوسط الغذائي المناسب لنوع العينة. الوسط الخطأ سيعيق نمو البكتيريا.',
        hint: '💡 آغار الدم مثالي لعينات الدم، والوسط الانتقائي لعينات الطعام والأسطح.',
        type: 'options_medium',
    },
    {
        id: 'transfer_sample',
        title: 'نقل العينة إلى طبق بتري',
        desc: 'استخدم الماصة لنقل العينة بدقة إلى طبق بتري يحتوي على الوسط الغذائي.',
        hint: '💡 تأكد أن التعقيم تم قبل هذه الخطوة!',
        type: 'drag_tool',
        requiredTool: 'pipette',
        requires: ['sterilize_tools'],
    },
    {
        id: 'label_dish',
        title: 'وضع ملصق التعريف',
        desc: 'أضف ملصقاً يحتوي على اسمك ونوع العينة والتاريخ لتتبع الطبق بسهولة.',
        hint: '💡 التوثيق الجيد شرط أساسي في أي مختبر علمي.',
        type: 'drag_tool',
        requiredTool: 'label',
    },
    {
        id: 'incubate',
        title: 'وضع الطبق في الحاضنة',
        desc: 'ضع الطبق في الحاضنة لتوفير الظروف المثالية من حرارة ورطوبة لنمو البكتيريا.',
        hint: '💡 تأكد من نقل العينة أولاً قبل الإدخال للحاضنة.',
        type: 'incubate_setup',
        requires: ['transfer_sample'],
    },
    {
        id: 'view_result',
        title: 'قراءة النتيجة وتفسيرها',
        desc: 'بعد فترة التحضين، افحص الطبق وسجّل ملاحظاتك العلمية.',
        hint: '💡 قارن الطبق مع مراجع مخبرية لتحديد نوع البكتيريا.',
        type: 'result',
    },
];

/** @type {Object[]} نتائج التجربة الأربعة */
const RESULTS_DATA = {
    success: {
        id: 'success',
        title: 'نمو بكتيري ناجح! 🎉',
        icon: '🦠',
        petriClass: 'success-petri',
        dishClass: '',
        colonies: 'normal',
        colonyCount: [15, 25],
        explanation: `نما البكتيريا بنجاح على الوسط الغذائي المناسب. المستعمرات الظاهرة تمثل مجموعات من الخلايا البكتيرية المتكاثرة. يُعدّ هذا دليلاً على صحة الإجراءات المتبعة وملاءمة ظروف التحضين.`,
        recommendations: ['استمر في تحسين تقنية النقل', 'سجّل الملاحظات بعناية', 'قارن النتائج مع عينات معيارية'],
    },
    contaminated: {
        id: 'contaminated',
        title: 'تلوث العينة! ⚠️',
        icon: '☢️',
        petriClass: 'contam-petri',
        dishClass: 'contaminated',
        colonies: 'contam',
        colonyCount: [20, 35],
        explanation: `ظهرت مستعمرات فوضوية تدل على تلوث العينة. هذا ناجم عن عدم التعقيم الجيد أو التعامل مع العينة بدون قفازات. مستعمرات التلوث تختلف في اللون والشكل عن البكتيريا المستهدفة.`,
        recommendations: ['تأكد من تعقيم الأدوات قبل البدء', 'ارتدِ القفازات دائماً', 'أعد التجربة بعد التعقيم الجيد'],
    },
    no_growth: {
        id: 'no_growth',
        title: 'لا يوجد نمو بكتيري',
        icon: '🚫',
        petriClass: 'fail-petri',
        dishClass: 'no-growth',
        colonies: 'none',
        colonyCount: [0, 0],
        explanation: `لم تنمُ أي مستعمرات على الوسط الغذائي. قد يكون ذلك بسبب درجة حرارة غير مناسبة، أو فترة تحضين قصيرة، أو أن العينة لا تحتوي على بكتيريا.`,
        recommendations: ['تحقق من درجة حرارة الحاضنة', 'أطِل فترة التحضين', 'تأكد من صلاحية العينة'],
    },
    wrong_medium: {
        id: 'wrong_medium',
        title: 'نمو محدود — وسط غير مناسب',
        icon: '⚠️',
        petriClass: 'wrong-petri',
        dishClass: 'wrong-medium',
        colonies: 'sparse',
        colonyCount: [2, 5],
        explanation: `ظهر نمو ضئيل جداً بسبب عدم ملاءمة الوسط الغذائي للعينة المختارة. كل نوع من البكتيريا يحتاج مغذيات محددة لا يوفرها الوسط الخطأ.`,
        recommendations: ['راجع متطلبات الوسط لكل عينة', 'استخدم آغار الدم لعينات الدم', 'استخدم وسطاً انتقائياً للكائنات المحددة'],
    },
};

/** @type {string[]} حقائق علمية تظهر في اللوحة الجانبية */
const SCIENCE_FACTS = [
    'البكتيريا كائنات وحيدة الخلية تتكاثر عن طريق الانشطار الثنائي كل 20 دقيقة في الظروف المثالية.',
    'بعض أنواع البكتيريا مفيدة جداً وتُستخدم في صناعة المضادات الحيوية مثل البنيسيلين.',
    'درجة الحرارة المثالية لنمو معظم البكتيريا المسببة للأمراض هي 37°C — درجة حرارة جسم الإنسان.',
    'يُسمى الوسط الغذائي الصلب "آغار" وهو مشتق من أعشاب بحرية ويُستخدم في المختبرات منذ 1882م.',
    'المستعمرة الواحدة تنشأ من خلية بكتيرية واحدة وقد تحتوي على ملايين الخلايا بعد ساعات.',
    'التعقيم باستخدام الحرارة أو الكيماويات يضمن القضاء على أي كائنات دقيقة ملوّثة.',
    'طبق بتري اخترعه العالم يوليوس ريتشارد بتري عام 1887م لتسهيل زراعة الكائنات الدقيقة.',
];

/* ============================================================
   🗂️ حالة النشاط (Local State)
   ============================================================ */

/** @type {Object} الحالة الكاملة لنشاط الطالب */
const gameState = {
    mode: 'learn',           // 'learn' | 'test'
    difficulty: 'medium',    // 'easy' | 'medium' | 'hard'
    currentStep: 0,          // الخطوة الحالية (index)
    completedSteps: [],      // [] من IDs الخطوات المكتملة
    errors: [],              // [] رسائل الأخطاء
    errorCount: 0,           // عدد الأخطاء
    score: 100,              // الدرجة تبدأ من 100
    selectedSample: null,    // العينة المختارة { id, name, emoji, risk }
    selectedMedium: null,    // الوسط الغذائي { id, name, ... }
    temperature: 37,         // درجة الحرارة المختارة
    duration: 24,            // مدة التحضين بالساعات
    usedTools: [],           // الأدوات التي تم استخدامها
    glassesWorn: false,      // هل ارتدى القفازات
    toolsSterilized: false,  // هل تم التعقيم
    sampleTransferred: false,// هل تم نقل العينة
    isRunning: false,        // هل النشاط يعمل
    timerSec: 0,             // المؤقت
    timerInterval: null,
    factIndex: 0,
};

/* ============================================================
   🎛️ مراجع DOM الرئيسية
   ============================================================ */

let DOM = {};

const initDOM = () => {
    DOM = {
        welcomeOverlay: document.getElementById('welcome-overlay'),
        app:            document.getElementById('app'),
        modeBtn:        document.querySelectorAll('.mode-btn'),
        diffBtn:        document.querySelectorAll('.diff-btn'),
        startBtn:       document.getElementById('start-btn'),

        // Top bar
        progressFill:   document.getElementById('progress-fill'),
        progressLabel:  document.getElementById('progress-label'),
        progressPct:    document.getElementById('progress-pct'),
        errorCount:     document.getElementById('error-count'),
        scoreDisplay:   document.getElementById('score-display'),
        modeDisplay:    document.getElementById('mode-display'),
        timerDisplay:   document.getElementById('timer-display'),

        // Panels
        toolsPanel:     document.getElementById('tools-grid'),
        stepArea:       document.getElementById('step-area'),
        stepsNav:       document.getElementById('steps-nav'),
        feedbackLog:    document.getElementById('feedback-log'),
        scienceFact:    document.getElementById('science-fact'),
        petriDish:      document.getElementById('petri-dish-live'),
        petriStatus:    document.getElementById('petri-status'),

        // Results
        resultsOverlay: document.getElementById('results-overlay'),
        stepsGuide:     document.getElementById('steps-guide-overlay'),
    };
};

/* ============================================================
   🚀 تهيئة النشاط
   ============================================================ */

const init = () => {
    initDOM();
    setupWelcomeScreen();
    rotateFact();
    setInterval(rotateFact, 8000);
};

/** إعداد شاشة الترحيب */
const setupWelcomeScreen = () => {
    // اختيار الوضع
    DOM.modeBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            DOM.modeBtn.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameState.mode = btn.dataset.mode;
        });
    });

    // اختيار الصعوبة
    DOM.diffBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            DOM.diffBtn.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            gameState.difficulty = btn.dataset.diff;
        });
    });

    // زر البدء
    DOM.startBtn.addEventListener('click', startActivity);
};

/** بدء النشاط */
const startActivity = () => {
    gameState.isRunning = true;

    // إخفاء شاشة الترحيب وإظهار التطبيق
    DOM.welcomeOverlay.style.animation = 'fadeIn 0.4s ease reverse';
    setTimeout(() => {
        DOM.welcomeOverlay.style.display = 'none';
        DOM.app.classList.add('active');
        renderApp();
        startTimer();
    }, 350);
};

/* ============================================================
   🖥️ عرض واجهة النشاط
   ============================================================ */

const renderApp = () => {
    renderTopBar();
    renderToolsPanel();
    renderStepsNav();
    renderCurrentStep();
};

/** تحديث الشريط العلوي */
const renderTopBar = () => {
    const pct = Math.round((gameState.currentStep / STEPS_DATA.length) * 100);
    DOM.progressFill.style.width = pct + '%';
    DOM.progressLabel.textContent = STEPS_DATA[gameState.currentStep]?.title || 'مكتمل';
    DOM.progressPct.textContent = pct + '%';
    DOM.errorCount.textContent = '❌ ' + gameState.errorCount;
    DOM.scoreDisplay.textContent = '⭐ ' + gameState.score;
    DOM.modeDisplay.textContent = gameState.mode === 'learn' ? '📚 تعلم' : '📝 اختبار';
};

/** عرض شبكة الأدوات بـ SVG */
const renderToolsPanel = () => {
    DOM.toolsPanel.innerHTML = '';
    TOOLS_DATA.forEach(tool => {
        const used = gameState.usedTools.includes(tool.id);
        const el   = window.BacteriaVisuals
            ? window.BacteriaVisuals.buildToolElement(tool, used)
            : (() => {
                const d = document.createElement('div');
                d.className = `tool-item${used ? ' used' : ''}`;
                d.dataset.tool = tool.id;
                d.dataset.tooltip = tool.tooltip;
                d.setAttribute('draggable', 'true');
                d.innerHTML = `<span class="tool-emoji">${tool.emoji}</span><span class="tool-name">${tool.name}</span>`;
                return d;
            })();

        el.setAttribute('draggable', 'true');
        el.dataset.tool    = tool.id;
        el.dataset.tooltip = tool.tooltip;

        // Drag events
        el.addEventListener('dragstart', e => {
            e.dataTransfer.setData('text/plain', tool.id);
            el.classList.add('dragging');
        });
        el.addEventListener('dragend', () => el.classList.remove('dragging'));

        // Touch support
        el.addEventListener('touchstart', handleTouchStart, { passive: true });
        el.addEventListener('touchend',   handleTouchEnd,   { passive: false });

        DOM.toolsPanel.appendChild(el);
    });
    highlightRequiredTool();

    /* تهيئة canvas الطبق الحي بعد رسم اللوحة */
    initLivePetriCanvas();
};

/** تحديد الأداة المطلوبة للخطوة الحالية */
const highlightRequiredTool = () => {
    const step = STEPS_DATA[gameState.currentStep];
    if (!step || step.type !== 'drag_tool') return;
    const toolEl = DOM.toolsPanel.querySelector(`[data-tool="${step.requiredTool}"]`);
    if (toolEl && !toolEl.classList.contains('used')) {
        toolEl.classList.add('recommended');
    }
};

/** عرض شريط الخطوات العلوي */
const renderStepsNav = () => {
    DOM.stepsNav.innerHTML = '';
    STEPS_DATA.forEach((step, idx) => {
        const isDone    = gameState.completedSteps.includes(step.id);
        const isCurrent = idx === gameState.currentStep;
        const dot = document.createElement('div');
        dot.className = `step-dot${isDone ? ' done' : ''}${isCurrent ? ' current' : ''}`;
        dot.title = step.title;
        dot.textContent = isDone ? '✓' : (idx + 1);
        DOM.stepsNav.appendChild(dot);

        if (idx < STEPS_DATA.length - 1) {
            const connector = document.createElement('div');
            connector.className = `step-connector${isDone ? ' done' : ''}`;
            DOM.stepsNav.appendChild(connector);
        }
    });
};

/* ============================================================
   📋 عرض الخطوة الحالية
   ============================================================ */

const renderCurrentStep = () => {
    const step = STEPS_DATA[gameState.currentStep];
    if (!step) return;

    const showHint   = gameState.mode === 'learn';
    const visuals    = window.BacteriaVisuals;
    const illustration = visuals?.STEP_ILLUSTRATIONS?.[step.id] || '';

    let contentHTML = '';

    switch (step.type) {
        case 'options_sample':   contentHTML = renderSampleOptions();   break;
        case 'options_medium':   contentHTML = renderMediumOptions();   break;
        case 'drag_tool':        contentHTML = renderDragStep(step);    break;
        case 'incubate_setup':   contentHTML = renderIncubateStep();    break;
        case 'result':           contentHTML = renderResultStep();      break;
        default:                 contentHTML = '';
    }

    DOM.stepArea.innerHTML = `
        <div class="step-card">
            <div class="step-header">
                <div class="step-num">${gameState.currentStep + 1}</div>
                <h2 class="step-title">${step.title}</h2>
            </div>
            ${illustration}
            <p class="step-desc">${step.desc}</p>
            <div class="hint-badge${showHint ? '' : ' hidden'}">
                ${step.hint}
            </div>
            ${contentHTML}
        </div>
    `;

    attachStepEvents(step);
    updatePetriDisplay();

    /* تهيئة canvas المعاينة في خطوة النتيجة */
    if (step.id === 'view_result') {
        setTimeout(() => visuals?.renderPreviewCanvas?.(), 150);
    }
};

/** عرض خيارات العينة */
const renderSampleOptions = () => {
    const svgs = window.BacteriaVisuals?.TOOL_SVGS || {};
    return `
        <div class="step-options visual-options" id="sample-options">
            ${SAMPLE_TYPES.map(s => `
                <button class="visual-option-btn" data-sample="${s.id}">
                    <div class="vo-svg">${svgs.sample || s.emoji}</div>
                    <span class="vo-name">${s.name}</span>
                </button>
            `).join('')}
        </div>
        <button class="confirm-btn" id="confirm-sample" disabled>أخذ العينة بالممسحة ✓</button>
    `;
};

/** عرض خيارات الوسط الغذائي */
const renderMediumOptions = () => {
    const svgs = window.BacteriaVisuals?.TOOL_SVGS || {};
    return `
        <div class="step-options visual-options" id="medium-options">
            ${MEDIUM_TYPES.map(m => `
                <button class="visual-option-btn" data-medium="${m.id}">
                    <div class="vo-svg" style="transform: scale(0.9);">${svgs.medium || m.emoji}</div>
                    <span class="vo-name">${m.name}</span>
                </button>
            `).join('')}
        </div>
        <button class="confirm-btn" id="confirm-medium" disabled>تأكيد الاختيار ✓</button>
    `;
};

/** عرض خطوة السحب والإفلات */
const renderDragStep = (step) => {
    const reqTool = TOOLS_DATA.find(t => t.id === step.requiredTool);
    return `
        <div class="step-guide">
            <span class="guide-icon">👆</span>
            <span>اسحب القائمة الجانبية (الأدوات) وأفلت <strong>${reqTool?.name}</strong> فوق <strong> طاولة المختبر (الطبق في الأعلى) </strong> للتنفيذ المباشر.</span>
        </div>
    `;
};

/** عرض خطوة الحاضنة */
const renderIncubateStep = () => {
    return `
        <div class="temp-slider-wrap">
            <div class="temp-display" id="temp-display">37<span>°C</span></div>
            <input type="range" id="temp-slider" min="20" max="60" value="37"
                   oninput="updateTemp(this.value)">
            <div class="temp-range-labels"><span>20°C</span><span>60°C</span></div>
        </div>
        <label style="font-size:0.82rem;color:var(--text-muted);font-weight:700;display:block;margin-bottom:0.4rem;">
            مدة التحضين
        </label>
        <select class="duration-select" id="duration-select">
            <option value="12">12 ساعة</option>
            <option value="24" selected>24 ساعة (يوم واحد)</option>
            <option value="48">48 ساعة (يومان)</option>
            <option value="72">72 ساعة (ثلاثة أيام)</option>
        </select>
        <button class="confirm-btn" id="confirm-incubate">وضع الطبق في الحاضنة 🔥</button>
    `;
};

/** عرض خطوة النتيجة */
const renderResultStep = () => {
    return `
        <button class="confirm-btn" id="show-result-btn" style="background: linear-gradient(135deg, #7c63ff, #2196f3);">
            عرض نتيجة التجربة 🔬
        </button>
    `;
};

/* ============================================================
   🎮 ربط أحداث الخطوات
   ============================================================ */

const attachStepEvents = (step) => {
    switch (step.type) {
        case 'options_sample': {
            const opts = document.querySelectorAll('#sample-options .visual-option-btn');
            const confirmBtn = document.getElementById('confirm-sample');
            opts.forEach(btn => {
                btn.addEventListener('click', () => {
                    opts.forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    gameState.selectedSample = SAMPLE_TYPES.find(s => s.id === btn.dataset.sample);
                    confirmBtn.disabled = false;
                });
            });
            confirmBtn?.addEventListener('click', () => {
                addLog('info', `✅ تم اختيار العينة: ${gameState.selectedSample.emoji} ${gameState.selectedSample.name}`);
                completeStep();
            });
            break;
        }

        case 'options_medium': {
            const opts = document.querySelectorAll('#medium-options .visual-option-btn');
            const confirmBtn = document.getElementById('confirm-medium');
            opts.forEach(btn => {
                btn.addEventListener('click', () => {
                    opts.forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    gameState.selectedMedium = MEDIUM_TYPES.find(m => m.id === btn.dataset.medium);
                    confirmBtn.disabled = false;
                });
            });
            confirmBtn?.addEventListener('click', () => {
                const medium = gameState.selectedMedium;
                const sampleId = gameState.selectedSample?.id;
                if (medium.suitable.includes(sampleId)) {
                    addLog('success', `✅ اختيار ممتاز! ${medium.emoji} ${medium.name} مناسب لهذه العينة.`);
                } else {
                    addLog('warn', `⚠️ ${medium.emoji} ${medium.name} غير مثالي لهذه العينة — قد يؤثر على النتيجة.`);
                    penalizeScore(10, 'اختيار وسط غذائي غير مناسب للعينة');
                }
                completeStep();
            });
            break;
        }

        case 'incubate_setup': {
            document.getElementById('confirm-incubate')?.addEventListener('click', () => {
                gameState.temperature = Number(document.getElementById('temp-slider')?.value || 37);
                gameState.duration = Number(document.getElementById('duration-select')?.value || 24);

                const tempOk = gameState.temperature >= 30 && gameState.temperature <= 42;
                const durOk  = gameState.duration >= 24;

                if (!tempOk) {
                    addLog('warn', `⚠️ درجة ${gameState.temperature}°C قد لا تكون مثالية لنمو البكتيريا.`);
                    penalizeScore(10, `درجة حرارة غير مثالية: ${gameState.temperature}°C`);
                }
                if (!durOk) {
                    addLog('warn', `⚠️ مدة ${gameState.duration} ساعة ربما ليست كافية للنمو الجيد.`);
                    penalizeScore(5, `فترة تحضين قصيرة: ${gameState.duration} ساعة`);
                }
                if (tempOk && durOk) {
                    addLog('success', `✅ إعدادات الحاضنة ممتازة: ${gameState.temperature}°C / ${gameState.duration} ساعة`);
                }
                // تأثير الحاضنة
                const petri = document.getElementById('petri-dish-live');
                petri?.classList.add('incubating');
                setTimeout(() => petri?.classList.remove('incubating'), 3000);

                completeStep();
            });
            break;
        }

        case 'result': {
            document.getElementById('show-result-btn')?.addEventListener('click', () => {
                completeStep();
                showResults();
            });
            break;
        }
    }
};

/* ============================================================
   🖱️ Drag & Drop (HTML5 + Touch)
   ============================================================ */

/** يُستدعى من ondrop على طاولة المختبر */
window.handleDrop = (e) => {
    e.preventDefault();
    const zone = e.currentTarget;
    zone.classList.remove('active-bench');
    const toolId = e.dataTransfer.getData('text/plain');
    handleToolUsed(toolId);
};

/** Touch support — بدء اللمس */
let touchTool = null;
const handleTouchStart = (e) => {
    touchTool = e.currentTarget.dataset.tool;
};

/** Touch support — نهاية اللمس */
const handleTouchEnd = (e) => {
    if (!touchTool) return;
    const bench = document.getElementById('lab-bench');
    if (!bench) { touchTool = null; return; }
    const benchRect = bench.getBoundingClientRect();
    const touch = e.changedTouches[0];
    const inBench = (
        touch.clientX >= benchRect.left &&
        touch.clientX <= benchRect.right &&
        touch.clientY >= benchRect.top  &&
        touch.clientY <= benchRect.bottom
    );
    if (inBench) handleToolUsed(touchTool);
    touchTool = null;
};

/** معالجة استخدام أداة */
const handleToolUsed = (toolId) => {
    const step = STEPS_DATA[gameState.currentStep];
    if (!step || step.type !== 'drag_tool') return;

    if (toolId === step.requiredTool) {
        // ✅ الأداة الصحيحة
        gameState.usedTools.push(toolId);
        if (toolId === 'gloves')    gameState.glassesWorn = true;
        if (toolId === 'sterilize') gameState.toolsSterilized = true;
        if (toolId === 'pipette')   gameState.sampleTransferred = true;

        addLog('success', `✅ ممتاز! استخدمت ${TOOLS_DATA.find(t=>t.id===toolId)?.name} بنجاح.`);
        triggerToolGlow(toolId);
        playToolInteractionEffect(toolId);
        
        // إذا كان تعقيم أو ملصق ننتظر ثانية لمشاهدة التأثير
        setTimeout(() => {
            completeStep();
        }, toolId === 'sterilize' || toolId === 'label' || toolId === 'pipette' ? 1200 : 300);
    } else {
        // ❌ أداة خاطئة
        const wrongTool = TOOLS_DATA.find(t => t.id === toolId);
        const rightTool = TOOLS_DATA.find(t => t.id === step.requiredTool);
        const msg = `الأداة الخاطئة! استخدمت "${wrongTool?.name}" بدلاً من "${rightTool?.name}".`;
        penalizeScore(5, msg);
        addLog('error', `❌ ${msg}`);
        shakeLabBench();
        showToast('خطأ في الاختيار', msg, 'error');
    }
};

/** تأثير توهج الأداة عند الاستخدام الناجح */
const triggerToolGlow = (toolId) => {
    const toolEl = DOM.toolsPanel.querySelector(`[data-tool="${toolId}"]`);
    if (!toolEl) return;
    toolEl.style.boxShadow = '0 0 20px rgba(0,229,160,0.6)';
    toolEl.style.borderColor = 'var(--green)';
    setTimeout(() => {
        toolEl.classList.add('used');
        toolEl.classList.remove('recommended');
        toolEl.style.boxShadow = '';
        toolEl.style.borderColor = '';
    }, 600);
};

/** المؤثرات التفاعلية للأدوات الملقاة فوق الطاولة */
const playToolInteractionEffect = (toolId) => {
    const effects = document.getElementById('bench-effects');
    if (!effects) return;
    effects.innerHTML = '';
    
    if (toolId === 'pipette') {
        // تساقط قطرات
        for(let i=0; i<3; i++) {
            const drop = document.createElement('div');
            drop.className = 'effect-particle';
            drop.style.left = (45 + Math.random()*10) + '%';
            drop.style.top  = (35 + Math.random()*10) + '%';
            drop.style.width = '12px'; drop.style.height = '12px';
            drop.style.background = 'radial-gradient(circle, #ff8a80, #c62828)';
            drop.style.animationDelay = (i * 0.3) + 's';
            effects.appendChild(drop);
        }
    } else if (toolId === 'sterilize') {
        const spray = document.createElement('div');
        spray.innerHTML = '💦✨';
        spray.style.cssText = 'font-size:3rem;position:absolute;left:40%;top:20%;animation:sprayBurst 1s forwards';
        effects.appendChild(spray);
        
        // تغيير حالة الطاولة بصرياً لتصبح معقمة
        const bench = document.getElementById('lab-bench');
        if (bench) bench.style.backgroundColor = 'rgba(0, 229, 160, 0.05)';
    } else if (toolId === 'label') {
        const svgs = window.BacteriaVisuals?.TOOL_SVGS || {};
        const label = document.createElement('div');
        label.className = 'lab-label-stick';
        label.innerHTML = svgs.label || '🏷️';
        effects.appendChild(label);
    }
};

/** اهتزاز منطقة الطاولة عند الخطأ */
const shakeLabBench = () => {
    const bench = document.getElementById('lab-bench');
    if (!bench) return;
    bench.style.animation = 'shake 0.5s ease';
    bench.style.borderColor = 'var(--red)';
    setTimeout(() => {
        bench.style.animation = '';
        bench.style.borderColor = 'rgba(255,255,255,0.1)';
    }, 550);
};

/* ============================================================
   📈 تقدم الخطوات
   ============================================================ */

const completeStep = () => {
    const step = STEPS_DATA[gameState.currentStep];
    if (!step) return;

    gameState.completedSteps.push(step.id);
    gameState.currentStep++;

    renderTopBar();
    renderStepsNav();

    if (gameState.currentStep < STEPS_DATA.length) {
        renderCurrentStep();
        renderToolsPanel();
    }
};

/* ============================================================
   🌡️ التحكم في معلمات الحاضنة
   ============================================================ */

window.updateTemp = (val) => {
    gameState.temperature = Number(val);
    const display = document.getElementById('temp-display');
    if (display) display.innerHTML = `${val}<span>°C</span>`;
    // تلوين بحسب الملاءمة
    const color = (val >= 30 && val <= 42) ? 'var(--green)'
                : (val >= 20 && val < 30)  ? 'var(--orange)' : 'var(--red)';
    if (display) display.style.color = color;
};

/* ============================================================
   🔬 تحديث عرض طبق بتري الحي
   ============================================================ */

/** تهيئة canvas الطبق الحي في اللوحة الجانبية (نُقل للمنتصف) */
const initLivePetriCanvas = () => {
    const wrap = document.getElementById('petri-canvas-wrap');
    if (!wrap) return;
    if (wrap.querySelector('canvas')) return; /* لا تُكرر */
    const canvas  = document.createElement('canvas');
    canvas.id     = 'petri-canvas-live';
    canvas.width  = 230;  // الكبر الجديد للطبق
    canvas.height = 230;
    canvas.style.cssText = 'border-radius:50%;display:block;width:230px;height:230px;transition: transform 0.3s;';
    wrap.innerHTML = '';
    wrap.appendChild(canvas);
    window.BacteriaVisuals?.drawPetriCanvas(canvas, 'empty');
};

/** تحديث طبق بتري الحي بـ Canvas */
const updatePetriDisplay = () => {
    const canvas = document.getElementById('petri-canvas-live');
    const status = document.getElementById('petri-status');
    const draw   = window.BacteriaVisuals?.drawPetriCanvas;

    /* إذا لم يكن canvas موجوداً نقوم بتحديث div القديم */
    if (!canvas || !draw) {
        const oldDish = document.getElementById('petri-dish-live');
        if (oldDish && gameState.completedSteps.includes('transfer_sample')) {
            oldDish.style.background = 'radial-gradient(circle at 40% 35%, #e8f5e9, #b2dfdb 60%, #80cbc4)';
        }
        return;
    }

    if (gameState.completedSteps.includes('incubate')) {
        draw(canvas, 'colonies', { count: 8 });
        if (status) status.textContent = '🔬 قيد التحضين...';
    } else if (gameState.completedSteps.includes('transfer_sample')) {
        draw(canvas, 'sample');
        const s = gameState.selectedSample;
        const m = gameState.selectedMedium;
        if (status) status.textContent = `${s?.emoji || ''} ${s?.name || ''} | ${m?.emoji || ''} ${m?.name || ''}`;
    } else if (gameState.completedSteps.includes('select_sample')) {
        draw(canvas, 'empty');
        if (status) status.textContent = `العينة: ${gameState.selectedSample?.emoji} ${gameState.selectedSample?.name}`;
    } else {
        draw(canvas, 'empty');
        if (status) status.textContent = 'في انتظار العينة...';
    }
};

/* ============================================================
   🏆 عرض النتيجة النهائية
   ============================================================ */

const showResults = () => {
    const result = determineResult();
    const overlay = DOM.resultsOverlay;
    overlay.innerHTML = buildResultsHTML(result);
    overlay.classList.add('show');

    // تحريك المستعمرات
    setTimeout(() => animateColonies(result), 400);

    // ربط الأزرار
    document.getElementById('retry-btn')?.addEventListener('click', resetActivity);
    document.getElementById('show-guide-btn')?.addEventListener('click', showStepsGuide);
};

/** تحديد النتيجة بناءً على اختيارات الطالب */
const determineResult = () => {
    const sterilized = gameState.completedSteps.includes('sterilize_tools');
    const gloves     = gameState.completedSteps.includes('wear_gloves');
    const transferred= gameState.completedSteps.includes('transfer_sample');

    // تلوث: لم يرتدِ قفازات أو لم يعقّم
    if (!sterilized || !gloves) return RESULTS_DATA.contaminated;

    if (!transferred) return RESULTS_DATA.no_growth;

    const medium    = gameState.selectedMedium;
    const sampleId  = gameState.selectedSample?.id;
    const tempOk    = gameState.temperature >= 30 && gameState.temperature <= 42;
    const durOk     = gameState.duration >= 24;

    // وسط غير مناسب
    if (medium && !medium.suitable.includes(sampleId || '')) return RESULTS_DATA.wrong_medium;

    // لم تتوفر ظروف الحاضنة
    if (!tempOk || !durOk) return RESULTS_DATA.no_growth;

    return RESULTS_DATA.success;
};

/** بناء HTML نافذة النتائج */
const buildResultsHTML = (result) => {
    const score = Math.max(0, gameState.score);
    const errorsHTML = gameState.errors.length
        ? `<ul class="errors-list">${gameState.errors.map(e => `<li><span>⚠️</span>${e}</li>`).join('')}</ul>`
        : `<p style="color:var(--green);font-size:0.85rem;">لم تقع في أي أخطاء — ممتاز! 🎉</p>`;

    return `
        <div class="results-card">
            <div class="results-header">
                <div class="results-icon">${result.icon}</div>
                <h2 class="results-title" style="color:${result.id === 'success' ? 'var(--green)' : result.id === 'contaminated' ? 'var(--red)' : 'var(--orange)'}">${result.title}</h2>
                <p class="results-subtitle">
                    العينة: ${gameState.selectedSample?.emoji || ''} ${gameState.selectedSample?.name || '—'}
                    &nbsp;|&nbsp;
                    الوسط: ${gameState.selectedMedium?.emoji || ''} ${gameState.selectedMedium?.name || '—'}
                </p>
            </div>

            <div class="score-circle" style="border-color:${score>=80?'var(--green)':score>=50?'var(--orange)':'var(--red)'}; box-shadow:0 0 30px ${score>=80?'var(--green-glow)':score>=50?'var(--orange-glow)':'var(--red-glow)'};">
                <span class="score-num" style="color:${score>=80?'var(--green)':score>=50?'var(--orange)':'var(--red)'}">${score}</span>
                <span class="score-label">من 100</span>
            </div>

            <div class="result-petri-wrap">
                <canvas id="result-petri-canvas" width="200" height="200"
                        style="border-radius:50%;display:block;margin:0 auto;box-shadow:0 0 30px var(--green-glow), 0 8px 30px rgba(0,0,0,0.4)">
                </canvas>
            </div>

            <div class="result-info">
                <h4>📖 التفسير العلمي</h4>
                <p>${result.explanation}</p>
            </div>

            <div class="result-info">
                <h4>❌ الأخطاء (${gameState.errorCount})</h4>
                ${errorsHTML}
            </div>

            <div class="result-info">
                <h4>💡 توصيات تعليمية</h4>
                <ul class="errors-list" style="color:var(--blue-light)">
                    ${result.recommendations.map(r => `<li><span>✅</span>${r}</li>`).join('')}
                </ul>
            </div>

            <div class="results-actions">
                <button class="result-btn primary" id="retry-btn">🔄 إعادة التجربة</button>
                <button class="result-btn" id="show-guide-btn">📋 عرض الخطوات الصحيحة</button>
            </div>
        </div>
    `;
};

/** تحريك المستعمرات في نافذة النتيجة عبر Canvas */
const animateColonies = (result) => {
    const canvas = document.getElementById('result-petri-canvas');
    if (!canvas || !window.BacteriaVisuals) return;

    const typeMap = {
        normal:       'colonies',
        contam:       'contaminated',
        sparse:       'sparse',
        none:         'no_growth',
    };
    const canvasType = typeMap[result.colonies] || 'empty';
    window.BacteriaVisuals.animatePetriResult(canvas, canvasType);
};

/* ============================================================
   📋 نافذة الخطوات الصحيحة
   ============================================================ */

const showStepsGuide = () => {
    const overlay = DOM.stepsGuide;
    overlay.innerHTML = `
        <div class="steps-guide-card">
            <h2>📋 الخطوات الصحيحة للتجربة</h2>
            <ol class="guide-steps-list">
                ${STEPS_DATA.map((s, i) => `
                    <li class="guide-step">
                        <span class="g-num">${i + 1}</span>
                        <div>
                            <strong style="display:block;color:var(--text-primary);margin-bottom:2px">${s.title}</strong>
                            <span style="font-size:0.78rem;color:var(--text-muted)">${s.desc}</span>
                        </div>
                    </li>
                `).join('')}
            </ol>
            <button class="close-guide-btn" id="close-guide">إغلاق ✕</button>
        </div>
    `;
    overlay.classList.add('show');
    document.getElementById('close-guide')?.addEventListener('click', () => {
        overlay.classList.remove('show');
    });
};

/* ============================================================
   🔄 إعادة التجربة
   ============================================================ */

const resetActivity = () => {
    // إعادة ضبط الحالة
    Object.assign(gameState, {
        currentStep: 0,
        completedSteps: [],
        errors: [],
        errorCount: 0,
        score: 100,
        selectedSample: null,
        selectedMedium: null,
        temperature: 37,
        duration: 24,
        usedTools: [],
        glassesWorn: false,
        toolsSterilized: false,
        sampleTransferred: false,
        timerSec: 0,
    });

    // إغلاق النتائج
    DOM.resultsOverlay.classList.remove('show');
    DOM.resultsOverlay.innerHTML = '';
    DOM.feedbackLog.innerHTML = '';

    // إعادة عرض
    renderApp();
    addLog('info', '🔄 تم إعادة التجربة. حظاً موفقاً!');
};

/* ============================================================
   💬 التغذية الراجعة والسجل
   ============================================================ */

const addLog = (type, message) => {
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.innerHTML = `<span>${new Date().toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'})}</span><span>${message}</span>`;
    DOM.feedbackLog.insertBefore(entry, DOM.feedbackLog.firstChild);

    // الاحتفاظ بآخر 20 إدخال فقط
    while (DOM.feedbackLog.children.length > 20) {
        DOM.feedbackLog.removeChild(DOM.feedbackLog.lastChild);
    }
};

/** SweetAlert2 toast */
const showToast = (title, text, icon = 'info') => {
    if (typeof Swal === 'undefined') return;
    Swal.fire({
        title, text, icon,
        toast: true,
        position: 'bottom-end',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
        customClass: { popup: 'swal-rtl' },
        background: 'var(--lab-card)',
        color: 'var(--text-primary)',
        iconColor: icon === 'error' ? 'var(--red)' : icon === 'success' ? 'var(--green)' : 'var(--orange)',
    });
};

/* ============================================================
   ⭐ نظام التسجيل والعقوبات
   ============================================================ */

const penalizeScore = (points, reason) => {
    gameState.score = Math.max(0, gameState.score - points);
    gameState.errorCount++;
    gameState.errors.push(reason);
    renderTopBar();
};

/* ============================================================
   ⏱️ المؤقت الزمني
   ============================================================ */

const startTimer = () => {
    if (gameState.timerInterval) clearInterval(gameState.timerInterval);
    gameState.timerInterval = setInterval(() => {
        gameState.timerSec++;
        const m = String(Math.floor(gameState.timerSec / 60)).padStart(2, '0');
        const s = String(gameState.timerSec % 60).padStart(2, '0');
        if (DOM.timerDisplay) DOM.timerDisplay.textContent = `⏱️ ${m}:${s}`;
    }, 1000);
};

/* ============================================================
   🧬 تدوير الحقائق العلمية
   ============================================================ */

const rotateFact = () => {
    if (!DOM.scienceFact) return;
    gameState.factIndex = (gameState.factIndex + 1) % SCIENCE_FACTS.length;
    DOM.scienceFact.style.opacity = '0';
    setTimeout(() => {
        DOM.scienceFact.textContent = SCIENCE_FACTS[gameState.factIndex];
        DOM.scienceFact.style.opacity = '1';
    }, 400);
};

/* ============================================================
   🎬 تشغيل النشاط عند تحميل الصفحة
   ============================================================ */

document.addEventListener('DOMContentLoaded', init);
