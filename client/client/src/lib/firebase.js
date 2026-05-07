import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const missingKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !(typeof value === 'string' && value.trim()))
  .map(([key]) => key)

const firebaseEnabled = missingKeys.length === 0
const firebaseConfigError = firebaseEnabled
  ? null
  : `Missing Firebase web config: ${missingKeys.join(', ')}`

let auth = null
let googleProvider = null
let firebaseInitError = null

if (firebaseEnabled) {
  try {
    const app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    googleProvider = new GoogleAuthProvider()
    googleProvider.setCustomParameters({ prompt: 'select_account' })
  } catch (err) {
    firebaseInitError = err
  }
}

if (typeof window !== 'undefined') {
  window.__MJ_FIREBASE_DEBUG__ = {
    firebaseEnabled,
    firebaseConfigError,
    firebaseInitError: firebaseInitError ? String(firebaseInitError) : null,
    presentKeys: Object.fromEntries(
      Object.entries(firebaseConfig).map(([key, value]) => [
        key,
        Boolean(typeof value === 'string' && value.trim()),
      ])
    ),
    authDomain: firebaseConfig.authDomain || null,
    projectId: firebaseConfig.projectId || null,
  }
  if (firebaseConfigError) {
    console.error('[MyJobs] Firebase web config issue:', firebaseConfigError)
  }
  if (firebaseInitError) {
    console.error('[MyJobs] Firebase init failed:', firebaseInitError)
  }
}

export {
  auth,
  firebaseEnabled,
  firebaseConfigError,
  firebaseInitError,
  googleProvider,
}
