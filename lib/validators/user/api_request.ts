import { NextRequest } from "next/server"

interface ApiRequest extends NextRequest {
    files: any
    user: {
        id: string
        name: string
        phone_number: string
        email: string
        status: number
        role:string
      }
  }

  export default ApiRequest