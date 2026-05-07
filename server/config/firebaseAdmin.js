const admin = require("firebase-admin");

function maybeDecodePrivateKey(value) {
  if (!value) return value;
  return value.replace(/\\n/g, "\n");
}

function getCredentialFromEnv() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = maybeDecodePrivateKey(process.env.FIREBASE_PRIVATE_KEY);
  if (projectId && clientEmail && privateKey) {
    return {
      projectId,
      clientEmail,
      privateKey,
    };
  }
  return null;
}

function getFirebaseAdmin() {
  if (admin.apps.length > 0) return admin;

  const serviceAccount = getCredentialFromEnv();
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.projectId,
    });
    return admin;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  if (projectId) {
    admin.initializeApp({ projectId });
    return admin;
  }

  throw new Error(
    "Firebase Admin is not configured. Set FIREBASE_PROJECT_ID and service account env vars."
  );
}

async function verifyGoogleIdToken(idToken) {
  const firebaseAdmin = getFirebaseAdmin();
  return firebaseAdmin.auth().verifyIdToken(idToken);
}

module.exports = {
  verifyGoogleIdToken,
};
