const button = document.querySelector(".operations");
const dispaly = document.querySelector(".display");
let topArrNum = [];
let tailArrNum = [];
let operation = "";

button.addEventListener("click", function (event) {
  const value = event.target.innerText;
  const num = parseInt(value);

  if (num >= 0) {
    topArrNum.push(num);
    dispaly.innerText = topArrNum.join("");
    return;
  }

  if (value === "←" || value === "C") {
    remove(value);
  }

  if (value === "÷" || value === "+" || value === "-" || value === "×") {
    if (tailArrNum.length) {
      calculate(operation);
    }
    tailArrNum = [...topArrNum];
    topArrNum = [];
    operation = value;
    dispaly.innerText = "0";
    return;
  }

  if (value === "=" && tailArrNum.length) {
    calculate(operation);
    tailArrNum = [];
    return;
  }
});

function remove(value) {
  if (topArrNum.length === 1 || value === "C") {
    dispaly.innerText = "0";
    topArrNum = [];
    return;
  }
  if (dispaly.innerText !== "0") {
    topArrNum.pop();
    dispaly.innerText = topArrNum.join("");
    return;
  }
}

function calculate(operation) {
  if (!topArrNum.length) {
    topArrNum = tailArrNum;
    return;
  }
  const tailNum = parseInt(tailArrNum.join(""));
  const topNum = parseInt(topArrNum.join(""));
  let result = 0;

  if (operation === "+") result = tailNum + topNum;
  if (operation === "÷") result = tailNum / topNum;
  if (operation === "-") result = tailNum - topNum;
  if (operation === "×") result = tailNum * topNum;

  topArrNum = result.toString().split("");
  dispaly.innerText = result;
  return;
}
