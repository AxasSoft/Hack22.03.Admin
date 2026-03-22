interface App {
  id: number
  name: string | null
  description: string | null
  primaryColor: string | null
  secondaryColor: string | null
  textColor: string | null
  secondaryTextColor: string | null
  bgColor: string | null
  secondaryBgColor: string | null
  hasPickupPoints: boolean | null
  sectionSettings: string | null
  userID: number | null
  tariff: Tariff | null
  tariffNext: number | null
  isBlocked: boolean | null
  imgIcon: string | null
  imgScreen: string | null
  goodsCat: GoodsCat | null
  hideOutOfStock: boolean | null
}

interface SectionSetting {
  id: number
  icon: string
  name: string
  techName: string
  humanName: string
  changeName: boolean
  view: object
  position: number | null
  description: string | null
}

interface Tariff {
  id: number
  created: number | null
  name: string | null
  payment: number | null
  maxProduct: number | null
  maxOrder: number | null
  maxManager: number | null
  maxPromo: number | null
  maxPickupPoint: number | null
  importProducts: boolean | null
  feedbackEnabled: boolean | null
  productsRecommendation: boolean | null
  targetPush: boolean | null
  interfaceChange: boolean | null
  selfDelivery: boolean | null
  cmsIntegration: boolean | null
  tariffPrivate: number | null
}

interface GoodsCat {
  id: number
  name: string
  icon: string
}

export type { App, SectionSetting, Tariff, GoodsCat }
