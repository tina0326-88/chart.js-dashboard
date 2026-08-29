<template>
  <div
    class="rounded-xl border-l-4 border-t border-r border-b border-t-ink/10 border-r-ink/10 border-b-ink/10 bg-white p-5"
    :class="theme.accent"
  >
    <p class="font-mono text-[11px] uppercase tracking-wider text-ink/45">
      {{ stat.label }}
    </p>

    <div class="mt-2 flex items-baseline gap-1">
      <span class="font-mono text-3xl font-bold tabular-nums" :class="theme.text">
        {{ formattedValue }}
      </span>
      <span class="font-mono text-sm text-ink/40">{{ stat.unit }}</span>
    </div>

    <div class="mt-3 h-1 w-full overflow-hidden rounded-full bg-ink/5">
      <div
        v-if="stat.unit === '%'"
        class="h-full rounded-full transition-all duration-700 ease-out"
        :class="theme.bar"
        :style="{ width: `${Math.min(displayValue, 100)}%` }"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useNumberAnimation } from '../composables/useNumberAnimation.js'

const props = defineProps({
  stat: {
    type: Object,
    required: true,
    // 預期格式：{ key, label, value, unit }
  },
})

// 依 key 對應「登記簿」色票，讓卡片一眼能分辨屬性
const themeMap = {
  scheduled: { accent: 'border-ink/30', text: 'text-ink', bar: 'bg-ink/30' },
  attended: { accent: 'border-ledger-teal', text: 'text-ledger-teal', bar: 'bg-ledger-teal' },
  absent: { accent: 'border-ledger-red', text: 'text-ledger-red', bar: 'bg-ledger-red' },
  late: { accent: 'border-ledger-amber', text: 'text-ledger-amber', bar: 'bg-ledger-amber' },
  leaveEarly: { accent: 'border-ledger-orange', text: 'text-ledger-orange', bar: 'bg-ledger-orange' },
  rate: { accent: 'border-ledger-deep', text: 'text-ledger-deep', bar: 'bg-ledger-deep' },
}

const theme = computed(() => themeMap[props.stat.key] ?? themeMap.scheduled)
const targetValue = computed(() => props.stat.value)
const { displayValue } = useNumberAnimation(targetValue, 800)
const formattedValue = computed(() => displayValue.value.toFixed(1))
</script>