// --- MOTEUR DE CALCUL ---
const engine = {
    currentMode: 'sci',
    input: '0',
    setMode(m) {
        this.currentMode = m;
        document.getElementById('current-mode').innerText = m.toUpperCase();
        this.renderPad();
        ui.toggleMenu();
    },
    renderPad() {
        const pad = document.getElementById('numpad');
        const keys = ['C','(',' )','/','7','8','9','*','4','5','6','-','1','2','3','+','0','.','sin','='];
        pad.innerHTML = keys.map(k => `<button onclick="engine.press('${k}')">${k}</button>`).join('');
    },
    press(k) {
        const screen = document.getElementById('main-screen');
        if(k === 'C') this.input = '0';
        else if(k === '=') this.solve();
        else this.input === '0' ? this.input = k : this.input += k;
        screen.innerText = this.input;
    },
    solve() {
        try {
            // Utilisation d'Algebrite pour le calcul symbolique
            let result = Algebrite.run(this.input).toString();
            historyManager.add(this.input, result);
            this.input = result;
            document.getElementById('main-screen').innerText = result;
        } catch(e) { 
            document.getElementById('main-screen').innerText = "Erreur"; 
            this.input = '0';
        }
    }
};

// --- GESTIONNAIRE D'HISTORIQUE (PAS À PAS) ---
const historyManager = {
    data: JSON.parse(localStorage.getItem('nic_hist')) || [],
    add(q, a) {
        const steps = [
            `<strong>Étape 1 :</strong> Énoncé de la formule pour \\(${q}\\).`,
            `<strong>Étape 2 :</strong> Remplacement des variables par les valeurs fournies.`,
            `<strong>Étape 3 :</strong> Calcul intermédiaire via le processeur symbolique.`,
            `<strong>Étape 4 :</strong> Résultat final : <b>${a}</b>.`
        ];
        this.data.unshift({ q, a, steps });
        localStorage.setItem('nic_hist', JSON.stringify(this.data.slice(0,15)));
        this.render();
    },
    render() {
        const list = document.getElementById('history-list');
        list.innerHTML = this.data.map((h, i) => `
            <div class="hist-item">
                <div class="hist-head" onclick="ui.toggleStep(${i})">${h.q} = ${h.a}</div>
                <div id="step-${i}" class="hist-body">${h.steps.join('<br><br>')}</div>
            </div>
        `).join('');
    }
};

// --- SYSTÈME DE JEUX (QUIZ) ---
const game = {
    xp: 0,
    start(subject) {
        // Simulation de 350+ questions (55 par matière)
        const qList = Array.from({length: 55}, (_, i) => ({
            text: `Question ${subject} #${i+1} : Quelle est la démarche correcte?`,
            options: ["Solution A", "Solution B", "Solution C", "Solution D"],
            correct: 0
        }));
        const q = qList[Math.floor(Math.random() * qList.length)];
        
        document.getElementById('question-text').innerText = q.text;
        const grid = document.getElementById('options-grid');
        grid.innerHTML = q.options.map((o, idx) => `
            <button onclick="game.check(${idx}, 0)">${o}</button>
        `).join('');
        
        document.getElementById('quiz-modal').classList.remove('hidden');
    },
    check(idx, correct) {
        if(idx === correct) {
            this.xp += 100;
            alert("✅ BRAVO ! +100 XP");
        } else {
            alert("❌ MAUVAIS ! Regardez la solution dans l'historique.");
        }
        document.getElementById('xp-val').innerText = this.xp;
        document.getElementById('quiz-modal').classList.add('hidden');
    }
};

// --- INTERFACE UTILISATEUR (UI) ---
const ui = {
    switchTab(tab) {
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`tab-${tab}`).classList.add('active');
        document.getElementById(`btn-${tab}`).classList.add('active');
    },
    toggleMenu() { document.getElementById('dropdown-menu').classList.toggle('hidden'); },
    toggleStep(i) {
        const el = document.getElementById(`step-${i}`);
        el.style.display = (el.style.display === 'block') ? 'none' : 'block';
    }
};

// Initialisation
engine.renderPad();
historyManager.render();
