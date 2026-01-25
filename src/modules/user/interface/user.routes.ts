import { Router } from 'express';
import { PgUserRepository } from '../infrastructure/user.repo.pg.js';
import { JwtService } from '../../../shared/auth/jwt.service.js';
import { RegisterUserUseCase } from '../application/register-user.usecase.js';
import { LoginUseCase } from '../application/login.usecase.js';
import { RefreshTokenUseCase } from '../application/refresh-token.usecase.js';
import { GetMeUseCase } from '../application/get-me.usecase.js';
import { UpdateProfileUseCase } from '../application/update-profile.usecase.js';
import { ChangePasswordUseCase } from '../application/change-password.usecase.js';
import { UserController } from './user.controller.js';
import { requireAuth } from '../../../shared/auth/auth.middleware.js';

export function createUserRouter(): Router {
  const repo = new PgUserRepository();
  const jwt = new JwtService(process.env.JWT_ACCESS_SECRET!, process.env.JWT_REFRESH_SECRET!);

  const registerUC = new RegisterUserUseCase(repo, jwt);
  const loginUC = new LoginUseCase(repo, jwt);
  const refreshUC = new RefreshTokenUseCase(jwt);
  const getMeUC = new GetMeUseCase(repo);
  const updateProfileUC = new UpdateProfileUseCase(repo);
  const changePasswordUC = new ChangePasswordUseCase(repo);

  const controller = new UserController(
    registerUC,
    loginUC,
    refreshUC,
    getMeUC,
    updateProfileUC,
    changePasswordUC,
  );

  const r = Router();

  // Auth
  r.post('/auth/register', controller.handle(controller.register));
  r.post('/auth/login', controller.handle(controller.login));
  r.post('/auth/refresh', controller.handle(controller.refresh));

  // Me
  r.get('/me', requireAuth, controller.handle(controller.getMe));
  r.patch('/me/profile', requireAuth, controller.handle(controller.updateProfile));
  r.patch('/me/password', requireAuth, controller.handle(controller.changePassword));

  return r;
}
