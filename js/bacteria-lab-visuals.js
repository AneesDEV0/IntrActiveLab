/**
 * =====================================================
 * 🎨 bacteria-lab-visuals.js
 * رسومات SVG للأدوات المخبرية + Canvas لطبق بتري
 * =====================================================
 */

'use strict';

/* ============================================================
   🖼️ SVG رسومات الأدوات المخبرية
   كل رسمة أبعادها 80×90 وتستخدم ألوان النظام
   ============================================================ */

const TOOL_SVGS = {

    gloves: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="gGlov" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#4fc3f7"/>
                <stop offset="100%" stop-color="#0288d1"/>
            </linearGradient>
        </defs>
        <!-- Left glove -->
        <path d="M15 60 Q10 55 10 45 L10 28 Q10 24 14 24 Q18 24 18 28 L18 36
                 Q20 30 24 28 Q28 26 30 30 L30 24 Q30 20 34 20 Q38 20 38 24 L38 30
                 Q40 24 44 24 Q46 24 46 28 L46 36 Q47 32 50 32 Q54 32 54 36 L54 50
                 Q54 62 46 68 L30 68 Q20 68 15 60Z"
              fill="url(#gGlov)" stroke="#0277bd" stroke-width="1.5" stroke-linejoin="round"/>
        <!-- Cuff -->
        <rect x="22" y="62" width="28" height="10" rx="5" fill="#0277bd" opacity="0.7"/>
        <!-- Finger lines -->
        <line x1="34" y1="22" x2="34" y2="39" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>
        <line x1="38" y1="22" x2="38" y2="39" stroke="rgba(255,255,255,0.4)" stroke-width="1.2"/>
    </svg>`,

    sterilize: `<svg viewBox="0 0 80 90" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="gSter" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#80cbc4"/>
                <stop offset="100%" stop-color="#00897b"/>
            </linearGradient>
        </defs>
        <!-- Bottle body -->
        <rect x="22" y="35" width="30" height="45" rx="6" fill="url(#gSter)" stroke="#00695c" stroke-width="1.5"/>
        <!-- Bottle neck -->
        <rect x="28" y="22" width="18" height="16" rx="4" fill="#00897b" stroke="#00695c" stroke-width="1.5"/>
        <!-- Pump/nozzle head -->
        <rect x="26" y="14" width="22" height="10" rx="5" fill="#004d40" stroke="#00695c" stroke-width="1"/>
        <!-- Nozzle tube -->
        <line x1="48" y1="18" x2="62" y2="12" stroke="#004d40" stroke-width="3" stroke-linecap="round"/>
        <!-- Spray drops -->
        <circle cx="66" cy="9"  r="2.5" fill="#80cbc4" opacity="0.9"/>
        <circle cx="70" cy="14" r="1.8" fill="#80cbc4" opacity="0.7"/>
        <circle cx="68" cy="4"  r="1.5" fill="#80cbc4" opacity="0.6"/>
        <!-- Label -->
        <rect x="26" y="48" width="22" height="14" rx="3" fill="rgba(255,255,255,0.25)"/>
        <line x1="29" y1="53" x2="45" y2="53" stroke="white" stroke-width="1.2" opacity="0.6"/>
        <line x1="29" y1="57" x2="41" y2="57" stroke="white" stroke-width="1.2" opacity="0.4"/>
    </svg>`,

    pipette: `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="gPip" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ce93d8"/>
                <stop offset="100%" stop-color="#9c27b0"/>
            </linearGradient>
        </defs>
        <!-- Bulb -->
        <ellipse cx="40" cy="16" rx="18" ry="14" fill="url(#gPip)" stroke="#7b1fa2" stroke-width="1.5"/>
        <!-- Narrow tube -->
        <rect x="36" y="28" width="8" height="55" rx="4" fill="#ce93d8" stroke="#9c27b0" stroke-width="1.2"/>
        <!-- Tip -->
        <polygon points="36,82 44,82 42,96 38,96" fill="#7b1fa2"/>
        <!-- Liquid inside tube -->
        <rect x="37" y="50" width="6" height="30" rx="3" fill="#e91e63" opacity="0.75"/>
        <!-- Measurement lines -->
        <line x1="44" y1="38" x2="48" y2="38" stroke="#7b1fa2" stroke-width="1.2"/>
        <line x1="44" y1="48" x2="48" y2="48" stroke="#7b1fa2" stroke-width="1.2"/>
        <line x1="44" y1="58" x2="48" y2="58" stroke="#7b1fa2" stroke-width="1.2"/>
        <line x1="44" y1="68" x2="48" y2="68" stroke="#7b1fa2" stroke-width="1.2"/>
        <!-- Shine on bulb -->
        <ellipse cx="34" cy="11" rx="6" ry="4" fill="rgba(255,255,255,0.3)" transform="rotate(-20,34,11)"/>
    </svg>`,

    petri: `<svg viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <radialGradient id="gPet" cx="40%" cy="35%" r="65%">
                <stop offset="0%" stop-color="#e8f5e9"/>
                <stop offset="60%" stop-color="#a5d6a7"/>
                <stop offset="100%" stop-color="#66bb6a"/>
            </radialGradient>
        </defs>
        <!-- Outer rim shadow -->
        <circle cx="45" cy="47" r="38" fill="rgba(0,0,0,0.25)"/>
        <!-- Dish outer edge -->
        <circle cx="45" cy="45" r="38" fill="#388e3c" stroke="#2e7d32" stroke-width="2"/>
        <!-- Dish interior -->
        <circle cx="45" cy="45" r="32" fill="url(#gPet)"/>
        <!-- Lid rim -->
        <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="3"/>
        <!-- Shine reflection -->
        <ellipse cx="33" cy="30" rx="10" ry="6" fill="rgba(255,255,255,0.35)" transform="rotate(-30,33,30)"/>
        <!-- Inner content dots (agar look) -->
        <circle cx="38" cy="42" r="3" fill="rgba(0,100,0,0.15)"/>
        <circle cx="52" cy="50" r="2.5" fill="rgba(0,100,0,0.1)"/>
        <circle cx="44" cy="54" r="2" fill="rgba(0,100,0,0.12)"/>
    </svg>`,

    medium: `<svg viewBox="0 0 80 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="gMed" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#fff9c4"/>
                <stop offset="100%" stop-color="#f9a825"/>
            </linearGradient>
            <linearGradient id="gMedLiq" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#a5d6a7"/>
                <stop offset="100%" stop-color="#388e3c"/>
            </linearGradient>
        </defs>
        <!-- Flask body -->
        <path d="M30 38 L18 72 Q16 82 40 82 Q64 82 62 72 L50 38 Z"
              fill="url(#gMed)" stroke="#e65100" stroke-width="1.5" stroke-linejoin="round"/>
        <!-- Liquid inside flask -->
        <path d="M28 60 L20 72 Q18 80 40 80 Q62 80 60 72 L52 60 Z"
              fill="url(#gMedLiq)" opacity="0.85"/>
        <!-- Flask neck -->
        <rect x="32" y="14" width="16" height="26" rx="4" fill="#fff9c4" stroke="#e65100" stroke-width="1.5"/>
        <!-- Flask top opening -->
        <ellipse cx="40" cy="14" rx="9" ry="4" fill="#f9a825" stroke="#e65100" stroke-width="1.5"/>
        <!-- Flask shoulder -->
        <ellipse cx="40" cy="39" rx="18" ry="4" fill="#f9a825" stroke="#e65100" stroke-width="1"/>
        <!-- Shine -->
        <path d="M22 55 Q24 48 28 52" stroke="rgba(255,255,255,0.5)" stroke-width="2" fill="none" stroke-linecap="round"/>
    </svg>`,

    incubator: `<svg viewBox="0 0 90 90" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="gInc" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#455a64"/>
                <stop offset="100%" stop-color="#263238"/>
            </linearGradient>
        </defs>
        <!-- Body -->
        <rect x="8" y="18" width="74" height="60" rx="8" fill="url(#gInc)" stroke="#37474f" stroke-width="2"/>
        <!-- Door glass -->
        <rect x="16" y="26" width="44" height="44" rx="5" fill="#37474f" stroke="#546e7a" stroke-width="1.5"/>
        <rect x="19" y="29" width="38" height="38" rx="4" fill="rgba(100,181,246,0.12)" stroke="rgba(100,181,246,0.3)" stroke-width="1"/>
        <!-- Door handle -->
        <rect x="62" y="44" width="6" height="14" rx="3" fill="#90a4ae"/>
        <!-- Grid lines inside -->
        <line x1="24" y1="38" x2="52" y2="38" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <line x1="24" y1="48" x2="52" y2="48" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <line x1="24" y1="58" x2="52" y2="58" stroke="rgba(255,255,255,0.12)" stroke-width="1"/>
        <!-- Mini petri dishes inside -->
        <circle cx="31" cy="43" r="5" fill="rgba(165,214,167,0.7)"/>
        <circle cx="44" cy="43" r="5" fill="rgba(165,214,167,0.7)"/>
        <!-- Display panel -->
        <rect x="71" y="26" width="9" height="24" rx="3" fill="#1a237e"/>
        <rect x="72.5" y="28" width="6" height="8" rx="2" fill="#00e5ff" opacity="0.8"/>
        <text x="74" y="44" font-size="4" fill="#ff6e40" font-weight="bold">37°</text>
        <!-- Heat waves -->
        <path d="M24 22 Q27 18 30 22 Q33 26 36 22" stroke="#ff9800" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <path d="M38 22 Q41 17 44 22 Q47 27 50 22" stroke="#ff9800" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    </svg>`,

    sample: `<svg viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="gSam" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#e8eaf6"/>
                <stop offset="100%" stop-color="#c5cae9"/>
            </linearGradient>
        </defs>
        <!-- Tube body -->
        <path d="M20 10 L20 75 Q20 88 30 88 Q40 88 40 75 L40 10 Z"
              fill="url(#gSam)" stroke="#7986cb" stroke-width="1.8" stroke-linejoin="round"/>
        <!-- Tube opening rim -->
        <rect x="17" y="8" width="26" height="7" rx="3" fill="#9fa8da" stroke="#7986cb" stroke-width="1.5"/>
        <!-- Sample liquid (red blood) -->
        <path d="M21 52 L21 75 Q21 86 30 86 Q39 86 39 75 L39 52 Z" fill="#ef5350" opacity="0.85"/>
        <!-- Liquid meniscus -->
        <ellipse cx="30" cy="52" rx="9" ry="3" fill="#e53935"/>
        <!-- Bubbles in liquid -->
        <circle cx="26" cy="60" r="2"   fill="rgba(255,255,255,0.4)"/>
        <circle cx="33" cy="70" r="1.5" fill="rgba(255,255,255,0.3)"/>
        <!-- Glass shine -->
        <line x1="24" y1="15" x2="24" y2="74" stroke="rgba(255,255,255,0.45)" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Label sticker -->
        <rect x="22" y="24" width="16" height="18" rx="2" fill="rgba(255,255,255,0.7)" stroke="#9fa8da" stroke-width="1"/>
        <line x1="24" y1="29" x2="36" y2="29" stroke="#7986cb" stroke-width="1" opacity="0.6"/>
        <line x1="24" y1="33" x2="36" y2="33" stroke="#7986cb" stroke-width="1" opacity="0.4"/>
        <line x1="24" y1="37" x2="32" y2="37" stroke="#7986cb" stroke-width="1" opacity="0.3"/>
    </svg>`,

    label: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="gLab" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#fffde7"/>
                <stop offset="100%" stop-color="#fff176"/>
            </linearGradient>
        </defs>
        <!-- Label tag shape -->
        <path d="M10 10 L60 10 L70 40 L60 70 L10 70 Z" fill="url(#gLab)" stroke="#f9a825" stroke-width="2" stroke-linejoin="round"/>
        <!-- Punch hole -->
        <circle cx="18" cy="40" r="5" fill="white" stroke="#f9a825" stroke-width="1.5"/>
        <!-- Text lines -->
        <line x1="27" y1="26" x2="62" y2="26" stroke="#795548" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="27" y1="35" x2="60" y2="35" stroke="#795548" stroke-width="2"   stroke-linecap="round"/>
        <line x1="27" y1="44" x2="58" y2="44" stroke="#795548" stroke-width="2"   stroke-linecap="round"/>
        <line x1="27" y1="53" x2="55" y2="53" stroke="#795548" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="27" y1="61" x2="50" y2="61" stroke="#795548" stroke-width="1.5" stroke-linecap="round"/>
        <!-- Small bacteria symbol top right -->
        <circle cx="58" cy="17" r="4" fill="#a5d6a7" stroke="#388e3c" stroke-width="1"/>
        <line x1="58" y1="13" x2="58" y2="9"  stroke="#388e3c" stroke-width="1.2" stroke-linecap="round"/>
        <line x1="62" y1="15" x2="65" y2="12" stroke="#388e3c" stroke-width="1.2" stroke-linecap="round"/>
    </svg>`,
};

