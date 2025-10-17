from playwright.sync_api import Page, expect

def test_home_page(page: Page):
    """
    This test verifies that the home page loads correctly and takes a screenshot.
    """
    # 1. Arrange: Go to the homepage.
    page.goto("http://localhost:3000")

    # 2. Assert: Confirm the page title is correct.
    expect(page).to_have_title("RideSync")

    # 3. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/home_page.png")