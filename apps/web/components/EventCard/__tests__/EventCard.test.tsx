import { renderWithQueryClient } from '@/tests/test-utils'
import { screen, fireEvent, waitFor } from '@testing-library/react'
import { EventCard } from '@/components/EventCard'
import { CategoryEnum } from '@/types'
import React from 'react'

describe('EventCard interactions', () => {
  const mockEvent = {
    id: 1,
    title: 'Surf Championship',
    description: 'Annual surfing competition.',
    location: 'Praia Grande Beach',
    date: new Date('2025-06-15T08:00:00Z'),
    category: CategoryEnum.SPORTS,
    imageUrl: '',
  }

  it('shows popover when clicking the options button', async () => {
    renderWithQueryClient(
      <EventCard
        eventDetails={mockEvent}
        ref={() => {}}
        shouldObserve={false}
      />,
    )

    const optionsButton = screen.getByRole('button', { name: '' })
    fireEvent.click(optionsButton)

    await waitFor(() => {
      expect(screen.getByText(/Edit/i)).toBeInTheDocument()
      expect(screen.getByText(/Delete/i)).toBeInTheDocument()
    })
  })

  it('opens Edit Event dialog when clicking Edit', async () => {
    renderWithQueryClient(
      <EventCard
        eventDetails={mockEvent}
        ref={() => {}}
        shouldObserve={false}
      />,
    )

    const optionsButton = screen.getByRole('button', { name: '' })
    fireEvent.click(optionsButton)

    const editButton = await screen.findByText(/Edit/i)
    fireEvent.click(editButton)

    await waitFor(() => {
      expect(screen.getByText(/Edit Event/i)).toBeInTheDocument()
    })
  })

  it('opens Confirmation dialog when clicking Delete', async () => {
    renderWithQueryClient(
      <EventCard
        eventDetails={mockEvent}
        ref={() => {}}
        shouldObserve={false}
      />,
    )

    const optionsButton = screen.getByRole('button', { name: '' })
    fireEvent.click(optionsButton)

    const deleteButton = await screen.findByText(/Delete/i)
    fireEvent.click(deleteButton)

    await waitFor(() => {
      expect(screen.getByText(/Delete event/i)).toBeInTheDocument()
      expect(
        screen.getByText(/Are you sure you want to delete this event/i),
      ).toBeInTheDocument()
    })
  })
})
