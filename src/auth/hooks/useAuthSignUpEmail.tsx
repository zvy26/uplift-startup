import { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { AuthContext } from "@/auth/context";
import { ISignUpWithEmail, Types } from "@/auth/types";
import http, { endpoints } from "@/services/api";

export const useSignUpWithEmail = () => {
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  return useCallback(
    async (values: ISignUpWithEmail) => {
      try {
        const res = await http.post(endpoints.auth.sign_up_with_email, values);
        const { data } = res.data;

        const { access_token: accessToken, refresh_token: refreshToken } =
          res.data.tokens;

        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);

        dispatch({
          type: Types.SIGN_UP_WITH_EMAIL,
          payload: {
            user: {
              ...data,
            },
          },
        });

        toast.success("You have successfully registered.");
        navigate("/");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Error signing up.");
      }
    },
    [dispatch],
  );
};