/* ============================================================
   🔬 رسم طبق بتري بـ Canvas
   ============================================================ */

/**
 * يرسم طبق بتري داخل عنصر canvas
 * @param {HTMLCanvasElement} canvas
 * @param {'empty'|'sample'|'colonies'|'contaminated'|'sparse'} state
 * @param {Object} options - { colonyColor, count }
 */
const drawPetriCanvas = (canvas, state = 'empty', options = {}) => {
    if (!canvas) return;
    const ctx   = canvas.getContext('2d');
    const W     = canvas.width;
    const H     = canvas.height;
    const cx    = W / 2;
    const cy    = H / 2;
    const R     = Math.min(W, H) / 2 - 6;

    ctx.clearRect(0, 0, W, H);

    /* ── 1. وسط الطبق (agar surface) ── */
    const agarColors = {
        empty:       ['#f0f4f0', '#c8e6c9', '#a5d6a7'],
        sample:      ['#e8f5e9', '#b2dfdb', '#80cbc4'],
        colonies:    ['#e8f5e9', '#c8e6c9', '#a5d6a7'],
        contaminated:['#ffcdd2', '#e57373', '#c62828'],
        sparse:      ['#efebe9', '#bcaaa4', '#795548'],
        no_growth:   ['#f5f5f5', '#e0e0e0', '#bdbdbd'],
    };
    const colors = agarColors[state] || agarColors.empty;
    const grad   = ctx.createRadialGradient(cx - R * 0.2, cy - R * 0.2, 0, cx, cy, R);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(0.6, colors[1]);
    grad.addColorStop(1, colors[2]);

    /* dish shadow */
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.35)';
    ctx.shadowBlur  = 12;
    ctx.shadowOffsetY = 4;
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

    /* ── 2. حافة الطبق ── */
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth   = 5;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    ctx.lineWidth   = 2;
    ctx.stroke();

    /* ── 3. بريق زجاجي ── */
    ctx.save();
    const shineGrad = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, 0, cx - R * 0.35, cy - R * 0.35, R * 0.5);
    shineGrad.addColorStop(0, 'rgba(255,255,255,0.35)');
    shineGrad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.beginPath();
    ctx.ellipse(cx - R * 0.25, cy - R * 0.28, R * 0.35, R * 0.22, -0.6, 0, Math.PI * 2);
    ctx.fillStyle = shineGrad;
    ctx.fill();
    ctx.restore();

    /* ── 4. رسم المستعمرات ── */
    if (state === 'colonies' || state === 'contaminated' || state === 'sparse') {
        drawColonies(ctx, cx, cy, R * 0.85, state, options);
    }

    /* ── 5. نص الحالة داخل الطبق (إذا كان فارغاً) ── */
    if (state === 'empty') {
        ctx.save();
        ctx.fillStyle   = 'rgba(100,150,100,0.4)';
        ctx.font        = `bold ${Math.round(R * 0.18)}px Cairo, sans-serif`;
        ctx.textAlign   = 'center';
        ctx.textBaseline= 'middle';
        ctx.fillText('وسط آغار', cx, cy);
        ctx.restore();
    }
};

