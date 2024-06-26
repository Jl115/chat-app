<template>
  <div class="chat-container" v-if="groupId">
    <h1
      class="bg-emerald-500 rounded-xl p-2 bg-opacity-40 hover:bg-opacity-60 absolute left-1/2 top-2 p-2"
    >
      {{ chatTitle }}
    </h1>
    <MainButton
      icon="pi pi-users"
      class="user-icon bg-emerald-500 rounded-xl p-2 bg-opacity-40 hover:bg-opacity-60"
      @click="showUserDialog = true"
    />

    <div class="messages">
      <div
        v-for="message in groupMessages"
        :key="message.id"
        :class="['message', message.sender === 'me' ? 'sent' : 'received']"
      >
        <div class="message-content">
          {{ message.text }}
        </div>
      </div>
    </div>
    <div class="input-container" v-if="isLoggedIn">
      <div class="input-area">
        <InputText
          v-model="newMessage"
          placeholder="Type a message"
          @keyup.enter="sendGroupMessage"
        />
        <MainButton icon="pi pi-send" @click="sendGroupMessage" />
      </div>
    </div>
    <div class="input-container" v-else>
      <Message :closable="false" class="message-banner" severity="warn">
        Please Log in to chat
      </Message>
      <div class="input-area">
        <InputText
          v-model="newMessage"
          placeholder="Type a message"
          @keyup.enter="sendGroupMessage"
          disabled
        />
        <MainButton icon="pi pi-send" @click="sendGroupMessage" disabled />
      </div>
    </div>
    <UserDialogComponent :show="showUserDialog" :users="users" @hide="showUserDialog = false" />
  </div>
  <div class="chat-container" v-else>
    <MainButton icon="pi pi-users" class="user-icon" @click="showUserDialog = true" />

    <div class="messages">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="['message', message.sender === 'me' ? 'sent' : 'received']"
      >
        <div class="message-content">
          {{ message.text }}
        </div>
      </div>
    </div>
    <div class="input-container" v-if="isLoggedIn">
      <Message :closable="false" class="message-banner">
        Use /ki or /ai to communicate with the AI and /cancel to cancel the chat with the AI
      </Message>
      <div class="input-area">
        <InputText v-model="newMessage" placeholder="Type a message" @keyup.enter="sendMessage" />
        <MainButton icon="pi pi-send" @click="sendMessage" />
      </div>
    </div>
    <div class="input-container" v-else>
      <Message :closable="false" class="message-banner" severity="warn">
        Please Log in to chat
      </Message>
      <div class="input-area">
        <InputText
          v-model="newMessage"
          placeholder="Type a message"
          @keyup.enter="sendMessage"
          disabled
        />
        <MainButton icon="pi pi-send" @click="sendMessage" disabled />
      </div>
    </div>
    <UserDialogComponent :show="showUserDialog" :users="users" @hide="showUserDialog = false" />
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { io } from 'socket.io-client'
import InputText from 'primevue/inputtext'
import MainButton from 'primevue/button'
import Message from 'primevue/message'
import { useToast } from 'primevue/usetoast'
import { jwtDecode } from 'jwt-decode'
import { useAuthStore } from '@/stores/authStore'
import UserDialogComponent from './UserDialogComponent.vue'

