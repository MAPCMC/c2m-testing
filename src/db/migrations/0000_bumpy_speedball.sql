CREATE TABLE IF NOT EXISTS "account" (
	"userId" uuid NOT NULL,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "account_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "answer" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question_id" serial NOT NULL,
	"code" text NOT NULL,
	"text" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "code" (
	"user_id" uuid,
	"form_id" uuid NOT NULL,
	"link" char(10) PRIMARY KEY NOT NULL,
	CONSTRAINT "code_link_unique" UNIQUE("link")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "form" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" varchar(2048)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profile" (
	"userId" uuid NOT NULL,
	"text_size" text DEFAULT 'small',
	"language" text DEFAULT 'nl' NOT NULL,
	"theme" text DEFAULT 'light' NOT NULL,
	"screen_reader_optimized" boolean DEFAULT false NOT NULL,
	"feedback_enabled" boolean DEFAULT false NOT NULL,
	"reading_enabled" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "question" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"email" varchar(320) NOT NULL,
	"emailVerified" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answer" ADD CONSTRAINT "answer_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "answer" ADD CONSTRAINT "answer_code_code_link_fk" FOREIGN KEY ("code") REFERENCES "public"."code"("link") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
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
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "profile" ADD CONSTRAINT "profile_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
