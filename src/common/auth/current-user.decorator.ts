import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext)=> {
    if(ctx.getType()==="http"){
        const request = ctx.switchToHttp().getRequest()
        return request.user_id
    }
})