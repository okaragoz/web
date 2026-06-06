<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import researchData from '../data/research.json'

const root = ref(null)
let rafs = []
let onResize = null
// Respect users who prefer reduced motion — draw the planets static, no animation
const REDUCE = typeof window !== 'undefined' && window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ── Research content (edited via CMS / docs/.vitepress/data/research.json) ── */
const topics = researchData.topics
const planets = researchData.planets
const studies = researchData.studies
const missions = researchData.missions

/* ── helper: load an image ── */
function loadImg(src) { const i = new Image(); i.src = src; return i }

/* ════════════════ VENUS — mantle convection cells ════════════════ */
function animVenus(cv) {
  const ctx = cv.getContext('2d')
  const img = loadImg('/images/research/venus.png')
  let W, H, cells = [], tick = 0

  function buildCells() {
    W = cv.width; H = cv.height; cells = []
    const s = H, ox = (W - H) / 2
    const cx = ox + s * 0.5, cy = s * 0.508
    const Ro = s * 0.415, Ri = s * 0.178
    const N = 8, a0 = -1.36, a1 = 1.36, da = (a1 - a0) / N
    for (let i = 0; i < N; i++) {
      const th0 = a0 + i * da + 0.022, th1 = a0 + (i + 1) * da - 0.022
      const dir = i % 2 === 0 ? 1 : -1
      const aR = dir > 0 ? th0 : th1, aS = dir > 0 ? th1 : th0
      const S = 22, loop = []
      for (let j = 0; j <= S; j++) { const r = Ri + (Ro - Ri) * (j / S); loop.push([cx + r * Math.cos(aR), cy + r * Math.sin(aR), j / S < 0.5]) }
      for (let j = 1; j <= S; j++) { const aa = aR + (aS - aR) * (j / S); loop.push([cx + Ro * Math.cos(aa), cy + Ro * Math.sin(aa), false]) }
      for (let j = 1; j <= S; j++) { const r = Ro - (Ro - Ri) * (j / S); loop.push([cx + r * Math.cos(aS), cy + r * Math.sin(aS), j / S > 0.5]) }
      for (let j = 1; j <= S; j++) { const aa = aS + (aR - aS) * (j / S); loop.push([cx + Ri * Math.cos(aa), cy + Ri * Math.sin(aa), true]) }
      loop.push(loop[0].slice())
      const parts = []
      for (let p = 0; p < 5; p++) parts.push({ pos: p / 5, sp: 0.00095 + Math.random() * 0.0006, trail: [] })
      cells.push({ loop, parts })
    }
  }
  function sampleLoop(loop, u) {
    const n = loop.length - 1, f = Math.max(0, Math.min(0.9999, u)) * n
    const idx = Math.floor(f) | 0, ff = f - idx
    const a = loop[idx], b = loop[Math.min(idx + 1, n)]
    return [a[0] + (b[0] - a[0]) * ff, a[1] + (b[1] - a[1]) * ff, a[2]]
  }
  function frame() {
    tick++
    ctx.clearRect(0, 0, W, H)
    if (img.complete && img.naturalWidth) ctx.drawImage(img, (W - H) / 2, 0, H, H)
    const s = H, ox = (W - H) / 2
    const cx = ox + s * 0.5, cy = s * 0.508
    const Ro = s * 0.415, Ri = s * 0.178
    ctx.save()
    ctx.beginPath()
    ctx.arc(cx, cy, Ro, -Math.PI / 2, Math.PI / 2, false)
    ctx.arc(cx, cy, Ri, Math.PI / 2, -Math.PI / 2, true)
    ctx.closePath(); ctx.clip()
    ctx.globalCompositeOperation = 'screen'
    cells.forEach(function (cell) {
      ctx.beginPath()
      cell.loop.forEach(function (p, i) { i === 0 ? ctx.moveTo(p[0], p[1]) : ctx.lineTo(p[0], p[1]) })
      ctx.strokeStyle = 'rgba(240,160,30,0.045)'; ctx.lineWidth = s * 0.007; ctx.stroke()
      cell.parts.forEach(function (pt) {
        pt.pos = (pt.pos + pt.sp) % 1
        const p = sampleLoop(cell.loop, pt.pos)
        pt.trail.push([p[0], p[1]])
        if (pt.trail.length > 14) pt.trail.shift()
        const hot = p[2]
        for (let j = 1; j < pt.trail.length; j++) {
          const fa = j / pt.trail.length
          ctx.beginPath()
          ctx.moveTo(pt.trail[j - 1][0], pt.trail[j - 1][1])
          ctx.lineTo(pt.trail[j][0], pt.trail[j][1])
          ctx.strokeStyle = hot ? 'rgba(255,195,55,' + fa * 0.48 + ')' : 'rgba(210,65,10,' + fa * 0.38 + ')'
          ctx.lineWidth = s * 0.01 * fa; ctx.stroke()
        }
        ctx.save()
        ctx.shadowBlur = s * 0.03
        ctx.shadowColor = hot ? 'rgba(255,190,40,1)' : 'rgba(220,60,5,0.9)'
        ctx.beginPath(); ctx.arc(p[0], p[1], s * 0.009, 0, Math.PI * 2)
        ctx.fillStyle = hot ? 'rgba(255,228,100,0.95)' : 'rgba(230,80,15,0.88)'
        ctx.fill(); ctx.shadowBlur = 0; ctx.restore()
      })
    })
    ctx.globalCompositeOperation = 'source-over'
    ctx.restore()
    if (!REDUCE) rafs.push(requestAnimationFrame(frame))
  }
  img.addEventListener('load', frame); buildCells(); frame()
  return buildCells
}

