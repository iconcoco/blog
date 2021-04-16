<template>
  <div class="blog-block-content blog-me">
    <el-form label-width="80px">
      <el-form-item label="文章标题">
        <el-input 
          v-model="form.title"
          placeholder="请输入文章标题"
        ></el-input>
      </el-form-item>

      <el-form-item label="文章简介">
        <el-input 
          v-model="form.summary"
          placeholder="请输入文章简介"
        ></el-input>
      </el-form-item>

      <el-form-item label="文章内容">
        <!-- <el-input
          type="textarea"
          :rows="12"
          placeholder="请输入文章内容"
          v-model="textarea">
        </el-input> -->
        <multi-text ref="multiRef"></multi-text>
      </el-form-item>

      <p class="blog-me__button">
        <el-button 
          type="primary"
          @click="handleSubmit"
        >发文章</el-button>
      </p>
    </el-form>
   
  </div>
</template>

<script>

import '@app/sass/me.scss'

import multiText from '../components/multiText.vue'


export default {
  data() {
    return {
      form: {
        title: '',
        summary: ''
      }
    }
  },
  components: {
    multiText
  },
  methods: {
    handleSubmit () {
      const editorHtml = this.$refs['multiRef'].getEditorVal()
      console.log(editorHtml);
      
      
    }
  }
}
</script>
