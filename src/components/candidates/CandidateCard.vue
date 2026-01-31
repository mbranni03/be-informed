<template>
  <div
    class="insight-card group cursor-pointer"
    :class="{ 'is-incumbent': candidate.incumbent }"
    @click="navigateToOverview"
  >
    <div class="card-glow"></div>
    <div class="card-content">
      <div class="avatar-section">
        <div class="image-wrapper">
          <img :src="candidate.image" :alt="candidate.name" class="avatar-img" />
          <div class="party-badge" :class="candidate.party.toLowerCase()">
            {{ candidate.party[0] }}
          </div>
        </div>
      </div>

      <div class="info-section">
        <div class="info-header">
          <div class="header-main">
            <h4 class="name">{{ candidate.name }}</h4>
            <div class="status-tags">
              <span v-if="candidate.incumbent" class="status-tag incumbent">Incumbent</span>
              <span v-if="candidate.challenger" class="status-tag challenger">Challenger</span>
            </div>
          </div>
          <p class="role">
            {{ formatOffice(candidate.office) }}
            <span v-if="shouldShowDistrict" class="district-info">
              <span class="dot">•</span> District {{ candidate.district }}
            </span>
          </p>
        </div>

        <!-- <div class="stance-box">
          <p class="stance-label">Platform Focus</p>
          <p class="stance-text text-truncate-2">{{ candidate.bio }}</p>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  candidate: {
    type: Object,
    required: true,
  },
})

const router = useRouter()

const navigateToOverview = () => {
  if (props.candidate.id) {
    router.push(`/candidates/${props.candidate.id}`)
  }
}

const shouldShowDistrict = computed(() => {
  const office = props.candidate.office.toLowerCase()
  return !office.includes('senate') && props.candidate.district
})

const formatOffice = (office) => {
  if (office.toLowerCase().includes('senate')) return 'U.S. Senate'
  if (office.toLowerCase().includes('house')) return 'U.S. House'
  return office
}
</script>

<style scoped>
.insight-card {
  background: white;
  border: 1px solid #f3f4f6;
  border-radius: 1.5rem;
  padding: 1.25rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  height: 100%;
}

.insight-card:hover {
  border-color: var(--blue-200);
  box-shadow: 0 20px 25px -5px rgba(30, 58, 138, 0.05);
}

.is-incumbent {
  border-left: 4px solid var(--blue-600);
}

.card-glow {
  position: absolute;
  top: 0;
  right: 0;
  width: 8rem;
  height: 8rem;
  background-color: rgba(239, 246, 255, 0.5);
  border-radius: 9999px;
  margin-right: -4rem;
  margin-top: -4rem;
  transition: background-color 0.3s;
  pointer-events: none;
}

.insight-card:hover .card-glow {
  background-color: rgba(219, 234, 254, 0.5);
}

.card-content {
  display: flex;
  gap: 1.25rem;
  position: relative;
  z-index: 10;
}

.image-wrapper {
  position: relative;
}

.avatar-img {
  width: 5rem;
  height: 5rem;
  border-radius: 1rem;
  object-fit: cover;
  background-color: #f3f4f6;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.insight-card:hover .avatar-img {
  transform: scale(1.05);
}

.party-badge {
  position: absolute;
  bottom: -0.5rem;
  right: -0.5rem;
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: 900;
  border: 2px solid white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.party-badge.democrat {
  background-color: var(--blue-600);
  color: white;
}

.party-badge.republican {
  background-color: var(--red-600);
  color: white;
}

.info-section {
  flex: 1;
  min-width: 0;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.name {
  font-size: 1.125rem;
  font-weight: 900;
  color: #111827;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.status-tags {
  display: flex;
  gap: 0.25rem;
}

.status-tag {
  font-size: 8px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 6px;
  border-radius: 4px;
}

.status-tag.incumbent {
  background-color: #ecfdf5;
  color: #059669;
}

.status-tag.challenger {
  background-color: #fef2f2;
  color: #dc2626;
}

.role {
  font-size: 11px;
  font-weight: 700;
  color: var(--blue-600);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.district-info {
  color: #6b7280;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.dot {
  opacity: 0.5;
}

.stance-box {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #f9fafb;
  border-radius: 0.75rem;
}

.stance-label {
  font-size: 10px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.25rem;
}

.stance-text {
  font-size: 0.8125rem;
  color: #374151;
  font-weight: 500;
  line-height: 1.5;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
