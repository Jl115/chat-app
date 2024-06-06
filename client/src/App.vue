<template>
  <header>
    <NavBarComponent />
    <!-- <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div> -->
  </header>

  <RouterView />
</template>

<script>
//* VUE
import { RouterLink, RouterView } from 'vue-router'
import NavBarComponent from './components/NavBarComponent.vue'
//* COMPOSABLES

//* GRAPHQL

//* VUELIDATE

//* CUSTOM

//* COMPONENTS

//* CONTROLLERS

export default {
  components: {
    NavBarComponent
  },
  setup() {
    //* LOAD INITIAL

    //* VARIABLES

    //* QUERYS

    //* COMPUTED

    //* METHODS

    //* MOUNTED

    //* CREATED

    //* RETURN
    return {
      //* VARIABLES
      RouterView,
      RouterLink
      //* COMPUTED
      //* METHODS
    }
  }
}
</script>
<style lang="scss" scoped></style>
