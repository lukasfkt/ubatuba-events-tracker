export interface Token {
  access_token: string
  refresh_token: string
}

export interface Event {
  id: number
  title: string
  description: string
  location: string
  date: string
  category: string
  imageUrl: string
}

export enum CategoryEnum {
  MUSIC = 'Music',
  SPORTS = 'Sports',
  EDUCATION = 'Education',
}
