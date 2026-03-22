import type { AttributeValue } from './Attribute'

interface Excursion {
  id: number
  name: string | null
  description: string | null
  oldPrice: number | null
  price: number | null
  tag: string | null
  orderNum: number | null
  categoryID: number | null
  weight: number | null
  isSpecial: boolean | null
  inStock: number | null
  article: number | null
  barcode: string | null
  thumbnail: string | null
  rating: number | null
  popularity: number | null
  inFavorites: boolean | null
  positiveFeedbackCount: number | null
  totalFeedbackCount: number | null
  images: [Image | null]
  attrValues: [AttributeValue | null]
  imagesUrls: [string | null]
  showDelete: boolean | null
}

interface Image {
  id: number
  image: string
}

interface ProductImage {
  id: number
  image: Image
  imageUrl: string
  file: File | null
}

interface ExcursionGroup {
    started: number | null
    ended: number | null
    id: number
    status: string | null
    excursionID: number | null
    excursionName: string | null
    maxGroupSize: number | null
    availableForBooking: number | null
    currentMembers: number | null
    members: [Member | null]
    showDelete: boolean | undefined
}

interface Member {
    fullName: string | null
    isAdult: boolean | null
    phone: number 
}


export type { Excursion, Image, ProductImage,ExcursionGroup }
