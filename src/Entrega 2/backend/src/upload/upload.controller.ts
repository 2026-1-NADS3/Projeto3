import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 50 * 1024 * 1024 }), // 50MB max
          // Expressão regular para permitir imagens comuns e formatos de vídeo (mp4, webm, quicktime)
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|mp4|webm|quicktime)$/,
          }),
        ],
        fileIsRequired: true,
      }),
    )
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }

    return {
      url: this.uploadService.generateFileUrl(file.filename),
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  @Post('multiple')
  @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
  @UseInterceptors(FilesInterceptor('files', 10))
  uploadMultiple(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('Nenhum arquivo enviado.');
    }

    const allowedTypes = /(jpg|jpeg|png|mp4|webm|quicktime)$/;
    const invalidFile = files.find((file) => !allowedTypes.test(file.mimetype));

    if (invalidFile) {
      throw new BadRequestException(
        `Tipo de arquivo inválido: ${invalidFile.originalname}`,
      );
    }

    return {
      urls: files.map((file) =>
        this.uploadService.generateFileUrl(file.filename),
      ),
      files: files.map((file) => ({
        url: this.uploadService.generateFileUrl(file.filename),
        filename: file.filename,
        mimetype: file.mimetype,
        size: file.size,
      })),
    };
  }
}
