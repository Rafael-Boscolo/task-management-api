import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import * as taskDto from './task.dto';
import { TaskService } from './task.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('task')
export class TaskController {

    constructor(private readonly taskService: TaskService){ }

    @Post()
    async create(@Body() task: taskDto.TaskDto): Promise<taskDto.TaskDto> {
        return await this.taskService.create(task);
    }

    @Get('/:id')
    async findById(@Param('id') id: string): Promise<taskDto.TaskDto>{
        return this.taskService.findById(id);
    }

    @Get()
    async findAll(@Query() params: taskDto.FindAllParameters): Promise<taskDto.TaskDto[]> {
        return this.taskService.findAll(params);
    }

    @Put('/:id')
    async update(@Param() params: taskDto.TaskRouteParameters, @Body() task: taskDto.TaskDto){
        await this.taskService.update(params.id, task);
    }

    @Delete('/:id')
    async remove(@Param('id') id: string){
        return this.taskService.remove(id);
    }
}
