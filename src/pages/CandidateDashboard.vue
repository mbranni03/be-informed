<template>
  <div class="midterm-console">
    <div class="console-container py-8 md:py-12">
      <div class="console-grid">
        <!-- Main Map Deck -->
        <div class="map-deck">
          <div class="deck-header">
            <div class="header-text">
              <h1 class="deck-title">Midterm <span class="gradient-text">Console</span></h1>
              <p class="deck-subtitle">
                Electoral Intelligence Framework
                <span class="divider"></span>
                Nov 2026
              </p>
            </div>
          </div>
          <USMap />

          <div class="projection-grid">
            <div class="projection-card group">
              <div class="icon-box blue">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
                  <polyline points="16 7 22 7 22 13"></polyline>
                </svg>
              </div>
              <h4 class="card-title">House Projection</h4>
              <p class="card-desc">
                Current models indicate a +4 shift in suburban districts across the Midwest. 12
                districts remain within the margin of error.
              </p>
            </div>
            <div class="projection-card group">
              <div class="icon-box red">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h4 class="card-title">Voter Deadline</h4>
              <p class="card-desc">
                Early registration closes in 42 days for most battleground states. Request your
                mail-in ballots before October 5th.
              </p>
            </div>
          </div>
        </div>

        <!-- Intel Sidebar -->
        <aside class="intel-sidebar">
          <div class="sidebar-wrapper">
            <!-- Profile Header -->
            <div class="sidebar-header">
              <h2 class="sidebar-title">{{ store.selectedState || 'United States' }}</h2>
              <div
                v-if="store.selectedStateName && store.selectedState"
                class="sidebar-subtitle-text"
              >
                {{ store.selectedStateName }}
              </div>
              <div class="title-underline"></div>
            </div>

            <!-- Tabs -->
            <div class="sidebar-tabs">
              <button
                v-for="tab in ['senate', 'house']"
                :key="tab"
                class="tab-btn"
                :class="{ active: activeTab === tab }"
                @click="activeTab = tab"
              >
                {{ tab }}
              </button>
            </div>

            <!-- District Filter Bar -->
            <div
              v-if="activeTab === 'house' && availableDistricts.length > 0"
              class="district-filter-bar"
            >
              <div class="filter-label">Districts</div>
              <div class="filter-scroll scrollbar-hide">
                <button
                  v-for="dist in availableDistricts"
                  :key="dist"
                  class="dist-chip"
                  :class="{ active: store.filters.district === dist }"
                  @click="store.setFilter('district', dist)"
                >
                  {{ dist }}
                </button>
              </div>
            </div>

            <!-- Content Area -->
            <div class="sidebar-content scrollbar-hide">
              <div v-if="store.loading" class="loading-state">
                <q-spinner-dots color="primary" size="40px" />
                <p>Retrieving Intelligence...</p>
              </div>

              <div v-else-if="store.error" class="error-state">
                <div class="error-icon">⚠️</div>
                <p class="error-title">Connection Error</p>
                <p class="error-desc">{{ store.error }}</p>
                <button class="retry-btn" @click="store.fetchCandidates(selectedState)">
                  Retry
                </button>
              </div>

              <div v-else-if="!selectedState" class="select-state-prompt">
                <div class="prompt-icon">📍</div>
                <p>Select a state on the map to begin intelligence briefing</p>
              </div>

              <div v-else-if="activeTab === 'senate'" class="content-stream">
                <template v-if="filteredCandidates.length > 0">
                  <div class="stream-label">
                    <div class="active-dot"></div>
                    <span>Active Candidates</span>
                  </div>
                  <div class="candidate-stack">
                    <CandidateCard
                      v-for="candidate in filteredCandidates"
                      :key="candidate.id"
                      :candidate="candidate"
                    />
                  </div>
                </template>
                <div v-else class="inactive-state">
                  <div class="inactive-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="12"></line>
                      <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                  </div>
                  <p class="inactive-title">Cycle Inactive</p>
                  <p class="inactive-desc">
                    The candidates for {{ selectedStateName || 'this region' }} are not currently
                    loaded or the cycle is inactive.
                  </p>
                </div>
              </div>

              <div v-else class="content-stream">
                <template v-if="filteredCandidates.length > 0">
                  <div class="candidate-stack">
                    <CandidateCard
                      v-for="candidate in filteredCandidates"
                      :key="candidate.id"
                      :candidate="candidate"
                    />
                  </div>
                </template>
                <div v-else class="inactive-state">
                  <div class="pulse-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                    </svg>
                  </div>
                  <p class="pending-title">District Data Pending</p>
                  <p class="pending-desc">
                    Local boundary verification in progress for the 2026 cycle for
                    {{ selectedStateName }}.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import USMap from 'src/components/USMap.vue'
