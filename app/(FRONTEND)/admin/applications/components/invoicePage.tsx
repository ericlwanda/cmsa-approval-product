import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import userFromSession from "@/lib/userFromSession";
import { formatCurrency } from "@/lib/utils";
import { IControlNumber, IPayment } from "@/types/user";
import moment from "moment";

interface Props {
  controlNumber?: IControlNumber;
}

const InvoicePage = ({ controlNumber }: Props) => {
  if (!controlNumber) return null; // Return nothing if no payment is provided

  const {
    control_number,
    description,
    total_amount,
    payments,
    created_at,
    payment_status,
  } = controlNumber;

  const user = userFromSession();

  return (
    <Card className="w-full shadow-lg rounded-lg printable-invoice">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Invoice</h1>
            <p className="text-sm text-gray-600">
              Control Number: {control_number}
            </p>
            <p className="text-sm text-gray-600">
              Date: {moment(created_at).format("YYYY-MM-DD")}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-semibold">From:</h2>
            <p className="text-sm">Capital Market Security Authority</p>
            <p className="text-sm">123 Business Rd.</p>
            <p className="text-sm">Business City, BC 12345</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold">To:</h2>
          <p className="text-sm">{user?.name}</p>
          {/* <p className="text-sm">Client City, CC 67890</p> */}
        </div>

        {/* Payment Status Badge */}
        <div className="mb-6 flex items-center">
          <span
            className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${
              payment_status === "PAID"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {payment_status === "PAID" ? "Paid" : "NOT PAID"}
          </span>
        </div>

        <table className="w-full table-auto mb-6 border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Description
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Amount
              </th>

            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <>
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    {payment.description}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right">
                    {formatCurrency(payment.amount)}
                  </td>
                </tr>
                
              </>
            ))}
            <tr>
                  <td
                    colSpan={1}
                    className="border border-gray-300 px-4 py-2 text-right font-bold"
                  >
                    Total
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-right font-bold">
                    {formatCurrency(total_amount)}
                  </td>
                </tr>
          </tbody>
        </table>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 mb-4">
            Thank you for your business!
          </p>
          <Button
            className="bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => window.print()}
          >
            Print Invoice
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicePage;
