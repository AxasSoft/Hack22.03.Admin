import { defineStore } from 'pinia'
// import type { NewStore } from '@/types/NewStore'
import api from '@/stores/api'
import { ref, reactive } from 'vue'
import type { Category } from '@/types/Category'

export const useCategoriesStore = defineStore(
  'categories',
  () => {
    const newCategory = reactive({
      thumbnail: {
        url: '',
        file: <Blob | null>null,
        isChanged: false,
      },
      banner: {
        url: '',
        file: <Blob | null>null,
        isChanged: false,
      },
      name: null,
      parentId: null,
      orderNum: null,
      isActive: true,
    })

    const selectCategory = ref()
    const selectEditCategory = ref()

    const changePositions = ref(false)

    const categories = ref<Category[]>([]) // parent with children
    const categoriesWithSubcategories = ref<Category[]>([]) // all category and subcategory
    const subcategories = ref<Category[]>([])

    //MARK: GET CATEGORIES WITH SUBCATEGORIES
    const getCategoriesWithSubcategories = async () => {
      const {
        data: { data },
        status,
      } = await api.get(
        `/categories/`,
      )

      if (status === 200) {
        categoriesWithSubcategories.value = data
        categories.value = []
        subcategories.value = []
        for (const cat of categoriesWithSubcategories.value) {
          categories.value.push(cat)
          for (const subcat of cat.subcategories) {
            subcategories.value.push(subcat)
          }
        }
        return true
      }

      return false
    }

    //MARK: CREATE NEW CATEGORY
    const createNewCategory = async () => {
      try {
        const response = await api.post(
          `/categories/`,
          {
            name: newCategory.name,
          },
        )
        if (response.status === 200) {
          newCategory.thumbnail.url = ''
          newCategory.thumbnail.isChanged = false
          newCategory.banner.url = ''
          newCategory.banner.isChanged = false
          newCategory.name = null
          newCategory.parentId = null
          newCategory.orderNum = null

          getCategoriesWithSubcategories()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: UPDATE CATEGORY
    const updateCategory = async (id: number) => {
      try {
        const response = await api.put(`/categories/${id}/`, {
          name: selectEditCategory.value.name,
          parent_id: selectEditCategory.value.parentId,
          order_num: selectEditCategory.value.orderNum,
          is_active: selectEditCategory.value.isActive,
        })
        if (response.status === 200) {
          selectEditCategory.value = null

          getCategoriesWithSubcategories()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }


        //MARK: CREATE NEW SUBCATEGORY
        const createNewSubcategory = async () => {
          try {
            const response = await api.post(
              `/subcategories/`,
              {
                name: newCategory.name,
                category_id: newCategory.parentId,
              },
            )
            if (response.status === 200) {
              newCategory.thumbnail.url = ''
              newCategory.thumbnail.isChanged = false
              newCategory.banner.url = ''
              newCategory.banner.isChanged = false
              newCategory.name = null
              newCategory.parentId = null
              newCategory.orderNum = null
    
              getCategoriesWithSubcategories()
            }
    
            return response
          } catch (error) {
            console.error(error)
            return error
          }
        }
    
        //MARK: UPDATE SUBCATEGORY
        const updateSubcategory = async (id: number, parentId: number) => {
          try {
            const response = await api.put(`/subcategories/${id}/`, {
              name: selectEditCategory.value.name,
              category_id: parentId,
            })
            if (response.status === 200) {
              selectEditCategory.value = null
    
              getCategoriesWithSubcategories()
            }
    
            return response
          } catch (error) {
            console.error(error)
            return error
          }
        }
    
    //MARK: DELETE CATEGORY
    const deleteCategory = async (id: number) => {
      try {
        const response = await api.delete(
          `/categories/${id}/`,
        )
        if (response.status == 200) {
          if (selectCategory?.value?.id == id) {
            selectCategory.value = null
          }
          getCategoriesWithSubcategories()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

        //MARK: DELETE SUBCATEGORY
        const deleteSubcategory = async (id: number) => {
          try {
            const response = await api.delete(
              `/subcategories/${id}/`,
            )
            if (response.status == 200) {
              if (selectCategory?.value?.id == id) {
                selectCategory.value = null
              }
              getCategoriesWithSubcategories()
            }
    
            return response
          } catch (error) {
            console.error(error)
            return error
          }
        }

    return {
      newCategory,
      selectCategory,
      selectEditCategory,
      changePositions,
      categories,
      categoriesWithSubcategories,
      subcategories,
      getCategoriesWithSubcategories,
      createNewCategory,
      createNewSubcategory,
      updateCategory,
      updateSubcategory,
      deleteCategory,
      deleteSubcategory
    }
  },
  // { persist: true },
)
