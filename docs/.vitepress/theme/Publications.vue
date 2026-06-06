<script setup>
import { ref, computed } from 'vue'

const peerReviewed = [
  { title: 'Morphometry and kinematics correlation of wrinkle ridges on Mars: Insights from Trishear modelling', year: '2025', venue: 'Icarus', url: 'https://doi.org/10.1016/j.icarus.2024.116330' },
  { title: 'Structural analysis and evolution of large Venusian coronae: Insights from low-angle faults at coronae rims', year: '2024', venue: 'PSS', url: 'https://doi.org/10.1016/j.pss.2024.105955' },
  { title: 'Unraveling the Tectonic History of the Tharsis Rise on Mars: Plume Migration and Critical Taper Dome', year: '2024', venue: 'JGR: Planets', url: 'https://doi.org/10.1029/2023JE007965' },
  { title: 'Insights into the subsurface structure of wrinkle ridges on Mars', year: '2022', venue: 'EPSL', url: 'https://doi.org/10.1016/j.epsl.2022.117759' },
  { title: 'Circum-Tharsis wrinkle ridges at Lunae Planum: Morphometry, formation, and crustal implications.', year: '2022', venue: 'Icarus', url: 'https://doi.org/10.1016/j.icarus.2021.114808' },
  { title: 'A study on the morphology and geology of Dulovo crater; Southern Libya Montes, Mars', year: '2017', venue: 'MJST', url: 'https://doi.org/10.22531/muglajsci.314830' },
]

const abstracts = [
  { title: 'Evidence for very recent tectonic activity in southern Tharsis', year: '2025', venue: 'EGU', url: 'https://doi.org/10.5194/egusphere-egu25-518' },
  { title: 'Fault-melt interaction and its implications for Venusian Tectonic regimes in Aphrodite Terra, Venus', year: '2025', venue: 'EGU', url: 'https://doi.org/10.5194/egusphere-egu25-235' },
  { title: 'Geodynamics of synconvergent extension on Venus and Earth', year: '2025', venue: 'EGU', url: 'https://doi.org/10.5194/egusphere-egu25-9519' },
  { title: 'Insights about Stratigraphy and Composition From Ray and Halo Craters on Ganymede', year: '2025', venue: 'EGU', url: 'https://doi.org/10.5194/egusphere-egu25-21586' },
  { title: 'Fault scaling at the Reykjanes Peninsula (Iceland) as a Mars Analogue: Displacement-length relationship in comparison with Memnonia Fossae, Mars', year: '2024', venue: 'EPSC', url: 'https://doi.org/10.5194/epsc2024-1091' },
  { title: 'Low-angle faults at the rim of a large Venusian corona', year: '2024', venue: 'EPSC', url: 'https://doi.org/10.5194/epsc2024-383' },
  { title: 'Trishear Forward Modelling of WRs on Mars: morphometry and kinematics correlation to unravel Mars geology', year: '2024', venue: 'EPSC', url: 'https://doi.org/10.5194/epsc2024-888' },
  { title: 'Structural analyses of Latona Corona and Dali Chasma, Aphrodite Terra, Venus', year: '2023', venue: 'EnVision Workshop', url: 'https://envisionvenus.eu' },
  { title: 'Clues to the subsurface fault pattern of circum-Tharsis wrinkle ridges', year: '2022', venue: 'EPSC', url: 'https://doi.org/10.5194/epsc2022-59' },
]

const tab = ref('peer')        // 'peer' | 'abstracts'
const query = ref('')
const year = ref('')

const source = computed(() => (tab.value === 'peer' ? peerReviewed : abstracts))
const venueLabel = computed(() => (tab.value === 'peer' ? 'Journal' : 'Conference'))
const years = computed(() => [...new Set(source.value.map(p => p.year))].sort((a, b) => b - a))

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return source.value.filter(p => {
    const matchesYear = !year.value || p.year === year.value
    const matchesQuery = !q ||
      p.title.toLowerCase().includes(q) ||
      p.venue.toLowerCase().includes(q)
    return matchesYear && matchesQuery
  })
})

function setTab(t) {
  tab.value = t
  query.value = ''
  year.value = ''
}
</script>

