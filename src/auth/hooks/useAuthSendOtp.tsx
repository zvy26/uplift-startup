import { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AuthContext } from "@/auth/context";
import { ISendOtpCode, Types } from "@/auth/types";
import http, { endpoints } from "@/services/api";

export const useAuthSendOtp = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  return useCallback(async (values: ISendOtpCode) => {
    try {
      const res = await http.post(endpoints.auth.send_otp_code, values);
      const { data } = res.data;

      dispatch({
        type: Types.SEND_OTP_CODE,
        payload: { ...data },
      });

      toast.success("SmsOtp sent successfully.");

      navigate(`/auth/otp/verify-code?codeHash=${data}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error sending SmsOtp.");
    }
  }, []);
};
