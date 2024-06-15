import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ChatComponent from '../components/ChatComponent.vue'
import { createTestingPinia } from '@pinia/testing'
import { useAuthStore } from '@/stores/authStore'
import { io } from 'socket.io-client'

// Mock socket.io client
vi.mock('socket.io-client', () => {
  const emit = vi.fn()
  const on = vi.fn()
  const socket = {
    emit,
    on,
    disconnect: vi.fn()
  }
  return {
    io: vi.fn(() => socket)
  }
})

describe('ChatComponent', () => {
  let wrapper
  let socket
  let authStore

  beforeEach(() => {
    wrapper = mount(ChatComponent, {
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })]
      },
      props: {
        groupId: 'test-group-id'
      }
    })
    authStore = useAuthStore()
    socket = io()
  })

  it('should initialize socket connection on mount if logged in', () => {
    authStore.token = 'valid-token'
    wrapper.vm.initializeSocket()
    expect(socket.emit).toHaveBeenCalledWith('join', { token: 'valid-token' })
    expect(socket.on).toHaveBeenCalledWith('message', wrapper.vm.receiveMessage)
    expect(socket.on).toHaveBeenCalledWith('ownMessage', wrapper.vm.senderMessage)
    expect(socket.on).toHaveBeenCalledWith('ki', wrapper.vm.receiveMessage)
    expect(socket.on).toHaveBeenCalledWith('users', wrapper.vm.updateUserList)
    expect(socket.on).toHaveBeenCalledWith('group', wrapper.vm.updateGroup)
    expect(socket.on).toHaveBeenCalledWith('removeSession', expect.any(Function))
    expect(socket.on).toHaveBeenCalledWith('receiveGroupMessage', wrapper.vm.receiveGroupMessage)
    expect(socket.on).toHaveBeenCalledWith('ownGroupMessage', wrapper.vm.ownGroupMessage)
  })

  it('should emit joinGroup with groupId and token on mount if groupId is present', () => {
    authStore.token = 'valid-token'
    wrapper.vm.initializeSocket()
    expect(socket.emit).toHaveBeenCalledWith('joinGroup', {
      groupId: 'test-group-id',
      token: 'valid-token'
    })
  })

  it('should send a group message', () => {
    authStore.token = 'valid-token'
    wrapper.vm.newMessage = 'Hello Group!'
    wrapper.vm.sendGroupMessage()
    expect(socket.emit).toHaveBeenCalledWith('sendGroupMessage', {
      id: expect.any(Number),
      body: 'Hello Group!',
      groupId: 'test-group-id',
      sender: 'me',
      token: 'valid-token'
    })
    expect(wrapper.vm.newMessage).toBe('')
  })

  it('should receive a group message', () => {
    const message = {
      content: 'Hello from Group',
      sender: 'other'
    }
    wrapper.vm.receiveGroupMessage(message)
    expect(wrapper.vm.groupMessages).toContainEqual({
      id: expect.any(Number),
      text: 'Hello from Group',
      sender: 'other'
    })
  })

  it('should handle own group message', () => {
    const message = {
      content: 'Hello Group!',
      sender: 'me'
    }
    wrapper.vm.ownGroupMessage(message)
    expect(wrapper.vm.groupMessages).toContainEqual({
      id: expect.any(Number),
      text: 'Hello Group!',
      sender: 'me'
    })
  })

  it('should disconnect socket on unmount', () => {
    wrapper.unmount()
    expect(socket.disconnect).toHaveBeenCalled()
  })
})
