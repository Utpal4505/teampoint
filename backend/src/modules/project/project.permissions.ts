export const PROJECT_ROLE_PERMISSIONS = {
  OWNER: {
    canTransferOwnership: true,

    canInviteMembers: true,
    canRemoveMembers: true,
    canChangeRoles: true,
    canViewMembers: true,

    canViewTasks: true,
    canCreateTasks: true,
    canEditAnyTask: true,
    canDeleteAnyTask: true,

    canViewDocs: true,
    canCreateDocs: true,
    canEditAnyDocs: true,
    canDeleteAnyDocs: true,

    canCreateDiscussions: true,
    canEditAnyDiscussion: true,
    canResolveDiscussions: true,
    canReopenDiscussions: true,
    canDeleteDiscussions: true,

    canComment: true,
    canDeleteAnyComment: true,

    canViewGoals: true,
    canCreateGoals: true,
    canUpdateAnyGoal: true,
    canCompleteGoal: true,
    canDeleteGoals: true,
  },

  ADMIN: {
    canTransferOwnership: false,

    canInviteMembers: true,
    canRemoveMembers: true,
    canChangeRoles: false,
    canViewMembers: true,

    canViewTasks: true,
    canCreateTasks: true,
    canEditAnyTask: true,
    canDeleteAnyTask: true,

    canViewDocs: true,
    canCreateDocs: true,
    canEditAnyDocs: true,
    canDeleteAnyDocs: true,

    canCreateDiscussions: true,
    canEditAnyDiscussion: true,
    canResolveDiscussions: true,
    canReopenDiscussions: true,
    canDeleteDiscussions: false,

    canComment: true,
    canDeleteAnyComment: true,

    canViewGoals: true,
    canCreateGoals: true,
    canUpdateAnyGoal: true,
    canCompleteGoal: true,
    canDeleteGoals: false,
  },

  MEMBER: {
    canTransferOwnership: false,

    canInviteMembers: false,
    canRemoveMembers: false,
    canChangeRoles: false,
    canViewMembers: true,

    canViewTasks: true,
    canCreateTasks: true,
    canEditAnyTask: false,
    canDeleteAnyTask: false,

    canViewDocs: true,
    canCreateDocs: true,
    canEditAnyDocs: false,
    canDeleteAnyDocs: false,

    canCreateDiscussions: true,
    canEditAnyDiscussion: false,
    canResolveDiscussions: false,
    canReopenDiscussions: false,
    canDeleteDiscussions: false,

    canComment: true,
    canDeleteAnyComment: false,

    canViewGoals: true,
    canCreateGoals: false,
    canUpdateAnyGoal: false,
    canCompleteGoal: false,
    canDeleteGoals: false,
  },
} as const
