import { test, expect } from '@playwright/test'

// Basic test to verify role picker animation and dev-mode auto-fill
// This test expects the dev server to be running at http://localhost:3000

test('Role Picker in dev mode populates form and checks terms', async ({ page }, testInfo) => {
  await page.goto('/register')

  // Ensure the role picker grid is present
  const coachBtn = page.getByRole('button', { name: 'Select role Coach' })
  if ((await coachBtn.count()) === 0) {
    test.skip('RolePicker not present in this environment (non-dev)')
    return
  }
  await expect(coachBtn).toBeVisible()

  // Click coach role
  await coachBtn.click()

  // Ensure form fields are populated
  const fullName = page.locator('#fullName')
  const email = page.locator('#email')
  const password = page.locator('#password')
  const terms = page.locator('#terms')

  // Since we auto-populate from mock user, fullName and email should be non-empty
  await expect(fullName).not.toHaveValue('')
  await expect(email).not.toHaveValue('')

  // Check the password default
  await expect(password).toHaveValue('Password123!')

  // Ensure terms checkbox is checked
  await expect(terms).toBeChecked()

  // Selected card should have blue border (register page theme)
  const coachBtnClass = await coachBtn.getAttribute('class')
  expect(coachBtnClass).toContain('border-2')
  expect(coachBtnClass).toContain('ring-blue-400')
})
