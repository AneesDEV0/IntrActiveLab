document.addEventListener("DOMContentLoaded", function () {
    const list = document.getElementById("steps");
    const startBtn = document.getElementById("start-btn");
    const checkBtn = document.getElementById("check-btn");
    const timerDisplay = document.getElementById("timer-display");
    const videoPlayer = document.getElementById("tutorial-video");
    const videoSource = document.getElementById("video-source");

    let timerInterval;
    let timeLeft = 60;
    let currentChallenge = 'fungus';

    const resetBtn = document.createElement("button");
    resetBtn.id = "reset-btn";
    resetBtn.className = "action-btn btn-primary";
    resetBtn.style.display = "none";
    resetBtn.style.marginTop = "10px";
    resetBtn.innerHTML = "🔄 محاولة مرة أخرى";
    resetBtn.onclick = () => resetGameUI();
    checkBtn.parentNode.appendChild(resetBtn);

    const data = {
        fungus: { type: "sort", title: "دورة حياة الفطر", icon: "🍄", steps: ["الأبواغ", "الخيوط الفطرية", "الميسيليوم", "جسم الفطر"], video: "../video/WhatsApp Video 2026-03-10 at 10.51.18 PM.mp4", desc: "رتب مراحل نمو الفطر بالتسلسل الصحيح." },
        frog: { type: "sort", title: "دورة حياة الضفدع", icon: "🐸", steps: ["البيوض", "أبو ذنيبة", "أبو ذنيبة بأرجل", "ضفدع صغير", "ضفدع بالغ"], video: "../video/WhatsApp Video 2026-03-11 at 10.17.59 AM.mp4", desc: "رتب مراحل تحول الضفدع من الماء إلى اليابسة." },
        plants_vas: { type: "sort", title: "النباتات الوعائية", icon: "🌱", steps: ["امتصاص الماء (جذور)", "نقل السوائل (ساق)", "بناء ضوئي (أوراق)", "إنتاج البذور"], video: "../video/WhatsApp Video 2026-03-11 at 10.57.18 AM.mp4", desc: "رتب آلية عمل الأنسجة الوعائية في النبات." },
        plants_non: { 
            type: "quiz", title: "حقائق النباتات اللاوعائية", icon: "🌿", 
            items: [
                { text: "تمتلك أشباه جذور وأشباه سيقان", isCorrect: true },
                { text: "لا تحتوي على بذور وتتكاثر بالأبواغ", isCorrect: true },
                { text: "تعيش في المناطق الرطبة الظليلة", isCorrect: true },
                { text: "لا تمتلك أوعية ناقلة (خشب ولحاء)", isCorrect: true },
                { text: "تنتقل فيها المواد بالانتشار والأسموزية", isCorrect: true },
                { text: "تمتلك جذوراً حقيقية قوية", isCorrect: false },
                { text: "تنتج ثماراً وأزهاراً ملونة", isCorrect: false },
                { text: "تعتبر أشجار النخيل مثالاً عليها", isCorrect: false },
                { text: "تنمو لارتفاعات شاهقة جداً", isCorrect: false },
                { text: "تستطيع العيش في الصحراء الجافة بدون ماء", isCorrect: false }
            ], 
            video: "../video/WhatsApp Video 2026-03-11 at 2.41.27 PM.mp4", desc: "اختر 5 خصائص صحيحة للنباتات اللاوعائية." 
        }
    };

    window.switchChallenge = function(type, element) {
        currentChallenge = type;
        const challenge = data[type];
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        if (element) element.classList.add('active');
        document.getElementById("challenge-title").innerText = challenge.title;
        document.getElementById("challenge-icon").innerText = challenge.icon;
        document.getElementById("video-desc").innerText = challenge.desc;
        document.getElementById("instruction-text").innerText = (challenge.type === "sort") ? "(حرك ورتب)" : "(اختر 5 خصائص)";
        videoSource.src = challenge.video;
        videoPlayer.load();
        resetGameUI();
    };

    function startCountdown() {
        clearInterval(timerInterval);
        timeLeft = 60;
        timerDisplay.innerText = `الوقت المتبقي: ${timeLeft}s`;
        
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.innerText = `الوقت المتبقي: ${timeLeft}s`;
            if (timeLeft <= 10) timerDisplay.style.color = "#ff4757";
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                gameOver();
            }
        }, 1000);
    }

    function gameOver() {
        list.classList.add("disabled-list");
        checkBtn.style.display = "none";
        resetBtn.style.display = "flex";
        Swal.fire({
            icon: 'error',
            title: 'انتهى الوقت!',
            text: 'للأسف لم تنهِ التحدي في الوقت المحدد.',
            confirmButtonText: 'حاول مرة أخرى'
        });
    }

    function initItems() {
        list.innerHTML = "";
        const challenge = data[currentChallenge];
        if (challenge.type === "sort") {
            challenge.steps.forEach(step => {
                const li = document.createElement("li");
                li.innerHTML = step;
                list.appendChild(li);
            });
            shuffleItems();
        } else {
            const shuffled = [...challenge.items].sort(() => Math.random() - 0.5);
            shuffled.forEach(item => {
                const li = document.createElement("li");
                li.innerHTML = `<span class="status-icon"></span> ${item.text}`;
                li.dataset.correct = item.isCorrect;
                li.className = "fact-item";
                li.onclick = function() {
                    if (list.classList.contains("disabled-list")) return;
                    const selectedCount = list.querySelectorAll(".selected").length;
                    if (!this.classList.contains("selected") && selectedCount >= 5) {
                        Swal.fire({ toast: true, position: 'top-end', icon: 'warning', title: 'وصلت للحد الأقصى (5 خصائص)', showConfirmButton: false, timer: 1500 });
                        return;
                    }
                    this.classList.toggle("selected");
                };
                list.appendChild(li);
            });
        }
    }

    function shuffleItems() {
        const items = Array.from(list.children);
        items.sort(() => Math.random() - 0.5);
        list.innerHTML = "";
        items.forEach(item => list.appendChild(item));
    }

    window.startChallenge = function() {
        startBtn.style.display = "none";
        checkBtn.style.display = "flex";
        resetBtn.style.display = "none";
        list.classList.remove("disabled-list");
        timerDisplay.style.color = "#00e5a0";
        startCountdown();
        if (data[currentChallenge].type === "sort") {
            document.querySelectorAll("#steps li").forEach(li => li.setAttribute("draggable", "true"));
        }
    };

    window.checkAnswer = function() {
        const challenge = data[currentChallenge];
        const allItems = list.querySelectorAll("li");
        clearInterval(timerInterval);

        if (challenge.type === "sort") {
            let isAllCorrect = true;
            allItems.forEach((li, index) => {
                if (li.innerText.trim() === challenge.steps[index]) {
                    li.style.backgroundColor = "rgba(0, 229, 160, 0.4)";
                    li.style.borderColor = "#00e5a0";
                } else {
                    li.style.backgroundColor = "rgba(255, 71, 87, 0.4)";
                    li.style.borderColor = "#ff4757";
                    isAllCorrect = false;
                }
            });

            if (isAllCorrect) {
                Swal.fire({ icon: 'success', title: 'عمل رائع!', text: 'لقد رتبت المراحل بشكل صحيح', confirmButtonColor: '#00e5a0' });
            } else {
                Swal.fire({ icon: 'error', title: 'هناك أخطاء', text: 'راجع الترتيب الملون بالأحمر', confirmButtonColor: '#ff4757' });
            }
            finishVisuals();

        } else {
            const selectedItems = list.querySelectorAll(".selected");
            if (selectedItems.length !== 5) {
                Swal.fire({ icon: 'warning', title: 'تنبيه', text: `يجب اختيار 5 خصائص فقط.`, confirmButtonColor: '#00e5a0' });
                startCountdown(); // استكمال الوقت
                return;
            }

            allItems.forEach(li => {
                const isCorrect = li.dataset.correct === "true";
                const isSelected = li.classList.contains("selected");
                const icon = li.querySelector('.status-icon');
                li.classList.remove("selected");

                if (isSelected && isCorrect) {
                    li.style.backgroundColor = "rgba(0, 229, 160, 0.4)"; li.style.borderColor = "#00e5a0";
                    icon.innerHTML = "✅";
                } else if (isSelected && !isCorrect) {
                    li.style.backgroundColor = "rgba(255, 71, 87, 0.6)"; li.style.borderColor = "#ff4757";
                    icon.innerHTML = "❌";
                } else if (!isSelected && isCorrect) {
                    li.style.backgroundColor = "rgba(0, 229, 160, 0.1)"; li.style.borderColor = "#00e5a0";
                    li.style.opacity = "0.8"; icon.innerHTML = "💡"; 
                } else {
                    li.style.opacity = "0.2"; li.style.filter = "grayscale(100%)";
                }
            });
            finishVisuals();
        }
    };

    function finishVisuals() {
        list.classList.add("disabled-list");
        checkBtn.style.display = "none";
        resetBtn.style.display = "flex"; 
    }

    function resetGameUI() {
        clearInterval(timerInterval);
        timerDisplay.innerText = "جاهز للتحدي؟";
        timerDisplay.style.color = "#fff";
        startBtn.style.display = "flex";
        checkBtn.style.display = "none";
        resetBtn.style.display = "none";
        list.classList.add("disabled-list");
        initItems();
    }

    // Drag and Drop Logic (كما هي)
    list.addEventListener("dragstart", (e) => {
        if (list.classList.contains("disabled-list") || data[currentChallenge].type !== "sort") return;
        e.target.classList.add('dragging');
    });
    list.addEventListener("dragend", (e) => e.target.classList.remove('dragging'));
    list.addEventListener("dragover", (e) => {
        e.preventDefault();
        const draggedItem = document.querySelector('.dragging');
        const afterElement = getDragAfterElement(list, e.clientY);
        if (afterElement == null) list.appendChild(draggedItem);
        else list.insertBefore(draggedItem, afterElement);
    });

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) return { offset: offset, element: child };
            else return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    initItems();
});