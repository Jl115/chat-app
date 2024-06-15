<template>
  <ChatComponent :groupId="groupId" />
</template>

<script>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ChatComponent from '../components/ChatComponent.vue'

export default {
  components: {
    ChatComponent
  },
  setup() {
    const route = useRoute()
    const groupId = ref(route.params.groupId)
    const register = ref(true)
    const showAuthDialog = ref(false)

    const closeAuthDialog = () => {
      showAuthDialog.value = false
    }

    return {
      groupId,
      register,
      showAuthDialog,
      closeAuthDialog
    }
  }
}
</script>

<style lang="scss" scoped></style>
