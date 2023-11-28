// Selecionando todos os elementos necessários
const info_box = document.querySelector(".info_box");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
const startBtn = document.querySelector('.start-quiz')
const popupInfo = document.querySelector('.info_box')
const main = document.querySelector('.main')
const resultBox = document.querySelector('.status')
const statusBtn = document.querySelector('.statusBtn')
let elapsedTime = 0; // Variável para armazenar o tempo total
let questionCount = 0; // Variável para contar o número de perguntas respondidas
let userErrors = []; // Array para armazenar os erros dos usuários
let startTime; // Variável para armazenar o tempo inicial
let totalTime = 0; // Variável para armazenar o tempo total gasto em todas as perguntas

startBtn.onclick = () => {
    popupInfo.classList.add('active')
    main.classList.add('active')
    startTime = new Date().getTime(); // Armazena o tempo inicial
}

function statsQuiz(){
    document.querySelector('.result_box').style.display = 'none'
    document.querySelector('.quiz_box').style.display = 'none'
	document.querySelector('.status').style.display = 'block'
	document.querySelector('.status').style.pointer_events = 'auto'
	document.querySelector('.status').style.opacity = '1'
}

// Se o botão ContinueQuiz for clicado
continue_btn.onclick = () => {
    info_box.classList.remove("activeInfo"); // Esconde a caixa de informações
    quiz_box.classList.add("activeQuiz"); // Mostra a caixa de perguntas
    showQuetions(0); // Chama a função showQestions
    queCounter(1); // Passa 1 parâmetro para queCounter
    startTimer(10); // Chama a função startTimer
    startTimerLine(0); // Chama a função startTimerLine
}

let timeValue = 10;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// Se o botão RestartQuiz for clicado
restart_quiz.onclick = () => {
    quiz_box.classList.add("activeQuiz"); // Mostra a caixa de perguntas
    result_box.classList.remove("activeResult"); // Esconde a caixa de resultados
    timeValue = 10; 
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;
    showQuetions(que_count); // Chama a função showQestions
    queCounter(que_numb); // Passa o valor que_numb para queCounter
    clearInterval(counter); // Limpa o contador
    clearInterval(counterLine); // Limpa o contador de linha
    startTimer(timeValue); // Chama a função startTimer
    startTimerLine(widthValue); // Chama a função startTimerLine
    timeText.textContent = "Tempo Restante"; // Altera o texto de timeText para Tempo Restante
    next_btn.classList.remove("show"); // Esconde o botão próximo

    // Reinicia a contagem de tentativas apenas quando for a primeira tentativa
    if (questionCount > 0) {
        userErrors = [];
        console.log("Número de tentativas: 0");

        // Adiciona esta linha para exibir a quantidade de erros após reiniciar
        console.log("Quantidade de erros (após reiniciar): " + (userErrors.length - 1));
    }
}

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// Se o botão Próxima Pergunta for clicado
next_btn.onclick = () => {
    if (que_count < questions.length - 1) {
        que_count++; // Incrementa o valor do contador de perguntas
        que_numb++; // Incrementa o valor do contador de número de perguntas
        showQuetions(que_count); // Chama a função showQestions
        queCounter(que_numb); // Passa o valor de que_numb para queCounter
        clearInterval(counter); // Limpa o contador
        clearInterval(counterLine); // Limpa o contador de linha
        startTimer(timeValue); // Chama a função startTimer
        startTimerLine(widthValue); // Chama a função startTimerLine
        timeText.textContent = "Tempo Restante"; // Altera o texto de timeText para Tempo Restante
        next_btn.classList.remove("show"); // Esconde o botão próximo

        totalTime += 10 - timeValue; // Adiciona o tempo gasto nesta pergunta ao tempo total
        questionCount++; // Incrementa o número de perguntas respondidas

        // Calcula o tempo médio por pergunta
        const averageTime = totalTime / questionCount;
        // tempo_medio.innerHTML = `Tempo Médio por Pergunta:  + ${averageTime.toFixed(2)} +  segundos`;

    } else {
        clearInterval(counter); // Limpa o contador
        clearInterval(counterLine); // Limpa o contador de linha
        showResult(); // Chama a função showResult
    }
}

