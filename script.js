/* script.js: Planet Trial Logic Fix */
const planets = [
    { name: '명왕성', id: 'pluto', answer: [true, true, false], title: '왜소행성', desc: '명왕성은 궤도 주변의 천체를 지배하지 못해 왜소행성이 되었습니다.' },
    { name: '에리스', id: 'eris', answer: [true, true, false], title: '왜소행성', desc: '해왕성 궤도 밖의 거대한 왜소행성입니다.' },
    { name: '세레스', id: 'ceres', answer: [true, true, false], title: '왜소행성', desc: '화성과 목성 사이 소행성대의 가장 큰 천체입니다.' },
    { name: '마케마케', id: 'makemake', answer: [true, true, false], title: '왜소행성', desc: '카이퍼 벨트의 주요 왜소행성 중 하나입니다.' },
    { name: '하우메아', id: 'haumea', answer: [true, true, false], title: '왜소행성', desc: '빠른 자전으로 인해 럭비공 모양인 왜소행성입니다.' },
    { name: '태양', id: 'sun', answer: [false, true, true], title: '항성', desc: '태양은 스스로 빛을 내는 항성입니다.' },
    { name: '달', id: 'moon', answer: [false, true, true], title: '위성', desc: '지구 주위를 도는 위성입니다.' },
    { name: '지구', id: 'earth', answer: [true, true, true], title: '행성', desc: '우리가 사는 완벽한 행성입니다.' }
];

let studentId = "";
let currentPlanetIndex = null;
let userAnswers = {};
let currentSelections = [null, null, null];

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
}

function startApp() {
    studentId = document.getElementById('student-id').value.trim();
    if (!studentId) return alert("학번을 입력해 주세요!");
    renderPlanetList();
    showView('view-selection');
}

function renderPlanetList() {
    const list = document.getElementById('planet-list');
    list.innerHTML = "";
    planets.forEach((p, i) => {
        const isDone = userAnswers[i] !== undefined;
        const div = document.createElement('div');
        div.className = `planet-item ${isDone ? 'completed' : ''}`;
        div.innerHTML = `
            <div class="planet-thumb-container">
                <img src="images/${p.id}.jpg?v=${Date.now()}" class="planet-thumb-img">
            </div>
            <strong>${p.name}</strong>
        `;
        div.onclick = () => startTrial(i);
        list.appendChild(div);
    });
    if (Object.keys(userAnswers).length === planets.length) {
        document.getElementById('btn-final-verdict').style.display = 'block';
    }
}

function startTrial(index) {
    currentPlanetIndex = index;
    currentSelections = [null, null, null];
    const p = planets[index];
    document.getElementById('quiz-planet-name').innerText = p.name;
    document.getElementById('quiz-planet-img').src = `images/${p.id}.jpg?v=${Date.now()}`;
    
    let html = "";
    const questions = ["1. 태양을 공전하는가?", "2. 구형을 유지하는가?", "3. 궤도 주변을 지배하는가?"];
    questions.forEach((q, i) => {
        html += `
            <div class="question-card">
                <p>${q}</p>
                <div class="option-group">
                    <button class="option-btn" id="q${i}-y" onclick="selectOption(${i}, true)">예</button>
                    <button class="option-btn" id="q${i}-n" onclick="selectOption(${i}, false)">아니오</button>
                </div>
            </div>`;
    });
    document.getElementById('quiz-container').innerHTML = html;
    showView('view-quiz');
}

function selectOption(qIdx, val) {
    currentSelections[qIdx] = val;
    document.getElementById(`q${qIdx}-y`).className = `option-btn ${val === true ? 'selected' : ''}`;
    document.getElementById(`q${qIdx}-n`).className = `option-btn ${val === false ? 'selected' : ''}`;
}

function submitTrial() {
    if (currentSelections.includes(null)) return alert("모든 질문에 답해주세요!");
    const p = planets[currentPlanetIndex];
    const isCorrect = JSON.stringify(currentSelections) === JSON.stringify(p.answer);
    userAnswers[currentPlanetIndex] = isCorrect;
    
    document.getElementById('modal-title').innerText = `${p.name}에 대한 판결`;
    document.getElementById('modal-desc').innerText = p.desc;
    document.getElementById('modal-verdict').classList.add('active');
}

function closeModal() {
    document.getElementById('modal-verdict').classList.remove('active');
    renderPlanetList();
    showView('view-selection');
}

function goBack() { showView('view-selection'); }

function showFinalResult() {
    let score = Object.values(userAnswers).filter(v => v).length;
    document.getElementById('result-score').innerText = `${score} / ${planets.length}`;
    document.getElementById('result-comment').innerText = score === planets.length ? "완벽한 천문학 판사입니다!" : "조금 더 공부하면 훌륭한 판사가 될 거예요!";
    
    // 데이터 전송 (이미 되어 있는 경우 패스)
    const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdcSbki2CwzjerCL4eump0MMusiRQabQ9i8rNufK9s-IgyJHQ/formResponse";
    const formData = new FormData();
    formData.append("entry.1681062244", studentId);
    fetch(FORM_URL, { method: "POST", mode: "no-cors", body: formData });

    showView('view-result');
}
