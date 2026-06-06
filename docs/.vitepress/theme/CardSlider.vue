<script setup>
import { ref, computed } from 'vue'
import posts from '../data/posts.json'

const props = defineProps({
  category: { type: String, default: 'research' },
  limit: { type: Number, default: 0 },
})

const tagLabel = { blog: 'Essay', research: 'Research' }
const items = computed(() => {
  const l = posts[props.category] || []
  return props.limit > 0 ? l.slice(0, props.limit) : l
})

const track = ref(null)
function scrollByCards(dir) {
  const el = track.value
  if (!el) return
  // page by a full viewport so only whole cards are ever shown
  el.scrollBy({ left: dir * el.clientWidth, behavior: 'smooth' })
}

function fmt(d) {
  if (!d) return ''
  const t = new Date(d)
  return isNaN(t) ? d : t.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<template>
<div class="ok-slider">
  <div class="ok-slider__head">
    <div class="ok-slider__title"><slot name="title" /></div>
    <div class="ok-slider__nav">
      <button class="ok-slider__arrow" @click="scrollByCards(-1)" aria-label="Previous">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      </button>
      <button class="ok-slider__arrow" @click="scrollByCards(1)" aria-label="Next">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>
  </div>

  <div class="ok-slider__track" ref="track">
    <a v-for="p in items" :key="p.slug" :href="p.url" class="ok-bigcard">
      <div class="ok-bigcard__frame">
        <div class="ok-bigcard__media">
          <img v-if="p.image" :src="p.image" :alt="p.title" loading="lazy" />
          <div v-else class="ok-bigcard__ph">◐</div>
        </div>
      </div>
      <div class="ok-bigcard__body">
        <h3 class="ok-bigcard__title">{{ p.title }}</h3>
        <span class="ok-bigcard__read">{{ p.readingTime || 5 }} min read</span>
      </div>
    </a>
  </div>
</div>
</template>

<style scoped>
.ok-slider { margin-top: 0; }

/* Header: title left, arrows right */
.ok-slider__head {
  display: flex; align-items: flex-end; justify-content: space-between;
  gap: 1.5rem; margin-bottom: 2rem;
}
.ok-slider__title { flex: 1; min-width: 0; }
.ok-slider__nav { display: flex; gap: 0.6rem; flex-shrink: 0; }
.ok-slider__arrow {
  width: 46px; height: 46px; border-radius: 999px;
  display: inline-flex; align-items: center; justify-content: center;
  background: transparent; color: var(--vp-c-text-1);
  border: 1px solid var(--vp-c-border); cursor: pointer;
  transition: background .2s, border-color .2s, transform .2s, color .2s;
}
.ok-slider__arrow:hover {
  background: var(--vp-c-text-1); color: var(--vp-c-bg);
  border-color: var(--vp-c-text-1); transform: translateY(-1px);
}

/* Horizontal scrolling track */
.ok-slider__track {
  display: flex; gap: 28px;
  overflow-x: auto; scroll-snap-type: x mandatory;
  scroll-behavior: smooth; scrollbar-width: none;
  /* vertical padding gives the soft card shadow room (overflow-x clips y) */
  padding: 16px 0 32px 0;
}
.ok-slider__track::-webkit-scrollbar { display: none; }

/* Big editorial card */
.ok-bigcard {
  /* exactly 3 whole cards per view (gap 28px → 2 gaps) — no sliced cards */
  flex: 0 0 calc((100% - 56px) / 3); max-width: calc((100% - 56px) / 3);
  scroll-snap-align: start;
  text-decoration: none !important;
  display: flex; flex-direction: column;
  transition: transform .25s cubic-bezier(.2,.7,.3,1);
}
@media (max-width: 1024px) {
  .ok-bigcard { flex-basis: calc((100% - 28px) / 2); max-width: calc((100% - 28px) / 2); }
}
.ok-bigcard:hover { transform: translateY(-6px); }
/* Card shell: image in a soft inset panel, then title + reading time */
.ok-bigcard {
  background: var(--vp-c-bg-alt); border: 1px solid var(--vp-c-border);
  border-radius: 18px; overflow: hidden;
  box-shadow: 0 6px 20px -12px rgba(22,24,29,0.22), 0 2px 6px -4px rgba(22,24,29,0.10);
}
.ok-bigcard:hover { box-shadow: 0 18px 38px -16px rgba(22,24,29,0.28), 0 4px 12px -6px rgba(22,24,29,0.14); }
:global(.dark) .ok-bigcard { box-shadow: 0 10px 28px -14px rgba(0,0,0,0.6); }
.ok-bigcard__frame { background: var(--vp-c-bg-soft); padding: 1.5rem; }
.ok-bigcard__media {
  position: relative; aspect-ratio: 4 / 3; overflow: hidden;
  border-radius: 10px; background: #14161c;
  box-shadow: 0 8px 22px -10px rgba(22,24,29,0.30);
}
.ok-bigcard__media img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
.ok-bigcard:hover .ok-bigcard__media img { transform: scale(1.04); }
.ok-bigcard__ph {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-size: 3rem; color: rgba(105,145,199,0.4);
  background: radial-gradient(circle at 35% 30%, rgba(105,145,199,0.18), transparent 60%), #14161c;
}
.ok-bigcard__body { padding: 1.3rem 1.5rem 1.6rem; }
.ok-bigcard__title {
  font-family: var(--ok-font-bold); font-weight: 700;
  font-size: 1.3rem; line-height: 1.2; letter-spacing: -0.02em;
  color: var(--vp-c-text-1); margin: 0 0 .5rem;
}
.ok-bigcard:hover .ok-bigcard__title { color: var(--ok-accent-deep); }
:global(.dark) .ok-bigcard:hover .ok-bigcard__title { color: var(--ok-accent-a); }
.ok-bigcard__read { font-size: .9rem; color: var(--vp-c-text-3); }

@media (max-width: 640px) {
  .ok-bigcard { flex-basis: 82vw; max-width: 82vw; }
  .ok-bigcard__title { font-size: 1.2rem; }
}
</style>
