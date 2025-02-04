// import { Injectable } from '@nestjs/common';
// import { MulterOptionsFactory, MulterModuleOptions } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';
// import { v4 as uuidv4 } from 'uuid';

// @Injectable()
// export class MulterConfigService implements MulterOptionsFactory {
//     createMulterOptions(): MulterModuleOptions {
//         return {
//             storage: diskStorage({
//                 destination: './images',
//                 filename: (req, file, callback) => {
//                     const filename = `${uuidv4()}-${file.originalname}`;
//                     callback(null, filename);
//                 },
//             }),
//         };
//     }
// }
