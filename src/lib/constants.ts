import { BarChart, CheckCircle, HomeIcon, Mail, ReceiptIcon } from "lucide-react";

export const dashboardLinks = [
  {
    id: 0,
    name: "Dashboard",
    href: "/dashboard",
    icon: HomeIcon,
  },
  {
    id: 1,
    name: "Invoices",
    href: "/dashboard/invoices",
    icon: ReceiptIcon,
  },
]

export const navbarLinks = [
  {
    id: 0,
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    id: 1,
    name: "Invoices",
    href: "/dashboard/invoices",
  },
]

export type FeatureType = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
};

export const features: FeatureType[] = [
  {
    icon: Mail,
    title: "One-Click Email Sending",
    description:
      "Send invoices directly to clients with a secure download link.",
  },
  {
    icon: CheckCircle,
    title: "Real-Time Payment Status",
    description:
      "Mark invoices as paid instantly with Optimistic UI—no page refresh needed.",
  },
  {
    icon: BarChart,
    title: "Smart Analytics & Insights",
    description:
      "Track earnings, pending payments, and optimize cash flow with analytics.",
  },
];

export const professionalFeatures = [
  "Up to 50 invoices per month",
  "Send invoices via email",
  "Custom invoice styling",
  "Invoice tracking",
];

export const businessFeatures = [
  "Up to 100 invoices per month",
  "Everything in Premium",
  "Priority support",
  "Multi-currency support",
  "Export invoices to PDF/CSV",
];

