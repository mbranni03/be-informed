<template>
  <div class="midterm-status-card group">
    <div class="status-summary">
      <div class="summary-item">
        <h3 class="status-title">Congress <span class="gradient-text">Balance</span></h3>
        <p class="status-subtitle">{{ seatsData.election_cycle }} Midterm Overview</p>
      </div>
      <div class="last-updated">Refreshed: {{ seatsData.last_updated }}</div>
    </div>

    <div class="chambers-stack">
      <!-- Senate -->
      <div class="chamber-row compact">
        <div class="chamber-header">
          <div class="chamber-meta">
            <span class="chamber-label">Senate</span>
            <div class="exposure-pills">
              <span class="pill contested"
                >{{ seatsData.chambers.senate.total_seats_up }} Contested</span
              >
              <span class="pill open">{{ seatsData.chambers.senate.open_seats.total }} Open</span>
            </div>
          </div>
          <span class="majority-threshold">51 Target</span>
        </div>

        <div class="progress-container">
          <div class="progress-track">
            <div
              class="progress-segment dem"
              :style="{
                width:
                  getSenatePercent(seatsData.chambers.senate.partisan_breakdown.democrats) + '%',
              }"
            >
              <span class="val">{{ seatsData.chambers.senate.partisan_breakdown.democrats }}</span>
            </div>
            <div
              class="progress-segment ind"
              :style="{
                width:
                  getSenatePercent(seatsData.chambers.senate.partisan_breakdown.independents) + '%',
              }"
            >
              <span class="val">{{
                seatsData.chambers.senate.partisan_breakdown.independents
              }}</span>
            </div>
            <div
              class="progress-segment rep"
              :style="{
                width:
                  getSenatePercent(seatsData.chambers.senate.partisan_breakdown.republicans) + '%',
              }"
            >
              <span class="val">{{
                seatsData.chambers.senate.partisan_breakdown.republicans
              }}</span>
            </div>
            <div class="majority-marker" style="left: 50%"></div>
          </div>
        </div>
      </div>

      <!-- House -->
      <div class="chamber-row compact">
        <div class="chamber-header">
          <div class="chamber-meta">
            <span class="chamber-label">House</span>
            <div class="exposure-pills">
              <span class="pill contested"
                >{{ seatsData.chambers.house.total_seats_up }} Contested</span
              >
              <span class="pill open">{{ seatsData.chambers.house.open_seats.total }} Open</span>
            </div>
          </div>
          <span class="majority-threshold">218 Target</span>
        </div>

        <div class="progress-container">
          <div class="progress-track">
            <div
              class="progress-segment dem"
              :style="{
                width: getHousePercent(seatsData.chambers.house.partisan_breakdown.democrats) + '%',
              }"
            >
              <span class="val">{{ seatsData.chambers.house.partisan_breakdown.democrats }}</span>
            </div>
            <div
              class="progress-segment vac"
              :style="{
                width: getHousePercent(seatsData.chambers.house.partisan_breakdown.vacant) + '%',
              }"
            ></div>
            <div
              class="progress-segment rep"
              :style="{
                width:
                  getHousePercent(seatsData.chambers.house.partisan_breakdown.republicans) + '%',
              }"
            >
              <span class="val">{{ seatsData.chambers.house.partisan_breakdown.republicans }}</span>
            </div>
            <div class="majority-marker" style="left: 50.1%"></div>
          </div>
        </div>
      </div>

      <div class="compact-legend">
        <div class="leg-item"><span class="dot dem"></span> Dem</div>
        <div class="leg-item"><span class="dot ind"></span> Ind</div>
        <div class="leg-item"><span class="dot rep"></span> Rep</div>
        <div class="leg-item"><span class="dot vac"></span> Vacant</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import seatsData from 'src/constants/seats.json'

const getSenatePercent = (count) => (count / 100) * 100
const getHousePercent = (count) => (count / 435) * 100
</script>

<style scoped>
.midterm-status-card {
  background: white;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #f3f4f6;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.midterm-status-card:hover {
  border-color: #e5e7eb;
  transform: translateY(-2px);
  box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.05);
}

.status-summary {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.status-title {
  font-size: 1.125rem;
  font-weight: 900;
  letter-spacing: -0.025em;
  color: #111827;
  text-transform: uppercase;
}

.gradient-text {
  background: linear-gradient(135deg, #6366f1, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.status-subtitle {
  font-size: 10px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.last-updated {
  font-size: 9px;
  font-weight: 800;
  color: #d1d5db;
  text-transform: uppercase;
}

.chambers-stack {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.chamber-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.chamber-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.chamber-label {
  font-size: 11px;
  font-weight: 800;
  color: #4b5563;
  text-transform: uppercase;
}

.exposure-pills {
  display: flex;
  gap: 0.375rem;
}

.pill {
  font-size: 9px;
  font-weight: 800;
  padding: 1px 6px;
  border-radius: 9999px;
  text-transform: uppercase;
}

.pill.contested {
  background: #fef9c3;
  color: #854d0e;
  border: 1px solid #fde047;
}

.pill.open {
  background: #fdf2f8;
  color: #9d174d;
  border: 1px solid #fbcfe8;
}

.majority-threshold {
  font-size: 10px;
  font-weight: 700;
  color: #9ca3af;
}

.progress-track {
  height: 1rem;
  background: #f3f4f6;
  border-radius: 4px;
  display: flex;
  overflow: hidden;
  position: relative;
}

.progress-segment {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-segment.dem {
  background: #3b82f6;
}
.progress-segment.rep {
  background: #ef4444;
}
.progress-segment.ind {
  background: #10b981;
}
.progress-segment.vac {
  background: #e5e7eb;
}

.val {
  font-size: 9px;
  font-weight: 900;
  color: white;
}

.majority-marker {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(0, 0, 0, 0.15);
  z-index: 10;
}

.compact-legend {
  display: flex;
  justify-content: center;
  gap: 1.25rem;
  margin-top: 1rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f3f4f6;
}

.leg-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 9px;
  font-weight: 800;
  color: #9ca3af;
  text-transform: uppercase;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.dot.dem {
  background: #3b82f6;
}
.dot.rep {
  background: #ef4444;
}
.dot.ind {
  background: #10b981;
}
.dot.vac {
  background: #e5e7eb;
}
</style>
