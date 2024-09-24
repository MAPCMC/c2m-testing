CREATE TABLE IF NOT EXISTS "code" (
	"user_id" uuid,
	"form_id" uuid NOT NULL,
	"link" char(10) NOT NULL,
	CONSTRAINT "code_link_unique" UNIQUE("link")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "code" ADD CONSTRAINT "code_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "code" ADD CONSTRAINT "code_form_id_form_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."form"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
