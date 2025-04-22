import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { CaslAbilityService } from 'src/casl/casl-ability/casl-ability.service';
import { accessibleBy } from '@casl/prisma';

@Injectable()
export class UsersService {
  constructor(
    private prismaService: PrismaService,
    private abilityService: CaslAbilityService
  ) { }

  create(createUserDto: CreateUserDto) {
    const ability = this.abilityService.ability;

    if (!ability.can('create', 'User')) {
      return new UnauthorizedException('Unauthorized');
    }

    return this.prismaService.user.create({
      data: {
        ...createUserDto,
        password: bcrypt.hashSync(createUserDto.password, 10)
      }
    });
  }

  findAll() {
    const ability = this.abilityService.ability;

    if (!ability.can('read', 'User')) {
      return new UnauthorizedException('Unauthorized');
    }

    return this.prismaService.user.findMany({
      where: {
        AND: [accessibleBy(ability, 'read').User]
      }
    });
  }

  findOne(id: string) {
    const ability = this.abilityService.ability;

    if (!ability.can('read', 'User')) {
      return new UnauthorizedException('Unauthorized');
    }

    return this.prismaService.user.findUnique({ where: { id } });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    const ability = this.abilityService.ability;

    if (!ability.can('update', 'User')) {
      return new UnauthorizedException('Unauthorized');
    }

    return this.prismaService.user.update({
      where: { id },
      data: {
        ...updateUserDto,
        ...updateUserDto.password && { password: bcrypt.hashSync(updateUserDto.password, 10) }
      }
    })
  }

  remove(id: string) {
    const ability = this.abilityService.ability;

    if (!ability.can('delete', 'User')) {
      return new UnauthorizedException('Unauthorized');
    }

    return this.prismaService.user.delete({ where: { id } });
  }
}
