import { defineStore } from 'pinia'
// import type { NewStore } from '@/types/NewStore'
import api from '@/stores/api'
import { ref, reactive } from 'vue'
import type { Complaint } from '@/types/Complaint'

export const useComplaintStore = defineStore(
  'complaint',
  () => {
    const newComplaint = reactive({
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

    const complaintsUser = ref<Complaint[]>([])
    const complaintsStories = ref<Complaint[]>([])
    const selectEditComplaint = ref()
    const complaintPage = ref(1)
    const complaintPaginator = ref()
    const search = ref()



    const complaintCategories = ref([
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


    //MARK: GET USERS COMPLAINTS
    const getUsersComplaints = async () => {
      const requestUrl = `/users/reports/?page=${complaintPage.value}`
      try {
        const response = await api.get(requestUrl)
        if (response.status == 200) complaintsUser.value = response.data.data
        complaintPaginator.value = response.data.meta.paginator
        return response
      } catch (error) {
        return error
      }
    }

     //MARK: GET STORIES COMPLAINTS
     const getStoreisComplaints = async () => {
      const requestUrl = `/stories/reports/?page=${complaintPage.value}`
      try {
        const response = await api.get(requestUrl)
        if (response.status == 200) complaintsStories.value = response.data.data
        complaintPaginator.value = response.data.meta.paginator
        return response
      } catch (error) {
        return error
      }
    }

    

    //MARK: UPDATE COMPLAINT
    const updateUserComplaint = async (satisfy: boolean) => {
      try {
        const response = await api.put(
          `/users/reports/${selectEditComplaint.value.id}/`,
          {
            is_satisfy: satisfy
          },
        )
        if (response.status === 200) {
          selectEditComplaint.value = null
          getUsersComplaints()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

        //MARK: UPDATE COMPLAINT
    const updateStoriesComplaint = async (satisfy: boolean) => {
      try {
        const response = await api.put(
          `/stories/reports/${selectEditComplaint.value.id}/`,
          {
            is_satisfy: satisfy
          },
        )
        if (response.status === 200) {
          selectEditComplaint.value = null
          getStoreisComplaints()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }


    return {
      newComplaint,
      selectEditComplaint,
      complaintsUser,
      complaintsStories,
      complaintPage,
      complaintPaginator,
      search,
      complaintCategories,
      getUsersComplaints,
      getStoreisComplaints,
      updateUserComplaint,
      updateStoriesComplaint,
    }
  },
  // { persist: true },
)
