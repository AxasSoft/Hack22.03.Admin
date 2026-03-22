export interface NewStore {
  name: string | null
  icon: {
    url: string | null
    file: Blob | null
    isChanged?: boolean | null
  }
  splash: {
    url: string | null
    file: FormData[] | null
    isChanged?: boolean | null
  }
}
