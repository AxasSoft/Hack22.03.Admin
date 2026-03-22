import { defineStore } from 'pinia'
// import type { NewStore } from '@/types/NewStore'
import api from '@/stores/api'
import { ref, reactive } from 'vue'
import type { Event } from '@/types/Event'
import { getUnixTime } from '@/plugins/unixTime'

export const useEventsStore = defineStore(
  'events',
  () => {
    const newEvent = reactive({
      name: null,
      description: null,
      place: '',
      started: null,
      ended: null,
      lat: null,
      lon: null,
      age: null,
      maxEventMembers: null,
      price: null,
      payLink: null,
      images: <Blob[]>[],
      imagesUrls: <string[]>[]
      // isPrivate: false,
      // isOpen: true,
      // payLink: null,
      // category: null,
      // interests: null,
      // isDraft: false,
    })

    const selectEvent = ref()
    const selectEditEvent = ref()
    const selectFeedbackEvent = ref()
    const selectEventFeedbacks = ref()
    const selectEventFeedbacksPage = ref(1)

    const events = ref<Event[]>([])
    const eventsPage = ref(1)
    const eventsPaginator = ref()
    const eventsList = ref<Event[]>([])



    //MARK: GET EVENTS
    const getEvents = async () => {
      try {
        const response = await api.get(`/events/?page=${eventsPage.value}`)
        if (response.status == 200) events.value = response.data.data
        eventsPaginator.value = response.data.meta.paginator
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: GET ONE EVENTS
    const getOneEvent = async (id: number) => {
      try {
        const response = await api.get(
          `/events/${id}/`,
        )
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: GET EVENT FEEDBACKS
    const getEventFeedbacks = async (id: number) => {
      try {
        const response = await api.get(
          `/events/${id}/reviews/`,
        )
        if (selectEventFeedbacksPage.value == 1) {
          selectEventFeedbacks.value = response.data.data
        } else {
          selectEventFeedbacks.value.push(...response.data.data)
        }
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: DELETE EVENT FEEDBACK
    const deleteEventFeedback = async (feedbackId: number) => {
      try {
        const response = await api.delete(
          `/events/feedbacks/${feedbackId}/`,
        )

        selectEventFeedbacks.value = selectEventFeedbacks.value.filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (removedFeedback: any) => removedFeedback.id != feedbackId,
        )

        return response
      } catch (error) {
        return error
      }
    }

    //MARK: CREATE NEW EVENT
    const createNewEvent = async () => {
      try {
        console.log(newEvent)
        const response = await api.post(
          `/events/`,
          {
            name: newEvent.name,
            description: newEvent.description,
            place: newEvent.place,
            started: getUnixTime(newEvent.started),
            ended: getUnixTime(newEvent.ended),
            lat: newEvent.lat,
            lon: newEvent.lon,
            age: newEvent.age,
            maxEventMembers: newEvent.maxEventMembers,
            price: newEvent.price,
            payLink: newEvent.payLink,
          },
        )
        if (response.status === 200) {
          newEvent.name = null
          newEvent.description = null
          newEvent.place = ''
          newEvent.started = null
          newEvent.ended = null
          newEvent.lat = null
          newEvent.lon = null
          newEvent.age = null
          newEvent.maxEventMembers = null
          newEvent.price = null
          newEvent.payLink = null

          getEvents()

          let imageCounter = 0
          for (const image of newEvent.images) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const imageResponse: any = updateEventImage(
              response.data.data.id,
              image,
              imageCounter
            )

            if ((imageResponse.status = 200)) {
              imageCounter++
              if (imageCounter == newEvent.imagesUrls.length) {
                newEvent.imagesUrls = []
                newEvent.images = []
              }
            }
          }
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: UPDATE EVENT
    const updateEvent = async (id: number) => {
      try {
        const response = await api.put(
          `/events/${id}/`,
          {
            name: selectEditEvent.value.name,
            description: selectEditEvent.value.description,
            place: selectEditEvent.value.place,
            started: getUnixTime(selectEditEvent.value.started),
            ended: getUnixTime(selectEditEvent.value.ended),
            lat: selectEditEvent.value.lat,
            lon: selectEditEvent.value.lon,
            age: selectEditEvent.value.age,
            maxEventMembers: selectEditEvent.value.maxEventMembers,
            price: selectEditEvent.value.price,
            payLink: selectEditEvent.value.payLink,
          },
        )
        if (response.status === 200) {
          getEvents()

          let imageCounter = 0
          for (const image of selectEditEvent.value.images) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const imageResponse: any = updateEventImage(
              response.data.data.id,
              image,
              imageCounter
            )

            if ((imageResponse.status = 200)) {
              imageCounter++
              if (imageCounter == selectEditEvent.value.imagesUrls.length) {
                selectEditEvent.value.imagesUrls = []
                selectEditEvent.value.images = []
              }
            }
          }
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }


    //MARK: UPDATE EVENT IMAGE
    const updateEventImage = async (
      id: number,
      newImage: File | Blob | null,
      num: number
    ) => {
      try {
        const formData = new FormData()

        let image: Blob
        if (newImage != undefined) {
          image = newImage
          formData.append('image', image)
          formData.append('num', num.toString())
        }

        const response = await api.post(
          `/events/${id}/images/`,
          formData,
        )
        if (response.status === 200) {
        }

        getEvents()

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
          `/events/images/${id}/`,
        )

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: DELETE EVENT
    const deleteEvent = async (id: number) => {
      try {
        const response = await api.delete(
          `/events/${id}/`,
        )
        if (response.status == 200) {
          if (selectEvent?.value?.id == id) {
            selectEvent.value = null
          }
          getEvents()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    return {
      newEvent,
      selectEvent,
      selectEditEvent,
      selectFeedbackEvent,
      selectEventFeedbacks,
      selectEventFeedbacksPage,
      events,
      eventsPage,
      eventsPaginator,
      eventsList,
      getEvents,
      getOneEvent,
      getEventFeedbacks,
      deleteEventFeedback,
      createNewEvent,
      updateEvent,
      updateEventImage,
      deleteImage,
      deleteEvent,
    }
  },
  // { persist: true },
)
