/**
 * Quicksort (in-place) with Lomuto partition.
 * Average: O(n log n), Worst: O(n^2) when already sorted with poor pivot.
 * Stable: no. Space: O(log n) recursion.
 */
export function quicksort(array) {
  if (!Array.isArray(array)) throw new TypeError('quicksort expects an array')
  const a = array
  sort(a, 0, a.length - 1)
  return a
}

function sort(a, lo, hi) {
  if (lo >= hi) return
  const p = partition(a, lo, hi)
  sort(a, lo, p - 1)
  sort(a, p + 1, hi)
}

function partition(a, lo, hi) {
  const pivot = a[hi]
  let i = lo
  for (let j = lo; j < hi; j++) {
    if (a[j] <= pivot) {
      ;[a[i], a[j]] = [a[j], a[i]]
      i++
    }
  }
  ;[a[i], a[hi]] = [a[hi], a[i]]
  return i
}

// Example usage:
// quicksort([3,1,4,1,5,9])


