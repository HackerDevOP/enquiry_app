export interface IStatusRes {
  error: string[]
  result: boolean
  data: IStatus[]
  message: string
}

export interface IStatus {
  statusId: number
  statusName: string
  isActive: boolean
}
