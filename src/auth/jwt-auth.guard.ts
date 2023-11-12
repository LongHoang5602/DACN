import {
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { IS_PUBLIC_KEY, IS_PUBLIC_PERMISSION } from 'src/decorator/customize';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }

    handleRequest(err, user, info, context: ExecutionContext) {
        const isSkipPermission = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_PERMISSION, [
            context.getHandler(),
            context.getClass(),
        ]);
        const request: Request = context.switchToHttp().getRequest()
        // You can throw an exception based on either "info" or "err" arguments
        if (err || !user) {
            throw err || new UnauthorizedException("Token không hợp lệ");
        }
        //check permission 
        const targetMethod = request.method
        const targetEndpoint = request.route?.path as string
        const permissions = user?.permissions ?? []
        let isExist = permissions.find(permissions =>
            targetMethod === permissions.method
            &&
            targetEndpoint === permissions.apiPath


        )
        const check = permissions.map(item => {
            if (item.method === targetMethod && item.apiPath === targetEndpoint) {
                console.log(item.method)
                console.log(targetMethod)
                console.log(item.apiPath)
                console.log(targetEndpoint)
            }

        })

        if (targetEndpoint.startsWith("/api/v1/auth")) {
            isExist = true
        }
        if (targetEndpoint.startsWith("/api/v1/learner")) {
            isExist = true
        }
        if (targetEndpoint.startsWith("/api/v1/vocabulary")) {
            isExist = true
        }
        if (!isExist && !isSkipPermission) {
            throw new ForbiddenException("Bạn không có quyền ")
        }
        return user;
    }
}