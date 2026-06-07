<script setup>
import data from '../data/footer.json'
import SectionBand from './SectionBand.vue'

const icons = {
  github: 'M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.5v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0C17.3 5 18.3 5.3 18.3 5.3c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.6.8.5 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z',
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  linkedin: 'M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z',
  orcid: 'M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zM7.37 18.13H5.6V7.83h1.77v10.3zM6.49 6.61a1.03 1.03 0 1 1 0-2.06 1.03 1.03 0 0 1 0 2.06zm12.31 11.52h-1.78v-5.02c0-1.2-.02-2.74-1.67-2.74-1.67 0-1.93 1.3-1.93 2.65v5.11h-1.78V7.83h1.71v1.41h.02c.24-.45.82-.92 1.69-.92 1.81 0 2.14 1.19 2.14 2.74v6.07z'
}
</script>

<template>
  <SectionBand />
  <footer class="ok-footer">
    <div class="ok-footer__inner">
      <div class="ok-footer__brand">
        <div class="ok-footer__wordmark">Oguzcan Karagoz</div>
        <p class="ok-footer__tagline">{{ data.tagline }}</p>
        <div class="ok-footer__social">
          <a v-for="s in data.social" :key="s.type" :href="s.link" :aria-label="s.type"
             target="_blank" rel="noopener" class="ok-footer__sicon">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path :d="icons[s.type]" fill="currentColor" />
            </svg>
          </a>
        </div>
      </div>
      <div class="ok-footer__cols">
        <div v-for="col in data.columns" :key="col.title" class="ok-footer__col">
          <div class="ok-footer__coltitle">{{ col.title }}</div>
          <a v-for="l in col.links" :key="l.text" :href="l.link" class="ok-footer__link">{{ l.text }}</a>
        </div>
      </div>
    </div>
    <div class="ok-footer__bottom">
      <span>{{ data.copyright }}</span>
    </div>
  </footer>
</template>
