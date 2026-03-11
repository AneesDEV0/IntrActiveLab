/* =============================================
   🦠 دورة حياة المرض — lifecycle.js
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

    /* ---------------------------------
       1. إدارة التبويبات (Tabs System)
       --------------------------------- */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // إزالة التفعيل عن جميع الأزرار واللوحات
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // تفعيل الزر الحالي
            btn.classList.add('active');

            // تفعيل اللوحة المطابقة بناءً على data-tab
            const targetId = btn.getAttribute('data-tab') + '-pane';
            const targetPane = document.getElementById(targetId);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    /* ---------------------------------
       2. إدارة المخطط الزمني (Timeline)
       --------------------------------- */
    // نطبق المنطق على كل حاوية تبويب بشكل منفصل
    tabPanes.forEach(pane => {
        const nodes = pane.querySelectorAll('.node');
        const lines = pane.querySelectorAll('.timeline-line');
        const stageCards = pane.querySelectorAll('.stage-card');

        nodes.forEach((node, index) => {
            node.addEventListener('click', () => {
                const targetStageId = node.getAttribute('data-stage');

                // 2.1 تحديث تفعيل العقد والخطوط حتى العقدة المحددة
                nodes.forEach((n, i) => {
                    if (i <= index) {
                        n.classList.add('active');
                        // تفعيل الخط الذي يسبق العقدة
                        if (i > 0 && lines[i - 1]) {
                            lines[i - 1].classList.add('active-line');
                        }
                    } else {
                        n.classList.remove('active');
                        if (i > 0 && lines[i - 1]) {
                            lines[i - 1].classList.remove('active-line');
                        }
                    }
                });

                // 2.2 إظهار بطاقة الشرح المطابقة فقط
                stageCards.forEach(card => {
                    card.classList.remove('active-card');
                    if (card.id === targetStageId) {
                        card.classList.add('active-card');
                    }
                });
            });
        });
    });

});

/* -------------------------------------------------------------
   3. Interactive Arrangement Game (Drag and Drop + Timer)
------------------------------------------------------------- */
const diseaseStages = {
    virus: [
        { id: 'v1', text: 'الدخول والالتصاق' },
        { id: 'v2', text: 'الاختراق والتفريغ' },
        { id: 'v3', text: 'النسخ والتكاثر' },
        { id: 'v4', text: 'التجميع' },
        { id: 'v5', text: 'الانطلاق والعدوى' }
    ],
    bacteria: [
        { id: 'b1', text: 'التعرض والدخول' },
        { id: 'b2', text: 'الاستقرار والاستعمار' },
        { id: 'b3', text: 'التكاثر والنمو' },
        { id: 'b4', text: 'إفراز السموم والأعراض' },
        { id: 'b5', text: 'مقاومة المناعة والانتشار' }
    ],
    parasite: [
        { id: 'p1', text: 'الابتلاع أو اللدغ' },
        { id: 'p2', text: 'الوصول للبيئة المستهدفة' },
        { id: 'p3', text: 'التطور والنضج' },
        { id: 'p4', text: 'إنتاج البيوض (العدوى)' },
        { id: 'p5', text: 'الخروج واستكمال الدورة' }
    ],
    fungi: [
        { id: 'f1', text: 'استنشاق الأبواغ' },
        { id: 'f2', text: 'الاستقرار والإنبات' },
        { id: 'f3', text: 'النمو الخيطي واختراق الأنسجة' },
        { id: 'f4', text: 'التكاثر وإنتاج الجراثيم' },
        { id: 'f5', text: 'انتشار العدوى' }
    ]
};

let gameTimers = {};
let timeLeftIntervals = {};
const CHALLENGE_TIME = 60;

