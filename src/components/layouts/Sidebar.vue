<template>
  <div class="sidebar">
    <h1>Теги</h1>
    <ul class="tags">
      <li class="tag">#tag</li>
    </ul>
    <ul class="block">
      <li class="checkbox">
        <input type="checkbox" />
        <ul class="checkbox-description">
          <li>Label</li>
          <li>Description</li>
        </ul>
      </li>
      <li class="checkbox">
        <input type="checkbox" />
        <ul class="checkbox-description">
          <li>Label</li>
          <li>Description</li>
        </ul>
      </li>
      <li class="checkbox">
        <input type="checkbox" />
        <ul class="checkbox-description">
          <li>Label</li>
          <li>Description</li>
        </ul>
      </li>
      <li class="checkbox">
        <input type="checkbox" />
        <ul class="checkbox-description">
          <li>Label</li>
          <li>Description</li>
        </ul>
      </li>
    </ul>
    <input class="cost" type="range" />
    <ul class="block">
      <li class="checkbox">
        <input type="checkbox" />
        <ul class="checkbox-description">
          <li>Label</li>
          <li>Description</li>
        </ul>
      </li>
      <li class="checkbox">
        <input type="checkbox" />
        <ul class="checkbox-description">
          <li>Label</li>
          <li>Description</li>
        </ul>
      </li>
      <li class="checkbox">
        <input type="checkbox" />
        <ul class="checkbox-description">
          <li>Label</li>
          <li>Description</li>
        </ul>
      </li>
      <li class="checkbox">
        <input type="checkbox" />
        <ul class="checkbox-description">
          <li>Label</li>
          <li>Description</li>
        </ul>
      </li>
    </ul>
  </div>
</template>

<style scoped>
h1 {
  margin-bottom: 1rem;
}

.sidebar {
  position: fixed;
  border: 1px solid grey;
  border-radius: 1rem;
  padding: 1rem;
  top: 3rem;
  left: 3rem;
}

.tags {
  margin-bottom: 1rem;
  display: inline-block;
}

.tag {
  background-color: #ddd;
  padding: .25rem .5rem;
  border-radius: .5rem;
}

ul {
  list-style: none;
}

.block {
  margin-bottom: 1rem;
}

.checkbox {
  display: flex;
  margin-bottom: 1rem;
}

.checkbox-description {
  margin-left: 1rem;
}

.cost {
  margin-bottom: 1rem;
}
</style>
