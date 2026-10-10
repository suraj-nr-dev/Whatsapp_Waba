import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion } from '../utils/motion.js'

// How long the number takes to reach its new value, in milliseconds
const DURATION = 600

// Makes a number "count" smoothly to its new value instead of jumping.
// Example: const shown = useCountUp(1250)
// When 1250 later becomes 1400, "shown" runs 1250 -> 1400 in about half a
// second. The real value is never delayed: it is only the display that moves.
export function useCountUp(target) {
  const [shown, setShown] = useState(target)

  // Remembers the number on screen, so the next change starts from there
  const shownRef = useRef(target)

  useEffect(() => {
    const from = shownRef.current
    // Users who turned animations off get the new number at once
    const duration = prefersReducedMotion() ? 0 : DURATION
    const startTime = performance.now()
    let frame

    function step(now) {
      const progress =
        duration === 0 ? 1 : Math.min((now - startTime) / duration, 1)
      // Fast at the start, slow at the end
      const eased = 1 - Math.pow(1 - progress, 3)
      const value = progress === 1 ? target : from + (target - from) * eased

      shownRef.current = value
      setShown(value)

      if (progress < 1) {
        frame = requestAnimationFrame(step)
      }
    }

    frame = requestAnimationFrame(step)

    return () => cancelAnimationFrame(frame)
  }, [target])

  return shown
}
