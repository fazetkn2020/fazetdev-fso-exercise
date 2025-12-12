const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null
  return blogs.reduce((prev, current) => (current.likes > prev.likes ? current : prev))
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  const count = {}
  blogs.forEach(blog => {
    count[blog.author] = (count[blog.author] || 0) + 1
  })
  const maxAuthor = Object.keys(count).reduce((a, b) => count[a] > count[b] ? a : b)
  return { author: maxAuthor, blogs: count[maxAuthor] }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  const likesCount = {}
  blogs.forEach(blog => {
    likesCount[blog.author] = (likesCount[blog.author] || 0) + blog.likes
  })
  const maxAuthor = Object.keys(likesCount).reduce((a, b) => likesCount[a] > likesCount[b] ? a : b)
  return { author: maxAuthor, likes: likesCount[maxAuthor] }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
