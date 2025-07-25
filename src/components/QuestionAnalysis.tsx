"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import {
  questions,
  answers,
  answersToOptions,
  options,
} from "@/db/schema";
import { ExportButton } from "./ExportButton";

// Helper function to download data as CSV
const downloadCSV = (data: any[], filename: string) => {
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
          const escaped = String(value).replace(/"/g, '""');
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

interface QuestionAnalysisProps {
  question: typeof questions.$inferSelect;
  answers: (typeof answers.$inferSelect & {
    answersToOptions: (typeof answersToOptions.$inferSelect & {
      option: typeof options.$inferSelect;
    })[];
  })[];
  allOptions: (typeof options.$inferSelect)[];
}

const QuestionAnalysis: React.FC<QuestionAnalysisProps> = ({
  question,
  answers = [],
  allOptions = [],
}) => {
  // Skip if no answers
  if (!answers || answers.length === 0) {
    return null;
  }

  // Process answers based on question type
  const processAnswers = () => {
    if (!question?.type) return null;

    switch (question.type) {
      case "score":
      case "number":
        return processNumericAnswers();
      case "selection":
      case "multiple":
        return processSelectionAnswers();
      default:
        return processTextAnswers();
    }
  };

  const processNumericAnswers = () => {
    const numericValues = answers
      .filter((a) => a && a.text)
      .map((a) => parseFloat(a.text || "0"))
      .filter((n) => !isNaN(n));

    if (numericValues.length === 0) return null;

    const sum = numericValues.reduce((a, b) => a + b, 0);
    const avg = sum / numericValues.length;
    const min = Math.min(...numericValues);
    const max = Math.max(...numericValues);
    const sortedValues = [...numericValues].sort(
      (a, b) => a - b
    );
    const median =
      sortedValues.length % 2 === 0
        ? (sortedValues[sortedValues.length / 2 - 1] +
            sortedValues[sortedValues.length / 2]) /
          2
        : sortedValues[Math.floor(sortedValues.length / 2)];

    return (
      <div className="space-y-4 max-w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Gemiddelde
            </h3>
            <p className="text-2xl font-bold">
              {avg.toFixed(2)}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Mediaan
            </h3>
            <p className="text-2xl font-bold">
              {median.toFixed(2)}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Min
            </h3>
            <p className="text-2xl font-bold">{min}</p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Max
            </h3>
            <p className="text-2xl font-bold">{max}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Waardeverdeling (aantal keren)
          </h3>
          <div className="space-y-2">
            {Array.from(
              numericValues.reduce((counts, value) => {
                counts.set(
                  value,
                  (counts.get(value) || 0) + 1
                );
                return counts;
              }, new Map<number, number>())
            )
              .sort(([a], [b]) => a - b)
              .map(([value, count]) => (
                <div
                  key={value}
                  className="flex items-center gap-4"
                >
                  <span className="w-8 font-mono">
                    {value}
                  </span>
                  <div className="flex-1">
                    <div
                      className="h-6 bg-primary/10 rounded"
                      style={{
                        width: `${
                          (count / numericValues.length) *
                          100
                        }%`,
                      }}
                      aria-label={`${count} keer`}
                    ></div>
                  </div>
                  <span className="w-8 text-right">
                    {count}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  };

  const processSelectionAnswers = () => {
    const optionCounts = new Map<string, number>();

    answers.forEach((answer) => {
      // Handle options if they exist
      if (answer.answersToOptions?.length > 0) {
        const options = answer.answersToOptions
          .map((ao) => ao.option?.text)
          .filter(Boolean) as string[];

        options.forEach((opt) => {
          if (opt) {
            optionCounts.set(
              opt,
              (optionCounts.get(opt) || 0) + 1
            );
          }
        });
      }
      // Fall back to text if no options
      else if (answer.text) {
        optionCounts.set(
          answer.text,
          (optionCounts.get(answer.text) || 0) + 1
        );
      }
    });

    const data = Array.from(optionCounts.entries())
      .map(([name, count]) => ({
        name,
        count,
        percentage: (count / answers.length) * 100,
      }))
      .sort((a, b) => b.count - a.count);

    if (data.length === 0) return null;

    return (
      <div className="space-y-4  max-w-full">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-muted-foreground">
            Antwoordverdeling
          </h3>
          <ExportButton
            variant="outline"
            size="sm"
            data={data}
            filename={`antwoorden-${question.key}`}
            label="Exporteer"
          />
        </div>

        <div className="space-y-2">
          {data.map(({ name, count, percentage }) => (
            <div
              key={name}
              className="flex items-center gap-4"
            >
              <span className="w-48 truncate" title={name}>
                {name}
              </span>
              <div className="flex-1">
                <div
                  className="h-6 bg-primary/10 rounded"
                  style={{ width: `${percentage}%` }}
                  aria-label={`${count} keer (${percentage.toFixed(
                    1
                  )}%)`}
                >
                  <span className="sr-only">
                    {count} keer ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              <span className="w-20 text-right">
                {count} ({percentage.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const processTextAnswers = () => {
    const validAnswers = answers.filter(
      (a) => a && (a.text || a.answersToOptions?.length > 0)
    );

    if (validAnswers.length === 0) return null;

    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-medium text-muted-foreground">
            Antwoorden ({validAnswers.length})
          </h3>
          <ExportButton
            variant="outline"
            size="sm"
            data={validAnswers}
            filename={`antwoorden-${question.key}`}
            label="Exporteer"
          />
        </div>

        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Antwoord</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {validAnswers.map((answer, index) => {
                let displayText = "";

                // Handle options if they exist
                if (answer.answersToOptions?.length > 0) {
                  displayText = answer.answersToOptions
                    .map((ao) => ao.option?.text)
                    .filter(Boolean)
                    .join("; ");
                }
                // Fall back to text
                else if (answer.text) {
                  displayText = answer.text;
                }

                return (
                  <TableRow key={index}>
                    <TableCell className="font-mono w-12">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium truncate max-w-full">
                      {displayText || (
                        <span className="text-muted-foreground">
                          (Leeg antwoord)
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <Card
      className="mb-6 max-w-full"
      id={`question-${question.key}`}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          {question.label}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({answers.length} antwoorden)
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {processAnswers() || (
          <p className="text-muted-foreground">
            Geen antwoordgegevens beschikbaar
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionAnalysis;
