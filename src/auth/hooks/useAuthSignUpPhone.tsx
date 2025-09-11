import { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AuthContext } from "@/auth/context";
import { ISignUpWithPhone, Types } from "@/auth/types";
import http, { endpoints } from "@/services/api";

export const useAuthSignUpPhone = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  return useCallback(async (values: ISignUpWithPhone) => {
    try {
      const res = await http.post(endpoints.auth.sign_up_phone, values);

      const { access_token: accessToken, refresh_token: refreshToken } =
        res.data.tokens;

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      dispatch({
        type: Types.SIGN_UP_WITH_PHONE,
        payload: { user: res.data.profile },
      });

      toast.success("You have successfully registered.");

      navigate("/");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error verifying SmsOtp code",
      );
    }
  }, []);
};
