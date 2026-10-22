import axios from "axios";

export const revokeGoogleAccess = async (
  refreshToken: string,
): Promise<void> => {
  try {
    await axios.post("https://oauth2.googleapis.com/revoke", null, {
      params: { token: refreshToken },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    console.log("Successfully revoked Google access");
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error revoking Google access:",
        error.response?.data ?? error.message,
      );
      return;
    }

    console.error(
      "Error revoking Google access:",
      error instanceof Error ? error.message : error,
    );
  }
};
