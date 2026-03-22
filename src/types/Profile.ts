interface Profile {
  id: number
  avatar: {
    url: string | null
    file: Blob | null
    isChanged?: boolean | null
  }
  tel: string | null
  firstName: string | null
  lastName: string | null
  patronymic: string | null
  email: string | null
  password: string | null
  birthtime: number | null
  gender: number | null
  location: string | null
  device: Device | null
  isActive: boolean | null
  isSuperuser: boolean | null
  created: number | null
  deleted: number | null
  rating: number | null
  countFeedbackOrder:number | null
  lastVisited: number | null
  lastVisitedHuman: string | null
  isOnline: boolean | null
  categoryID:number | null 
  category:number | null
  tg: string | null
  isServicer: boolean | null
  inBlacklist: boolean | null
  inWhitelist: boolean | null
  isBusiness: boolean | null
  showTel: boolean | null
  region: string | null
  site: string | null
  experience: string | null
  companyInfo: string | null
  inSubscriptions:  boolean | null
  lat: number | null 
  lon: number | null 
  country: string | null
  status: string | null
  subscriptionsCount: number | null
  subscribersCount: number | null
  profileCover: string | null
  isDatingProfile: boolean | null
}

interface Device {
  id: number | null
  userAgent: string | null
  ipAddress: string | null
  xRealIp: string | null
  acceptLanguage: string | null
  created: number | null
  detectedOS: string | null
}
export type { Profile, Device }
