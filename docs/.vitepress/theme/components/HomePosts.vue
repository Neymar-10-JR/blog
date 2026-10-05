<script setup lang="ts">
import { computed } from 'vue'
import { withBase } from 'vitepress'
import { data as posts } from '../posts.data'

const limit = 5
const recent = computed(() => posts.slice(0, limit))
</script>

<template>
  <div class="home-posts">
    <article v-for="post in recent" :key="post.url" class="home-post-card">
      <a class="home-post-title" :href="withBase(post.url)">
        <span v-if="post.sticky" class="post-sticky">置顶</span>
        {{ post.title }}
      </a>
      <p v-if="post.summary" class="home-post-summary">{{ post.summary }}</p>
      <div class="home-post-meta">
        <time>{{ post.date }}</time>
        <span v-if="post.category" class="post-category">{{ post.category }}</span>
        <a
          v-for="tag in post.tags"
          :key="tag"
          class="post-tag"
          :href="withBase(`/tags?tag=${encodeURIComponent(tag)}`)"
        >#{{ tag }}</a>
      </div>
    </article>

    <p class="home-post-more"><a :href="withBase('/posts/')">查看全部文章 →</a></p>
  </div>
</template>
