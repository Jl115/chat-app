<template>
  <div class="chat-container">
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
    <div class="input-container">
      <Message :closable="false" class="message-banner">
        Use /ki or /ai to communicate with the AI
      </Message>
      <div class="input-area">
        <InputText v-model="newMessage" placeholder="Type a message" @keyup.enter="sendMessage" />
        <MainButton icon="pi pi-send" @click="sendMessage" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { io } from 'socket.io-client'
import InputText from 'primevue/inputtext'
import MainButton from 'primevue/button'
import Message from 'primevue/message'

export default {
  components: {
    InputText,
    MainButton,
    Message
  },
  setup() {
    const socket = ref(null)
    const messages = ref([
      { id: 1, text: 'Hello!', sender: 'me' },
      { id: 2, text: 'Hi! How are you?', sender: 'other' }
    ])
    const newMessage = ref('')
    const isKiChat = ref(false)

    const sendMessage = () => {
      if (isKiChat.value && newMessage.value.trim()) {
        const message = { id: Date.now(), body: newMessage.value, sender: 'me' }
        socket.value.emit('ki', message)
        // messages.value.push(message)
        newMessage.value = ''
      }
      if (newMessage.value.trim()) {
        const message = { id: Date.now(), body: newMessage.value, sender: 'me' }
        socket.value.emit('message', message)
        // messages.value.push(message)
        newMessage.value = ''
      }
    }

    const receiveMessage = (message) => {
      console.log('\x1b[33m%s\x1b[0m', 'message --------------------', message)
      messages.value.push({ id: Date.now(), text: message, sender: 'other' })
    }
    const senderMessage = (message) => {
      console.log('\x1b[33m%s\x1b[0m', 'message --------------------', message)
      messages.value.push({ id: Date.now(), text: message, sender: 'me' })
    }
    onMounted(() => {
      socket.value = io('http://localhost:9090') // URL des Socket-Servers
      socket.value.on('message', receiveMessage)
      socket.value.on('ownMessage', senderMessage)
      socket.value.on('ki', receiveMessage) // für Nachrichten vom Typ 'ki'
    })

    onBeforeUnmount(() => {
      if (socket.value) {
        socket.value.disconnect()
      }
    })

    // watcher for chatting with AI
    watch(newMessage, (newVal) => {
      const regex = /(\/ai|\/ki)/
      const regexForCancel = /(\/cancel)/
      const checkSecureRegex = /^chat with Ki:/
      if (!checkSecureRegex.test(newVal) && regex.test(newVal)) {
        const match = newVal.match(regex)
        if (match) {
          const command = match[0] // /ai or /ki
          const messageParts = newVal.split(command).filter((part) => part.trim() !== '')
          const formattedMessage = `chat with Ki: ${messageParts.join(' ').trim()}`

          if (newMessage.value !== formattedMessage) {
            newMessage.value = formattedMessage
            isKiChat.value = true
          }
        }
      }
      if (regexForCancel.test(newVal)) {
        const match = newVal.match(regexForCancel)
        const command = match[0] // /cancel
        console.log('\x1b[33m%s\x1b[0m', 'command --------------------', command)
        const messageParts = newVal.split(command).filter((part) => part.trim() !== command)
        newMessage.value = messageParts.join(' ').trim()
        isKiChat.value = false
      }
    })

    return { messages, newMessage, isKiChat, sendMessage }
  }
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 90vh;
  width: 100%;
  margin: 0 auto;
  border: 1px solid #665e5e;
  border-radius: 8px;
  overflow: hidden;
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
  justify-content: center;
  align-items: center;
}

.input-area .p-inputtext {
  flex: 1;
  margin-right: 10px;
}
</style>
