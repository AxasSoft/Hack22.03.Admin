import { defineStore } from 'pinia'
import api from '@/stores/api'
import { reactive, ref } from 'vue'
import { useAppStore } from './appStore'
import type { FAQ } from '@/types/FAQ'

export const useFAQStore = defineStore(
  'faq',
  () => {
    const appStore = useAppStore()
    const newFAQ: FAQ = reactive({
      id: 0,
      question: null,
      answer: null,
      created: null,
    })

    const FAQs = ref<FAQ[]>([])
    const selectEditFAQ = ref()
    const FAQPage = ref(1)
    const FAQPaginator = ref()
    const search = ref()

    //MARK: GET FAQS
    const getFAQs = async () => {
      const requestUrl = `/stores/${appStore.selectApp?.id}/faq/?page=${FAQPage.value}`
      try {
        const response = await api.get(requestUrl)
        if (response.status == 200) FAQs.value = response.data.data
        FAQPaginator.value = response.data.meta.paginator
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: CREATE NEW FAQ
    const createNewFAQ = async () => {
      try {
        const response = await api.post(
          `/stores/${appStore.selectApp?.id}/faq/`,
          {
            question: newFAQ.question,
            answer: newFAQ.answer,
          },
        )
        if (response.status === 200) {
          newFAQ.id = 0
          newFAQ.question = null
          newFAQ.answer = null

          getFAQs()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: UPDATE FAQ
    const updateFAQ = async () => {
      try {
        const response = await api.put(
          `/stores/${appStore.selectApp?.id}/faq/${selectEditFAQ.value.id}/`,
          {
            question: selectEditFAQ.value.question,
            answer: selectEditFAQ.value.answer,
          },
        )
        if (response.status === 200) {
          selectEditFAQ.value = null
          getFAQs()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: DELETE FAQ
    const deleteFAQ = async (id: number) => {
      try {
        const response = await api.delete(
          `/stores/${appStore.selectApp?.id}/faq/${id}/`,
        )
        if (response.status == 200) {
          if (selectEditFAQ?.value?.id == id) {
            selectEditFAQ.value = null
          }
          getFAQs()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    return {
      newFAQ,
      selectEditFAQ,
      FAQs,
      FAQPage,
      FAQPaginator,
      search,
      getFAQs,
      createNewFAQ,
      updateFAQ,
      deleteFAQ,
    }
  },
  // { persist: true },
)
