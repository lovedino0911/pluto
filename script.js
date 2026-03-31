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

const ADMIN_CODE = 'admin@1234';

// 구글 폼 연동 설정 (추출된 실제 값 적용됨)
const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLSdcSbki2CwzjerCL4eump0MMusiRQabQ9i8rNufK9s-IgyJHQ/formResponse';
const ENTRY_ID = 'entry.1681062244'; // '학번' 입력란의 ID

let currentPlanetIndex = -1;
let userAnswers = {}; // { planetId: [bool, bool, bool] }
let studentId = "";

// 1. Initialize Stars & Listeners
function init() {
    createStars();
    
    // Enter 키로 시작하기 지원
    const input = document.getElementById('student-id');
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') startApp();
        });
    }
}

function createStars() {
    const container = document.getElementById('stars');
    const count = 150;
    for (let i = 0; i < count; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        const size = Math.random() * 3 + 'px';
        star.style.width = size;
        star.style.height = size;
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.setProperty('--duration', Math.random() * 3 + 2 + 's');
        container.appendChild(star);
    }
}
init();

// 2. Navigation
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    
    if (viewId === 'view-selection') {
        renderPlanetList();
    }
}

function startApp() {
    const input = document.getElementById('student-id');
    const val = input.value.trim();
    if (val === "") {
        alert("학번을 입력해주세요!");
        return;
    }
    
    // 중복 참여 체크 (localStorage)
    if (val !== ADMIN_CODE) {
        const completedUsers = JSON.parse(localStorage.getItem('planet_trial_completed') || '[]');
        if (completedUsers.includes(val)) {
            alert(`이미 판결을 제출하셨습니다. (${val} 학번)`);
            return;
        }
    }

    studentId = val;
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
        item.innerHTML = `
            <div class="planet-thumb-container">
                <img src="images/${p.id}.jpg?v=${new Date().getTime()}" alt="${p.name}" class="planet-thumb-img" onerror="this.src='https://via.placeholder.com/60?text=?';">
            </div>
            <strong>${p.name}</strong>
        `;
        item.onclick = () => startTrial(index);
        list.appendChild(item);
    });

    if (allCompleted) {
        document.getElementById('btn-final-verdict').style.display = 'block';
    }
}

function startTrial(index) {
    currentPlanetIndex = index;
    const p = planets[index];
    document.getElementById('quiz-planet-name').innerText = p.name;
    const img = document.getElementById('quiz-planet-img');
    img.src = `images/${p.id}.jpg?v=${new Date().getTime()}`;
    img.onerror = () => { img.src = 'https://via.placeholder.com/120?text=?'; };
    
    // Reset options
    const btns = document.querySelectorAll('.option-btn');
    btns.forEach(b => b.classList.remove('selected'));
    
    showView('view-quiz');
}

let tempAnswers = [null, null, null];

function selectOption(qIndex, value) {
    const btns = document.querySelectorAll('.option-btn');
    const qBtns = [btns[qIndex * 2], btns[qIndex * 2 + 1]];
    
    qBtns[0].classList.remove('selected');
    qBtns[1].classList.remove('selected');
    
    if (value) qBtns[0].classList.add('selected');
    else qBtns[1].classList.add('selected');
    
    tempAnswers[qIndex] = value;
}

function submitTrial() {
    if (tempAnswers.includes(null)) {
        alert("모든 기준에 대해 판결을 내려주세요!");
        return;
    }
    
    const p = planets[currentPlanetIndex];
    userAnswers[p.id] = [...tempAnswers];
    
    const ra = p.answer;
    const isCorrect = JSON.stringify(tempAnswers) === JSON.stringify(ra);
    
    // Show Modal instead of alert
    const modal = document.getElementById('modal-verdict');
    const mTitle = document.getElementById('modal-title');
    const mDesc = document.getElementById('modal-desc');
    
    mTitle.innerText = isCorrect ? "정확한 판결입니다!" : "과학적 사실과 다릅니다.";
    mTitle.style.color = isCorrect ? "#4cd137" : "#ff4757";
    mDesc.innerText = p.desc;
    
    modal.style.display = 'flex';
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modal-verdict');
    modal.style.display = 'none';
    modal.classList.remove('active');
    
    tempAnswers = [null, null, null];
    showView('view-selection');
}

function goBack() {
    tempAnswers = [null, null, null];
    showView('view-selection');
}

function showFinalResult() {
    let score = 0;
    let perfect = true;
    
    planets.forEach(p => {
        const ua = userAnswers[p.id];
        const ra = p.answer;
        const isCorrect = JSON.stringify(ua) === JSON.stringify(ra);
        if (isCorrect) score++;
        else perfect = false;
    });

    document.getElementById('result-student-info').innerText = `학번: ${studentId}`;
    document.getElementById('result-score').innerText = `${score} / ${planets.length}`;
    
    if (perfect) {
        document.getElementById('result-comment').innerText = "와우! 당신은 완벽한 천문학자 판사입니다!";
        document.getElementById('snack-award').classList.add('show');
    } else {
        document.getElementById('result-comment').innerText = "일부 판결이 과학적 사실과 다릅니다. 다시 도전해보세요!";
        document.getElementById('snack-award').classList.remove('show');
    }

    // 최종 기록 (중복 방지 저장 및 엑셀 전송)
    const completedUsers = JSON.parse(localStorage.getItem('planet_trial_completed') || '[]');
    if (!completedUsers.includes(studentId)) {
        // 관리자가 아닐 때만 로컬 중복 방지 저장
        if (studentId !== ADMIN_CODE) {
            completedUsers.push(studentId);
            localStorage.setItem('planet_trial_completed', JSON.stringify(completedUsers));
        }
        
        // 엑셀(구글 시트)로 데이터 전송 (관리자 포함 무조건 전송하여 테스트 가능케 함)
        const formData = new FormData();
        formData.append(ENTRY_ID, studentId);
        fetch(GOOGLE_FORM_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: formData
        }).then(() => console.log('Data synced with Excel'))
          .catch(e => console.error('Data sync failed:', e));
    }

    showView('view-result');
}

function restartApp() {
    userAnswers = {};
    studentId = "";
    document.getElementById('student-id').value = "";
    document.getElementById('btn-final-verdict').style.display = 'none';
    showView('view-intro');
}
