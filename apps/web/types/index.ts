export interface Token {
  access_token: string
  refresh_token: string
}

export interface Event {
  id: number
  title: string
  description: string
  location: string
  date: Date
  category: CategoryEnum
  imageUrl?: string
}

export type CreateEventDTO = Omit<Event, 'id'>

export type UpdateEventDTO = Partial<CreateEventDTO>

export enum CategoryEnum {
  MUSIC = 'Music',
  SPORTS = 'Sports',
  EDUCATION = 'Education',
}
