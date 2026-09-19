// Google OAuth 2.0 Client ID (Web application).
// How to create one:
//   1. Go to https://console.cloud.google.com and create/select a project
//   2. APIs & Services -> OAuth consent screen -> configure (External is fine for testing)
//   3. APIs & Services -> Credentials -> Create Credentials -> OAuth client ID
//      -> Application type: "Web application"
//      -> Authorized JavaScript origins: http://localhost:5173
//      -> Authorized redirect URIs: http://localhost:5173
//   4. Copy the Client ID (ends in .apps.googleusercontent.com) into the value below
export const GOOGLE_CLIENT_ID = "1040876039006-vodut6edr6r5gc6s6is48169vvm6hn9k.apps.googleusercontent.com";