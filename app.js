class NicolyUltimate {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('nic_hist')) || [];
        this.score = parseInt(localStorage.getItem('nic_xp')) || 0;
        this.db = {
            math: [
                {q: "5! (Factorielle 5)", a: "120", niv: "facile"}, {q: "ln(e)", a: "1", niv: "facile"},
                {q: "Dérivée de 3x²", a: "6x", niv: "moyen"}, {q: "cos(pi)", a: "-1", niv: "difficile"},
                {q: "Racine de 144", a: "12", niv: "facile"}, {q: "log10(1000)", a: "3", niv: "moyen"}
                // + 44 questions mathématiques...
            ],
            fr: [
                {q: "Auteur de 'L'Aventure ambiguë' ?", a: "Cheikh Hamidou Kane", niv: "moyen"},
                {q: "Auteur de 'Coup de pilon' ?", a: "David Diop", niv: "facile"},
                {q: "Genre de 'Sous l'orage' ?", a: "Roman", niv: "facile"}
                // + 47 questions français...
            ],
            ang: [
                {q: "Past of 'Buy' ?", a: "Bought", niv: "moyen"},
                {q: "Opposite of 'Weak' ?", a: "Strong", niv: "facile"}
                // + 48 questions anglais...
            ],
            hg: [
                {q: "Indépendance Sénégal ?", a: "1960", niv: "facile"},
                {q: "Capitale du Nigéria ?", a: "Abuja", niv: "difficile"}
                // + 48 questions HG...
            ],
            pc: [
                {q: "Loi d'Ohm ?", a: "U=RI", niv: "facile"},
                {q: "Symbole de l'Argent ?", a: "Ag", niv: "moyen"}
                // + 48 questions PC...
            ],
            philo: [
                {q: "Auteur de 'Le Discours de la Méthode' ?", a: "Descartes", niv: "moyen"},
                {q: "L'homme est un animal politique, qui l'a dit ?", a: "Aristote", niv: "moyen"}
                // + 48 questions Philo...
            ]
        };
        this.init();
    }

    init() {
        document.getElementById('xp-badge').innerText = this.score + " XP";
        this.updateHistoryUI();
        this.checkPremium();
    }

    // CALCULATRICE
    addText(t) { document.getElementById('calc-input').value += t; }
    clear() { document.getElementById('calc-input').value = ""; }

    solveAll() {
        const val = document.getElementById('calc-input').value;
        const step = document.getElementById('step-display');
        const resDisp = document.getElementById('res-display');
        
        try {
            step.innerText = "Étape 1 : Analyse des fonctions... Étape 2 : Calcul prioritaire...";
            let formatted = val.replace(/ln/g, 'Math.log').replace(/exp/g, 'Math.exp')
                               .replace(/pi/g, 'Math.PI').replace(/sqrt/g, 'Math.sqrt');
            
            // Factorielle simplifiée
            if(formatted.includes('!')) {
                let n = parseInt(formatted);
                let r = 1; for(let i=1;i<=n;i++) r*=i;
                formatted = r;
            }

            const result = eval(formatted);
            resDisp.innerText = result;
            this.history.unshift(`${val} = ${result}`);
            if(this.history.length > 5) this.history.pop();
            this.updateHistoryUI();
        } catch(e) { resDisp.innerText = "Erreur"; }
    }

    updateHistoryUI() {
        const container = document.getElementById('history-list');
        if(this.history.length === 0) return;
        container.innerHTML = this.history.map(h => `<div class="history-item">${h}</div>`).join('');
        localStorage.setItem('nic_hist', JSON.stringify(this.history));
    }

    // JEUX
    nextQ() {
        const sub = document.getElementById('sel-subject').value;
        const diff = document.getElementById('sel-diff').value;
        const pool = this.db[sub].filter(q => q.niv === diff);
        this.currentQ = pool[Math.floor(Math.random() * pool.length)];
        document.getElementById('q-text').innerText = this.currentQ.q;
        document.getElementById('q-box').classList.remove('win-anim');
    }

    checkAnswer() {
        const ans = document.getElementById('q-answer').value.trim().toLowerCase();
        if(ans === this.currentQ.a.toLowerCase()) {
            this.score += 100;
            document.getElementById('xp-badge').innerText = this.score + " XP";
            document.getElementById('q-box').classList.add('win-anim');
            localStorage.setItem('nic_xp', this.score);
            setTimeout(() => { document.getElementById('q-answer').value = ""; this.nextQ(); }, 1000);
        } else { alert("Faux ! La réponse était : " + this.currentQ.a); this.nextQ(); }
    }

    // PAIEMENT (Fixé à 200 FCFA -> 0.30 EUR environ)
    checkPremium() {
        if(localStorage.getItem('nic_premium') === 'true') {
            document.getElementById('locked-overlay').style.display = 'none';
            document.getElementById('quiz-ui').classList.remove('hidden');
            this.nextQ();
        } else {
            paypal.Buttons({
                createOrder: (d, a) => a.order.create({ purchase_units: [{ amount: { value: '0.30' } }] }),
                onApprove: (d, a) => a.order.capture().then(() => { localStorage.setItem('nic_premium', 'true'); location.reload(); })
            }).render('#paypal-button-container');
        }
    }

    activate() {
        if(document.getElementById('code-input').value === "NICOLY200") {
            localStorage.setItem('nic_premium', 'true');
            location.reload();
        }
    }
}

const app = new NicolyUltimate();
