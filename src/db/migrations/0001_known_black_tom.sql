ALTER TABLE "question" RENAME COLUMN "text" TO "label";--> statement-breakpoint
ALTER TABLE "question" ALTER COLUMN "label" SET NOT NULL;