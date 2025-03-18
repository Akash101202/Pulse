import { onAuthenticateUser } from "@/actions/user";
import { redirect } from "next/navigation";
import React from "react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const AuthCallbackPage = async (props: Props) => {
  const auth = await onAuthenticateUser();
  if (auth.status === 200 || auth.status === 201) {
    //isAuthenticated
    return redirect(`/dashboard/${auth.user?.workspace[0].id}`);
  }
  if (auth.status === 500 || auth.status === 401 || auth.status === 404) {
    return redirect("/auth/sign-in");
  }
};

export default AuthCallbackPage;
