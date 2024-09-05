import { license } from "@prisma/client";

export interface IUser {
  role?: string;
  id: string;
  name: string;
  email: string;
  phone_number: string;
  status: number;
}

export interface ICompany {
  id: string;
  name: string;
  email: string;
  office_location:string;
  phone_number: string;
  fax:string;
  website:string;
  address:string;
  region:string;
  po_box:string;
  status: number;
}

export interface ILoginResponse {
  AccessToken: string;
  userInfo: User;
  message: string;
  success: boolean;
}

export interface User {
  userInfo: UserInfo;
  AccessToken: string;
  success: boolean;
  message: string;
}

export interface UserInfo {
  role?: string;
  name: string;
  id: string;
  phone_number: string;
  email: string;
}

export interface IRegisterResponse {
  message: string;
  success: boolean;
  pin_id: string;
}

export interface IRole {
  id: number;
  name: string;
}



export interface ILicenseType {
  id: string;
  name: string;
  applications:Application[];
  licenses:license[]
}

export interface IPaymentType {
  id: string;
  name: string;
  created_by:string;
  license_types:ILicenseType;
  amount:number;
  type:number;
  for_company:number
}

export interface IAttachmentType {
  id: string;
  name: string;
  created_by:string;
  license_types:ILicenseType;
  archive:number;
  type:number;
}

export interface IAttachment {
  id: string;
  file: string;
  attachment_types:IAttachmentType;
  compliance:string;
  archive:number
}

export interface IReport {
  id: string;
  name: string;
  file: string;
  archive:number
}










export interface IComment {
  id: string;
  comment: string;
  users?: {
    name: string;
    role: string;
  };
}

export interface IRecommendation {
  id: string;
  recommendation: string;
  users?: {
      name: string;
      role: string;
    };
}
export interface IAdditionals {
  id: string;
  info: string;
  users?: {
      name: string;
      role: string;
    };
}

export interface IAsignees {
  id: string;
  users?: {
    name: string;
    role: string;
  };
}

export interface IRepresentative {
  id: string;
  name: string;
}


export interface IPayment {
  id:string;
  invoice_number: string;
  description:string;
  amount:number;
  payment_type_id:string;
  control_number_id:string;
  created_at:Date;
  payment_types:IPaymentType;
}

export interface IControlNumber {
  id:string;
  control_number: string;
  description:string;
  total_amount:number;
  payment_status:string;
  payment_time:Date;
  created_at:Date;
  payments:IPayment[];
  type:number;
  applications:Application;
  users:IUser;
}

export interface ILicense {
  id: string;
  license_type_id: string;
  type: number; // License type (1 or 2, etc.)
  issued_at: string; // ISO date string
  valid_until: string; // ISO date string
  license_number: string; // The license number in string format
  created_at: string; // ISO date string for creation time
  updated_at: string; // ISO date string for last update time
  status: number; // License status (1 for active, etc.)
  archive: number; // Archive status (0 or 1, etc.)
  created_by: string; // User who created the license
  updated_by: string; // User who last updated the license
  user_id: string; // Associated user ID
  application_id: string; // Associated application ID
}


export type Application = {
  trackNumber: string;
  license_types: ILicenseType;
  license_type_id: string;
  id: string;
  status: string;
  attachments:IAttachment[];
  license_id: string;
  comments:IComment[];
  recommendations: IRecommendation[];
  additionals: IAdditionals[];
  assignees: IAsignees[];
  control_numbers: IControlNumber[];
  license:ILicense[];
  report:IReport;
  users:User;
  marketValue:string;
};




