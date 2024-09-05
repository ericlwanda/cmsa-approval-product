export const dynamic = 'force-dynamic'
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";

async function profile(request: ApiRequest) {

    const user = request.user

    if(!user) 
    return Response.json({message: 'User is unauthenticated'}, {status: 401 })

    return Response.json(user)
}

export const GET = authorize(profile)