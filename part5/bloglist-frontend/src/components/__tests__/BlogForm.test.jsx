import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from '../BlogForm'

describe('<BlogForm />', () => {
  test('calls createBlog with correct details when form is submitted', async () => {
    const mockCreateBlog = vi.fn()
    
    render(<BlogForm createBlog={mockCreateBlog} />)

    // Fill out the form
    const user = userEvent.setup()
    
    // Get inputs by their labels
    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')
    const submitButton = screen.getByText('create')

    await user.type(titleInput, 'Test Blog Title')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'http://test.com')
    await user.click(submitButton)

    // Check that createBlog was called once
    expect(mockCreateBlog.mock.calls).toHaveLength(1)
    
    // Check that createBlog was called with correct data
    expect(mockCreateBlog.mock.calls[0][0]).toEqual({
      title: 'Test Blog Title',
      author: 'Test Author',
      url: 'http://test.com'
    })
  })

  test('form fields are cleared after submission', async () => {
    const mockCreateBlog = vi.fn()
    
    render(<BlogForm createBlog={mockCreateBlog} />)

    // Fill out the form
    const user = userEvent.setup()
    
    const titleInput = screen.getByLabelText('title:')
    const authorInput = screen.getByLabelText('author:')
    const urlInput = screen.getByLabelText('url:')
    const submitButton = screen.getByText('create')

    await user.type(titleInput, 'Test Blog Title')
    await user.type(authorInput, 'Test Author')
    await user.type(urlInput, 'http://test.com')
    await user.click(submitButton)

    // Check that form fields are cleared
    expect(titleInput.value).toBe('')
    expect(authorInput.value).toBe('')
    expect(urlInput.value).toBe('')
  })
})
