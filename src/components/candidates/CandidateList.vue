<template>
  <div class="candidate-list-wrapper">
    <div v-if="candidates.length > 0" class="candidate-grid">
      <CandidateCard v-for="candidate in candidates" :key="candidate.id" :candidate="candidate" />
    </div>

    <div v-else class="empty-state glass-effect">
      <div class="empty-icon">🔍</div>
      <h3>No candidates found</h3>
      <p>Try adjusting your search filters or selecting another state.</p>
      <button class="clear-btn" @click="store.clearFilters">Clear all filters</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import CandidateCard from './CandidateCard.vue'
import { useElectionStore } from 'stores/election-store'

const store = useElectionStore()
const candidates = computed(() => store.filteredCandidates)
</script>

<style scoped>
.candidate-list-wrapper {
  width: 100%;
}

.candidate-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.empty-state {
  padding: 6rem 2rem;
  text-align: center;
  border-radius: 2rem;
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.75rem;
  margin: 0;
  color: var(--text-primary);
}

.empty-state p {
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
  max-width: 400px;
}

.clear-btn {
  background: var(--accent-primary);
  color: #000;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 0.75rem;
  font-weight: 700;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(56, 189, 248, 0.4);
}

@media (max-width: 768px) {
  .candidate-grid {
    grid-template-columns: 1fr;
  }
}
</style>
