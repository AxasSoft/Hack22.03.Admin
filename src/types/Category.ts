interface Category {
  id: number
  name: string | null
  subcategories: Category[]
}

export type { Category }
