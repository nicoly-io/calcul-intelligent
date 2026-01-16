class NicolyApp {
    constructor() {
        this.hist = JSON.parse(localStorage.getItem('nic_h')) || [];
        this.xp = parseInt(localStorage.getItem('nic_x')) || 0;
        this.db = {
            math: [{q:"ln(e)",a:"1",niv:"f"},{q:"(15*4)/2",a:"30",niv:"f"},{q:"sqrt(144)",a:"12",niv:"f"},{q:"5!",a:"120",niv:"m"},{q:"Dérivée de x²",a:"2x",niv:"m"},{q:"cos(0)",a:"1",niv:"m"},{q:"i²",a:"-1",niv:"d"},{q:"Primitive de 1/x",a:"ln(x)",niv:"d"}],
            fr: [{q:"Auteur de 'Une si longue lettre'?",a:"Mariama Ba",niv:"f"},{q:"Genre de 'Sous l'orage'?",a:"Roman",niv:"f"},{q:"Auteur de 'L'Aventure Ambiguë'?",a:"Cheikh Hamidou Kane",niv:"m"}],
            hg: [{q:"Indépendance Sénégal?",a:"1960",niv:"f"},{q:"Plus long fleuve Afrique?",a:"Nil",niv:"f"},{q:"Capitale Nigéria?",a:"Abuja",niv:"d"}],
            pc: [{q:"Formule eau?",a:"H2O",niv:"f"},{q:"Loi d'Ohm?",a:"U=RI",niv:"m"},{q:"Vitesse lumière (km/s)?",a:"300000",niv:"d"}],
            philo: [{q:"Auteur du 'Cogito'?",a:"Descartes",niv:"m"},{q:"Père de la philosophie?",a:"Thalès",niv:"d"}]
        };
        // Note: Pour atteindre 50 par matière, dupliquez et variez les questions dans l'objet db.
        this.init();
    }

    init() {
        document.getElementById('xp-val').innerText = this.xp + " XP";
        this.updateHist();
        if(localStorage.getItem('vip') === 'true') {
            document.getElementById('pay-screen').classList.add('hidden');
            document.getElementById('quiz-ui').classList.remove('hidden');
            this.newQ();
        }
        this.setupPaypal();
    }

    nav(id) {
        document.querySelectorAll('.app-page').forEach(p => p.classList.remove('active'));
        document.getElementById(id).classList.add('active');
    }

    add(v) { document.getElementById('import-input').value += v; }
    clear() { document.getElementById('import-input').value = ""; }

    solve() {
        const inp = document.getElementById('import-input').value;
        const log = document.getElementById('steps');
        const res = document.getElementById('result');
        try {
            log.innerText = "Analyse mathématique... Étape 1 : Priorités... Étape 2 : Fonctions...";
            let f = inp.replace(/ln/g,'Math.log').replace(/exp/g,'Math.exp').replace(/sqrt/g,'Math.sqrt');
            if(f.includes('!')) { let n=parseInt(f); let r=1; for(let i=1;i<=n;i++) r*=i; f=r; }
            const r = eval(f);
            res.innerText = r;
            this.hist.unshift(`${inp} = ${r}`);
            localStorage.setItem('nic_h', JSON.stringify(this.hist.slice(0,10)));
            this.updateHist();
        } catch(e) { res.innerText = "Erreur"; }
    }

    updateHist() {
        document.getElementById('hist-content').innerHTML = this.hist.map(h => `<div style="padding:15px;border-bottom:1px solid #222">${h}</div>`).join('');
    }

    newQ() {
        const m = document.getElementById('s-mat').value;
        const n = document.getElementById('s-niv').value;
        const p = this.db[m].filter(q => q.niv === n);
        this.curr = p[Math.floor(Math.random()*p.length)];
        document.getElementById('q-txt').innerText = this.curr.q;
        document.getElementById('q-box').classList.remove('win-anim');
    }

    check() {
        const a = document.getElementById('q-ans').value.trim().toLowerCase();
        const b = document.getElementById('q-box');
        if(a === this.curr.a.toLowerCase()) {
            this.xp += 100; b.classList.add('win-anim');
        } else {
            this.xp = Math.max(0, this.xp - 50); alert("Faux! C'était: "+this.curr.a);
        }
        localStorage.setItem('nic_x', this.xp);
        document.getElementById('xp-val').innerText = this.xp + " XP";
        document.getElementById('q-ans').value = "";
        this.newQ();
    }

    setupPaypal() {
        paypal.Buttons({
            createOrder: (d,a) => a.order.create({purchase_units:[{amount:{value:'0.30'}}]}),
            onApprove: (d,a) => a.order.capture().then(() => { localStorage.setItem('vip','true'); location.reload(); })
        }).render('#paypal-button-container');
    }

    unlock() { if(document.getElementById('code-in').value === "NICOLY200") { localStorage.setItem('vip','true'); location.reload(); } }
}
const app = new NicolyApp();
