<script setup>
  import Header from '../../layouts/Header.vue'
  import Footer from '../../layouts/Footer.vue'
</script>
<template>
  <Header />
  <div class="main-scroll-bar">

  </div>

  <div class="container-image-bar">
    <div class="image-bar-left">
    </div>
    <div class="image-bar-right">
    </div>
  </div>

  <div class="gadget-scroll-bar">
    
  </div>
  <Footer />
</template>

<style scoped>
.main-scroll-bar {
  width: 100%;
  height: 700px;
  background-image: url('../../../assets/images/main-scroll.png');
  background-repeat: no-repeat;
  background-size: cover;
}

.container-image-bar {
  display: flex;
  justify-content: space-between;
}

.image-bar-left {
  margin: 3rem 1.5rem 3rem 3rem;
  width: 100%;
  height: 500px;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('../../../assets/images/new-iphone.jpg');
  border-radius: 2rem;
}

.image-bar-right {
  margin: 3rem 3rem 3rem 1.5rem;
  width: 100%;
  height: 500px;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('../../../assets/images/old-iphone.jpg');
  border-radius: 2rem;
}

.gadget-scroll-bar {
  height: 500px;
  background-color: var(--bg-color-grey);
  padding: 2rem;
}
</style>
