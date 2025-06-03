export interface Participant {
  identity: string
  department: string
  name: string
  food: string
  companion: number
}
export interface Header {
  title: string
  value: string
  width: string
  align?: 'center'
  sortable?: boolean
}
export interface ActivityInfo {
  name: string
  period: string
  location: string
}

export type MessageColor = 'error' | 'success'

export interface Message {
  text: string
  color: MessageColor
}
