const display = document.getElementById("display");
const history = document.getElementById("history");

let current = "0";
let previous = null;
let operator = null;
let justEvaluated = false;

function updateScreen() {
  display.textContent = current;
  history.textContent = previous !== null && operator ? `${previous} ${operator}` : "\u00A0";
}

function inputDigit(digit) {
  if (justEvaluated) {
    current = digit;
    justEvaluated = false;
  } else {
    current = current === "0" ? digit : current + digit;
  }
  updateScreen();
}

function inputDecimal() {
  if (justEvaluated) {
    current = "0.";
    justEvaluated = false;
    updateScreen();
    return;
  }
  if (!current.includes(".")) current += ".";
  updateScreen();
}

function chooseOperator(op) {
  if (operator && previous !== null && !justEvaluated) {
    evaluate();
  }
  previous = current;
  operator = op;
  justEvaluated = false;
  current = "0";
  updateScreen();
}

function evaluate() {
  if (operator === null || previous === null) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;
  switch (operator) {
    case "+": result = a + b; break;
    case "−": result = a - b; break;
    case "×": result = a * b; break;
    case "÷": result = b === 0 ? NaN : a / b; break;
    default: return;
  }
  current = Number.isNaN(result) ? "Error" : trimResult(result);
  previous = null;
  operator = null;
  justEvaluated = true;
  updateScreen();
}

function trimResult(num) {
  const str = num.toString();
  if (str.length > 12) return num.toPrecision(8).replace(/\.?0+$/, "");
  return str;
}

function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  justEvaluated = false;
  updateScreen();
}

function backspace() {
  if (justEvaluated) { clearAll(); return; }
  current = current.length > 1 ? current.slice(0, -1) : "0";
  updateScreen();
}

function percent() {
  current = trimResult(parseFloat(current) / 100);
  updateScreen();
}

document.querySelector(".pad").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  if (btn.dataset.num !== undefined) inputDigit(btn.dataset.num);
  else if (btn.dataset.op) chooseOperator(btn.dataset.op);
  else if (btn.dataset.action === "clear") clearAll();
  else if (btn.dataset.action === "backspace") backspace();
  else if (btn.dataset.action === "percent") percent();
  else if (btn.dataset.action === "decimal") inputDecimal();
  else if (btn.dataset.action === "equals") evaluate();
});

const keyMap = { "*": "×", "/": "÷", "-": "−", "+": "+" };

document.addEventListener("keydown", (e) => {
  if (/[0-9]/.test(e.key)) { inputDigit(e.key); return; }
  if (e.key === ".") { inputDecimal(); return; }
  if (keyMap[e.key]) { chooseOperator(keyMap[e.key]); return; }
  if (e.key === "Enter" || e.key === "=") { e.preventDefault(); evaluate(); return; }
  if (e.key === "Backspace") { backspace(); return; }
  if (e.key === "Escape") { clearAll(); return; }
  if (e.key === "%") { percent(); return; }
});

updateScreen();