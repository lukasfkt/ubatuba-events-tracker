import { renderWithQueryClient } from '@/tests/test-utils'
import { fireEvent, screen, waitFor } from '@testing-library/react'
import EventsPage from '@/app/events/page'

// Mock para corrigir useRouter e usePathname
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
}))

describe('EventsPage', () => {
  it('should open Create Event dialog when clicking the Create Event button', async () => {
    renderWithQueryClient(<EventsPage />)

    const createButton = screen.getByTitle('Create Event')
    fireEvent.click(createButton)

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /Create Event/i }),
      ).toBeInTheDocument()
    })
  })
})