/**
 * يرسم المستعمرات البكتيرية داخل الطبق
 */
const drawColonies = (ctx, cx, cy, r, state, options = {}) => {
    const count   = options.count || (state === 'contaminated' ? 28 : state === 'sparse' ? 4 : 20);
    const isContam= state === 'contaminated';
    const isSparse= state === 'sparse';

    for (let i = 0; i < count; i++) {
        const angle  = Math.random() * Math.PI * 2;
        const dist   = Math.sqrt(Math.random()) * r * 0.9;
        const px     = cx + dist * Math.cos(angle);
        const py     = cy + dist * Math.sin(angle);
        const size   = isSparse ? (3 + Math.random() * 6)
                     : isContam ? (6 + Math.random() * 16)
                     : (4 + Math.random() * 10);

        /* Glow */
        ctx.save();
        ctx.shadowColor = isContam ? 'rgba(200,0,0,0.5)'
                        : isSparse ? 'rgba(120,80,40,0.3)'
                        : 'rgba(255,200,0,0.6)';
        ctx.shadowBlur  = size * 1.5;

        const colGrad = ctx.createRadialGradient(px - size * 0.3, py - size * 0.3, 0, px, py, size);
        if (isContam) {
            colGrad.addColorStop(0, '#ff8a80');
            colGrad.addColorStop(1, '#b71c1c');
        } else if (isSparse) {
            colGrad.addColorStop(0, '#d7ccc8');
            colGrad.addColorStop(1, '#6d4c41');
        } else {
            colGrad.addColorStop(0, '#fff59d');
            colGrad.addColorStop(0.6, '#ffb300');
            colGrad.addColorStop(1, '#e65100');
        }

        ctx.beginPath();
        /* مستعمرات التلوث ذات شكل غير منتظم */
        if (isContam && Math.random() > 0.5) {
            ctx.save();
            ctx.translate(px, py);
            ctx.rotate(Math.random() * Math.PI);
            ctx.scale(1 + Math.random() * 0.6, 0.6 + Math.random() * 0.5);
            ctx.arc(0, 0, size, 0, Math.PI * 2);
            ctx.restore();
        } else {
            ctx.arc(px, py, size, 0, Math.PI * 2);
        }
        ctx.fillStyle = colGrad;
        ctx.fill();
        ctx.restore();
    }
};

