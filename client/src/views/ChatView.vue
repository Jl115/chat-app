<template>
  <ChatComponent />
</template>

<script>
import { ref } from 'vue'
import ChatComponent from '../components/ChatComponent.vue'

export default {
  components: {
    ChatComponent
  },
  setup() {
    const register = ref(true)
    const showAuthDialog = ref(false)

    const closeAuthDialog = () => {
      showAuthDialog.value = false
    }

    return {
      register,
      showAuthDialog,
      closeAuthDialog
    }
  }
}
</script>

<style lang="scss" scoped></style>
