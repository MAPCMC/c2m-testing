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
  title: string;
  description?: string;
  options?: string[];
};

export default function AnswerForm({
  question,
  code,
  nextUrl,
  previousUrl,
}: {
  question: Question;
  code: string;
  nextUrl: any;
  previousUrl: any;
}) {
  const router = useRouter();
  const form = useForm<z.infer<typeof answerSchema>>({
    resolver: zodResolver(answerSchema),
    defaultValues: {
      options: "",
      questionId: question.id,
      code: code,
      text: "",
    },
  });

  if (!question) return null;

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
        >
          <h2>{question.title}</h2>
          {question.options?.length && (
            <FormField
              control={form.control}
              name="options"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Opties</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    {...field}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Maak een keuze" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {question.options?.map((option) => (
                        <SelectItem
                          key={option}
                          value={option}
                        >
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Toelichting</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Typ hier"
                    {...field}
                  />
                </FormControl>
                {question.description && (
                  <FormDescription>
                    {question.description}
                  </FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">verzenden</Button>
        </form>
      </Form>
      <Button
        className="float-right"
        onClick={() => router.push(nextUrl)}
      >
        Volgende
      </Button>
      <Button onClick={() => router.push(previousUrl)}>
        Vorige
      </Button>
    </>
  );
}
