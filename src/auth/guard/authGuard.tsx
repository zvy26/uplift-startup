import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { paths } from "@/routes/paths";

import { useAuthContext } from "../hooks/useAuthContext";

const loginPaths: Record<string, string> = {
  jwt: paths.auth.jwt.login,
};

type Props = {
  children: React.ReactNode;
};

export function AuthGuard({ children }: Props) {
  const { loading } = useAuthContext();

  return loading ? "loading" : <Container>{children}</Container>;
}

function Container({ children }: Props) {
  const navigate = useNavigate();

  const { authenticated, method } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();

      const loginPath = loginPaths[method];

      const href = `${loginPath}?${searchParams}`;

      navigate(href, { replace: true });
    } else {
      setChecked(true);
    }
  }, [authenticated, method, navigate]);

  useEffect(() => {
    check();
  }, []);

  if (!checked) {
    return null;
  }

  return children;
}
