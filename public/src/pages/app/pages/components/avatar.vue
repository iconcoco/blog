<template>
  <div class="blog-avatar">
    <div class="blog-avatar__img"></div>
    <p class="blog-avatar__name">name</p>
  </div>
</template>

<style lang="scss" scoped>
.blog-avatar {
  &__img {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    border: 1px solid red;
    margin: 0 auto 10px;
  }
  &__name {
    text-align: center;
  }
}
</style>