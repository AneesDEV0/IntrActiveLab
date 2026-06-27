/* ============================================
   🔬 محلل الكائنات الحية - script.js
   ============================================ */

const imageInput = document.getElementById('imageUpload');
const uploadZone = document.getElementById('uploadZone');
const uploadCard = document.getElementById('uploadCard');
const imagePreview = document.getElementById('imagePreview');
const previewImg = document.getElementById('previewImg');
const resultSection = document.getElementById('resultSection');
const resCommonName = document.getElementById('res-commonName');
const saveBtn = document.getElementById('saveBtn');

const API_URL = 'https://interactiveexcerciceapi.runasp.net/api/Classification/analyze';
//https://localhost:7098/
// const API_URL = 'https://localhost:7098/api/Classification/analyze';

// الحالة الحالية
let currentData = null;
let currentImageB64 = null;
let alreadySaved = false;

/* ──────────────────────────────────────────
   📤 اختيار الصورة
   ────────────────────────────────────────── */
imageInput.addEventListener('change', async function (e) {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith('image/')) return;

    // معاينة الصورة
    const reader = new FileReader();
    reader.onload = (ev) => {
        currentImageB64 = ev.target.result;
        previewImg.src = currentImageB64;
        uploadZone.style.display = 'none';
        imagePreview.classList.remove('hidden');

        // إخفاء النتائج القديمة
        resultSection.classList.add('hidden');
        currentData = null;
        alreadySaved = false;
        saveBtn.classList.remove('saved');
        saveBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
            </svg>
            حفظ في سجل التحليلات
        `;
    };
    reader.readAsDataURL(file);

    await analyzeBeetle(file);
});

/* ──────────────────────────────────────────
   🔬 التحليل العلمي
   ────────────────────────────────────────── */
async function analyzeBeetle(file) {
    Swal.fire({
        title: 'جاري التحليل العلمي...',
        html: '<span style="color:#8ba3cc">يرجى الانتظار بينما يعمل مختبرنا الذكي</span>',
        allowOutsideClick: false,
        showConfirmButton: false,
        willOpen: () => Swal.showLoading()
    });

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await fetch(API_URL, { method: 'POST', body: formData });
        if (!response.ok) throw new Error('تعذر الاتصال بالمختبر الرقمي');

        const data = await response.json();
        currentData = data;
        Swal.close();
        renderResults(data);

        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'تم التحليل بنجاح ✅',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            background: '#111f38',
            color: '#f0f6ff'
        });

    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: '⚠️ فشل التحليل',
            html: `<span style="color:#8ba3cc">تأكد من اتصال السيرفر:<br><b style="color:#ff4b6e">${error.message}</b></span>`,
            confirmButtonText: 'حسناً',
            background: '#111f38',
            color: '#f0f6ff'
        });
    }
}

/* ──────────────────────────────────────────
   📊 عرض النتائج
   ────────────────────────────────────────── */
const FIELD_MAP = {
    commonName: { label: 'الاسم الشائع', icon: '🏷️' },
    scientificName: { label: 'الاسم العلمي', icon: '🔬', italic: true },
    kingdom: { label: 'المملكة', icon: '👑' },
    phylum: { label: 'الشعبة', icon: '🌿' },
    className: { label: 'الطائفة', icon: '🗂️' },
    order: { label: 'الرتبة', icon: '📐' },
    family: { label: 'الفصيلة', icon: '🧬' },
    genus: { label: 'الجنس', icon: '🔑' },
    species: { label: 'النوع (Species)', icon: '🌍', italic: true },
};

function renderResults(data) {
    // العنوان الرئيسي
    resCommonName.textContent = data.commonName || 'كائن حي';

    // شريط الثقة
    const confWrapper = document.getElementById('confidenceWrapper');
    const confFill = document.getElementById('confidenceFill');
    const confVal = document.getElementById('confidenceValue');
    if (data.confidence !== undefined && data.confidence !== null) {
        const pct = (data.confidence * 100).toFixed(1);
        confWrapper.style.display = 'flex';
        confVal.textContent = pct + '%';
        setTimeout(() => { confFill.style.width = pct + '%'; }, 100);
    } else {
        confWrapper.style.display = 'none';
    }

    // بطاقات التصنيف
    const grid = document.getElementById('taxonomyGrid');
    grid.innerHTML = '';
    Object.entries(FIELD_MAP).forEach(([key, meta]) => {
        if (!data[key]) return;
        const card = document.createElement('div');
        card.className = 'taxon-card';
        card.innerHTML = `
            <span class="taxon-label">${meta.icon} ${meta.label}</span>
            <span class="taxon-value${meta.italic ? ' italic' : ''}">${data[key]}</span>
        `;
        grid.appendChild(card);
    });

    // الملاحظات المخبرية
    const notesBox = document.getElementById('notesBox');
    const notesText = document.getElementById('notesText');
    if (data.notes) {
        notesText.textContent = data.notes;
        notesBox.style.display = 'flex';
    } else {
        notesBox.style.display = 'none';
    }

    // إظهار القسم
    resultSection.classList.remove('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ──────────────────────────────────────────
   💾 حفظ في localStorage
   ────────────────────────────────────────── */
function saveToHistory() {
    if (!currentData || alreadySaved) return;

    const record = {
        id: Date.now(),
        image: currentImageB64,
        data: currentData,
        savedAt: new Date().toLocaleString('ar-EG')
    };

    const history = getHistory();
    history.unshift(record);           // أضف في البداية
    localStorage.setItem('biolab-history', JSON.stringify(history));

    alreadySaved = true;
    saveBtn.classList.add('saved');
    saveBtn.innerHTML = `✅ تم الحفظ في السجل`;

    renderHistory();

    Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: 'تم الحفظ في السجل 📚',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        background: '#111f38',
        color: '#f0f6ff'
    });
}

/* ──────────────────────────────────────────
   🗂️ عرض السجل التاريخي
   ────────────────────────────────────────── */
function getHistory() {
    try {
        return JSON.parse(localStorage.getItem('biolab-history') || '[]');
    } catch {
        return [];
    }
}

function renderHistory() {
    const history = getHistory();
    const grid = document.getElementById('historyGrid');
    const emptyState = document.getElementById('emptyHistory');
    const clearBtn = document.getElementById('clearBtn');

    grid.innerHTML = '';

    if (history.length === 0) {
        grid.appendChild(emptyState);
        clearBtn.style.display = 'none';
        return;
    }

    clearBtn.style.display = 'flex';

    history.forEach((record, idx) => {
        const d = record.data || {};
        const card = document.createElement('div');
        card.className = 'history-card';
        card.style.animationDelay = `${idx * 0.07}s`;

        // بناء التاقات (kingdom, phylum, className)
        const tagKeys = ['kingdom', 'phylum', 'className'];
        const tags = tagKeys
            .filter(k => d[k])
            .map(k => `<span class="hcard-tag">${d[k]}</span>`)
            .join('');

        card.innerHTML = `
            ${record.image
                ? `<img class="hcard-img" src="${record.image}" alt="${d.commonName || ''}" loading="lazy">`
                : `<div class="hcard-img" style="display:flex;align-items:center;justify-content:center;font-size:2rem;">🔬</div>`
            }
            <div class="hcard-body">
                <div class="hcard-title">${d.commonName || 'كائن حي'}</div>
                <div class="hcard-scientific">${d.scientificName || ''}</div>
                <div class="hcard-tags">${tags}</div>
                <div class="hcard-footer">
                    <span class="hcard-date">📅 ${record.savedAt}</span>
                    <button class="hcard-delete" onclick="deleteRecord(${record.id})" title="حذف">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                            <path d="M10 11v6M14 11v6M9 6V4h6v2"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });
}

