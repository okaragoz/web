<script setup>
import { useData } from 'vitepress'
import { computed } from 'vue'
const { frontmatter } = useData()
const isPost = computed(() => !!frontmatter.value.date && frontmatter.value.category)
function fmt(d){ if(!d) return ''; const t=new Date(d); return isNaN(t)?d:t.toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'}) }
</script>
<template>
  <div v-if="isPost" class="ok-posthead">
    <h1 class="ok-posthead__title">{{ frontmatter.title }}</h1>
    <div class="ok-posthead__meta">
      <span class="ok-chip">{{ frontmatter.category === 'research' ? 'Research' : 'Essay' }}</span>
      <span>{{ fmt(frontmatter.date) }}</span>
    </div>
    <img v-if="frontmatter.image" :src="frontmatter.image" :alt="frontmatter.title" class="ok-posthead__img" />
  </div>
</template>
