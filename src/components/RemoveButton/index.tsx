"use client";

import { useState, useTransition } from "react";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { handleRemove } from "./handleRemove";

export default function RemoveButton({
  schemaName,
  id,
  alertTitle,
  alertDescription,
  alertConfirm,
  alertCancel,
  customRemove,
  ...props
}: {
  schemaName: string;
  id: string;
  alertTitle?: string;
  alertDescription?: string;
  alertConfirm?: string;
  alertCancel?: string;
  customRemove?: (id: string) => Promise<void>;
  [key: string]: unknown;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const onConfirm = async () => {
    try {
      if (customRemove) {
        await customRemove(id);
      } else {
        // ✅ Call server action safely
        startTransition(() => {
          handleRemove(schemaName, id);
        });
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      }
    }
  };

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" {...props} />
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {alertTitle ?? "Nu verwijderen?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {alertDescription ??
                "Weet je zeker dat je deze data wilt verwijderen?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {alertCancel ?? "Annuleren"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>
              {alertConfirm ?? "Verwijderen"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {error && (
        <p className="text-red-500 mt-2">{error}</p>
      )}
    </>
  );
}
