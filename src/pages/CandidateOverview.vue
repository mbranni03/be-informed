<template>
  <div class="candidate-overview-page">
    <div class="overview-container">
      <div class="navigation-header">
        <button @click="$router.back()" class="back-btn">
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
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Console
        </button>
      </div>

      <transition name="fade" mode="out-in">
        <div v-if="loading" class="loader-container">
          <PatrioticLoader />
        </div>

        <div v-else-if="candidate" class="report-card">
          <div class="report-header">
            <div class="header-profile">
              <div class="avatar-wrapper">
                <img :src="candidate.image" :alt="candidate.name" class="candidate-avatar" />
                <div class="party-indicator" :class="candidate.party.toLowerCase()"></div>
              </div>
              <div class="header-content">
                <h1 class="report-title">Intelligence Report: {{ candidate.name }}</h1>

                <div class="report-meta">
                  <span class="meta-tag">{{ candidate.party }}</span>
                  <span class="meta-separator">•</span>
                  <span class="meta-tag">{{ candidate.office }}</span>
                  <span class="meta-separator">•</span>
                  <span class="meta-tag">{{ candidate.stateName || candidate.state }}</span>
                  <span class="meta-separator">•</span>
                  <span class="meta-tag">2026 Midterm Cycle</span>
                </div>
              </div>
            </div>
          </div>

          <div class="report-content">
            <div class="markdown-body" v-html="renderedContent"></div>
          </div>
        </div>

        <div v-else class="empty-state">
          <div class="empty-message">
            <h2>Candidate Not Found</h2>
            <p>Unable to locate intelligence dossier for this ID.</p>
            <button @click="$router.push('/candidates')" class="back-link">
              Return to Console
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useElectionStore } from 'src/stores/election-store'
import { getCandidateOverview } from 'src/services/InformedAPI'
import { marked } from 'marked'
import PatrioticLoader from 'src/components/common/PatrioticLoader.vue'

const route = useRoute()
const store = useElectionStore()

const loading = ref(true)
const markdownContent = ref('')

const candidate = computed(() => {
  return store.candidates.find((c) => c.id === route.params.id)
})

const renderedContent = computed(() => {
  return marked(markdownContent.value)
})

onMounted(async () => {
  if (!candidate.value) {
    // Ideally we would fetch the candidate details if not in store
    // For now we rely on store having it (navigated from dashboard)
    loading.value = false
    return
  }

  try {
    const data = await getCandidateOverview({
      candidate: candidate.value.name,
      state: candidate.value.state,
      office: candidate.value.officeCode,
      bioguideId: candidate.value.id,
    })
    markdownContent.value = data
  } catch (err) {
    console.error('Failed to load candidate overview:', err)
    markdownContent.value = '# Error loading report\n\nUnable to retrieve intelligence dossier.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.candidate-overview-page {
  min-height: 100vh;
  background-color: #fafafa;
  padding: 2rem;
}

.overview-container {
  max-width: 1000px;
  margin: 0 auto;
}

.navigation-header {
  margin-bottom: 2rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #e5e7eb;
  padding: 0.75rem 1.5rem;
  border-radius: 9999px;
  font-weight: 700;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.back-btn:hover {
  border-color: #d1d5db;
  color: #111827;
  transform: translateX(-2px);
}

.report-card {
  background: white;
  border-radius: 1.5rem;
  border: 1px solid #f3f4f6;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.05),
    0 8px 10px -6px rgba(0, 0, 0, 0.01);
  overflow: hidden;
}

.report-header {
  background: linear-gradient(to right, #f9fafb, white);
  padding: 3rem 4rem;
  border-bottom: 1px solid #f3f4f6;
}

.header-profile {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.avatar-wrapper {
  position: relative;
  flex-shrink: 0;
}

.candidate-avatar {
  width: 100px;
  height: 100px;
  border-radius: 1.5rem;
  object-fit: cover;
  border: 4px solid white;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05),
    0 0 0 1px #f3f4f6;
}

.party-indicator {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 24px;
  height: 24px;
  border-radius: 8px;
  border: 3px solid white;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.party-indicator.democrat {
  background-color: #2563eb;
}

.party-indicator.republican {
  background-color: #dc2626;
}

.header-content {
  flex: 1;
}
.report-title {
  font-size: 2.25rem;
  font-weight: 900;
  letter-spacing: -0.025em;
  color: #111827;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.report-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.meta-tag {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #6b7280;
}

.meta-separator {
  color: #d1d5db;
}

.report-content {
  padding: 3rem 4rem;
}

/* Markdown Styles */
:deep(.markdown-body) {
  font-family: 'Inter', sans-serif;
  color: #374151;
  line-height: 1.8;
}

:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3),
:deep(.markdown-body h4) {
  color: #111827;
  font-weight: 800;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  letter-spacing: -0.025em;
}

:deep(.markdown-body h1:first-child) {
  margin-top: 0;
  display: none; /* Hide H1 since we have it in header, or adapt */
}

:deep(.markdown-body h2) {
  font-size: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

:deep(.markdown-body h3) {
  font-size: 1.25rem;
  margin-top: 2rem;
}

:deep(.markdown-body p) {
  margin-bottom: 1.5rem;
  font-size: 1.0625rem;
}

:deep(.markdown-body ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1.5rem;
}

:deep(.markdown-body li) {
  margin-bottom: 0.5rem;
}
.loader-container {
  display: flex;
  justify-content: center;
  padding: 4rem 0;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 1.5rem;
  border: 1px solid #f3f4f6;
}

.empty-message h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #111827;
  margin-bottom: 0.5rem;
}

.empty-message p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.back-link {
  color: #2563eb;
  font-weight: 600;
  cursor: pointer;
  background: none;
  border: none;
  text-decoration: underline;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
