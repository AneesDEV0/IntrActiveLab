const labData = {
    bacteria: {
        title: "تركيب خلية البكتيريا ",
        embed: "https://sketchfab.com/models/d8d0207a54b443f68c24deb7673d5f55/embed?annotations_visible=1",
        parts: [
            { num: 1, name: "المادة الوراثية" },
            { num: 5, name: "الغشاء البلازمي" },
            { num: 7, name: "جدار خلوي" },
            { num: 8, name: "المحفظة" },
            { num: 9, name: "الأهداب" },
            { num: 10, name: "الأسواط" }
        ],
    },
    paramecium: {
        title: "تركيب البراميسيوم ",
        embed: "https://sketchfab.com/models/7cb325a9ac5346be943ef7ddd41de51e/embed?annotations_visible=1",
        parts: [
            { num: 1, name: "الأهداب" },
            { num: 3, name: "الميزاب الفمي" },
            { num: 4, name: "الفجوة المنقبضة" },
            { num: 5, name: "النواة الكبيرة" },
            { num: 6, name: "النواة الصغيرة" },
            { num: 7, name: "الفجوة الغذائية" }
        ],
    },
    spirogyra: {
        title: "طحلب السبيروجيرا ",
        embed: "https://sketchfab.com/models/1f1fb223f4044b03aa9938ca886548b4/embed?annotations_visible=1",
        parts: [
            { num: 1, name: "غشاء بلازمي" },
            { num: 2, name: "بلاستيدة خضراء لولبية" },
            { num: 3, name: "جدار خلوي" }
        ],
    }
};

let currentType = 'bacteria';

function switchOrganism(type) {
    currentType = type;
    const organism = labData[type];
    
    document.getElementById('main-title').innerText = organism.title;
    document.getElementById('model-iframe').src = organism.embed;
    
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`btn-${type}`).classList.add('active');

    renderTable(organism);
}

function renderTable(organism) {
    const tbody = document.getElementById('quizBody');
    tbody.innerHTML = "";
    
    // جعل الخيارات مقتصرة فقط على الأسماء المطلوبة لكل كائن مع خلط ترتيبها
    const allOptions = [...organism.parts.map(p => p.name)].sort(() => Math.random() - 0.5);

    organism.parts.forEach(part => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${part.num}</strong></td>
            <td>
                <select class="quiz-select" data-correct="${part.name}">
                    <option value="">اختر الاسم...</option>
                    ${allOptions.map(name => `<option value="${name}">${name}</option>`).join('')}
                </select>
            </td>
            <td class="status-cell">--</td>
        `;
        tbody.appendChild(tr);
    });
}

function checkAnswers() {
    const selects = document.querySelectorAll('.quiz-select');
    let allSelected = true;
    let score = 0;

    selects.forEach(select => {
        if (select.value === "") allSelected = false;
    });

    if (!allSelected) {
        Swal.fire("تنبيه", "الرجاء اختيار جميع الأسماء قبل التحقق!", "warning");
        return;
    }

    selects.forEach(select => {
        const statusCell = select.parentElement.nextElementSibling;
        if (select.value === select.dataset.correct) {
            statusCell.innerText = "✅";
            statusCell.style.color = "#00b894";
            score++;
        } else {
            statusCell.innerText = "❌";
            statusCell.style.color = "#e74c3c";
        }
    });

    if (score === selects.length) {
        Swal.fire({
            title: "أحسنت! 🏆",
            text: "جميع الإجابات صحيحة، يمكنك المتابعة أو إعادة الاختبار.",
            icon: "success",
            confirmButtonText: "إعادة الاختبار"
        }).then((result) => {
            if (result.isConfirmed) {
                switchOrganism(currentType); 
            }
        });
    } else {
        Swal.fire("حاول مرة أخرى", `لقد حصلت على ${score} من أصل ${selects.length}. راجع الأخطاء الموضحة.`, "error");
    }
}

window.onload = () => switchOrganism('bacteria');