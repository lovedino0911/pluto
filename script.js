/* script.js: Planet Trial Final Optimized Logic */
const planets = [
    { name: '명왕성', id: 'pluto', answer: [true, true, false], title: '왜소행성', desc: '명왕성은 충분히 크고 둥글며 태양을 공전하지만, 궤도 주변의 다른 천체들을 지배하지 못해 왜소행성이 되었습니다.' },
    { name: '에리스', id: 'eris', answer: [true, true, false], title: '왜소행성', desc: '해왕성 궤도 밖의 거대한 왜소행성으로, 명왕성보다 질량이 큽니다.' },
    { name: '세레스', id: 'ceres', answer: [true, true, false], title: '왜소행성', desc: '화성과 목성 사이 소행성대의 가장 큰 천체이자 유일한 왜소행성입니다.' },
    { name: '마케마케', id: 'makemake', answer: [true, true, false], title: '왜소행성', desc: '카이퍼 벨트의 주요 왜소행성 중 하나로 붉은 빛을 띱니다.' },
    { name: '하우메아', id: 'haumea', answer: [true, true, false], title: '왜소행성', desc: '빠른 자전으로 인해 럭비공처럼 길쭉한 모양을 가진 왜소행성입니다.' },
    { name: '태양', id: 'sun', answer: [false, true, true], title: '항성', desc: '태양은 스스로 빛을 내는 항성으로, 행성의 정의(태양 공전)에 해당하지 않습니다.' },
    { name: '달', id: 'moon', answer: [false, true, true], title: '위성', desc: '지구 주위를 도는 위성으로, 태양이 아닌 지구를 공전합니다.' },
    { name: '지구', id: 'earth', answer: [true, true, true], title: '행성', desc: '우리가 사는 지구는 행성의 모든 조건을 완벽하게 갖추고 있습니다.' }
];

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdcSbki2CwzjerCL4eump0MMusiRQabQ9i8rNufK9s-IgyJHQ/formResponse';
const ENTRY_ID = 'entry.1681062244';

let studentId = "";
let currentPlanetIndex = null;
let userAnswers = {}; 
let currentSelections = [null, null, null];

function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(viewId);
    if (target) target.classList.add('active');
}

function startApp() {
    const input = document.getElementById('student-id');
    studentId = input.value.trim();
    if (!studentId) return alert("학번을 입력해 주세요!");

    if (studentId !== "admin@1234") {
        if (localStorage.getItem(`pluto_trial_${studentId}`)) {
            return alert("이미 참여한 학번입니다. (1인 1회 참여 가능)");
        }
    }

    renderPlanetList();
    showView('view-selection');
}

document.getElementById('student-id')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startApp();
});

function renderPlanetList() {
    const list = document.getElementById('planet-list');
    list.innerHTML = "";
    planets.forEach((p, i) => {
        const isDone = userAnswers[i] !== undefined;
        const isCorrect = userAnswers[i] === true;
        
        const item = document.createElement('div');
        item.className = `planet-item glass-card ${isDone ? 'completed' : ''} ${isDone ? (isCorrect ? 'correct' : 'wrong') : ''}`;
        
        let statusHtml = "";
        if (isDone) {
            statusHtml = `<div class="status-badge">${isCorrect ? '✅' : '❌'}</div>`;
        }

        item.innerHTML = `
            ${statusHtml}
            <div class="planet-thumb-container">
                <img src="images/${p.id}.jpg" alt="${p.name}" class="planet-thumb-img" onerror="this.src='https://via.placeholder.com/100?text=?';">
            </div>
            <strong>${p.name}</strong>
        `;
        item.onclick = () => startTrial(i);
        list.appendChild(item);
    });

    if (Object.keys(userAnswers).length === planets.length) {
        document.getElementById('btn-final-verdict').style.display = 'block';
    }
}

function startTrial(index) {
    currentPlanetIndex = index;
    currentSelections = [null, null, null];
    
    // UI Reset: Remove 'selected' class from all option buttons
    document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));

    const p = planets[index];
    document.getElementById('quiz-planet-name').innerText = p.name;
    const img = document.getElementById('quiz-planet-img');
    img.src = `images/${p.id}.jpg`;
    showView('view-quiz');
}

function selectOption(btn, qIdx, val) {
    currentSelections[qIdx] = val;
    
    // Find the group and update classes only within it for maximum speed
    const group = btn.parentElement;
    group.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}

function submitTrial() {
    if (currentSelections.includes(null)) return alert("모든 질문에 답해 주세요!");
    const p = planets[currentPlanetIndex];
    const isCorrect = JSON.stringify(currentSelections) === JSON.stringify(p.answer);
    userAnswers[currentPlanetIndex] = isCorrect;

    const modal = document.getElementById('modal-verdict');
    const modalContent = modal.querySelector('.glass-card');
    const modalTitle = document.getElementById('modal-title');
    
    // Reset modal classes
    modalContent.classList.remove('correct', 'wrong');
    modalTitle.classList.remove('text-correct', 'text-wrong');

    if (isCorrect) {
        modalContent.classList.add('correct');
        modalTitle.classList.add('text-correct');
        modalTitle.innerText = `${p.name} 판결: 정답! ✅`;
    } else {
        modalContent.classList.add('wrong');
        modalTitle.classList.add('text-wrong');
        modalTitle.innerText = `${p.name} 판결: 오답... ❌`;
    }

    document.getElementById('modal-desc').innerText = p.desc;
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-verdict').style.display = 'none';
    renderPlanetList();
    showView('view-selection');
}

function goBack() { showView('view-selection'); }

function showFinalResult() {
    const score = Object.values(userAnswers).filter(v => v).length;
    document.getElementById('result-score').innerText = `${score} / ${planets.length}`;
    document.getElementById('result-student-info').innerText = `학번: ${studentId}`;
    
    const snackBox = document.getElementById('snack-award');
    if (score === planets.length) {
        snackBox.style.display = 'block';
        document.getElementById('result-comment').innerText = "천문학 분야에 뛰어난 재능이 있으시군요! 모든 판결이 정확합니다.";
    } else {
        snackBox.style.display = 'none';
        document.getElementById('result-comment').innerText = "고생하셨습니다! 몇 가지 판결을 더 복습해 볼까요?";
    }

    const formData = new FormData();
    formData.append(ENTRY_ID, studentId);
    fetch(GOOGLE_FORM_URL, { method: 'POST', mode: 'no-cors', body: formData });

    if (studentId !== "admin@1234") {
        localStorage.setItem(`pluto_trial_${studentId}`, 'true');
    }

    showView('view-result');
}

function restartApp() {
    location.reload();
}
