document.addEventListener("DOMContentLoaded", () => {
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options');
    const inputAnswerContainer = document.getElementById('input-answer');
    const userAnswerInput = document.getElementById('user-answer');
    const resultElement = document.getElementById('result');
    const finalResultElement = document.getElementById('final-result');
    const scoreElement = document.getElementById('score');
    
    let quizData = [];
    let currentQuestionIndex = 0;
    let score = 0;
    let currentMode = 'easy';

    // レベル選択後にクイズを開始
    async function startQuiz(mode) {
        currentMode = mode;
        document.getElementById('level-selection').style.display = 'none';
        document.getElementById('quiz').style.display = 'block';

        try {
            // クイズデータを取得 (ローカルファイル対応用)
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
            const buttons = optionsContainer.querySelectorAll('.option');
            buttons.forEach((button, index) => {
                button.textContent = currentQuestion.options[index];
                button.onclick = () => checkAnswer(button.textContent);
            });
        } else {
            optionsContainer.style.display = 'none';
            inputAnswerContainer.style.display = 'block';
        }
    }

    // 答えをチェックする関数（簡単モード用）
    function checkAnswer(selected) {
        const currentQuestion = quizData[currentQuestionIndex];
        if (selected === currentQuestion.correct) {
            score++;
            resultElement.textContent = "正解！";
            resultElement.style.color = "green";
        } else {
            resultElement.textContent = "不正解！";
            resultElement.style.color = "red";
        }
        nextQuestion();
    }

    // 答えをチェックする関数（難しいモード用）
    function submitAnswer() {
        const currentQuestion = quizData[currentQuestionIndex];
        const userAnswer = userAnswerInput.value.trim();

        if (userAnswer === currentQuestion.correct) {
            score++;
            resultElement.textContent = "正解！";
            resultElement.style.color = "green";
        } else {
            resultElement.textContent = "不正解！";
            resultElement.style.color = "red";
        }
        userAnswerInput.value = '';
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

    // クイズを再開する関数
    function restartQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        startQuiz(currentMode);
    }

    // 配列をシャッフルする関数
    function shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    window.startQuiz = startQuiz;
    window.submitAnswer = submitAnswer;
    window.restartQuiz = restartQuiz;
});
