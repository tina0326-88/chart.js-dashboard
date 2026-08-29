import { ref, watch } from 'vue'

export function useNumberAnimation(sourceRef, duration = 800) {
  const displayValue = ref(0)
  let rafId = null

  function animateTo(target) {
    const start = displayValue.value
    const startTime = performance.now()

    if (rafId) cancelAnimationFrame(rafId)

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      displayValue.value = Number((start + (target - start) * eased).toFixed(1))

      if (progress < 1) {
        rafId = requestAnimationFrame(tick)
      } else {
        displayValue.value = target
        rafId = null
      }
    }

    rafId = requestAnimationFrame(tick)
  }

  watch(
    sourceRef,
    (newVal) => animateTo(Number(newVal) || 0),
    { immediate: true }
  )

  return { displayValue }
}