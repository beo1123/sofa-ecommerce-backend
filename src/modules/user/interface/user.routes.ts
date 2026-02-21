import { Router } from 'express';
import { PgUserRepository } from '../infrastructure/user.repo.pg.js';
import { PgRoleRepository } from '../infrastructure/role.repo.pg.js';
import { JwtService } from '../../../shared/auth/jwt.service.js';
import { RegisterUserUseCase } from '../application/register-user.usecase.js';
import { LoginUseCase } from '../application/login.usecase.js';
import { RefreshTokenUseCase } from '../application/refresh-token.usecase.js';
import { GetMeUseCase } from '../application/get-me.usecase.js';
import { UpdateProfileUseCase } from '../application/update-profile.usecase.js';
import { ChangePasswordUseCase } from '../application/change-password.usecase.js';
import { CreateRoleUseCase } from '../application/create-role.usecase.js';
import { AssignRoleUseCase } from '../application/assign-role.usecase.js';
import { RemoveRoleUseCase } from '../application/remove-role.usecase.js';
import { ListRolesUseCase } from '../application/list-roles.usecase.js';
import { GetUserRolesUseCase } from '../application/get-user-roles.usecase.js';
import { ListUsersUseCase } from '../application/list-users.usecase.js';
import { UserController } from './user.controller.js';
import { requireAuth, requireRole } from '../../../shared/auth/auth.middleware.js';
import { enrichUserRoles } from '../../../shared/auth/role.middleware.js';

export function createUserRouter(): Router {
  const userRepo = new PgUserRepository();
  const roleRepo = new PgRoleRepository();
  const jwt = new JwtService(process.env.JWT_ACCESS_SECRET!, process.env.JWT_REFRESH_SECRET!);

  const registerUC = new RegisterUserUseCase(userRepo, jwt);
  const loginUC = new LoginUseCase(userRepo, jwt);
  const refreshUC = new RefreshTokenUseCase(jwt);
  const getMeUC = new GetMeUseCase(userRepo);
  const updateProfileUC = new UpdateProfileUseCase(userRepo);
  const changePasswordUC = new ChangePasswordUseCase(userRepo);
  const createRoleUC = new CreateRoleUseCase(roleRepo);
  const assignRoleUC = new AssignRoleUseCase(userRepo, roleRepo);
  const removeRoleUC = new RemoveRoleUseCase(userRepo, roleRepo);
  const listRolesUC = new ListRolesUseCase(roleRepo);
  const getUserRolesUC = new GetUserRolesUseCase(userRepo);
  const listUsersUC = new ListUsersUseCase(userRepo);

  const controller = new UserController(
    registerUC,
    loginUC,
    refreshUC,
    getMeUC,
    updateProfileUC,
    changePasswordUC,
    createRoleUC,
    assignRoleUC,
    removeRoleUC,
    listRolesUC,
    getUserRolesUC,
    listUsersUC,
  );

  const r = Router();

  // =========================================================
  // PUBLIC: Auth routes
  // =========================================================
  r.post('/auth/register', controller.handle(controller.register));
  r.post('/auth/login', controller.handle(controller.login));
  r.post('/auth/refresh', controller.handle(controller.refresh));

  // =========================================================
  // PROTECTED: User routes
  // =========================================================
  r.use(requireAuth);
  r.use(enrichUserRoles);

  r.get('/me', controller.handle(controller.getMe));
  r.patch('/me/profile', controller.handle(controller.updateProfile));
  r.patch('/me/password', controller.handle(controller.changePassword));

  // =========================================================
  // ADMIN: User and Role management
  // =========================================================
  r.use(requireRole('admin'));

  r.get('/users', controller.handle(controller.listUsers));

  // Roles management
  r.post('/roles', controller.handle(controller.createRole));
  r.get('/roles', controller.handle(controller.listRoles));
  r.get('/users/:userId/roles', controller.handle(controller.getUserRoles));
  r.post('/users/roles/assign', controller.handle(controller.assignRole));
  r.post('/users/roles/remove', controller.handle(controller.removeRole));

  return r;
}
