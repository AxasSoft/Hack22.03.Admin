import { defineStore } from 'pinia'
// import type { NewStore } from '@/types/NewStore'
import api from '@/stores/api'
import { ref, reactive, computed } from 'vue'
import { useAppStore } from './appStore'
import type { Article } from '@/types/Promo'

export const useArticlesStore = defineStore(
  'article',
  () => {
    const appStore = useAppStore()

    const newArticle = reactive({
      id: null,
      cover: {
        url: '',
        file: <Blob | null>null,
        isChanged: false,
      },
      title: null,
      text: null,
      link: null,
    })

    const articles = ref<Article[]>([])
    const articlesPage = ref(1)
    const search = ref('')
    const articlesPaginator = ref()
    const selectEditArticle = ref()

    //MARK: FILTERS
    const filters = reactive({
      name: null,
      tab: 'all',
    })

    const articlesFiltered = computed(() => {
      let articleList = articles.value

      if (filters.name) {
        articleList = articleList.filter(
          article =>
            (article.title ? article.title : '')
              .toLowerCase()
              .indexOf((filters.name ? filters.name : '').toLowerCase()) > -1,
        )
      } else {
        if (filters.tab == 'all') {
          articleList = articles.value
        }
      }

      return articleList
    })

    //MARK: GET ARTICLES
    const getArticles = async () => {
      try {
        const response = await api.get(
          `/stores/${appStore.selectApp?.id}/articles/?page=${articlesPage.value}`,
        )
        if (response.status == 200) articles.value = response.data.data
        articlesPaginator.value = response.data.meta.paginator
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: GET ARTICLES
    const getOneArticle = async (id: number) => {
      try {
        const response = await api.get(`/articles/${id}/`)
        return response
      } catch (error) {
        return error
      }
    }

    //MARK: CREATE NEW ARTICLE
    const createNewArticle = async () => {
      try {
        const response = await api.post(
          `/stores/${appStore.selectApp?.id}/articles/`,
          {
            title: newArticle.title,
            text: newArticle.text,
            link: newArticle.link,
          },
        )
        if (response.status === 200) {
          newArticle.title = null
          newArticle.text = null
          newArticle.link = null

          getArticles()

          updateArticleCover(
            response.data.data.id,
            (newArticle.cover.file =
              (response.data.data.id, newArticle.cover.file)),
          )
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: UPDATE ARTICLE
    const updateArticle = async (id: number) => {
      try {
        const response = await api.put(`/articles/${id}/`, {
          title: newArticle.title,
          text: newArticle.text,
          link: newArticle.link,
        })
        if (response.status === 200) {
          newArticle.id = null
          newArticle.title = null
          newArticle.text = null
          newArticle.link = null

          getArticles()

          updateArticleCover(
            response.data.data.id,
            (newArticle.cover.file =
              (response.data.data.id, newArticle.cover.file)),
          )
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    // MARK: UPDATE ARTICLE COVER
    const updateArticleCover = async (id: number, file: File | Blob | null) => {
      try {
        const formData = new FormData()

        // let image: File
        if (file != undefined) {
          // image = file
          formData.append('new_cover', file)
        }

        const response = await api.post(`/articles/${id}/cover/`, formData)
        if (response.status === 200) {
          newArticle.cover.file = null
          newArticle.cover.url = ''
          newArticle.cover.isChanged = false
        }

        getArticles()

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    //MARK: DELETE ARTICLE
    const deleteArticle = async (id: number) => {
      try {
        const response = await api.delete(`/articles/${id}/`)
        if (response.status == 200) {
          if (selectEditArticle?.value?.id == id) {
            selectEditArticle.value = null
          }
          getArticles()
        }

        return response
      } catch (error) {
        console.error(error)
        return error
      }
    }

    return {
      newArticle,
      selectEditArticle,
      articles,
      articlesPage,
      search,
      articlesPaginator,
      filters,
      articlesFiltered,
      getArticles,
      getOneArticle,
      createNewArticle,
      updateArticle,
      updateArticleCover,
      deleteArticle,
    }
  },
  // { persist: true },
)
