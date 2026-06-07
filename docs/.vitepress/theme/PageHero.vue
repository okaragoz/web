<script setup>
import SectionBand from './SectionBand.vue'
defineProps({ eyebrow: String, title: String, lede: String, bg: String, compact: Boolean, bgContain: Boolean, animate: Boolean })
</script>
<template>
  <section class="ok-phero" :class="{ 'ok-phero--img': bg, 'ok-phero--compact': compact, 'ok-phero--contain': bgContain, 'ok-phero--anim': animate }">
    <div v-if="bg" class="ok-phero__bg" :style="{ backgroundImage: `url(${bg})` }" />
    <div class="ok-phero__glow" />
    <div class="ok-phero__inner">
      <p v-if="eyebrow" class="ok-phero__eyebrow">{{ eyebrow }}</p>
      <h1 class="ok-phero__title">{{ title }}</h1>
      <p v-if="lede" class="ok-phero__lede">{{ lede }}</p>
      <slot />
    </div>
  </section>
  <SectionBand />
</template>
