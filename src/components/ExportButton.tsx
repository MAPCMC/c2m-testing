"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
  data: any[];
  filename: string;
  label: string;
  variant?: "default" | "outline" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function ExportButton({
  data,
  filename,
  label,
  variant = "default",
  size = "default",
}: ExportButtonProps) {
  const handleExport = () => {
    if (data.length === 0) return;

    // Get headers from the first object
    const headers = Object.keys(data[0]);

    // Create CSV content
    const csvContent = [
      headers.join(","),
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header] || "";
            // Escape quotes and wrap in quotes if contains comma or quote
            const escaped = String(value).replace(
              /"/g,
              '""'
            );
            return `"${escaped}"`;
          })
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleExport}
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      {label}
    </Button>
  );
}

export function ExportButtonSmall({
  data,
  filename,
  label,
}: Omit<ExportButtonProps, "variant" | "size">) {
  return (
    <ExportButton
      data={data}
      filename={filename}
      label={label}
      variant="outline"
      size="sm"
    />
  );
}
