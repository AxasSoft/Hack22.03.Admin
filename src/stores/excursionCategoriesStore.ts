import { defineStore } from 'pinia'
// import type { NewStore } from '@/types/NewStore'
import api from '@/stores/api'
import { ref, reactive } from 'vue'
import type { ExcursionCategory } from '@/types/ExcursionCategory'

export const useExcursionCategoriesStore = defineStore(
  'excursionCategories',
  () => {
    const newExcursionCategory = reactive({
      backgroundImage: {
        url: '',
        file: <Blob | null>null,
        isChanged: false,
      },
      name: null,
      description: null
    })

    const selectExcursionCategory = ref()
    const selectEditExcursionCategory = ref()

    const changePositions = ref(false)

    const excursionCategories = ref<ExcursionCategory[]>([]) // parent with children
    const excursionCategoriesWithSubcategories = ref<ExcursionCategory[]>([]) // all excursionCategory and subcategory

    //MARK: GET CATEGORIES WITH SUBCATEGORIES
    const getExcursionCategoriesWithSubcategories = async () => {
      const {
        data: { data },
        status,
      } = await api.get(
        `/excursion-categories/`,
      )

      if (status === 200) {
        excursionCategoriesWithSubcategories.value = data

        excursionCategories.value = []
        for (const excursionCategory of data) {
            excursionCategories.value.push(excursionCategory)
        }
        return true
      }

      return false
    }

    //MARK: CREATE NEW EXCURSION CATEGORY
    const createNewExcursionCategory = async () => {
      try {
        const response = await api.post(
          `/excursion-categories/`,
          {
            name: newExcursionCategory.name,
            description: newExcursionCategory.description,
          },
        )
        if (response.status === 200) {
          newExcursionCategory.backgroundImage.url = ''
          newExcursionCategory.backgroundImage.isChanged = false
          newExcursionCategory.name = null
          newExcursionCategory.description = null

          getExcursionCategoriesWithSubcategories()

          updateExcursionCategoryThumbnail(
            response.data.data.id,
            newExcursionCategory.backgroundImage.file,
          )
          // updateExcursionCategoryBanner(response.data.data.id)
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: UPDATE EXCURSION CATEGORY
    const updateExcursionCategory = async (id: number) => {
      try {
        const response = await api.put(`/excursion-categories/${id}/`, {
          name: selectEditExcursionCategory.value.name,
          description: selectEditExcursionCategory.value.description,
        })
        if (response.status === 200) {
          selectEditExcursionCategory.value = null

          getExcursionCategoriesWithSubcategories()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: UPDATE EXCURSION CATEGORY THUMBNAIL
    const updateExcursionCategoryThumbnail = async (id: number, file: Blob | null) => {
      try {
        const formData = new FormData()

        // let image: File
        if (file != undefined) {
          // image = file
          formData.append('image', file)
        }

        const response = await api.post(
          `/excursion-categories/${id}/image/`,
          formData,
        )
        if (response.status === 200) {
          newExcursionCategory.backgroundImage.file = null
        }

        getExcursionCategoriesWithSubcategories()

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }


    //MARK: DELETE EXCURSION CATEGORY
    const deleteExcursionCategory = async (id: number) => {
      try {
        const response = await api.delete(
          `/excursion-categories/${id}/`,
        )
        if (response.status == 200) {
          if (selectExcursionCategory?.value?.id == id) {
            selectExcursionCategory.value = null
          }
          getExcursionCategoriesWithSubcategories()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    return {
      newExcursionCategory,
      selectExcursionCategory,
      selectEditExcursionCategory,
      excursionCategoriesWithSubcategories,
      changePositions,
      excursionCategories,
      getExcursionCategoriesWithSubcategories,
      createNewExcursionCategory,
      updateExcursionCategory,
      updateExcursionCategoryThumbnail,
      deleteExcursionCategory,
    }
  },
  // { persist: true },
)
