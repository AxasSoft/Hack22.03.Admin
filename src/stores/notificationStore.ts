import { defineStore } from 'pinia'
import api from '@/stores/api'
import { ref } from 'vue'
import type { Notification } from '@/types/Notification'

export const useNotificationsStore = defineStore(
  'notifications',
  () => {
    const newNotification = ref<Notification | null>()

    const notifications = ref<Notification[]>([])
    const notificationsPage = ref(1)
    const notificationsPaginator = ref()
    const search = ref()

    //MARK: GET PUSHS
    const getNotifications = async () => {
      const requestUrl = `/push-notifications/?page=${notificationsPage.value}`
      try {
        const response = await api.get(requestUrl)
        if (response.status == 200) notifications.value = response.data.data
        notificationsPaginator.value = response.data.meta.paginator
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: CREATE NEW PUSH
    const createNewNotification = async (
      title: string,
      body: string,
      type: string,
      linkId: number | null,
    ) => {
      let url = `/push-notifications/`
      if (linkId != null) {
        const linkPath = type == 'newArticle' ? 'article' : type
        url = url + `?link_id=${linkId}&link_path=${linkPath}`
      }
      try {
        const response = await api.post(url, {
          title: title,
          body: body,
        })
        if (response.status === 200) {
          newNotification.value = null

          getNotifications()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }
    return {
      newNotification,
      notifications,
      notificationsPage,
      notificationsPaginator,
      search,
      getNotifications,
      createNewNotification,
    }
  },
  // { persist: true },
)
