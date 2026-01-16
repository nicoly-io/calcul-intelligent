class NicolyApp {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('nic_history')) || [];
        this.score = parseInt(localStorage.getItem('nic_xp')) || 0;
        this.currentQ = {};
        this.db = {
            maths: [
                {q: "Racine de 169 ?", a: "13", niv: "Moyen"},
                {q: "Résoudre : 3x + 9 = 30", a: "7", niv: "Moyen"},
                {q: "15% de 2000 ?", a: "300", niv: "Facile"},
                {q: "Surface cercle rayon 7 (Pi=22/7) ?", a: "154", niv: "Difficile"},
                {q: "Périmètre carré côté 12m ?", a: "48", niv: "Facile"},
                {q: "Dérivée de x^2 ?", a: "2x", niv: "Difficile"},
                {q: "Factorielle de 4 ?", a: "24", niv: "Difficile"},
                {q: "Volume cube de 5cm ?", a: "125", niv: "Moyen"}
                // Ajoute tes centaines de questions ici...
            ],
            histoire_geo: [
                {q: "Indépendance du Sénégal ?", a: "1960", niv: "Facile"},
                {q: "Qui a résisté au Cayor ?", a: "Lat Dior", niv: "Moyen"},
                {q: "Année Conférence de Berlin ?", a: "1884", niv: "Difficile"},
                {q: "Capitale du Nigéria ?", a: "Abuja", niv: "Difficile"},
                {q: "Hymne national par ?", a: "Senghor", niv: "Moyen"},
                {q: "Plus long fleuve d'Afrique ?", a: "Nil", niv: "Facile"},
                {q: "Capitale du Mali ?", a: "Bamako", niv: "Facile"},
                {q: "Fondateur Empire du Mali ?", a: "Soundiata Keita", niv: "Moyen"}
                // Ajoute tes centaines de questions ici...
            ],
            sciences: [
                {q: "Symbole de l'Or ?", a: "Au", niv: "Moyen"},
                {q: "H2O est la formule de ?", a: "Eau", niv: "Facile"},
                {q: "Vitesse lumière (km/s) ?", a: "300000", niv: "Difficile"},
                {q: "U = RI est la loi de ?", a: "Ohm", niv: "Moyen"},
                {q: "Planète la plus rouge ?", a: "Mars", niv: "Facile"},
                {q: "Passage solide à liquide ?", a: "Fusion", niv: "Moyen"}
                // Ajoute tes centaines de questions ici...
            ]
        };
        this.updateHistory();
    }

    // CALCULATRICE SCIENTIFIQUE
    doCalc() {
        const input = document.getElementById('free-input');
        try {
            // Transformation des fonctions pour le moteur JS (ex: sin -> Math.sin)
            let raw = input.value.toLowerCase().replace('x', '*');
            let cooked = raw.replace(/sin|cos|tan|sqrt|log|exp|pow|pi/g, (m) => `Math.${m}`);
            const res = eval(cooked);
            this.history.push(`${input.value} = ${res}`);
            if(this.history.length > 5) this.history.shift();
            localStorage.setItem('nic_history', JSON.stringify(this.history));
            this.updateHistory();
            input.value = res;
        } catch(e) { alert("Calcul invalide"); }
    }

    updateHistory() {
        const box = document.getElementById('history-box');
        if(box) box.innerHTML = this.history.join('<br>');
    }

    // QUIZ ÉDUCATIF
    getQuiz() {
        const m = document.getElementById('sel-mat').value;
        const n = document.getElementById('sel-niv').value;
        let pool = this.db[m].filter(q => q.niv === n);
        if(pool.length === 0) pool = this.db[m];
        this.currentQ = pool[Math.floor(Math.random() * pool.length)];
        const disp = document.getElementById('q-text');
        disp.classList.remove('win-anim');
        disp.innerHTML = `<small style="color:var(--accent)">[${m.toUpperCase()}]</small><br>${this.currentQ.q}`;
    }

    checkQuiz() {
        const user = document.getElementById('q-input').value.trim().toLowerCase();
        const disp = document.getElementById('q-text');
        if(user === this.currentQ.a.toLowerCase()) {
            this.score += 100;
            localStorage.setItem('nic_xp', this.score);
            document.getElementById('xp-count').innerText = this.score;
            disp.innerHTML = "<span style='color:var(--gold)'>🌟 BRAVO ! +100 XP 🌟</span>";
            disp.classList.add('win-anim');
            setTimeout(() => this.getQuiz(), 1500);
        } else {
            disp.innerHTML = `<span style='color:var(--error)'>❌ RÉPONSE : ${this.currentQ.a}</span>`;
            setTimeout(() => this.getQuiz(), 2000);
        }
        document.getElementById('q-input').value = "";
    }
}

const app = new NicolyApp();

// ACTIVATION & PAYPAL
function verifierActivation() {
    if(document.getElementById('code-activ').value.toUpperCase() === "TOP_CALCUL_2024") {
        localStorage.setItem('nic_vip', 'true');
        location.reload();
    } else { alert("Code incorrect"); }
}

if (document.getElementById('paypal-button-container')) {
    paypal.Buttons({
        createOrder: (data, actions) => actions.order.create({ purchase_units: [{ amount: { value: '0.65' } }] }),
        onApprove: (data, actions) => actions.order.capture().then(() => {
            localStorage.setItem('nic_vip', 'true');
            location.reload();
        })
    }).render('#paypal-button-container');
}

function loadEliteUI() {
    document.getElementById('elite-zone').innerHTML = `
        <div style="color:var(--gold); font-weight:bold; margin-bottom:10px;">🏆 SCORE : <span id="xp-count">${app.score}</span> XP</div>
        <div style="display:flex; gap:5px; margin-bottom:15px;">
            <select id="sel-mat" onchange="app.getQuiz()" style="flex:1; background:#21262d; color:white; padding:10px; border-radius:8px; border:none;">
                <option value="maths">MATHS</option>
                <option value="histoire_geo">HISTOIRE-GÉO</option>
                <option value="sciences">SVT-PC</option>
            </select>
            <select id="sel-niv" onchange="app.getQuiz()" style="flex:1; background:#21262d; color:white; padding:10px; border-radius:8px; border:none;">
                <option value="Facile">CFEE</option>
                <option value="Moyen">BFEM</option>
                <option value="Difficile">BAC</option>
            </select>
        </div>
        <div class="quiz-box">
            <div id="q-text" style="min-height:70px; font-weight:bold;"></div>
            <input type="text" id="q-input" placeholder="Réponse..." style="width:100%; padding:12px; margin:15px 0; background:#0d1117; color:white; border:1px solid var(--accent); border-radius:8px; text-align:center;">
            <button onclick="app.checkQuiz()" style="width:100%; background:var(--accent);">VALIDER</button>
        </div>
    `;
    app.getQuiz();
}

window.onload = () => { if(localStorage.getItem('nic_vip') === 'true') loadEliteUI(); };
