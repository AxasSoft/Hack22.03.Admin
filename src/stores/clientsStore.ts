import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/stores/api'
import type { Profile } from '@/types/Profile'
import clientApi from './clientApi'

export const useClientsStore = defineStore(
  'clients',
  () => {
    const clients = ref<Profile[]>([])
    const newClient = ref<Profile>({
      id: 0,
      avatar: {
        url: null,
        file: null,
        isChanged: false,
      },

      tel: null,
      firstName: null,
      lastName: null,
      patronymic: null,
      email: null,
      password: null,
      birthtime: null,
      gender: null,
      location: null,
      device: null,
      isActive: true,
      isSuperuser: false,
      created: null,
      deleted: null,
      rating: null,
      countFeedbackOrder: null,
      lastVisited: null,
      lastVisitedHuman: null,
      isOnline: null,
      categoryID: null,
      category: null,
      tg: null,
      isServicer: null,
      inBlacklist: null,
      inWhitelist: null,
      isBusiness: null,
      showTel: null,
      region: null,
      site: null,
      experience:  null,
      companyInfo: null,
      inSubscriptions: null,
      lat: null ,
      lon:  null ,
      country: null,
      status: null,
      subscriptionsCount: null,
      subscribersCount: null,
      profileCover: null,
      isDatingProfile:  null,
    })
    const selectEditClient = ref()
    const selectClientAdverts = ref()
    const selectClientAdvertsPage = ref(1)
    const selectClientPosts = ref()
    const selectClientPostsPage = ref(1)
    const selectClientExcursions = ref()
    const selectClientExcursionsPage = ref(1)
    const clientExcursionStatus = ref([{id: "new" ,name: "Новая"},{id: "paid", name:"Оплачена"},{id: "rejected", name:"Отменена"},{ id: "finished" , name:  "Завершена"} ])
    const selectClientHotels = ref()
    const selectClientHotelsPage = ref(1)
    const clientsPage = ref(1)
    const search = ref('')
    const onlyActiveClients = ref<boolean | null>(null) // only for request active - true ; inactive - false
    const clientsPaginator = ref()

    //MARK: GET USERS
    const getClients = async () => {
      let requestUrl = `/users/?page=${clientsPage.value}&search=${search.value}`

      if (onlyActiveClients.value != null) {
        requestUrl = requestUrl + `&is_active=${onlyActiveClients.value}`
      }
      try {
        const response = await api.get(requestUrl)
        if (response.status == 200) clients.value = response.data.data
        clientsPaginator.value = response.data.meta.paginator
        return response
      } catch (error) {
        return error
      }
    }


    //MARK: GET ONE CLIENT
    const getOneClient = async (id: number) => {
      try {
        const response = await api.get(`/users/${id}/`)
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: GET CLIENT ADVERTS
    const getClientAdverts = async (id: number) => {
      try {
        const response = await clientApi.get(
          `/users/${id}/ads/?page=${selectClientAdvertsPage.value}`,
        )
        if (selectClientAdvertsPage.value == 1) {
          selectClientAdverts.value = response.data.data
        } else {
          selectClientAdverts.value.push(...response.data.data)
        }
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: GET CLIENT POSTS
    const getClientPosts = async (id: number) => {
      try {
        const response = await api.get(
          `/users/${id}/stories/?page=${selectClientPostsPage.value}`,
        )
        if (selectClientPostsPage.value == 1) {
          selectClientPosts.value = response.data.data
        } else {
          selectClientPosts.value.push(...response.data.data)
        }
        return response
      } catch (error) {
        return error
      }
    }

        //MARK: DELETE POST
        const deletePost = async (id: number) => {
          try {
            const response = await api.delete(`/stories/${id}/`)
            if (response.status == 200) {
              getClientPosts(selectEditClient.value.id)
            }
    
            return response
          } catch (error) {
            console.error(error)
            return error
          }
        }



        //MARK: DELETE ADVERT
        const deleteAdvert = async (id: number) => {
          try {
            const response = await api.delete(`/ads/${id}/`)
            if (response.status == 200) {
              getClientPosts(selectEditClient.value.id)
            }
    
            return response
          } catch (error) {
            console.error(error)
            return error
          }
        }


    //MARK: GET CLIENT EXCURSIONS
    const getClientExcursions = async (id: number) => {
      try {
        const response = await api.get(
          `/users/${id}/bookings/excursions/?page=${selectClientExcursionsPage.value}`,
        )
        if (selectClientExcursionsPage.value == 1) {
          selectClientExcursions.value = response.data.data
        } else {
          selectClientExcursions.value.push(...response.data.data)
        }
        return response
      } catch (error) {
        return error
      }
    }
    //MARK: CHANGE CLIENT EXCURSION STATUS
    const updateClientExcursionStatus = async (id: number, status: string) => {
      try {
        const response = await api.put(
          `/excursions/bookings/${id}/status/`, {
            status: status
          }
        )
        
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: CREATE NEW CLIENT
    const createNewClient = async () => {
      try {
        const response = await api.post(
          `/users/`,
          {
            email: newClient.value?.email,
            tel: newClient.value?.tel,
            is_active: true,
            first_name: newClient.value?.firstName,
            patronymic: newClient.value?.patronymic,
            last_name: newClient.value?.lastName,
            lat: newClient.value?.lat,
            lon: newClient.value?.lon,
            location: newClient.value?.location,
            birthtime: newClient.value?.birthtime,
            gender: newClient.value?.gender,
            show_tel: true,
          },
        )
        if (response.status === 200) {
          if (newClient.value.avatar.isChanged) {
            await addClientAvatar(response.data.data.id)
          } else {
            await getClients()
          }
        }
        newClient.value = {
          id: 0,
          avatar: {
            url: null,
            file: null,
            isChanged: false,
          },
    
          tel: null,
          firstName: null,
          lastName: null,
          patronymic: null,
          email: null,
          password: null,
          birthtime: null,
          gender: null,
          location: null,
          device: null,
          isActive: true,
          isSuperuser: false,
          created: null,
          deleted: null,
          rating: null,
          countFeedbackOrder: null,
          lastVisited: null,
          lastVisitedHuman: null,
          isOnline: null,
          categoryID: null,
          category: null,
          tg: null,
          isServicer: null,
          inBlacklist: null,
          inWhitelist: null,
          isBusiness: null,
          showTel: null,
          region: null,
          site: null,
          experience:  null,
          companyInfo: null,
          inSubscriptions: null,
          lat: null ,
          lon:  null ,
          country: null,
          status: null,
          subscriptionsCount: null,
          subscribersCount: null,
          profileCover: null,
          isDatingProfile:  null,
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: UPDATE CLIENT
    const updateClient = async (id: number) => {
      try {
        const response = await api.put(`/users/${id}/`, {
          email: selectEditClient.value?.email,
          tel: selectEditClient.value?.tel,
          is_active: true,
          first_name: selectEditClient.value?.firstName,
          patronymic: selectEditClient.value?.patronymic,
          last_name: selectEditClient.value?.lastName,
          lat: selectEditClient.value?.lat,
          lon: selectEditClient.value?.lon,
          location: selectEditClient.value?.location,
          birthtime: selectEditClient.value?.birthtime,
          gender: selectEditClient.value?.gender,

        })
        if (response.status === 200) {
          if (selectEditClient.value.avatar.isChanged) {
            await updateClientAvatar(response.data.data.id)
          } else {
            await getClients()
          }
        }

        selectEditClient.value = null

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    // MARK: ADD CLIETN AVATAR
    const addClientAvatar = async (id: number) => {
      try {
        const formData = new FormData()

        let avatar: Blob

        if (newClient.value?.avatar.file != undefined) {
          avatar = newClient.value?.avatar.file
          formData.append('new_avatar', avatar)
        }

        const response = await api.post(`/users/${id}/avatar/`, formData)
        if (response.status === 200) {
          newClient.value!.avatar.file = null
          newClient.value!.avatar.url = ''
        }

        await getClients()

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    // MARK: UPDATE CLIENT AVATAR
    const updateClientAvatar = async (id: number) => {
      try {
        const formData = new FormData()

        let avatar: Blob

        if (selectEditClient.value.avatar?.file != undefined) {
          avatar = selectEditClient.value?.avatar.file || new Blob()
          formData.append('new_avatar', avatar)
        }

        const response = await api.post(`/users/${id}/avatar/`, formData)
        if (response.status === 200) {
          newClient.value!.avatar.file = null
          newClient.value!.avatar.url = ''
        }

        await getClients()

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: DELETE USER
    const deleteClient = async (id: number) => {
      try {
        const response = await api.delete(`/users/${id}/`)
        if (response.status == 200) {
          if (selectEditClient?.value?.id == id) {
            selectEditClient.value = null
          }
          getClients()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    return {
      newClient,
      selectEditClient,
      selectClientAdverts,
      selectClientAdvertsPage,
      selectClientPosts,
      selectClientPostsPage,
      selectClientExcursions,
      selectClientExcursionsPage,
      clientExcursionStatus,
      selectClientHotels,
      selectClientHotelsPage,
      clients,
      clientsPage,
      search,
      onlyActiveClients,
      clientsPaginator,
      getClients,
      getOneClient,
      getClientAdverts,
      getClientPosts,
      getClientExcursions,
      updateClientExcursionStatus,
      deletePost,
      deleteAdvert,
      createNewClient,
      updateClient,
      updateClientAvatar,
      deleteClient,
    }
  },
  // { persist: true },
)
