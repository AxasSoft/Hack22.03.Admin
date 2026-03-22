import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useAppStore } from './appStore'
import clientApi from './clientApi'
import type { Category } from '@/types/Info'
import type { Product } from '@/types/Restaurant'
import type { Banner } from '@/types/Promo'

export const useSmartphoneStore = defineStore('client', () => {
  const appStore = useAppStore()

  const products = ref<Product[]>([])
  const specialProducts = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const banners = ref<Banner[]>([])

  //MARK: GET PRODUCTS
  const getProducts = async () => {
    try {
      const response = await clientApi.post(
        `/stores/${appStore.selectApp?.id}/products/?page=1`,
      )
      if (response.status == 200) products.value = response.data.data
      return response
    } catch (error) {
      return error
    }
  }

  //MARK: GET SPECIAL PRODUCTS
  const getSpecialProducts = async () => {
    try {
      const response = await clientApi.post(
        `/stores/${appStore.selectApp?.id}/products/?page=1&is_special=true`,
      )
      if (response.status == 200) specialProducts.value = response.data.data
      return response
    } catch (error) {
      return error
    }
  }

  //MARK: GET CATEGORIES
  const getCategories = async () => {
    const {
      data: { data },
      status,
    } = await clientApi.get(
      `/stores/${appStore.selectApp?.id}/categories/?with_subcategories=true&isSpecial=false`,
    )

    if (status === 200) {
      categories.value = []
      for (const category of data) {
        if (!category.parentId) {
          categories.value.push(category)
        }
      }
      return true
    }

    return false
  }

  //MARK: GET BANNERS
  const getBanners = async () => {
    console.log('BANN')
    try {
      const response = await clientApi.get(
        `/stores/${appStore.selectApp?.id}/promos/?page=1`,
      )
      if (response.status == 200) banners.value = response.data.data
      return response
    } catch (error) {
      return error
    }
  }

  return {
    products,
    specialProducts,
    categories,
    banners,
    getProducts,
    getSpecialProducts,
    getCategories,
    getBanners,
  }
})
