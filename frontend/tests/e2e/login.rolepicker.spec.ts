import { test, expect } from '@playwright/test'

// Sanity test for login role picker: verify dev-mode auto-fill and wheel disable
test('Login Role Picker auto-fills credentials and disables wheel scroll on click', async ({ page }, testInfo) => {
  await page.goto('/login')

  // Ensure the role picker is present in dev mode
  const coachBtn = page.getByRole('button', { name: 'Select role Coach' })
  // If role picker is not present due to non-dev environment, gracefully skip the test.
  if ((await coachBtn.count()) === 0) {
    test.skip('RolePicker not present in this environment (non-dev)')
    return
  }
  await expect(coachBtn).toBeVisible()
  // Debug: print button's outerHTML and container innerHTML
  console.log('BUTTON HTML:', await coachBtn.evaluate((el) => el.outerHTML))
  const container = page.locator('.no-scrollbar').first()
  console.log('CONTAINER HTML SNIPPET:', await container.evaluate((el) => el.innerHTML.slice(0,200)))

  // Click coach role
  await coachBtn.click()

  const email = page.locator('#email')
  const password = page.locator('#password')

  await expect(email).not.toHaveValue('')
  await expect(password).toHaveValue('Password123!')

  // Confirm wheel/trackpad won't scroll the carousel after click
  // const container = page.locator('.no-scrollbar').first()
  const initialScroll = await container.evaluate((el) => el.scrollLeft)
  // Dispatch a horizontal wheel event which normally would change scrollLeft
  await container.dispatchEvent('wheel', { deltaY: 120 })
  const afterScroll = await container.evaluate((el) => el.scrollLeft)
  // Scroll should not change when disabled
  await expect(afterScroll).toBe(initialScroll)

  // Selected card should have green border (login page theme)
  const coachBtnClass = await coachBtn.getAttribute('class')
  expect(coachBtnClass).toContain('border-2')
  expect(coachBtnClass).toContain('border-emerald-400')
})
