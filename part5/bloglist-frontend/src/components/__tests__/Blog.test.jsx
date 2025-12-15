import { render, screen } from '@testing-library/react'
import Blog from '../Blog'

describe('<Blog />', () => {
  const blog = {
    title: 'Test Blog Title',
    author: 'Test Author',
    url: 'http://test.com',
    likes: 5,
    user: {
      name: 'Test User',
      id: '123'
    },
    id: 'blog123'
  }

  const mockUpdateBlog = vi.fn()
  const mockDeleteBlog = vi.fn()
  const mockUser = { id: '123', name: 'Test User' }

  test('renders blog title and author by default', () => {
    render(
      <Blog 
        blog={blog} 
        updateBlog={mockUpdateBlog} 
        deleteBlog={mockDeleteBlog}
        user={mockUser}
      />
    )

    // Check that title and author are rendered
    const titleElement = screen.getByText('Test Blog Title')
    const authorElement = screen.getByText('Test Author')
    
    expect(titleElement).toBeDefined()
    expect(authorElement).toBeDefined()
  })

  test('does not render URL or likes by default', () => {
    render(
      <Blog 
        blog={blog} 
        updateBlog={mockUpdateBlog} 
        deleteBlog={mockDeleteBlog}
        user={mockUser}
      />
    )

    // URL should not be visible
    const urlElement = screen.queryByText('http://test.com')
    expect(urlElement).toBeNull()

    // Likes should not be visible  
    const likesElement = screen.queryByText('likes 5')
    expect(likesElement).toBeNull()
  })
})
