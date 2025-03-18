"use server";

import { currentUser } from "@clerk/nextjs/server";
import { onAuthenticateUser } from "./user";
import { client } from "@/lib/prisma";

export const verifyAccessToWorkspace = async (workspaceId: string) => {
  try {
    const user = await currentUser();
    if (!user) return { status: 403 };

    const isUserInWorkspace = await client.workSpace.findUnique({
      where: {
        id: workspaceId,
        OR: [
          {
            User: {
              clerkid: user.id,
            },
          },
          {
            members: {
              every: {
                User: {
                  clerkid: user.id,
                },
              },
            },
          },
        ],
      },
    });
    return { status: 200, data: { workspace: isUserInWorkspace } };
  } catch (error) {
    return { status: 403, data: { workspace: null } };
  }
};

export const getWorkspaceFolders = async (workSpaceId: string) => {
  try {
    const isFolders = await client.folder.findMany({
      where: {
        workSpaceId,
      },
      include: {
        _count: {
          select: {
            videos: true,
          },
        },
      },
    });

    if (isFolders && isFolders.length > 0) {
      return { status: 200, data: isFolders };
    }
    return { status: 404, data: [] };
  } catch (error) {
    return { status: 403, data: null };
  }
};

export const getAllUserVideos = async (workSpaceId: string) => {
  try {
    // First, we check if there's a user logged in
    const user = await currentUser();
    if (!user) return { status: 403 };

    // Here's the important part! Think of this like a shopping list
    const videos = await client.video.findMany({
      where: {
        // We're looking for videos that are either:
        // - in this workspace OR
        // - in this folder
        OR: [{ workSpaceId }, { folderId: workSpaceId }],
      },
      select: {
        // We only pick the things we want, like picking toys from a toy box
        id: true, // ✅ We want the video's ID
        title: true, // ✅ We want the title
        description: true, // ✅ We want the description
        source: true, // ✅ We want the source
        processing: true, // ✅ We want to know if it's processing

        // For the folder info, we only want:
        Folder: {
          select: {
            id: true, // ✅ The folder's ID
            name: true, // ✅ The folder's name
          },
        },

        // For the user info, we only want:
        User: {
          select: {
            firstName: true, // ✅ User's first name
            lastName: true, // ✅ User's last name
            image: true, // ✅ User's picture
          },
        },
      },
      // Sort videos by when they were created (oldest first)
      orderBy: {
        createdAt: "asc",
      },
    });

    // If we found videos, return them!
    if (videos && videos.length > 0) {
      return { status: 200, data: videos };
    }

    return { status: 404 };
  } catch (error) {
    return { status: 403 };
  }
};

export const getWorkSpaces = async () => {
  try {
    const user = await currentUser();
    if (!user) return { status: 403 };

    const workSpaces = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
        workspace: {
          select: {
            id: true,
            name: true,
            type: true,
          },
        },
        members: {
          select: {
            WorkSpace: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (workSpaces) {
      return { status: 200, data: workSpaces };
    }
    return { status: 404 };
  } catch (error) {
    return { status: 403 };
  }
};

export const createWorkspace = async (name: string) => {
  try {
    const user = await currentUser();

    if (!user) return { state: 401 };

    const authorized = await client.user.findUnique({
      where: {
        clerkid: user.id,
      },
      select: {
        subscription: {
          select: {
            plan: true,
          },
        },
      },
    });
    if (authorized?.subscription?.plan === "PRO") {
      const workspace = await client.user.update({
        where: {
          clerkid: user.id,
        },
        data: {
          workspace: {
            create: {
              name,
              type: "PUBLIC",
            },
          },
        },
      });
      if (workspace) {
        return { status: 201, data: "Workspace Created" };
      }
    }
    return { status: 401, data: "You are not authorized" };
  } catch (error) {
    return {
      status: 401,
    };
  }
};
