type Platform = "netflix" | "plex";

interface EnabledOptions {
  skipIntro: boolean;
  skipCredits: boolean;
}

interface SkipSelectors {
  intro: string;
  credits: string;
}

const skipSelectors: Record<string, SkipSelectors> = {
  netflix: {
    intro: 'button[data-uia="player-skip-intro"]',
    credits: 'button[data-uia="player-skip-recap"]',
  },
};

function getPlatform(): Platform | null {
  if (location.hostname === "www.netflix.com") return "netflix";
  if (
    location.hostname === "app.plex.tv" ||
    ((location.hostname === "127.0.0.1" || location.hostname === "localhost") &&
      location.port === "32400")
  )
    return "plex";
  return null;
}

function autoSkip(platform: Platform, enabledOptions: EnabledOptions): void {
  const observer = new MutationObserver(() => {
    if (platform === "netflix") {
      if (enabledOptions.skipIntro) {
        const introBtn =
          document.querySelector<HTMLButtonElement>(
            skipSelectors.netflix.intro,
          );
        if (introBtn) introBtn.click();
      }
      if (enabledOptions.skipCredits) {
        const creditsBtn =
          document.querySelector<HTMLButtonElement>(
            skipSelectors.netflix.credits,
          );
        if (creditsBtn) creditsBtn.click();
      }
    } else if (platform === "plex") {
      if (enabledOptions.skipIntro) {
        const btn = findButtonByText("Skip Intro");
        if (btn) btn.click();
      }
      if (enabledOptions.skipCredits) {
        const creditsBtn = findButtonByText("Skip Credits");
        if (creditsBtn && !creditsBtn.dataset.autoskipped) {
          simulateShiftRightArrow();
          creditsBtn.dataset.autoskipped = "true";
        }
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function simulateShiftRightArrow(): void {
  const event = new KeyboardEvent("keydown", {
    key: "ArrowRight",
    code: "ArrowRight",
    keyCode: 39,
    which: 39,
    shiftKey: true,
    bubbles: true,
    cancelable: true,
  } as KeyboardEventInit);

  console.log("[AutoSkip] Dispatching Shift + Right Arrow keydown");
  document.dispatchEvent(event);
}

function waitForBodyAndInit(
  platform: Platform,
  enabledOptions: EnabledOptions,
): void {
  if (document.body) {
    autoSkip(platform, enabledOptions);
  } else {
    const checkReady = setInterval(() => {
      if (document.body) {
        clearInterval(checkReady);
        autoSkip(platform, enabledOptions);
      }
    }, 100);
  }
}

function findButtonByText(text: string): HTMLButtonElement | undefined {
  const buttons = Array.from(
    document.querySelectorAll<HTMLButtonElement>("button"),
  );
  return buttons.find(
    (btn) => btn.textContent?.trim().toLowerCase() === text.toLowerCase(),
  );
}

const platform = getPlatform();
if (platform) {
  waitForBodyAndInit(platform, {
    skipIntro: true,
    skipCredits: true,
  });
}
