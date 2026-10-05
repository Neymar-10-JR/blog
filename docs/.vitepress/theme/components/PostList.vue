<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../posts.data'
import type { Post } from '../posts.data'

interface Group {
  year: string
  items: Post[]
}

const groups = computed<Group[]>(() => {
  const map = new Map<string, Post[]>()
  for (const post of posts) {
    const year = post.date ? post.date.slice(0, 4) : '未归档'
    if (!map.has(year)) map.set(year, [])
    map.get(year)!.push(post)
  }
  return [...map.entries()]
    .map(([year, items]) => ({ year, items }))
    .sort((a, b) => b.year.localeCompare(a.year))
})

const total = computed(() => posts.length)
</script>

<template>
  <div class="post-list">
    <p v-if="!total" class="post-empty">还没有文章，去 <code>docs/posts/</code> 下新建一篇 Markdown 试试。</p>

    <section v-for="group in groups" :key="group.year" class="post-group">
      <h2 class="post-year">{{ group.year }}</h2>
      <article v-for="post in group.items" :key="post.url" class="post-card">
        <a class="post-title" :href="withBase(post.url)">
          <span v-if="post.sticky" class="post-sticky">置顶</span>
          {{ post.title }}
        </a>
        <p v-if="post.summary" class="post-summary">{{ post.summary }}</p>
        <div class="post-meta">
          <time class="post-date">{{ post.date }}</time>
          <span v-if="post.category" class="post-category">{{ post.category }}</span>
          <a
            v-for="tag in post.tags"
            :key="tag"
            class="post-tag"
            :href="withBase(`/tags?tag=${encodeURIComponent(tag)}`)"
          >#{{ tag }}</a>
        </div>
      </article>
    </section>
  </div>
</template>
