<template>
  <a v-if="isExternal(props.to)" :href="props.to" target="_blank" rel="noopener">
    <slot/>
  </a>
  <router-link v-else :to="props.to">
    <slot/>
  </router-link>

</template>
<script setup lang="ts">
import {isExternal} from "@/utils/validate.js";
import {onMounted} from "vue";

const props = defineProps({
  to:{
    type: String,
    required: true
  }
})

onMounted(()=>{
  // console.log('props', props)
})
</script>