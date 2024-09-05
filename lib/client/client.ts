import { toast } from "@/components/ui/use-toast";
import axios, { AxiosRequestConfig } from "axios";
import { SignOut } from "@/actions/auth";
import { Console } from "console";
 // Adjust the import path




const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: 20000,
});

// Define the interface for the config
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  headers: {
    Authorization?: string;
  };
}


api.interceptors.response.use(
  (response) => {
    // alert(response);
    return response;
  },
(error) => {
    // Check if the error is an object with a response
    if (error.response) {
      const status = error.response.status;
      const errorMessage = error.response.data?.message;
  
      // Handle different HTTP status codes
      if (status === 401 || status === 403) {
        // SignOut();
        return;
      }
      
      if (status === 404 || status === 400) {
        if (typeof errorMessage === 'string') {
          toast({
            variant: "destructive",
            title: "Error!",
            description: errorMessage,
          });
        } else if (typeof errorMessage === 'object' && errorMessage !== null) {
          // Process object-based error messages
          const messages = [];

              for (const [key, value] of Object.entries(errorMessage)) {
                
                // Check if value is an array before spreading
                if (Array.isArray(value)) {
                  console.log("value",...value)
                  messages.push(...value); // Collect all messages
                }
              }

          toast({
            variant: "destructive",
            title: "Error!",
            description: messages.length > 0 ? messages.join(', ') : "An error occurred, please try again.",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Error!",
            description: errorMessage,
          });
        }
      }
    } else if (typeof error === 'string') {
      // Handle cases where the error is a string
      toast({
        variant: "destructive",
        title: "Error!",
        description: error,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error!",
        description: "An unknown error occurred, please try again.",
      });
    }
  
    return Promise.reject(error);
  }
  
);


export const GET = async (path: string, params?: object, token?: string) => {
  // Create a copy of the default headers and set the Authorization header if a token is provided
  const config: CustomAxiosRequestConfig = {
    headers: {},
  };

  if (token) {

    config.headers.Authorization = `Bearer ${token}`;
  }

  // Make the GET request with the provided path, params, and custom headers
  const response = await api.get(path, {
    params: params,
    ...config, // Spread the config object to include the headers
  });

  return response.data;
};

export const POST = async (path: string, body: Object,token?:string) => {
  const config: CustomAxiosRequestConfig = {
    headers: {},
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await api.post(path, body,config);

    return response;
  } catch (e: any) {
    console.log("axios e", e.message);

    throw e;
  }
};

export const PUT = async (path: string, body: Object,token?:string) => {
  const config: CustomAxiosRequestConfig = {
    headers: {},
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  const response = await api.put(path, body,config);
  return response.data;
};

export const DELETE = async (path: string,token?: string) => {
  // const config: AxiosRequestConfig = {
  //   headers: {},
  //   data: body, // Set the body in the config's data field
  // };
  const config: CustomAxiosRequestConfig = {
    headers: {},
  };

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await api.delete(path, config); // Pass config directly
    return response.data; // Return the data from the response
  } catch (error: any) {
    console.log("axios error", error);
    throw error; // Rethrow the error after logging it
  }
};
