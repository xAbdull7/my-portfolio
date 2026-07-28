import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from '@/components/sections/Header'
import { ThemeProvider } from 'next-themes'

// Mocks
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'dark',
    setTheme: jest.fn(),
  }),
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

// Mock profile data
jest.mock('@/data/profile', () => ({
  profileData: {
    name: 'Test Name',
    title: 'Test Title',
    subtitle: 'Test Subtitle',
  }
}))

describe('Header Component', () => {
  it('renders user information correctly', () => {
    render(<Header />)
    
    expect(screen.getByText('Test Name')).toBeInTheDocument()
    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
  })

  it('renders all action buttons', () => {
    render(<Header />)
    
    expect(screen.getByLabelText('Download Resume')).toBeInTheDocument()
    expect(screen.getByLabelText('View Projects')).toBeInTheDocument()
    expect(screen.getByLabelText('Contact Me')).toBeInTheDocument()
    expect(screen.getByLabelText('Toggle Theme')).toBeInTheDocument()
  })
})
