// import bcrypt from "bcryptjs";
// import db from "@/lib/db";
// import authorize from "@/lib/middleware";
// import ApiRequest from "@/lib/validators/user/api_request";
// import { NextResponse } from "next/server";
// import { CreateApplicationSchema } from "@/lib/validators/application/validation";
// import { getParam, uploadFile} from "@/lib/utils";


// const updateApplication = async (request: ApiRequest) => {
//   const data = await request.json();
//   const id = getParam(request.url);


//   const { error } = CreateApplicationSchema.safeParse(data);

//   if (error) {
//     return NextResponse.json(
//       { message: error.formErrors.fieldErrors },
//       { status: 400 }
//     );
//   }

//   const {licenseType,} = data;

// // Assuming 'attachments' is an array of attachment objects
 
// const application = await db.applications.update({
//     where:{id},
//   data: {
//     license_types: {
//       connect: { id: licenseType },
//     },
//     updated_at: new Date(),
//     updated_by: request?.user?.id ?? "",
//   },
// });


// // Return success response
// return Response.json(
//   { message: "Application created successfully"},
//   { status: 201 }
// );


// };

// export const PUT = authorize(updateApplication);
