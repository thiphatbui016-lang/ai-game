// 快速排序算法模块：负责划分、递归排序，以及生成可视化步骤
// 规则：以当前区间最右边的数字为基准，小的换到左边，再分别处理左右两段

/**
 * 对数字数组做快速排序，返回新数组，不修改原数组。
 * @param {number[]} nums
 * @returns {number[]}
 */
function quicksort(nums) {
  const copied = nums.slice();
  if (copied.length > 1) {
    quicksortRange(copied, 0, copied.length - 1);
  }
  return copied;
}

/**
 * 原地快速排序 nums[left..right]
 * @param {number[]} nums
 * @param {number} left
 * @param {number} right
 */
function quicksortRange(nums, left, right) {
  if (left >= right) {
    return;
  }

  const pivotIndex = partition(nums, left, right);
  quicksortRange(nums, left, pivotIndex - 1);
  quicksortRange(nums, pivotIndex + 1, right);
}

/**
 * Lomuto 划分：以 nums[right] 为基准，返回基准最终下标。
 * @param {number[]} nums
 * @param {number} left
 * @param {number} right
 * @returns {number}
 */
function partition(nums, left, right) {
  const pivot = nums[right];
  let store = left;

  for (let i = left; i < right; i += 1) {
    if (nums[i] <= pivot) {
      swap(nums, store, i);
      store += 1;
    }
  }

  swap(nums, store, right);
  return store;
}

/**
 * 交换数组中两个位置的值。
 * @param {number[]} nums
 * @param {number} i
 * @param {number} j
 */
function swap(nums, i, j) {
  if (i === j) {
    return;
  }
  const temp = nums[i];
  nums[i] = nums[j];
  nums[j] = temp;
}

/**
 * 生成可视化步骤。每一步都会带上当时的数组快照。
 * @param {number[]} nums
 * @returns {Array<{type: string, array: number[], left: number, right: number, pivotIndex: number, compareIndex: number, store: number, message: string}>}
 */
function buildQuicksortSteps(nums) {
  const working = nums.slice();
  const steps = [];

  steps.push({
    type: "start",
    array: working.slice(),
    left: 0,
    right: Math.max(working.length - 1, 0),
    pivotIndex: -1,
    compareIndex: -1,
    store: -1,
    message: working.length
      ? `准备排序：共 ${working.length} 个数字`
      : "数组是空的，没有需要排序的内容",
  });

  if (working.length <= 1) {
    steps.push({
      type: "done",
      array: working.slice(),
      left: 0,
      right: working.length - 1,
      pivotIndex: -1,
      compareIndex: -1,
      store: -1,
      message: "已经有序（0 个或 1 个数字不需要再排）",
    });
    return steps;
  }

  collectSteps(working, 0, working.length - 1, steps);

  steps.push({
    type: "done",
    array: working.slice(),
    left: 0,
    right: working.length - 1,
    pivotIndex: -1,
    compareIndex: -1,
    store: -1,
    message: "排序完成",
  });

  return steps;
}

/**
 * 递归收集划分过程，供页面逐步播放。
 * @param {number[]} nums
 * @param {number} left
 * @param {number} right
 * @param {object[]} steps
 */
function collectSteps(nums, left, right, steps) {
  if (left >= right) {
    return;
  }

  const pivot = nums[right];
  let store = left;

  steps.push({
    type: "choose-pivot",
    array: nums.slice(),
    left,
    right,
    pivotIndex: right,
    compareIndex: -1,
    store,
    message: `处理区间 [${left}, ${right}]，基准选最右边的 ${pivot}`,
  });

  for (let i = left; i < right; i += 1) {
    steps.push({
      type: "compare",
      array: nums.slice(),
      left,
      right,
      pivotIndex: right,
      compareIndex: i,
      store,
      message: `比较 ${nums[i]} 和基准 ${pivot}`,
    });

    if (nums[i] <= pivot) {
      swap(nums, store, i);
      steps.push({
        type: "swap",
        array: nums.slice(),
        left,
        right,
        pivotIndex: right,
        compareIndex: i,
        store,
        message: `${nums[store]} ≤ ${pivot}，放到左边区域`,
      });
      store += 1;
    }
  }

  swap(nums, store, right);
  steps.push({
    type: "place-pivot",
    array: nums.slice(),
    left,
    right,
    pivotIndex: store,
    compareIndex: -1,
    store,
    message: `基准 ${nums[store]} 放到最终位置下标 ${store}`,
  });

  collectSteps(nums, left, store - 1, steps);
  collectSteps(nums, store + 1, right, steps);
}
