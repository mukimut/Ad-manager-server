import { Test, TestingModule } from '@nestjs/testing';
import { CommonService } from './common.service';

describe('CommonService', () => {
  let service: CommonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonService],
    }).compile();

    service =  module.get<CommonService>(CommonService);
  });

 /* it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should be true', () => {
    expect(service.isFileNameValid('hello_HELLO_454')).toBeTruthy();
  })

  it('should be false', () => {
    expect(service.isFileNameValid('hello.HELLO_454')).toBeFalsy();
  })*/

  test('Empty array', () => {
    return service.folderContents().then((data: string[]) => {
      console.log(data);
      expect(data).toContain('test_folder');
      expect(data).toContain('test_file.txt');
    })
  })


  // test('rejection', () => {
  //   return service.createFolder('samin.sum').catch(e => {
  //     console.log('here ' + e);
  //     expect(e).toBeTruthy();
  //   })
  // })

  
});
