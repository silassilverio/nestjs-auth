import { SetMetadata } from "@nestjs/common";
import { Roles } from "generated/prisma";

export const RequiredRoles = (...roles: Roles[]) => SetMetadata('roles', roles);