import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { Request, Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChatGroupDto } from './dto/chat-group.dto';
import { CreateGroupDto } from './dto/create-group.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { imagedto } from './dto/imagedto.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Oneuserdto } from './dto/oneuser.dto';
import { SimpleUserDto } from './dto/simple-user.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get()
  async showUsers(): Promise<User[]> {
    return this.authService.showAll();
  }

  @Get('chat-groupsreal')
  async getChatGroups(): Promise<ChatGroupDto[]> {
    return this.authService.getChatGroups();
  }

  @Post('change-password/:id')
  async changePassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<User | null> {
    return this.authService.changePassword(id, changePasswordDto);
  }

  @Post('oneuser/:id')
  async findOneByEmail(@Param('id', ParseIntPipe) id: number,
    @Body() oneuserdto: Oneuserdto): Promise<User | null> {
    return this.authService.findById(id, oneuserdto);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<{ access_token: string }> {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<{ access_token: string } | null> {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: AuthenticatedRequest): Promise<User> {
    return req.user;
  }

  @Post('upload/:userId')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads/profile-pictures',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = extname(file.originalname);
        cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
  }))
  async uploadProfilePicture(
    @Param('userId', ParseIntPipe) userId: number,
    @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    const imagePath = `/uploads/profile-pictures/${file.filename}`;
    const imagedto: imagedto = {
      id: null,
      email: null,
      name: null,
      address: null,
      image: imagePath,
      dob: null,
    };
    await this.authService.updateUserProfilePicture(userId, imagedto);
    console.log('Upload Profile Controller')
    console.log(await this.authService.showAll())

    return { message: 'Profile picture uploaded successfully', image: imagePath };
  }

  @Get('loggedinusers')

  async getLoggedInUsers(): Promise<SimpleUserDto[]> {
    console.log('Getting loggedinusers')
    return this.authService.getLoggedInUsers();
  }

  @Get(':image')

  async serveImage(@Param('image') image: string, @Res() res: Response) {

    const imagePath = image;
    res.sendFile(imagePath, { root: '.' });
  }

  @Post('create-group')
  async createGroup(@Body() createGroupDto: CreateGroupDto) {
    return this.authService.createGroup(createGroupDto);
  }




}
