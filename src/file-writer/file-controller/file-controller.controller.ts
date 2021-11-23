import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { CommonResponse, CommonService } from 'src/common/common.service';
import { ProjectManage } from './project-manager';
import {createWriteStream, WriteStream} from 'fs';
import { Stream } from 'stream';
import {Response} from 'express';
import {suid} from 'rand-token';
 
interface ProjectNameObject {    name: string}
interface UploadQue{project: string, token: string}

@Controller()
export class FileControllerController {
    private projectManager: ProjectManage;
    uploadQue: UploadQue[];

    constructor(private readonly common: CommonService) {
        this.projectManager = new ProjectManage(common);
        this.uploadQue = [];    
    }

    @Get('/projects')
    async getProjects(): Promise<string[]> {
        return this.projectManager.getProject();
    } 

    @Post('/newProject')
    async newProject(@Body() newProjectname: ProjectNameObject): Promise<CommonResponse> {
        try {
            await this.projectManager.createProject(newProjectname.name);
            return {success: true, message: 'Project Added'}
        } catch(e) {
            return {success: false, message: e}
        }
    }

    @Post('/uploadzip/:token')
    getZip(@Req() req: any, @Res() res: Response){
        let removeIndex: number;
        
        const projectName: string = this.uploadQue.find((item: UploadQue, index: number) => {
            removeIndex = index;
            return item.token == req.params.token;
        }).project;
        this.uploadQue.splice(removeIndex, 1);

        req.pipe(req.busboy);
        let fail = true;

        req.busboy.on('file', (fieldname: string, file: Stream, filename: string) => {
            const fsstream = createWriteStream(this.common.pathToProjectFolder(projectName) + '.zip');

            file.pipe(fsstream);
            fsstream.on('close', () => {
                this.common.unzip(projectName);
                fail = false;
                res.send({success: true, message: 'Writing Done'});
            });
        });

        setTimeout(() => {
            if(fail) {
                res.send({success: false, message: 'Writing Failed'});
            }
        }, 2000);

    }

    @Post('/checkProject') 
    async checkProject(@Body() projectNameObject: ProjectNameObject) {
        const token = suid(12);
        const project = projectNameObject.name;
        const fileList = await this.common.folderContents(project);
        this.uploadQue.push({project, token});

        return {project: projectNameObject.name, token, hasFiles: fileList.length > 0}
    }
}