/* ════════════════ MARS — stagnant-lid thermal pulse ════════════════ */
function animMars(cv) {
  const ctx = cv.getContext('2d')
  const img = loadImg('/images/research/mars.png')
  let W, H, tick = 0
  function setup() { W = cv.width; H = cv.height }
  function frame() {
    tick++
    ctx.clearRect(0, 0, W, H)
    if (img.complete && img.naturalWidth) ctx.drawImage(img, (W - H) / 2, 0, H, H)
    const s = H, ox = (W - H) / 2
    const corex = ox + s * 0.64, corey = s * 0.555
    const coreRx = s * 0.072, coreRy = s * 0.055, outerR = s * 0.39
    ctx.save()
    ctx.globalCompositeOperation = 'screen'
    for (let k = 0; k < 5; k++) {
      const phase = ((tick * 0.0055) - k * 0.22 + 1) % 1
      const r = coreRx * 1.2 + phase * (outerR - coreRx * 1.2)
      const alpha = Math.max(0, (1 - phase) * 0.52 * ((k === 0) ? 1.15 : 1))
      const ringW = s * 0.014 * (1 - phase * 0.6)
      const rg = ctx.createRadialGradient(corex, corey, Math.max(0, r - ringW), corex, corey, r + ringW)
      rg.addColorStop(0, 'rgba(255,150,30,0)')
      rg.addColorStop(0.45, 'rgba(255,150,30,' + alpha + ')')
      rg.addColorStop(1, 'rgba(255,150,30,0)')
      ctx.fillStyle = rg
      ctx.beginPath()
      ctx.ellipse(corex, corey, r + ringW, (r + ringW) * 0.76, 0, 0, Math.PI * 2)
      ctx.fill()
    }
    const pulse = 0.28 + 0.14 * Math.sin(tick * 0.038)
    const cg = ctx.createRadialGradient(corex, corey, 0, corex, corey, coreRx * 2.2)
    cg.addColorStop(0, 'rgba(255,255,210,' + pulse + ')')
    cg.addColorStop(0.38, 'rgba(255,175,50,' + (pulse * 0.65) + ')')
    cg.addColorStop(1, 'rgba(240,80,5,0)')
    ctx.fillStyle = cg
    ctx.beginPath(); ctx.ellipse(corex, corey, coreRx * 2.2, coreRy * 2.2, 0, 0, Math.PI * 2); ctx.fill()
    ctx.globalCompositeOperation = 'source-over'
    ctx.restore()
    if (!REDUCE) rafs.push(requestAnimationFrame(frame))
  }
  img.addEventListener('load', frame); setup(); frame()
  return setup
}

