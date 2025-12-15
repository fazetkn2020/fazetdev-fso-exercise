import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async () => {
    // Send user ID as string (backend expects this based on exercise example)
    const userToSend = blog.user?.id || blog.user?._id || blog.user

    const blogToUpdate = {
      user: userToSend,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }

    updateBlog(blog.id, blogToUpdate)
  }

  const handleDelete = () => {
    if (deleteBlog) {
      deleteBlog(blog.id)
    }
  }

  const getUserName = () => {
    if (!blog.user) return ''
    if (typeof blog.user === 'object') return blog.user.name
    return blog.user // might be just ID string
  }

  // Check if the current user is the creator of this blog
  const isBlogCreator = () => {
    if (!user || !blog.user) return false

    const currentUserId = user.id || user._id
    const blogUserId = blog.user?.id || blog.user?._id || blog.user

    return currentUserId === blogUserId
  }

  return (
    <div className="blog" style={blogStyle}>
      <div className="blog-summary">
        <span className="blog-title">{blog.title}</span>{' '}
        <span className="blog-author">{blog.author}</span>
        <button className="toggle-visibility" onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div className="blog-details">
          <div className="blog-url">{blog.url}</div>
          <div className="blog-likes">
            likes <span className="likes-count">{blog.likes}</span>
            <button className="like-button" onClick={handleLike}>like</button>
          </div>
          <div className="blog-user">{getUserName()}</div>
          {isBlogCreator() && (
            <div>
              <button 
                className="delete-button" 
                onClick={handleDelete} 
                style={{ background: 'red', color: 'white' }}
              >
                delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog
