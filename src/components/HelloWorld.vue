<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <section id="center">
    
    <button type="button" class="counter" @click="count++">
      Count is {{ count }}
    </button>
  </section>


</template>
