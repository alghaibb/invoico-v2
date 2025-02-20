import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ActionsDropdown from "./ActionsDropdown";

export default function InvoiceTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice Number</TableHead>
          <TableHead>Client</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>#1</TableCell>
          <TableCell>John Doe</TableCell>
          <TableCell>$100</TableCell>
          <TableCell>Paid</TableCell>
          <TableCell>12/12/2021</TableCell>
          <TableCell className="text-right">
            <ActionsDropdown />
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