/* ════════════════ GANYMEDE — cycling impact crater ════════════════ */
function animGanymede(cv) {
  const ctx = cv.getContext('2d')
  const img = loadImg('/images/research/ganymede.png')
  let W, H, tick = 0
  const CYCLE = 600
  function setup() { W = cv.width; H = cv.height }
  function getGeo() {
    const s = H, ox = (W - H) / 2
    const cx = ox + s * 0.5, cy = s * 0.5, R = s * 0.458
    const ath = 162 * Math.PI / 180
    return { cx, cy, R, ix: cx + R * Math.cos(ath), iy: cy + R * Math.sin(ath), s }
  }
  function frame() {
    tick++
    ctx.clearRect(0, 0, W, H)
    if (img.complete && img.naturalWidth) ctx.drawImage(img, (W - H) / 2, 0, H, H)
    const g = getGeo(), ix = g.ix, iy = g.iy, s = g.s
    const phase = (tick % CYCLE) / CYCLE
    const cR = s * 0.044
    ctx.save()
    ctx.beginPath()
    ctx.arc(g.cx, g.cy, g.R, Math.PI / 2, 3 * Math.PI / 2, false)
    ctx.closePath(); ctx.clip()
    if (phase < 0.13) {
      const p = phase / 0.13
      const sx = ix + s * 0.09, sy = iy - s * 0.14
      const currX = sx + (ix - sx) * p, currY = sy + (iy - sy) * p
      ctx.save(); ctx.globalCompositeOperation = 'screen'
      const tg = ctx.createLinearGradient(sx, sy, currX, currY)
      tg.addColorStop(0, 'rgba(160,145,110,0)'); tg.addColorStop(1, 'rgba(230,195,115,0.55)')
      ctx.strokeStyle = tg; ctx.lineWidth = s * 0.007
      ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(currX, currY); ctx.stroke()
      ctx.shadowBlur = s * 0.022; ctx.shadowColor = 'rgba(215,195,135,0.9)'
      ctx.beginPath(); ctx.arc(currX, currY, s * 0.011, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(195,175,115,0.92)'; ctx.fill(); ctx.restore()
    } else if (phase < 0.22) {
      const p = (phase - 0.13) / 0.09
      ctx.save(); ctx.globalCompositeOperation = 'screen'
      const flashR = s * 0.012 + p * s * 0.1
      const flashA = Math.max(0, 0.78 * (1 - p))
      const fg = ctx.createRadialGradient(ix, iy, 0, ix, iy, flashR)
      fg.addColorStop(0, 'rgba(235,230,215,' + flashA + ')')
      fg.addColorStop(0.4, 'rgba(195,155,75,' + (flashA * 0.55) + ')')
      fg.addColorStop(1, 'rgba(170,115,35,0)')
      ctx.shadowBlur = s * 0.038; ctx.shadowColor = 'rgba(230,220,195,0.85)'
      ctx.beginPath(); ctx.arc(ix, iy, flashR, 0, Math.PI * 2); ctx.fillStyle = fg; ctx.fill()
      ctx.globalCompositeOperation = 'source-over'
      const swR = s * 0.018 + p * s * 0.16
      ctx.strokeStyle = 'rgba(185,200,212,' + (0.52 - p * 0.44) + ')'
      ctx.lineWidth = s * 0.004 * (1 - p * 0.7)
      ctx.beginPath(); ctx.arc(ix, iy, swR, 0, Math.PI * 2); ctx.stroke()
      const sw2R = s * 0.012 + p * s * 0.24
      ctx.strokeStyle = 'rgba(170,190,205,' + (0.3 - p * 0.28) + ')'
      ctx.lineWidth = s * 0.0025
      ctx.beginPath(); ctx.arc(ix, iy, sw2R, 0, Math.PI * 2); ctx.stroke(); ctx.restore()
    } else if (phase < 0.48) {
      const p = (phase - 0.22) / 0.26
      const cavR = cR * 1.35 * p
      ctx.save()
      for (let k = 0; k < 20; k++) {
        const ang = k / 20 * Math.PI * 2
        const ejL = s * 0.048 * p + s * 0.012 * (0.6 + 0.4 * Math.sin(ang * 4))
        const ejA = (0.08 + 0.08 * Math.sin(ang * 3 + 1)) * Math.min(1, p * 2.5)
        ctx.strokeStyle = 'rgba(188,208,220,' + ejA + ')'
        ctx.lineWidth = s * 0.0018 * (1 - p * 0.45)
        ctx.beginPath(); ctx.moveTo(ix, iy)
        ctx.lineTo(ix + Math.cos(ang) * ejL, iy + Math.sin(ang) * ejL * 0.82); ctx.stroke()
      }
      ctx.restore()
      ctx.beginPath(); ctx.ellipse(ix, iy, cavR, cavR * 0.76, 0, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(72,105,128,' + (0.28 * p) + ')'; ctx.fill()
      ctx.strokeStyle = 'rgba(125,152,168,' + (0.48 + p * 0.22) + ')'
      ctx.lineWidth = s * 0.003; ctx.stroke()
    } else if (phase < 0.66) {
      const p = (phase - 0.48) / 0.18
      const cavR = cR * (1 + 0.06 * (1 - p))
      const eg = ctx.createRadialGradient(ix, iy, cavR, ix, iy, cR * 2.8)
      eg.addColorStop(0, 'rgba(175,198,212,' + 0.24 * p + ')'); eg.addColorStop(1, 'rgba(175,198,212,0)')
      ctx.beginPath(); ctx.ellipse(ix, iy, cR * 2.8, cR * 2.1, 0, 0, Math.PI * 2); ctx.fillStyle = eg; ctx.fill()
      ctx.beginPath(); ctx.ellipse(ix, iy, cavR, cavR * 0.76, 0, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(68,102,122,0.42)'; ctx.fill()
      ctx.strokeStyle = 'rgba(118,148,165,0.65)'; ctx.lineWidth = s * 0.003; ctx.stroke()
      ctx.beginPath(); ctx.ellipse(ix, iy, cavR * 1.12, cavR * 0.85, 0, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(142,168,182,' + (0.3 + p * 0.2) + ')'; ctx.lineWidth = s * 0.0025; ctx.stroke()
      const pkH = cR * 0.54 * p
      ctx.beginPath()
      ctx.moveTo(ix - cavR * 0.22, iy + cavR * 0.1)
      ctx.lineTo(ix, iy - pkH)
      ctx.lineTo(ix + cavR * 0.22, iy + cavR * 0.1)
      ctx.closePath(); ctx.fillStyle = 'rgba(158,182,198,' + p + ')'; ctx.fill()
    } else {
      const fadeIn = Math.min(1, (phase - 0.66) / 0.04)
      const eg = ctx.createRadialGradient(ix, iy, cR, ix, iy, cR * 3.2)
      eg.addColorStop(0, 'rgba(172,198,215,' + 0.26 * fadeIn + ')'); eg.addColorStop(1, 'rgba(172,198,215,0)')
      ctx.beginPath(); ctx.ellipse(ix, iy, cR * 3.2, cR * 2.4, 0, 0, Math.PI * 2); ctx.fillStyle = eg; ctx.fill()
      ctx.beginPath(); ctx.ellipse(ix, iy, cR, cR * 0.76, 0, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(62,98,120,' + 0.5 * fadeIn + ')'; ctx.fill()
      ctx.strokeStyle = 'rgba(108,140,160,' + 0.72 * fadeIn + ')'; ctx.lineWidth = s * 0.003; ctx.stroke()
      ctx.beginPath(); ctx.ellipse(ix, iy, cR * 1.12, cR * 0.85, 0, 0, Math.PI * 2)
      ctx.strokeStyle = 'rgba(138,165,180,' + 0.5 * fadeIn + ')'; ctx.lineWidth = s * 0.0025; ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(ix - cR * 0.2, iy + cR * 0.08)
      ctx.lineTo(ix, iy - cR * 0.52)
      ctx.lineTo(ix + cR * 0.2, iy + cR * 0.08)
      ctx.closePath(); ctx.fillStyle = 'rgba(155,180,198,' + 0.88 * fadeIn + ')'; ctx.fill()
      ctx.strokeStyle = 'rgba(105,138,158,' + 0.38 * fadeIn + ')'; ctx.lineWidth = s * 0.0018; ctx.stroke()
      ;[1.82, 2.88].forEach(function (m) {
        ctx.beginPath(); ctx.ellipse(ix, iy, cR * m, cR * m * 0.76, 0, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(115,148,168,' + 0.28 * fadeIn + ')'; ctx.lineWidth = s * 0.0018; ctx.stroke()
      })
    }
    ctx.restore()
    if (!REDUCE) rafs.push(requestAnimationFrame(frame))
  }
  img.addEventListener('load', frame); setup(); frame()
  return setup
}

onMounted(() => {
  const el = root.value
  if (!el) return

  // canvases
  const setups = []
  const venus = el.querySelector('#ok-cv-venus')
  const mars = el.querySelector('#ok-cv-mars')
  const ganymede = el.querySelector('#ok-cv-ganymede')
  if (venus) setups.push([venus, animVenus(venus)])
  if (mars) setups.push([mars, animMars(mars)])
  if (ganymede) setups.push([ganymede, animGanymede(ganymede)])

  onResize = () => {
    setups.forEach(([cv, rebuild]) => {
      cv.width = cv.offsetWidth * 2
      cv.height = cv.offsetHeight * 2
      rebuild()
    })
  }
  window.addEventListener('resize', onResize)

  // scroll reveal
  const reveal = el.querySelectorAll('.ok-planet,.ok-subtopic,.ok-method-card,.ok-code-card,.ok-methods-section,.ok-code-section,.ok-reveal')
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return
      const d = parseInt(e.target.getAttribute('data-ok-delay') || '0')
      setTimeout(() => e.target.classList.add('ok-in'), d)
      obs.unobserve(e.target)
    })
  }, { threshold: 0.06 })
  reveal.forEach((node) => {
    const r = node.getBoundingClientRect()
    if (r.top < window.innerHeight * 1.05) {
      const d = parseInt(node.getAttribute('data-ok-delay') || '0')
      setTimeout(() => node.classList.add('ok-in'), d + 60)
    } else obs.observe(node)
  })

  // tab activation
  el.querySelectorAll('.ok-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const row = tab.closest('.ok-tabs')
      row.querySelectorAll('.ok-tab').forEach((tt) => {
        tt.classList.remove('ok-active'); tt.style.color = ''; tt.style.borderBottomColor = ''
      })
      tab.classList.add('ok-active')
      const c = tab.style.getPropertyValue('--c') || '#0d0d0d'
      tab.style.color = c; tab.style.borderBottomColor = c
    })
  })
})

