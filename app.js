class NicolyHub {
    constructor() {
        this.xp = 0;
        this.history = [];
        this.vip = localStorage.getItem('nic_vip') === 'true';
        this.db = this.loadDB();
        this.init();
    }

    loadDB() {
        const subs = ['Maths', 'Physique', 'SVT', 'Français', 'Anglais', 'H-G'];
        let data = {};
        subs.forEach(s => {
            data[s] = Array.from({length: 55}, (_, i) => ({
                q: `Exercice ${s} #${i+1}: Quelle est la règle fondamentale?`,
                opt: ["Option A", "Option B", "Option C", "Option D"],
                ans: 0,
                steps: ["1. Lire l'énoncé", "2. Appliquer la formule", "3. Vérifier l'unité", "4. Conclure."]
            }));
        });
        return data;
    }

    init() {
        this.setCalcMode('sci');
        if(this.vip) {
            document.getElementById('pay-screen').classList.add('hidden');
            document.getElementById('lobby').classList.remove('hidden');
        }
    }

    changeTab(tabId, btn) {
        document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.bottom-nav button').forEach(b => b.classList.remove('active'));
        document.getElementById(`tab-${tabId}`).classList.add('active');
        btn.classList.add('active');
    }

    // --- CALCULATRICE ---
    setCalcMode(m) {
        const pad = document.getElementById('pad');
        const keys = ['C','(',' )','/','7','8','9','*','4','5','6','-','1','2','3','+','0','.','sin','='];
        pad.innerHTML = keys.map(k => `<button onclick="app.press('${k}')">${k}</button>`).join('');
        document.getElementById('drop-menu').classList.add('hidden');
    }

    press(k) {
        const d = document.getElementById('main-display');
        if(k === 'C') d.innerText = '0';
        else if(k === '=') this.calculate();
        else d.innerText === '0' ? d.innerText = k : d.innerText += k;
    }

    calculate() {
        const d = document.getElementById('main-display');
        try {
            // Utilisation d'Algebrite pour le calcul complexe
            let res = Algebrite.run(d.innerText).toString();
            this.addHist(d.innerText, res);
            d.innerText = res;
        } catch { d.innerText = "Erreur"; }
    }

    addHist(q, a) {
        const entry = { q, a, steps: [`Calcul de ${q}`, "Analyse symbolique", `Résultat: ${a}`] };
        this.history.unshift(entry);
        this.renderHist();
    }

    renderHist() {
        const list = document.getElementById('hist-list');
        list.innerHTML = this.history.map(h => `
            <div style="background:var(--glass); padding:15px; margin-bottom:10px; border-radius:15px;">
                <b>${h.q} = ${h.a}</b>
                <p style="font-size:0.8rem; color:#888;">${h.steps.join(' → ')}</p>
            </div>
        `).join('');
    }

    // --- QUIZ ---
    startQuiz(sub) {
        const q = this.db[sub][Math.floor(Math.random() * 50)];
        document.getElementById('q-text').innerText = q.q;
        document.getElementById('q-options').innerHTML = q.opt.map((o, i) => 
            `<button onclick="app.answer(${i})" style="width:100%; margin:5px; padding:15px; border-radius:10px; border:none; background:#222; color:white;">${o}</button>`
        ).join('');
        document.getElementById('q-modal').classList.remove('hidden');
    }

    answer(i) {
        if(i === 0) { alert("Correct ! +50 XP"); this.xp += 50; }
        else { alert("Faux ! Étudiez la solution."); }
        document.getElementById('xp-count').innerText = this.xp;
        this.closeQuiz();
    }

    closeQuiz() { document.getElementById('q-modal').classList.add('hidden'); }
    toggleMenu() { document.getElementById('drop-menu').classList.toggle('hidden'); }
    activateVIP() { 
        if(document.getElementById('vip-key').value === "NICOLY200") {
            localStorage.setItem('nic_vip', 'true'); location.reload(); 
        } 
    }
}
const app = new NicolyHub();
