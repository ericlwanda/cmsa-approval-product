"use client";
import React, { useEffect } from "react";
import InfoCard from "./components/InfoCard";
import UseDashboard from "../hooks/use-dashboard";
import { Icons } from "@/components/Icons";
import { LoadingSpinner } from "@/lib/Utils/loderSpinner";

const pages = () => {

  const {
    dashboard,
    isError,
    isLoading,
  } = UseDashboard();

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error loading data</div>;


  return (
    <div className=" flex flex-1 flex-col p-5 gap-5">
      
      <div className="grid gap-4  md:grid-cols-2 lg:grid-cols-4">
  
        <InfoCard
          title="Total appliactions"
          description=""
          icon="post"
          value= {dashboard?.totalCount ?? 0}
        />
      


      </div>
      <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2">

      </div>
    </div>
  );
};

export default pages;