/* ============================================================
   🎬 تحريك المستعمرات بـ Canvas (للنتيجة النهائية)
   ============================================================ */

/**
 * يُحرّك ظهور المستعمرات تدريجياً على Canvas نتيجة التجربة
 * @param {HTMLCanvasElement} canvas
 * @param {'colonies'|'contaminated'|'sparse'|'no_growth'} type
 */
const animatePetriResult = (canvas, type) => {
    if (!canvas) return;

    /* رسم الطبق الفارغ أولاً */
    const baseState = type === 'no_growth' ? 'no_growth' : 'empty';
    drawPetriCanvas(canvas, baseState);

    if (type === 'no_growth') return; /* لا نمو — يبقى فارغاً */

    /* تحريك تدريجي: نرسم عدداً متزايداً من المستعمرات */
    const totalCount = type === 'contaminated' ? 30 : type === 'sparse' ? 5 : 22;
    let drawn = 0;

    const step = () => {
        if (drawn >= totalCount) return;
        drawn += Math.ceil(totalCount / 18); /* ~18 خطوات */
        drawPetriCanvas(canvas, type === 'sparse' ? 'sparse' : type, { count: drawn });
        requestAnimationFrame(step);
    };

    setTimeout(() => requestAnimationFrame(step), 300);
};

