"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type Props = {
  idleText?: string;
  pendingText?: string;
};

export default function SubmitButton({
  idleText = "Save",
  pendingText = "Saving...",
}: Props) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="rounded-full px-6">
      {pending ? pendingText : idleText}
    </Button>
  );
}