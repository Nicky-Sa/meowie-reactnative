import { by, device, element, expect, waitFor } from "detox";

describe("Meowie", () => {
  beforeAll(async () => {
    await device.launchApp();

    // Pause for 5 seconds to let you tap the URL manually ⏳
    console.log("--- TEST PAUSED: Tap the URL in the simulator now! ---");
    await new Promise((resolve) => setTimeout(resolve, 5_000));
  });

  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it("should navigate through the onboarding screen", async () => {
    // 1. Wait for splash screen to disappear and first slide displays correctly
    await waitFor(element(by.text("Swipe to Discover")))
      .toBeVisible()
      .withTimeout(5_000);

    // 2. Swipe left on the first slide to go to the second
    await element(by.text("Swipe to Discover")).swipe("left");

    // 3. Assert the second slide appears
    await expect(element(by.text("Filters"))).toBeVisible();

    // 4. Swipe left again to go to the final slide
    await element(by.text("Filters")).swipe("left");

    // 5. Assert the final slide "Saved Favorites" is visible
    await expect(element(by.text("Saved Favorites"))).toBeVisible();

    // 6. Tap the Let's Go button
    await waitFor(element(by.text("Let's Go")))
      .toBeVisible()
      .withTimeout(2_000);

    await element(by.text("Let's Go")).tap();
  });
});
