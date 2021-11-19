import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FileWriterModule } from './file-writer/file-writer.module';
import {RouterModule} from '@nestjs/core'
import { CommonService } from './common/common.service';

 
@Module({
  imports: [
    FileWriterModule, 
    CacheModule.register({isGlobal: true}), 
    RouterModule.register([{path: 'filewrite', module: FileWriterModule}])
  ],
  controllers: [AppController],
  providers: [AppService, CommonService],
})
export class AppModule {}
