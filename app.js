// Fetch buttons
let start_btn = document.getElementById("start_quiz");
let next_btn = document.getElementById("next_question");
let reset_btn = document.getElementById("reset_quiz");

let array = [];
let index = 0;
let score = 0;

// Fetch quiz data from API
async function fetchData() {
    try {
        const response = await fetch("https://opentdb.com/api.php?amount=5&category=18&type=multiple");
        const questions = await response.json();
        
        array = questions.results; 
        console.log(array);
        
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Call API to fetch questions
fetchData();




// Start quiz button
start_btn.addEventListener("click", function () {
    document.getElementsByClassName("display")[0].style.visibility = "visible";
    document.getElementsByClassName("non_display")[0].style.visibility = "hidden";
    
    display_question();
});





// Function to display a question
function display_question() {
    if (index >= array.length) {
        endQuiz();
        return;
    }

    let q = array[index].question;
    let corr_opt = array[index].correct_answer;
    let incorr_opt = array[index].incorrect_answers;

    document.getElementById("quest").innerHTML = `<p>${q}</p>`;

    // Randomly insert the correct answer into the incorrect options array
    let no = Math.floor(Math.random() * 4);
    incorr_opt.splice(no, 0, corr_opt);

    console.log(incorr_opt);

    // Render options dynamically
    const options = document.getElementById("options");
    options.innerHTML = ""; // Clear previous options

    for (let i = 0; i < 4; i++) {
        let btn = document.createElement("button");
        btn.innerText = incorr_opt[i];
        btn.classList.add("btn");
        btn.addEventListener("click", function () {
            checkAnswer(btn, corr_opt);
        });
        options.appendChild(btn);
    }

    // Show "Next Question" button
    next_btn.classList.remove("hide");
    next_btn.disabled = false;
}








// Function to check answer
function checkAnswer(selectedBtn, correctAnswer) {
    if (selectedBtn.innerText === correctAnswer) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("incorrect");
    }

    
    let allOptions = document.getElementById("options").getElementsByTagName("button");
    for (let btn of allOptions) {
        btn.disabled = true;
        if (btn.innerText === correctAnswer) {
            btn.classList.add("correct"); 
        }
    }

    // Wait for .5 second before moving to the next question
    setTimeout(nextQuestion, 500);
}






// Function to move to next question
function nextQuestion() {
    index++;
    console.log(`Moving to question index: ${index}`);

    if (index < array.length) {
        display_question();
    } else {
        endQuiz();
    }
}




// Function to show final score
function endQuiz() {
    document.getElementById("quest").innerHTML = `<h2>Quiz Over!</h2>`;
    document.getElementById("options").innerHTML = `<p>Your Score: ${score} / ${array.length}</p>`;

    next_btn.classList.add("hide");
    reset_btn.classList.remove("hide");
}






// Function to reset the quiz
function resetQuiz() {
    index = 0;
    score = 0;
    console.log("Quiz Reset");

    fetchData(); 
    document.getElementsByClassName("display")[0].style.visibility = "hidden";
    document.getElementsByClassName("non_display")[0].style.visibility = "visible";
    reset_btn.classList.add("hide");
}





next_btn.addEventListener("click", function () {
    nextQuestion();
});






// Add event listener to Reset Quiz button
reset_btn.addEventListener("click", resetQuiz);
