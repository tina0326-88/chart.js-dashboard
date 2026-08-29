import { ref, computed } from 'vue'

// 讀取並處理出缺勤資料，資料來源：public/attendance_log.json
export function useAttendanceData() {
  const records = ref([])
  const isLoading = ref(true)
  const error = ref(null)

  async function loadAttendanceData() {
    isLoading.value = true
    error.value = null
    try {
      const res = await fetch('/attendance_log.json')
      if (!res.ok) throw new Error(`資料載入失敗 (HTTP ${res.status})`)
      records.value = await res.json()
    } catch (e) {
      error.value = e.message || '資料載入失敗'
      records.value = []
    } finally {
      isLoading.value = false
    }
  }

  const sortedRecords = computed(() =>
    [...records.value].sort((a, b) => new Date(a.date) - new Date(b.date))
  )

  const sumBy = (key) =>
    records.value.reduce((acc, r) => acc + (Number(r[key]) || 0), 0)

  const totalScheduledHours = computed(() => sumBy('scheduledHours'))
  const totalAttendedHours = computed(() => sumBy('attendedHours'))
  const totalAbsentHours = computed(() => sumBy('absentHours'))
  const totalLateHours = computed(() => sumBy('lateHours'))
  const totalLeaveEarlyHours = computed(() => sumBy('leaveEarlyHours'))

  // 出勤比率 = 實際上課時數 ÷ 總課程時數
  const attendanceRate = computed(() => {
    if (totalScheduledHours.value === 0) return 0
    return Number(
      ((totalAttendedHours.value / totalScheduledHours.value) * 100).toFixed(1)
    )
  })

  // 給 StatCard 用的統計卡片資料
  const stats = computed(() => [
    { key: 'scheduled', label: '總課程時數', value: totalScheduledHours.value, unit: '小時' },
    { key: 'attended', label: '實際上課時數', value: totalAttendedHours.value, unit: '小時' },
    { key: 'absent', label: '缺席時數', value: totalAbsentHours.value, unit: '小時' },
    { key: 'late', label: '遲到時數', value: totalLateHours.value, unit: '小時' },
    { key: 'leaveEarly', label: '早退時數', value: totalLeaveEarlyHours.value, unit: '小時' },
    { key: 'rate', label: '出勤比率', value: attendanceRate.value, unit: '%' },
  ])

  // 給圓餅圖用：出勤 vs 缺勤（以時數計算）
  const pieChartData = computed(() => ({
    labels: ['出勤時數', '缺勤時數'],
    datasets: [
      {
        data: [totalAttendedHours.value, totalAbsentHours.value],
        backgroundColor: ['#4FC08D', '#FF6384'],
        borderWidth: 0,
      },
    ],
  }))

  // 給折線圖用：每日上課（實際到課）時數趨勢 
  const lineChartData = computed(() => ({
    labels: sortedRecords.value.map((r) => r.date),
    datasets: [
      {
        label: '每日上課時數',
        data: sortedRecords.value.map((r) => Number(r.attendedHours) || 0),
        borderColor: '#4FC08D',
        backgroundColor: 'rgba(79, 192, 141, 0.15)',
        tension: 0.3,
        fill: true,
      },
    ],
  }))

  // 給長條圖用：每日在校時數分布
  const barChartData = computed(() => ({
    labels: sortedRecords.value.map((r) => r.date),
    datasets: [
      {
        label: '每日在校時數',
        data: sortedRecords.value.map((r) => Number(r.schoolHours) || 0),
        backgroundColor: '#38B2AC',
      },
    ],
  }))

  return {
    records,
    sortedRecords,
    isLoading,
    error,
    loadAttendanceData,
    stats,
    attendanceRate,
    pieChartData,
    lineChartData,
    barChartData,
  }
}