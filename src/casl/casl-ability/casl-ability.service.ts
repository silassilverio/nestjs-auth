import { Injectable, Scope } from '@nestjs/common';
import { Post, Roles, User } from 'generated/prisma';
import { AbilityBuilder, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';

export type PermActions = 'manage' | 'create' | 'read' | 'update' | 'delete';

export type PermissionResources = Subjects<{ User: User; Post: Post }> | 'all';

export type AppAbility = PureAbility<
    [PermActions, PermissionResources],
    PrismaQuery
>;

export type DefinePermissions = (
    user: User,
    builder: AbilityBuilder<AppAbility>,
) => void;

const rolePermissionsMap: Record<Roles, DefinePermissions> = {
    ADMIN(user, { can }) {
        can('manage', 'all');
    },
    EDITOR(user, { can }) {
        can('create', 'Post');
        can('read', 'Post');
        can('update', 'Post');
    },
    WRITER(user, { can }) {
        can('create', 'Post');
        can('read', 'Post', { authorId: user.id });
        can('update', 'Post', { authorId: user.id });
    },
    READER(user, { can }) {
        can('read', 'Post', { published: true });
    }
}

@Injectable({ scope: Scope.REQUEST })
export class CaslAbilityService {
    ability: AppAbility;

    createForUser(user: User) {
        const builder = new AbilityBuilder<AppAbility>(createPrismaAbility);
        //@ts-expect-error aaaa
        user.permissions?.forEach(permission => {
            builder.can(permission.action, permission.resource, permission.condition);
        })
        rolePermissionsMap[user.role](user, builder);
        this.ability = builder.build();
        return this.ability;
    }
}
