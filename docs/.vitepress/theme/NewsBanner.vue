<script setup>
import { ref, onMounted } from 'vue'
import news from '../data/news.json'
// Content is edited via the CMS (Site Settings → News Banner) or docs/.vitepress/data/news.json

const KEY = 'ok-news-' + (news.href || news.text).slice(-24)
const visible = ref(false)
onMounted(() => {
  if (!news.show) return
  try { visible.value = localStorage.getItem(KEY) !== '1' } catch { visible.value = true }
})
function dismiss() {
  visible.value = false
  try { localStorage.setItem(KEY, '1') } catch {}
}
</script>

<template>
  <div v-if="visible" class="ok-news">
    <div class="ok-news__blob ok-news__blob--l" aria-hidden="true"><span /></div>
    <div class="ok-news__blob ok-news__blob--r" aria-hidden="true"><span /></div>

    <div class="ok-news__body">
      <p class="ok-news__text">
        <strong>{{ news.tag }}</strong>
        <svg viewBox="0 0 2 2" class="ok-news__dot" aria-hidden="true"><circle r="1" cx="1" cy="1" /></svg>
        {{ news.text }}
      </p>
      <a v-if="news.cta" class="ok-news__cta" :href="news.href" target="_blank" rel="noopener">
        {{ news.cta }} <span aria-hidden="true">→</span>
      </a>
    </div>

    <button class="ok-news__close" type="button" @click="dismiss" aria-label="Dismiss">
      <svg viewBox="0 0 20 20" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" /></svg>
    </button>
  </div>
</template>

<style scoped>
.ok-news {
  position: relative; isolation: isolate; overflow: hidden;
  display: flex; align-items: center; gap: 1.5rem;
  padding: 0.65rem 1.4rem;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}
/* soft gradient blobs (clip-path) behind the bar */
.ok-news__blob { position: absolute; top: 50%; z-index: -1; transform: translateY(-50%); filter: blur(40px); pointer-events: none; }
.ok-news__blob--l { left: max(-7rem, calc(50% - 52rem)); }
.ok-news__blob--r { left: max(45rem, calc(50% + 8rem)); }
.ok-news__blob span {
  display: block; width: 36rem; aspect-ratio: 577/310; opacity: 0.28;
  clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%);
  background: linear-gradient(to right, #a3bded, #9089fc);
}

.ok-news__body {
  flex: 1 1 auto; display: flex; flex-wrap: wrap; align-items: center;
  justify-content: center; gap: 0.6rem 1rem;
}
.ok-news__text { margin: 0; font-size: 0.92rem; color: var(--vp-c-text-1); }
.ok-news__text strong { font-weight: 600; }
.ok-news__dot { display: inline-block; width: 3px; height: 3px; margin: 0 0.5rem; fill: var(--vp-c-text-3); vertical-align: middle; }
.ok-news__cta {
  flex: none; display: inline-flex; align-items: center; gap: 0.3rem;
  padding: 0.3rem 0.9rem; border-radius: 999px;
  background: var(--vp-c-text-1); color: var(--vp-c-bg) !important;
  font-size: 0.85rem; font-weight: 600; text-decoration: none !important;
  transition: opacity .2s, transform .2s;
}
.ok-news__cta:hover { opacity: 0.88; transform: translateY(-1px); }
.ok-news__close {
  flex: none; background: none; border: none; cursor: pointer;
  color: var(--vp-c-text-2); padding: 0.3rem; display: inline-flex; border-radius: 6px;
}
.ok-news__close:hover { color: var(--vp-c-text-1); background: var(--vp-c-bg-alt); }

@media (max-width: 640px) {
  .ok-news { gap: 0.6rem; padding: 0.6rem 0.9rem; }
  .ok-news__text { font-size: 0.85rem; }
}
</style>
