import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Application, IControlNumber, IPayment } from "@/types/user";
import InvoicePage from "./invoicePage"; // Ensure the correct path
import userFromSession from "@/lib/userFromSession";

interface Props {
  application?: Application;
}

const PaymentPage = ({ application }: Props) => {
  const user = userFromSession();
  const [selectedPayment, setSelectedPayment] = useState<IControlNumber | null>(null);

  const handleViewInvoice = (control_number: IControlNumber) => {
    setSelectedPayment(control_number);
  };



  return (
    <div className="my-4 p-4">
      <Card className="w-full shadow-lg rounded-lg">
        <CardContent className="p-6">
          {/* Payments Table for Type 1 */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Application Payments</h2>
            <table className="w-full table-auto border-collapse border border-gray-200">
              <thead>
                <tr>
                  
                  <th className="border border-gray-300 px-4 py-2 text-left">Control Number</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Description</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Amount</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {application?.control_numbers.map((control_number, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{control_number.control_number}</td>
                    <td className="border border-gray-300 px-4 py-2">{control_number.description}</td>
                    <td className="border border-gray-300 px-4 py-2 text-right">{formatCurrency(control_number.total_amount)}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${control_number.payment_status === "PAID" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                        {control_number.payment_status === "PAID" ? "PAID" : "NOT PAID"}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => handleViewInvoice(control_number)}>
                        View Invoice
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </CardContent>
      </Card>
      <br></br>

      {/* Conditionally render the InvoicePage component */}
      {selectedPayment && <InvoicePage controlNumber={selectedPayment} />}
    </div>
  );
};

export default PaymentPage;