onBeforeUnmount(() => {
  rafs.forEach((id) => cancelAnimationFrame(id))
  rafs = []
  if (onResize) window.removeEventListener('resize', onResize)
})
</script>

<template>
<section class="ok-research" ref="root">

  <div class="ok-reveal">
    <div class="ok-topics ok-topics--top">
      <span v-for="t in topics" :key="t" class="ok-topic-pill">{{ t }}</span>
    </div>
  </div>

  <!-- PLANETS (Venus / Mars / Ganymede) — content from data/research.json -->
  <div v-for="p in planets" :key="p.name" class="ok-planet" :id="'ok-' + p.name.toLowerCase()">
    <div class="ok-planet__accent" :style="{ background: p.accent }"></div>
    <div class="ok-planet__top">
      <canvas class="ok-canvas" :id="'ok-cv-' + p.name.toLowerCase()" width="1040" height="620"></canvas>
      <div class="ok-planet__meta">
        <span class="ok-planet-tag" :style="{ color: p.accent }">{{ p.symbol }} &nbsp;{{ p.name }}</span>
        <h3 class="ok-planet__title">{{ p.title }}</h3>
        <p class="ok-planet__desc">{{ p.desc }}</p>
        <div class="ok-tabs">
          <button v-for="(tb, ti) in p.tabs" :key="tb" class="ok-tab" :class="{ 'ok-active': ti === 0 }" :style="{ '--c': p.accent }">{{ tb }}</button>
        </div>
      </div>
    </div>
    <div class="ok-subtopics">
      <div v-for="(st, si) in p.subtopics" :key="st.num" class="ok-subtopic" :data-ok-delay="si * 120">
        <div class="ok-subtopic__num">{{ st.num }}</div>
        <div class="ok-subtopic__title">{{ st.title }}</div>
        <p class="ok-subtopic__body">{{ st.body }}</p>
      </div>
    </div>
  </div>

  <!-- RESEARCH IN DEPTH -->
  <div class="ok-indepth">
    <div class="ok-eyebrow">Research in depth</div>
    <h2 class="ok-h2"><b>Selected studies</b></h2>
    <div v-for="group in studies" :key="group.planet" class="ok-indepth__group ok-reveal" data-ok-delay="0">
      <div class="ok-indepth__head">
        <span class="ok-indepth__bar" :style="{ background: group.accent }"></span>
        <h3 class="ok-indepth__planet" :style="{ color: group.accent }">{{ group.planet }}</h3>
      </div>
      <p class="ok-indepth__intro">{{ group.intro }}</p>
      <div class="ok-studies">
        <article v-for="(s, i) in group.items" :key="s.title"
          class="ok-study" :class="{ 'ok-study--rev': i % 2 === 1 }">
          <div class="ok-study__media">
            <img v-if="s.image" :src="s.image" :alt="s.title" loading="lazy" />
            <div v-else class="ok-study__ph" :style="{ color: group.accent }">◐</div>
          </div>
          <div class="ok-study__text">
            <h4 class="ok-study__title">{{ s.title }}</h4>
            <p class="ok-study__body">{{ s.body }}</p>
            <div class="ok-study__papers">
              <span class="ok-study__pub">Published in</span>
              <a v-for="p in s.papers" :key="p.href" :href="p.href" target="_blank" rel="noopener"
                 class="ok-study__paper" :style="{ '--c': group.accent }">{{ p.label }}</a>
            </div>
          </div>
        </article>
      </div>
    </div>
  </div>

  <!-- METHODS -->
  <div class="ok-methods-section">
    <div class="ok-eyebrow">Research Methods</div>
    <h2 class="ok-h2"><b>Approaches &amp; Tools</b></h2>
    <div class="ok-methods-grid">
      <div class="ok-method-card" data-ok-delay="0">
        <div class="ok-method-card__label">Physical</div>
        <div class="ok-method-card__name">Analogue Modelling</div>
        <p class="ok-method-card__desc">Scaled laboratory experiments using silicone polymers, granular sand, and layered viscous materials to replicate tectonic and volcanic processes under controlled conditions. Quantifies fault geometry, strain localisation, and plume–lithosphere interaction kinematics.</p>
      </div>
      <div class="ok-method-card" data-ok-delay="100">
        <div class="ok-method-card__label">Numerical · Mantle Convection</div>
        <div class="ok-method-card__name">ASPECT</div>
        <p class="ok-method-card__desc">Advanced Solver for Problems in Earth's ConvecTion — finite-element mantle convection code. Used for planetary interior simulations: thermochemical evolution, plume dynamics, and lithospheric thickening under single-lid regimes on Venus, Mars, and icy moons.</p>
      </div>
      <div class="ok-method-card" data-ok-delay="200">
        <div class="ok-method-card__label">Numerical · Geomechanics</div>
        <div class="ok-method-card__name">LaMEM</div>
        <p class="ok-method-card__desc">Lithosphere and Mantle Evolution Model — massively parallel staggered-grid finite-difference code for coupled geodynamic and geomechanical problems. Applied to lithospheric deformation, viscoelastoplastic fault systems, rifting, and compressional tectonic regimes.</p>
      </div>
      <div class="ok-method-card" data-ok-delay="300">
        <div class="ok-method-card__label">Numerical · Impact</div>
        <div class="ok-method-card__name">iSALE</div>
        <p class="ok-method-card__desc">Impact Simplified Arbitrary Lagrangian–Eulerian hydrocode — simulates hypervelocity impact cratering, shock-wave propagation, melt generation, and crater scaling in planetary materials. Applied to multi-ring basin formation and impact-driven tectonic responses in icy and rocky targets.</p>
      </div>
    </div>
  </div>

  <!-- CODE DEVELOPMENT -->
  <div class="ok-code-section">
    <div class="ok-eyebrow">Development</div>
    <h2 class="ok-h2"><b>Numerical Geodynamics</b><br>Code Development</h2>
    <p class="ok-lead">Beyond running simulations, I contribute to the development, benchmarking, and extension of open-source geodynamics codes — implementing planetary rheology modules, new material models, and post-processing pipelines.<span class="ok-cursor"></span></p>
    <div class="ok-code-grid">
      <div class="ok-code-card" data-ok-delay="0">
        <div class="ok-code-card__name">ASPECT</div>
        <span class="ok-code-card__lang" style="color:#5a7aaa;">C++ &nbsp;·&nbsp; deal.II &nbsp;·&nbsp; Trilinos</span>
        <p class="ok-code-card__desc">Planetary interior model contributions: non-Newtonian viscosity laws for stagnant-lid regimes, thermal boundary condition modules for Venus and Mars, and benchmarks for plume–lithosphere interaction under single-lid planetary conditions.</p>
        <div class="ok-code-tags">
          <span class="ok-code-tag">Viscosity models</span>
          <span class="ok-code-tag">Planetary BCs</span>
          <span class="ok-code-tag">Benchmarks</span>
        </div>
      </div>
      <div class="ok-code-card" data-ok-delay="150">
        <div class="ok-code-card__name">LaMEM</div>
        <span class="ok-code-card__lang" style="color:#5a9a60;">C &nbsp;·&nbsp; PETSc &nbsp;·&nbsp; MPI</span>
        <p class="ok-code-card__desc">Ice-shell rheology modules for icy moon applications; cryogenic-temperature extensions of viscoelastoplastic constitutive laws; parallel scaling benchmarks for compressional tectonic setups; graben and thrust fault formation test cases.</p>
        <div class="ok-code-tags">
          <span class="ok-code-tag">Ice rheology</span>
          <span class="ok-code-tag">Parallel scaling</span>
          <span class="ok-code-tag">Icy moon modules</span>
        </div>
      </div>
      <div class="ok-code-card" data-ok-delay="300">
        <div class="ok-code-card__name">iSALE</div>
        <span class="ok-code-card__lang" style="color:#aa6a5a;">Fortran &nbsp;·&nbsp; Python</span>
        <p class="ok-code-card__desc">Post-processing pipelines for impact melt volume, shock pressure mapping, and tectonic response analysis; equation-of-state tables for planetary silicates and ices; Python visualisation tools extending pySALEPlot for multi-layer icy target simulations.</p>
        <div class="ok-code-tags">
          <span class="ok-code-tag">EOS tables</span>
          <span class="ok-code-tag">pySALEPlot</span>
          <span class="ok-code-tag">Icy targets</span>
        </div>
      </div>
    </div>
  </div>

  <!-- MISSIONS -->
  <div class="ok-missions-section ok-reveal">
    <div class="ok-eyebrow">Missions &amp; Instruments</div>
    <h2 class="ok-h2"><b>Planetary Missions</b></h2>
    <div class="ok-missions">
      <div v-for="m in missions" :key="m.name" class="ok-mission ok-reveal" data-ok-delay="0">
        <div class="ok-mission__name">{{ m.name }}</div>
        <div class="ok-mission__org">{{ m.org }}</div>
        <p class="ok-mission__desc">{{ m.desc }}</p>
      </div>
    </div>
  </div>

