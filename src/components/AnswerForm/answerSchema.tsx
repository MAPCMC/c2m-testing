"use client";

import { z } from "zod";

const answerSchema = z.object({
  questionId: z.string(),
  code: z.string(),
  options: z.string().optional(),
  text: z.string().max(50).optional(),
});

export default answerSchema;
