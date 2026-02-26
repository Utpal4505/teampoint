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
    canViewProject: true,
    canEditProject: true,
    canArchiveProject: true,
    canDeleteProject: true,

    canCreateLeaveRequest: false,
    canViewAllLeaveRequests: true,
    canReviewLeaveRequests: true,
    canUpdateLeaveRequests: true,
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
    canViewProject: true,
    canEditProject: true,
    canArchiveProject: true,
    canDeleteProject: false,

    canCreateLeaveRequest: false,
    canViewAllLeaveRequests: true,
    canReviewLeaveRequests: true,
    canUpdateLeaveRequests: true,
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

    canCreateProjects: false,
    canViewProject: true,
    canEditProject: false,
    canArchiveProject: false,
    canDeleteProject: false,

    canCreateLeaveRequest: true,
    canViewAllLeaveRequests: false,
    canReviewLeaveRequests: false,
    canUpdateLeaveRequests: true,
  },
} as const