</section>
</template>

<style scoped>
.ok-research {
  max-width: 1400px;
  margin: 0 auto;
  padding: 6px 0 12px;
  font-size: 20px;
  line-height: 1.6;
}

.ok-eyebrow {
  font-size: 14px; font-weight: 500; letter-spacing: .01em;
  color: var(--vp-c-text-3); margin-bottom: 14px;
}

.ok-h1 {
  font-family: var(--ok-font-display);
  font-size: clamp(34px, 3.8vw, 56px);
  font-weight: 600; letter-spacing: -.03em; line-height: 1.08;
  color: var(--vp-c-text-1); margin: 0 0 20px; border: none; padding: 0;
}
.ok-h1 b { font-weight: 700; }

.ok-h2 {
  font-family: var(--ok-font-bold);
  font-size: clamp(24px, 2.8vw, 40px);
  font-weight: 600; letter-spacing: -.025em; line-height: 1.12;
  color: var(--vp-c-text-1); margin: 0 0 16px; border: none; padding: 0;
}
.ok-h2 b { font-weight: 700; color: #C87030; }

.ok-lead {
  font-size: 21px; color: var(--vp-c-text-2);
  max-width: 100%; line-height: 1.8; margin-bottom: 80px; font-weight: 300;
}

.ok-topics { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 80px; }
/* Match the Publications page ID buttons */
.ok-topic-pill {
  display: inline-flex; align-items: center;
  font-size: 0.95rem; font-weight: 500; letter-spacing: .01em;
  color: var(--vp-c-text-1); border: 1px solid var(--vp-c-border);
  padding: 0.55rem 1.15rem; border-radius: 999px; background: var(--vp-c-bg-alt);
  transition: border-color .2s, color .2s, background .2s, transform .2s;
}
.ok-topic-pill:hover {
  border-color: var(--ok-accent); color: var(--ok-accent-deep);
  background: var(--vp-c-bg-soft); transform: translateY(-1px);
}
:global(.dark) .ok-topic-pill:hover { color: var(--ok-accent-a); }

.ok-planet {
  padding-bottom: 80px; margin-bottom: 80px;
  border-bottom: 1px solid var(--vp-c-divider);
  opacity: 0; transform: translateY(20px);
}
.ok-planet.ok-in { opacity: 1; transform: none; transition: opacity .7s ease, transform .7s ease; }
.ok-planet:last-of-type { border-bottom: none; }

.ok-planet__accent { width: 32px; height: 3px; margin-bottom: 28px; }

.ok-planet__top {
  display: grid; grid-template-columns: 520px 1fr; gap: 64px;
  align-items: start; margin-bottom: 0;
}
@media (max-width: 900px) { .ok-planet__top { grid-template-columns: 1fr; gap: 32px; } }

canvas.ok-canvas {
  width: 100%; display: block; border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0,0,0,.07), 0 1px 4px rgba(0,0,0,.05);
}

