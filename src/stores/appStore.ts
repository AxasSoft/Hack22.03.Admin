import { defineStore } from 'pinia'
// import type { NewStore } from '@/types/NewStore'
import api from '@/stores/api'
import { ref, reactive } from 'vue'
import type { Tariff, App, GoodsCat } from '@/types/App'

export const useAppStore = defineStore(
  'app',
  () => {
    const newApp = reactive({
      icon: {
        url: '',
        file: <Blob | null>null,
        isChanged: false,
      },
      splash: {
        url: '',
        file: <Blob | null>null,
        isChanged: false,
      },
      name: null,
      description: null,
      primaryColor: '#32AFC0',
      bgColor: '#F8F8FB',
      secondaryBgColor: '#FFFFFF',
      textColor: '#1C1C1E',
      secondaryTextColor: '#A7A7A8',
      secondaryColor: '#D22121',
      category: null,
      tariffId: 0,
      goodsCat: null,
    })

    const selectApp = ref()
    const selectAppSection = ref()
    const selectEditApp = ref()

    const apps = ref<App[]>([])

    const goodsCats = ref<GoodsCat[]>([])

    const tariffs = ref<Tariff[]>([])

    //MARK: GET MY APPS
    const getMyApps = async () => {
      const {
        data: { data },
        status,
      } = await api.get('/stores/')

      if (status === 200) {
        apps.value = data

        if (apps.value.length == 1) {
          selectApp.value = apps.value[0]
        } else if (apps.value.length > 1 && !selectApp.value) {
          selectApp.value = apps.value[0]
        } else if (apps.value.length == 0) {
          selectApp.value = null
        } else {
          selectApp.value = apps.value.find(app => app.id == selectApp.value.id)
        }
        return true
      }

      return false
    }

    //MARK: GET GOOD CATS
    const getGoodCats = async () => {
      const {
        data: { data },
        status,
      } = await api.get('/goods_cat/')

      if (status === 200) {
        goodsCats.value = data
        // .sort(
        //   (a: { name: string }, b: { name: string }) =>
        //     a.name < b.name ? -1 : 1,
        // )

        return true
      }

      return false
    }

    //MARK: GET APP SECTION
    const getAppSection = async () => {
      const {
        data: { data },
        status,
      } = await api.get(`/stores/${selectApp.value.id}/section/`)

      if (status === 200) {
        selectAppSection.value = data
        return data
      }

      return false
    }

    //MARK: UPDATE SECTION
    const updateSection = async (
      id: number,
      techName: string,
      humanName: string,
    ) => {
      const { status } = await api.put(`/stores/section/${id}/`, {
        tech_name: techName,
        human_name: humanName,
      })

      if (status === 200) {
        return true
      }

      return false
    }

    //MARK: CHANGE SECTION POSITION
    const changeSectionPosition = async (ids: number[]) => {
      const {
        data: { data },
        status,
      } = await api.post(`/stores/${selectApp.value.id}/section/reorder/`, {
        section_setting_ids: ids,
      })

      if (status === 200) {
        selectAppSection.value = data
        return true
      }

      return false
    }

    //MARK: GET TARIFFS
    const getTariffs = async () => {
      const {
        data: { data },
        status,
      } = await api.get('/tariffs/')

      if (status === 200) {
        tariffs.value = []

        const allTariffs = data.sort(
          (a: { payment: number }, b: { payment: number }) =>
            a.payment < b.payment ? -1 : 1,
        )
        for (const val of allTariffs) {
          if (val.name != 'trial' && val.name != 'new_tariff') {
            tariffs.value.push(val)
          }
        }
        return true
      }

      return false
    }

    //MARK: CREATE TEST APP
    const createTestApp = async () => {
      try {
        const response = await api.post(`/stores/trial/`)
        if (response.status === 200) {
          getMyApps()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: CREATE NEW APP
    const createNewApp = async () => {
      try {
        const response = await api.post(`/stores/`, {
          name: newApp.name,
          primary_color: newApp.primaryColor,
          secondary_color: newApp.secondaryTextColor,
          text_color: newApp.textColor,
          secondary_text_color: newApp.secondaryTextColor,
          bg_color: newApp.bgColor,
          secondary_bg_color: newApp.secondaryBgColor,
          has_pickup_points: true,
          description: newApp.description,
          category: newApp.category,
          tariff_id: newApp.tariffId,
          goods_cat_id: newApp?.goodsCat?.id,
        })
        if (response.status === 200) {
          newApp.icon.url = ''
          newApp.icon.isChanged = false
          newApp.splash.url = ''
          newApp.splash.isChanged = false
          newApp.name = null
          newApp.description = null
          newApp.primaryColor = '#32AFC0'
          newApp.bgColor = '#F8F8FB'
          newApp.secondaryBgColor = '#FFFFFF'
          newApp.textColor = '#1C1C1E'
          newApp.secondaryTextColor = '#A7A7A8'
          newApp.secondaryColor = '#D22121'
          newApp.category = null
          newApp.tariffId = 0
          newApp.goodsCat = null

          getMyApps()

          updateAppImage(response.data.data.id, 'icon', newApp.icon.file)
          updateAppImage(response.data.data.id, 'screen', newApp.splash.file)
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }


        //MARK: UPDATE APP CONTACT
        const updateAppContact = async () => {
          try {
            const response = await api.post(
              `/stores/${selectApp.value.id}/contacts/`,
              {
                phone: selectEditApp.value.contacts.phone,
                email: selectEditApp.value.contacts.email,
                address: selectEditApp.value.contacts.address,
                description: selectEditApp.value.contacts.description,
              },
            )
            if (response.status === 200) {
              getMyApps()
            }
    
            return response
          } catch (error) {
            console.error(error)
            return error
          }
        }


    //MARK: EDIT  APP
    const editAppParam = async (id: number, withColor: boolean) => {
      const post = ref({})
      if (withColor) {
        post.value = {
          name: selectEditApp.value.name,
          primary_color: selectEditApp.value.primaryColor,
          secondary_color: selectEditApp.value.secondaryColor,
          text_color: selectEditApp.value.textColor,
          secondary_text_color: selectEditApp.value.secondaryTextColor,
          bg_color: selectEditApp.value.bgColor,
          secondary_bg_color: selectEditApp.value.secondaryBgColor,
          has_pickup_points: selectEditApp.value.hasPickupPoints,
          has_delivering: selectEditApp.value.hasDelivering,
          hide_out_of_stock: selectEditApp.value.hideOutOfStock,
          description: selectEditApp.value.description,
          category: selectEditApp.value.category,
          tariff_next_id: selectEditApp.value.tariffId,
          goods_cat_id: selectEditApp?.value.goodsCat?.id,
        }
      } else {
        post.value = {
          name: selectEditApp.value.name,
          has_pickup_points: selectEditApp.value.hasPickupPoints,
          description: selectEditApp.value.description,
          category: selectEditApp.value.category,
          tariff_next_id: selectEditApp.value.tariffId,
          goods_cat_id: selectEditApp?.value.goodsCat?.id,
          has_delivering: selectEditApp.value.hasDelivering,
          hide_out_of_stock: selectEditApp.value.hideOutOfStock,
        }
      }

      try {
        const response = await api.put(`/stores/${id}/`, post.value)
        if (response.status === 200) {
          selectEditApp.value = response.data.data
          newApp.icon.url = ''
          newApp.icon.isChanged = false
          newApp.splash.url = ''
          newApp.splash.isChanged = false
          newApp.name = null
          newApp.description = null
          newApp.primaryColor = '#32AFC0'
          newApp.bgColor = '#F8F8FB'
          newApp.secondaryBgColor = '#FFFFFF'
          newApp.textColor = '#1C1C1E'
          newApp.secondaryTextColor = '#A7A7A8'
          newApp.secondaryColor = '#D22121'
          newApp.category = null
          newApp.tariffId = 0
          newApp.goodsCat = null

          getMyApps()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: UPDATE APP IMAGE
    const updateAppImage = async (
      id: number,
      type: string,
      newImage: File | null,
    ) => {
      try {
        const formData = new FormData()

        if (newImage != undefined) {
          formData.append('image', newImage)
        }

        const response = await api.post(
          `/stores/${id}/images/?image_type=${type}`,
          formData,
        )
        if (response.status === 200) {
          if ((type = 'icon')) {
            newApp.icon.file = null
          }
          if ((type = 'screen')) {
            newApp.splash.file = null
          }

          getMyApps()
        }
        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: DELETE TEST APP
    const deleteApp = async (id: number) => {
      try {
        const response = await api.delete(`/stores/${id}/`)
        if (response.status === 200) {
          if (selectApp.value.id == id) {
            selectApp.value = null
          }
          getMyApps()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    return {
      newApp,
      selectApp,
      selectAppSection,
      selectEditApp,
      apps,
      goodsCats,
      tariffs,
      getMyApps,
      getGoodCats,
      getAppSection,
      updateSection,
      changeSectionPosition,
      getTariffs,
      createTestApp,
      createNewApp,
      updateAppContact,
      editAppParam,
      updateAppImage,
      deleteApp,
    }
  },
  { persist: true },
)
