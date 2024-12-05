const questionElement = document.getElementById('question');
const optionsContainer = document.getElementById('options');
const inputAnswerContainer = document.getElementById('input-answer');
const userAnswerInput = document.getElementById('user-answer');
const feedbackDiv = document.getElementById('feedback');
const resultElement = document.getElementById('result');
const choicesElement = document.getElementById('choices');
const nextButton = document.getElementById('next-btn');
const finalResultElement = document.getElementById('final-result');
const scoreElement = document.getElementById('score');

let quizData = [];
let currentQuestionIndex = 0;
let score = 0;
let currentMode = 'easy';  // デフォルトは簡単モード

// レベル選択後にクイズを開始
async function startQuiz(mode) {
    currentMode = mode;
    document.getElementById('level-selection').style.display = 'none';
    document.getElementById('quiz').style.display = 'block';
    
    try {
        const response = await fetch('quizData.json');
        quizData = shuffleArray(await response.json()).slice(0, 10);
        loadQuestion();
    } catch (error) {
        console.error('クイズデータの読み込みに失敗しました:', error);
    }
}

// 質問を表示する関数
function loadQuestion() {
    const currentQuestion = quizData[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    
    if (currentMode === 'easy') {
        optionsContainer.style.display = 'block';
        inputAnswerContainer.style.display = 'none';
        optionsContainer.querySelectorAll('.option').forEach((button, index) => {
            button.textContent = currentQuestion.options[index];
            button.onclick = () => checkAnswer(button.textContent);
        });
    } else {
        optionsContainer.style.display = 'none';
        inputAnswerContainer.style.display = 'block';
    }
    resultElement.textContent = "";
    resultElement.className = "";
    nextButton.style.displayn= "none";
    choicesElement.innerHTML = "";
}

// 答えをチェックする関数（簡単モード用）
function checkAnswer(selected) {
    const currentQuestion = quizData[currentQuestionIndex];
    if (selected === currentQuestion.correct) {
        score++;
        feedbackDiv.textContent = "正解！";
        feedbackDiv.style.color = "green";
        currentQuestionIndex++;
        setTimeout(loadQuestion, 1500);
    } else {
        feedbackDiv.textContent = "不正解！ 正解は「" + quizData[currentQuestionIndex].choices[correctIndeex] + "」です。";
        feedbackDiv.style.color = "red";
        nextButton.style.disply = "block";
       
    }

    document.querySelectorAll('#choices button').forEach(btn => btn.disabled = true);

    nextQuestion();
}

// 答えをチェックする関数（難しいモード用）
function submitAnswer() {
    const currentQuestion = quizData[currentQuestionIndex];
    const userAnswer = userAnswerInput.value.trim();

    // 正解の場合
    if (userAnswer === currentQuestion.correct) {
        score++;
        feedbackDiv.textContent = "正解！";
        feedbackDiv.style.color = "green";
        currentQuestionIndex++;
        setTimeout(loadQuestion, 1500);
    } 
    // 誤答の場合のみ正答を表示
    else {
        feedbackDiv.textContent = "不正解！ 正解は「" + quizData[currentQuestionIndex].choices[correctIndeex] + "」です。";
        feedbackDiv.style.color = "red";
        nextButton.style.display = "block";
    }
    userAnswerInput.value = '';  // 入力欄をクリア

    document.querySelectorAll('#choices button').forEach(btn => btn.disabled = true);

    nextQuestion();
}

// 次の質問を表示
function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex >= quizData.length) {
        setTimeout(showFinalResult, 1000);
    } else {
        setTimeout(() => {
            resultElement.textContent = "";
            loadQuestion();
        }, 1000);
    }
}

// 結果発表画面を表示する関数
function showFinalResult() {
    document.getElementById('quiz').style.display = 'none';
    finalResultElement.style.display = 'block';
    scoreElement.textContent = `あなたのスコアは ${score} / 10 です！`;
}

// 配列をシャッフルする関数
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

document.addEventListener("DOMContentLoaded", () => {
    const background = document.querySelector('.background');
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

    function createLetter() {
        const letter = document.createElement('div');
        letter.classList.add('letter');
        letter.textContent = alphabet[Math.floor(Math.random() * alphabet.length)];
        letter.style.left = Math.random() * 100 + 'vw';
        letter.style.animationDuration = (Math.random() * 3 + 3) + 's'; // 3秒から6秒のランダムなアニメーション時間
        background.appendChild(letter);

        // アニメーション終了後に要素を削除
        setTimeout(() => {
            letter.remove();
        }, 5000);
    }

    // 一定間隔で文字を生成
    setInterval(createLetter, 300);
});

