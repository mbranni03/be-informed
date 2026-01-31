<template>
  <div class="app-wrapper">
    <header class="glass-header">
      <div class="navbar-container">
        <div class="header-content">
          <div class="logo-area" @click="$router.push('/')">
            <div class="logo-text-group">
              <span class="logo-title">BE<span class="gradient-text"> INFORMED</span></span>
              <div class="live-indicator">
                <span class="pulse-dot"></span>
                <span class="indicator-text">BETA</span>
              </div>
            </div>
          </div>

          <div class="header-actions">
            <button class="settings-trigger" @click="showSettings = true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path
                  d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
                />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <q-dialog v-model="showSettings" persistent>
      <q-card class="settings-card glass-modal">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 font-black gradient-text uppercase tracking-tighter">
            API Configuration
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          <div class="settings-grid">
            <div class="input-group">
              <label>Geocodio API Key</label>
              <q-input
                v-model="tempKeys.geocodioApiKey"
                filled
                type="password"
                placeholder="Enter key..."
                bg-color="white"
                dense
              />
            </div>

            <div class="input-group">
              <label>Gov Data API Key</label>
              <q-input
                v-model="tempKeys.govDataApiKey"
                filled
                type="password"
                placeholder="Enter key..."
                bg-color="white"
                dense
              />
            </div>

            <div class="input-group">
              <label>Tavily API Key</label>
              <q-input
                v-model="tempKeys.tavilyApiKey"
                filled
                type="password"
                placeholder="Enter key..."
                bg-color="white"
                dense
              />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Cancel" color="grey-7" v-close-popup />
          <q-btn
            unelevated
            label="Save Config"
            class="save-btn"
            color="primary"
            :loading="saving"
            @click="saveSettings"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <div class="navbar-container">
        <div class="footer-divider">
          <div class="hr"></div>
          <span class="footer-tag">Intelligence Portal</span>
          <div class="hr"></div>
        </div>
        <p class="footer-legal">
          BeInformed uses LLMs to gather info and you should always verify with official sources in
          case of hallucination.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { saveApiKeys } from 'src/services/InformedAPI'

const showSettings = ref(false)
const saving = ref(false)

const tempKeys = reactive({
  geocodioApiKey: '',
  govDataApiKey: '',
  tavilyApiKey: '',
})

const saveSettings = async () => {
  saving.value = true
  try {
    await saveApiKeys({
      GEOCODIO_API_KEY: tempKeys.geocodioApiKey,
      GOV_DATA_API_KEY: tempKeys.govDataApiKey,
      TAVILY_API_KEY: tempKeys.tavilyApiKey,
    })

    showSettings.value = false
  } catch (error) {
    console.error('Save failed:', error)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.glass-header {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(243, 244, 246, 0.8);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1rem;
}

@media (min-width: 640px) {
  .navbar-container {
    padding: 0 2rem;
  }
}

.header-content {
  height: 4.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
}

.logo-icon-box {
  background: #111827;
  padding: 0.5rem;
  border-radius: 0.75rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 16px -4px rgba(17, 24, 39, 0.2);
}

.logo-text-group {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 1.125rem;
  font-weight: 900;
  color: #111827;
  letter-spacing: -0.05em;
  text-transform: uppercase;
  line-height: 1;
}

.gradient-text {
  background: linear-gradient(to right, var(--blue-600), var(--blue-400));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.live-indicator {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.125rem;
}

.pulse-dot {
  height: 0.375rem;
  width: 0.375rem;
  border-radius: 9999px;
  background-color: var(--blue-500);
  animation: pulse-blue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-blue {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

.desktop-nav {
  display: none;
}

@media (min-width: 1024px) {
  .desktop-nav {
    display: flex;
    align-items: center;
    gap: 3rem;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }
}

.nav-item {
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #9ca3af;
  text-decoration: none;
  transition: all 0.2s;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
}

.nav-item:hover,
.nav-item.active {
  color: #111827;
}

.nav-item.active {
  border-bottom-color: var(--blue-600);
}

.nav-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.header-status {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.status-chip {
  display: none;
  background: #f9fafb;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  border: 1px solid #f3f4f6;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
}

@media (min-width: 768px) {
  .status-chip {
    display: flex;
    gap: 0.5rem;
  }
}

.status-chip .label {
  color: #9ca3af;
}

.status-chip .val {
  color: #111827;
}

.action-btn {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.75rem;
  border: 1px solid #f3f4f6;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  border-color: #e5e7eb;
  color: #111827;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.main-content {
  padding-top: 2rem;
  flex: 1;
}

.footer {
  background: white;
  border-top: 1px solid #f3f4f6;
  padding: 5rem 0;
  margin-top: 8rem;
}

.footer-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0.4;
  margin-bottom: 2rem;
}

.hr {
  height: 1px;
  width: 5rem;
  background-color: #111827;
}

.footer-tag {
  font-size: 12px;
  font-weight: 900;
  letter-spacing: 0.4em;
  text-transform: uppercase;
  font-style: italic;
}

.footer-legal {
  font-size: 10px;
  font-weight: 700;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  max-width: 42rem;
  margin: 0 auto;
  line-height: 2;
  text-align: center;
}

.settings-trigger {
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.settings-trigger:hover {
  background: #f3f4f6;
  color: #111827;
}

.settings-card {
  width: 100%;
  max-width: 450px;
  border-radius: 1.5rem;
  overflow: hidden;
}

.glass-modal {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.settings-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.input-group label {
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #4b5563;
}

.save-btn {
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0 1.5rem;
  border-radius: 0.75rem;
  background: linear-gradient(to right, var(--blue-600), var(--blue-500)) !important;
}
</style>
