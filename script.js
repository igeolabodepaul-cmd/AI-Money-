document.addEventListener('DOMContentLoaded', () => {
    // State
    let dailyBudget = 0;
    let todaySpent = 0;

    // Elements
    const clockEl = document.getElementById('realtime-clock');
    const dateEl = document.getElementById('realtime-date');
    const commandBar = document.getElementById('commandBar');
    const mainBalance = document.getElementById('mainBalance');
    const todaySpendEl = document.getElementById('todaySpend');
    const remainingEl = document.getElementById('remainingBudget');
    const calcModal = document.getElementById('calcModal');
    const calcDisplay = document.getElementById('calcDisplay');

    // 1. Real-time Clock & Date
    function updateClock() {
        const now = new Date();
        clockEl.innerText = now.toLocaleTimeString('en-GB');
        dateEl.innerText = now.toLocaleDateString('en-GB', { 
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
        });
    }
    setInterval(updateClock, 1000);
    updateClock();

    // 2. Navigation Logic
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const pageId = `page-${item.dataset.page}`;
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');
            item.classList.add('active');
        });
    });

    // 3. Calculator Logic
    document.getElementById('calcToggle').onclick = () => calcModal.style.display = 'flex';
    document.getElementById('closeCalc').onclick = () => calcModal.style.display = 'none';

    document.querySelectorAll('.calc-buttons button').forEach(btn => {
        btn.onclick = () => {
            const val = btn.innerText;
            if (val === 'C') calcDisplay.innerText = '0';
            else if (val === '⌫') calcDisplay.innerText = calcDisplay.innerText.slice(0, -1) || '0';
            else if (val === '=') {
                try { calcDisplay.innerText = eval(calcDisplay.innerText); } catch { calcDisplay.innerText = "Error"; }
            } else {
                if (calcDisplay.innerText === '0') calcDisplay.innerText = val;
                else calcDisplay.innerText += val;
            }
        };
    });

    // 4. Budget & Spending Logic
    commandBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const input = commandBar.value.toLowerCase();
            const amountMatch = input.match(/(\d+)/);
            const amount = amountMatch ? parseFloat(amountMatch[0]) : 0;

            if (input.includes('budget')) {
                dailyBudget = amount;
                updateUI("Budget Set", `Daily limit updated to ₦${amount}`);
            } else if (amount > 0) {
                todaySpent += amount;
                updateUI("Expense Logged", `₦${amount} recorded.`);
            }
            
            refreshCounters();
            commandBar.value = '';
        }
    });

    function refreshCounters() {
        mainBalance.innerText = `₦${dailyBudget.toLocaleString()}`;
        todaySpendEl.innerText = `₦${todaySpent.toLocaleString()}`;
        remainingEl.innerText = `₦${(dailyBudget - todaySpent).toLocaleString()}`;
    }

    function updateUI(title, text) {
        document.getElementById('nudgeTitle').innerText = title.toUpperCase();
        document.getElementById('nudgeText').innerText = text;
    }

    // 5. Generate Shopping Experts
    const names = ["Amaka", "Chidi", "Tunde", "Yetunde", "Obinna", "Segun", "Blessing", "Efe", "Uche", "Amina"];
    const surnames = ["Okonkwo", "Adeyemi", "Bello", "Eze", "Balogun", "Ibrahim", "Nnamdi", "Danjuma", "Okoro", "Abiola"];
    const listContainer = document.getElementById('shopping-list');

    for (let i = 0; i < 10; i++) {
        const fullName = `${names[Math.floor(Math.random() * 10)]} ${surnames[Math.floor(Math.random() * 10)]}`;
        const phone = `+234 80${Math.floor(Math.random() * 899) + 100} ${Math.floor(Math.random() * 8999) + 1000}`;
        
        const item = document.createElement('div');
        item.className = 'contact-item';
        item.innerHTML = `<div><strong>${fullName}</strong><br><span>Shopping Expert</span></div><small>${phone}</small>`;
        listContainer.appendChild(item);
    }
});