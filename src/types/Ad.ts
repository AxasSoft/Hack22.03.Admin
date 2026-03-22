import type { AttributeValue } from './Attribute'

interface Ad {
  id: number
  title: string | null
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
  images: [ImageAd | null]
  attrValues: [AttributeValue | null]
  imagesUrls: [string | null]
}

interface ImageAd {
  id: number
  link: string
}

export type { Ad }
