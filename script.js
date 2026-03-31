/* script.js: Planet Trial Experience Application Logic */

const planets = [
    { name: '명왕성', id: 'pluto', answer: [true, true, false], title: '왜소행성', 
      desc: '명왕성은 충분히 크고 둥글며 태양을 공전하지만, 궤도 주변의 카이퍼 벨트 천체들을 완전히 청소하지 못해 왜소행성으로 분류되었습니다.' },
    { name: '에리스', id: 'eris', answer: [true, true, false], title: '왜소행성', 
      desc: '에리스는 명왕성보다 질량이 큼에도 불구하고, 명왕성과 마찬가지로 궤도 주변에 다른 천체들이 많이 있어 왜소행성이 되었습니다.' },
    { name: '세레스', id: 'ceres', answer: [true, true, false], title: '왜소행성', 
      desc: '화성과 목성 사이의 소행성대에 위치한 세레스는 소행성 중 가장 크고 둥글지만, 주변에 수많은 소행성이 함께 있어 왜소행성입니다.' },
    { name: '마케마케', id: 'makemake', answer: [true, true, false], title: '왜소행성', 
      desc: '해왕성 너머 카이퍼 벨트에 있는 마케마케 역시 둥근 모양을 가졌으나 궤도를 지배하지는 못합니다.' },
    { name: '하우메아', id: 'haumea', answer: [true, true, false], title: '왜소행성', 
      desc: '매우 빠르게 회전하여 타원체 형태를 띠고 있는 하우메아는 정역학적 평형 상태(구형)를 갖추었으나 궤도를 청소하지는 못했습니다.' },
    { name: '태양', id: 'sun', answer: [false, true, true], title: '항성', 
      desc: '태양은 행성들의 모태가 되는 항성(별)입니다. 행성의 제1기준인 "태양을 공전할 것"을 만족하지 않습니다.' },
    { name: '달', id: 'moon', answer: [false, true, true], title: '위성', 
      desc: '달은 지구가 태양을 돌 때 지구의 인력에 묶여 지구 주위를 공전하는 위성입니다. 따라서 행성 기준을 충족하지 않습니다.' },
    { name: '지구', id: 'earth', answer: [true, true, true], title: '행성', 
      desc: '지구는 태양을 공전하고, 완벽한 구형이며, 자신의 궤도에 있는 다른 천체들을 모두 정리한 완벽한 행성입니다.' }
];

let currentPlanetIndex = -1;
let userAnswers = {};
let studentId = "";
let tempAnswers = [null, null, null];

function init() {
    createStars();
    const input = document.getElementById('student-id');
    if (input) {
        input.addEventListener('keypress', (e) => { if (e.key === 'Enter') startApp(); });
    }
}

function createStars() {
    const container = document.getElementById('stars');
    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 3 + 'px';
        star.style.width = size; star.style.height = size;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.setProperty('--duration', Math.random() * 3 + 2 + 's');
        container.appendChild(star);
    }
}
init();

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    if (viewId === 'view-selection') renderPlanetList();
}

function startApp() {
    studentId = document.getElementById('student-id').value.trim();
    if (studentId === "") return alert("학번을 입력해주세요!");
    showView('view-selection');
}

function renderPlanetList() {
    const list = document.getElementById('planet-list');
    list.innerHTML = "";
    let allCompleted = true;
    planets.forEach((p, index) => {
        const isCompleted = userAnswers[p.id] !== undefined;
        if (!isCompleted) allCompleted = false;
        const item = document.createElement('div');
        item.className = `planet-item glass-card ${isCompleted ? 'completed' : ''}`;
        item.innerHTML = `<div class="planet-thumb-container"><img src="images/${p.id}.jpg" class="planet-thumb-img"></div><strong>${p.name}</strong>`;
        item.onclick = () => startTrial(index);
        list.appendChild(item);
    });
    if (allCompleted) document.getElementById('btn-final-verdict').style.display = 'block';
}

function startTrial(index) {
    currentPlanetIndex = index;
    const p = planets[index];
    document.getElementById('quiz-planet-name').innerText = p.name;
    document.getElementById('quiz-planet-img').src = `images/${p.id}.jpg`;
    document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    tempAnswers = [null, null, null];
    showView('view-quiz');
}

function selectOption(qIndex, value) {
    const btns = document.querySelectorAll('.view.active .option-btn');
    const qBtns = [btns[qIndex * 2], btns[qIndex * 2 + 1]];
    qBtns[0].classList.remove('selected'); qBtns[1].classList.remove('selected');
    if (value) qBtns[0].classList.add('selected'); else qBtns[1].classList.add('selected');
    tempAnswers[qIndex] = value;
}

function submitTrial() {
    if (tempAnswers.includes(null)) return alert("모든 기준에 대해 판결을 내려주세요!");
    const p = planets[currentPlanetIndex];
    userAnswers[p.id] = [...tempAnswers];
    const isCorrect = JSON.stringify(tempAnswers) === JSON.stringify(p.answer);
    
    const modal = document.getElementById('modal-verdict');
    document.getElementById('modal-title').innerText = isCorrect ? "정확한 판결입니다!" : "과학적 사실과 다릅니다.";
    document.getElementById('modal-title').style.color = isCorrect ? "#4cd137" : "#ff4757";
    document.getElementById('modal-desc').innerText = p.desc;
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-verdict').style.display = 'none';
    showView('view-selection');
}

function showFinalResult() {
    let score = planets.filter(p => JSON.stringify(userAnswers[p.id]) === JSON.stringify(p.answer)).length;
    document.getElementById('result-student-info').innerText = `학번: ${studentId}`;
    document.getElementById('result-score').innerText = `${score} / ${planets.length}`;
    showView('view-result');
}

function restartApp() {
    userAnswers = {}; studentId = ""; 
    document.getElementById('student-id').value = "";
    showView('view-intro');
}
