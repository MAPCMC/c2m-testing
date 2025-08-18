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
import { Badge } from "@/components/ui/badge";

import {
  questions,
  answers,
  answersToOptions,
  questionsToOptions,
  options,
} from "@/db/schema";
interface QuestionAnalysisProps {
  question: typeof questions.$inferSelect & {
    questionsToOptions: (typeof questionsToOptions.$inferSelect & {
      option: typeof options.$inferSelect;
    })[];
  };
  answers: (typeof answers.$inferSelect & {
    answersToOptions: (typeof answersToOptions.$inferSelect & {
      option: typeof options.$inferSelect;
    })[];
  })[];
}

const QuestionAnalysis: React.FC<QuestionAnalysisProps> = ({
  question,
  answers = [],
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
        return processScoreAnswers();
      case "number":
        return processNumericAnswers();
      case "selection":
        return processSelectionAnswers();
      case "multiple":
        return processMultipleAnswers();
      case "multiple_explained":
        return processMultipleExplainedAnswers();
      default:
        return processTextAnswers();
    }
  };

  const processScoreAnswers = () => {
    const scoreData = new Map<
      string,
      { count: number; explanations: string[] }
    >();

    answers.forEach((answer) => {
      if (answer?.score) {
        const current = scoreData.get(answer.score) || {
          count: 0,
          explanations: [],
        };
        scoreData.set(answer.score, {
          count: current.count + 1,
          explanations: answer.text
            ? [...current.explanations, answer.text]
            : current.explanations,
        });
      }
    });

    const sortedScores = Array.from(scoreData.entries())
      .map(([score, { count, explanations }]) => ({
        score,
        count,
        explanations,
        percentage: (count / answers.length) * 100,
      }))
      .sort((a, b) => a.score.localeCompare(b.score));

    if (sortedScores.length === 0) return null;

    const numericValues = answers
      .filter((a) => a && a.score && a.score !== "nvt")
      .map((a) => parseFloat(a.score || "0"))
      .filter((n) => !isNaN(n));

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
              {numericValues.length > 0
                ? avg.toFixed(2)
                : "nvt"}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Mediaan
            </h3>
            <p className="text-2xl font-bold">
              {numericValues.length > 0
                ? median.toFixed(2)
                : "nvt"}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Laagste
            </h3>
            <p className="text-2xl font-bold">
              {numericValues.length > 0 ? min : "nvt"}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Hoogste
            </h3>
            <p className="text-2xl font-bold">
              {numericValues.length > 0 ? max : "nvt"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-muted-foreground">
            Scoreverdeling
          </h3>

          <div className="space-y-2">
            {sortedScores.map(
              ({
                score,
                count,
                percentage,
                explanations,
              }) => (
                <div key={score} className="space-y-2">
                  <div className="flex items-center gap-4">
                    <span className="w-12 font-medium">
                      {score}
                    </span>
                    <div className="flex-1">
                      <div
                        className="h-6 bg-primary/10 rounded"
                        style={{ width: `${percentage}%` }}
                        aria-label={`${count} keer`}
                      ></div>
                    </div>
                    <span className="w-8 text-right">
                      {count}
                    </span>
                  </div>

                  {explanations.length > 0 && (
                    <div className="text-sm text-muted-foreground">
                      <details>
                        <summary className="cursor-pointer hover:text-foreground">
                          Toon toelichtingen (
                          {explanations.length})
                        </summary>
                        <ul className="mt-2 space-y-1 pl-4 border-l-2 border-muted">
                          {explanations.map(
                            (explanation, idx) => (
                              <li
                                key={idx}
                                className="py-1"
                              >
                                {explanation ||
                                  "(Lege toelichting)"}
                              </li>
                            )
                          )}
                        </ul>
                      </details>
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
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
    const optionData = new Map<
      string,
      { count: number; explanations: string[] }
    >();

    answers.forEach((answer) => {
      // Handle options if they exist
      if (answer.answersToOptions?.length > 0) {
        // Use the first selected option
        const selectedOption =
          answer.answersToOptions[0]?.option?.text;
        if (selectedOption) {
          const current = optionData.get(
            selectedOption
          ) || { count: 0, explanations: [] };
          optionData.set(selectedOption, {
            count: current.count + 1,
            explanations: answer.text
              ? [...current.explanations, answer.text]
              : current.explanations,
          });
        }
      }
    });

    const data = Array.from(optionData.entries())
      .map(([name, { count, explanations }]) => ({
        name,
        count,
        explanations,
        percentage: (count / answers.length) * 100,
      }))
      .sort((a, b) => b.count - a.count);

    if (data.length === 0) return null;

    return (
      <div className="space-y-4 max-w-full">
        <h3 className="text-sm font-medium text-muted-foreground">
          Antwoordverdeling
        </h3>

        <div className="space-y-4">
          {data.map(
            ({ name, count, percentage, explanations }) => (
              <div key={name} className="space-y-2">
                <div className="flex items-center gap-4">
                  <span
                    className="w-48 truncate"
                    title={name}
                  >
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
                        {count} keer (
                        {percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <span className="w-20 text-right">
                    {count} ({percentage.toFixed(1)}%)
                  </span>
                </div>

                {explanations.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    <details>
                      <summary className="cursor-pointer hover:text-foreground">
                        Toon toelichtingen (
                        {explanations.length})
                      </summary>
                      <ul className="mt-2 space-y-1 pl-4 border-l-2 border-muted">
                        {explanations.map(
                          (explanation, idx) => (
                            <li key={idx} className="py-1">
                              {explanation ||
                                "(Lege toelichting)"}
                            </li>
                          )
                        )}
                      </ul>
                    </details>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    );
  };

  const processMultipleAnswers = () => {
    const optionData = new Map<
      string,
      {
        count: number;
        text: string;
      }
    >();

    question.questionsToOptions?.forEach(({ option }) => {
      optionData.set(option.value, {
        count: 0,
        text: option.text || option.value,
      });
    });

    answers.forEach((answer) => {
      if (answer.answersToOptions?.length > 0) {
        answer.answersToOptions.forEach(({ option }) => {
          if (option?.value) {
            const current = optionData.get(option.value);
            if (current) {
              optionData.set(option.value, {
                ...current,
                count: current.count + 1,
              });
            }
          }
        });
      }
    });

    const data = Array.from(optionData.entries())
      .map(([value, { count, text }]) => ({
        value,
        text,
        count,
        percentage:
          answers.length > 0
            ? (count / answers.length) * 100
            : 0,
      }))
      .sort((a, b) => b.count - a.count);

    if (data.length === 0) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Antwoordverdeling
        </h3>
        <div className="space-y-2">
          {data.map(
            ({ value, text, count, percentage }) => (
              <div key={value} className="space-y-1">
                <div className="flex items-center gap-4">
                  <span
                    className="w-48 truncate"
                    title={text}
                  >
                    {text}
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
                        {count} keer (
                        {percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <span className="w-20 text-right">
                    {count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    );
  };

  const processMultipleExplainedAnswers = () => {
    const optionData = new Map<
      string,
      {
        count: number;
        explanations: string[];
        text: string;
      }
    >();

    // Initialize all options for this question with default values
    question.questionsToOptions?.forEach(({ option }) => {
      optionData.set(option.value, {
        count: 0,
        explanations: [],
        text: option.text || option.value,
      });
    });

    // Process answers to populate counts and explanations
    answers.forEach((answer) => {
      if (answer.answersToOptions?.length > 0) {
        answer.answersToOptions.forEach(
          ({ option, explanation }) => {
            if (option?.value) {
              const current = optionData.get(option.value);
              if (current) {
                optionData.set(option.value, {
                  ...current,
                  count: current.count + 1,
                  explanations: explanation
                    ? [...current.explanations, explanation]
                    : current.explanations,
                });
              }
            }
          }
        );
      }
    });

    // Convert to array and calculate percentages
    const data = Array.from(optionData.entries()).map(
      ([value, { count, explanations, text }]) => ({
        value,
        text,
        count,
        explanations,
        percentage:
          answers.length > 0
            ? (count / answers.length) * 100
            : 0,
      })
    );

    if (data.length === 0) return null;

    return (
      <div className="space-y-4 max-w-full">
        <h3 className="text-sm font-medium text-muted-foreground">
          Antwoordverdeling
        </h3>

        <div className="space-y-4">
          {data.map(
            ({
              value,
              text,
              count,
              percentage,
              explanations,
            }) => (
              <div key={value} className="space-y-2">
                <div className="flex items-center gap-4">
                  <span
                    className="w-48 truncate"
                    title={text}
                  >
                    {text}
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
                        {count} keer (
                        {percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <span className="w-20 text-right">
                    {count} ({percentage.toFixed(1)}%)
                  </span>
                </div>

                {explanations.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    <details>
                      <summary className="cursor-pointer hover:text-foreground">
                        Toon toelichtingen (
                        {explanations.length})
                      </summary>
                      <ul className="mt-2 space-y-1 pl-4 border-l-2 border-muted">
                        {explanations.map(
                          (explanation, idx) => (
                            <li key={idx} className="py-1">
                              {explanation ||
                                "(Lege toelichting)"}
                            </li>
                          )
                        )}
                      </ul>
                    </details>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      </div>
    );
  };

  const processTextAnswers = () => {
    const validAnswers = answers.filter(
      (a) => a && a.text && a.text.trim().length > 0
    );

    if (validAnswers.length === 0) return null;

    return (
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">
          Antwoorden ({validAnswers.length})
        </h3>

        <div className="border rounded-md">
          <Table>
            <TableHeader className="sr-only">
              <TableRow>
                <TableHead>Antwoord</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {validAnswers.map((answer, index) => {
                let displayText = "";

                if (answer.text) {
                  displayText = answer.text;
                }

                return (
                  <TableRow key={index}>
                    <TableCell className="font-medium max-w-full whitespace-normal">
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

  const questionTypes = {
    text: "Tekst",
    score: "Score",
    number: "Nummer",
    textarea: "Lange tekst",
    multiple: "Meerkeuze",
    multiple_explained: "Meerkeuze (met anders, namelijk)",
    selection: "Enkele keuze",
  };

  return (
    <Card
      className="mb-6 max-w-full"
      id={`question-${question.key}`}
    >
      <CardHeader className="pb-2 flex justify-between">
        <CardTitle className="text-base font-medium">
          {question.label}
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            ({answers.length} antwoorden)
          </span>
        </CardTitle>
        <Badge variant="outline">
          {questionTypes[question.type]}
        </Badge>
      </CardHeader>
      <CardContent>
        {processAnswers() || (
          <p className="text-muted-foreground italic">
            Geen antwoordgegevens beschikbaar
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionAnalysis;
