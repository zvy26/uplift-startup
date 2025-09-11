import { FC } from "react";

import { Spinner } from "../Spinner";

export const PageLoading: FC = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
};
