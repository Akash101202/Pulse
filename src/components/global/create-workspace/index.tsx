"use client";
import { getWorkSpaces } from "@/actions/workspace";
import { useQueryData } from "@/hooks/useQueryData";

import React from "react";
import Modal from "../modal";
import { Button } from "@/components/ui/button";
import { FolderPlusIcon } from "lucide-react";
import WorkspaceForm from "@/components/forms/workspace-form";

type Props = {};

const CreateWorkspace = (props: Props) => {
  const { data } = useQueryData(["user-workspaces"], getWorkSpaces);

  const { data: plan } = data as {
    status: number;
    data: {
      subscription: {
        plan: "PRO" | "FREE";
      } | null;
    };
  };

  if (plan.subscription?.plan === "PRO")
    return (
      <Modal
        title="Create a Workspace"
        description="IT lqjnwdjqndndlqdnlqwndqldnqwldnqwldnqwldnqldnqwdnwqdqwndqwndqwdqndqld"
        trigger={
          <Button className="bg-[#707070] flex items-center gap-2 py-6 px-4 rounded-2xl">
            <FolderPlusIcon />
            Create a Workspace
          </Button>
        }
      >
        <WorkspaceForm />
      </Modal>
    );
};

export default CreateWorkspace;
