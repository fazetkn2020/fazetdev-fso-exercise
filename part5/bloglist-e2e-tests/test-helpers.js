/**
 * Helper functions for bloglist E2E tests
 */

/**
 * Logs in a user with given credentials
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} credentials - User credentials
 * @param {string} credentials.username - Username
 * @param {string} credentials.password - Password
 * @returns {Promise<void>}
 */
const login = async (page, { username, password }) => {
  await page.getByRole('textbox', { name: /username/i }).fill(username)
  await page.getByRole('textbox', { name: /password/i }).fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

/**
 * Creates a new blog
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} blog - Blog details
 * @param {string} blog.title - Blog title
 * @param {string} blog.author - Blog author
 * @param {string} blog.url - Blog URL
 * @returns {Promise<void>}
 */
const createBlog = async (page, { title, author, url }) => {
  await page.getByRole('button', { name: 'create new blog' }).click()
  await page.getByLabel('title:').fill(title)
  await page.getByLabel('author:').fill(author)
  await page.getByLabel('url:').fill(url)
  await page.getByRole('button', { name: 'create' }).click()
}

/**
 * Logs out the current user
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<void>}
 */
const logout = async (page) => {
  await page.getByRole('button', { name: 'logout' }).click()
}

/**
 * Creates a user via API (for test setup)
 * @param {import('@playwright/test').APIRequestContext} request - Playwright request context
 * @param {Object} user - User details
 * @param {string} user.name - User's name
 * @param {string} user.username - Username
 * @param {string} user.password - Password
 * @returns {Promise<Object>} - Created user object
 */
const createUser = async (request, { name, username, password }) => {
  const response = await request.post('http://localhost:3003/api/users', {
    data: { name, username, password }
  })
  return await response.json()
}

/**
 * Resets the backend database
 * @param {import('@playwright/test').APIRequestContext} request - Playwright request context
 * @returns {Promise<void>}
 */
const resetDatabase = async (request) => {
  await request.post('http://localhost:3003/api/testing/reset')
}

module.exports = {
  login,
  createBlog,
  logout,
  createUser,
  resetDatabase
}
