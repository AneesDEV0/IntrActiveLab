document.addEventListener("DOMContentLoaded", function() {
    // الحصول على السنة الحالية تلقائياً
    const currentYear = new Date().getFullYear();
    
    const footerHTML = `
    <footer class="simple-footer">
        <div class="footer-content">
            <p>جميع الحقوق محفوظة © ${currentYear} لدى <span>أحمد كمال أبو مسعود</span></p>
        </div>
    </footer>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);
});