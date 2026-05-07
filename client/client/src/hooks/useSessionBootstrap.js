import { useEffect } from 'react'

/**
 * Runs an async bootstrap once on mount (e.g. /auth/me). Kept in a tiny hook so
 * route components stay lint-clean under react-hooks/set-state-in-effect.
 */
export function useSessionBootstrap(run) {
  useEffect(() => {
    void run()
  }, [run])
}
