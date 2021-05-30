<template>
  <div class="blog-block-content blog-article">
    <aside class="blog-article__info">
      <p class="blog-article__info-title">个人资料</p>
      <div class="blog-article__info-content">
        <avatar/>
        <p class="blog-motto">我要成为有钱人</p>
      </div>
    </aside>

    <div class="blog-article__content" v-if="info">
      <div class="blog-article__content-container">
        <section class="blog-article__header">
          <h3>{{ info.name }}</h3>
          <div class="blog-article__header-info">
            <span>
              <a 
                class="el-icon-edit-outline"
                href="javascript:;"
                @click="onEditArticle"
              ></a>
            </span>
            <span>2020-09-01</span>
            <span> <i class="el-icon-view"></i> 1234123</span>
          </div>
        </section>
        <article 
          class="blog-article__main"
          v-html="info.content"
        />
      </div>
    </div>
  </div>
</template>

<script>
import '@app/sass/article.scss'
import { getArticle } from '@app/pages/Api/index.js'

import avatar from '../components/avatar.vue'
export default {
  components: {
    avatar
  },
  data() {
    return {
      info: null
    }
  },
  async mounted() {

    const routeParams = this.$route.params
    if (routeParams.id) {
      const result = await getArticle({ id: routeParams.id })
      if (result && result.code == 0) {
        this.info = result.data
      }
    }
    
  },
  methods: {
    onEditArticle() {
      // console.log(this.$route);
      this.$router.push({
        name: 'person',
        params: { id: this.$route.params.id }
      })
    }
  }
}
</script>