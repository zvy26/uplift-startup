import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const useAuthGoogleCallback = () => {
  const navigate = useNavigate();

  return useCallback(async () => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken: string | null = urlParams.get("access_token");
      const refreshToken: string | null = urlParams.get("refresh_token");

      if (!accessToken || !refreshToken) {
        toast.error("Missing tokens in the URL");
      }

      if (typeof accessToken === "string") {
        localStorage.setItem("access_token", accessToken);
      }
      if (typeof refreshToken === "string") {
        localStorage.setItem("refresh_token", refreshToken);
      }

      toast.success("Successfully signed in!");

      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Error handling Google callback");
    }
  }, []);
};
