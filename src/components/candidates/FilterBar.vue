<template>
  <div class="filter-bar glass-effect">
    <div class="filter-info">
      <span class="info-label">Filtering</span>
      <span class="info-count">{{ count }}</span>
      <span class="info-label">Candidates</span>
    </div>

    <div class="filter-controls">
      <div class="custom-select-wrapper">
        <label>Party</label>
        <select v-model="filters.party" class="custom-select">
          <option v-for="party in parties" :key="party.value" :value="party.value">
            {{ party.label }}
          </option>
        </select>
      </div>

      <div class="custom-select-wrapper">
        <label>Office</label>
        <select v-model="filters.office" class="custom-select">
          <option v-for="office in offices" :key="office.value" :value="office.value">
            {{ office.label }}
          </option>
        </select>
      </div>

      <button class="reset-btn" @click="store.clearFilters">
        <span class="btn-icon">↺</span>
        Reset
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useElectionStore } from 'stores/election-store'

const store = useElectionStore()

const filters = computed(() => store.filters)
const count = computed(() => store.filteredCandidates.length)

const parties = [
  { label: 'All Parties', value: 'all' },
  { label: 'Democrat', value: 'democrat' },
  { label: 'Republican', value: 'republican' },
]

const offices = [
  { label: 'All Offices', value: 'all' },
  { label: 'Senate', value: 'senate' },
  { label: 'House', value: 'house' },
  { label: 'Governor', value: 'governor' },
]
</script>

<style scoped>
.filter-bar {
  padding: 1.5rem 2rem;
  border-radius: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.filter-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
}

.info-label {
  color: var(--text-secondary);
}

.info-count {
  color: var(--accent-primary);
  font-weight: 700;
  font-size: 1.25rem;
}

.filter-controls {
  display: flex;
  gap: 1.5rem;
  align-items: flex-end;
}

.custom-select-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.custom-select-wrapper label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-secondary);
  font-weight: 600;
  padding-left: 0.5rem;
}

.custom-select {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  color: var(--text-primary);
  padding: 0.6rem 1rem;
  border-radius: 0.75rem;
  outline: none;
  font-family: inherit;
  font-size: 0.95rem;
  min-width: 160px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.custom-select:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
}

.custom-select:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
}

.reset-btn {
  background: transparent;
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  padding: 0.6rem 1.25rem;
  border-radius: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: inherit;
  font-weight: 500;
  transition: all 0.2s ease;
  height: 42px;
}

.reset-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-primary);
}

.btn-icon {
  font-size: 1.1rem;
}

@media (max-width: 1024px) {
  .filter-bar {
    flex-direction: column;
    align-items: stretch;
    padding: 1.5rem;
  }

  .filter-controls {
    flex-direction: column;
    gap: 1rem;
  }

  .custom-select {
    width: 100%;
  }

  .reset-btn {
    justify-content: center;
  }
}
</style>
