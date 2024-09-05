import React from "react";
import ProfileForm from "./components/ProfileForm";

const page = () => {
  return (
    <div className=" p-10 w-96">
      <h1 className=" font-bold text-3xl my-5">Change Password</h1>
      <ProfileForm />
    </div>
  );
};

export default page;
