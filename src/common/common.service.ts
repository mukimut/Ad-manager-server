import { Injectable } from '@nestjs/common';
import * as path from 'path';
import { readdir, mkdir } from 'fs/promises';
import {exec} from 'child_process'
const approot: string = require('app-root-path').toString();
const projectFolderName = 'ad_projects';

@Injectable()
export class CommonService {
    isFileNameValid(fileName: string): boolean {
        const length = fileName.length,
            smallA = 'a'.charCodeAt(0),
            smallZ = 'z'.charCodeAt(0),
            bigA = 'A'.charCodeAt(0),
            bigZ = 'Z'.charCodeAt(0),
            zero = '0'.charCodeAt(0),
            nine = '9'.charCodeAt(0),
            underscore = '_'.charCodeAt(0);

        let valid = true;
        for(let i = 0; i < length; i++) {
            const charCode = fileName.charCodeAt(i);

            if (charCode == underscore) continue;
            if(charCode >= smallA && charCode <= smallZ) continue;
            if(charCode >= bigA && charCode <= bigZ) continue;
            if(charCode >= zero && charCode <= nine) continue;

            valid = false;
            break;
        }

        return valid;
    }

    folderContents(projectName: string = ''): Promise<string[]> {
        const folderPath = path.join(approot, projectFolderName, projectName);
        return readdir(folderPath);
    }

    createFolder(folderName: string): Promise<void> {
        return this.folderContents().then((folders: string[]) => {
            if(folders.includes(folderName)) {
                return Promise.reject('Project already exits');
            } else if(!this.isFileNameValid(folderName)) {
                return Promise.reject('Project name invalid');
            } else {
                return mkdir(path.join(projectFolderName,folderName));
            }
        });
    }

    pathToProjectFolder(projectName: string): string {
        return path.join(approot, projectFolderName, projectName, projectName);
    }

    unzip(project: string): Promise<void> {
        if(process.platform == 'win32') {
            const zipPath = path.join(approot, projectFolderName, project, project + '.zip');
            const destinationPath = path.join(approot, projectFolderName, project);
            const command = 'tar -xf "' + zipPath + '" -C "' + destinationPath + '"';
            
            return new Promise((resolve, reject) => {
                exec(command, (e, out: String, stderror: String) => {
                    if(e || stderror) reject('File not written');
                    else resolve();
                });
            })
            
        } else {
            console.error('Unix not implemented yet')
        }
    }
}

export interface CommonResponse {success: boolean, message: string}