<template>
  <div class="map-container">
    <q-card flat bordered class="map-card overflow-hidden">
      <q-card-section class="bg-primary text-white q-py-sm">
        <div class="text-h6 text-center text-uppercase q-my-none letter-spacing-wide">
          Interactive US Map
        </div>
      </q-card-section>

      <div class="relative-position bg-slate-50">
        <svg :viewBox="`0 0 ${width} ${height}`" class="us-map">
          <defs>
            <linearGradient id="selectedGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color: #2563eb; stop-opacity: 1" />
              <stop offset="100%" style="stop-color: #3b82f6; stop-opacity: 1" />
            </linearGradient>
          </defs>
          <g class="states">
            <path
              v-for="state in statePaths"
              :key="state.id"
              :d="state.path"
              :class="['state', { 'is-selected': selectedCode === state.code }]"
              @mouseenter="hoveredStateName = state.name"
              @mouseleave="hoveredStateName = null"
              @click="handleStateClick(state)"
            >
              <q-tooltip anchor="top middle" self="bottom middle" class="bg-primary">
                {{ state.name }}
              </q-tooltip>
            </path>
          </g>
        </svg>

        <Transition name="fade">
          <div v-if="hoveredStateName" class="absolute-bottom-right q-pa-md">
            <q-badge color="secondary" padding="xs md" class="text-weight-bold shadow-2">
              <span class="text-subtitle1">{{ hoveredStateName }}</span>
            </q-badge>
          </div>
        </Transition>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import * as d3 from 'd3-geo'
import * as topojson from 'topojson-client'
import { storeToRefs } from 'pinia'
import { useElectionStore } from 'stores/election-store'
import { US_MAP_DATA } from 'src/data/us-map'

const store = useElectionStore()
const width = 960
const height = 600
const hoveredStateName = ref(null)
const geoData = ref(null)

// Map state names to their 2-letter codes from existing data
const nameToCodeMap = US_MAP_DATA.reduce((acc, state) => {
  if (state.n && state.id) {
    acc[state.n.toLowerCase().trim()] = state.id
  }
  return acc
}, {})

// Sync with store
const { selectedState: selectedCode } = storeToRefs(store)

// 1. Fetch the high-quality TopoJSON
onMounted(async () => {
  try {
    const response = await fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json')
    geoData.value = await response.json()
  } catch (error) {
    console.error('Failed to fetch map data:', error)
  }
})

// 2. Project the data into SVG paths
const statePaths = computed(() => {
  if (!geoData.value) return []

  const projection = d3
    .geoAlbersUsa()
    .scale(1280)
    .translate([width / 2, height / 2])

  const pathGenerator = d3.geoPath().projection(projection)
  const states = topojson.feature(geoData.value, geoData.value.objects.states).features

  return states.map((feature) => {
    const name = feature.properties.name || feature.id || 'Unknown'
    const normalizedName = name.toLowerCase().trim()
    return {
      id: feature.id,
      name: name,
      code: nameToCodeMap[normalizedName] || feature.id,
      path: pathGenerator(feature),
    }
  })
})

const handleStateClick = (state) => {
  if (!state || !state.code) return

  if (state.code === selectedCode.value) {
    store.selectState(null, null)
  } else {
    store.selectState(state.code, state.name || state.code)
  }
}
</script>

<style scoped lang="scss">
.map-container {
  width: 100%;
  margin: 0 auto;
}

.map-card {
  border-radius: 16px;
  box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1) !important;
  background: white;
}

.us-map {
  width: 100%;
  height: auto;
  filter: drop-shadow(0px 8px 16px rgba(0, 0, 0, 0.05));
  padding: 20px;
}

.state {
  fill: #f1f5f9;
  stroke: #cbd5e1;
  stroke-width: 0.75;
  stroke-linejoin: round;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;

  &:hover {
    fill: rgba($primary, 0.1);
    stroke: $primary;
    stroke-width: 1.5;
    z-index: 10;
  }

  &.is-selected {
    fill: url(#selectedGradient);
    stroke: $primary;
    stroke-width: 2;
    filter: drop-shadow(0 0 12px rgba($primary, 0.5));
    z-index: 20;
  }
}

.letter-spacing-wide {
  letter-spacing: 0.1em;
}

.bg-slate-50 {
  background-color: #f8fafc;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
