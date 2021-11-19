import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { CommonResponse, CommonService } from 'src/common/common.service';
import { ProjectManage } from './project-manager';
import {createWriteStream} from 'fs';
import { Stream } from 'stream';
import {Response} from 'express';
 
interface NewProjectRequest {
    name: string
}

@Controller()
export class FileControllerController {
    private projectManager: ProjectManage;

    constructor(private readonly common: CommonService) {
        this.projectManager = new ProjectManage(common);    
    }

    @Get('/projects')
    async getProjects(): Promise<string[]> {
        return this.projectManager.getProject();
    } 

    @Post('/newProject')
    async newProject(@Body() newProjectname: NewProjectRequest): Promise<CommonResponse> {
        try {
            await this.projectManager.createProject(newProjectname.name);
            return {success: true, message: 'Project Added'}
        } catch(e) {
            return {success: false, message: e}
        }
    }

    @Post('/uploadzip')
    async getZip(@Req() req: any, @Res() res: Response){
        req.pipe(req.busboy);

        req.busboy.on('file', (fieldname: string, file: Stream, filename: string) => {
            const fsstream = createWriteStream(this.common.pathToProjectFolder('samin', filename));
            file.pipe(fsstream);
            fsstream.on('close', () => {
                res.send({success: true, message: 'Writing Done'});
            });
        });
    }
}


