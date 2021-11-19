import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CommonService } from 'src/common/common.service';
import { FileControllerController } from './file-controller/file-controller.controller';
var busboy = require('connect-busboy');

 
@Module({
  controllers: [FileControllerController],
  providers: [CommonService]
})
export class FileWriterModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(busboy({highWaterMark: 2 * 1024 * 1024})).forRoutes('filewrite/uploadzip');
  }
}
