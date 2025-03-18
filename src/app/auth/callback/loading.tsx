import Spinner from "@/components/global/loader/spinner";
import React from "react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AuthLoading = (props: Props) => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Spinner />
    </div>
  );
};

export default AuthLoading;
