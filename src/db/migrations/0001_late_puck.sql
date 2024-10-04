ALTER TABLE "question_conditions" RENAME COLUMN "answer_key" TO "key";--> statement-breakpoint
ALTER TABLE "question_conditions" DROP CONSTRAINT "question_conditions_answer_key_question_key_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question_conditions" ADD CONSTRAINT "question_conditions_key_question_key_fk" FOREIGN KEY ("key") REFERENCES "public"."question"("key") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
