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
    async getZip(@Req() req: any, @Res() res: Response){
        const projectName: string = this.uploadQue.find((item: UploadQue) => {
            return item.token = req.param.tokens
        }).project;


        console.log(projectName);
        req.pipe(req.busboy);
        let fileToWrite: Stream, writeStream: WriteStream, fail = true;

        req.busboy.on('file', (fieldname: string, file: Stream, filename: string) => {
            
            fileToWrite = file;
            console.log(filename);
            // const fsstream = createWriteStream(this.common.pathToProjectFolder('samin') + '.zip');
            /*file.pipe(fsstream);
            fsstream.on('close', () => {
                fail = false;
                res.send({success: true, message: 'Writing Done'});
            });

            setTimeout(() => {
                if(fail) {
                    res.send({success: false, message: 'Writing Failed'})
                }
            }, 2000);*/

        });

        req.busboy.on('field', (filedname: string, value: string, ft: string, vt: string) => {
            console.log(filedname, value);
            if(filedname == 'project') {
                
                writeStream = createWriteStream(this.common.pathToProjectFolder(value) + '.zip')
            }
        });

        req.busboy.on('finish', () => {
            console.log('finishing');
            fileToWrite.pipe(writeStream);
            writeStream.on('close', () => {
                fail = false;
                res.send({success: true, message: 'Writing Done'});
            });
        })

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
        

        return {project: projectNameObject.name, token: suid(12), hasFiles: fileList.length > 0}
    }
}


