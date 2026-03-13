const gorevInput = document.getElementById('gorev-input');
const tarihInput = document.getElementById('tarih-input');
const aktifListe = document.getElementById('aktif-liste');
const tamamlananListe = document.getElementById('tamamlanan-liste');
const anaEkran = document.getElementById('ana-ekran');
const siirMetni = document.getElementById('siir-metni');

let sesliAsistan = true;

const sozler = [
    "Umut, hiç bitmeyen bir bahar mevsimidir. 🌸",
    "Bugün seni gülümsetecek bir şey mutlaka olacak. ✨",
    "Küçük adımlar, seni hayallerine ulaştırır. 🚀",
    "Kalbindeki neşeyi defterine yansıt. 🌻"
];

// Arka plan için ferah renk havuzu
const ferahRenkler = [
    "linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)",
    "linear-gradient(120deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(120deg, #84fab0 0%, #8fd3f4 100%)",
    "linear-gradient(120deg, #f6d365 0%, #fda085 100%)"
];

// Geçmiş Tarih Bloğu
tarihInput.setAttribute('min', new Date().toISOString().split('T')[0]);

window.addEventListener('keydown', (e) => {
    if (e.key === "Enter") islemYap();
});

document.getElementById('ekle-btn').addEventListener('click', islemYap);

function islemYap() {
    const gorev = gorevInput.value.trim();
    const tarih = tarihInput.value;

    if (!gorev || !tarih) {
        seslendir("Lütfen günlüğü eksik bırakma.");
        return;
    }

    // Enter'a basınca iç açıcı renk değişimi
    anaEkran.style.background = ferahRenkler[Math.floor(Math.random() * ferahRenkler.length)];
    
    // Rastgele yeni söz
    siirMetni.innerText = sozler[Math.floor(Math.random() * sozler.length)];

    gorevEkle(gorev, tarih);
    seslendir(`${gorev} not edildi.`);

    gorevInput.value = "";
    tarihInput.value = "";
    gorevInput.focus();
}

function gorevEkle(metin, tarih) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>✨ ${metin} <small style="font-size:12px; opacity:0.5">(${tarih})</small></span>
        <i class="fa-solid fa-leaf sil-btn" style="color:#06d6a0; cursor:pointer;"></i>
    `;

    li.addEventListener('click', (e) => {
        if (e.target.classList.contains('sil-btn')) {
            li.remove();
            seslendir("Not silindi.");
        } else {
            li.classList.toggle('yapildi');
            if (li.classList.contains('yapildi')) {
                tamamlananListe.appendChild(li);
                seslendir("Harikasın!");
            } else {
                aktifListe.appendChild(li);
            }
        }
    });

    aktifListe.prepend(li);
}

function seslendir(metin) {
    if (!sesliAsistan) return;
    window.speechSynthesis.cancel();
    const ut = new SpeechSynthesisUtterance(metin);
    ut.lang = 'tr-TR';
    window.speechSynthesis.speak(ut);
}

document.getElementById('ses-btn').addEventListener('click', function() {
    sesliAsistan = !sesliAsistan;
    this.innerText = sesliAsistan ? "🔊 Sesli Rehber: Aktif" : "🔇 Sesli Rehber: Kapalı";
});