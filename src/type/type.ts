export interface Participant {
  id: string
  department: string
  name: string
}
export interface Header {
  title: string
  value: string
  width: string
  align?: 'center'
}
export interface ActivityInfo {
  name: string
  period: string
  location: string
}
