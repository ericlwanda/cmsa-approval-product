import * as z from "zod";
export const CreateApplicationSchema = z.object({
    licenseType: z.string().min(1, { message: "license type is required" }),
    marketValueAmount: z.number().min(1, { message: "market value amount" }),

  });

  export const CreateAttachmentSchema = z.object({
    file: z.string().min(1, { message: "file is required" }),
  });

  export const AssigneeAddSchema = z.object({
    assignees: z
    .array(
      z.object({
        id: z.string().min(1,"id is required"),
      })
    )
  });

  export const CommentAddSchema = z.object({
    comment: z.string().min(1, { message: "comment is required" }),
    id: z.string().min(1, { message: "id is required" }),
  });

  export const RecommendationAddSchema = z.object({
    recommendation: z.string().min(1, { message: "recommendation is required" }),
    id: z.string().min(1, { message: "id is required" }),
  });
  export const AdditionalAddSchema = z.object({
    info: z.string().min(1, { message: "info is required" }),
    id: z.string().min(1, { message: "id is required" }),
  });

  export const ComplianceSchema = z.object({
    complianceStatus: z.string().min(1, { message: "file is required" }),
  });

  