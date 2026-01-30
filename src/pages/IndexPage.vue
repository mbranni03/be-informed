<template>
  <div class="index-page">
    <div class="navbar-container">
      <div class="hero-section">
        <div class="hero-label">
          <span class="pulse-dot"></span>
          <span class="label-text">Electoral Intelligence Framework</span>
        </div>

        <h1 class="hero-title">
          Be <span class="text-blue">Informed</span>.<br />
          Vote <span class="text-italic">Wise</span>.
        </h1>

        <p class="hero-subtitle">
          Initializing the 2026 Midterm Intelligence Node. Access interactive candidate telemetry,
          verified platform auditing, and localized district analytics.
        </p>

        <div class="hero-actions">
          <router-link to="/candidates" class="cta-primary">
            Launch Console
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
              class="arrow-icon"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </router-link>
          <a href="#" class="cta-secondary">System Audit</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style scoped>
.index-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 5rem);
  padding: 4rem 2rem;
  text-align: center;
  background-color: #fafafa;
}

.hero-section {
  max-width: 56rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 2rem;
  background: white;
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid #f3f4f6;
}

.pulse-dot {
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--blue-600);
  border-radius: 9999px;
  animation: pulse-blue 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-blue {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.4;
  }
}

.label-text {
  font-size: 11px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: #9ca3af;
}

.hero-title {
  font-size: 6rem;
  font-weight: 900;
  letter-spacing: -0.05em;
  line-height: 0.95;
  color: #111827;
  text-transform: uppercase;
  margin-bottom: 2rem;
}

.hero-title .text-blue {
  color: transparent;
  background: linear-gradient(to right, var(--blue-600), var(--blue-400));
  -webkit-background-clip: text;
  background-clip: text;
}

.hero-title .text-italic {
  font-style: italic;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: #6b7280;
  line-height: 1.6;
  max-width: 42rem;
  margin-bottom: 3.5rem;
  font-weight: 500;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.cta-primary {
  background-color: #111827;
  color: white;
  padding: 1.25rem 2.5rem;
  border-radius: 1.25rem;
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.2);
}

.cta-primary:hover {
  background-color: var(--blue-600);
  transform: translateY(-4px);
  box-shadow: 0 25px 50px -12px rgba(37, 99, 235, 0.3);
}

.arrow-icon {
  transition: transform 0.3s;
}

.cta-primary:hover .arrow-icon {
  transform: translateX(4px);
}

.cta-secondary {
  color: #111827;
  font-size: 14px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-decoration: none;
  padding: 1.25rem;
  transition: color 0.2s;
}

.cta-secondary:hover {
  color: var(--blue-600);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 3.5rem;
  }
  .hero-subtitle {
    font-size: 1.125rem;
  }
  .hero-actions {
    flex-direction: column;
    width: 100%;
  }
  .cta-primary {
    width: 100%;
    justify-content: center;
  }
}
</style>