/* ============================================================
   🖥️ عرض الأداة بالـ SVG في اللوحة
   ============================================================ */

/**
 * ينشئ عنصر HTML مع SVG الأداة
 * @returns {HTMLElement}
 */
const buildToolElement = (tool, used) => {
    const el         = document.createElement('div');
    el.className     = `tool-item${used ? ' used' : ''}`;
    el.dataset.tool  = tool.id;
    el.dataset.tooltip = tool.tooltip;
    el.setAttribute('draggable', 'true');

    const svg = TOOL_SVGS[tool.id] || `<span style="font-size:2.5rem">${tool.emoji}</span>`;

    el.innerHTML = `
        <div class="tool-svg-wrap">${svg}</div>
        <span class="tool-name">${tool.name}</span>
        ${used ? '<div class="tool-used-badge">✓ مستخدم</div>' : ''}
    `;
    return el;
};

/* ============================================================
   🖼️ صور مرئية لكل خطوة (Step Illustrations)
   SVG بسيطة توضح العمل المطلوب في كل خطوة
   ============================================================ */

const STEP_ILLUSTRATIONS = {

    select_sample: `
        <div class="step-illus-wrap">
            <div class="illus-samples">
                <div class="illus-sample-item">
                    <svg viewBox="0 0 40 60" width="40"><path d="M14 6 L14 42 Q14 55 20 55 Q26 55 26 42 L26 6 Z" fill="#e3f2fd" stroke="#90caf9" stroke-width="1.5"/>
                    <path d="M15 35 L15 42 Q15 53 20 53 Q25 53 25 42 L25 35 Z" fill="#2196f3" opacity="0.8"/>
                    <rect x="12" y="4" width="16" height="5" rx="2" fill="#90caf9"/></svg>
                    <span>ماء</span>
                </div>
                <div class="illus-sample-item">
                    <svg viewBox="0 0 40 60" width="40"><path d="M14 6 L14 42 Q14 55 20 55 Q26 55 26 42 L26 6 Z" fill="#fce4ec" stroke="#f48fb1" stroke-width="1.5"/>
                    <path d="M15 32 L15 42 Q15 53 20 53 Q25 53 25 42 L25 32 Z" fill="#e91e63" opacity="0.85"/>
                    <rect x="12" y="4" width="16" height="5" rx="2" fill="#f48fb1"/></svg>
                    <span>دم</span>
                </div>
                <div class="illus-sample-item">
                    <svg viewBox="0 0 40 60" width="40"><path d="M14 6 L14 42 Q14 55 20 55 Q26 55 26 42 L26 6 Z" fill="#fff8e1" stroke="#ffe082" stroke-width="1.5"/>
                    <path d="M15 38 L15 42 Q15 53 20 53 Q25 53 25 42 L25 38 Z" fill="#ff8f00" opacity="0.8"/>
                    <rect x="12" y="4" width="16" height="5" rx="2" fill="#ffe082"/></svg>
                    <span>طعام</span>
                </div>
            </div>
            <div class="illus-arrow">← اختر عينة</div>
        </div>`,

    wear_gloves: `
        <div class="step-illus-wrap">
            <div class="illus-center">
                <div class="illus-hands">
                    <svg viewBox="0 0 70 70" width="70">${TOOL_SVGS.gloves}</svg>
                    <div class="illus-arrow-down">↓</div>
                    <div class="illus-hands-icon">🙌</div>
                </div>
                <span class="illus-caption">اسحب القفازات إلى منطقة العمل</span>
            </div>
        </div>`,

    sterilize_tools: `
        <div class="step-illus-wrap">
            <div class="illus-center">
                <svg viewBox="0 0 80 90" width="70">${TOOL_SVGS.sterilize}</svg>
                <div class="illus-spray-target">
                    <span class="illus-spray-dot"></span>
                    <span class="illus-spray-dot"></span>
                    <span class="illus-spray-dot"></span>
                </div>
                <span class="illus-caption">عقّم السطح والأدوات قبل البدء</span>
            </div>
        </div>`,

    select_medium: `
        <div class="step-illus-wrap">
            <div class="illus-media-row">
                <div class="illus-medium-item" style="--c:#4caf50">
                    <svg viewBox="0 0 80 100" width="46">${TOOL_SVGS.medium}</svg>
                    <span>آغار عام</span>
                </div>
                <div class="illus-medium-item" style="--c:#e53935">
                    <svg viewBox="0 0 80 100" width="46">${TOOL_SVGS.medium}</svg>
                    <span>آغار دم</span>
                </div>
            </div>
            <span class="illus-caption">اختر الوسط المناسب لعينتك</span>
        </div>`,

    transfer_sample: `
        <div class="step-illus-wrap">
            <div class="illus-transfer">
                <svg viewBox="0 0 60 100" width="38">${TOOL_SVGS.sample}</svg>
                <svg viewBox="0 0 80 100" width="44" style="margin:0 8px">${TOOL_SVGS.pipette}</svg>
                <svg viewBox="0 0 90 90" width="52">${TOOL_SVGS.petri}</svg>
            </div>
            <span class="illus-caption">انقل العينة بالماصة إلى طبق بتري</span>
        </div>`,

    label_dish: `
        <div class="step-illus-wrap">
            <div class="illus-center">
                <div class="illus-label-action">
                    <svg viewBox="0 0 90 90" width="60">${TOOL_SVGS.petri}</svg>
                    <svg viewBox="0 0 80 80" width="42" style="margin-right:-8px">${TOOL_SVGS.label}</svg>
                </div>
                <span class="illus-caption">ضع ملصق التعريف على الطبق</span>
            </div>
        </div>`,

    incubate: `
        <div class="step-illus-wrap">
            <div class="illus-center">
                <svg viewBox="0 0 90 90" width="80">${TOOL_SVGS.incubator}</svg>
                <span class="illus-caption">ضبط درجة الحرارة ومدة التحضين</span>
            </div>
        </div>`,

    view_result: `
        <div class="step-illus-wrap">
            <div class="illus-center">
                <canvas id="preview-petri-canvas" width="130" height="130" style="border-radius:50%;display:block;margin:0 auto"></canvas>
                <span class="illus-caption">استعد لرؤية نتيجة تجربتك!</span>
            </div>
        </div>`,
};

/**
 * يُحدّث canvas المعاينة في خطوة النتيجة
 */
const renderPreviewCanvas = () => {
    const canvas = document.getElementById('preview-petri-canvas');
    if (!canvas) return;
    drawPetriCanvas(canvas, 'sample');
    /* دوران خفيف للمستعمرات للإيحاء بالنمو */
    let frame = 0;
    const anim = setInterval(() => {
        frame++;
        if (frame > 40) { clearInterval(anim); return; }
        drawPetriCanvas(canvas, 'colonies', { count: frame });
    }, 80);
};

/* ============================================================
   📤 تصدير الدوال للاستخدام في bacteria-lab.js
   ============================================================ */

window.BacteriaVisuals = {
    TOOL_SVGS,
    STEP_ILLUSTRATIONS,
    buildToolElement,
    drawPetriCanvas,
    animatePetriResult,
    renderPreviewCanvas,
};
