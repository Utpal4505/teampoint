export const ROLE_PERMISSIONS = {
  OWNER: {
    canEditWorkspace: true,
    canDeleteWorkspace: true,
    canArchiveWorkspace: true,

    canInviteMembers: true,
    canRevokeInviteMembers: true,
    canViewInvites: true,

    canRemoveMembers: true,
    canChangeRoles: true,
    canViewMembers: true,

    canCreateProjects: true,
    canEditProjects: true,
    canDeleteProjects: true,
  },

  ADMIN: {
    canEditWorkspace: true,
    canDeleteWorkspace: false,
    canArchiveWorkspace: true,

    canInviteMembers: true,
    canRevokeInviteMembers: true,
    canViewInvites: true,

    canRemoveMembers: true,
    canChangeRoles: false,
    canViewMembers: true,

    canCreateProjects: true,
    canEditProjects: true,
    canDeleteProjects: false,
  },

  MEMBER: {
    canEditWorkspace: false,
    canDeleteWorkspace: false,
    canArchiveWorkspace: false,

    canInviteMembers: false,
    canRevokeInviteMembers: false,
    canViewInvites: false,

    canRemoveMembers: false,
    canChangeRoles: false,
    canViewMembers: true,

    canCreateProjects: true,
    canEditProjects: true,
    canDeleteProjects: false,
  },
} as const
