"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const client = new QueryClient();

const ReactQueryProvider = (props: Props) => {
  return (
    <QueryClientProvider client={client}>{props.children}</QueryClientProvider>
  );
};

export default ReactQueryProvider;
