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
              <!-- State Indicator -->
              <div v-if="store.userState" class="state-badge">
                <span class="badge-dot"></span>
                <span>Your Location: {{ store.userState }}</span>
              </div>
            </div>
            <div class="header-tools">
              <div class="zip-search">
                <div class="search-label">Local Intelligence</div>
                <div class="zip-input-group compact">
                  <div v-if="store.userZip" class="user-zip-tag">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    {{ store.userZip }}
                  </div>
                  <input
                    v-model="zipCode"
                    type="text"
                    placeholder="Search Zip Code"
                    class="zip-input"
                    maxlength="5"
                    @keyup.enter="handleZipSubmit"
                  />
                  <button
                    v-if="store.userZip && selectedState !== store.userState"
                    class="zip-reset"
                    @click="store.lookupByZip(store.userZip)"
                    title="Reset to Home"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <polyline points="23 4 23 10 17 10"></polyline>
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
                    </svg>
                  </button>
                  <button class="zip-submit" @click="handleZipSubmit" :disabled="store.loading">
                    <svg
                      v-if="!store.loading"
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="11" cy="11" r="8"></circle>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <q-spinner v-else size="16px" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <USMap />

          <div class="status-section mb-6">
            <MidtermStatus />
          </div>
        </div>

        <!-- Intel Sidebar -->
        <aside class="intel-sidebar">
          <div class="sidebar-wrapper">
            <!-- Profile Header -->
            <div class="sidebar-header">
              <h2 class="sidebar-title">
                {{
                  activeTab === 'local' ? store.userState : store.selectedState || 'United States'
                }}
              </h2>
              <div
                v-if="activeTab !== 'local' && store.selectedStateName && store.selectedState"
                class="sidebar-subtitle-text"
              >
                {{ store.selectedStateName }}
              </div>
              <div v-else-if="activeTab === 'local' && store.userDistrict" class="location-banner">
                <span class="banner-label">District</span>
                <span class="banner-value">{{ store.userDistrict }}</span>
              </div>
              <div class="title-underline"></div>
            </div>

            <!-- Tabs -->
            <div class="sidebar-tabs">
              <button
                class="tab-btn"
                :class="{ active: activeTab === 'senate' }"
                @click="activeTab = 'senate'"
              >
                Senate
              </button>
              <button
                class="tab-btn"
                :class="{ active: activeTab === 'house' }"
                @click="activeTab = 'house'"
              >
                House
              </button>
              <button
                v-if="store.userState"
                class="tab-btn"
                :class="{ active: activeTab === 'local' }"
                @click="activeTab = 'local'"
              >
                My Location
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
                  class="dist-chip"
                  :class="{ active: store.filters.district === 'all' }"
                  @click="store.setFilter('district', 'all')"
                >
                  All
                </button>
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
              <!-- Current Legislators Section -->
              <div
                v-if="activeTab === 'local' && store.currentLegislators.length > 0"
                class="current-legislators-section mb-8"
              >
                <div class="stream-label">
                  <div class="active-dot gray"></div>
                  <span>Current Representatives</span>
                </div>
                <div class="legislator-grid">
                  <div
                    v-for="leg in store.currentLegislators"
                    :key="leg.references.bioguide_id"
                    class="legislator-mini-card"
                  >
                    <div class="leg-avatar-container" v-if="leg.bio.photo_url">
                      <img
                        :src="leg.bio.photo_url"
                        :alt="leg.bio.last_name"
                        class="leg-avatar-img"
                      />
                    </div>
                    <div class="leg-info">
                      <div class="leg-name">{{ leg.bio.first_name }} {{ leg.bio.last_name }}</div>
                      <div class="leg-office">{{ leg.type }}</div>
                    </div>
                    <div class="leg-party" :class="leg.bio.party?.toLowerCase()">
                      {{ leg.bio.party?.[0] || 'I' }}
                    </div>
                  </div>
                </div>
              </div>

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

              <div v-if="activeTab === 'senate'" class="content-stream">
                <template v-if="regionalSenate.length > 0">
                  <div class="stream-label">
                    <div class="active-dot"></div>
                    <span>Active Candidates</span>
                  </div>
                  <div class="candidate-stack">
                    <CandidateCard
                      v-for="candidate in regionalSenate"
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
                    The senators for {{ selectedStateName || 'this region' }} are not currently
                    loaded or the cycle is inactive.
                  </p>
                </div>
              </div>

              <div v-else-if="activeTab === 'house'" class="content-stream">
                <template v-if="regionalHouse.length > 0">
                  <div class="stream-label">
                    <div class="active-dot blue"></div>
                    <span v-if="store.filters.district !== 'all'"
                      >District {{ store.filters.district }}</span
                    >
                    <span v-else>All Districts</span>
                  </div>
                  <div class="candidate-stack">
                    <CandidateCard
                      v-for="candidate in regionalHouse"
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

              <div v-else-if="activeTab === 'local'" class="content-stream">
                <!-- Local Senate Section -->
                <template v-if="localSenate.length > 0">
                  <div class="stream-label">
                    <div class="active-dot"></div>
                    <span>Your U.S. Senators</span>
                  </div>
                  <div class="candidate-stack mb-8">
                    <CandidateCard
                      v-for="candidate in localSenate"
                      :key="candidate.id"
                      :candidate="candidate"
                    />
                  </div>
                </template>

                <!-- Local House Section -->
                <template v-if="localHouse.length > 0">
                  <div class="stream-label">
                    <div class="active-dot blue"></div>
                    <span>Your District: {{ store.userDistrict }}</span>
                  </div>
                  <div class="candidate-stack">
                    <CandidateCard
                      v-for="candidate in localHouse"
                      :key="candidate.id"
                      :candidate="candidate"
                    />
                  </div>
                </template>

                <!-- No local candidates fallback -->
                <div
                  v-if="localSenate.length === 0 && localHouse.length === 0"
                  class="inactive-state"
                >
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
                  <p class="inactive-title">No Local Elections</p>
                  <p class="inactive-desc">
                    There are no active midterm elections scheduled for your specific district in
                    the 2026 cycle.
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
import { ref, computed, watch, onMounted } from 'vue'
import USMap from 'src/components/USMap.vue'
import MidtermStatus from 'src/components/MidtermStatus.vue'
import CandidateCard from 'components/candidates/CandidateCard.vue'
import { useElectionStore } from 'stores/election-store'
const store = useElectionStore()
const activeTab = ref('senate')
const zipCode = ref('')

