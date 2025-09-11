import React, { useCallback, useEffect, useMemo, useReducer } from "react";

import { User } from "@/modules/user/types/User";

import { ActionMapType, AuthStateType, Payload, Types } from "@/auth/types";
import { setSession } from "@/lib/utils";
import http, { endpoints } from "@/services/api";

import { tokenService } from "../services/tokenService";

import { AuthContext } from "./authContext";

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

const initialState: AuthStateType = {
  user: null,
  loading: true,
};

const reducer = (state: AuthStateType, action: ActionsType) => {
  if (action.type === Types.INITIAL) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.SIGN_UP_WITH_EMAIL) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.SIGN_IN_WITH_EMAIL) {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === Types.SEND_OTP_CODE) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.VERIFY_PHONE_OTP) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.SIGN_UP_WITH_PHONE) {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === Types.LOGOUT) {
    return {
      loading: false,
      user: null,
    };
  }
  return state;
};

type Props = {
  children: React.ReactNode;
};

export const DEFAULT_FREE_ESSAY_CHECKS = 3;
const STORAGE_KEY = "freeChecksCount";

export function AuthProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    const decoded = tokenService.decodeToken();

    if (!decoded) {
      dispatch({ type: Types.INITIAL, payload: { user: null } });
      return;
    }

    // Build a minimal user object from JWT payload only (no /auth/me API)
    const minimalUser = {
      _id: (decoded as any)?._id ?? (decoded as any)?.sub ?? '',
      phone: (decoded as any)?.phone ?? '',
      roles: (decoded as any)?.roles ?? [],
      hasPaid: false,
      freeChecksCount: Number(localStorage.getItem(STORAGE_KEY) || 0),
    } as unknown as User;

    dispatch({
      type: Types.INITIAL,
      payload: { user: minimalUser },
    });
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const logout = useCallback(async () => {
    setSession(null);
    dispatch({
      type: Types.LOGOUT,
    });
  }, []);

  const checkAuthenticated = state.user ? "authenticated" : "unauthenticated";

  const status = state.loading ? "loading" : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: "jwt",
      loading: status === "loading",
      authenticated: status === "authenticated",
      unauthenticated: status === "unauthenticated",
      logout,
      dispatch,
    }),
    [logout, state.user, status, dispatch]
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
