"use client";
import React from "react";
import Image from "next/image";
import { Application, ILicense } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { GET } from "@/lib/client/client";
import { tokenFromSession } from "@/lib/tokenFromSession";
import userFromSession from "@/lib/userFromSession";
import { company } from "@prisma/client";

const Page = ({ params }: { params: { id: string } }) => {
  const token = tokenFromSession();
  const user = userFromSession();
  const Id = params.id;

  // Fetch application data
  const {
    data: application,
    isLoading: isLoadingApp,
    error: errorApp,
  } = useQuery<Application>({
    queryKey: ["applicationsView", Id],
    queryFn: () => GET(`/application/${Id}`, {}, token),
  });

  // Fetch company data
  const {
    data: company,
    isLoading: isLoadingCompany,
    error: errorCompany,
  } = useQuery<company>({
    queryKey: ["company", user?.id],
    queryFn: () => GET(`/company/${user?.id}`, {}, token),
  });

  const handleDownload = (licenseType: string) => {
    // Logic to download the license as a PDF or image
    console.log(`${licenseType} license downloaded.`);
  };

  const handleRenewalRequest = () => {
    // Logic to handle license renewal request
    console.log("Requesting license renewal.");
  };

  const formatName = (name: string | undefined) => {
    if (!name) return "";
    const maxLength = 15;
    if (name.length > maxLength) {
      const firstPart = name.slice(0, maxLength);
      const secondPart = name.slice(maxLength);
      return (
        <>
          {firstPart}
          <br />
          {secondPart}
        </>
      );
    }
    return name;
  };

  const isLicenseExpired = (validUntil: string) => {
    return new Date(validUntil) < new Date();
  };

  if (isLoadingApp || isLoadingCompany) {
    return <div>Loading...</div>;
  }

  if (errorApp || errorCompany) {
    return <div>Error loading data.</div>;
  }

  const licenses = application?.license || [];

  return (
    <>
      {licenses.length < 1 ? (
        <div className="text-center mt-6">
          <p className="text-red-500 font-bold">
            Please complete your application process to view your license
          </p>
        </div>
      ) : (
        application?.license.map((license: ILicense, index: number) => (
          <div
            key={index}
            className="license-container border-4 border-gray-300 rounded-lg p-8 mb-8"
          >
            {/* Header Section */}
            <div className="text-center">
              <Image
                src="/CMSA.png"
                alt="CMSA Logo"
                width={300}
                height={300}
                className="mx-auto mb-4"
              />
              <h2 className="text-lg">
                CAPITAL MARKETS & SECURITIES AUTHORITY
              </h2>
            </div>

            {/* Body Section */}
            <div className="body-section text-center mt-8">
              <p className="mt-2 text-lg">
                The Capital Markets and Securities Authority (CMSA) 
                has approved {application?.license_types?.name || ""} 
                {company?.name || "Company Name"}, with effect from{" "}
                {new Date(license.issued_at).toLocaleDateString()}.
              </p>
              <br />
              <p className="mt-2">Yours sincerely,</p>
              <br />
              <p className="font-bold text-lg">
                CAPITAL MARKETS AND SECURITIES AUTHORITY
              </p>
              <br />
              <p className="mt-2">(Sign)</p>
              <br />
              <p className="font-bold text-lg">{"CPA. NICODEMUS MKAMA"}</p>
              <p>CHIEF EXECUTIVE OFFICER</p>
            </div>

            <div className="text-center mt-6">
              <button
                onClick={() =>
                  handleDownload(application.license_types?.name || "Company")
                }
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Download Letter
              </button>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default Page;
