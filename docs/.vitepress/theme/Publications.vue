<script setup>
import { ref, computed } from 'vue'
import pubs from '../data/publications.json'
// Edited via the CMS (Publications List) or docs/.vitepress/data/publications.json
const peerReviewed = pubs.peerReviewed
const abstracts = pubs.abstracts

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

/* Table — clean, modern rows (Tailwind-style) */
.ok-pubs__table { width: 100%; border-collapse: collapse; }
.ok-pubs__table thead th {
  text-align: left; padding: 0 1rem 0.8rem;
  font-family: var(--ok-font-bold); font-weight: 600; font-size: 0.82rem;
  color: var(--vp-c-text-1);
  border-bottom: 1px solid var(--vp-c-divider);
}
.ok-pubs__table th:nth-child(1), .ok-pubs__table td:nth-child(1) { width: 62%; }
.ok-pubs__table th:nth-child(2), .ok-pubs__table td:nth-child(2) { width: 11%; }
.ok-pubs__table th:nth-child(3), .ok-pubs__table td:nth-child(3) { width: 27%; }
.ok-pubs__table td {
  padding: 1.05rem 1rem; vertical-align: middle;
  border-bottom: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-3); font-size: 0.92rem;
}
.ok-pubs__table tbody tr { transition: background .15s ease; }
.ok-pubs__table tbody tr:hover { background: var(--vp-c-bg-soft); }
.ok-pubs__year { color: var(--vp-c-text-3); white-space: nowrap; }
.ok-pubs__venue { color: var(--vp-c-text-3); }
.ok-pubs__title a {
  color: var(--vp-c-text-1); text-decoration: none;
  font-size: 0.98rem; font-weight: 600; line-height: 1.45;
}
.ok-pubs__title a:hover { color: var(--ok-accent-deep); }
.dark .ok-pubs__title a:hover { color: var(--ok-accent-a); }
.ok-pubs__empty { text-align: center; color: var(--vp-c-text-3); font-style: italic; padding: 2rem; }

@media (max-width: 640px) {
  .ok-pubs__tab { font-size: 1rem; }
  /* Stack each row into a clean card: title, then "year · venue" meta line */
  .ok-pubs__table thead { display: none; }
  .ok-pubs__table, .ok-pubs__table tbody { display: block; width: 100%; }
  .ok-pubs__table tr {
    display: block; padding: 0.95rem 0.2rem;
    border-bottom: 1px solid var(--vp-c-divider);
  }
  .ok-pubs__table tbody tr:hover { background: transparent; }
  .ok-pubs__table td { display: inline; border: none; padding: 0; font-size: 0.85rem; }
  .ok-pubs__title { display: block !important; margin-bottom: 0.35rem; width: auto; }
  .ok-pubs__title a { font-size: 1rem; }
  .ok-pubs__year::after { content: ' · '; color: var(--vp-c-text-3); }
  .ok-pubs__empty { display: block; }
}
</style>
