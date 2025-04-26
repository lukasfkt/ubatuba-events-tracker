import { create } from 'zustand'

import { handleErroMessage } from '@/lib/utils'
import { api } from '@/services/axios'
import type { Event } from '@/types'

interface FetchEventsParams {
  page: number
  limit?: number
  search?: string
}

interface useEventsProps {
  fetchEvents: (params: FetchEventsParams) => Promise<Event[]>
}

export const useEvents = create<useEventsProps>(() => ({
  fetchEvents: async (params: FetchEventsParams) => {
    const { limit = 10, page = 1, search = '' } = params
    try {
      const { data } = await api.get('/events/', {
        params: { limit, page, search },
      })
      return data
    } catch (error) {
      handleErroMessage(error)
      return []
    }
  },
}))
