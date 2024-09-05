"use client";
import React, { useState } from "react";
import { Application } from "@/types/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GET } from "@/lib/client/client";
import ResponsesPage from "../../components/responsePage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import userFromSession from "@/lib/userFromSession";
import PaymentPage from "../../components/paymentsPage";
import { tokenFromSession } from "@/lib/tokenFromSession";
import ReportPage from "../../components/reportPage";
import { LoadingSpinner } from "@/lib/Utils/loderSpinner";

const Page = ({ params }: { params: { id: string } }) => {
 
  const queryClient = useQueryClient();
  const [reload, setReload] = useState<boolean>(true);
const user = userFromSession();
const token = tokenFromSession();

  const Id = params.id;
  const {
    data: application,
    isPending: isLoading,
    error,
    isError,
    refetch,
    isFetching,
  } = useQuery<Application>({
    queryKey: ["applicationsView"],
    queryFn: () => GET(`/application/${Id}`,{},token),
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error loading data</div>;

  return (
    <div className="p-10">


        <Tabs defaultValue="application-info" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="application-info">Apllication Info</TabsTrigger>
            <TabsTrigger value="report">Report</TabsTrigger>
            <TabsTrigger value="payment">Payments</TabsTrigger>
          </TabsList>
          <TabsContent value="application-info">
          <ResponsesPage application={application} />
          </TabsContent>
          <TabsContent value="report">
            <ReportPage application={application} />
          </TabsContent>
          <TabsContent value="payment">
            <PaymentPage application={application} />
          </TabsContent>
        </Tabs>

        
 


    </div>
  );
};

export default Page;
