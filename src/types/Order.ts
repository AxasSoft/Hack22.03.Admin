import type { PickupPoint } from './PickupPoint'
import type { Image, Product } from './Restaurant'
import type { Profile } from './Profile'

interface Order {
  id: number
  created: number | null
  deliveryAddress: string | null
  deliveryEntrance: string | null
  deliveryStage: string | null
  deliveryIntercom: string | null
  deliveryRoom: string | null
  customerComment: string | null
  pickupPoint: PickupPoint | null
  deliveryMethod: number | null
  positions: Position[] | null
  status: number | null
  status_date: number | null
  deliveryAmount: number | null
  deliveryTime: number | null
  payed: number | null
  payType: number | null
  outId: string | null
  payLink: string | null
  isFire: boolean | null
  client: Client | null
  os: string | null
  ofdUrl: string | null
  feedback: string | null
  rate: number | null
  images: Image[] | null
  cancelComment: string | null
  managerComment: string | null
  customer: Profile | null
  manager: Profile | null
}

interface Position {
  id: number | null
  qty: number | null
  actualPrice: number | null
  status: number | null
  product: Product | null
  options: string | null
  attachments: Attachment[] | null
}

interface Attachment {
  id: number
  url: string
}

interface Client {
  id: number
  name: string | null
  email: string | null
  tel: string | null
}

enum OrderStatus {
  'Новый',
  'В работе',
  'Собирается',
  'Доставляется',
  'Доставлен',
  'Завершен',
  'Отклонён',
}
export { OrderStatus }
export type { Order, Position, Attachment, Client }
