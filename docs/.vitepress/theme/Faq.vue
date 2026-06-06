<script setup>
import { ref } from 'vue'

const faqs = [
  {
    q: 'Can I get a copy of your papers?',
    a: "Absolutely. If a paper sits behind a paywall, email me and I'll happily send you a private copy — just mention which one you're after.",
  },
  {
    q: 'Are you open to collaborations?',
    a: 'Yes. I enjoy working across remote sensing, analogue modelling, and numerical geodynamics. If our interests overlap on Mars, Venus, or the icy moons, get in touch and we can find a shared question.',
  },
  {
    q: 'Do you give talks or supervise students?',
    a: "I'm glad to discuss student projects, guest lectures, and outreach talks on planetary tectonics and geodynamics. Reach out with what you have in mind and we'll see if it fits.",
  },
  {
    q: 'Which tools and codes do you use?',
    a: 'Mostly ASPECT, LaMEM, and iSALE for modelling, alongside scaled analogue experiments and GIS-based geological mapping. I also help develop and benchmark open-source geodynamics codes.',
  },
  {
    q: 'Where can I find your data and code?',
    a: 'Datasets and scripts behind my papers are shared on request and, where possible, in public repositories. Ask me about a specific study and I will point you to the right place.',
  },
  {
    q: "What's the best way to reach you?",
    a: 'Email is best — oguzcan.karagoz@geologie.uni-freiburg.de. I am based at the Institute of Geosciences, University of Freiburg.',
  },
]

const open = ref(0)
function toggle(i) { open.value = open.value === i ? -1 : i }
</script>

<template>
<section class="ok-faq">
  <div class="ok-faq__intro">
    <div class="ok-faq__label">FAQs</div>
    <h2 class="ok-faq__title">Answers to common questions about <span>my research and working together</span></h2>
    <a class="ok-faq__btn" href="mailto:oguzcan.karagoz@geologie.uni-freiburg.de">Email me</a>
  </div>

  <div class="ok-faq__list">
    <div v-for="(f, i) in faqs" :key="i" class="ok-faq__item" :class="{ 'is-open': open === i }">
      <button class="ok-faq__q" type="button" :aria-expanded="open === i" @click="toggle(i)">
        <span>{{ f.q }}</span>
        <svg class="ok-faq__icon" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
        </svg>
      </button>
      <div class="ok-faq__a">
        <div class="ok-faq__a-inner"><p>{{ f.a }}</p></div>
      </div>
    </div>
  </div>
</section>
</template>

<style scoped>
.ok-faq {
  display: grid; grid-template-columns: 1fr 1.15fr; gap: 3rem;
  align-items: start; margin: 3rem 0 1rem;
}
@media (max-width: 820px) { .ok-faq { grid-template-columns: 1fr; gap: 2rem; } }

.ok-faq__intro { position: sticky; top: 96px; }
.ok-faq__label {
  font-family: var(--vp-font-family-mono); font-size: 0.8rem;
  letter-spacing: 0.12em; text-transform: uppercase; color: var(--vp-c-text-3);
  margin-bottom: 1rem;
}
.ok-faq__title {
  font-family: var(--ok-font-display); font-weight: 300;
  font-size: clamp(1.8rem, 3vw, 2.6rem); line-height: 1.12; letter-spacing: -0.03em;
  color: var(--vp-c-text-1); margin: 0 0 1.8rem; border: none; padding: 0;
}
.ok-faq__title span { color: var(--vp-c-text-3); }
.ok-faq__btn {
  display: inline-flex; align-items: center;
  padding: 0.7rem 1.5rem; border-radius: 999px;
  background: var(--vp-c-text-1); color: var(--vp-c-bg) !important;
  font-weight: 600; font-size: 0.98rem; text-decoration: none !important;
  transition: transform .2s, opacity .2s;
}
.ok-faq__btn:hover { transform: translateY(-2px); opacity: 0.9; }

.ok-faq__list { display: flex; flex-direction: column; gap: 0.8rem; }
.ok-faq__item {
  background: var(--vp-c-bg-alt); border: 1px solid var(--vp-c-border);
  border-radius: 14px; overflow: hidden;
  transition: box-shadow .25s, border-color .25s;
}
.ok-faq__item.is-open { box-shadow: var(--ok-shadow); border-color: transparent; }
.ok-faq__q {
  width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 1rem;
  background: none; border: none; cursor: pointer; text-align: left;
  font-family: var(--ok-font-bold); font-weight: 600; font-size: 1.12rem;
  color: var(--vp-c-text-1); padding: 1.2rem 1.4rem; line-height: 1.3;
}
.ok-faq__icon { flex: none; color: var(--vp-c-text-3); transition: transform .28s ease, color .2s; }
.ok-faq__item.is-open .ok-faq__icon { transform: rotate(45deg); color: var(--ok-accent-deep); }

.ok-faq__a { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .28s ease; }
.ok-faq__item.is-open .ok-faq__a { grid-template-rows: 1fr; }
.ok-faq__a-inner { overflow: hidden; }
.ok-faq__a p {
  margin: 0; padding: 0 1.4rem 1.3rem; font-size: 1rem; line-height: 1.65;
  color: var(--vp-c-text-2);
}
</style>
