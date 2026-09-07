// 页面交互：读取输入、播放快速排序步骤、高亮当前比较的数字
// 规则：所有按钮点击都委托到工具栏；步骤播放用定时器，暂停时清掉定时器

const DEFAULT_NUMBERS = "8, 3, 9, 1, 5, 2";
const PLAY_INTERVAL_MS = 700;

const numberInput = document.querySelector("#number-input");
const resultText = document.querySelector("#result-text");
const stepText = document.querySelector("#step-text");
const barsElement = document.querySelector("#bars");
const logElement = document.querySelector("#step-log");
const toolbar = document.querySelector(".toolbar");

let steps = [];
let stepIndex = 0;
let playTimer = null;

function parseNumbers(text) {
  const pieces = text.replace(/,/g, " ").trim().split(/\s+/).filter(Boolean);
  if (pieces.length === 0) {
    return { numbers: [], error: "请至少输入一个数字" };
  }

  const numbers = [];
  for (const piece of pieces) {
    if (!/^-?\d+$/.test(piece)) {
      return { numbers: [], error: `无法识别的内容：${piece}` };
    }
    numbers.push(Number(piece));
  }

  return { numbers, error: "" };
}

function stopPlaying() {
  if (playTimer !== null) {
    window.clearInterval(playTimer);
    playTimer = null;
  }
}

function renderBars(step) {
  const maxValue = Math.max(...step.array.map((n) => Math.abs(n)), 1);

  barsElement.innerHTML = "";
  step.array.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "bars__item";
    bar.style.height = `${Math.max((Math.abs(value) / maxValue) * 100, 12)}%`;
    bar.textContent = String(value);

    if (index === step.pivotIndex) {
      bar.classList.add("bars__item--pivot");
    } else if (index === step.compareIndex) {
      bar.classList.add("bars__item--compare");
    } else if (index >= step.left && index <= step.right) {
      bar.classList.add("bars__item--range");
    }

    barsElement.appendChild(bar);
  });
}

function renderLog() {
  logElement.innerHTML = "";
  steps.forEach((step, index) => {
    const item = document.createElement("li");
    item.className = "log__item";
    if (index === stepIndex) {
      item.classList.add("log__item--current");
    }
    item.textContent = `${index + 1}. ${step.message}`;
    logElement.appendChild(item);
  });

  const current = logElement.querySelector(".log__item--current");
  if (current) {
    current.scrollIntoView({ block: "nearest" });
  }
}

function showStep(index) {
  if (steps.length === 0) {
    return;
  }

  stepIndex = Math.max(0, Math.min(index, steps.length - 1));
  const step = steps[stepIndex];

  renderBars(step);
  renderLog();
  stepText.textContent = `步骤 ${stepIndex + 1} / ${steps.length}：${step.message}`;

  if (step.type === "done") {
    resultText.textContent = `排序结果：${step.array.join(", ")}`;
    stopPlaying();
  }
}

function startSort() {
  stopPlaying();

  const { numbers, error } = parseNumbers(numberInput.value);
  if (error) {
    resultText.textContent = error;
    stepText.textContent = "还没有开始排序";
    barsElement.innerHTML = "";
    logElement.innerHTML = "";
    steps = [];
    return;
  }

  const sorted = quicksort(numbers);
  resultText.textContent = `排序结果：${sorted.join(", ")}`;
  steps = buildQuicksortSteps(numbers);
  showStep(0);
}

function playSteps() {
  if (steps.length === 0) {
    startSort();
  }
  if (steps.length === 0) {
    return;
  }

  stopPlaying();
  playTimer = window.setInterval(() => {
    if (stepIndex >= steps.length - 1) {
      stopPlaying();
      return;
    }
    showStep(stepIndex + 1);
  }, PLAY_INTERVAL_MS);
}

toolbar.addEventListener("click", (event) => {
  const button = event.target.closest("[data-action]");
  if (!button) {
    return;
  }

  const action = button.getAttribute("data-action");
  if (action === "sort") {
    startSort();
  } else if (action === "play") {
    playSteps();
  } else if (action === "pause") {
    stopPlaying();
  } else if (action === "next") {
    stopPlaying();
    if (steps.length === 0) {
      startSort();
      return;
    }
    showStep(stepIndex + 1);
  } else if (action === "reset") {
    stopPlaying();
    numberInput.value = DEFAULT_NUMBERS;
    startSort();
  }
});

numberInput.value = DEFAULT_NUMBERS;
startSort();
