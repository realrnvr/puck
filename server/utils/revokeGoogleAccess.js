import axios from "axios";

export const revokeGoogleAccess = async (refreshToken) => {
  try {
    await axios.post("https://oauth2.googleapis.com/revoke", null, {
      params: { token: refreshToken },
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    console.log("Successfully revoked Google access");
  } catch (error) {
    console.error(
      "Error revoking Google access:",
      error.response?.data || error.message
    );
  }
};
