<script setup>
// import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  
  <router-view></router-view>
</template>

<style scoped>
  * {
    box-sizing: border-box; /* 使宽度计算更准确 */
}
body {
width: 100%;
max-width: 100%; /* 确保不超出 */
overflow-x: hidden; /* 隐藏水平滚动条 */
}
.some-element {
    width: 100%; /* 使用相对宽度 */
}
</style>
