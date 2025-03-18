import { getNotifications, onAuthenticateUser } from "@/actions/user";
import {
  getAllUserVideos,
  getWorkspaceFolders,
  getWorkSpaces,
  verifyAccessToWorkspace,
} from "@/actions/workspace";
import { redirect } from "next/navigation";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import React from "react";
import { ReactNode } from "react";
import Sidebar from "@/components/global/sidebar";
import GlobalHeader from "@/components/global/global-header";

// Define the props type for the layout component
// workspaceId comes from the dynamic route parameter
type Props = {
  params: {
    workspaceId: string;
  };
  children: ReactNode;
};

/**
 * Dashboard Layout Component
 * This is a Next.js layout component that wraps all dashboard pages.
 * It handles:
 * 1. Authentication
 * 2. Workspace access verification
 * 3. Data prefetching
 * 4. Common UI elements (sidebar)
 */

const Layout = async ({ params: { workspaceId }, children }: Props) => {
  // Check if user is authenticated
  const auth = await onAuthenticateUser();

  if (!auth.user?.workspace) redirect("/auth/sign-in");
  if (!auth.user.workspace.length) redirect("/auth/sign-in");
  // Verify if user has access to the requested workspace
  const hasAccess = await verifyAccessToWorkspace(workspaceId);

  // If no access, redirect to user's first workspace
  if (hasAccess.status !== 200) {
    redirect(`/dashboard/${auth.user?.workspace[0].id}`);
  }

  // Initialize React Query client for data fetching
  const query = new QueryClient();

  // Prefetch necessary data for the dashboard
  // This improves performance by loading data before it's needed

  // 1. Fetch workspace folders
  await query.prefetchQuery({
    queryKey: ["workspace-folders"],
    queryFn: () => getWorkspaceFolders(workspaceId),
  });

  // 2. Fetch user's videos in this workspace
  await query.prefetchQuery({
    queryKey: ["user-videos"],
    queryFn: () => getAllUserVideos(workspaceId),
  });

  // 3. Fetch all workspaces user has access to
  await query.prefetchQuery({
    queryKey: ["user-workspaces"],
    queryFn: () => getWorkSpaces(),
  });

  // 4. Fetch user notifications
  await query.prefetchQuery({
    queryKey: ["user-notifications"],
    queryFn: () => getNotifications(),
  });

  // Render the layout with:
  // - HydrationBoundary: Ensures server-fetched data is properly hydrated on client
  // - Sidebar: Navigation and workspace switching
  // - Main content area for child pages
  return (
    <HydrationBoundary state={dehydrate(query)}>
      <div className="flex h-screen w-screen">
        <Sidebar activeWorkspaceId={workspaceId} />
        <div className="flex-1">{children}</div>
        <div className="w-full pt-28 p-6 overflow-y-scroll overflow-x-hidden">
          {hasAccess.data?.workspace ? (
            <GlobalHeader workspace={hasAccess.data.workspace} />
          ) : (
            <p>Loading workspace...</p>
          )}
          <div className="mt-4">{children}</div>
        </div>
      </div>
    </HydrationBoundary>
  );
};

export default Layout;