onMounted(async () => {
  await store.initFromCookies()
  if (store.userZip) {
    zipCode.value = store.userZip
    activeTab.value = 'local'
  }
})

const handleZipSubmit = async () => {
  if (!zipCode.value || zipCode.value.length < 5) return

  try {
    await store.lookupByZip(zipCode.value)
    activeTab.value = 'local'
  } catch (err) {
    console.error('Zip lookup failed', err)
  }
}

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
  [selectedState, availableDistricts],
  () => {
    // Reset district filter when state changes
    store.setFilter('district', 'all')
  },
  { immediate: true },
)

const regionalSenate = computed(() => {
  return store.candidates.filter(
    (c) => c.state === selectedState.value && c.office.toLowerCase() === 'senate',
  )
})

const regionalHouse = computed(() => {
  return store.candidates.filter((c) => {
    const matchesState = c.state === selectedState.value
    const isHouse = c.office.toLowerCase() === 'house'
    const matchesDistrict = store.filters.district === 'all' || c.district == store.filters.district
    return matchesState && isHouse && matchesDistrict
  })
})

const localSenate = computed(() => {
  return store.localCandidates.filter(
    (c) => c.state === store.userState && c.office.toLowerCase() === 'senate',
  )
})

const localHouse = computed(() => {
  return store.localCandidates.filter(
    (c) =>
      c.state === store.userState &&
      c.office.toLowerCase() === 'house' &&
      c.district == store.userDistrict,
  )
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

.state-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 9999px;
  margin-top: 1rem;
  font-size: 11px;
  font-weight: 800;
  color: #166534;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-dot {
  width: 0.5rem;
  height: 0.5rem;
  background-color: #22c55e;
  border-radius: 9999px;
  box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
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

.active-dot.gray {
  background-color: #9ca3af;
}

.header-tools {
  width: 100%;
}

@media (min-width: 768px) {
  .header-tools {
    width: auto;
  }
}

.zip-search {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.search-label {
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #9ca3af;
  margin-left: 0.5rem;
}

.zip-input-group {
  display: flex;
  background: white;
  border-radius: 1.25rem;
  padding: 0.375rem;
  border: 1px solid #e5e7eb;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  width: 100%;
}

@media (min-width: 768px) {
  .zip-input-group {
    width: 320px;
  }
}

.zip-input-group:focus-within {
  border-color: #111827;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
}

.user-zip-tag {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  background: #f1f5f9;
  border-radius: 0.75rem;
  margin-left: 0.25rem;
  font-size: 11px;
  font-weight: 800;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.zip-reset {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 0.5rem;
}

.zip-reset:hover {
  background: #f9fafb;
  color: #111827;
}

.zip-input {
  flex: 1;
  background: transparent;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  outline: none;
  min-width: 0;
}

.zip-input::placeholder {
  color: #9ca3af;
}

.zip-submit {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  background: #111827;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.zip-submit:hover:not(:disabled) {
  background: var(--blue-600);
  transform: scale(1.05);
}

.zip-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.current-legislators-section {
  margin-bottom: 2.5rem;
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 1.5rem;
  border: 1px solid #f3f4f6;
}

.legislator-grid {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.legislator-mini-card {
  display: flex;
  align-items: center;
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 0.875rem;
  border: 1px solid #f3f4f6;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.leg-name {
  font-size: 13px;
  font-weight: 800;
  color: #111827;
  line-height: 1.2;
}

.leg-avatar-container {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.625rem;
  overflow: hidden;
  margin-right: 0.75rem;
  background: #f3f4f6;
  flex-shrink: 0;
}

.leg-avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.leg-office {
  font-size: 11px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.025em;
  font-weight: 600;
  margin-top: 2px;
}

.leg-party {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 0.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 900;
  color: white;
  background: #9ca3af;
}

.leg-party.democrat,
.leg-party.d {
  background-color: #2563eb;
}

.leg-party.republican,
.leg-party.r {
  background-color: #dc2626;
}

.leg-info {
  flex: 1;
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
  background-color: var(--red-500);
  border-radius: 9999px;
}

.active-dot.blue {
  background-color: var(--blue-500);
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
  padding: 10px 0;
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

.location-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.banner-label {
  font-size: 10px;
  font-weight: 900;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.banner-value {
  font-size: 12px;
  font-weight: 800;
  color: var(--blue-600);
  background: #eff6ff;
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
}
</style>
