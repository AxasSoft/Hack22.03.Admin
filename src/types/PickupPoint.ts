interface PickupPoint {
  id: number
  address: string | null
  entrance: string | null
  stage: string | null
  room: string | null
  lat: number | null
  lon: number | null
  comment: string | null
  schedule: string | null
  expiring: number | null
}

export type { PickupPoint }
