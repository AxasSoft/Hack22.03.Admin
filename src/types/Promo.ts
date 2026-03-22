import type { Ad } from './Ad'
import type { Category } from './Category'
import type { Article } from './Article'

interface Promo {
  id: number
  name: string | null
  link: string | null
  orderId: Ad | null
  subcategoryId: Category | null
  infoId: Article | null
}

export type { Promo }
