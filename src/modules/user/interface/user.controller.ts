import { Request, Response } from 'express';
import { z } from 'zod';
import { BaseController } from '../../../shared/http/base-controller.js';
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
    private readonly createRoleUC: CreateRoleUseCase,
    private readonly updateRoleUC: UpdateRoleUseCase,
    private readonly deleteRoleUC: DeleteRoleUseCase,
    private readonly assignRoleUC: AssignRoleUseCase,
    private readonly removeRoleUC: RemoveRoleUseCase,
    private readonly listRolesUC: ListRolesUseCase,
    private readonly getUserRolesUC: GetUserRolesUseCase,
    private readonly listUsersUC: ListUsersUseCase,
  ) {
    super();
  }

  register = async (req: Request, res: Response) => {
    const schema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
      username: z.string().min(2).optional(),
      displayName: z.string().min(2).optional(),
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

  createRole = async (req: Request, res: Response) => {
    const schema = z.object({
      name: z.string().min(1),
    });

    const input = schema.parse(req.body);
    const result = await this.createRoleUC.execute(input);

    res.status(201).json(ok(result));
  };

  updateRole = async (req: Request, res: Response) => {
    const paramsSchema = z.object({
      roleId: z.string().uuid(),
    });
    const bodySchema = z.object({
      name: z.string().min(1),
    });

    const { roleId } = paramsSchema.parse(req.params);
    const { name } = bodySchema.parse(req.body);
    const result = await this.updateRoleUC.execute({ id: roleId, name });

    res.json(ok(result));
  };

  deleteRole = async (req: Request, res: Response) => {
    const schema = z.object({
      roleId: z.string().uuid(),
    });

    const { roleId } = schema.parse(req.params);
    await this.deleteRoleUC.execute(roleId);

    res.json(ok({}));
  };

  assignRole = async (req: Request, res: Response) => {
    const paramsSchema = z.object({
      userId: z.string().uuid(),
    });
    const bodySchema = z.object({
      roleName: z.string().min(1),
    });

    const { userId } = paramsSchema.parse(req.params);
    const { roleName } = bodySchema.parse(req.body);
    await this.assignRoleUC.execute({ userId, roleName });

    res.json(ok({}));
  };

  removeRole = async (req: Request, res: Response) => {
    const schema = z.object({
      userId: z.string().uuid(),
      roleName: z.string().min(1),
    });

    const input = schema.parse(req.params);
    await this.removeRoleUC.execute(input);

    res.json(ok({}));
  };

  listRoles = async (req: Request, res: Response) => {
    const roles = await this.listRolesUC.execute();
    res.json(ok(roles));
  };

  getUserRoles = async (req: Request, res: Response) => {
    const schema = z.object({
      userId: z.string().uuid(),
    });

    const { userId } = schema.parse(req.params);
    const roles = await this.getUserRolesUC.execute(userId);

    res.json(ok(roles));
  };

  listUsers = async (req: Request, res: Response) => {
    const users = await this.listUsersUC.execute();
    res.json(ok(users));
  };
}
