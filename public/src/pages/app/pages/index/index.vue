<template>
  <section class="blog-list blog-block-content">
    <ul class="blog-list__container">
      <li class="blog-list__item">
        <aside class="blog-list__aside">
          <avatar/>
        </aside>
        <div class="blog-list__main">
          <h3 class="blog-list__main-title">
            <a 
              href="javascript:;"
              @click="handleTitleClick"
            >这是什么额链接呢</a>
            <!-- <router-link
            to="/article/99"
            >这是什么额链接呢</router-link> -->
          </h3>
          <p class="blog-list__main-summary">一些简介简介简介简介</p>
          <div class="blog-list__main-info">
            <span>10:00</span>
          </div>
        </div>
      </li>
    </ul>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="100">
    </el-pagination>
  </section>
</template>

<script>

import '@app/sass/index.scss'

import avatar from '../components/avatar.vue'

export default {
  name: 'index',
  components: {
    avatar
  },
  data() {
    return {

    }
  },
  methods: {
    handleTitleClick() {
      this.$router.replace({ 
        name: 'article', 
        params: {
          id: 888
        }
      })
    }
  }
}
</script>
