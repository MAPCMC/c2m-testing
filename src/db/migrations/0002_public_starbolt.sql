ALTER TABLE "question_conditions" DROP CONSTRAINT "question_conditions_key_question_key_fk";
--> statement-breakpoint
ALTER TABLE "answer" ALTER COLUMN "code" SET DATA TYPE char(10);--> statement-breakpoint
ALTER TABLE "question_conditions" ALTER COLUMN "key" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "question_conditions" ADD CONSTRAINT "question_conditions_key_question_key_fk" FOREIGN KEY ("key") REFERENCES "public"."question"("key") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
