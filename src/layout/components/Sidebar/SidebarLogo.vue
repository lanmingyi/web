<template>
  <div class="sidebar-logo-container" :class="{ collapse: props.collapse }">
    <transition name="sidebar-logo-fade">
      <router-link v-if="props.collapse" key="collapse" to="/">
<!--        <img src="@/assets/layout/logo.png" class="sidebar-logo" />-->
      </router-link>
      <router-link v-else key="expand" to="/">
<!--        <img src="@/assets/layout/logo.png" class="sidebar-logo-text" />-->
<!--      <div style="color:white; font-size: 30px">明成科技</div>-->
      </router-link>
    </transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  collapse:{
    type: Boolean,
    default: true,
  }
})

</script>

<style lang="scss" scoped>
.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: var(--web-header-height);
  line-height: var(--web-header-height);
  background-color: var(--web-sidebarlogo-bg-color);
  text-align: center;
  overflow: hidden;
  .sidebar-logo {
    display: none;
  }
  .sidebar-logo-text {
    height: 100%;
    vertical-align: middle;
  }
}

.collapse {
  .sidebar-logo {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    display: inline-block;
  }
  .sidebar-logo-text {
    display: none;
  }
}
</style>