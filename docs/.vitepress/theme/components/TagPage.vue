<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { data as posts } from '../posts.data'
import type { Post } from '../posts.data'

const selected = ref('')

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  selected.value = params.get('tag') || ''
})

function toggle(tag: string) {
  selected.value = selected.value === tag ? '' : tag
  const url = selected.value ? `/tags?tag=${encodeURIComponent(selected.value)}` : '/tags'
  window.history.replaceState({}, '', url)
}

const tagStats = computed(() => {
  const map = new Map<string, number>()
  for (const post of posts) {
    for (const tag of post.tags) {
      map.set(tag, (map.get(tag) || 0) + 1)
    }
  }
  return [...map.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
})

const filtered = computed<Post[]>(
  () => (selected.value ? posts.filter((post) => post.tags.includes(selected.value)) : [])
)

const totalTags = computed(() => tagStats.value.length)
</script>

<template>
  <div class="tag-page">
    <div class="tag-cloud">
      <button
        v-for="tag in tagStats"
        :key="tag.name"
        type="button"
        class="tag-chip"
        :class="{ active: selected === tag.name }"
        @click="toggle(tag.name)"
      >
        {{ tag.name }} <span class="tag-count">{{ tag.count }}</span>
      </button>
    </div>

    <p v-if="!totalTags" class="tag-empty">还没有标签，在文章的 frontmatter 里加上 <code>tags: [标签]</code> 试试。</p>

    <p v-else-if="!selected" class="tag-hint">共 {{ totalTags }} 个标签，点击上方任意标签查看对应文章。</p>

    <div v-else class="tag-result">
      <h2 class="tag-result-title">
        #{{ selected }}
        <span class="tag-result-count">{{ filtered.length }} 篇</span>
      </h2>
      <ul>
        <li v-for="post in filtered" :key="post.url" class="tag-result-item">
          <a :href="post.url">{{ post.title }}</a>
          <time>{{ post.date }}</time>
        </li>
      </ul>
    </div>
  </div>
</template>
