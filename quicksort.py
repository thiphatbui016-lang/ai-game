# 快速排序（Quick Sort）的 Python 实现
# 规则：选一个基准，小的放左边、大的放右边，再对左右两边递归排序

from typing import List, Tuple


def partition(nums: List[int], left: int, right: int) -> int:
    """
    划分：以最右边的数字为基准。
    扫描 [left, right)，把小于基准的数字换到左边，
    最后把基准放到「中间」正确位置，并返回这个位置。
    """
    pivot = nums[right]
    store = left

    for i in range(left, right):
        if nums[i] <= pivot:
            nums[store], nums[i] = nums[i], nums[store]
            store += 1

    nums[store], nums[right] = nums[right], nums[store]
    return store


def quicksort_range(nums: List[int], left: int, right: int) -> None:
    """对 nums[left:right+1] 这一段做原地快速排序。"""
    if left >= right:
        return

    pivot_index = partition(nums, left, right)
    quicksort_range(nums, left, pivot_index - 1)
    quicksort_range(nums, pivot_index + 1, right)


def quicksort(nums: List[int]) -> List[int]:
    """
    对数字列表做快速排序，返回排好序的新列表。
    原列表不会被修改。
    """
    copied = list(nums)
    if copied:
        quicksort_range(copied, 0, len(copied) - 1)
    return copied


def parse_numbers(text: str) -> Tuple[List[int], str]:
    """把 '8, 3 9 1' 这类文字解析成整数列表。失败时返回错误说明。"""
    pieces = text.replace(",", " ").split()
    if not pieces:
        return [], "请至少输入一个数字"

    numbers = []
    for piece in pieces:
        try:
            numbers.append(int(piece))
        except ValueError:
            return [], f"无法识别的内容：{piece}"
    return numbers, ""


def main() -> None:
    samples = [
        [8, 3, 9, 1, 5, 2],
        [1],
        [],
        [5, 5, 5, 5],
        [9, 8, 7, 6, 5],
    ]

    print("快速排序演示")
    print("-" * 28)
    for sample in samples:
        print(f"原数组: {sample}")
        print(f"排序后: {quicksort(sample)}")
        print("-" * 28)

    try:
        user_text = input("也可以自己输入数字（用空格或逗号隔开，直接回车跳过）：").strip()
    except EOFError:
        return

    if not user_text:
        return

    numbers, error = parse_numbers(user_text)
    if error:
        print(error)
        return

    print(f"原数组: {numbers}")
    print(f"排序后: {quicksort(numbers)}")


if __name__ == "__main__":
    main()
