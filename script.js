// 기존과 동일하지만 클릭 성능을 고려한 리팩토링 버전
const planets = [
    { name: '명왕성', id: 'pluto', answer: [true, true, false], desc: '명왕성은 주변 궤도의 천체를 지배하지 못해 왜소행성으로 분류되었습니다.' },
    { name: '에리스', id: 'eris', answer: [true, true, false], desc: '명왕성보다 질량이 큰 왜소행성입니다.' },
    { name: '세레스', id: 'ceres', answer: [true, true, false], desc: '소행성대에 위치한 왜소행성입니다.' },
    { name: '마케마케', id: 'makemake', answer: [true, true, false], desc: '카이퍼 벨트의 붉은 왜소행성입니다.' },
    { name: '하우메아', id: 'haumea', answer: [true, true, false], desc: '타원형 모양의 왜소행성입니다.' },
    { name: '태양', id: 'sun', answer: [false, true, true], desc: '스스로 빛을 내는 항성입니다.' },
    { name: '달', id: 'moon', answer: [false, true, true], desc: '지구의 위성입니다.' },
    { name: '지구', id: 'earth', answer: [true, true, true], desc: '모든 조건을 갖춘 행성입니다.' }
];

let studentId = "";
let currentPlanetIndex = null;
let userAnswers = {};
let currentSelections = [null, null, null];

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    window.scrollTo(0, 0); // 화면 전환 시 상단으로
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
                <img src="images/${p.id}.jpg" class="planet-thumb-img">
            </div>
            <strong style="display:block; font-size:0.9rem;">${p.name}</strong>
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
    document.getElementById('quiz-planet-img').src = `images/${p.id}.jpg`;
    
    let html = "";
    const questions = ["1. 태양을 공전하는가?", "2. 충분한 질량(구형)?", "3. 궤도 지배(청소)?"];
    questions.forEach((q, i) => {
        html += `
            <div style="margin-bottom:15px; text-align:left;">
                <p style="margin-bottom:8px; font-weight:bold; font-size:0.95rem;">${q}</p>
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
    
    const modalContent = document.querySelector('.modal-content');
    modalContent.classList.remove('correct', 'incorrect');

    if (isCorrect) {
        modalContent.classList.add('correct');
        document.getElementById('modal-title').innerText = "✅ 판결 성공";
    } else {
        modalContent.classList.add('incorrect');
        document.getElementById('modal-title').innerText = "❌ 판결 오답";
    }

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
    document.getElementById('result-comment').innerText = score === planets.length ? "완벽합니다!" : "복습이 조금 더 필요해요!";
    showView('view-result');
}
