import { readdir } from 'fs/promises';
import * as path from 'path';
import { CommonService } from 'src/common/common.service';

export class ProjectManage {
    private projectRoot = 'ad_projects';
    private approot: string = require('app-root-path').toString();
    private projects: string[];
    private commonService: CommonService;

    constructor(commonservice: CommonService) {
        const folderPath = path.join(this.approot, this.projectRoot);
        readdir(folderPath).then((folders: string[]) => this.projects = folders);
        this.commonService = commonservice;
    }

    createProject(projectName: string): Promise<void> {
        if(this.projects.includes(projectName)) {
            return Promise.reject('Project Exists')
        }

        return this.commonService.createFolder(projectName).then(() => {
            this.projects.push(projectName);
            return Promise.resolve();
        }).catch((e: string) => {
            return Promise.reject(e);
        });
    }

    getProject(): string[] {
        return this.projects;
    }
}