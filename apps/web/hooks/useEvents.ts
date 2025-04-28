import qs from 'qs'
import { create } from 'zustand'

import { api } from '@/services/axios'

import { handleErroMessage, showToast } from '@/lib/utils'

import type { CreateEventDTO, Event } from '@/types'

interface FetchEventsParams {
  page: number
  limit?: number
  search?: string
  categories?: string[]
}

interface useEventsProps {
  fetchEvents: (params: FetchEventsParams) => Promise<Event[]>
  getEventById: (id: number) => Promise<Event>

  createEvent: (event: CreateEventDTO) => Promise<Event | null>

  deleteEvent: (id: number) => Promise<boolean>

  updateEvent: (id: number, event: CreateEventDTO) => Promise<Event | null>
}

export const useEvents = create<useEventsProps>(() => ({
  fetchEvents: async (params: FetchEventsParams) => {
    const { limit = 10, page = 1, search = '', categories = [] } = params

    try {
      const { data } = await api.get('/events/', {
        params: { limit, page, search, categories },
        paramsSerializer: (params) => {
          return qs.stringify(params, { arrayFormat: 'repeat' })
        },
      })
      return data
    } catch (error) {
      handleErroMessage(error)
      return []
    }
  },

  getEventById: async (id: number) => {
    try {
      const { data } = await api.get(`/events/${id}`)
      return data
    } catch (error) {
      handleErroMessage(error)
      return null
    }
  },

  createEvent: async (event: CreateEventDTO) => {
    try {
      const { data } = await api.post<Event>('/events/', event)
      showToast('Event created successfully', 'success')
      return data
    } catch (error) {
      handleErroMessage(error)
      return null
    }
  },

  deleteEvent: async (id: number) => {
    try {
      const { data } = await api.delete(`/events/${id}`)
      if (data?.deleted) {
        showToast('Event deleted successfully', 'success')
        return true
      }
      showToast('Event not deleted', 'error')
      return false
    } catch (error) {
      handleErroMessage(error)
      return false
    }
  },

  updateEvent: async (id: number, event: CreateEventDTO) => {
    try {
      const { data } = await api.put<Event>(`/events/${id}`, event)
      showToast('Event updated successfully', 'success')
      return data
    } catch (error) {
      handleErroMessage(error)
      return null
    }
  },
}))
