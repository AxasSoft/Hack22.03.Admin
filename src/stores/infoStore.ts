import { defineStore } from 'pinia'
// import type { NewStore } from '@/types/NewStore'
import api from '@/stores/api'
import { ref, reactive } from 'vue'
import type { Info } from '@/types/Info'

export const useInfoStore = defineStore(
  'info',
  () => {
    const newInfo = reactive({
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

    const infoCategories = ref([
      {
        title: "Город",
        value: 0,
      },
      {
        title: "Интересное",
        value: 1,
      },
      {
        title: "Бизнес",
        value: 2,
      },
      {
        title: "Медиа",
        value: 3,
      },
      {
        title: "Спорт",
        value: 4,
      },
      {
        title: "Политика",
        value: 5,
      },
      {
        title: "Культура",
        value: 6,
      },
      {
        title: "Общество",
        value: 7,
      },
      {
        title: "Недвижимость",
        value: 8,
      },
      {
        title: "Технологии",
        value: 9,
      },
      {
        title: "Наука",
        value: 10,
      },
      {
        title: "Авто",
        value: 11,
      },
      {
        title: "Проишествия",
        value: 12,
      },
    ]);

    const infos = ref<Info[]>([])
    const selectEditInfo = ref()
    const infoPage = ref(1)
    const infoPaginator = ref()
    const search = ref()

    //MARK: GET INFO
    const getInfos = async () => {
      const requestUrl = `/infos/?page=${infoPage.value}`
      try {
        const response = await api.get(requestUrl)
        if (response.status == 200) infos.value = response.data.data
        infoPaginator.value = response.data.meta.paginator
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: CREATE NEW INFO
    const createNewInfo = async () => {
      try {
        console.log(newInfo)
        const response = await api.post(
          `/infos/`,
          {
            
            title: newInfo.title,
            body: newInfo.body,
            category: newInfo.category,
            important: newInfo.important,
            is_hidden: newInfo.isHidden,
            source: newInfo.source
          },
        )
        if (response.status === 200) {
          newInfo.id = 0
          newInfo.title = null
          newInfo.body = null
          newInfo.category = {
            title: "",
            value: 0,
          }
          newInfo.isHidden = false
          newInfo.source = null
          newInfo.important = false

          getInfos()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: UPDATE INFO
    const updateInfo = async () => {
      try {
        const response = await api.put(
          `/infos/${selectEditInfo.value.id}/`,
          {
            title: newInfo.title,
            body: newInfo.body,
            category: newInfo.category,
            is_hidden: newInfo.isHidden,
            source: newInfo.source,
            important: newInfo.important,
          },
        )
        if (response.status === 200) {
          selectEditInfo.value = null
          newInfo.id = 0
          newInfo.title = null
          newInfo.body = null
          newInfo.category = {
            title: "",
            value: 0,
          }
          newInfo.isHidden = false
          newInfo.source = null
          newInfo.important = false
          getInfos()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

        // MARK: UPDATE INFO COVER
        const updateInfoCover = async (id: number, file: File | Blob | null) => {
          try {
            const formData = new FormData()
    
            // let image: File
            if (file != undefined) {
              // image = file
              formData.append('new_image', file)
            }
    
            const response = await api.post(`/infos/${id}/image/`, formData)
            if (response.status === 200) {
              newInfo.image.file = null
              newInfo.image.url = ''
              newInfo.image.isChanged = false
            }
    
            getInfos()
    
            return response
          } catch (error) {
            console.error(error)
            return error
          }
        }

    //MARK: DELETE INFO
    const deleteInfo = async (id: number) => {
      try {
        const response = await api.delete(
          `/infos/${id}/`,
        )
        if (response.status == 200) {
          if (selectEditInfo?.value?.id == id) {
            selectEditInfo.value = null
          }
          getInfos()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    return {
      newInfo,
      infoCategories,
      selectEditInfo,
      updateInfoCover,
      infos,
      infoPage,
      infoPaginator,
      search,
      getInfos,
      createNewInfo,
      updateInfo,
      deleteInfo,
    }
  },
  // { persist: true },
)
