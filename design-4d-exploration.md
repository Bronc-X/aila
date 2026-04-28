# Toni / AILA 4D Exploration Design Guide

> This replaces the earlier flat `design.md` direction for the Toni personal universe prototype. The target is not a scroll landing page with depth decoration. The target is a navigable spatial scene.

## Reference Distillation

- User video: black spatial theater, camera-like movement, red extruded letters, floating webpage/video planes, deep perspective grid, strong near/far layering.
- Milo: clarity through repeated bold phrases, step-by-step service logic, concrete outcome framing, no vague service language.
- Lué Studio: cloud/moon/alchemy mood, chapter numbers, poetic restraint, large negative space, craft-first studio voice.
- Digital Flagship: bold proof structure, strong service catalog, growth CTA rhythm, work cards as evidence.
- ReactBits: use as a source for free component patterns and tools, especially draggable grids, parallax cards, 3D text reveal, particle/letter text, and animated backgrounds. Do not add dependencies until the component is worth owning.
- MotionSites: use as prompt/reference language for cinematic hero sections, background video behavior, large motion-led layouts, and high-impact opening scenes.

## Core Direction

Name: Obsidian Moon Theater

The page is a dark 3D stage where Toni's identity, AILA, Antios, QuantMAx, method, and external design references float as physical objects. The user does not scroll through sections. They move a camera through a world.

## Interaction Rules

- The main canvas is a fixed viewport, not a normal vertical page.
- Drag rotates the scene, creating orbit and parallax.
- Wheel moves the camera through the Z axis.
- Keyboard can nudge camera position for accessibility.
- Clicking a spatial object moves the camera toward it and updates the readout.
- Objects must sit at different x/y/z coordinates, with depth fog, perspective, and scale differences.

## Visual Rules

- Use black/obsidian space as the depth field.
- Use red extruded text as the memorable anchor.
- Use moon/cream/cloud planes for Toni's dream layer.
- Use thin perspective grid lines to make movement legible.
- Use real media slices where possible: screenshots, case images, video panels.
- Keep the UI chrome tiny. The space is the interface.

## Content Rules

- Toni: dream layer, personal core, cross-domain maker identity.
- AILA: enterprise AI universe and business operating matrix.
- Milo-inspired layer: simple logic, clear steps, obvious outcome.
- Lué-inspired layer: cloud, moon, craft, alchemy, chapters.
- Digital Flagship-inspired layer: proof, services, growth, work evidence.

## Implementation Notes

- Current version uses CSS 3D and Framer Motion, no new dependencies.
- Before installing Three.js or copying ReactBits components, confirm the first CSS 3D prototype is directionally right.
- If moving to a heavier version, the next technical step is a real Three.js scene with CSS2D/CSS3D labels, but only after this interaction model is approved.
