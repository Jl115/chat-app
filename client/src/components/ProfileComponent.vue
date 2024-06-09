<template>
  <MainDialog
    v-model:visible="showToggle"
    modal
    :draggable="false"
    :style="{ width: '25rem' }"
    @hide="emitHide"
  >
    <template #header>
      <span class="p-text-secondary block mb-5">Profile</span>
    </template>

    <div class="field mb-3">
      <label for="username" class="font-semibold w-6rem">Username</label>
      <InputText id="username" class="w-full" autocomplete="off" v-model="username" />
    </div>
    <div class="field mb-3">
      <label for="email" class="font-semibold w-6rem">Email</label>
      <InputText id="email" class="w-full" autocomplete="off" v-model="email" disabled />
    </div>
    <div class="field mb-3">
      <label for="password" class="font-semibold w-6rem">New Password</label>
      <Password
        id="password"
        v-model="password"
        placeholder="New Password"
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
    <div class="flex justify-content-center">
      <MainButton
        label="Update Profile"
        class="p-button-primary w-full p-3 text-xl"
        @click="handleUpdateProfile"
      />
    </div>
  </MainDialog>
  <Toast />
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useToast } from 'primevue/usetoast'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

export default defineComponent({
  name: 'ProfileDialog',

  props: {
    showMainDialog: {
      type: Boolean,
      default: false
    }
  },
  emits: ['closeProfile'],
  setup(props, { emit }) {
    const authStore = useAuthStore()
    const toast = useToast()

    const username = ref('')
    const email = ref('')
    const password = ref('')
    const confirmPassword = ref('')
    const showToggle = ref(props.showMainDialog)

    const emitHide = () => {
      showToggle.value = false
      emit('closeProfile')
    }

    const decodeToken = () => {
      if (authStore.token) {
        const decodedToken = jwtDecode(authStore.token)
        username.value = decodedToken.username
        email.value = decodedToken.email
      }
    }

    watch(
      () => props.showMainDialog,
      (newVal) => {
        showToggle.value = newVal
        if (newVal) {
          decodeToken()
        }
      }
    )

    const handleUpdateProfile = async () => {
      if (password.value !== confirmPassword.value) {
        toast.add({ severity: 'warn', summary: 'Passwords do not match', life: 3000 })
        return
      }

      const updateObj = {
        username: username.value,
        email: email.value,
        password: password.value
      }

      await axios
        .post('http://localhost:9090/api/auth/update', updateObj, {
          headers: {
            AuthorizationToken: `${authStore.token}`
          }
        })
        .then((res) => {
          if (res.status === 200) {
            authStore.updateUser(username.value)
            toast.add({ severity: 'success', summary: 'Profile updated', life: 3000 })
            emitHide()
          } else {
            toast.add({ severity: 'warn', summary: 'Update failed', life: 3000 })
          }
        })
        .catch((error) => {
          console.log('\x1b[33m%s\x1b[0m', 'Error update Failed: ', error)
          toast.add({ severity: 'error', summary: 'Update failed', life: 3000 })
        })
    }

    return {
      username,
      email,
      password,
      confirmPassword,
      showToggle,
      emitHide,
      handleUpdateProfile
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