.ok-planet-tag {
  font-size: 16px; font-weight: 500; letter-spacing: .01em;
  margin-bottom: 10px; display: block;
}
.ok-planet__title {
  font-family: var(--ok-font-bold);
  font-size: clamp(20px, 2.2vw, 28px);
  font-weight: 600; letter-spacing: -.022em; line-height: 1.18;
  color: var(--vp-c-text-1); margin: 0 0 16px;
}
.ok-planet__desc {
  font-size: 20px; color: var(--vp-c-text-2);
  line-height: 1.78; margin-bottom: 32px; font-weight: 400;
  text-align: justify; text-justify: inter-word;
}

.ok-tabs { display: flex; gap: 0; border-bottom: 1px solid var(--vp-c-divider); margin-bottom: 28px; }
.ok-tab {
  font-size: 16px; font-weight: 500; letter-spacing: .01em;
  color: var(--vp-c-text-3); padding: 8px 20px 8px 0; cursor: pointer;
  border: none; border-bottom: 2px solid transparent; margin-bottom: -1px;
  transition: color .2s, border-color .2s; background: none; font-family: inherit;
}
.ok-tab:hover { color: var(--vp-c-text-2); }
.ok-tab.ok-active { color: var(--vp-c-text-1); border-bottom-color: currentColor; }

