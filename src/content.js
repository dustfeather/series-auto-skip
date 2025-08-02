const skipSelectors = {
    netflix: {
        intro: 'button[data-uia="player-skip-intro"]',
        credits: 'button[data-uia="player-skip-recap"]'
    }
};

function getPlatform() {
    if (location.hostname.includes("netflix.com")) return "netflix";
    if (location.hostname.includes("plex.tv") || location.hostname === "127.0.0.1") return "plex";
    return null;
}

function autoSkip(platform, enabledOptions) {
    const observer = new MutationObserver(() => {
        if (platform === "netflix") {
            if (enabledOptions.skipIntro) {
                const introBtn = document.querySelector(skipSelectors.netflix.intro);
                if (introBtn) introBtn.click();
            }
            if (enabledOptions.skipCredits) {
                const creditsBtn = document.querySelector(skipSelectors.netflix.credits);
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

    observer.observe(document.body, {childList: true, subtree: true});
}

function simulateShiftRightArrow() {
    const event = new KeyboardEvent("keydown", {
        key: "ArrowRight",
        code: "ArrowRight",
        keyCode: 39, // fallback for older handlers
        which: 39,
        shiftKey: true,
        bubbles: true,
        cancelable: true
    });

    console.log("[AutoSkip] Dispatching Shift + Right Arrow keydown");
    document.dispatchEvent(event);
}

function waitForBodyAndInit(platform, enabledOptions) {
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

function findButtonByText(text) {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.find(btn => btn.textContent.trim().toLowerCase() === text.toLowerCase());
}

const platform = getPlatform();
if (platform) {
    waitForBodyAndInit(platform, {
        skipIntro: true,
        skipCredits: true
    });
}
