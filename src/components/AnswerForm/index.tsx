/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { onSubmit } from "./handleSubmit";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import answerSchema from "./answerSchema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  text: string;
  description?: string;
  options?: string[];
};

// TODO - Add Answer type from drizzle
type Answer = {
  id: string;
  text: string;
  description?: string;
  options?: string[];
};

export default function AnswerForm({
  question,
  answer,
  code,
  nextUrl,
  previousUrl,
}: {
  answer: Answer;
  question: Question;
  code: string;
  nextUrl: any;
  previousUrl: any;
}) {
  const router = useRouter();

  if (!question) return null;

  return (
    <>
      <form action={onSubmit} className="space-y-8">
        <h2>{question.text}</h2>
        {question.options?.length && (
          <select name="options">
            {question.options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
        <Input
          name="text"
          placeholder="Typ hier"
          defaultValue={answer?.text ?? ""}
        />
        <input
          type="hidden"
          name="questionId"
          value={question.id}
        />
        <input type="hidden" name="code" value={code} />
        <Button
          type="submit"
          className="float-right"
          onClick={() => router.push(nextUrl)}
        >
          Volgende
        </Button>
        <Button onClick={() => router.push(previousUrl)}>
          Vorige
        </Button>
      </form>
    </>
  );
}