<template>
<section class="ok-pubs">
  <div class="ok-pubs__tabs">
    <button class="ok-pubs__tab" :class="{ 'is-active': tab === 'peer' }" @click="setTab('peer')">
      Peer-reviewed Articles
    </button>
    <button class="ok-pubs__tab" :class="{ 'is-active': tab === 'abstracts' }" @click="setTab('abstracts')">
      Abstracts
    </button>
  </div>

  <div class="ok-pubs__controls">
    <input class="ok-pubs__search" v-model="query" placeholder="Search title or journal…" />
    <select class="ok-pubs__filter" v-model="year">
      <option value="">Filter by Year</option>
      <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
    </select>
  </div>

  <table class="ok-pubs__table">
    <thead>
      <tr>
        <th>Title</th>
        <th>Year</th>
        <th>{{ venueLabel }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(p, i) in filtered" :key="p.url + i">
        <td class="ok-pubs__title"><a :href="p.url" target="_blank" rel="noopener">{{ p.title }}</a></td>
        <td class="ok-pubs__year">{{ p.year }}</td>
        <td class="ok-pubs__venue">{{ p.venue }}</td>
      </tr>
      <tr v-if="filtered.length === 0">
        <td colspan="3" class="ok-pubs__empty">No matching entries.</td>
      </tr>
    </tbody>
  </table>
</section>
</template>

<style scoped>
.ok-pubs { margin: 1.25rem auto 0; max-width: 1000px; }

/* Tabs */
.ok-pubs__tabs { display: flex; gap: 0.5rem; margin-bottom: 1.1rem; flex-wrap: wrap; }
.ok-pubs__tab {
  background: none; border: none; cursor: pointer;
  font-family: var(--ok-font-bold);
  font-weight: 600; font-size: 1.15rem;
  padding: 0.5rem 1.1rem; border-radius: 8px;
  color: var(--vp-c-text-2);
  transition: background .2s, color .2s;
}
.ok-pubs__tab:hover { color: var(--vp-c-text-1); background: var(--vp-c-bg-soft); }
.ok-pubs__tab.is-active {
  background: var(--ok-accent-deep);
  color: #fff;
}

/* Controls */
.ok-pubs__controls { display: flex; flex-wrap: wrap; gap: 0.8rem; margin-bottom: 1.1rem; }
.ok-pubs__search { flex: 2 1 280px; }
.ok-pubs__filter { flex: 1 1 180px; max-width: 240px; cursor: pointer; }
.ok-pubs__search, .ok-pubs__filter {
  padding: 0.7rem 1.1rem; font-size: 0.95rem; font-family: inherit;
  color: var(--vp-c-text-1); background: var(--vp-c-bg-alt);
  border: 1px solid var(--vp-c-border); border-radius: 999px;
  box-sizing: border-box; outline: none;
  transition: border-color .2s, box-shadow .2s;
}
.ok-pubs__search:focus, .ok-pubs__filter:focus {
  border-color: var(--ok-accent);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}
.ok-pubs__search::placeholder { color: var(--vp-c-text-3); }

/* Table */
.ok-pubs__table { width: 100%; border-collapse: collapse; }
.ok-pubs__table thead th {
  text-align: left; padding: 0.55rem 0.85rem;
  font-family: var(--ok-font-bold); font-weight: 600; font-size: 0.95rem;
  color: var(--vp-c-text-1);
  border-bottom: 1px solid var(--vp-c-divider);
}
.ok-pubs__table th:nth-child(1), .ok-pubs__table td:nth-child(1) { width: 66%; }
.ok-pubs__table th:nth-child(2), .ok-pubs__table td:nth-child(2) { width: 10%; }
.ok-pubs__table th:nth-child(3), .ok-pubs__table td:nth-child(3) { width: 24%; }
.ok-pubs__table td {
  padding: 0.55rem 0.85rem; vertical-align: top;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2); font-size: 0.95rem;
}
.ok-pubs__table tbody tr:hover { background: var(--vp-c-bg-soft); }
.ok-pubs__title a {
  color: var(--vp-c-text-1); text-decoration: none;
  font-size: 1rem; font-weight: 500; line-height: 1.4;
}
.ok-pubs__title a:hover { color: var(--ok-accent-deep); text-decoration: underline; }
.dark .ok-pubs__title a:hover { color: var(--ok-accent-a); }
.ok-pubs__empty { text-align: center; color: var(--vp-c-text-3); font-style: italic; }

@media (max-width: 640px) {
  .ok-pubs__table th:nth-child(1), .ok-pubs__table td:nth-child(1) { width: auto; }
  .ok-pubs__tab { font-size: 1rem; }
}
</style>