import CandidateCard from 'components/candidates/CandidateCard.vue'
import { useElectionStore } from 'stores/election-store'
const store = useElectionStore()
const activeTab = ref('senate')

const selectedState = computed(() => store.selectedState)
const selectedStateName = computed(() => store.selectedStateName)

const availableDistricts = computed(() => {
  if (!selectedState.value) return []
  const districts = store.candidates
    .filter((c) => c.state === selectedState.value && c.office.toLowerCase() === 'house')
    .map((c) => c.district)
    .filter((d) => d !== undefined && d !== null && d !== '')

  const uniqueDistricts = [...new Set(districts)].sort((a, b) => {
    const numA = parseInt(a) || 0
    const numB = parseInt(b) || 0
    return numA - numB
  })

  return uniqueDistricts
})

// Set default district when switching to house or when available districts change
watch(
  [activeTab, availableDistricts],
  ([newTab, districts]) => {
    if (newTab === 'house') {
      // If no district is selected or the current one isn't available, default to '1' or the first one
      const currentDist = store.filters.district
      const hasCurrent = districts.some((d) => d == currentDist)

      if (!hasCurrent || currentDist === 'all') {
        const defaultDist = districts.find((d) => d == '1' || d == '01') || districts[0] || '1'
        store.setFilter('district', defaultDist)
      }
    } else {
      store.setFilter('district', 'all')
    }
  },
  { immediate: true },
)

// Keep filteredCandidates logic, but ensure it filters by activeTab and district
const filteredCandidates = computed(() => {
  return store.candidates.filter((c) => {
    const matchesState = !selectedState.value || c.state === selectedState.value
    const matchesOffice = c.office.toLowerCase() === activeTab.value
    const matchesDistrict = activeTab.value !== 'house' || c.district == store.filters.district
    return matchesState && matchesOffice && matchesDistrict
  })
})
</script>

<style scoped>
.midterm-console {
  background-color: #fafafa;
  min-height: 100vh;
}

.console-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  align-items: start;
}

@media (min-width: 1024px) {
  .console-grid {
    grid-template-columns: repeat(12, 1fr);
    gap: 2rem;
  }
}

.console-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .console-container {
    padding: 0 2rem;
  }
}

.map-deck {
  grid-column: span 12;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .map-deck {
    grid-column: span 8;
  }
}

.deck-header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .deck-header {
    flex-direction: row;
    align-items: flex-end;
  }
}

.deck-title {
  font-size: 2.5rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  font-style: italic;
  line-height: 1;
  color: #111827;
}

@media (min-width: 768px) {
  .deck-title {
    font-size: 3rem;
  }
}

.deck-subtitle {
  color: #9ca3af;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.divider {
  height: 1px;
  width: 3rem;
  background-color: #e5e7eb;
}

.projection-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .projection-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.projection-card {
  background: white;
  padding: 2rem;
  border-radius: 1.875rem;
  border: 1px solid #f3f4f6;
  transition: all 0.3s;
}

.projection-card:hover {
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.08);
}

.icon-box {
  width: 3rem;
  height: 3rem;
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s;
}

.icon-box.blue {
  background-color: #eff6ff;
  color: var(--blue-600);
}

.projection-card:hover .icon-box.blue {
  background-color: var(--blue-600);
  color: white;
}

.icon-box.red {
  background-color: #fef2f2;
  color: var(--red-600);
}

.projection-card:hover .icon-box.red {
  background-color: var(--red-600);
  color: white;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: -0.025em;
  margin-bottom: 0.5rem;
}

.card-desc {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.625;
}

/* Sidebar Styling */
.intel-sidebar {
  grid-column: span 12;
}

