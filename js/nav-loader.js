/* ============================================================
   🧭 nav-loader.js — شريط التنقل الموحد (DRY)
   يُحدد تلقائياً هل الصفحة جذر أم داخل مجلد pages/
   ============================================================ */
(function () {
    /* --- تحديد المسار النسبي للجذر --- */
    const isInPages = window.location.pathname.includes('/pages/');
    const root = isInPages ? '../' : './';

    /* --- الروابط المختلفة بين الصفحة الرئيسية والداخلية --- */
    const navLinks = isInPages
        ? `<a href="${root}index.html" class="nav-link">الرئيسية</a>
           <a href="about.html" class="nav-link btn-primary">ماذا عن مختبرنا</a>`
        : `<a href="pages/about.html" class="nav-link">ماذا عن مختبرنا</a>
           <a href="#modules-sec" class="nav-link btn-primary">الوحدات العلمية</a>`;

    /* --- بناء HTML للهيدر --- */
    const navHTML = `
        <nav class="top-nav" id="shared-nav">
            <a href="${root}index.html" class="nav-brand">المختبر العلمي الافتراضي</a>
            <div class="nav-links">
                ${navLinks}
            </div>
        </nav>`;

    /* --- حقن الهيدر في بداية الـ body --- */
    document.body.insertAdjacentHTML('afterbegin', navHTML);

    /* --- تمييز الرابط النشط تلقائياً --- */
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('#shared-nav .nav-link').forEach(link => {
        const href = link.getAttribute('href') || '';
        if (href.includes(currentPage) && currentPage !== 'index.html') {
            link.classList.add('active');
        }
    });
})();