function deleteRecord(id) {
    let history = getHistory().filter(r => r.id !== id);
    localStorage.setItem('biolab-history', JSON.stringify(history));
    renderHistory();
}

function clearHistory() {
    Swal.fire({
        title: 'مسح كل السجل؟',
        text: 'لن تتمكن من الرجوع بعد الحذف',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'نعم، امسح الكل',
        cancelButtonText: 'إلغاء',
        confirmButtonColor: '#ff4b6e',
        background: '#111f38',
        color: '#f0f6ff'
    }).then(result => {
        if (result.isConfirmed) {
            localStorage.removeItem('biolab-history');
            renderHistory();
        }
    });
}

/* ──────────────────────────────────────────
🚀 تهيئة عند التحميل
   ────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
    renderHistory();
    renderSuggestedGallery();
});

// إذا كان DOM محمل بالفعل
if (document.readyState !== 'loading') {
    renderHistory();
    renderSuggestedGallery();
}

/* ──────────────────────────────────────────
   🖼️ مكتبة الصور المقترحة
   ────────────────────────────────────────── */
const suggestedImages = [
    { name: "قطة", url: "https://loremflickr.com/400/400/cat" },
    { name: "كلب", url: "https://loremflickr.com/400/400/dog" },
    { name: "فيل", url: "https://loremflickr.com/400/400/elephant" },
    { name: "أسد", url: "https://loremflickr.com/400/400/lion" },
    { name: "نمر", url: "https://loremflickr.com/400/400/tiger" },
    { name: "فراشة", url: "https://loremflickr.com/400/400/butterfly" },
    { name: "وردة", url: "https://loremflickr.com/400/400/rose" },
    { name: "تباع الشمس", url: "https://loremflickr.com/400/400/sunflower" },
    { name: "صبار", url: "https://loremflickr.com/400/400/cactus" },
    { name: "سلحفاة", url: "https://loremflickr.com/400/400/turtle" },
    { name: "بطريق", url: "https://loremflickr.com/400/400/penguin" },
    { name: "دلفين", url: "https://loremflickr.com/400/400/dolphin" }
];

