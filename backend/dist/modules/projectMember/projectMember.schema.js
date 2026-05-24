import { z } from 'zod';
import { WorkspaceMemberStatus } from '../../generated/prisma/index.js';
export const PROJECT_MEMBER_ROLES = ['OWNER', 'ADMIN', 'MEMBER'];
const idParam = z.coerce.number().int().positive().transform(Number);
export const projectIdParamSchema = z.object({ projectId: idParam });
export const projectIdAndUserIdParamSchema = z.object({
    projectId: idParam,
    userId: idParam,
});
export const addProjectMemberSchema = z.object({
    userId: idParam,
    role: z.enum(PROJECT_MEMBER_ROLES),
});
export const updateProjectMemberSchema = z
    .object({
    role: z.enum(PROJECT_MEMBER_ROLES).optional(),
    status: z.nativeEnum(WorkspaceMemberStatus).optional(),
})
    .refine(data => data.role !== undefined || data.status !== undefined, {
    message: 'At least one of role or status must be provided',
});
export const exitProjectSchema = z.object({
    userId: idParam.optional(),
});
//# sourceMappingURL=projectMember.schema.js.map