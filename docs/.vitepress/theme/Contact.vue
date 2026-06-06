<script setup>
const socials = [
  { kind: 'bsky',     label: 'Bluesky',        href: 'https://bsky.app/profile/did:plc:ekrrgqi5nlb46m34ogwcytcu', color: '#1185fe' },
  { kind: 'linkedin', label: 'LinkedIn',       href: 'https://linkedin.com/in/o-karagoz',                          color: '#0a66c2' },
  { kind: 'rg',       label: 'ResearchGate',   href: 'https://www.researchgate.net/profile/Oguzcan-Karagoz',       color: '#00ccbb' },
  { kind: 'scholar',  label: 'Google Scholar', href: 'https://scholar.google.com/citations?user=Byq8LX4AAAAJ&hl',  color: '#4285f4' },
  { kind: 'orcid',    label: 'ORCID',          href: 'https://orcid.org/0000-0002-0656-7396',                      color: '#a6ce39' },
]
</script>

<template>
<div class="ok-ct">
  <div class="ok-ct__info">
    <a class="ok-ct__email" href="mailto:oguzcan.karagoz@geologie.uni-freiburg.de">oguzcan.karagoz@geologie.uni-freiburg.de</a>
    <p class="ok-ct__addr">
      General Geology &amp; Structural Geology, Institute of Geosciences, University of Freiburg<br/>
      Albertstrasse 23-B (room 01.007), 79104 Freiburg, Germany
    </p>
  </div>
  <div class="ok-ct__socials">
    <a v-for="s in socials" :key="s.kind" :href="s.href" :aria-label="s.label" :title="s.label"
       target="_blank" rel="noopener" class="ok-ct__soc" :style="{ '--c': s.color }">
      <svg v-if="s.kind === 'bsky'" viewBox="0 0 640 640" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M320 291.1C293.9 240.4 222.9 145.9 156.9 99.3C93.6 54.6 69.5 62.3 53.6 69.5C35.3 77.8 32 105.9 32 122.4C32 138.9 41.1 258 47 277.9C66.5 343.6 136.1 365.8 200.2 358.6C106.3 372.6 22.9 406.8 132.3 528.5C252.6 653.1 297.1 501.8 320 425.1C342.9 501.8 369.2 647.6 505.6 528.5C608 425.1 533.7 372.5 439.8 358.6C503.9 365.7 573.4 343.5 593 277.9C598.9 258 608 139 608 122.4C608 105.8 604.7 77.7 586.4 69.5C570.6 62.4 546.4 54.6 483.2 99.3C417.1 145.9 346.1 240.4 320 291.1z"/></svg>
      <svg v-else-if="s.kind === 'linkedin'" viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>
      <svg v-else-if="s.kind === 'orcid'" viewBox="0 0 24 24" width="17" height="17" aria-hidden="true"><path fill="currentColor" d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zM7.37 18.13H5.6V7.83h1.77v10.3zM6.49 6.61a1.03 1.03 0 1 1 0-2.06 1.03 1.03 0 0 1 0 2.06zm12.31 11.52h-1.78v-5.02c0-1.2-.02-2.74-1.67-2.74-1.67 0-1.93 1.3-1.93 2.65v5.11h-1.78V7.83h1.71v1.41h.02c.24-.45.82-.92 1.69-.92 1.81 0 2.14 1.19 2.14 2.74v6.07z"/></svg>
      <svg v-else-if="s.kind === 'globe'" viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"/></svg>
      <span v-else-if="s.kind === 'rg'" class="ok-ct__txt">RG</span>
      <span v-else-if="s.kind === 'scholar'" class="ok-ct__txt">GS</span>
    </a>
  </div>
</div>
</template>

<style scoped>
.ok-ct {
  display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between;
  gap: 1.5rem 2rem; margin: 1rem 0 0.5rem;
  padding: 1.6rem 0; border-top: 1px solid var(--vp-c-divider);
}
.ok-ct__email {
  display: inline-block; font-size: 1.05rem; font-weight: 600;
  color: var(--ok-accent-deep); text-decoration: none; word-break: break-word;
}
:global(.dark) .ok-ct__email { color: var(--ok-accent-a); }
.ok-ct__email:hover { text-decoration: underline; }
.ok-ct__addr { font-size: 0.95rem; line-height: 1.55; color: var(--vp-c-text-2); margin: 0.45rem 0 0; }
.ok-ct__socials { display: flex; flex-wrap: wrap; gap: 0.6rem; }
.ok-ct__soc {
  width: 40px; height: 40px; border-radius: 999px;
  display: inline-flex; align-items: center; justify-content: center;
  background: var(--c, #444); color: #fff; text-decoration: none !important;
  box-shadow: 0 3px 10px -4px rgba(0,0,0,0.4);
  transition: transform .2s, filter .2s;
}
.ok-ct__soc:hover { transform: translateY(-2px); filter: brightness(1.1); }
.ok-ct__txt { font-size: 13px; font-weight: 800; letter-spacing: -0.03em; }
</style>
