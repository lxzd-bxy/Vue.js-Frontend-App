<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import Header from '../../layouts/Header.vue'
  import Sidebar from '../../layouts/Sidebar.vue'

  const cards = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchCards = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('http://localhost:8000/cards/?skip=0&limit=10')

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`)
      }

      const data = await response.json()
      cards.value = data
    } catch (err) {
      error.value = err.message || 'Cards loading error'
      console.error('Error:', err)
    } finally {
      loading.value = false
    }
  }

  onMounted(() => {
    fetchCards()
  })
</script>
<template>
  <Header />
  <Sidebar />
  <main>
    <div class="header">
      <input class="search" placeholder="поиск..." type="search" />
      <ul class="tag-buttons">
        <li class="tag-button text-blue-600">Новые</li>
        <li class="tag-button">Старые</li>
        <li class="tag-button">Все</li>
      </ul>
    </div>
  
    <div class="cards-content">
      <div v-for="card in cards" :key="card.id" class="card">
        <h1 class="card-title">{{ card.title }}</h1>
        <hr>
        <img class="card-image" :src="card.content" />
        <hr>
        <p class="card-description">{{ card.description }}</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
  .card-image {
    width: 100%;
    height: 250px;
    border-radius: 1rem;
    object-fit: cover;
  }

  hr {
    margin: 0.5rem 0;
    border: 1px solid grey;
  }

  .card-description {
    font-size: 0.75rem;
  }

  li {
    list-style: none;
  }

  main {
    top: 3rem;
    left: 20%;
    position: absolute;
    width: 80%;
  }

  .cards-content {
    display: flex;
  }

  .tag-buttons {
    display: flex;
  }

  .tag-button {
    padding: .25rem .5rem;
    border: 1px solid grey;
    border-radius: .5rem;
    margin-left: 1rem;
  }

  .header {
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    padding-right: 3rem;
  }

  .card {
    width: 300px;
    border: 1px solid grey;
    border-radius: 1rem;
    margin: 2rem 2rem 0 0;
    padding: 1rem;
  }

  .search {
    width: 50px;
    border-radius: 2rem;
    border: 1px solid grey;
    font-size: .75rem;
    padding: .25rem 5rem;
  }
</style>
