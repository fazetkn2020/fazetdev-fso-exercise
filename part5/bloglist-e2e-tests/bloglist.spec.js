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
  })
})
