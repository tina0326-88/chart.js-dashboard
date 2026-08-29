# 個人出缺勤儀表板 Personal Attendance Dashboard

[![Vue.js](https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chart.js&logoColor=white)](https://www.chartjs.org/)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

## 專案簡介

本專案是以 **Vue 3 + Vite + Tailwind CSS + Chart.js** 打造的出缺勤資料視覺化工具。讀入課程出缺勤紀錄後，自動計算總時數、出勤率、遲到早退等統計數字，並以圓餅圖、折線圖、長條圖呈現趨勢與分布，介面採響應式設計，桌面與行動裝置皆可流暢瀏覽。

## 專案特色

不只是把資料套進圖表模板，而是針對出缺勤資料的實際特性做了幾個工程上的處理：

- 真實資料轉換流程：內建從 phpMyAdmin JSON 匯出格式轉換為前端可用資料的腳本，並用加總後的數字回頭核對原始彙總表，確保轉換過程沒有算錯或漏資料。
- 防禦性日期排序：折線圖與長條圖不直接吃 JSON 原始順序，而是先依 `date` 排序，避免之後手動新增資料時因為插入順序不對導致趨勢圖跑掉。
- 圖表生命週期管理：Chart.js 實例在資料更新前會先手動銷毀再重建，避免 Vue 響應式更新下常見的記憶體洩漏與圖表殘影問題。
- 自訂數字動畫引擎：`useNumberAnimation.js` 用 `requestAnimationFrame` 搭配 ease-out cubic 緩動函式，讓統計卡片數字有自然的「漸慢停止」手感，而非單純的線性跳動。
- 邏輯與畫面分離：所有資料運算（加總、比率、圖表格式化）集中在 composables 裡以 `computed` 處理，元件只負責渲染，資料來源或欄位有變動時只需改一個地方。

## 核心功能

### 資料視覺化
- 統計卡片：總課程時數、實際上課時數、缺席時數、遲到時數、早退時數、出勤比率
- 圓餅圖：出勤與缺勤比例一目瞭然
- 折線圖：每日上課時數趨勢
- 長條圖：每日在校時數分布

### 互動體驗
- 即時資料載入：自動讀取 `public/attendance_log.json`
- 平滑過渡動畫：圖表更新與統計數字皆有動畫效果
- 響應式版面：完美適配桌面與行動裝置

### 資料管理
- JSON 資料來源：內建 `attendance_log.json` 測試資料，可自行替換
- 邏輯與 UI 分離：透過 composables 集中處理資料轉換

## 技術架構與實作細節

- 前端框架：Vue 3（Composition API）
- CSS 框架：Tailwind CSS
- 圖表庫：Chart.js（原生 API，`chart.js/auto`）
- 建置工具：Vite
- 部署：Vercel

**幾個實作上值得一提的地方：**

- 資料轉換集中化：原始 JSON 資料透過 `useAttendanceData.js` 統一處理，將出缺勤紀錄轉換為圖表可用的格式，UI 元件不需關心資料清洗邏輯。
- 圖表實例的生命週期管理：Chart.js 在 Vue 的響應式更新下，若不手動銷毀舊實例，容易造成記憶體洩漏或圖表殘影。專案中透過 `watch` 監聽資料變化，並在重新渲染前先銷毀舊的 Chart 實例再重建，確保圖表資料與畫面始終同步。
- 數字動畫：統計卡片的數值並非直接顯示，而是透過 `useNumberAnimation.js` 做平滑遞增動畫，提升數據呈現的互動感。

## 資料格式範例

`attendance_log.json` 為陣列，每筆代表一天的出缺勤紀錄，欄位如下：

```json
[
  {
    "id": 22,
    "name": "Tina",
    "date": "2025-04-15",
    "scheduledHours": 6,
    "schoolHours": 0,
    "attendedHours": 0,
    "lateHours": 0,
    "leaveEarlyHours": 0,
    "absentHours": 6
  },
  {
    "id": 44,
    "name": "Tina",
    "date": "2025-04-16",
    "scheduledHours": 6,
    "schoolHours": 7.5,
    "attendedHours": 6,
    "lateHours": 0,
    "leaveEarlyHours": 0,
    "absentHours": 0
  }
]
```

| 欄位 | 說明 |
|---|---|
| `id` | 紀錄編號 |
| `name` | 姓名 |
| `date` | 上課日期 |
| `scheduledHours` | 排定課程時數 |
| `schoolHours` | 在校時數（含休息、加時） |
| `attendedHours` | 實際上課時數 |
| `lateHours` | 遲到時數 |
| `leaveEarlyHours` | 早退時數 |
| `absentHours` | 缺席時數 |

原始資料若是從 phpMyAdmin 匯出（`class_date`、`class_hours`、`raw_hours`⋯⋯等欄位名），需先轉換成上述格式才能被 `useAttendanceData.js` 正確解析。

## 專案架構

```
chart.js-dashboard/
├── public/
│   └── attendance_log.json      # 出缺勤資料 (JSON 格式)
├── src/
│   ├── components/              # 儀表板元件
│   │   ├── StatCard.vue
│   │   ├── AttendancePieChart.vue
│   │   ├── DailyHoursLineChart.vue
│   │   └── SchoolHoursBarChart.vue
│   ├── composables/             # 可重用邏輯
│   │   ├── useAttendanceData.js
│   │   └── useNumberAnimation.js
│   ├── App.vue                  # 主頁面
│   ├── main.js                  # 入口
│   └── style.css                # Tailwind 樣式
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 安裝與啟動

```bash
# 1. Clone 專案
git clone https://github.com/tinachen0326/chart.js-dashboard.git
cd chart.js-dashboard

# 2. 安裝依賴
npm install

# 3. 啟動開發伺服器
npm run dev

# 4. 瀏覽應用
# 開啟 http://localhost:5173
```

## 建置部署

```bash
# 產生生產版本
npm run build

# 預覽建置結果
npm run preview
```

## 未來優化

- [ ] 資料匯出功能（Excel / PDF）
- [ ] 日間 / 夜間主題切換
- [ ] CRUD：新增、編輯、刪除出勤紀錄

## 版權聲明

此專案僅供個人學習與紀錄使用，無授權任何學習教材用途與商業用途。

## 致謝

感謝所有為這個專案提供建議和協助的人。