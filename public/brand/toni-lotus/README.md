# LOTUS Runtime Identity for toni.asia

Status: `canonical`
Version: `2026-07-22`

This directory mirrors the current Lotus brand package from:

`D:/Toni/code/lotus/deliverables/lotus_runtime_identity_20260722`

## Current visual contract

| Token | Value | Usage |
| --- | --- | --- |
| Ink | `#0A0B0D` | Dark runtime surfaces, app icon, primary type |
| Paper | `#F6F6F4` | Wordmark on dark surfaces, documents |
| Sync Green | `#7BCA71` | Kernel, active state, verification |

The current logo is the geometric `LOTUS` wordmark. The square kernel inside `O` is an independent shape and the primary motion anchor.

## Preferred public assets

- `lotus-runtime-wordmark-paper.svg`: wordmark for dark surfaces
- `lotus-runtime-wordmark-ink.svg`: wordmark for light surfaces
- `lotus-runtime-symbol-paper.svg`: symbol for dark surfaces
- `lotus-runtime-symbol-ink.svg`: symbol for light surfaces
- `lotus-runtime-app-icon.svg`: app icon
- `lotus-runtime-wordmark-master.json`: Lottie dynamic master
- `lotus-runtime-project-card.png`: work and project card
- `lotus-runtime-hero.png`: project hero
- `lotus-runtime-visual-system-board.png`: VI board
- `lotus-runtime-motion-master.png`: motion-master preview
- `lotus-runtime-pdf-header-light.svg`: document header
- `lotus-runtime-pdf-cover-light.png`: document cover

## Runtime states

1. `IDLE`
2. `BOOT O`
3. `RESOLVE LT`
4. `ROUTE US`
5. `VERIFY`
6. `COMPLETE`

Motion surfaces should use the Lottie markers instead of copying frame numbers into UI code.

## Compatibility files

Older public filenames such as `toni-lotus-pdf-lockup-light.svg`, `toni-lotus-project-card.png`, and `toni-asia-lotus-hero-mockup.png` are retained so existing URLs do not break. Their contents now use the current Runtime Wordmark system.

Unreferenced flower, Petal Pink, serif lockup, and `01A-kernel-lotus-executive.png` files are historical artifacts only. They must not be used for new pages, documents, project cards, or future exports.
