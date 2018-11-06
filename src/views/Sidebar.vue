<template>
  <div class="side">
    <img
      id="title"
      src="@/assets/kvnmmgallery.png"
    >
    <p>2018/11/24
    彥彬&愛名的婚禮

    婚禮每個重要瞬間都不錯過
    美美的婚禮照片都在這裡
    大家一起看、一起分享喔</p>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
  .side {
    p {
      color: #1C1C1C;
      white-space: pre-line;
    }
    #title {
        max-width: 50%;
    }
  }

@media screen and (min-width: 768px) {
  .side {
    position: fixed;
    top: 50%;
    width: inherit;
    max-width: inherit;
  }
}

@media screen and (max-width: 767px) {
  .side {
  }
}
</style>
