"use client";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Application } from "@/types/user";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { GET } from "@/lib/client/client";
import ResponsesPage from "../../components/responsePage";
import UseApplication from "@/app/(FRONTEND)/hooks/use-application";
import { Icons } from "@/components/Icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MemoPage from "../../components/reportPage";
import RecommendationsPage from "../../components/reportPage";
import userFromSession from "@/lib/userFromSession";
import ConfirmationPage from "../../components/confirmationPage";
import InvoicePage from "../../components/paymentsPage";
import { tokenFromSession } from "@/lib/tokenFromSession";
import { Role } from "@/lib/enums/enums";
import { LoadingSpinner } from "@/lib/Utils/loderSpinner";

const Page = ({ params }: { params: { id: string } }) => {
  const token = tokenFromSession();
  const queryClient = useQueryClient();
  const [reload, setReload] = useState<boolean>(true);
  const user = userFromSession();

  const Id = params.id;
  const {
    data: application,
    isPending: isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery<Application>({
    queryKey: ["applicationsConfirm"],
    queryFn: () => GET(`/application/${Id}`,{},token),
  });

  const notUser = user?.role !== Role.USER;

  if (isLoading) return <LoadingSpinner />;
  if (isError) return <div>Error loading data</div>;

  return (
    <div className="p-10">

        <Tabs defaultValue="application-info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="application-info">Apllication Info</TabsTrigger>
            <TabsTrigger value="invoice">Payments</TabsTrigger>
          </TabsList>
          <TabsContent value="application-info">
            <ConfirmationPage application={application} />
          </TabsContent>
          <TabsContent value="invoice">
            <InvoicePage application={application} />
          </TabsContent>
        </Tabs>

    </div>
  );
};

//TO DO: TRIGGER TAB ACCORDING TO PAYMENT STATUS

export default Page;
