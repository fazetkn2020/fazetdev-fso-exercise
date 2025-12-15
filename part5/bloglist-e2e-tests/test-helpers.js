/**
 * Helper functions for bloglist E2E tests
 */

/**
 * Logs in a user with given credentials
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {Object} credentials - User credentials
 * @param {string} credentials.username - Username
 * @param {string} credentials.password - Password
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
 */
const logout = async (page) => {
  await page.getByRole('button', { name: 'logout' }).click()
}

module.exports = {
  login,
  createBlog,
  logout
}
