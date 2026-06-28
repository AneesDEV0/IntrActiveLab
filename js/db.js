/* ============================================================
   🗄️ db.js — قاعدة بيانات IndexedDB للسجل التحليلي
   تستبدل localStorage وتتعامل مع الصور الكبيرة بلا حدود
   ============================================================ */

const BioLabDB = (() => {
    const DB_NAME    = 'biolab-db';
    const DB_VERSION = 1;
    const STORE_NAME = 'analyses';

    let _db = null;

    /* --- فتح / إنشاء قاعدة البيانات --- */
    function openDB() {
        return new Promise((resolve, reject) => {
            if (_db) return resolve(_db);  // cached

            const req = indexedDB.open(DB_NAME, DB_VERSION);

            req.onupgradeneeded = (e) => {
                const db    = e.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    store.createIndex('savedAt', 'savedAt', { unique: false });
                }
            };

            req.onsuccess = (e) => { _db = e.target.result; resolve(_db); };
            req.onerror   = (e) => reject(e.target.error);
        });
    }

    /* --- حفظ تحليل جديد --- */
    async function save(record) {
        const db  = await openDB();
        return new Promise((resolve, reject) => {
            const tx  = db.transaction(STORE_NAME, 'readwrite');
            const req = tx.objectStore(STORE_NAME).put(record);
            req.onsuccess = () => resolve(req.result);
            req.onerror   = () => reject(req.error);
        });
    }

    /* --- جلب كل السجلات مرتبة من الأحدث للأقدم --- */
    async function getAll() {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx      = db.transaction(STORE_NAME, 'readonly');
            const req     = tx.objectStore(STORE_NAME).getAll();
            req.onsuccess = () => resolve(req.result.sort((a, b) => b.id - a.id));
            req.onerror   = () => reject(req.error);
        });
    }

    /* --- حذف سجل معين --- */
    async function remove(id) {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx  = db.transaction(STORE_NAME, 'readwrite');
            const req = tx.objectStore(STORE_NAME).delete(id);
            req.onsuccess = () => resolve();
            req.onerror   = () => reject(req.error);
        });
    }

    /* --- مسح كل السجلات --- */
    async function clear() {
        const db = await openDB();
        return new Promise((resolve, reject) => {
            const tx  = db.transaction(STORE_NAME, 'readwrite');
            const req = tx.objectStore(STORE_NAME).clear();
            req.onsuccess = () => resolve();
            req.onerror   = () => reject(req.error);
        });
    }

    /* --- ترحيل البيانات القديمة من localStorage إن وجدت --- */
    async function migrateFromLocalStorage() {
        const OLD_KEY = 'biolab-history';
        const raw = localStorage.getItem(OLD_KEY);
        if (!raw) return;
        try {
            const oldData = JSON.parse(raw);
            if (Array.isArray(oldData) && oldData.length > 0) {
                for (const rec of oldData) { await save(rec); }
                localStorage.removeItem(OLD_KEY);
                console.info(`[BioLabDB] ✅ رُحِّل ${oldData.length} سجل من localStorage إلى IndexedDB`);
            }
        } catch (err) {
            console.warn('[BioLabDB] فشل الترحيل:', err);
        }
    }

    return { save, getAll, remove, clear, migrateFromLocalStorage };
})();
