import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards, NotFoundException } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { RequiredRoles } from 'src/auth/requeired-roles.decorator';
import { RoleGuard } from 'src/auth/role/role.guard';
import { Roles } from 'generated/prisma/client';
import { NotFoundError } from 'rxjs';

@UseGuards(AuthGuard, RoleGuard)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @RequiredRoles(Roles.WRITER, Roles.EDITOR)
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    return this.postsService.create({
      ...createPostDto,
      authorId: req.user.id
    });
  }

  @RequiredRoles(Roles.WRITER, Roles.EDITOR, Roles.READER)
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @RequiredRoles(Roles.WRITER, Roles.EDITOR, Roles.READER)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      return new NotFoundException(`Post with id:${id} not found`);
    }

    return post;
  }

  @RequiredRoles(Roles.WRITER, Roles.EDITOR)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @RequiredRoles(Roles.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
