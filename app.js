class ToumanyCalculator {
    constructor() { this.clear(); }
    clear() { this.cur = '0'; this.prev = ''; this.op = undefined; this.update(); }
    delete() { this.cur = this.cur.toString().slice(0, -1) || '0'; this.update(); }
    addNumber(n) { this.cur = (this.cur === '0') ? n : this.cur + n; this.update(); }
    chooseOp(op) { if(this.cur==='')return; if(this.prev!=='')this.compute(); this.op=op; this.prev=this.cur; this.cur=''; this.update(); }
    compute() {
        let res; const p=parseFloat(this.prev), c=parseFloat(this.cur);
        if(isNaN(p)||isNaN(c)) return;
        switch(this.op){ case '+':res=p+c;break; case '-':res=p-c;break; case '*':res=p*c;break; case '/':res=p/c;break; default:return; }
        this.cur=res; this.op=undefined; this.prev=''; this.update();
    }
    update() { document.getElementById('current-operand').innerText = this.cur; document.getElementById('previous-operand').innerText = this.op ? this.prev+this.op : ''; }
}

class EliteEducation {
    constructor() {
        this.score = parseInt(localStorage.getItem('nic_xp')) || 0;
        this.db = {
            maths: [
                {q: "Racine de 144 ?", a: "12"}, {q: "2x + 5 = 15. x=?", a: "5"}, {q: "15% de 200 ?", a: "30"}
            ],
            culture: [
                {q: "Indépendance Sénégal ?", a: "1960"}, {q: "Auteur 'L'Enfant Noir' ?", a: "Camara Laye"}, {q: "Capitale Mali ?", a: "Bamako"}
            ]
        };
    }
    start() {
        const m = document.getElementById('select-matiere').value;
        this.curr = this.db[m][Math.floor(Math.random()*this.db[m].length)];
        document.getElementById('q-display').innerText = this.curr.q;
    }
    check() {
        const val = document.getElementById('elite-input').value;
        if(val.toLowerCase() === this.curr.a.toLowerCase()) {
            this.score += 100; localStorage.setItem('nic_xp', this.score);
            alert("✅ Bravo ! +100 XP"); this.start();
        } else { alert("❌ Faux ! C'était: " + this.curr.a); }
        document.getElementById('elite-input').value = "";
    }
}

const calc = new ToumanyCalculator();
const elite = new EliteEducation();
const CODE_SECRET = "TOP_CALCUL_2024";

function contactWhatsApp() { window.open("https://wa.me/221783113787?text=Je_veux_le_code_Elite", "_blank"); }
function verifierCode() { if(document.getElementById('promo-code-input').value.toUpperCase() === CODE_SECRET) unlock(); }
function unlock() {
    localStorage.setItem('nic_premium', 'true');
    document.getElementById('locked-ui').classList.add('hidden');
    const ui = document.getElementById('game-ui');
    ui.classList.remove('hidden');
    ui.innerHTML = `
        <div class="premium-badge">STUDIO ÉDUCATIF ACTIVÉ</div>
        <select id="select-matiere" onchange="elite.start()" style="width:100%; padding:10px; background:#161b22; color:white; border-radius:5px; margin-bottom:10px;">
            <option value="maths">Mathématiques</option>
            <option value="culture">Culture Générale</option>
        </select>
        <div class="quiz-box">
            <div id="q-display" style="margin-bottom:10px; font-weight:bold;"></div>
            <input type="text" id="elite-input" placeholder="Réponse..." style="width:80%; padding:10px; background:#0d1117; color:white; border:1px solid var(--premium); text-align:center;">
            <button onclick="elite.check()" style="background:var(--premium); margin-top:10px; width:80%;">VALIDER</button>
        </div>
    `;
    elite.start();
}
if(localStorage.getItem('nic_premium')==='true') window.onload = unlock;

// Service Worker Registration
if ('serviceWorker' in navigator) { navigator.serviceWorker.register('sw.js'); }
