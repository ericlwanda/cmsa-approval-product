
import db from "@/lib/db";
import authorize from "@/lib/middleware";
import ApiRequest from "@/lib/validators/user/api_request";
import { NextResponse } from "next/server";
import { getParam } from "@/lib/utils";
import { AdditionalAddSchema} from "@/lib/validators/application/validation";

const additionalApplication = async (request: ApiRequest) => {
  const data = await request.json();
  const application_id = getParam(request.url);

  const { error } = AdditionalAddSchema.safeParse(data);

  if (error) {
    return NextResponse.json(
      { message: error.formErrors.fieldErrors },
      { status: 400 }
    );
  }

  const {info,id} = data;

  try {

const user = await db.users.findUnique({
where:{id:id,archive:0,status:1}
})

if(!user){
    return NextResponse.json(
        { message: "can't add" },
        { status: 400 }
      );  
}


    await db.$transaction(async (prisma) => {

      const additional = await prisma.additionals.create({
        data: {
            info:info,
          applications: {
            connect: { id: application_id },
          },
          users: {
            connect: { id: id },
          },
          created_by: request?.user?.id ?? "",
          updated_by: request?.user?.id ?? "",
        },
      });
    });


    // Return a successful response
    return NextResponse.json(
      { message: "Success" },
      { status: 200 }
    );
    
  } catch (error: any) {
    console.log(error);

    return NextResponse.json({ message: error.message }, { status: 400 });
  }
};

export const POST = authorize(additionalApplication);
