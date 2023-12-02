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
let questionCount = 0;
let userErrors = [];
let startTime;
let totalTime = 0;

startBtn.onclick = () => {
    popupInfo.classList.add('active')
    main.classList.add('active')
    startTime = new Date().getTime();
}

continue_btn.onclick = () => {
    info_box.classList.remove("activeInfo");
    quiz_box.classList.add("activeQuiz");
    showQuetions(0);
    queCounter(1);
    startTimer(10);
    startTimerLine(0);
}

let timeValue = 10;
let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let widthValue = 0;

const restart_quiz = result_box.querySelector(".buttons .restart");
const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

restart_quiz.onclick = () => {
    quiz_box.classList.add("activeQuiz");
    result_box.classList.remove("activeResult");
    timeValue = 10; 
    que_count = 0;
    que_numb = 1;
    userScore = 0;
    widthValue = 0;
    showQuetions(que_count);
    queCounter(que_numb);
    clearInterval(counter);
    clearInterval(counterLine);
    startTimer(timeValue);
    startTimerLine(widthValue);
    timeText.textContent = "Tempo Restante";
}

next_btn.onclick = () => {
    if (que_count < questions.length - 1) {
        que_count++;
        que_numb++;
        showQuetions(que_count);
        queCounter(que_numb);
        clearInterval(counter);
        clearInterval(counterLine);
        startTimer(timeValue);
        startTimerLine(widthValue);
        timeText.textContent = "Tempo Restante";
        next_btn.classList.remove("show");
        totalTime += 10 - timeValue;
        questionCount++;

    } else {
        clearInterval(counter);
        clearInterval(counterLine);
        showResult();
        // código para enviar dados para o servidor removido

        fetch("/quiz/atualizar", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              // crie um atributo que recebe o valor recuperado aqui
              // Agora vá para o arquivo routes/usuario.js
              idServer: sessionStorage.ID_USUARIO,
              acertosServer: userScore,
              errosServer: userErrors.length
            }),
          })
            .then(function (resposta) {
              console.log("resposta: ", resposta);

              if (resposta.ok) {

              } else {
                throw "Houve um erro ao tentar realizar o cadastro!";
              }
            })
            .catch(function (resposta) {
              console.log(`#ERRO: ${resposta}`);
            });

             fetch(`/rank/rankModel`)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`Erro na requisição: ${response.statusText}`);
            }
            console.log(response)
            return response.json();
          }).then((data) => {
            console.log("seila")
            console.dir(data[0]);
            acertos1.innerHTML = `${data[0].acertos}` 
            erros1.innerHTML = `${data[0].erros}` 

            if(restart_quiz.onclick){
                console.log("seila2")
                console.dir(data[1]);
                acertos1.innerHTML = `${data[1].acertos}` 
                erros1.innerHTML = `${data[1].erros}`
            }
            else{
                console.log("seila3")
                console.dir(data[2]);
                acertos1.innerHTML = `${data[2].acertos}` 
                erros1.innerHTML = `${data[2].erros}`
            }
            return data;
        })
          .catch((error) => {
            console.error("Erro:", error);
          });
    }
}

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

let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';
let easyQuestionsCorrect = [];
let hardQuestionsCorrect = [];

function optionSelected(answer) {
    clearInterval(counter);
    clearInterval(counterLine);
    let userAns = answer.textContent;
    let correcAns = questions[que_count].answer;
    const allOptions = option_list.children.length;
    let isCorrect = false;
    if (userAns == correcAns) {
        userScore += 1;
        answer.classList.add("correct");
        answer.insertAdjacentHTML("beforeend", tickIconTag);
        if (questions[que_count].difficulty === 'easy') {
            easyQuestionsCorrect.push(questions[que_count]);
        } else if (questions[que_count].difficulty === 'hard') {
            hardQuestionsCorrect.push(questions[que_count]);
        }
        isCorrect = true;
    } else {
        userErrors.push({
            question: que_count,
            selectedOption: userAns,
            correctOption: correcAns,
            attempt: userErrors.length + 1,
            isCorrect: false
        });
        answer.classList.add("incorrect");
        answer.insertAdjacentHTML("beforeend", crossIconTag);
    }
    for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled");
    }
    next_btn.classList.add("show");
    if (isCorrect) {
        totalTime += 10 - timeValue;
        questionCount++;
    }
}

function showResult() {
    info_box.classList.remove("activeInfo");
    quiz_box.classList.remove("activeQuiz");
    result_box.classList.add("activeResult");
    const scoreText = result_box.querySelector(".score-text");
    if (userScore > 3) {
        let scoreTag = '<span>Parabéns! Você obteve <p>' + userScore + '</p> de <p>' + questions.length + '</p></span>';
        scoreText.innerHTML = scoreTag;
    } else if (userScore > 1) {
        let scoreTag = '<span> legal! Você obteve <p>' + userScore + '</p> de <p>' + questions.length + '</p></span>';
        scoreText.innerHTML = scoreTag;
    } else {
        let scoreTag = '<span>E desculpe, você obteve apenas <p>' + userScore + '</p> de <p>' + questions.length + '</p></span>';
        scoreText.innerHTML = scoreTag;
    }
    const circularProgress = document.querySelector('.circular-progress')
    const ProgressValue = document.querySelector('.progress-value')
    let progressStartValue = -1
    let progressEndValue = (userScore / questions.length) * 100
    let speed = 20
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
    let startTime = new Date().getTime();
    counter = setInterval(timer, 1000);
    function timer() {
        timeCount.textContent = time;
        time--;
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
                }
            }
            for (let i = 0; i < allOptions; i++) {
                option_list.children[i].classList.add("disabled");
            }
            next_btn.classList.add("show");
            let endTime = new Date().getTime();
            let questionTime = endTime - startTime;
            totalTime += questionTime;
        }
    }
}

function startTimerLine(time){
    counterLine = setInterval(timer, 29);
    function timer(){
        time += 1;
        time_line.style.width = time + "px";
        if(time > 549){
            clearInterval(counterLine);
        }
    }
}

function queCounter(index){
    let totalQueCounTag = '<span><p>'+ index +'</p> de <p>'+ questions.length +'</p> Perguntas</span>';
    bottom_ques_counter.innerHTML = totalQueCounTag;
}
