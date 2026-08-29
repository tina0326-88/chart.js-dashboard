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
      backgroundColor: ['#1F7A64', '#B23B2E'],
    })),
  }

  chartInstance = new Chart(canvasRef.value, {
    type: 'pie',
    data: themedData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { family: "'IBM Plex Mono', monospace", size: 11 } },
        },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.label}：${ctx.parsed} 小時`,
          },
        },
      },
    },
  })
}

onMounted(renderChart)

// 資料變化（重新載入 JSON）時，重新渲染圖表
watch(() => props.chartData, renderChart, { deep: true })

// 元件卸載前務必銷毀，避免殘留的 Chart 實例繼續佔用記憶體
onBeforeUnmount(() => {
  if (chartInstance) {
    chartInstance.destroy()
    chartInstance = null
  }
})
</script>
