import type {
    PermActions,
    PermissionResources
} from '../../src/casl/casl-ability.service';

declare global {
    namespace PrismaJson {
        type PermissionsList = Array<{
            action: PermActions,
            resource: PermissionResources,
            condition?: Record<string, any>
        }>;
    }
}