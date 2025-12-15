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
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes}
            <button onClick={handleLike}>like</button>
          </div>
          <div>{getUserName()}</div>
          {isBlogCreator() && (
            <div>
              <button onClick={handleDelete} style={{ background: 'red', color: 'white' }}>
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
