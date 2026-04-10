import httpx

from config import settings

GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token"
GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v2/userinfo"


async def exchange_code_for_tokens(code: str, redirect_uri: str) -> dict:
    """
    Exchange the authorization code for Google access + refresh tokens.

    This is the server-side leg of the OAuth 2.0 Authorization Code flow.
    The client_secret is kept here on the server — never exposed to the browser.
    """
    async with httpx.AsyncClient() as client:
        response = await client.post(
            GOOGLE_TOKEN_URL,
            data={
                "code": code,
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "redirect_uri": redirect_uri,
                "grant_type": "authorization_code",
            },
        )

        if response.status_code != 200:
            raise Exception(f"Google token exchange failed: {response.text}")

        return response.json()
        # Returns: { access_token, refresh_token, id_token, expires_in, ... }


async def get_google_user_info(access_token: str) -> dict:
    """
    Use the Google access token to fetch the user's profile information.

    Returns: { id, email, name, picture, verified_email, ... }
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            GOOGLE_USERINFO_URL,
            headers={"Authorization": f"Bearer {access_token}"},
        )

        if response.status_code != 200:
            raise Exception("Failed to fetch Google user info")

        return response.json()
