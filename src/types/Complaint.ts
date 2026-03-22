import type { Profile } from "./Profile"

interface Complaint {
  id: number
  title: string | null
  body: string | null
  category: number | null
  important: boolean | null
  isHidden: number | null
  source: string | null
  created: number | null
  image: string | null
  user: Profile | null
}

export type { Complaint }
