<template>
  <div class="group-list-container">
    <h2>Group List</h2>
    <div class="Mainbutton-container">
      <MainButton
        v-for="group in groups"
        :key="group.id"
        :label="group.groupName"
        @click="joinGroup(group)"
        class="group-Mainbutton bg-emerald-500 rounded-xl p-2 bg-opacity-40 hover:bg-opacity-60"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { io } from 'socket.io-client'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

export default {
  setup() {
    const socket = ref(null)
    const groups = ref([])
    const loading = ref(true)
    const authStore = useAuthStore()
    const router = useRouter()

    const fetchGroups = () => {
      loading.value = true
      socket.value.emit('fetchGroups', authStore.token)
    }

    const receiveGroups = (groupList) => {
      groups.value = groupList
      loading.value = false
    }

    const joinGroup = (group) => {
      // Navigate to the group chat page with the group ID
      router.push({ name: 'GroupChat', params: { groupId: group.id } })
    }

    onMounted(() => {
      socket.value = io('http://localhost:80')
      socket.value.on('groupList', receiveGroups)
      fetchGroups()
    })

    onBeforeUnmount(() => {
      if (socket.value) {
        socket.value.disconnect()
      }
    })

    return {
      groups,
      loading,
      joinGroup
    }
  }
}
</script>

<style scoped>
.group-list-container {
  width: 100%;
  padding: 20px;
}

h2 {
  text-align: center;
}

.Mainbutton-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.group-Mainbutton {
  min-width: 150px;
  margin: 5px;
}
</style>