@media (min-width: 1024px) {
  .intel-sidebar {
    grid-column: span 4;
    position: sticky;
    top: 7rem;
  }
}

@media (min-width: 1024px) {
  .intel-sidebar {
    position: sticky;
    top: 7rem;
  }
}

.sidebar-wrapper {
  background: white;
  border-radius: 2.5rem;
  box-shadow: 0 32px 64px -24px rgba(0, 0, 0, 0.1);
  border: 1px solid #f3f4f6;
  overflow: hidden;
  height: clamp(600px, 80vh, 900px);
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 1.5rem;
  padding-bottom: 1rem;
  background: linear-gradient(to bottom, #f9fafb, white);
}

@media (min-width: 1440px) {
  .sidebar-header {
    padding: 2.5rem;
    padding-bottom: 1.5rem;
  }
}

.sidebar-title {
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: #111827;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.sidebar-subtitle-text {
  font-size: 14px;
  font-weight: 700;
  color: #6b7280;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

@media (min-width: 1440px) {
  .sidebar-title {
    font-size: 3rem;
  }
}

.title-underline {
  height: 0.25rem;
  width: 5rem;
  background-color: var(--blue-600);
  border-radius: 9999px;
}

.sidebar-tabs {
  display: flex;
  padding: 0 1.5rem;
  border-bottom: 1px solid #f3f4f6;
}

@media (min-width: 1440px) {
  .sidebar-tabs {
    padding: 0 2.5rem;
  }
}

.tab-btn {
  margin-right: 2rem;
  padding: 1.25rem 0;
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #d1d5db;
  border-bottom: 4px solid transparent;
  transition: all 0.2s;
}

.tab-btn.active {
  border-bottom-color: var(--blue-600);
  color: #111827;
}

.tab-btn:hover:not(.active) {
  color: #9ca3af;
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

@media (min-width: 1440px) {
  .sidebar-content {
    padding: 2.5rem;
  }
}

.district-filter-bar {
  padding: 1rem 1.5rem;
  background-color: #f9fafb;
  border-bottom: 1px solid #f3f4f6;
  display: flex;
  align-items: center;
  gap: 1rem;
}

@media (min-width: 1440px) {
  .district-filter-bar {
    padding: 1rem 2.5rem;
  }
}

.filter-label {
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #9ca3af;
  white-space: nowrap;
}

.filter-scroll {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding: 0.25rem 0;
}

.dist-chip {
  padding: 0.375rem 1rem;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 9999px;
  font-size: 11px;
  font-weight: 700;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.dist-chip:hover {
  border-color: #d1d5db;
  color: #111827;
}

.dist-chip.active {
  background: #111827;
  border-color: #111827;
  color: white;
}

.stream-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.active-dot {
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--blue-500);
  border-radius: 9999px;
}

.stream-label span {
  font-size: 10px;
  font-weight: 900;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.candidate-stack {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.inactive-state {
  padding: 6rem 0;
  text-align: center;
}

.inactive-icon {
  width: 6rem;
  height: 6rem;
  background-color: #f9fafb;
  border-radius: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  border: 1px dashed #e5e7eb;
  color: #d1d5db;
}

.inactive-title {
  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: -0.025em;
  color: #111827;
}

.inactive-desc {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 0.5rem;
  max-width: 12rem;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.625;
}

.pulse-icon {
  width: 5rem;
  height: 5rem;
  background-color: #eff6ff;
  color: #60a5fa;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  animation: pulse-blue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-blue {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(0.95);
    opacity: 0.8;
  }
}

.pending-title {
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #111827;
  margin-top: 1.5rem;
}

.pending-desc {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 0.5rem;
  padding: 0 2rem;
  line-height: 1.625;
}

.loading-state,
.error-state,
.select-state-prompt {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 2rem;
}

.loading-state p {
  margin-top: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-size: 12px;
  color: #9ca3af;
}

.error-icon,
.prompt-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-title {
  font-weight: 900;
  font-size: 1.25rem;
  color: #111827;
}

.error-desc {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
}

.retry-btn {
  background: #111827;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
}

.retry-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.select-state-prompt p {
  font-weight: 700;
  color: #9ca3af;
  font-size: 14px;
  max-width: 15rem;
  line-height: 1.5;
}
</style>