.ok-subtopics {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
  background: var(--vp-c-divider); margin-top: 40px;
}
@media (max-width: 700px) { .ok-subtopics { grid-template-columns: 1fr; } }
.ok-subtopic {
  background: var(--vp-c-bg); padding: 28px 28px 36px;
  opacity: 0; transform: translateY(10px);
}
.ok-subtopic.ok-in { opacity: 1; transform: none; transition: opacity .55s ease, transform .55s ease; }
.ok-subtopic__num { font-size: 14px; font-weight: 500; color: var(--vp-c-text-3); margin-bottom: 12px; }
.ok-subtopic__title {
  font-family: var(--ok-font-bold);
  font-size: 16px; font-weight: 600; letter-spacing: -.012em;
  color: var(--vp-c-text-1); margin-bottom: 10px; line-height: 1.3;
}
.ok-subtopic__body { font-size: 19px; color: var(--vp-c-text-2); line-height: 1.72; }

.ok-methods-section {
  margin-top: 80px; padding-top: 64px; border-top: 1px solid var(--vp-c-divider);
  opacity: 0; transform: translateY(16px);
}
.ok-methods-section.ok-in { opacity: 1; transform: none; transition: opacity .6s ease, transform .6s ease; }
.ok-methods-grid {
  display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px;
  background: var(--vp-c-divider); margin-top: 40px;
}
@media (max-width: 800px) { .ok-methods-grid { grid-template-columns: repeat(2,1fr); } }
.ok-method-card {
  background: var(--vp-c-bg); padding: 32px 28px 36px;
  opacity: 0; transform: translateY(10px);
}
.ok-method-card.ok-in { opacity: 1; transform: none; transition: opacity .5s ease, transform .5s ease; }
.ok-method-card__label { font-size: 14px; font-weight: 400; color: var(--vp-c-text-3); margin-bottom: 10px; }
.ok-method-card__name {
  font-family: var(--ok-font-bold);
  font-size: 18px; font-weight: 600; letter-spacing: -.015em;
  color: var(--vp-c-text-1); margin-bottom: 12px;
}
.ok-method-card__desc { font-size: 17px; color: var(--vp-c-text-2); line-height: 1.7; font-weight: 300; }

