const skipSelectors = {
    netflix: ['button[data-uia="player-skip-intro"]', 'button[data-uia="player-skip-recap"]'],
    plex: ['.SkipIntroButton', '.SkipCreditsButton']
};

function getPlatform() {
    if (location.hostname.includes("netflix.com")) return "netflix";
    if (location.hostname.includes("plex.tv")) return "plex";
    return null;
}

function autoSkip(platform) {
    const selectors = skipSelectors[platform];

    const observer = new MutationObserver(() => {
        selectors.forEach(selector => {
            const btn = document.querySelector(selector);
            if (btn) {
                btn.click();
                console.log(`[AutoSkip] Clicked: ${selector}`);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Wait for document.body to exist
function waitForBodyAndInit(platform) {
    if (document.body) {
        autoSkip(platform);
    } else {
        const checkReady = setInterval(() => {
            if (document.body) {
                clearInterval(checkReady);
                autoSkip(platform);
            }
        }, 100);
    }
}

const platform = getPlatform();
if (platform) waitForBodyAndInit(platform);
