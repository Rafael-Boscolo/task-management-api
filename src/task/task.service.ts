import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { FindAllParameters, TaskDto } from './task.dto';

@Injectable()
export class TaskService {

    private tasks: TaskDto[] = [];

    create(task: TaskDto){
        this.tasks.push(task);
        // console.log(this.tasks)
    }

    findById(id: string): TaskDto {
        const foundTaks = this.tasks.filter(t => t.id === id);

        if(foundTaks.length) {
            return foundTaks[0];
        }

        throw new HttpException(`Task with id ${id} not found`, HttpStatus.NOT_FOUND);
    }

    findAll(params: FindAllParameters): TaskDto[] {
        return this.tasks.filter(t => {
            let match = true;

            if(params.title != undefined && !t.title.includes(params.title)){
                match = false;
            }

            if(params.status != undefined && !t.status.includes(params.status)){
                match = false;
            }

            return match;
        })
    }

    update(task: TaskDto) {
        let taskIndex = this.tasks.findIndex(t => t.id === task.id);

        if(taskIndex >= 0){
            this.tasks[taskIndex] = task;
            console.log(this.tasks);
            return;
        }

        throw new HttpException(`Task with id ${task.id} not found`, HttpStatus.BAD_REQUEST);
    }

    remove(id: string) {
        let taskIndex = this.tasks.findIndex(t => t.id === id);

        console.log(taskIndex);

        if(taskIndex >= 0 ) {
            this.tasks.splice(taskIndex, 1);
            return;
        }

        throw new HttpException(`This with id ${id} not found.`, HttpStatus.BAD_REQUEST);
    }
}
