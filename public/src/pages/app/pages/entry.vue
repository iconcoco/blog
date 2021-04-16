<template>
  <div>
    <header class="blog-hander">
      <div class="blog-block-content">BBBB</div>
    </header>
    <section class="blog-nav">
      <nav class="blog-block-content">
        <router-link 
          :class="{active: $route.name == 'index'}" 
          to="/blog"
        >
          首页
        </router-link>
        <router-link 
          :class="{active: $route.name == 'person'}" 
          to="/blog/person"
        >
          我的
        </router-link>
      </nav>
    </section>
    <div class="blog-banner" v-if="$route.meta.banner">
      <img src="../image/11111.jpg" alt="">
    </div>
    
    <div class="blog-view">
      <transition name="fadeIn">
        <router-view />
      </transition>
    </div>
  </div>
</template>

<script>
import '@app/sass/app.scss'

// import crypto from 'crypto-browserify'

export default {
  // created() {
  //   console.log(crypto);
  // }
}
</script>

<style lang="scss">
html, body {
  width: 100%;
  height: 100%;
  background-color: #ebece6;
}

.blog-view {
  padding-top: 10px;
}

</style>