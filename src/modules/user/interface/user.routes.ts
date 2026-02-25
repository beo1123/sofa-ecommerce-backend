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
import { UpdateRoleUseCase } from '../application/update-role.usecase.js';
import { DeleteRoleUseCase } from '../application/delete-role.usecase.js';
import { AssignRoleUseCase } from '../application/assign-role.usecase.js';
import { RemoveRoleUseCase } from '../application/remove-role.usecase.js';
import { ListRolesUseCase } from '../application/list-roles.usecase.js';
import { GetUserRolesUseCase } from '../application/get-user-roles.usecase.js';
import { ListUsersUseCase } from '../application/list-users.usecase.js';
import { UserController } from './user.controller.js';
import { requireAuth, requireRole } from '../../../shared/auth/auth.middleware.js';
import { enrichUserRoles } from '../../../shared/auth/role.middleware.js';

export function createAuthRouter(): Router {
  const userRepo = new PgUserRepository();
  const jwt = new JwtService(process.env.JWT_ACCESS_SECRET!, process.env.JWT_REFRESH_SECRET!);

  const registerUC = new RegisterUserUseCase(userRepo, jwt);
  const loginUC = new LoginUseCase(userRepo, jwt);
  const refreshUC = new RefreshTokenUseCase(jwt);

  const controller = new UserController(
    registerUC,
    loginUC,
    refreshUC,
    new GetMeUseCase(userRepo),
    new UpdateProfileUseCase(userRepo),
    new ChangePasswordUseCase(userRepo),
    new CreateRoleUseCase(new PgRoleRepository()),
    new UpdateRoleUseCase(new PgRoleRepository()),
    new DeleteRoleUseCase(new PgRoleRepository()),
    new AssignRoleUseCase(userRepo, new PgRoleRepository()),
    new RemoveRoleUseCase(userRepo, new PgRoleRepository()),
    new ListRolesUseCase(new PgRoleRepository()),
    new GetUserRolesUseCase(userRepo),
    new ListUsersUseCase(userRepo),
  );

  const r = Router();

  r.post('/register', controller.handle(controller.register));
  r.post('/login', controller.handle(controller.login));
  r.post('/refresh', controller.handle(controller.refresh));

  return r;
}

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
  const updateRoleUC = new UpdateRoleUseCase(roleRepo);
  const deleteRoleUC = new DeleteRoleUseCase(roleRepo);
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
    updateRoleUC,
    deleteRoleUC,
    assignRoleUC,
    removeRoleUC,
    listRolesUC,
    getUserRolesUC,
    listUsersUC,
  );

  const r = Router();

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

  r.get('/', controller.handle(controller.listUsers));

  // =========================================================
  // ADMIN: Roles management
  // =========================================================
  r.get('/roles', controller.handle(controller.listRoles));
  r.post('/roles', controller.handle(controller.createRole));
  r.put('/roles/:roleId', controller.handle(controller.updateRole));
  r.delete('/roles/:roleId', controller.handle(controller.deleteRole));
  r.get('/:userId/roles', controller.handle(controller.getUserRoles));
  r.post('/:userId/roles', controller.handle(controller.assignRole));
  r.delete('/:userId/roles/:roleName', controller.handle(controller.removeRole));

  return r;
}
