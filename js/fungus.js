document.addEventListener("DOMContentLoaded", function() {
    const list = document.getElementById("steps");
    const timerDisplay = document.getElementById("timer-display");
    const startBtn = document.getElementById("start-btn");
    const checkBtn = document.getElementById("check-btn");
    const listItems = document.querySelectorAll("#steps li");

    let draggedItem = null;
    let timeLeft = 60;
    let timerInterval = null;

    // --- بدء التحدي ---
    window.startChallenge = function() {
        startBtn.style.display = "none"; // إخفاء زر البدء
        list.classList.remove("disabled-list"); // تفعيل القائمة بوزرياً
        
        // تفعيل زر التحقق
        checkBtn.disabled = false;
        checkBtn.style.background = "#22c55e";
        checkBtn.style.cursor = "pointer";

        // تفعيل السحب برمجياً
        listItems.forEach(item => {
            item.setAttribute("draggable", "true");
            item.style.cursor = "grab";
        });

        // تشغيل المؤقت
        timerInterval = setInterval(() => {
            timeLeft--;
            timerDisplay.innerText = `الوقت المتبقي: ${timeLeft} ثانية`;

            if (timeLeft <= 10) timerDisplay.classList.add('timer-low');

            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                Swal.fire({
                    title: "انتهى الوقت! ⏱️",
                    text: "للأسف لم تنجح في الترتيب في الوقت المحدد.",
                    icon: "error",
                    confirmButtonText: "إعادة المحاولة"
                }).then(() => location.reload());
            }
        }, 1000);
    };

    // --- منطق السحب والإفلات ---
    list.addEventListener("dragstart", (e) => {
        if (list.classList.contains("disabled-list")) return; // منع السحب قبل البدء
        draggedItem = e.target;
        setTimeout(() => e.target.classList.add('dragging'), 0);
    });

    list.addEventListener("dragend", (e) => e.target.classList.remove('dragging'));

    list.addEventListener("dragover", (e) => {
        e.preventDefault();
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
            if (offset < 0 && offset > closest.offset) return { offset, element: child };
            return closest;
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // --- التحقق من الإجابة ---
    window.checkAnswer = function() {
        const correctOrder = ["الأبواغ", "الخيوط الفطرية", "الميسيليوم", "جسم الفطر"];
        const currentOrder = [...document.querySelectorAll("#steps li")].map(li => li.textContent.trim());
        
        if (JSON.stringify(correctOrder) === JSON.stringify(currentOrder)) {
            clearInterval(timerInterval);
            Swal.fire({
                title: "أحسنت 🎉",
                text: `رتبت المراحل بنجاح بـ ${60 - timeLeft} ثانية!`,
                icon: "success",
                confirmButtonText: "رائع"
            });
        } else {
            list.classList.add('shake');
            setTimeout(() => list.classList.remove('shake'), 500);
            Swal.fire({
                title: "ترتيب خاطئ",
                text: "حاول مجدداً قبل انتهاء الوقت!",
                icon: "warning",
                confirmButtonText: "تعديل"
            });
        }
    };
    function shuffleSteps() {
    const nodes = Array.from(list.children);
    nodes.sort(() => Math.random() - 0.5);
    nodes.forEach(node => list.appendChild(node));
}
shuffleSteps(); // استدعيها أول ما يضغط "بدء التحدي"
});