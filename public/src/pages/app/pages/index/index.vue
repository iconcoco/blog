<template>
  <section class="blog-list blog-block-content">
    <ul class="blog-list__container">
      <li 
        v-for="(item, index) in list"
        :key="index"
        class="blog-list__item"
      >
        <aside class="blog-list__aside">
          <avatar/>
        </aside>
        <div class="blog-list__main">
          <h3 class="blog-list__main-title">
            <a 
              href="javascript:;"
              @click="handleTitleClick(item.id)"
            > {{ item.name }} </a>
          </h3>
          <p class="blog-list__main-summary">{{ item.intro }}</p>
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
import { getArticleList } from '@app/pages/Api/index.js'
import avatar from '../components/avatar.vue'

export default {
  name: 'index',
  components: {
    avatar
  },
  data() {
    return {
      list: []
    }
  },
  async mounted() {
    const result = await getArticleList()
    if (result && result.code == 0) {
      this.list = result.data
    }
  },
  methods: {
    handleTitleClick(id) {
      this.$router.replace({ 
        name: 'article', 
        params: {
          id
        }
      })
    }
  }
}
</script>
