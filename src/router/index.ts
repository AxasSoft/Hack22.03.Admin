import { useUserStore } from '@/stores/userStore'
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useToast } from 'vue-toastification'

const routes: RouteRecordRaw[] = [
  //MARK: SIGN IN
  {
    path: '/login',
    name: 'login',
    meta: { layout: 'empty', title: 'Авторизация' },
    props: true,
    component: () => import('@/views/SignIn/LoginView.vue'),
  },






  //MARK: ANALYTICS
  {
    path: '/analytics',
    name: 'analytics',
    meta: { layout: 'main', title: 'Аналитика' },
    props: true,
    component: () => import('@/views/ADMIN/Analytics/AnalyticsView.vue'),
  },

  //MARK: CLIENTS
  {
    path: '/clients',
    name: 'clients',
    meta: { layout: 'main', title: 'Пользователи' },
    props: true,
    component: () => import('@/views/ADMIN/Clients/ClientsView.vue'),
  },

  //MARK: NOTIFICATIONS
  {
    path: '/notifications',
    name: 'notifications',
    meta: { layout: 'main', title: 'Рассылки' },
    props: true,
    component: () =>
      import('@/views/ADMIN/Notifications/NotificationsView.vue'),
  },

  //MARK: INFO
  {
    path: '/info',
    name: 'info',
    meta: { layout: 'main', title: 'Информация' },
    props: true,
    component: () => import('@/views/ADMIN/Info/InfoView.vue'),
  },

  //MARK: W&B
  {
    path: '/wb',
    name: 'wb',
    meta: { layout: 'main', title: 'White & Black' },
    props: true,
    component: () => import('@/views/ADMIN/wb/W&BView.vue'),
  },

  //MARK: ADS
  {
    path: '/ads',
    name: 'ads',
    meta: { layout: 'main', title: 'Объявления' },
    props: true,
    component: () => import('@/views/ADMIN/Ads/AdsView.vue'),
  },

    //MARK: AUDIO
  {
    path: '/audio',
    name: 'audio',
    meta: { layout: 'main', title: 'Объявления' },
    props: true,
    component: () => import('@/views/ADMIN/Audio/AudiosView.vue'),
  },

  //MARK: CATEGORIES
  {
    path: '/categories',
    name: 'categories',
    meta: { layout: 'main', title: 'Категории' },
    props: true,
    component: () => import('@/views/ADMIN/Categories/CategoriesView.vue'),
  },

  //MARK: BANNERS
  {
    path: '/promo',
    name: 'promo',
    meta: { layout: 'main', title: 'Реклама' },
    props: true,
    component: () => import('@/views/ADMIN/Promo/PromosView.vue'),
  },

  //MARK: COMPLAINTS
  {
    path: '/complaints',
    name: 'complaints',
    meta: { layout: 'main', title: 'Жалобы на пользователей' },
    props: true,
    component: () => import('@/views/ADMIN/Complaints/ComplaintsView.vue'),
  },

  
  //MARK: EVENTS
  {
    path: '/events',
    name: 'events',
    meta: { layout: 'main', title: 'Мероприятия ' },
    props: true,
    component: () => import('@/views/ADMIN/Events/EventsView.vue'),
  },
  //MARK: EXCURSIONS
  {
    path: '/excursions',
    name: 'excursions',
    meta: { layout: 'main', title: 'Экскурсии' },
    props: true,
    component: () => import('@/views/ADMIN/Excursions/ExcursionsView.vue'),
  },
    //MARK: EXCURSION CATEGORIES
    {
      path: '/excursion-categories',
      name: 'excursion-categories',
      meta: { layout: 'main', title: 'Категории экскурсий' },
      props: true,
      component: () => import('@/views/ADMIN/ExcursionCategories/ExcursionCategoriesView.vue'),
    },

  //MARK: RESTAURANTS
  {
    path: '/restaurants',
    name: 'restaurants',
    meta: { layout: 'main', title: 'Рестораны' },
    props: true,
    component: () => import('@/views/ADMIN/Restaurants/RestaurantsView.vue'),
  },

  //MARK: TRANSFERS
  {
    path: '/transfers',
    name: 'transfers',
    meta: { layout: 'main', title: 'Трансферы' },
    props: true,
    component: () => import('@/views/ADMIN/Transfers/TransfersView.vue'),
  },

      //MARK: SNOWMOBILE
  {
    path: '/snowmobile',
    name: 'snowmobile',
    meta: { layout: 'main', title: 'Трансферы' },
    props: true,
    component: () => import('@/views/ADMIN/Snowmobile/SnowmobileView.vue'),
  },
  //MARK: PROFILE
  {
    path: '/profile/account',
    name: 'profile_account',
    meta: { layout: 'main', title: 'Профиль' },
    props: true,
    component: () => import('@/views/ADMIN/Profile/ProfileAccount.vue'),
  },
  {
    path: '/profile/sequrity',
    name: 'profile_sequrity',
    meta: { layout: 'main', title: 'Профиль' },
    props: true,
    component: () => import('@/views/ADMIN/Profile/ProfileChangePassword.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

function getOS() {
  const userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod']
  let os = null

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS'
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS'
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows'
  } else if (/Android/.test(userAgent)) {
    os = 'Android'
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux'
  }

  return os
}

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const toast = useToast()
  let isAccessed = userStore.isAuthenticated

  if (!userStore.isAuthenticated) {
    try {
      isAccessed = await userStore.restoreSession()
    } catch (error) {
      console.warn(error)

      // toast.info('Проводятся технические работы на серверах.')
    }
  }

  if (document.documentElement.clientWidth <= 280) {
    const os = getOS()
    toast.error(
      'Административная панель доступна только с персонального компьютера. Планшеты и смартфоны не поддерживаются',
    )
    if (os == 'Mac OS' || os == 'iOS') {
      // window.location.href = 'https://apple.com'
    } else if (os == 'Android' || os == 'Linux') {
      // window.location.href = 'https://google.com'
    }
    return
  }

  if (!isAccessed) {
    if (
      to.name !== 'login'
    ) {
      next({ name: 'login' })
    }
  } else if (
    isAccessed &&
    userStore.user.firstName === null &&
    to.name != 'profile_account'
  ) {
    toast.error('Сначала укажите данные профиля')
    next({ name: 'profile_account' })
  } else if (
    isAccessed && to.name === 'login'
  ) {
    next({ name: 'clients' })
  } else if (
    isAccessed &&
    to.name !== 'login' &&
    to.name !== 'analytics' &&
    to.name !== 'clients' &&
    to.name !== 'notifications' &&
    to.name !== 'info' &&
    to.name !== 'wb' &&
    to.name !== 'ads' &&
    to.name !== 'audio' &&
    to.name !== 'categories' &&
    to.name !== 'promo' &&
    to.name !== 'complaints' &&
    to.name !== 'events' &&
    to.name !== 'excursions' &&
    to.name !== 'excursion-categories' &&
    to.name !== 'restaurants' &&
    to.name !== 'transfers' &&
    to.name !== 'snowmobile' &&
    to.name !== 'profile_account' &&
    to.name !== 'profile_sequrity' 
  ) {
    next({ name: 'clients' })
  }

  next()
})

export default router