function startChallenge(diseaseType) {
    const challengeContainer = document.getElementById(`${diseaseType}-challenge`);
    challengeContainer.classList.add('active');
    
    // Smooth scroll to challenge
    challengeContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });

    const ul = document.getElementById(`${diseaseType}-list`);
    const verifyBtn = document.getElementById(`${diseaseType}-verify-btn`);
    const timerBadge = document.getElementById(`${diseaseType}-timer`);
    
    // Enable list and button
    ul.classList.remove('disabled-list');
    verifyBtn.disabled = false;
    
    // Clear previous timer if any
    if (timeLeftIntervals[diseaseType]) {
        clearInterval(timeLeftIntervals[diseaseType]);
    }

    // Reset timer UI
    gameTimers[diseaseType] = CHALLENGE_TIME;
    timerBadge.classList.remove('timer-low');
    timerBadge.innerHTML = `<i class="fa-regular fa-clock"></i> ${CHALLENGE_TIME} ثانية`;

    // Shuffle and render stages
    const shuffled = [...diseaseStages[diseaseType]].sort(() => Math.random() - 0.5);
    ul.innerHTML = '';
    
    shuffled.forEach(stage => {
        const li = document.createElement('li');
        li.textContent = stage.text;
        li.setAttribute('data-id', stage.id);
        li.draggable = true;
        ul.appendChild(li);
    });

    initDragAndDrop(ul);

    // Start timer countdown
    timeLeftIntervals[diseaseType] = setInterval(() => {
        gameTimers[diseaseType]--;
        timerBadge.innerHTML = `<i class="fa-regular fa-clock"></i> ${gameTimers[diseaseType]} ثانية`;

        if (gameTimers[diseaseType] <= 10) {
            timerBadge.classList.add('timer-low');
        }

        if (gameTimers[diseaseType] <= 0) {
            clearInterval(timeLeftIntervals[diseaseType]);
            handleTimeUp(diseaseType);
        }
    }, 1000);
}

function initDragAndDrop(listEl) {
    const listItems = listEl.querySelectorAll('li');
    let dragItem = null;

    listItems.forEach(item => {
        item.addEventListener('dragstart', function (e) {
            dragItem = this;
            setTimeout(() => this.classList.add('dragging'), 0);
        });

        item.addEventListener('dragend', function () {
            setTimeout(() => {
                this.classList.remove('dragging');
                dragItem = null;
            }, 0);
        });

        item.addEventListener('dragover', function (e) {
            e.preventDefault();
            const afterElement = getDragAfterElement(listEl, e.clientY);
            const draggable = document.querySelector('.dragging');
            if (afterElement == null) {
                listEl.appendChild(draggable);
            } else {
                listEl.insertBefore(draggable, afterElement);
            }
        });
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function verifyChallenge(diseaseType) {
    clearInterval(timeLeftIntervals[diseaseType]);
    const currentOrder = Array.from(document.getElementById(`${diseaseType}-list`).children).map(li => li.getAttribute('data-id'));
    const correctOrder = diseaseStages[diseaseType].map(stage => stage.id);

    const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(correctOrder);

    if (isCorrect) {
        Swal.fire({
            title: 'عمل رائع!',
            text: `لقد قمت بترتيب مراحل دورة حياة ${getDiseaseNameInArabic(diseaseType)} بنجاح!`,
            icon: 'success',
            confirmButtonText: 'إغلاق'
        });
        document.getElementById(`${diseaseType}-list`).classList.add('disabled-list');
        document.getElementById(`${diseaseType}-verify-btn`).disabled = true;
    } else {
        document.getElementById(`${diseaseType}-list`).classList.add('shake');
        setTimeout(() => document.getElementById(`${diseaseType}-list`).classList.remove('shake'), 500);

        Swal.fire({
            title: 'ترتيب غير صحيح!',
            text: 'حاول مجدداً ترتيب المراحل بالشكل الصحيح.',
            icon: 'error',
            confirmButtonText: 'إعادة المحاولة'
        }).then(() => {
            startChallenge(diseaseType); // Restart the game
        });
    }
}

function handleTimeUp(diseaseType) {
    document.getElementById(`${diseaseType}-list`).classList.add('disabled-list');
    document.getElementById(`${diseaseType}-verify-btn`).disabled = true;

    Swal.fire({
        title: 'انتهى الوقت!',
        text: 'لم تتمكن من ترتيب المراحل في الوقت المحدد.',
        icon: 'warning',
        confirmButtonText: 'إعادة المحاولة',
        showCancelButton: true,
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            startChallenge(diseaseType);
        }
    });
}

function getDiseaseNameInArabic(diseaseType) {
    const names = {
        'virus': 'الفيروس',
        'bacteria': 'البكتيريا',
        'parasite': 'الطفيليات',
        'fungi': 'الفطريات'
    };
    return names[diseaseType] || diseaseType;
}
