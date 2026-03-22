import { defineStore } from 'pinia'
// import type { NewStore } from '@/types/NewStore'
import api from '@/stores/api'
import { ref, reactive } from 'vue'
import type { Audio } from '@/types/Audio'

export const useAudiosStore = defineStore(
  'audios',
  () => {
    const newAudio = reactive({
      title: null,
      description: null,
      lat: 0,
      lon: 0,
      
          audio: {
      url: '',
        file: <Blob | null>null,
        isChanged: false,
    },
          image: {
       url: '',
        file: <Blob | null>null,
        isChanged: false,
    }
      // isPrivate: false,
      // isOpen: true,
      // payLink: null,
      // category: null,
      // interests: null,
      // isDraft: false,
    })

    const selectAudio = ref()
    const selectEditAudio = ref()
    const selectFeedbackAudio = ref()
    const selectAudioFeedbacks = ref()
    const selectAudioFeedbacksPage = ref(1)

    const audios = ref<Audio[]>([])
    const audiosPage = ref(1)
    const audiosPaginator = ref()
    const audiosList = ref<Audio[]>([])



    //MARK: GET AUDIOS
    const getAudios = async () => {
      try {
        const response = await api.get(`/audio_guides/?page=${audiosPage.value}`)
        if (response.status == 200) audios.value = response.data.data
        audiosPaginator.value = response.data.meta.paginator
        return response
      } catch (error) {
        return error
      }
    }


    //MARK: CREATE NEW AUDIO
    const createNewAudio = async () => {
      try {
        console.log(newAudio)
        const response = await api.post(
          `/audio_guides/`,
          {
            title: newAudio.title,
            description: newAudio.description,
            lat: newAudio.lat,
            lon: newAudio.lon,
          },
        )
        if (response.status === 200) {
          newAudio.title = null
          newAudio.description = null
          newAudio.lat = 0
          newAudio.lon = 0
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: UPDATE AUDIO
    const updateAudio = async (id: number) => {
      try {
        const response = await api.put(
          `/audio_guides/${id}/`,
          {
            title: selectEditAudio.value.title,
            description: selectEditAudio.value.description,
            lat: selectEditAudio.value.lat,
            lon: selectEditAudio.value.lon,
          },
        )
        if (response.status === 200) {
          getAudios()

        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }


    //MARK: UPDATE AUDIO IMAGE
    const updateAudioImage = async (
      id: number,
      newImage: File | Blob | null
    ) => {
      try {
        const formData = new FormData()

        let image: Blob
        if (newImage != undefined) {
          image = newImage
          formData.append('image', image)
        }

        const response = await api.post(
          `/audio_guides/${id}/images/`,
          formData,
        )
        if (response.status === 200) {
        }

        getAudios()

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

        //MARK: UPDATE AUDIO FILE
    const updateAudioFile = async (
      id: number,
      newAudio: File | Blob | null
    ) => {
      try {
        const formData = new FormData()

        let audio: Blob
        if (newAudio != undefined) {
          audio = newAudio
          formData.append('audio', audio)
        }

        const response = await api.post(
          `/audio_guides/${id}/audios/`,
          formData,
        )
        if (response.status === 200) {
        }

        getAudios()

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: DELETE IMAGE
    const deleteImage = async (id: number) => {
      try {
        const response = await api.delete(
          `/audios/images/${id}/`,
        )

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: DELETE AUDIO
    const deleteAudio = async (id: number) => {
      try {
        const response = await api.delete(
          `/audio_guides/${id}/`,
        )
        if (response.status == 200) {
          if (selectAudio?.value?.id == id) {
            selectAudio.value = null
          }
          getAudios()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    return {
      newAudio,
      selectAudio,
      selectEditAudio,
      selectFeedbackAudio,
      selectAudioFeedbacks,
      selectAudioFeedbacksPage,
      audios,
      audiosPage,
      audiosPaginator,
      audiosList,
      getAudios,
      createNewAudio,
      updateAudio,
      updateAudioImage,
      deleteImage,
      deleteAudio,
      updateAudioFile,
    }
  },
  // { persist: true },
)
