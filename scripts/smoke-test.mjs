import { mkdir } from "node:fs/promises";
import { chromium } from "playwright-core";

const baseUrl = process.env.STORYFORGE_BASE_URL ?? "http://localhost:3000";
const executablePath =
  process.env.CHROME_PATH ??
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

await mkdir(".artifacts", { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath
});

try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: "Sueno" }).click();
  await page.getByRole("button", { name: /Fantasia/ }).click();
  await page
    .getByLabel("Tu punto de partida")
    .fill("Sone con un bosque donde cada puerta mostraba una meta que aun no me atrevia a perseguir.");
  await page.getByRole("button", { name: "Generar Historia" }).click();
  await page.getByText("StoryForge esta forjando tu aventura").waitFor();
  await page.getByText("Tu historia ha comenzado").waitFor({ timeout: 30000 });

  const choiceCount = await page.locator("article button").count();
  if (choiceCount !== 3) {
    throw new Error(`Expected 3 story choices, received ${choiceCount}.`);
  }

  await page.screenshot({
    path: ".artifacts/storyforge-desktop.png",
    fullPage: true
  });

  const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await mobile.goto(baseUrl, { waitUntil: "networkidle" });
  const mobileOverflow = await mobile.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth
  );
  if (mobileOverflow) {
    throw new Error("Mobile layout has horizontal overflow.");
  }
  await mobile.screenshot({
    path: ".artifacts/storyforge-mobile.png",
    fullPage: false
  });
  await mobile.locator("#forge").scrollIntoViewIfNeeded();
  await mobile.waitForTimeout(1200);
  await mobile.screenshot({
    path: ".artifacts/storyforge-mobile-forge.png",
    fullPage: false
  });

  const errorPage = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await errorPage.route("**/api/stories/start", async (route) => {
    await route.fulfill({
      status: 502,
      contentType: "application/json",
      headers: { "X-Request-Id": "smoke-test-request" },
      body: JSON.stringify({
        error: "El servicio de IA esta ocupado. Espera un momento e intenta nuevamente.",
        code: "GENERATION_FAILED",
        requestId: "smoke-test-request"
      })
    });
  });
  await errorPage.goto(baseUrl, { waitUntil: "networkidle" });
  await errorPage
    .getByLabel("Tu punto de partida")
    .fill("Quiero probar como se muestra un error claro durante la generacion.");
  await errorPage.getByRole("button", { name: "Generar Historia" }).click();
  await errorPage.getByText("No pudimos forjar la historia").waitFor({ timeout: 10000 });
  await errorPage.getByText("smoke-test-request").waitFor();

  if (pageErrors.length > 0) {
    throw new Error(`Browser errors: ${pageErrors.join(" | ")}`);
  }

  console.log(
    JSON.stringify(
      {
        status: "ok",
        generatedChoices: choiceCount,
        mobileOverflow,
        visualErrorState: true
      },
      null,
      2
    )
  );
} finally {
  await browser.close();
}
