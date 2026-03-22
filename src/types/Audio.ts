interface Audio {
  id: number
  title: string | null
  description: string | null
  lat: number | null
  lon: number | null
  audios: [Audio | null]
  image: string | null
  created: number | null
}

interface Audio {
  id: number
  link: string
}

export type { Audio }
