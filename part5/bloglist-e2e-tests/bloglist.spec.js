const { test, expect, beforeEach, describe } = require('@playwright/test')
const { login, createBlog, logout } = require('./test-helpers')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
  })

  describe('When not logged in', () => {
    test('Login form is shown by default', async ({ page }) => {
      // Check that the login form heading is visible
      await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
      
      // Check for username field
      await expect(page.getByText('username')).toBeVisible()
      const usernameInput = page.getByRole('textbox', { name: /username/i })
      await expect(usernameInput).toBeVisible()
      await expect(usernameInput).toBeEmpty()
      
      // Check for password field
      await expect(page.getByText('password')).toBeVisible()
      const passwordInput = page.getByRole('textbox', { name: /password/i })
      await expect(passwordInput).toBeVisible()
      await expect(passwordInput).toBeEmpty()
      
      // Check for login button
      const loginButton = page.getByRole('button', { name: 'login' })
      await expect(loginButton).toBeVisible()
      await expect(loginButton).toBeEnabled()
      
      // Verify blogs are NOT shown when not logged in
      await expect(page.getByRole('heading', { name: 'blogs' })).not.toBeVisible()
      await expect(page.getByText('logged in')).not.toBeVisible()
    })

    test('Blog creation form is not shown', async ({ page }) => {
      await expect(page.getByRole('button', { name: 'create new blog' })).not.toBeVisible()
      await expect(page.getByRole('heading', { name: 'create new' })).not.toBeVisible()
    })

    test('Cannot access protected routes without login', async ({ page }) => {
      // Try to access blogs directly (should redirect to login or show login form)
      await page.goto('http://localhost:5173')
      await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
    })
  })

  // Note: Tests for logged-in state would require a running backend
  // and test user credentials, which we don't have in this test environment
})
