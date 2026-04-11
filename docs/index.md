---
layout: default
title: Auto Skip for Plex & Netflix
---

# Auto Skip for Plex & Netflix

Automatically skips intros and credits on Plex and Netflix so you never have to reach for the remote.

## Supported Platforms

| Platform | Skip Intro | Skip Credits |
|----------|-----------|-------------|
| Netflix  | Yes       | Yes         |
| Plex     | Yes       | Yes         |

Plex support includes local servers at `127.0.0.1:32400` and `localhost:32400`.

## Install

### Chrome / Edge / Brave

1. Download the latest `extension-chrome.zip` from [Releases](https://github.com/dustfeather/series-auto-skip/releases)
2. Unzip the file
3. Open `chrome://extensions` in your browser
4. Enable **Developer mode** (top right)
5. Click **Load unpacked** and select the unzipped folder

### Firefox

1. Download the latest `extension-firefox.xpi` from [Releases](https://github.com/dustfeather/series-auto-skip/releases)
2. Open Firefox and go to `about:addons`
3. Click the gear icon and select **Install Add-on From File**
4. Select the downloaded `.xpi` file

## How It Works

The extension watches for skip buttons to appear on the page and clicks them automatically. On Netflix, it targets the built-in skip intro and skip recap buttons. On Plex, it finds buttons by their text label.

No configuration needed. Install it and forget about it.

## Privacy

This extension does not collect, store, or transmit any user data. Read the full [Privacy Policy](privacy).