export default {
  components: {
    InputText,
    MainButton,
    Message,
    UserDialogComponent
  },
  props: {
    groupId: {
      type: String,
      default: null
    }
  },
  setup(props) {
    const socket = ref(null)
    const messages = ref([])
    const newMessage = ref('')
    const isKiChat = ref(false)
    const authStore = useAuthStore()
    const toast = useToast()
    const showUserDialog = ref(false)
    const users = ref([])
    const chatTitle = ref('')
    const groupMessages = ref([])

    const isLoggedIn = computed(() => {
      if (authStore.token && isValidToken(authStore.token)) {
        return true
      }
      authStore.clearToken()
      return false
    })

    const initializeSocket = () => {
      if (!socket.value) {
        socket.value = io('http://localhost:80')
        socket.value.on('message', receiveMessage)
        socket.value.on('ownMessage', senderMessage)
        socket.value.on('ki', receiveMessage)
        socket.value.on('users', updateUserList)
        socket.value.on('group', updateGroup)
        socket.value.on('removeSession', () => {
          authStore.clearToken()
          toast.add({ severity: 'warn', summary: 'Session expired', life: 3000 })
        })
        socket.value.on('receiveGroupMessage', receiveGroupMessage)
        socket.value.on('ownGroupMessage', ownGroupMessage)
        socket.value.on('messageHistory', (history) => {
          const userObj = jwtDecode(authStore.token)
          messages.value = history.map((message) => {
            if (message.userId === userObj.id) {
              return { id: message.userId, text: message.content, sender: 'me' }
            } else {
              return { id: message.userId, text: message.content, sender: 'other' }
            }
          })
        })
        socket.value.emit('join', { token: authStore.token })
      }
    }

    const disconnectSocket = () => {
      if (socket.value) {
        socket.value.disconnect()
        socket.value = null
      }
    }

    onMounted(() => {
      if (isLoggedIn.value) {
        initializeSocket()
        socket.value.emit('fetchMessages', authStore.token)
        if (props.groupId) {
          socket.value.emit('joinGroup', { groupId: props.groupId, token: authStore.token })
        }
      }
    })

    watch(
      () => props.groupId,
      (newGroupId) => {
        if (socket.value && newGroupId) {
          socket.value.emit('joinGroup', { groupId: newGroupId, token: authStore.token })
        }
      }
    )

    watch(
      () => authStore.token,
      (newVal) => {
        if (!newVal || !isValidToken(newVal)) {
          disconnectSocket()
        } else {
          initializeSocket()
          socket.value.emit('fetchMessages', authStore.token)
        }
      }
    )

    onBeforeUnmount(() => {
      disconnectSocket()
    })

    const updateGroup = (group) => {
      chatTitle.value = group.groupName
    }

    const sendMessage = () => {
      if (!isLoggedIn.value) return
      if (!isValidToken(authStore.token)) {
        authStore.clearToken()
        return
      }

      if (isKiChat.value && newMessage.value.trim()) {
        const message = {
          id: Date.now(),
          body: newMessage.value,
          sender: 'me',
          token: authStore.token
        }
        socket.value.emit('ki', message)
        newMessage.value = '@ki: '
        return
      }
      if (newMessage.value.trim()) {
        const message = {
          id: Date.now(),
          body: newMessage.value,
          sender: 'me',
          token: authStore.token
        }
        socket.value.emit('message', message)
        newMessage.value = ''
      }
    }

    const receiveMessage = (message) => {
      toast.add({ severity: 'info', summary: 'New message', detail: message.body, life: 3000 })
      messages.value.push({ id: Date.now(), text: message, sender: 'other' })
    }

    const senderMessage = (message) => {
      messages.value.push({ id: Date.now(), text: message, sender: 'me' })
    }

    const updateUserList = (usersList) => {
      users.value = usersList
    }

    const sendGroupMessage = () => {
      if (!isLoggedIn.value) return
      if (!isValidToken(authStore.token)) {
        authStore.clearToken()
        return
      }

      if (isKiChat.value && newMessage.value.trim()) {
        const message = {
          id: Date.now(),
          body: newMessage.value,
          sender: 'me',
          token: authStore.token
        }
        socket.value.emit('ki', message)
        newMessage.value = '@ki: '
        return
      }
      if (newMessage.value.trim()) {
        const message = {
          id: Date.now(),
          body: newMessage.value,
          groupId: props.groupId,
          sender: 'me',
          token: authStore.token
        }
        socket.value.emit('sendGroupMessage', message)
        newMessage.value = ''
      }
    }

    const receiveGroupMessage = (message) => {
      groupMessages.value.push({ id: Date.now(), text: message.content, sender: 'other' })
      toast.add({
        severity: 'info',
        summary: 'New group message',
        detail: message.content,
        life: 3000
      })
    }

    const ownGroupMessage = (message) => {
      groupMessages.value.push({ id: Date.now(), text: message.content, sender: 'me' })
    }

    // Watcher for chatting with AI
    watch(newMessage, (newVal) => {
      if (!isLoggedIn.value) return

      const regex = /(\/ai|\/ki)/
      const regexForCancel = /(\/cancel)/
      const checkSecureRegex = /^@ki:/
      if (!checkSecureRegex.test(newVal) && regex.test(newVal) && !props.groupId) {
        const match = newVal.match(regex)
        if (match) {
          const command = match[0] // /ai or /ki
          const messageParts = newVal.split(command).filter((part) => part.trim() !== '')
          const formattedMessage = `@ki: ${messageParts.join(' ').trim()}`

          if (newMessage.value !== formattedMessage) {
            newMessage.value = formattedMessage
            isKiChat.value = true
          }
        }
      }
      if (regexForCancel.test(newVal)) {
        const match = newVal.match(regexForCancel)
        const command = match[0] // /cancel
        const messageParts = newVal.split(command).filter((part) => part.trim() !== command)
        const returnMessage = messageParts[0]
          .split(RegExp(checkSecureRegex))
          .filter((part) => part.trim() !== '')
          .join(' ')
        newMessage.value = returnMessage
        isKiChat.value = false
        return
      }
    })

    function isValidToken(token) {
      try {
        const decoded = jwtDecode(token)
        if (decoded.exp > Date.now() / 1000) return true
        toast.add({ severity: 'warn', summary: 'Session expired', life: 3000 })
        return false
      } catch (e) {
        return false
      }
    }

    return {
      messages,
      newMessage,
      isKiChat,
      chatTitle,
      groupMessages,
      sendMessage,
      sendGroupMessage,
      receiveGroupMessage,
      ownGroupMessage,
      isLoggedIn,
      showUserDialog,
      users
    }
  }
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  border: 1px solid #665e5e;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
}

.user-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  height: 25px;
  color: #fff;
}

.messages {
  flex: 1;
  width: 100%;
  padding: 10px;
  overflow-y: auto;
  background-color: #302c2c;
}

.message-banner {
  width: 95%;
  padding: 0;
}

.message {
  margin: 5px 0;
  display: flex;
  flex-direction: column;
}

.message.sent .message-content {
  align-self: flex-end;
  background-color: #251850;
}

.message.received .message-content {
  align-self: flex-start;
  background-color: #333131;
}

.message-content {
  max-width: 70%;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

.input-area {
  display: flex;
  width: 95%;
  padding-bottom: 10px;
}

.input-container {
  display: flex;
  flex-direction: column;
  padding: 6px;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

.input-area .p-inputtext {
  flex: 1;
  margin-right: 10px;
  height: 3rem;
}
</style>
