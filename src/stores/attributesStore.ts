import { defineStore } from 'pinia'
// import type { NewStore } from '@/types/NewStore'
import api from '@/stores/api'
import { ref, reactive } from 'vue'
import type { Attribute } from '@/types/Attribute'
import { useAppStore } from './appStore'

export const useAttributesStore = defineStore(
  'attributes',
  () => {
    const appStore = useAppStore()
    const newAttribute = reactive({
      name: '',
      optional: false,
      categoryId: null,
      productId: null,
      rangeFrom: null,
      rangeTo: null,
      options: null,
      attributeType: '',
    })

    const editAttribute = reactive({
      name: '',
      optional: false,
    })

    const selectAttribute = ref()
    const selectEditAttribute = ref()

    const editCategoryAttributes = ref<Attribute[]>([])
    const editProductAttributes = ref<Attribute[]>([])

    const attributes = ref<Attribute[]>([])

    //MARK: GET CATEGORY ATTRIBUTES
    const getCatAttributes = async (categoryId: number) => {
      const response = await api.get(
        `/stores/${appStore.selectApp?.id}/categories/${categoryId}/attributes/`,
      )

      if (response.status === 200) {
        editCategoryAttributes.value = response.data.data[0].attributes
        return response
      }

      return false
    }

    //MARK: GET PRODUCT ATTRIBUTES
    const getProductAttributes = async (productId: number) => {
      const response = await api.get(
        `/stores/${appStore.selectApp?.id}/products/${productId}/attributes/`,
      )

      if (response.status === 200) {
        editProductAttributes.value = response.data.data

        return response
      }

      return response
    }

    //MARK: CREATE CATEGORY ATTRIBUTE
    const createCategoryAttribute = async () => {
      try {
        const response = await api.post(
          `/stores/${appStore.selectApp?.id}/attributes/`,
          {
            name: newAttribute.name,
            optional: newAttribute.optional,
            category_id: newAttribute.categoryId,
            attribute_type: newAttribute.attributeType,
          },
        )
        if (response.status === 200) {
          newAttribute.categoryId = null
          newAttribute.productId = null
          newAttribute.rangeFrom = null
          newAttribute.rangeTo = null
          newAttribute.options = null
          newAttribute.attributeType = ''
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: CREATE PRODUCT ATTRIBUTE
    const createProductAttribute = async () => {
      try {
        const response = await api.post(
          `/stores/${appStore.selectApp?.id}/attributes/`,
          {
            name: newAttribute.name,
            optional: newAttribute.optional,
            product_id: newAttribute.productId,
            attribute_type: newAttribute.attributeType,
          },
        )
        if (response.status === 200) {
          newAttribute.categoryId = null
          newAttribute.productId = null
          newAttribute.rangeFrom = null
          newAttribute.rangeTo = null
          newAttribute.options = null
          newAttribute.attributeType = ''
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: CREATE ATTRIBUTE VALUE
    const createAttributeValue = async (
      id: number,
      value: string | number | boolean | null,
    ) => {
      const sendValue = ref()
      if (value == '') {
        sendValue.value = null
      } else {
        sendValue.value = value
      }

      if (value == true) {
        sendValue.value = 'true'
      } else if (value == false) {
        sendValue.value = 'false'
      }

      try {
        const response = await api.put(
          `/stores/${appStore.selectApp?.id}/attribute-values/${id}/`,
          {
            value: sendValue.value,
          },
        )
        if (response.status === 200) {
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: UPDATE ATTRIBUTE
    const updateAttribute = async (attributeId: number) => {
      try {
        const response = await api.put(
          `/stores/${appStore.selectApp?.id}/attributes/${attributeId}/`,
          {
            name: editAttribute.name,
            optional: editAttribute.optional,
          },
        )
        if (response.status === 200) {
          editAttribute.name = ''
          editAttribute.optional = false
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: DELETE ATTRIBUTE
    const deleteAttribute = async (id: number) => {
      try {
        const response = await api.delete(
          `/stores/${appStore.selectApp?.id}/attributes/?ids=${id}`,
        )

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    return {
      newAttribute,
      editAttribute,
      selectAttribute,
      selectEditAttribute,
      attributes,
      editCategoryAttributes,
      editProductAttributes,
      getCatAttributes,
      getProductAttributes,
      createCategoryAttribute,
      createProductAttribute,
      createAttributeValue,
      updateAttribute,
      deleteAttribute,
    }
  },
  { persist: true },
)
