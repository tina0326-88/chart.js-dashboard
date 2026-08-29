<template>
  <div class="relative h-72">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import Chart from 'chart.js/auto'

const props = defineProps({
  chartData: { type: Object, required: true },
})

const canvasRef = ref(null)
let chartInstance = null

function renderChart() {
  if (!canvasRef.value) return

  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }

  const themedData = {
    ...props.chartData,
    datasets: props.chartData.datasets.map((ds) => ({
      ...ds,
      backgroundColor: '#0F5445',
    })),
  }

  chartInstance = new Chart(canvasRef.value, {
    type: 'bar',
    data: themedData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `在校時數：${ctx.parsed.y} 小時`,
          },
        },
      },
      scales: {
        x: {
          ticks: { autoSkip: true, maxRotation: 45 },
        },
        y: {
          beginAtZero: true,
          title: { display: true, text: '小時' },
        },
      },
    },
  })
}

onMounted(renderChart)
watch(() => props.chartData, renderChart, { deep: true })

onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>