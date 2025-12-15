<template>
  <header>
    <div class="container">
      <div>
        <h1>LOGO</h1>
      </div>
      <ul>
        <li><router-link to="/catalog">КАТАЛОГ</router-link></li>
        <li><router-link to="/about">О МАГАЗИНЕ</router-link></li>
        <li><router-link to="/reviews">ОТЗЫВЫ</router-link></li>
        <li><router-link to="/contacts">КОНТАКТЫ</router-link></li>
      </ul>
      <div>
        LOGIN
      </div>
    </div>
  </header>
</template>

<style scoped>
header {
  width: 100%;
  display: flex;
  justify-content: center;
}

.container {
  margin: 0 2rem;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 1rem;
}

ul {
  display: flex;
  list-style: none;
}

li {
  padding-left: 1rem;
}
</style>
