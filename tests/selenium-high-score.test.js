import { Builder, Browser, By } from "selenium-webdriver";
import chrome from "selenium-webdriver/chrome.js";
import assert from "node:assert/strict";
import path from "node:path";

const gameUrl = "http://127.0.0.1:5500/bc-tetris/";
const profilePath = path.resolve(".selenium-profile");
const testScore = "1234";

async function openBrowser() {
  const options = new chrome.Options();
  options.addArguments(`--user-data-dir=${profilePath}`);

  return new Builder()
    .forBrowser(Browser.CHROME)
    .setChromeOptions(options)
    .build();
}

async function testHighScorePersistence() {
  let driver;

  try {
    // 1. Open the game
    driver = await openBrowser();
    await driver.get(gameUrl);

    // 2. Set a test high score
    await driver.executeScript(
      "localStorage.setItem('tetrisHighScore', arguments[0])",
      testScore,
    );

    // Refresh so the game loads the saved score
    await driver.navigate().refresh();

    const scoreBefore = await driver.findElement(By.id("highScore")).getText();

    assert.equal(scoreBefore, testScore);

    // 3. Close the entire browser session
    await driver.quit();
    driver = null;

    // 4. Open a new browser using the same profile
    driver = await openBrowser();
    await driver.get(gameUrl);

    // 5. Verify that the high score still exists
    const scoreAfter = await driver.findElement(By.id("highScore")).getText();

    assert.equal(
      scoreAfter,
      testScore,
      "High score was not preserved after browser restart",
    );

    console.log("PASS: High score persisted after browser restart.");
  } finally {
    if (driver) {
      await driver.quit();
    }
  }
}

testHighScorePersistence().catch((error) => {
  console.error("FAIL:", error);
  process.exitCode = 1;
});
