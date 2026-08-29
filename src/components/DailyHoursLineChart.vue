<template>
  <div class="relative h-64">
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
      borderColor: '#1F7A64',
      backgroundColor: 'rgba(31, 122, 100, 0.12)',
      pointBackgroundColor: '#1F7A64',
    })),
  }

  chartInstance = new Chart(canvasRef.value, {
    type: 'line',
    data: themedData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `上課時數：${ctx.parsed.y} 小時`,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            // 日期一多容易擠在一起，超過 8 筆就自動跳過部分標籤
            autoSkip: true,
            maxRotation: 45,
            minRotation: 0,
          },
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
