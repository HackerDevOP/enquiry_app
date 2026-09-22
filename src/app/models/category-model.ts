export interface ICategoryRes {
  error: string[]
  result: boolean
  data: ICategory[]
  message: string
}

export interface ICategory {
  categoryId: number
  categoryName: string
  isActive: boolean
}
