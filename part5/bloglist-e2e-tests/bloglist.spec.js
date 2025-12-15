const { test, expect, beforeEach, describe } = require('@playwright/test')
const { login, createBlog, logout } = require('./test-helpers')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // Reset backend database
    await request.post('http://localhost:3003/api/testing/reset')
    
    // Create a test user
    const newUser = {
      name: 'Test User',
      username: 'testuser',
      password: 'testpassword'
    }
    
    await request.post('http://localhost:3003/api/users', {
      data: newUser
    })
    
    // Navigate to the application
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
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      // Fill in correct credentials
      await page.getByRole('textbox', { name: /username/i }).fill('testuser')
      await page.getByRole('textbox', { name: /password/i }).fill('testpassword')
      
      // Click login button
      await page.getByRole('button', { name: 'login' }).click()
      
      // Verify login was successful
      await expect(page.getByText('Test User logged in')).toBeVisible()
      await expect(page.getByRole('heading', { name: 'blogs' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeVisible()
      
      // Login form should not be visible
      await expect(page.getByRole('heading', { name: 'Log in to application' })).not.toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      // Fill in wrong credentials
      await page.getByRole('textbox', { name: /username/i }).fill('wronguser')
      await page.getByRole('textbox', { name: /password/i }).fill('wrongpassword')
      
      // Click login button
      await page.getByRole('button', { name: 'login' }).click()
      
      // Verify login failed - error message should appear
      await expect(page.getByText('Wrong username or password')).toBeVisible()
      
      // Should still be on login page
      await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
      await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
      
      // Should not see logged in state
      await expect(page.getByText('logged in')).not.toBeVisible()
      await expect(page.getByRole('heading', { name: 'blogs' })).not.toBeVisible()
    })
  })
})
