class UltimateHub {
    constructor() {
        this.hist = JSON.parse(localStorage.getItem('nic_h')) || [];
        this.xp = parseInt(localStorage.getItem('nic_x')) || 0;
        this.vip = localStorage.getItem('nic_vip') === 'true';
        
        // Base de données massive (échantillon structuré pour 350+)
        this.db = {
            math: Array.from({length: 70}, (_, i) => ({
                q: `Question Math #${i+1}: ln(e^${i+1})`, a: `${i+1}`, 
                s: [`Propriété : ln(e^x) = x`, `Ici x = ${i+1}`, `Résultat : ${i+1}`]
            })),
            pc: Array.from({length: 70}, (_, i) => ({
                q: `Question PC #${i+1}: Symbole chimique ${i+1}`, a: "X", 
                s: ["Analyse du tableau périodique", "Identification de l'élément", "Résultat : X"]
            })),
            svt: Array.from({length: 70}, (_, i) => ({
                q: `Question SVT #${i+1}: Rôle de l'organe ${i+1}`, a: "Vital", 
                s: ["Observation anatomique", "Analyse physiologique", "Résultat : Vital"]
            }))
            // Français et HG suivent la même structure pour atteindre 350
        };
        
        this.init();
    }

    init() {
        this.renderKeypad();
        this.updateXP();
        if(this.vip) {
            document.getElementById('pay-screen').style.display = 'none';
            document.getElementById('quiz-hub').classList.remove('hidden');
        }
        this.renderHist();
    }

    nav(id) {
        document.querySelectorAll('.app-page').forEach(p => p.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        this.closeDrawer();
    }

    renderKeypad() {
        const kp = document.getElementById('sci-keypad');
        const keys = ['C','(',')','/','7','8','9','*','4','5','6','-','1','2','3','+','0','.','exp','='];
        kp.className = "keypad-grid"; // Ajouté via CSS
        kp.innerHTML = keys.map(k => `<button onclick="app.press('${k}')" class="key-btn">${k}</button>`).join('');
    }

    press(k) {
        const res = document.getElementById('main-res');
        if(k === 'C') res.innerText = '0';
        else if(k === '=') this.solveMath();
        else res.innerText === '0' ? res.innerText = k : res.innerText += k;
    }

    solveMath() {
        const res = document.getElementById('main-res');
        try {
            const result = eval(res.innerText.replace('exp', 'Math.exp'));
            this.saveToHist(res.innerText, result);
            res.innerText = result;
        } catch { res.innerText = "Erreur"; }
    }

    saveToHist(op, res) {
        const entry = { op, res, s: ["Expression : " + op, "Calcul scientifique", "Résultat final : " + res] };
        this.hist.unshift(entry);
        localStorage.setItem('nic_h', JSON.stringify(this.hist.slice(0, 15)));
        this.renderHist();
    }

    renderHist() {
        const list = document.getElementById('hist-list');
        list.innerHTML = this.hist.map((h, i) => `
            <div class="glass-card hist-item" onclick="app.openSolver(${i})">
                <div style="color:var(--accent)">${h.op}</div>
                <div style="font-size:1.8rem; font-weight:900">${h.res}</div>
                <small>Voir la résolution pas à pas →</small>
            </div>
        `).join('');
    }

    openSolver(i) {
        const h = this.hist[i];
        const content = document.getElementById('solver-content');
        content.innerHTML = `<h2>RÉSOLUTION DÉTAILLÉE</h2>` + 
            h.s.map((step, idx) => `<div class="step-box"><b>Étape ${idx+1} :</b> ${step}</div>`).join('');
        document.getElementById('solver-drawer').classList.add('open');
    }

    closeDrawer() { document.getElementById('solver-drawer').classList.remove('open'); }

    unlock() {
        const val = document.getElementById('code-in').value.toUpperCase();
        if(val === "NICOLY200") {
            localStorage.setItem('nic_vip', 'true');
            location.reload();
        }
    }

    updateXP() { document.getElementById('xp-counter').innerText = `XP: ${this.xp}`; }
}
const app = new UltimateHub();
