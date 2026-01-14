// --- CLASSE CALCULATRICE (Toujours active) ---
class ToumanyCalculator {
    constructor() {
        this.clear();
        this.history = JSON.parse(localStorage.getItem('cal_smart_h')) || [];
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
            let safe = input.replace(/sqrt/g, 'Math.sqrt').replace(/pow/g, 'Math.pow').replace(/pi/g, 'Math.PI');
            let res = eval(safe);
            this.saveH(`${input}=${res}`);
            this.cur = res; this.update();
        } catch(e) { alert("Calcul complexe invalide"); }
    }
    scientific(fn) {
        this.cur = (fn === 'Math.PI') ? Math.PI : eval(`${fn}(${parseFloat(this.cur)})`);
        this.update();
    }
    saveH(e) {
        this.history.unshift(e);
        if(this.history.length > 10) this.history.pop();
        localStorage.setItem('cal_smart_h', JSON.stringify(this.history));
        this.renderH();
    }
    renderH() { document.getElementById('history-list').innerHTML = this.history.map(h => `<li>${h}</li>`).join(''); }
    clearHistory() { this.history = []; localStorage.removeItem('cal_smart_h'); this.renderH(); }
    update() {
        document.getElementById('current-operand').innerText = this.cur;
        document.getElementById('previous-operand').innerText = this.op ? `${this.prev} ${this.op}` : '';
    }
}

// --- MOTEUR DE JEUX ---
class ArcadeEngine {
    constructor() { this.score = 0; this.level = 1; this.ans = 0; }
    next() {
        const mode = document.getElementById('game-mode').value;
        const a = Math.floor(Math.random() * (10 * this.level)) + 1;
        const b = Math.floor(Math.random() * (5 * this.level)) + 1;
        const qElem = document.getElementById('question');
        if (mode === 'multi') { this.ans = a * b; qElem.innerText = `${a} × ${b}`; }
        else if (mode === 'add') { this.ans = a + b; qElem.innerText = `${a} + ${b}`; }
        else { this.ans = a; qElem.innerText = `${a*b} ÷ ${b}`; }
    }
    check() {
        if(parseInt(document.getElementById('answer-input').value) === this.ans) {
            this.score += 10; this.level = Math.floor(this.score / 50) + 1;
            this.next();
        } else { alert("Faux ! Retente ta chance."); }
        document.getElementById('answer-input').value = "";
        document.getElementById('score').innerText = this.score;
        document.getElementById('level').innerText = this.level;
    }
}

const calc = new ToumanyCalculator();
const game = new ArcadeEngine();

// --- LOGIQUE DE DÉBLOCAGE PREMIUM ---

const CODE_SECRET_PREMIUM = "TOP_CALCUL_2024";

function contactPourCode() {
    const phone = "221783113787";
    const msg = encodeURIComponent("Bonjour Nicoly-io, je souhaite acheter le code Premium pour Calcul Intelligent (400 FCFA).");
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
}

function verifierCode() {
    const saisie = document.getElementById('promo-code-input').value.trim().toUpperCase();
    if(saisie === CODE_SECRET_PREMIUM) {
        localStorage.setItem('tp_nicoly_premium', 'true');
        unlockPremium();
        alert("Succès ! Mode Arcade débloqué.");
    } else {
        alert("Code incorrect. Contactez-moi sur WhatsApp pour l'obtenir.");
    }
}

function unlockPremium() {
    document.getElementById('locked-ui').classList.add('hidden');
    document.getElementById('game-ui').classList.remove('hidden');
    game.next();
}

// PAYPAL
paypal.Buttons({
    createOrder: (data, actions) => actions.order.create({ purchase_units: [{ amount: { value: '0.61' } }] }),
    onApprove: (data, actions) => actions.order.capture().then(() => {
        localStorage.setItem('tp_nicoly_premium', 'true');
        unlockPremium();
    })
}).render('#paypal-button-container');

// VÉRIFICATION AUTO AU CHARGEMENT
window.onload = () => {
    if (localStorage.getItem('tp_nicoly_premium') === 'true') {
        unlockPremium();
    }
};