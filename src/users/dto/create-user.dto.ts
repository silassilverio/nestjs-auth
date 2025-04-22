import { Roles } from "generated/prisma";

export class CreateUserDto {
    name: string;
    email: string;
    password: string;
    role: Roles;
    permissions?: PrismaJson.PermissionsList;
}
