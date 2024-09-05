import jwt from "jsonwebtoken";
import ApiRequest from "./validators/user/api_request";

const authorize = (
  handler: (request: ApiRequest) => Promise<Response>
) => {
  return async (request: ApiRequest) => {
    try {
      // Extract the Authorization header
      const token = request.headers.get("authorization");

      if (!token) {
        return Response.json(
          { message: "Not authenticated please login" },
          { status: 401 }
        );
      }
      
      const bearerToken = token.split(" ")[1];

      const decoded = jwt.verify(
        bearerToken,
        process.env.JWT_SECRET as string
      ) as {
        user: {
          id: string;
          name: string;
          phone_number: string;
          email: string;
          status: number;
          role:string
        };
      };

      request.user = decoded.user;

      if (!request.user || typeof request.user !== "object") {
        return Response.json(
          { message: "Invalid request data" },
          { status: 400 }
        );
      }

      const response = await handler(request as ApiRequest);

      return response;
    } catch (error:any) {

      return Response.json({ message: error.message }, { status: 403 });
    }
  };
};

export default authorize;
