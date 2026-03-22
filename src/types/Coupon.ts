interface Coupon {
  id: number
  storeId: number | null
  created: number | null
  used: boolean | null
  percent: number | null
  money: number | null
  name: string | null
  start: number | null
  stop: number | null
  usedCounter: number | null
}

export type { Coupon }
