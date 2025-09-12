/* eslint-disable react/jsx-no-useless-fragment */

import React, { useCallback, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { paths } from "@/routes/paths";

import { useAuthContext } from "../hooks/useAuthContext";

type Props = {
  children: React.ReactNode;
};

export function GuestGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return <>{loading ? "loading" : <Container>{children}</Container>}</>;
}

function Container({ children }: Props) {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const returnTo = searchParams.get("returnTo") || paths.dashboard.root;

  const { authenticated } = useAuthContext();

  const check = useCallback(() => {
    if (authenticated) {
      navigate(returnTo, { replace: true });
    }
  }, [authenticated, returnTo, navigate]);

  useEffect(() => {
    check();
  }, [check]);

  return <>{children}</>;
}
