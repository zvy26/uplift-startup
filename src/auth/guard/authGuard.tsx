import React, { useCallback, useEffect, useState } from "react";

import { useRouter } from "@/hooks/useRouter";
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
  const router = useRouter();

  const { authenticated, method } = useAuthContext();

  const [checked, setChecked] = useState(false);

  const check = useCallback(() => {
    if (!authenticated) {
      const searchParams = new URLSearchParams({
        returnTo: window.location.pathname,
      }).toString();

      const loginPath = loginPaths[method];

      const href = `${loginPath}?${searchParams}`;

      router.replace(href);
    } else {
      setChecked(true);
    }
  }, [authenticated, method, router]);

  useEffect(() => {
    check();
  }, []);

  if (!checked) {
    return null;
  }

  return children;
}
