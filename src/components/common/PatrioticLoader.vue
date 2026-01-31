<template>
  <div class="patriotic-loader">
    <div class="shield-container">
      <div class="ring outer-ring"></div>
      <div class="ring middle-ring"></div>
      <div class="ring inner-ring"></div>
      <div class="star-core">
        <svg viewBox="0 0 24 24" class="star-icon">
          <path
            fill="currentColor"
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          />
        </svg>
      </div>
    </div>

    <div class="loading-text-container">
      <div class="status-line">
        <span class="blinking-cursor">></span>
        <span class="typewriter">{{ currentText }}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  loadingConfig: {
    type: Array,
    default: () => [
      'ESTABLISHING SECURE CONNECTION...',
      'VERIFYING CLEARANCE LEVEL...',
      'DECRYPTING CANDIDATE DOSSIER...',
      'ANALYZING VOTING RECORDS...',
    ],
  },
})

const currentText = ref(props.loadingConfig[0])
let textInterval

onMounted(() => {
  let index = 0
  textInterval = setInterval(() => {
    index = (index + 1) % props.loadingConfig.length
    currentText.value = props.loadingConfig[index]
  }, 1500)
})

onUnmounted(() => {
  clearInterval(textInterval)
})
</script>

<style scoped>
.patriotic-loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background-color: transparent;
  font-family: 'Courier New', Courier, monospace; /* Monospace for that "terminal/intel" feel */
}

.shield-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring {
  position: absolute;
  border-radius: 50%;
  border-style: solid;
  border-color: transparent;
  animation: spin 3s linear infinite;
}

.outer-ring {
  width: 100%;
  height: 100%;
  border-width: 4px;
  border-top-color: #dc2626; /* Red-600 */
  border-right-color: #dc2626;
  opacity: 0.8;
  animation-duration: 3s;
}

.middle-ring {
  width: 75%;
  height: 75%;
  border-width: 4px;
  border-top-color: #2563eb; /* Blue-600 */
  border-left-color: #2563eb;
  opacity: 0.8;
  animation-direction: reverse;
  animation-duration: 2.5s;
}

.inner-ring {
  width: 50%;
  height: 50%;
  border-width: 3px;
  border-left-color: #9ca3af; /* Gray-400 */
  border-right-color: #9ca3af;
  opacity: 0.5;
  animation-duration: 2s;
}

.star-core {
  color: #111827; /* Dark gray/black for contrast, or maybe Blue */
  width: 30%;
  height: 30%;
  animation: pulse 2s infinite ease-in-out;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.star-icon {
  width: 100%;
  height: 100%;
  color: #dc2626; /* Red star */
}

.loading-text-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  width: 300px;
}

.status-line {
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  color: #4b5563;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 1.5rem;
}

.blinking-cursor {
  animation: blink 1s step-end infinite;
  color: #dc2626;
  font-weight: 900;
}

.progress-bar {
  width: 100%;
  height: 4px;
  background-color: #e5e7eb;
  border-radius: 9999px;
  overflow: hidden;
  position: relative;
}

.progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 30%;
  background: linear-gradient(90deg, #dc2626, #ffffff, #2563eb);
  background-size: 200% 100%;
  animation: loading-bar 1.5s infinite linear;
  border-radius: 9999px;
  box-shadow: 0 0 10px rgba(37, 99, 235, 0.4);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(0.95);
    opacity: 0.8;
  }
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

@keyframes loading-bar {
  0% {
    left: -30%;
  }
  100% {
    left: 100%;
  }
}
</style>
