<template>
  <div class="min-h-screen font-body">
    <header class="border-b border-ink/10 bg-white/70 backdrop-blur-sm">
      <div
        class="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center lg:px-8"
      >
        <div>
          <p class="font-mono text-xs uppercase tracking-widest text-ink/50">
            出缺勤登記簿
          </p>
          <h1 class="mt-1 font-display text-3xl font-medium text-ink">
            Tina的出缺勤儀錶板
          </h1>
          <p class="mt-1 font-mono text-sm text-ink/50">
            Tina's Attendance Dashboard
          </p>
        </div>

        <div
          v-if="!isLoading && !error"
          class="stamp shrink-0 rounded-full border-2 border-ledger-red px-6 py-4 text-center"
          style="transform: rotate(-6deg)"
        >
          <p class="font-mono text-3xl font-bold leading-none text-ledger-red">
            {{ attendanceRate }}%
          </p>
          <p class="mt-1 font-mono text-[10px] uppercase tracking-wider text-ledger-red">
            出席達成
          </p>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <!-- 載入中 -->
      <div v-if="isLoading" class="flex h-64 items-center justify-center">
        <div class="flex flex-col items-center gap-3">
          <div
            class="h-10 w-10 animate-spin rounded-full border-4 border-ink/10 border-t-ledger-teal"
          />
          <p class="font-mono text-sm text-ink/50">資料載入中...</p>
        </div>
      </div>

      <!-- 載入失敗 -->
      <div
        v-else-if="error"
        class="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-ledger-red/30 bg-white px-6 text-center"
      >
        <p class="font-display font-medium text-ledger-red">資料載入失敗</p>
        <p class="font-mono text-sm text-ledger-red/70">{{ error }}</p>
        <button
          class="mt-2 rounded-lg bg-ledger-red px-4 py-2 text-sm font-medium text-white hover:bg-ledger-red/90"
          @click="loadAttendanceData"
        >
          重新載入
        </button>
      </div>

      <!-- 正常畫面 -->
      <div v-else class="space-y-8">
        <!-- 統計卡片 -->
        <section>
          <div class="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            <StatCard v-for="s in stats" :key="s.key" :stat="s" />
          </div>
        </section>

        <!-- 圖表區 -->
        <section class="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div class="rounded-xl border border-ink/10 bg-white p-5 lg:col-span-1">
            <h2 class="mb-4 font-display text-sm font-medium text-ink">出勤與缺勤比例</h2>
            <AttendancePieChart :chart-data="pieChartData" />
          </div>

          <div class="rounded-xl border border-ink/10 bg-white p-5 lg:col-span-2">
            <h2 class="mb-4 font-display text-sm font-medium text-ink">每日上課時數趨勢</h2>
            <DailyHoursLineChart :chart-data="lineChartData" />
          </div>

          <div class="rounded-xl border border-ink/10 bg-white p-5 lg:col-span-3">
            <h2 class="mb-4 font-display text-sm font-medium text-ink">每日在校時數分布</h2>
            <SchoolHoursBarChart :chart-data="barChartData" />
          </div>
        </section>
      </div>
    </main>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAttendanceData } from './composables/useAttendanceData.js'
import StatCard from './components/StatCard.vue'
import AttendancePieChart from './components/AttendancePieChart.vue'
import DailyHoursLineChart from './components/DailyHoursLineChart.vue'
import SchoolHoursBarChart from './components/SchoolHoursBarChart.vue'

const {
  isLoading,
  error,
  loadAttendanceData,
  stats,
  attendanceRate,
  pieChartData,
  lineChartData,
  barChartData,
} = useAttendanceData()

onMounted(() => {
  loadAttendanceData()
})
</script>