import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'
import api from '@/stores/api'
import { type TariffFeeR, type Payer, type Profile } from '@/types/Profile'

export const useUserStore = defineStore('user', () => {
  const user: Profile = reactive({
    id: 0,
    avatar: {
      url: null,
      file: null,
      isChanged: false,
    },

    tel: null,
    firstName: null,
    lastName: null,
    patronymic: null,
    email: null,
    password: null,
    birthtime: null,
    gender: null,
    location: null,
    isActive: true,
    isSuperuser: false,
    isManager: false,
    isBlock: false,
    roleId: null,
    notifyAboutInfo: false,
    orgName: null,
    contactTel: null,
    contactName: null,
    orgRating: null,
    positiveFeedbackCount: null,
    totalFeedbackCount: null,
    popularity: null,
    deliveryAddresses: [],
    pickupPoints: [],
    account: null,
    trialAccount: null,
    cashback: null,
    userDetails: null,
  })

  const payer: Payer = reactive({
    tel: null,
    name: null,
    companyName: null,
    address: null,
    type: null,
    pay: null,
    inn: null,
    kpp: null,
    ogrn: null,
    bank: null,
    bik: null,
    korPay: null,
    userId: null,
  })
  const isAuthenticated = ref(false)

  const tariffPayment = ref<TariffFeeR>()

  //MARK: REGISTRATION
  const registration = async (email: string, password: string) => {
    try {
      const response = await api.post('/reg/', {
        email: email,
        password: password,
      })
      if (response.status === 200) {
        return response
      }
      return response
    } catch (error) {
      console.error(error)
      return error
    }
  }

  //MARK: VIERIFY EMAIL
  const activate = async (email: string, code: string) => {
    try {
      const response = await api.post(`/activate/`, {
        email: email,
        code: code,
      })
      if (response.status === 200) {
        localStorage.setItem('token', response.data.data.accessToken)
        isAuthenticated.value = true

        console.log('TOKKKEETNN')
        console.log(localStorage.getItem('token'))

        user.id = response.data.data.user.id
        user.tel = response.data.data.user.tel
        user.avatar.url = response.data.data.user.avatar
        user.firstName = response.data.data.user.firstName
        user.lastName = response.data.data.user.lastName
        user.patronymic = response.data.data.user.patronymic
        user.email = response.data.data.user.email
        user.password = response.data.data.user.password
        user.birthtime = response.data.data.user.birthtime
        user.gender = response.data.data.user.gender
        user.location = response.data.data.user.location
        user.isActive = response.data.data.user.isAtive
        user.isSuperuser = response.data.data.user.isManager
        user.isBlock = response.data.data.user.isBlock
        user.roleId = response.data.data.user.roleId
        user.notifyAboutInfo = response.data.data.user.notifyAboutInfo
        user.orgName = response.data.data.user.orgName
        user.contactTel = response.data.data.user.contactTel
        user.contactName = response.data.data.user.contactName
        user.orgRating = response.data.data.user.orgRating
        user.positiveFeedbackCount =
          response.data.data.user.positiveFeedbackCount
        user.totalFeedbackCount = response.data.data.user.totalFeedbackCount
        user.popularity = response.data.data.user.popularity
        user.deliveryAddresses = response.data.data.user.deliveryAddresses
        user.pickupPoints = response.data.data.user.pickupPoints
        user.account = response.data.data.user.account
        user.cashback = response.data.data.user.cashback
        user.trialAccount = response.data.data.user.trialAccount
        user.userDetails = response.data.data.user.userDetails
        payer.name = response.data.data.user.userDetails?.name
        payer.tel = response.data.data.user.userDetails?.tel
        payer.companyName = response.data.data.user.userDetails?.companyName
        payer.address = response.data.data.user.userDetails?.address
        payer.bank = response.data.data.user.userDetails?.bank
        payer.bik = response.data.data.user.userDetails?.bik
        payer.inn = response.data.data.user.userDetails?.inn
        payer.kpp = response.data.data.user.userDetails?.kpp
        payer.korPay = response.data.data.user.userDetails?.korPay
        payer.pay = response.data.data.user.userDetails?.pay
        payer.type = response.data.data.user.userDetails?.type
        payer.ogrn = response.data.data.user.userDetails?.ogrn
        payer.userId = response.data.data.user.userDetails?.userId
      }

      return response
    } catch (error) {
      console.error(error)
      return error
    }
  }

  //MARK: SIGN IN
  const signIn = async (email: string, password: string) => {
    try {
      const response = await api.post('/sign-in/', {
        email: email,
        password: password,
      })

      if (response.status === 200) {
        localStorage.setItem('token', response.data.data.accessToken)
        isAuthenticated.value = true

        user.id = response.data.data.user.id
        user.tel = response.data.data.user.tel
        user.avatar.url = response.data.data.user.avatar
        user.firstName = response.data.data.user.firstName
        user.lastName = response.data.data.user.lastName
        user.patronymic = response.data.data.user.patronymic
        user.email = response.data.data.user.email
        user.password = response.data.data.user.password
        user.birthtime = response.data.data.user.birthtime
        user.gender = response.data.data.user.gender
        user.location = response.data.data.user.location
        user.isActive = response.data.data.user.isActive
        user.isSuperuser = response.data.data.user.isManager
        user.isBlock = response.data.data.user.isBlock
        user.roleId = response.data.data.user.roleId
        user.notifyAboutInfo = response.data.data.user.notifyAboutInfo
        user.orgName = response.data.data.user.orgName
        user.contactTel = response.data.data.user.contactTel
        user.contactName = response.data.data.user.contactName
        user.orgRating = response.data.data.user.orgRating
        user.positiveFeedbackCount =
          response.data.data.user.positiveFeedbackCount
        user.totalFeedbackCount = response.data.data.user.totalFeedbackCount
        user.popularity = response.data.data.user.popularity
        user.deliveryAddresses = response.data.data.user.deliveryAddresses
        user.pickupPoints = response.data.data.user.pickupPoints
        user.account = response.data.data.user.account
        user.cashback = response.data.data.user.cashback
        user.trialAccount = response.data.data.user.trialAccount
        user.userDetails = response.data.data.user.userDetails
        payer.name = response.data.data.user.userDetails?.name
        payer.tel = response.data.data.user.userDetails?.tel
        payer.companyName = response.data.data.user.userDetails?.companyName
        payer.address = response.data.data.user.userDetails?.address
        payer.bank = response.data.data.user.userDetails?.bank
        payer.bik = response.data.data.user.userDetails?.bik
        payer.inn = response.data.data.user.userDetails?.inn
        payer.kpp = response.data.data.user.userDetails?.kpp
        payer.korPay = response.data.data.user.userDetails?.korPay
        payer.pay = response.data.data.user.userDetails?.pay
        payer.type = response.data.data.user.userDetails?.type
        payer.ogrn = response.data.data.user.userDetails?.ogrn
        payer.userId = response.data.data.user.userDetails?.userId
      }
      return response
    } catch (error) {
      console.error(error)
      return error
    }
  }

  //MARK: GET ME
  const restoreSession = async () => {
    const {
      data: { data },
      status,
    } = await api.get('/users/me/')

    if (status === 200) {
      isAuthenticated.value = true

      user.id = data.id
      user.tel = data.tel
      user.avatar.url = data.avatar
      user.firstName = data.firstName
      user.lastName = data.lastName
      user.patronymic = data.patronymic
      user.email = data.email
      user.password = data.password
      user.birthtime = data.birthtime
      user.gender = data.gender
      user.location = data.location
      user.isActive = data.isActive
      user.isSuperuser = data.isManager
      user.isBlock = data.isBlock
      user.roleId = data.roleId
      user.notifyAboutInfo = data.notifyAboutInfo
      user.orgName = data.orgName
      user.contactTel = data.contactTel
      user.contactName = data.contactName
      user.orgRating = data.orgRating
      user.positiveFeedbackCount = data.positiveFeedbackCount
      user.totalFeedbackCount = data.totalFeedbackCount
      user.popularity = data.popularity
      user.deliveryAddresses = data.deliveryAddresses
      user.pickupPoints = data.pickupPoints
      user.account = data.account
      user.cashback = data.cashback
      user.trialAccount = data.trialAccount
      user.userDetails = data.userDetails
      payer.name = data.userDetails?.name
      payer.tel = data.userDetails?.tel
      payer.companyName = data.userDetails?.companyName
      payer.address = data.userDetails?.address
      payer.bank = data.userDetails?.bank
      payer.bik = data.userDetails?.bik
      payer.inn = data.userDetails?.inn
      payer.kpp = data.userDetails?.kpp
      payer.korPay = data.userDetails?.korPay
      payer.pay = data.userDetails?.pay
      payer.type = data.userDetails?.type
      payer.ogrn = data.userDetails?.ogrn
      payer.userId = data.userDetails?.userId
      return true
    }

    return false
  }

  //MARK: UPDATE AVATAR
  const updateAvatar = async () => {
    try {
      const formData = new FormData()

      let avatar: Blob

      if (user.avatar.file != undefined) {
        avatar = user.avatar.file
        formData.append('new_avatar', avatar)
      }

      const response = await api.post(`/users/me/avatars/`, formData)

      if (response.status === 200) {
        user.id = response.data.data.id
        user.tel = response.data.data.tel
        user.avatar.url = response.data.data.avatar
        user.firstName = response.data.data.firstName
        user.lastName = response.data.data.lastName
        user.patronymic = response.data.data.patronymic
        user.email = response.data.data.email
        user.password = response.data.data.password
        user.birthtime = response.data.data.birthtime
        user.gender = response.data.data.gender
        user.location = response.data.data.location
        user.isActive = response.data.data.isActive
        user.isSuperuser = response.data.data.isManager
        user.isBlock = response.data.data.isBlock
        user.roleId = response.data.data.roleId
        user.notifyAboutInfo = response.data.data.notifyAboutInfo
        user.orgName = response.data.data.orgName
        user.contactTel = response.data.data.contactTel
        user.contactName = response.data.data.contactName
        user.orgRating = response.data.data.orgRating
        user.positiveFeedbackCount = response.data.data.positiveFeedbackCount
        user.totalFeedbackCount = response.data.data.totalFeedbackCount
        user.popularity = response.data.data.popularity
        user.deliveryAddresses = response.data.data.deliveryAddresses
        user.pickupPoints = response.data.data.pickupPoints
        user.account = response.data.data.account
        user.cashback = response.data.data.cashback
        user.trialAccount = response.data.data.trialAccount
        user.userDetails = response.data.data.userDetails
        payer.name = response.data.data.userDetails?.name
        payer.tel = response.data.data.userDetails?.tel
        payer.companyName = response.data.data.userDetails?.companyName
        payer.address = response.data.data.userDetails?.address
        payer.bank = response.data.data.userDetails?.bank
        payer.bik = response.data.data.userDetails?.bik
        payer.inn = response.data.data.userDetails?.inn
        payer.kpp = response.data.data.userDetails?.kpp
        payer.korPay = response.data.data.userDetails?.korPay
        payer.pay = response.data.data.userDetails?.pay
        payer.type = response.data.data.userDetails?.type
        payer.ogrn = response.data.data.userDetails?.ogrn
        payer.userId = response.data.data.userDetails?.userId
      }

      user.avatar.isChanged = false
      return response
    } catch (error) {
      console.error(error)
      return error
    }
  }

  //MARK: UPDATE PROFILE
  const updateProfile = async () => {
    try {
      const userData = {
        tel: user.tel,
        first_name: user.firstName,
        last_name: user.lastName,
        patronymic: user.patronymic,
        email: user.email,

        birthtime: user.birthtime,
      }

      const response = await api.put(`/users/me/`, userData)
      if (response.status === 200) {
        user.id = response.data.data.id
        user.tel = response.data.data.tel
        user.avatar.url = response.data.data.avatar
        user.firstName = response.data.data.firstName
        user.lastName = response.data.data.lastName
        user.patronymic = response.data.data.patronymic
        user.email = response.data.data.email
        user.password = response.data.data.password
        user.birthtime = response.data.data.birthtime
        user.gender = response.data.data.gender
        user.location = response.data.data.location
        user.isActive = response.data.data.isActive
        user.isSuperuser = response.data.data.isManager
        user.isBlock = response.data.data.isBlock
        user.roleId = response.data.data.roleId
        user.notifyAboutInfo = response.data.data.notifyAboutInfo
        user.orgName = response.data.data.orgName
        user.contactTel = response.data.data.contactTel
        user.contactName = response.data.data.contactName
        user.orgRating = response.data.data.orgRating
        user.positiveFeedbackCount = response.data.data.positiveFeedbackCount
        user.totalFeedbackCount = response.data.data.totalFeedbackCount
        user.popularity = response.data.data.popularity
        user.deliveryAddresses = response.data.data.deliveryAddresses
        user.pickupPoints = response.data.data.pickupPoints
        user.account = response.data.data.account
        user.cashback = response.data.data.cashback
        user.trialAccount = response.data.data.trialAccount
        user.userDetails = response.data.data.userDetails
        payer.name = response.data.data.userDetails?.name
        payer.tel = response.data.data.userDetails?.tel
        payer.companyName = response.data.data.userDetails?.companyName
        payer.address = response.data.data.userDetails?.address
        payer.bank = response.data.data.userDetails?.bank
        payer.bik = response.data.data.userDetails?.bik
        payer.inn = response.data.data.userDetails?.inn
        payer.kpp = response.data.data.userDetails?.kpp
        payer.korPay = response.data.data.userDetails?.korPay
        payer.pay = response.data.data.userDetails?.pay
        payer.type = response.data.data.userDetails?.type
        payer.ogrn = response.data.data.userDetails?.ogrn
        payer.userId = response.data.data.userDetails?.userId
      }
      return response
    } catch (error) {
      console.error(error)
      return error
    }
  }

  //MARK: CHANGE PASSWORD
  const changePass = async (oldPass: string, newPass: string) => {
    try {
      const userData = {
        password: oldPass,
        new_password: newPass,
      }

      const response = await api.put(`/users/me/password/`, userData)

      if (response.status === 200) {
        return response
      }
    } catch (error) {
      console.error(error)
      return error
    }
  }

  //MARK: CHANGE PAYER
  const changePayer = async () => {
    console.log(payer)
    try {
      const userData = {
        name: payer.name,
        tel: payer.tel,
        company_name: payer.companyName,
        address: payer.address,
        pay: payer.pay,
        inn: payer.inn,
        kpp: payer.kpp,
        ogrn: payer.ogrn,
        bank: payer.bank,
        bik: payer.bik,
        kor_pay: payer.korPay,
        user_id: user.id,
      }

      const response = await api.post(`/users/me/details/`, userData)

      if (response.status === 200) {
        user.userDetails = response.data.data
        payer.name = response.data.data?.name
        payer.tel = response.data.data?.tel
        payer.companyName = response.data.data?.companyName
        payer.address = response.data.data?.address
        payer.bank = response.data.data?.bank
        payer.bik = response.data.data?.bik
        payer.inn = response.data.data?.inn
        payer.kpp = response.data.data?.kpp
        payer.korPay = response.data.data?.korPay
        payer.pay = response.data.data?.pay
        payer.type = response.data.data?.type
        payer.ogrn = response.data.data?.ogrn
        payer.userId = response.data.data?.userId
      }

      return response
    } catch (error) {
      console.error(error)
      return error
    }
  }

  //MARK: GET OS
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

  //MARK: TARIFF FEE
  const tariffFee = async (amount: number, returnUrl: string, type: string) => {
    try {
      const userData = {
        amount: amount * 100,
        return_url: `https://cp.axas.store${returnUrl}`,
        os: getOS(),
      }

      const response = await api.post(
        `/users/me/tariff-fee/?payment_method=${type}`,
        userData,
      )

      if (response.status === 200) {
        tariffPayment.value = response.data.data
      }

      return response
    } catch (error) {
      console.error(error)
      return error
    }
  }

  //MARK: LOGOUT
  const logout = async () => {
    localStorage.removeItem('token')
    isAuthenticated.value = false

    try {
      user.id = 0
      user.avatar.url = null
      user.avatar.file = null
      user.avatar.isChanged = null
      user.tel = null
      user.firstName = null
      user.lastName = null
      user.patronymic = null
      user.email = null
      user.password = null
      user.birthtime = null
      user.gender = null
      user.location = null
      user.isActive = true
      user.isSuperuser = false
      user.isManager = false
      user.isBlock = false
      user.roleId = null
      user.notifyAboutInfo = false
      user.orgName = null
      user.contactTel = null
      user.contactName = null
      user.orgRating = null
      user.positiveFeedbackCount = null
      user.totalFeedbackCount = null
      user.popularity = null
      user.deliveryAddresses = []
      user.pickupPoints = []
      user.account = null
      user.trialAccount = null
      user.cashback = null
      user.userDetails = null

      // const response = await api.post('/sign-out/', {})
      //   if (response.status === 200) {
      //     localStorage.removeItem('token')
      //     isAuthenticated.value = false
      //     user.id = null
      //     user.tel = null
      //     user.avatar.url = null
      //     user.firstName = null
      //     user.lastName = null
      //     user.patronymic = null
      //     user.email = null
      //     user.password = null
      //     user.birthtime = null
      //     user.gender = null
      //     user.address = null
      //     user.isActive = null
      //     user.isSuperuser = null
      //     user.isBlock = null
      //     user.roleId = null
      //     user.notifyAboutInfo = null
      //     user.orgName = null
      //     user.contactTel = null
      //     user.contactName = null
      //     user.orgRating = null
      //     user.positiveFeedbackCount = null
      //     user.totalFeedbackCount = null
      //     user.popularity = null
      //     user.deliveryAddresses = []
      //     user.pickupPoints = []
      //   }
      //   return response.status
    } catch (error) {
      console.error(error)
      //   return error.response.status
    }
    return 200
  }

  return {
    user,
    payer,
    tariffPayment,
    isAuthenticated,
    restoreSession,
    registration,
    activate,
    signIn,
    updateAvatar,
    updateProfile,
    changePass,
    changePayer,
    tariffFee,
    logout,
  }
})
