import { useEffect } from "react";
import { toast } from "sonner";

import { useAuthGoogleCallback } from "@/auth/hooks/useAuthGoogleCallback";

export const GoogleCallback = () => {
  const handleGoogleCallback = useAuthGoogleCallback();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        await handleGoogleCallback();
      } catch (error) {
        toast.error("Error processing Google callback");
      }
    };

    handleCallback();
  }, []);

  return <div>Loading... Please wait.</div>;
};
