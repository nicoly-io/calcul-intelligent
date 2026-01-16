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
        } catch(e) { alert("Erreur"); }
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

class ArcadeEngine {
    constructor() { this.ans = 0; }
    next() {
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        this.ans = a * b;
        document.getElementById('question').innerText = `${a} × ${b}`;
    }
    check() {
        if(parseInt(document.getElementById('answer-input').value) === this.ans) {
            alert("Correct !"); this.next();
        } else { alert("Faux !"); }
        document.getElementById('answer-input').value = "";
    }
}

const calc = new ToumanyCalculator();
const game = new ArcadeEngine();

const CODE_SECRET = "TOP_CALCUL_2024";

function contactPourCode() {
    window.open("https://wa.me/221783113787?text=Je_veux_le_code_Premium_Calcul_Intelligent", "_blank");
}

function verifierCode() {
    const s = document.getElementById('promo-code-input').value.trim().toUpperCase();
    if(s === CODE_SECRET) {
        localStorage.setItem('nic_premium', 'true');
        unlock();
    } else { alert("Code incorrect"); }
}

function unlock() {
    document.getElementById('locked-ui').classList.add('hidden');
    document.getElementById('game-ui').classList.remove('hidden');
    game.next();
}

// PAYPAL
paypal.Buttons({
    createOrder: (data, actions) => actions.order.create({ purchase_units: [{ amount: { value: '0.65' } }] }),
    onApprove: (data, actions) => actions.order.capture().then(() => {
        localStorage.setItem('nic_premium', 'true');
        unlock();
    })
}).render('#paypal-button-container');

window.onload = () => { if(localStorage.getItem('nic_premium') === 'true') unlock(); };
