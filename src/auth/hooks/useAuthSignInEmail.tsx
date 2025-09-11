import { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AuthContext } from "@/auth/context";
import { ISignInWithEmail, Types } from "@/auth/types";
import http, { endpoints } from "@/services/api";

export const useAuthSignInEmail = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  return useCallback(async (values: ISignInWithEmail) => {
    try {
      const res = await http.post(endpoints.auth.sign_in_with_email, values);
      const { data } = res.data;

      const { access_token: accessToken, refresh_token: refreshToken } =
        res.data.tokens;

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);

      dispatch({
        type: Types.SIGN_IN_WITH_EMAIL,
        payload: {
          user: {
            ...data,
          },
        },
      });

      toast.success("Tizimga kirildi");

      navigate("/");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Tizimga kirishda xatolik yuz berdi!",
      );
    }
  }, []);
};
