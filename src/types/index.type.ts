import { NumberDomain } from "recharts/types/util/types";

export type WorkspaceProps = {
  data: {
    subscription: {
      plan: "FREE" | "PRO";
    } | null;
    workspace: {
      id: string;
      name: string;
      type: "PERSONAL" | "PUBLIC";
    }[];
    members: {
      WorkSpace: {
        id: string;
        name: string;
        type: "PERSONAL" | "PUBLIC";
      };
    }[];
  };
};

export type NotificationProps = {
  status: number;
  data: {
    _count: {
      notification: number;
    };
  };
};
