const generateCodeVerifier = (): string => {
  const array = new Uint8Array(32);

  crypto.getRandomValues(array);

  return btoa(String.fromCharCode(...Array.from(array)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

const generateCodeChallenge = async (verifier: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);

  return btoa(String.fromCharCode(...Array.from(new Uint8Array(hash))))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

const generateState = (): string => {
  const array = new Uint8Array(16);

  crypto.getRandomValues(array);

  return btoa(String.fromCharCode(...Array.from(array)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
};

export const useGoogleAuth = () => {
  const handleGoogleSignIn = async (mode: "login" | "register" = "login") => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/auth/google/callback`;
    const scope = "openid email profile";
    const responseType = "code";
    const accessType = "offline";
    const prompt = "consent";

    if (!clientId) {
      console.error("Google Client ID not configured");

      return;
    }

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const randomState = generateState();

    const stateData = {
      random: randomState,
      mode,
    };
    const state = btoa(JSON.stringify(stateData));

    sessionStorage.setItem("pkce_code_verifier", codeVerifier);
    sessionStorage.setItem("oauth_state", state);

    const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");

    authUrl.searchParams.append("client_id", clientId);
    authUrl.searchParams.append("redirect_uri", redirectUri);
    authUrl.searchParams.append("response_type", responseType);
    authUrl.searchParams.append("scope", scope);
    authUrl.searchParams.append("access_type", accessType);
    authUrl.searchParams.append("prompt", prompt);
    authUrl.searchParams.append("code_challenge", codeChallenge);
    authUrl.searchParams.append("code_challenge_method", "S256");
    authUrl.searchParams.append("state", state);

    window.location.href = authUrl.toString();
  };

  return {
    handleGoogleSignIn,
  };
};
