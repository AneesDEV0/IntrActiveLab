document.addEventListener("DOMContentLoaded", function () {
    const list = document.getElementById("steps");
    const timerDisplay = document.getElementById("timer-display");
    const startBtn = document.getElementById("start-btn");
    const checkBtn = document.getElementById("check-btn");
    const videoPlayer = document.getElementById("tutorial-video");
    const videoSource = document.getElementById("video-source");

    let timerInterval = null;
    let currentChallenge = 'fungus';

    // بيانات التحديات - تعتمد كلياً على ملفاتك المحلية
    const data = {
        fungus: {
            title: "دورة حياة الفطر",
            icon: "🍄",
            steps: ["الأبواغ", "الخيوط الفطرية", "الميسيليوم", "جسم الفطر"],
            video: "../video/WhatsApp Video 2026-03-10 at 10.51.18 PM.mp4",
            desc: "شاهد كيف يبدأ الفطر من الأبواغ المجهرية لينمو ويشكل جسماً ثمرياً كاملاً."
        },
        frog: {
            title: "دورة حياة الضفدع",
            icon: "🐸",
            steps: ["البيوض", "أبو ذنيبة", "أبو ذنيبة بأرجل", "ضفدع صغير", "ضفدع بالغ"],
            video: "../video/WhatsApp Video 2026-03-11 at 10.17.59 AM.mp4", // تأكد من وجود الملف بهذا الاسم
            desc: "راقب مراحل التحول المذهلة للضفدع من بيضة في الماء إلى حيوان برمائي بالغ."
        },
        plants_vas: {
            title: "النباتات الوعائية",
            icon: "🌱",
            steps: ["امتصاص الماء (جذور)", "نقل السوائل (ساق)", "بناء ضوئي (أوراق)", "إنتاج البذور"],
            video: "../video/WhatsApp Video 2026-03-11 at 10.57.18 AM.mp4", // تأكد من وجود الملف بهذا الاسم
            desc: "تعرف على النباتات الوعائية التي تمتلك نظام نقل معقد (خشب ولحاء) لنقل الغذاء."
        },
        plants_non: {
            title: "النباتات اللاوعائية",
            icon: "🌿",
            steps: ["أبواغ (Spores)", "نمو خيوط أولية", "نبات مشيجي ناضج", "إخصاب بوجود الماء"],
            video: "../video/non_vascular.mp4", // تأكد من وجود الملف بهذا الاسم
            desc: "اكتشف النباتات البسيطة كالحزازيات التي تعيش في الأماكن الرطبة وتتكاثر بالأبواغ."
        }
    };

    // وظيفة التبديل بين الأقسام
    window.switchChallenge = function(type) {
        currentChallenge = type;
        const challenge = data[type];
        
        // 1. تحديث النصوص والأيقونات
        document.getElementById("challenge-title").innerText = challenge.title;
        document.getElementById("challenge-icon").innerText = challenge.icon;
        document.getElementById("video-desc").innerText = challenge.desc;

        // 2. تحديث ملف الفيديو المحلي
        videoSource.src = challenge.video;
        videoPlayer.load(); // إعادة تحميل المشغل لقراءة الملف الجديد

        // 3. تحديث مظهر الأزرار (Tabs)
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        event.currentTarget.classList.add('active');

        // 4. إعادة ضبط اللعبة والقائمة
        resetGameUI();
        createChallengeItems();
    };

    // إنشاء عناصر القائمة بناءً على التحدي المختار
    function createChallengeItems() {
        list.innerHTML = "";
        data[currentChallenge].steps.forEach(step => {
            const li = document.createElement("li");
            li.innerHTML = step;
            li.setAttribute("draggable", "false"); // لا يمكن السحب إلا بعد الضغط على "بدء"
            list.appendChild(li);
        });
        shuffleItems();
    }

    // خلط العناصر عشوائياً
    function shuffleItems() {
        const items = Array.from(list.children);
        items.sort(() => Math.random() - 0.5);
        list.innerHTML = "";
        items.forEach(item => list.appendChild(item));
    }

    // إعادة ضبط الواجهة
    function resetGameUI() {
        clearInterval(timerInterval);
        timerDisplay.innerText = "جاهز للتحدي؟";
        timerDisplay.classList.remove("timer-low");
        startBtn.style.display = "flex";
        checkBtn.style.display = "none";
        list.classList.add("disabled-list");
    }

    // بدء التحدي والمؤقت
    window.startChallenge = function() {
        shuffleItems();
        startBtn.style.display = "none";
        checkBtn.style.display = "flex";
        checkBtn.disabled = false;
        list.classList.remove("disabled-list");
        
        // تفعيل خاصية السحب
        document.querySelectorAll("#steps li").forEach(li => li.setAttribute("draggable", "true"));

        let timeLeft = 60;
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.innerText = `الوقت: ${timeLeft} ثانية`;
            if (timeLeft <= 10) timerDisplay.classList.add("timer-low");
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                finishGame(false);
            }
        }, 1000);
    };

    // منطق السحب والإفلات (Drag & Drop)
    list.addEventListener("dragstart", (e) => {
        if (list.classList.contains("disabled-list")) return e.preventDefault();
        e.target.classList.add('dragging');
    });

    list.addEventListener("dragend", (e) => e.target.classList.remove('dragging'));

    list.addEventListener("dragover", (e) => {
        e.preventDefault();
        const draggedItem = document.querySelector('.dragging');
        const afterElement = getDragAfterElement(list, e.clientY);
        if (afterElement == null) {
            list.appendChild(draggedItem);
        } else {
            list.insertBefore(draggedItem, afterElement);
        }
    });

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

    // التحقق من صحة الترتيب
    window.checkAnswer = function() {
        const currentOrder = [...list.querySelectorAll("li")].map(li => li.innerText.trim());
        const correctOrder = data[currentChallenge].steps;

        if (JSON.stringify(currentOrder) === JSON.stringify(correctOrder)) {
            clearInterval(timerInterval);
            finishGame(true);
        } else {
            list.classList.add('shake');
            setTimeout(() => list.classList.remove('shake'), 500);
            Swal.fire({
                icon: 'error',
                title: 'حاول مرة أخرى!',
                text: 'الترتيب الحالي غير صحيح.',
                toast: true,
                position: 'top-end',
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    function finishGame(isWin) {
        list.classList.add("disabled-list");
        document.querySelectorAll("#steps li").forEach(li => li.setAttribute("draggable", "false"));
        
        Swal.fire({
            title: isWin ? "أحسنت! عمل رائع 🥳" : "انتهى الوقت! ⏱️",
            text: isWin ? "لقد نجحت في ترتيب الدورة بشكل صحيح." : "لا تقلق، يمكنك المحاولة مرة أخرى لتتعلم الترتيب.",
            icon: isWin ? "success" : "error",
            confirmButtonText: "موافق",
            confirmButtonColor: "#00e5a0"
        }).then(() => resetGameUI());
    }

    // تشغيل التحدي الأول تلقائياً عند تحميل الصفحة
    createChallengeItems();
});