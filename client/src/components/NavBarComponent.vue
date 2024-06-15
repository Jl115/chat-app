<template>
  <div class="h-full flex flex-col justify-center">
    <MainMenu :model="items" class="w-full md:w-15rem h-96 bg-slate-950 rounded-xl">
      <template #start>
        <div class="contents items-center w-full justify-items-center gap-1 px-2 py-2">
          <p class="text-xl font-semibold text-center">LB-Chat-App</p>
        </div>
      </template>
      <template #submenuheader="{ item }">
        <span class="text-primary font-bold">{{ item.label }}</span>
      </template>
      <template #item="{ item, props }">
        <a v-ripple class="flex align-items-center" v-bind="props.action">
          <span :class="item.icon" />
          <span class="ml-2">{{ item.label }}</span>
          <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
          <span
            v-if="item.shortcut"
            class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1"
            >{{ item.shortcut }}</span
          >
        </a>
      </template>
      <template #end>
        <div class="flex h-44 end-container">
          <div class="self-end w-full">
            <button
              v-ripple
              class="relative overflow-hidden w-full p-link flex items-center p-2 pl-3 text-color hover:surface-200 border-noround"
              @click="openProfile"
              v-if="isLoggedIn"
            >
              <Avatar icon="pi pi-prime" class="mr-2" />
              <span class="flex flex-column items-center gap-4">
                <span class="font-bold">{{ username }}</span>
                <!-- In an Future update it has a role management -->
                <span class="text-sm">User</span>
              </span>
            </button>
            <button
              v-ripple
              class="relative overflow-hidden w-full p-link flex items-center p-2 pl-3 text-color hover:surface-200 border-noround"
              @click="openAuthDialog"
              v-else
            >
              <span class="pi pi-sign-in mr-2"></span>
              <span>Login/Register</span>
            </button>
          </div>
        </div>
      </template>
    </MainMenu>
  </div>
  <AuthComponent
    :showMainDialog="showAuthDialog"
    :isRegister="register"
    @closeAuthDialog="closeAuthDialog"
  />
  <ProfileComponent :showMainDialog="showProfile" @closeProfile="closeProfile" />
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { jwtDecode } from 'jwt-decode'
import Avatar from 'primevue/avatar'
import Badge from 'primevue/badge'
import AuthComponent from './AuthComponent.vue'
import ProfileComponent from './ProfileComponent.vue'

export default {
  components: { AuthComponent, Avatar, Badge, ProfileComponent },
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    const username = ref('')

    const items = ref([
      {
        label: 'Home',
        icon: 'pi pi-home',
        command: () => {
          router.push('/')
        }
      },
      {
        label: 'Groups',
        icon: 'pi pi-comments',
        command: () => {
          router.push('/groups')
        }
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        items: [
          {
            label: 'Logout',
            icon: 'pi pi-sign-out',
            command: () => {
              authStore.clearToken()
              router.push('/')
            }
          }
        ]
      }
    ])
    const register = ref(true)
    const showAuthDialog = ref(false)
    const showProfile = ref(false)

    const isLoggedIn = computed(() => {
      const token = authStore.token
      if (token && isValidToken(token)) {
        return true
      }
      authStore.clearToken()
      return false
    })

    const openAuthDialog = () => {
      register.value = false
      showAuthDialog.value = true
    }

    const closeAuthDialog = () => {
      showAuthDialog.value = false
    }
    const closeProfile = () => {
      showProfile.value = false
    }

    const openProfile = () => {
      showProfile.value = true
    }

    onMounted(() => {
      if (!isLoggedIn.value) {
        openAuthDialog()
      }
    })

    function isValidToken(token) {
      try {
        const decoded = jwtDecode(token)
        username.value = decoded.username
        return decoded.exp > Date.now() / 1000
      } catch (e) {
        return false
      }
    }

    return {
      register,
      items,
      showAuthDialog,
      isLoggedIn,
      username,
      showProfile,
      openProfile,
      closeAuthDialog,
      openAuthDialog,
      closeProfile
    }
  }
}
</script>

<style lang="scss" scoped>
.card {
  width: 100%;
}
.end-container {
  width: 150px;
}
</style>
