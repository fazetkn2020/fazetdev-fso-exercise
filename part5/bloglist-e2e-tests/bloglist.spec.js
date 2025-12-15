const { test, expect, describe, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Test User',
        username: 'testuser',
        password: 'testpassword'
      }
    })

    await page.goto('http://localhost:5173')
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('testuser')
      await page.getByTestId('password').fill('testpassword')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Test User logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByTestId('title').fill('Playwright blog')
      await page.getByTestId('author').fill('E2E Tester')
      await page.getByTestId('url').fill('https://example.com')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Playwright blog E2E Tester')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      // Create a blog first
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('title').fill('Likeable blog')
      await page.getByTestId('author').fill('Tester')
      await page.getByTestId('url').fill('http://example.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Likeable blog Tester')).toBeVisible()

      // Show blog details
      await page.getByRole('button', { name: 'view' }).click()

      // Initial likes should be 0
      await expect(page.getByText('likes 0')).toBeVisible()

      // Like the blog
      await page.getByRole('button', { name: 'like' }).click()

      // Likes should increase
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('the user who created a blog can delete it', async ({ page }) => {
      // Create a blog first
      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByTestId('title').fill('Blog to be deleted')
      await page.getByTestId('author').fill('Delete Tester')
      await page.getByTestId('url').fill('http://example.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Blog to be deleted Delete Tester')).toBeVisible()

      // Open blog details
      await page.getByRole('button', { name: 'view' }).click()

      // Handle confirmation dialog
      page.on('dialog', async dialog => {
        await dialog.accept()
      })

      // Click delete
      await page.getByRole('button', { name: 'delete' }).click()

      // Blog should be removed from the list
      await expect(
        page.getByText('Blog to be deleted Delete Tester')
      ).not.toBeVisible()
    })

    test('only the user who added the blog sees the delete button', async ({ page, request }) => {
      // Create a blog as first user
      await page.getByRole('button', { name: 'new blog' }).click()

      await page.getByTestId('title').fill('Private blog')
      await page.getByTestId('author').fill('Owner User')
      await page.getByTestId('url').fill('http://example.com')
      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Private blog Owner User')).toBeVisible()

      // Log out first user
      await page.getByRole('button', { name: 'logout' }).click()

      // Create second user
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Another User',
          username: 'anotheruser',
          password: 'password123'
        }
      })

      // Log in as second user
      await page.getByTestId('username').fill('anotheruser')
      await page.getByTestId('password').fill('password123')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Another User logged in')).toBeVisible()

      // Open blog details
      await page.getByRole('button', { name: 'view' }).click()

      // Delete button should NOT be visible
      await expect(
        page.getByRole('button', { name: 'delete' })
      ).not.toBeVisible()
    })

    test('blogs are ordered according to likes, most liked first', async ({ page }) => {
      // Helper to create blog
      const createBlog = async (title, author, url) => {
        await page.getByRole('button', { name: 'new blog' }).click()
        await page.getByTestId('title').fill(title)
        await page.getByTestId('author').fill(author)
        await page.getByTestId('url').fill(url)
        await page.getByRole('button', { name: 'create' }).click()
        await expect(page.getByText(`${title} ${author}`)).toBeVisible()
      }

      // Create blogs
      await createBlog('First Blog', 'Author1', 'http://first.com')
      await createBlog('Second Blog', 'Author2', 'http://second.com')
      await createBlog('Third Blog', 'Author3', 'http://third.com')

      // Helper to like a blog N times
      const likeBlog = async (title, times) => {
        const blog = page.getByText(title).locator('..') // parent container
        await blog.getByRole('button', { name: 'view' }).click()
        for (let i = 0; i < times; i++) {
          await blog.getByRole('button', { name: 'like' }).click()
          await page.waitForTimeout(500) // small wait to allow UI to update
        }
      }

      // Give likes
      await likeBlog('Second Blog', 3) // most likes
      await likeBlog('First Blog', 1)
      await likeBlog('Third Blog', 2)

      // Check order: Second Blog, Third Blog, First Blog
      const blogs = page.locator('.blog') // container class of each blog
      await expect(blogs.nth(0)).toContainText('Second Blog')
      await expect(blogs.nth(1)).toContainText('Third Blog')
      await expect(blogs.nth(2)).toContainText('First Blog')
    })
  })
})