// Obtendo perguntas e opções do array
function showQuetions(index) {
  const que_text = document.querySelector(".que_text");

  let que_tag =
    '<span>' +
    questions[index].numb +
    ". " +
    questions[index].question +
    '</span><p class="difficulty">Dificuldade: ' +
    questions[index].difficulty +
    '</p>';
  let option_tag =
    '<div class="option"><span>' +
    questions[index].options[0] +
    '</span></div>' +
    '<div class="option"><span>' +
    questions[index].options[1] +
    '</span></div>' +
    '<div class="option"><span>' +
    questions[index].options[2] +
    '</span></div>' +
    '<div class="option"><span>' +
    questions[index].options[3] +
    '</span></div>';
  que_text.innerHTML = que_tag;
  option_list.innerHTML = option_tag;

  const option = option_list.querySelectorAll(".option");

  for (let i = 0; i < option.length; i++) {
    option[i].setAttribute("onclick", "optionSelected(this)");
  }
}

// Criando as novas tags div para ícones
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';
let easyQuestionsCorrect = [];
let hardQuestionsCorrect = [];

// Se o usuário clicou em uma opção
function optionSelected(answer) {
    clearInterval(counter); // Limpa o contador
    clearInterval(counterLine); // Limpa o contador de linha
    let userAns = answer.textContent; // Obtém a opção selecionada pelo usuário
    let correcAns = questions[que_count].answer; // Obtém a resposta correta do array
    const allOptions = option_list.children.length; // Obtém todos os itens de opção

    let isCorrect = false;

    if (userAns == correcAns) { // Se a opção selecionada pelo usuário for igual à resposta correta do array
        userScore += 1; // Atualiza o valor da pontuação com 1
        answer.classList.add("correct"); // Adiciona a cor verde à opção selecionada correta
        answer.insertAdjacentHTML("beforeend", tickIconTag); // Adiciona o ícone de marca à opção selecionada correta
        console.log("Resposta Correta");
        console.log("Suas respostas corretas = " + userScore);

        // Se a pergunta é fácil, adiciona à array easyQuestionsCorrect
        if (questions[que_count].difficulty === 'easy') {
            easyQuestionsCorrect.push(questions[que_count]);
        }
        // Se a pergunta é difícil, adiciona à array hardQuestionsCorrect
        else if (questions[que_count].difficulty === 'hard') {
            hardQuestionsCorrect.push(questions[que_count]);
        }

        isCorrect = true;
    } else {
        userErrors.push({
            question: que_count,
            selectedOption: userAns,
            correctOption: correcAns,
            attempt: userErrors.length + 1, // Número da tentativa
            isCorrect: false
        }); // Armazena a opção incorreta
        answer.classList.add("incorrect"); // Adiciona a cor vermelha à opção selecionada incorreta
        answer.insertAdjacentHTML("beforeend", crossIconTag); // Adiciona o ícone de cruz à opção selecionada incorreta
        console.log("Resposta Errada");
        console.log("Número de tentativas: " + userErrors.length);
        console.log(userErrors);
    }

    console.log("Número de acertos: " + userScore);

    for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled"); // Uma vez que o usuário seleciona uma opção, desabilita todas as opções
    }

    next_btn.classList.add("show"); // Mostra o botão próximo se o usuário selecionou alguma opção

    if (isCorrect) {
        totalTime += 10 - timeValue; // Adiciona o tempo gasto nesta pergunta ao tempo total
        questionCount++; // Incrementa o número de perguntas respondidas

        // Calcula o tempo médio por pergunta
        const averageTime = totalTime / questionCount;
        // tempo_medio.innerHTML = `Tempo Médio por Pergunta: ${averageTime.toFixed(2)} segundos`;
    }
}


