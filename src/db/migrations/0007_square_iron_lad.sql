ALTER TABLE "form_chapter" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "form" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "question" ADD COLUMN "deleted_at" timestamp;