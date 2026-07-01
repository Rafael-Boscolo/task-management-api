import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { FindAllParameters, TaskDto, TaskStatusEnum } from './task.dto';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/db/entities/task.entity';
import { FindOptionsWhere, Like, Repository } from 'typeorm';

@Injectable()
export class TaskService {

    constructor(
        @InjectRepository(TaskEntity)
        private readonly taskRepository: Repository<TaskEntity>
    ){ }

    private tasks: TaskDto[] = [];

    async create(task: TaskDto): Promise<TaskDto>{
        const taskToSave = {
            title: task.title,
            description: task.description,
            expirationDate: task.expirationDate,
            status: TaskStatusEnum.TO_DO,
        }

        const createdTask = await this.taskRepository.save(taskToSave);

        return this.mapEntityToDto(createdTask);
    }

    async findById(id: string): Promise<TaskDto> {
        const foundTaks = await this.taskRepository.findOne({ where: { id }})

        if(!foundTaks) {
            throw new HttpException(`Task with id ${id} not found`, HttpStatus.NOT_FOUND);
        }

        return this.mapEntityToDto(foundTaks);
    }

    async findAll(params: FindAllParameters): Promise<TaskDto[]> {
        const searchParams: FindOptionsWhere<TaskDto> = {}

        if(params.title) {
            searchParams.title = Like(`%${params.title}%`)
        }

        if(params.status) {
            searchParams.status = Like(`%${params.status}%`)
        }

        const taskFound = await this.taskRepository.find({ where: searchParams});

        return taskFound.map(taskEntity => this.mapEntityToDto(taskEntity));
    }

    async update(id: string, task: TaskDto) {
        const foundTask = await this.taskRepository.findOne({ where: {id} });

        if(!foundTask) {
            throw new HttpException(`Task with id ${task.id} not found`, HttpStatus.BAD_REQUEST);
        }

        await this.taskRepository.update(id, this.mapEntityToDto(task))
    }

    async remove(id: string) {

        const result = await this.taskRepository.delete(id)

        if(!result.affected){
            throw new HttpException(`This with id ${id} not found.`, HttpStatus.BAD_REQUEST);
        }
    }

    private mapEntityToDto(taskEntity: TaskEntity): TaskDto{
        return {
            id: taskEntity.id,
            title: taskEntity.title,
            description: taskEntity.description,
            expirationDate: taskEntity.expirationDate,
            status: TaskStatusEnum[taskEntity.status]
        }
    }

    private mapDtoToEntity(taskDto: TaskDto): Partial<TaskEntity> {
        return {
            id: taskDto.id,
            title: taskDto.title,
            description: taskDto.description,
            expirationDate: taskDto.expirationDate,
            status: taskDto.status.toString()
        }
    }
}
