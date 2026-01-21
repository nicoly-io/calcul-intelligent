class NicolyApp {
    constructor() {
        this.xp = parseInt(localStorage.getItem('nic_xp')) || 0;
        this.streak = 0;
        this.vip = localStorage.getItem('nic_vip') === 'true';
        this.history = JSON.parse(localStorage.getItem('nic_hist')) || [];
        
        this.db = this.initDB();
        this.init();
    }

    initDB() {
        const subjects = ['Maths', 'Physique', 'SVT', 'Français', 'Anglais', 'H-G'];
        let data = {};
        subjects.forEach(s => {
            data[s] = Array.from({length: 60}, (_, i) => ({
                q: `Question ${s} n°${i+1}`,
                options: ["Option Correcte", "Faux 1", "Faux 2", "Faux 3"],
                ans: 0,
                steps: [
                    "Énoncé : Analyse de la problématique.",
                    "Variables : Substitution des données fournies.",
                    "Calcul : Résolution mathématique intermédiaire.",
                    "Conclusion : Résultat final vérifié."
                ]
            }));
        });
        return data;
    }

    init() {
        this.setMode('sci');
        this.updateStats();
        if(this.vip) document.getElementById('pay-gate').style.display = 'none';
        document.getElementById('quiz-lobby').classList.toggle('hidden', !this.vip);
    }

    switchTab(t) {
        document.querySelectorAll('.tab-page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`tab-${t}`).classList.add('active');
        event.target.classList.add('active');
    }

    // --- CALCULATRICE COMPLEXE ---
    setMode(m) {
        const grid = document.getElementById('numpad');
        const keys = (m === 'sci') ? 
            ['C','(',' )','/','sin','cos','tan','log','7','8','9','*','4','5','6','-','1','2','3','+','0','.','^','='] :
            ['C','/','*','-','7','8','9','+','4','5','6','=','1','2','3','0'];
        grid.innerHTML = keys.map(k => `<button onclick="app.press('${k}')">${k}</button>`).join('');
    }

    press(k) {
        const d = document.getElementById('input-val');
        if(k === 'C') d.innerText = '0';
        else if(k === '=') this.compute();
        else d.innerText === '0' ? d.innerText = k : d.innerText += k;
    }

    compute() {
        const val = document.getElementById('input-val').innerText;
        try {
            // Algebrite gère les calculs complexes (ex: simplify, d(x^2)/dx)
            let res = Algebrite.run(val).toString();
            this.saveHist(val, res);
            document.getElementById('input-val').innerText = res;
        } catch { document.getElementById('input-val').innerText = "Erreur"; }
    }

    // --- HISTORIQUE & SOLVER ---
    saveHist(q, a) {
        const entry = { q, a, steps: [
            `Formule : Analyse de ${q}`,
            `Variables : Identification des éléments symboliques.`,
            `Calcul : Traitement par le moteur Algebrite.`,
            `Résultat : ${a}`
        ]};
        this.history.unshift(entry);
        localStorage.setItem('nic_hist', JSON.stringify(this.history.slice(0, 20)));
        this.renderHist();
    }

    renderHist() {
        const c = document.getElementById('hist-container');
        c.innerHTML = this.history.map((h, i) => `
            <div class="step-card">
                <div class="step-head" onclick="this.nextElementSibling.classList.toggle('show')">${h.q} = ${h.a}</div>
                <div class="step-body">
                    ${h.steps.map(s => `<p>${s}</p>`).join('')}
                </div>
            </div>
        `).join('');
    }

    // --- LOGIQUE JEUX ---
    unlockVIP() {
        if(document.getElementById('code-entry').value === "NICOLY200") {
            localStorage.setItem('nic_vip', 'true');
            location.reload();
        }
    }

    updateStats() {
        document.getElementById('xp-val').innerText = this.xp;
        document.getElementById('streak-val').innerText = this.streak;
    }
}
const app = new NicolyApp();
