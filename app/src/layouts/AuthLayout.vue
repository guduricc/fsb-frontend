<template>
  <q-layout view="hHh lpR fFf">

    <q-header>
        <q-toolbar>
          <q-toolbar-title>
            <q-img height="45px" width="36px" src="/images/cyprus_logo.png"></q-img>
          </q-toolbar-title>
        </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="route" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>
<script setup lang="ts">

</script>

<style scoped>

</style>
