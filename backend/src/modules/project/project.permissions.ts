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

    canViewDiscussions: true,
    canCreateDiscussions: true,
    canEditAnyDiscussion: true,
    canDeleteDiscussions: true,
    canCloseDiscussions: true,
    canReopenDiscussions: true,

    canComment: true,
    canDeleteAnyComment: true,
    canEditAnyComment: true,


    canViewGoals: true,
    canCreateGoals: true,
    canUpdateAnyGoal: true,
    canCompleteGoal: true,
    canDeleteGoals: true,

    canViewMilestones: true,
    canCreateMilestones: true,
    canUpdateAnyMilestone: true,
    canCompleteMilestone: true,
    canDeleteMilestones: true,
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

    canViewDiscussions: true,
    canCreateDiscussions: true,
    canEditAnyDiscussion: true,
    canCloseDiscussions: true,
    canDeleteDiscussions: false,
    canReopenDiscussions: true,

    canComment: true,
    canEditAnyComment: true,
    canDeleteAnyComment: true,

    canViewGoals: true,
    canCreateGoals: true,
    canUpdateAnyGoal: true,
    canCompleteGoal: true,
    canDeleteGoals: false,

    canViewMilestones: true,
    canCreateMilestones: true,
    canUpdateAnyMilestone: true,
    canCompleteMilestone: true,
    canDeleteMilestones: false,
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

    canViewDiscussions: true,
    canCreateDiscussions: true,
    canEditAnyDiscussion: false,
    canCloseDiscussions: false,
    canDeleteDiscussions: false,
    canReopenDiscussions: false,

    canComment: true,
    canDeleteAnyComment: false,
    canEditAnyComment: true,

    canViewGoals: true,
    canCreateGoals: false,
    canUpdateAnyGoal: false,
    canCompleteGoal: false,
    canDeleteGoals: false,

    canViewMilestones: true,
    canCreateMilestones: false,
    canUpdateAnyMilestone: false,
    canCompleteMilestone: false,
    canDeleteMilestones: false,
  },
} as const
