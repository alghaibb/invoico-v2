import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle,
  DownloadCloud,
  Mail,
  MoreHorizontal,
  Pencil,
  Trash,
} from "lucide-react";
import Link from "next/link";

export default function ActionsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="hover:bg-muted">
          <MoreHorizontal className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href="" className="flex items-center gap-2">
            <Pencil className="size-4 text-primary" />
            <span>Edit Invoice</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="" className="flex items-center gap-2">
            <DownloadCloud className="size-4 text-blue-500" />
            <span>Download</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="" className="flex items-center gap-2">
            <Mail className="size-4 text-yellow-500" />
            <span>Send Reminder</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="" className="flex items-center gap-2">
            <CheckCircle className="size-4 text-green-500" />
            <span>Mark as Paid</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="text-destructive">
          <Link href="" className="flex items-center gap-2">
            <Trash className="size-4" />
            <span>Delete Invoice</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
