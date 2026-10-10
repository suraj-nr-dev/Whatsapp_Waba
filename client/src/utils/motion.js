// True when the user turned animations off in their device settings.
// Check this before starting an animation from JavaScript. (Animations
// written in CSS are switched off in the CSS files with the same setting.)
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
