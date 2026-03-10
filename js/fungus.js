document.addEventListener("DOMContentLoaded", function () {
    const list = document.getElementById("steps");
    const timerDisplay = document.getElementById("timer-display");
    const startBtn = document.getElementById("start-btn");
    const checkBtn = document.getElementById("check-btn");

    let draggedItem = null;
    let timeLeft = 60;
    let timerInterval = null;

    // --- الوظائف المساعدة ---
    function shuffleSteps() {
        const nodes = Array.from(list.children);
        // ترتيب عشوائي غير المطابق للترتيب الصحيح
        nodes.sort(() => Math.random() - 0.5);

        list.innerHTML = ""; // تفريغ القائمة
        nodes.forEach(node => list.appendChild(node));
    }

    // ترتيب أولي قبل البدء لمنع الغش!
    shuffleSteps();

    // --- بدء التحدي ---
    window.startChallenge = function () {
        // خلط العناصر بشكل نهائي لتحدي حقيقي!
        shuffleSteps();

        // إخفاء زر البدء وإظهار زر التحقق
        startBtn.style.display = "none";
        checkBtn.style.display = "flex";
        checkBtn.disabled = false;

        // تفعيل القائمة بصرياً وعملياً
        list.classList.remove("disabled-list");
        const listItems = document.querySelectorAll("#steps li");

        listItems.forEach(item => {
            item.setAttribute("draggable", "true");
        });

        // تشغيل المؤقت
        clearInterval(timerInterval); // تنظيف أي مؤقت سابق لضمان عدم التداخل
        timeLeft = 60;
        timerDisplay.innerText = `الوقت المتبقي: ${timeLeft} ثانية`;
        timerDisplay.classList.remove("timer-low");

        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.innerText = `الوقت المتبقي: ${timeLeft} ثانية`;

            if (timeLeft <= 10 && !timerDisplay.classList.contains('timer-low')) {
                timerDisplay.classList.add('timer-low');
            }

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                finishGame(false);
            }
        }, 1000);
    };

    // --- إنهاء اللعبة ---
    function finishGame(isWinner) {
        // إيقاف السحب
        list.classList.add("disabled-list");
        document.querySelectorAll("#steps li").forEach(item => {
            item.setAttribute("draggable", "false");
        });
        checkBtn.disabled = true;

        if (isWinner) {
            Swal.fire({
                title: "أحسنت أيها العالم! 🎉",
                html: `لقد نجحت في ترتيب دورة حياة الفطر بشكل صحيح.<br><br>استغرقت: <strong>${60 - timeLeft} ثانية</strong>`,
                icon: "success",
                confirmButtonText: "رائع!",
                background: '#0c1628',
                color: '#f0f6ff',
                confirmButtonColor: '#00e5a0'
            });
        } else {
            Swal.fire({
                title: "انتهى الوقت! ⏱️",
                text: "لم تتمكن من ترتيب المراحل في الوقت المحدد. لا بأس، حاول مجدداً!",
                icon: "error",
                confirmButtonText: "إعادة المحاولة",
                background: '#0c1628',
                color: '#f0f6ff',
                confirmButtonColor: '#ff4b6e'
            }).then(() => {
                // إعادة تهيئة الواجهة لمحاولة جديدة
                startBtn.style.display = "flex";
                checkBtn.style.display = "none";
                timerDisplay.innerText = "جاهز للتحدي؟";
                timerDisplay.classList.remove("timer-low");
                shuffleSteps();
            });
        }
    }

    // --- منطق السحب والإفلات ---
    list.addEventListener("dragstart", (e) => {
        if (list.classList.contains("disabled-list")) {
            e.preventDefault();
            return;
        }
        draggedItem = e.target;
        // استخدام setTimeout للسماح ببدء السحب قبل تغيير الستايل
        setTimeout(() => e.target.classList.add('dragging'), 0);
    });

    list.addEventListener("dragend", (e) => {
        e.target.classList.remove('dragging');
        draggedItem = null;
    });

    list.addEventListener("dragover", (e) => {
        e.preventDefault();
        if (!draggedItem || list.classList.contains("disabled-list")) return;

        const afterElement = getDragAfterElement(list, e.clientY);
        if (afterElement == null) {
            list.appendChild(draggedItem);
        } else {
            list.insertBefore(draggedItem, afterElement);
        }
    });

    // إضافة تأثيرات عند السحب فوق العنصر
    list.addEventListener("dragenter", (e) => {
        e.preventDefault();
    });

    function getDragAfterElement(container, y) {
        // العثور على جميع العناصر باستثناء العنصر الذي يتم سحبه
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

        // العثور على أقرب عنصر
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            // مركز العنصر في المحور الصادي
            const offset = y - box.top - box.height / 2;

            // إذا كان الماوس فوق النصف العلوي للعنصر
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // --- التحقق من الإجابة ---
    window.checkAnswer = function () {
        // الترتيب الصحيح لدورة حياة الفطر: 
        // 1. الأبواغ
        // 2. الخيوط الفطرية
        // 3. الميسيليوم
        // 4. جسم الفطر
        const correctOrder = ["الأبواغ", "الخيوط الفطرية", "الميسيليوم", "جسم الفطر"];
        const currentOrder = [...document.querySelectorAll("#steps li")].map(li => li.textContent.replace('⋮⋮', '').trim());

        // التحقق من المطابقة
        let isCorrect = true;
        for (let i = 0; i < correctOrder.length; i++) {
            if (correctOrder[i] !== currentOrder[i]) {
                isCorrect = false;
                break;
            }
        }

        if (isCorrect) {
            clearInterval(timerInterval);
            finishGame(true);

            // إضافة تأثير بصري للنجاح
            document.querySelectorAll("#steps li").forEach(li => {
                li.style.borderColor = "#00e5a0";
                li.style.color = "#00e5a0";
            });

        } else {
            // إضافة تأثير الاهتزاز عند الخطأ
            list.classList.remove('shake');
            void list.offsetWidth; // Trigger reflow 
            list.classList.add('shake');

            // عرض تنبيه صغير
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: '#0c1628',
                color: '#f0f6ff'
            });

            Toast.fire({
                icon: 'warning',
                title: 'هناك خطأ في الترتيب، راجع الفيديو وحاول مجدداً!'
            });
        }
    };
});