function renderSuggestedGallery() {
    const gallery = document.getElementById('suggestedGallery');
    if (!gallery) return;

    suggestedImages.forEach((img, idx) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.animation = `fadeSlideUp 0.5s ease ${idx * 0.05}s both`;
        item.innerHTML = `
            <img src="${img.url}" alt="${img.name}" loading="lazy" crossorigin="anonymous">
            <div class="gallery-overlay">
                <span>تحليل 🔬</span>
            </div>
        `;
        item.addEventListener('click', () => analyzeSuggestedImage(img.url, img.name));
        gallery.appendChild(item);
    });
}

async function analyzeSuggestedImage(url, name) {
    try {
        Swal.fire({
            title: 'جاري تجهيز الصورة...',
            html: '<span style="color:#8ba3cc">يرجى الانتظار</span>',
            allowOutsideClick: false,
            showConfirmButton: false,
            willOpen: () => Swal.showLoading()
        });

        // لجلب الصورة بـ CORS نحتاج لإضافة معلمة لتجنب تحذيرات المتصفح أو نقوم بتحويلها كملف
        // لتجنب مشاكل CORS مع unsplash، يفضل استخدام fetch إذا كان يسمح أو نحمل الصورة إلى Canvas
        const res = await fetch(url);
        const blob = await res.blob();
        const file = new File([blob], "suggested_image.jpg", { type: "image/jpeg" });

        // إظهارها في المعاينة
        const reader = new FileReader();
        reader.onload = (ev) => {
            currentImageB64 = ev.target.result;
            previewImg.src = currentImageB64;
            uploadZone.style.display = 'none';
            imagePreview.classList.remove('hidden');

            resultSection.classList.add('hidden');
            currentData = null;
            alreadySaved = false;
            saveBtn.classList.remove('saved');
            saveBtn.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
                    <polyline points="17 21 17 13 7 13 7 21"/>
                    <polyline points="7 3 7 8 15 8"/>
                </svg>
                حفظ في سجل التحليلات
            `;
        };
        reader.readAsDataURL(file);

        // التمرير لمكان التحليل
        document.querySelector('.analyzer-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
        await analyzeBeetle(file);
    } catch (error) {
        // بسبب سياسة CORS، قد يفشل Fetch المباشر للصور الخارجية وتحويلها لـ Blob، 
        // سنستخدم حل بديل إذا حدث خطأ:
        Swal.fire({
            icon: 'error',
            title: 'تنبيه اتصال',
            text: 'يجب تنزيل الصورة أولاً أو توفير خادم تدفق. جرب رفع الصورة يدوياً.',
            background: '#111f38',
            color: '#f0f6ff'
        });
    }
}