/* Code section stays intentionally dark in both themes */
.ok-code-section {
  margin-top: 80px; background: #0c0c0c; padding: 72px 60px 80px;
  position: relative; overflow: hidden; border-radius: 16px;
  opacity: 0; transform: translateY(16px);
}
.ok-code-section.ok-in { opacity: 1; transform: none; transition: opacity .65s ease, transform .65s ease; }
.ok-code-section::before {
  content: ''; position: absolute; inset: 0;
  background: repeating-linear-gradient(0deg,transparent,transparent 44px,rgba(255,255,255,.015) 44px,rgba(255,255,255,.015) 45px);
  pointer-events: none;
}
.ok-code-section .ok-eyebrow { color: #6e6e73; }
.ok-code-section .ok-h2 { color: #f0f0f0; margin-bottom: 16px; }
.ok-code-section .ok-h2 b { color: #f0f0f0; }
.ok-code-section .ok-lead { color: #86868b; margin-bottom: 48px; max-width: 100%; }
@media (max-width: 700px) { .ok-code-section { padding: 56px 28px 64px; } }

.ok-code-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: #1e1e1e; }
@media (max-width: 700px) { .ok-code-grid { grid-template-columns: 1fr; } }
.ok-code-card { background: #0c0c0c; padding: 32px 28px 36px; opacity: 0; transform: translateY(12px); }
.ok-code-card.ok-in { opacity: 1; transform: none; transition: opacity .55s ease, transform .55s ease; }
.ok-code-card:hover { background: #111; }
.ok-code-card__name {
  font-family: var(--ok-font-bold);
  font-size: 20px; font-weight: 600; letter-spacing: -.015em; color: #f5f5f7; margin-bottom: 5px;
}
.ok-code-card__lang { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; margin-bottom: 16px; display: block; }
.ok-code-card__desc { font-size: 15.5px; color: #9a9a9a; line-height: 1.72; font-weight: 300; margin-bottom: 20px; }
.ok-code-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.ok-code-tag { font-size: 11.5px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; padding: 4px 10px; border: 1px solid #2a2a2a; color: #7a7a7a; }
.ok-cursor { display: inline-block; width: 8px; height: 14px; background: #3a3a3a; vertical-align: middle; margin-left: 4px; animation: okBlink .9s step-end infinite; }
@keyframes okBlink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }

.ok-reveal { opacity: 0; transform: translateY(16px); }
.ok-reveal.ok-in { opacity: 1; transform: none; transition: opacity .6s ease, transform .6s ease; }

/* Centred page / section headings */
.ok-h1, .ok-h2, .ok-eyebrow { text-align: center; }
.ok-h1 + .ok-lead, .ok-h2 + .ok-lead { text-align: center; margin-left: auto; margin-right: auto; }
.ok-topics { justify-content: center; }
.ok-indepth__head { justify-content: center; }
.ok-indepth__intro { text-align: center; margin-left: auto; margin-right: auto; }

/* ── Research in depth ── */
.ok-indepth { margin-top: 80px; padding-top: 64px; border-top: 1px solid var(--vp-c-divider); }
.ok-indepth__group { margin-top: 56px; }
.ok-indepth__head { display: flex; align-items: center; gap: 14px; margin-bottom: 14px; }
.ok-indepth__bar { width: 32px; height: 3px; display: inline-block; flex: none; }
.ok-indepth__planet {
  font-family: var(--ok-font-bold); font-weight: 700;
  font-size: 26px; letter-spacing: -.02em; margin: 0;
}
.ok-indepth__intro {
  font-size: 20px; line-height: 1.8; color: var(--vp-c-text-2);
  max-width: 74ch; margin: 0 0 36px; font-weight: 300;
}
.ok-studies { display: flex; flex-direction: column; }
.ok-study {
  display: grid; grid-template-columns: 440px 1fr; gap: 44px; align-items: center;
  padding: 36px 0; border-top: 1px solid var(--vp-c-divider);
}
.ok-study--rev { grid-template-columns: 1fr 440px; }
.ok-study--rev .ok-study__media { order: 2; }
.ok-study__media {
  aspect-ratio: 16/11; border-radius: 12px; overflow: hidden;
  background: #14161c; position: relative; box-shadow: var(--ok-shadow);
}
.ok-study__media img { width: 100%; height: 100%; object-fit: cover; transition: transform .5s ease; }
.ok-study:hover .ok-study__media img { transform: scale(1.03); }
.ok-study__ph {
  position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
  font-size: 2.6rem; opacity: .55;
  background: radial-gradient(circle at 35% 30%, rgba(105,145,199,.14), transparent 60%), #14161c;
}
.ok-study__title {
  font-family: var(--ok-font-bold); font-size: 22px; font-weight: 600;
  letter-spacing: -.02em; color: var(--vp-c-text-1); margin: 0 0 12px;
}
.ok-study__body { font-size: 20px; line-height: 1.7; color: var(--vp-c-text-2); margin: 0 0 18px; text-align: justify; text-justify: inter-word; }
.ok-study__papers { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 14px; }
.ok-study__pub {
  font-size: 12px; text-transform: uppercase; letter-spacing: .1em; color: var(--vp-c-text-3);
}
.ok-study__paper {
  font-size: 14.5px; font-weight: 500; color: var(--c, var(--ok-accent-deep));
  text-decoration: none; border-bottom: 1px solid transparent; padding-bottom: 1px;
}
.ok-study__paper:hover { border-bottom-color: currentColor; }
@media (max-width: 820px) {
  .ok-study, .ok-study--rev { grid-template-columns: 1fr; gap: 18px; }
  .ok-study--rev .ok-study__media { order: 0; }
}

/* ── Missions ── */
.ok-missions-section { margin-top: 80px; padding-top: 64px; border-top: 1px solid var(--vp-c-divider); }
.ok-missions { display: grid; grid-template-columns: repeat(3,1fr); gap: 1px; background: var(--vp-c-divider); margin-top: 40px; }
@media (max-width: 800px) { .ok-missions { grid-template-columns: 1fr; } }
.ok-mission { background: var(--vp-c-bg); padding: 32px 28px 36px; }
.ok-mission__name { font-family: var(--ok-font-bold); font-size: 20px; font-weight: 600; color: var(--vp-c-text-1); margin-bottom: 4px; }
.ok-mission__org { font-size: 13px; text-transform: uppercase; letter-spacing: .08em; color: var(--vp-c-text-3); margin-bottom: 14px; }
.ok-mission__desc { font-size: 16px; line-height: 1.7; color: var(--vp-c-text-2); font-weight: 300; }
</style>
