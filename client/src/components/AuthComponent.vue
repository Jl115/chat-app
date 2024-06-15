<template>
  <MainDialog
    v-model:visible="showToggle"
    modal
    :draggable="false"
    :style="{ width: '25rem' }"
    @hide="emitHide"
  >
    <template #header>
      <span v-if="register" class="p-text-secondary block mb-5">Register</span>
      <span v-else class="p-text-secondary block mb-5">Login</span>
    </template>
    <!--* REGISTER  -->
    <template v-if="register">
      <div class="field mb-3">
        <label for="username" class="font-semibold w-6rem">Username</label>
        <InputText id="username" class="w-full" autocomplete="off" v-model="username" />
      </div>
      <div class="field mb-3">
        <label for="email" class="font-semibold w-6rem">Email</label>
        <InputText id="email" class="w-full" autocomplete="off" v-model="email" />
      </div>
      <div class="field mb-3">
        <label for="password" class="font-semibold w-6rem">Password</label>
        <Password
          id="password"
          v-model="password"
          placeholder="Password"
          :toggleMask="true"
          class="w-full"
          inputClass="w-full"
          :inputStyle="{ padding: '1rem' }"
        ></Password>
      </div>
      <div class="field mb-3">
        <label for="confirmPassword" class="font-semibold w-6rem">Confirm Password</label>
        <Password
          id="confirmPassword"
          v-model="confirmPassword"
          placeholder="Confirm Password"
          :toggleMask="true"
          class="w-full"
          inputClass="w-full"
          :inputStyle="{ padding: '1rem' }"
        ></Password>
      </div>
      <div class="flex align-items-center justify-content-between mb-5 gap-5">
        <a
          class="font-medium no-underline ml-2 text-right cursor-pointer"
          style="color: var(--primary-color)"
          @click="() => (register = false)"
          >Sign in</a
        >
      </div>
      <div class="flex justify-content-center">
        <MainButton
          label="Register"
          class="p-button-success w-full p-3 text-xl"
          @click="handleRegister"
        />
      </div>
    </template>
    <!--* LOGIN -->
    <template v-else>
      <div class="field mb-3">
        <label for="email" class="font-semibold w-6rem">Email</label>
        <InputText id="email" class="w-full" autocomplete="off" v-model="email" />
      </div>
      <div class="field mb-3">
        <label for="password" class="font-semibold w-6rem">Password</label>
        <Password
          id="password"
          v-model="password"
          placeholder="Password"
          :toggleMask="true"
          class="w-full"
          inputClass="w-full"
          :inputStyle="{ padding: '1rem' }"
        ></Password>
      </div>
      <div class="flex align-items-center justify-content-between mb-5 gap-5">
        <a
          class="font-medium no-underline ml-2 text-right cursor-pointer"
          style="color: var(--primary-color)"
          @click="() => (register = true)"
          >Register</a
        >
      </div>
      <div class="flex justify-content-center">
        <MainButton
          label="Sign In"
          class="p-button-primary w-full p-3 text-xl"
          @click="handleLogin"
        />
      </div>
    </template>
  </MainDialog>
  <Toast />
</template>

<script>
import { defineComponent, ref, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'primevue/usetoast'

//* Custom Imports
import axios from 'axios'

export default defineComponent({
  name: 'AuthComponent',

  props: {
    isRegister: {
      type: Boolean,
      default: false
    },
    showMainDialog: {
      type: Boolean,
      default: false
    }
  },
  emits: ['closeAuthDialog'],
  setup(props, { emit }) {
    const email = ref('')
    const username = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const checked = ref(false)
    const showToggle = ref(props.showMainDialog)
    const authStore = useAuthStore()
    const toast = useToast()
    const register = ref(false)
    const title = computed(() => (register.value ? 'Register' : 'Welcome, Isabel!'))
    const subtitle = computed(() =>
      register.value ? 'Create a new account' : 'Sign in to continue'
    )

    const emitHide = () => {
      showToggle.value = false
      emit('closeAuthDialog')
    }

    watch(
      () => props.showMainDialog,
      (newVal) => {
        showToggle.value = newVal
      }
    )

    const handleLogin = async () => {
      const loginObj = {
        email: email.value,
        password: password.value
      }

      await axios.post('http://localhost:9090/api/auth/login', loginObj).then((res) => {
        if (res.status === 200) {
          authStore.setToken(res.data.token)
          emitHide()
        }
      })
    }
    const handleRegister = async () => {
      const registerObj = {
        username: username.value,
        email: email.value,
        password: password.value
      }
      // register user
      await axios.post('http://localhost:9090/api/auth/register', registerObj).then((res) => {
        if (res.data.status === '201') {
          authStore.setToken(res.data.token)
          toast.add({ severity: 'success', summary: 'Registration successful', life: 3000 })
          emitHide()
          return
        }
        toast.add({
          severity: 'warn',
          summary: 'Warn Message',
          detail: 'Message Content',
          life: 3000
        })
        return
      })
    }

    return {
      email,
      username,
      password,
      confirmPassword,
      checked,
      title,
      subtitle,
      showToggle,
      register,
      emitHide,
      handleLogin,
      handleRegister
    }
  }
})
</script>

<style scoped>
.field {
  display: flex;
  flex-direction: column;
}
.pi-eye {
  transform: scale(1.6);
  margin-right: 1rem;
}

.pi-eye-slash {
  transform: scale(1.6);
  margin-right: 1rem;
}
</style>
