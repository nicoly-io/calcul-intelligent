class ToumanyCalculator {
    constructor() {
        this.clear();
        this.history = JSON.parse(localStorage.getItem('h_nic')) || [];
        this.renderH();
    }
    clear() { this.cur = '0'; this.prev = ''; this.op = undefined; this.update(); }
    delete() { this.cur = this.cur.toString().slice(0, -1) || '0'; this.update(); }
    addNumber(n) { 
        if (n === '.' && this.cur.includes('.')) return;
        this.cur = (this.cur === '0' && n !== '.') ? n : this.cur + n; 
        this.update(); 
    }
    chooseOp(op) {
        if (this.cur === '') return;
        if (this.prev !== '') this.compute();
        this.op = op; this.prev = this.cur; this.cur = ''; this.update();
    }
    compute() {
        let res;
        const p = parseFloat(this.prev), c = parseFloat(this.cur);
        if (isNaN(p) || isNaN(c)) return;
        switch(this.op) {
            case '+': res = p + c; break; case '-': res = p - c; break;
            case '*': res = p * c; break; case '/': res = c === 0 ? "Err" : p / c; break;
            default: return;
        }
        this.saveH(`${this.prev}${this.op}${this.cur}=${res}`);
        this.cur = res.toString(); this.op = undefined; this.prev = ''; this.update();
    }
    solveComplex() {
        const input = document.getElementById('complex-input').value;
        try {
            let res = eval(input.replace(/sqrt/g, 'Math.sqrt').replace(/pow/g, 'Math.pow').replace(/pi/g, 'Math.PI'));
            this.saveH(`${input}=${res}`);
            this.cur = res; this.update();
        } catch(e) { alert("Format invalide"); }
    }
    scientific(fn) {
        this.cur = (fn === 'Math.PI') ? Math.PI : eval(`${fn}(${parseFloat(this.cur)})`);
        this.update();
    }
    saveH(e) {
        this.history.unshift(e);
        if(this.history.length > 5) this.history.pop();
        localStorage.setItem('h_nic', JSON.stringify(this.history));
        this.renderH();
    }
    renderH() { document.getElementById('history-list').innerHTML = this.history.map(h => `<li>${h}</li>`).join(''); }
    clearHistory() { this.history = []; localStorage.removeItem('h_nic'); this.renderH(); }
    update() {
        document.getElementById('current-operand').innerText = this.cur;
        document.getElementById('previous-operand').innerText = this.op ? `${this.prev} ${this.op}` : '';
    }
}

class PremiumEngine {
    constructor() { this.score = 0; this.ans = 0; }
    
    // FONCTION POUSSÉE : SCANNER DE DONNÉES IA
    analyze() {
        const q = document.getElementById('question');
        q.style.fontSize = "0.8rem";
        let i = 0;
        const t = setInterval(() => {
            q.innerHTML = `SCANNER IA...<br>SÉQUENCE: ${Math.random().toString(16).slice(2,10).toUpperCase()}<br>SÉCURITÉ: ${i}%`;
            i += 5;
            if(i > 100) { 
                clearInterval(t); 
                q.innerHTML = "LABORATOIRE PRÊT<br><span style='color:#238636'>ACCÈS SÉCURISÉ ✅</span>"; 
            }
        }, 80);
    }

    // FONCTION ARCADE : DÉFI MATHÉMATIQUE ÉLITE
    startArcade() {
        const a = Math.floor(Math.random() * 90) + 10;
        const b = Math.floor(Math.random() * 80) + 10;
        this.ans = a + b;
        const q = document.getElementById('question');
        q.innerHTML = `<span style='color:#5865f2; font-size:0.7rem;'>MODE ARCADE</span><br>${a} + ${b}`;
        q.style.fontSize = "1.8rem";
    }

    check() {
        const input = document.getElementById('answer-input');
        if(parseInt(input.value) === this.ans) {
            this.score += 100;
            document.getElementById('score-val').innerText = this.score;
            input.style.borderColor = "#238636";
            this.startArcade();
        } else { 
            input.style.borderColor = "#da3633";
            alert("ERREUR ANALYSE"); 
        }
        input.value = "";
    }
}

// INITIALISATION
const calc = new ToumanyCalculator();
const game = new PremiumEngine();

// LOGIQUE DE PAIEMENT & CODE
const CODE_SECRET = "TOP_CALCUL_2024";

function contactPourCode() {
    window.open("https://wa.me/221783113787?text=Je_veux_le_code_Premium_Calcul_Intelligent", "_blank");
}

function verifierCode() {
    const inputCode = document.getElementById('promo-code-input').value.trim().toUpperCase();
    if(inputCode === CODE_SECRET) {
        localStorage.setItem('nic_premium', 'true');
        unlock();
    } else { alert("Code invalide"); }
}

function unlock() {
    document.getElementById('locked-ui').classList.add('hidden');
    const ui = document.getElementById('game-ui');
    ui.classList.remove('hidden');
    
    // Injection du design du laboratoire Premium
    ui.innerHTML = `
        <div class="premium-badge">LABORATOIRE ÉLITE ACTIVÉ</div>
        <div style="display:flex; gap:5px; margin-bottom:10px;">
            <button onclick="game.analyze()" style="font-size:0.6rem; flex:1; padding:8px; background:#30363d">SCANNER IA</button>
            <button onclick="game.startArcade()" style="font-size:0.6rem; flex:1; padding:8px; background:#30363d">DÉFI ARCADE</button>
        </div>
        <div class="quiz-box">
            <div id="question" style="min-height:80px; display:flex; align-items:center; justify-content:center; flex-direction:column;">
                BIENVENUE NICOLY-IO
            </div>
            <input type="number" id="answer-input" placeholder="RÉPONSE" style="width:100%; padding:12px; margin:10px 0; background:#000; border:1px solid #5865f2; color:#fff; text-align:center; box-sizing:border-box; border-radius:5px;">
            <button onclick="game.check()" style="width:100%; background:#5865f2; padding:12px; font-weight:bold;">VALIDER</button>
        </div>
        <div style="margin-top:10px; font-size:0.8rem; text-align:center;">POINTS ÉLITE: <span id="score-val" style="color:#f59e0b">0</span></div>
    `;
}

// INTÉGRATION PAYPAL AUTOMATIQUE
if(document.getElementById('paypal-button-container')) {
    paypal.Buttons({
        createOrder: (data, actions) => actions.order.create({ purchase_units: [{ amount: { value: '0.65' } }] }),
        onApprove: (data, actions) => actions.order.capture().then(() => {
            localStorage.setItem('nic_premium', 'true');
            unlock();
        })
    }).render('#paypal-button-container');
}

// VÉRIFICATION AU CHARGEMENT
window.onload = () => { if(localStorage.getItem('nic_premium') === 'true') unlock(); };
