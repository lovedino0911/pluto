const planets = [
    { name: '명왕성', id: 'pluto', answer: [true, true, false], title: '왜소행성', desc: '명왕성은 충분히 크고 둥글며 태양을 공전하지만, 궤도 주변의 다른 천체들을 지배하지 못해 왜소행성으로 분류되었습니다.' },
    { name: '에리스', id: 'eris', answer: [true, true, false], title: '왜소행성', desc: '에리스는 명왕성보다 질량이 큰 왜소행성으로, 해왕성 궤도 밖에서 태양을 공전합니다.' },
    { name: '세레스', id: 'ceres', answer: [true, true, false], title: '왜소행성', desc: '소행성대에 위치한 가장 큰 천체이자 유일한 왜소행성입니다.' },
    { name: '마케마케', id: 'makemake', answer: [true, true, false], title: '왜소행성', desc: '카이퍼 벨트에서 발견된 붉은 빛의 왜소행성입니다.' },
    { name: '하우메아', id: 'haumea', answer: [true, true, false], title: '왜소행성', desc: '매우 빠르게 자전하여 럭비공처럼 길쭉한 모양을 가진 왜소행성입니다.' },
    { name: '태양', id: 'sun', answer: [false, true, true], title: '항성', desc: '태양은 스스로 빛을 내는 거대한 기체 덩어리인 항성입니다.' },
    { name: '달', id: 'moon', answer: [false, true, true], title: '위성', desc: '지구의 유일한 자연 위성으로, 태양이 아닌 지구 주위를 공전합니다.' },
    { name: '지구', id: 'earth', answer: [true, true, true], title: '행성', desc: '우리가 살고 있는, 행성의 모든 조건을 완벽하게 갖춘 천체입니다.' }
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
            <strong style="display:block; margin-top:5px;">${p.name}</strong>
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
    const questions = ["1. 태양을 공전하는가?", "2. 충분한 질량으로 구형인가?", "3. 주변 궤도를 지배하는가?"];
    questions.forEach((q, i) => {
        html += `
            <div style="margin-bottom:20px; text-align:left;">
                <p style="margin-bottom:10px; font-weight:bold;">${q}</p>
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
    
    // 이 부분이 핵심입니다!
    const modalContent = document.querySelector('.modal-content');
    modalContent.classList.remove('correct', 'incorrect'); // 이전 기록 초기화

    if (isCorrect) {
        modalContent.classList.add('correct');
        document.getElementById('modal-title').innerText = `✅ ${p.name} 판결 성공`;
    } else {
        modalContent.classList.add('incorrect');
        document.getElementById('modal-title').innerText = `❌ ${p.name} 판결 오답`;
    }

    document.getElementById('modal-desc').innerText = p.desc;
    
    // 기존에 있던 라인: ID가 'modal-verdict' 인지 확인해주세요!
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
    document.getElementById('result-comment').innerText = score === planets.length ? "완벽한 천문학 판사님! 모든 판결이 정확합니다." : "고생하셨습니다! 몇 가지 판결을 더 복습해볼까요?";
    
    const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdcSbki2CwzjerCL4eump0MMusiRQabQ9i8rNufK9s-IgyJHQ/formResponse";
    const formData = new FormData();
    formData.append("entry.1681062244", studentId);
    fetch(FORM_URL, { method: "POST", mode: "no-cors", body: formData });

    showView('view-result');
}
