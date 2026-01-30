<template>
  <div class="app-wrapper">
    <header class="glass-header">
      <div class="navbar-container">
        <div class="header-content">
          <div class="logo-area" @click="$router.push('/')">
            <div class="logo-icon-box">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div class="logo-text-group">
              <span class="logo-title">Informed<span class="gradient-text">.OS</span></span>
              <div class="live-indicator">
                <span class="pulse-dot"></span>
                <span class="indicator-text">v2.06 Live Node</span>
              </div>
            </div>
          </div>

          <nav class="desktop-nav">
            <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
              Intelligence
            </router-link>
            <router-link
              to="/candidates"
              class="nav-item"
              :class="{ active: $route.path === '/candidates' }"
            >
              Candidate Console
            </router-link>
            <a href="#" class="nav-item disabled">Briefings</a>
          </nav>

          <div class="header-status">
            <div class="status-chip">
              <span class="label">Region:</span>
              <span class="val">US-EAST-1</span>
            </div>
            <button class="action-btn">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

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
          Informed.OS utilizes non-partisan data streams for educational auditing. 2026 Candidate
          filings are subject to verification by State Election Boards.
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup></script>

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
  font-style: italic;
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
</style>
