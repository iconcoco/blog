<template>
  <div class="blog-block-content blog-article">
    <aside class="blog-article__info">
      <p class="blog-article__info-title">个人资料</p>
      <div class="blog-article__info-content">
        <avatar/>
        <p class="blog-motto">我要成为有钱人</p>
      </div>
    </aside>
    <div class="blog-article__content">
      <div class="blog-article__content-container">
        <section class="blog-article__header">
          <h3>想回到过去</h3>
          <div class="blog-article__header-info">
            <span>2020-09-01</span>
            <span> <i class="el-icon-view"></i> 1234123</span>
          </div>
        </section>
        <article class="blog-article__main">
          <p>为什么呢</p>
        </article>
      </div>
    </div>
  </div>
</template>

<script>
import '@app/sass/article.scss'

import avatar from '../components/avatar.vue'
export default {
  components: {
    avatar
  }
}
</script>