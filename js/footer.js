document.addEventListener("DOMContentLoaded", function() {
    if (document.querySelector('.site-footer')) return;

    const footerHTML = `
    <footer class="site-footer">
        <p>
            <span class="footer-icon">⚗️</span>
            المختبر العلمي الافتراضي &nbsp;·&nbsp; الأستاذ <strong>أحمد أبو مسعود</strong>
        </p>
    </footer>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
});
