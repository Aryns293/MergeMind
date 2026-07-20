import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FloatingAssistant } from '@/components/ui/floating-assistant'

// Mock the framer-motion library to avoid animation issues in tests
vi.mock('framer-motion', () => {
  return {
    motion: {
      div: ({ children, whileHover, whileTap, initial, animate, exit, transition, ...props }: any) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: any) => <>{children}</>,
  }
})

// Mock next/navigation
vi.mock('next/navigation', () => {
  return {
    usePathname: () => '/dashboard',
  }
})

// Mock BorderBeam
vi.mock('@/components/magicui/border-beam', () => ({
  BorderBeam: () => <div data-testid="border-beam" />,
}))

describe('FloatingAssistant Component', () => {
  beforeEach(() => {
    // Clear localStorage to prevent state leaking between tests
    localStorage.clear()
  })

  it('renders the toggle button initially', () => {
    render(<FloatingAssistant />)
    // The button should be visible
    const toggleButton = screen.getByRole('button')
    expect(toggleButton).toBeInTheDocument()
  })

  it('opens the assistant and shows the correct context message for dashboard', () => {
    render(<FloatingAssistant />)
    
    // Click the toggle button to open
    const toggleButton = screen.getByRole('button')
    fireEvent.click(toggleButton)

    // Should display the header
    expect(screen.getByText('MergeMind AI')).toBeInTheDocument()
    
    // Should display the dashboard contextual message
    expect(screen.getByText(/Welcome to your Dashboard/i)).toBeInTheDocument()
    
    // The 'Got it' button should be present
    expect(screen.getByRole('button', { name: /got it/i })).toBeInTheDocument()
  })

  it('closes the assistant when "Got it" is clicked', () => {
    render(<FloatingAssistant />)
    
    // Open (if not already open, but we just cleared localStorage so it should be closed)
    // Find the toggle button which contains the Info icon (we'll just use the first button if there is only one)
    fireEvent.click(screen.getByRole('button'))
    expect(screen.getByText('MergeMind AI')).toBeInTheDocument()
    
    // Close using Got it button
    const gotItButton = screen.getByRole('button', { name: /got it/i })
    fireEvent.click(gotItButton)
    
    // Header should not be in the document anymore
    expect(screen.queryByText('MergeMind AI')).not.toBeInTheDocument()
  })
})
