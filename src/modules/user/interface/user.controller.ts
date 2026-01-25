import { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController } from '../../../shared/http/base-controller.js';
import { RegisterUserUseCase } from '../application/register-user.usecase.js';
import { LoginUseCase } from '../application/login.usecase.js';
import { RefreshTokenUseCase } from '../application/refresh-token.usecase.js';
import { GetMeUseCase } from '../application/get-me.usecase.js';
import { UpdateProfileUseCase } from '../application/update-profile.usecase.js';
import { ChangePasswordUseCase } from '../application/change-password.usecase.js';
import { ok } from '../../../shared/http/api-response.js';

type AuthedRequest = Request & { user?: { sub: string; email: string } };

export class UserController extends BaseController {
  constructor(
    private readonly registerUC: RegisterUserUseCase,
    private readonly loginUC: LoginUseCase,
    private readonly refreshUC: RefreshTokenUseCase,
    private readonly getMeUC: GetMeUseCase,
    private readonly updateProfileUC: UpdateProfileUseCase,
    private readonly changePasswordUC: ChangePasswordUseCase,
  ) {
    super();
  }

  register = async (req: Request, res: Response) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const input = schema.parse(req.body);
    const result = await this.registerUC.execute(input);

    res.status(201).json(ok(result));
  };

  login = async (req: Request, res: Response) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const input = schema.parse(req.body);
    const result = await this.loginUC.execute(input);

    res.json(ok(result));
  };

  refresh = async (req: Request, res: Response) => {
    const schema = z.object({
      refreshToken: z.string().min(1),
    });

    const { refreshToken } = schema.parse(req.body);
    const result = await this.refreshUC.execute(refreshToken);

    res.json(ok(result));
  };

  getMe = async (req: AuthedRequest, res: Response) => {
    const userId = req.user!.sub;
    const me = await this.getMeUC.execute(userId);
    res.json(ok(me));
  };

  updateProfile = async (req: AuthedRequest, res: Response) => {
    const schema = z.object({
      username: z.string().min(2).optional(),
      displayName: z.string().min(2).optional(),
    });

    const data = schema.parse(req.body);
    await this.updateProfileUC.execute(req.user!.sub, data);

    res.json(ok({}));
  };

  changePassword = async (req: AuthedRequest, res: Response) => {
    const schema = z.object({
      oldPassword: z.string().min(6),
      newPassword: z.string().min(6),
    });

    const input = schema.parse(req.body);
    await this.changePasswordUC.execute(req.user!.sub, input);

    res.json(ok({}));
  };
}
