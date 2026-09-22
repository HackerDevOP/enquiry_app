export interface IEnquiryRes {
  error: string[]
  result: boolean
  data: IEnquiry[]
  message: string
}

export interface IEnquiry {
  enquiryId: number
  customerName: string
  customerEmail: string
  customerPhone: string
  message: string
  categoryId: number
  statusId: number
  enquiryType: string
  isConverted: boolean
  enquiryDate: string
  followUpDate: string
  feedback?: string
}