function showResult() {
    info_box.classList.remove("activeInfo"); // Esconde a caixa de informações
    quiz_box.classList.remove("activeQuiz"); // Esconde a caixa de perguntas
    result_box.classList.add("activeResult"); // Mostra a caixa de resultados
    const scoreText = result_box.querySelector(".score-text");
    if (userScore > 3) { // Se o usuário marcou mais de 3
        // Criando uma nova tag span e passando o número de pontos do usuário e o número total de perguntas
        let scoreTag = '<span>Parabéns! Você obteve <p>' + userScore + '</p> de <p>' + questions.length + '</p></span>';
        scoreText.innerHTML = scoreTag;  // Adiciona uma nova tag span dentro de score_Text
    } else if (userScore > 1) { // Se o usuário marcou mais de 1
        let scoreTag = '<span> legal! Você obteve <p>' + userScore + '</p> de <p>' + questions.length + '</p></span>';
        scoreText.innerHTML = scoreTag;
    } else { // Se o usuário marcou menos de 1
        let scoreTag = '<span>E desculpe, você obteve apenas <p>' + userScore + '</p> de <p>' + questions.length + '</p></span>';
        scoreText.innerHTML = scoreTag;
    }

    const circularProgress = document.querySelector('.circular-progress')
    const ProgressValue = document.querySelector('.progress-value')
    let progressStartValue = -1
    let progressEndValue = (userScore / questions.length) * 100
    let speed = 20

    // console.log("Tempo Total: " + elapsedTime / 1000 + " segundos");

    let progress = setInterval(() => {
        progressStartValue++

        ProgressValue.textContent = `${progressStartValue}% `
        circularProgress.style.background = `conic-gradient(rgb(63, 185, 33) ${progressStartValue * 3.6}deg, rgba(48, 45, 45, 0.1) 0deg)`

        if (progressStartValue == progressEndValue) {
            clearInterval(progress)
        }
    }, speed)
}


function startTimer(time) {
    let startTime = new Date().getTime(); // Armazena o tempo inicial
    counter = setInterval(timer, 1000);

    function timer() {
        timeCount.textContent = time; // Altera o valor de timeCount com o valor de tempo
        time--; // Decrementa o valor de tempo

        if (time < 9) {
            let addZero = timeCount.textContent;
            timeCount.textContent = "0" + addZero;
        }

        if (time < 0) {
            clearInterval(counter);
            timeText.textContent = "Tempo Esgotado";

            const allOptions = option_list.children.length;
            let correcAns = questions[que_count].answer;

            for (let i = 0; i < allOptions; i++) {
                if (option_list.children[i].textContent == correcAns) {
                    option_list.children[i].setAttribute("class", "option correct");
                    option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag);
                    console.log("Tempo Esgotado: Resposta correta automaticamente selecionada.");
                }
            }

            for (let i = 0; i < allOptions; i++) {
                option_list.children[i].classList.add("disabled");
            }

            next_btn.classList.add("show");

            // Calcula o tempo total
            let endTime = new Date().getTime();
            let questionTime = endTime - startTime;
            totalTime += questionTime;

            // Para debug
            console.log("Tempo Total: " + totalTime / 1000 + " segundos");
        }
    }
}

function startTimerLine(time){
    counterLine = setInterval(timer, 29);
    function timer(){
        time += 1; // Atualiza o valor de tempo com 1
        time_line.style.width = time + "px"; // Aumenta a largura de time_line em px pelo valor de tempo
        if(time > 549){ // Se o valor de tempo for maior que 549
            clearInterval(counterLine); // Limpa o contadorLine
        }
    }
}

function queCounter(index){
    // Criando uma nova tag span e passando o número
    let totalQueCounTag = '<span><p>'+ index +'</p> de <p>'+ questions.length +'</p> Perguntas</span>';
    bottom_ques_counter.innerHTML = totalQueCounTag;  // Adiciona uma nova tag span dentro de bottom_ques_counter
}
