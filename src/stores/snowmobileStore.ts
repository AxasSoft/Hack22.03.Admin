import { defineStore } from 'pinia'
// import type { NewStore } from '@/types/NewStore'
import api from '@/stores/api'
import { ref, reactive } from 'vue'
import type { Snowmobile } from '@/types/Snowmobile'

export const useSnowmobileStore = defineStore(
  'snowmobile',
  () => {
    const newSnowmobile = reactive({
      id: 0,
      title: null,
      body: null,
      category: {
        title: "",
        value: 0,
      },
      important: false,
      isHidden: false,
      source: null,
      image: {
        url: '',
        file: <Blob | null>null,
        isChanged: false,
      },
    })

    const snowmobiles = ref<Snowmobile[]>([])
    const selectEditSnowmobile = ref()
    const snowmobilePage = ref(1)
    const snowmobilePaginator = ref()

    //MARK: GET SHOWMOBILES
    const getSnowmobiles = async () => {
      const requestUrl = `/snowmobiles/?page=${snowmobilePage.value}`
      try {
        const response = await api.get(requestUrl)
        if (response.status == 200) snowmobiles.value = response.data.data
        snowmobilePaginator.value = response.data.meta.paginator
        return response
      } catch (error) {
        return error
      }
    }

    return {
      newSnowmobile,
      selectEditSnowmobile,
      snowmobiles,
      snowmobilePage,
      snowmobilePaginator,
      getSnowmobiles,
    }
  },
  // { persist: true },
)
