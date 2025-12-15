import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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
    const likesElement = screen.queryByText('likes', { exact: false })
    expect(likesElement).toBeNull()
  })

  test('shows URL and likes when view button is clicked', async () => {
    render(
      <Blog 
        blog={blog} 
        updateBlog={mockUpdateBlog} 
        deleteBlog={mockDeleteBlog}
        user={mockUser}
      />
    )

    // URL and likes should not be visible initially
    expect(screen.queryByText('http://test.com')).toBeNull()
    expect(screen.queryByText('likes', { exact: false })).toBeNull()

    // Click the view button
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    // URL should now be visible
    expect(screen.getByText('http://test.com')).toBeDefined()
    
    // Likes should be visible (check for "likes" text and the number 5)
    expect(screen.getByText('likes', { exact: false })).toBeDefined()
    expect(screen.getByText('5')).toBeDefined()
  })

  test('calls updateBlog twice when like button is clicked twice', async () => {
    render(
      <Blog 
        blog={blog} 
        updateBlog={mockUpdateBlog} 
        deleteBlog={mockDeleteBlog}
        user={mockUser}
      />
    )

    // Click view button to show details
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    // Click like button twice
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    // Check that updateBlog was called twice
    expect(mockUpdateBlog.mock.calls).toHaveLength(2)
    
    // Check that correct data was sent
    expect(mockUpdateBlog.mock.calls[0][0]).toBe(blog.id)
    expect(mockUpdateBlog.mock.calls[0][1].likes).toBe(6) // 5 + 1
    
    expect(mockUpdateBlog.mock.calls[1][0]).toBe(blog.id)
    expect(mockUpdateBlog.mock.calls[1][1].likes).toBe(6) // Still 6 because blog.likes hasn't changed
  })
})
