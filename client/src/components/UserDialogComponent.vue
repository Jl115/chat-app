<template>
  <MainDialog v-model:visible="visible" :style="{ width: '25rem' }" modal>
    <template #header>
      <span class="p-text-secondary block mb-5">Users in Chat</span>
    </template>
    <template #default>
      <ul>
        <li v-for="user in users" :key="user.id">{{ user.username }}</li>
      </ul>
    </template>
  </MainDialog>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'UserDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    users: {
      type: Array,
      default: () => []
    }
  },
  setup(props) {
    const visible = ref(props.show)
    console.log('\x1b[33m%s\x1b[0m', 'props.users --------------------', props.users)
    watch(
      () => props.show,
      (newVal) => {
        visible.value = newVal
      }
    )

    return {
      visible
    }
  }
})
</script>

<style scoped></style>
