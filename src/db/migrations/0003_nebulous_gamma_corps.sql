ALTER TABLE "code" ADD COLUMN "created_by_id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "code" ADD CONSTRAINT "code_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
