CREATE TABLE "data_caches" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"expired_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "pages_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"visibility" text NOT NULL,
	"content" text NOT NULL,
	"kicker" text,
	"meta_description" text,
	"meta_lang" text,
	"meta_image" text
);
--> statement-breakpoint
CREATE TABLE "post_tags" (
	"post_id" integer NOT NULL,
	"tag_id" integer NOT NULL,
	CONSTRAINT "post_tags_post_id_tag_id_pk" PRIMARY KEY("post_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "posts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"status" text NOT NULL,
	"content" text NOT NULL,
	"published_at" timestamp with time zone NOT NULL,
	"updated_at" timestamp with time zone,
	"search" text,
	"related_posts" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"light_cover" text,
	"dark_cover" text,
	"light_bg_color" text,
	"dark_bg_color" text,
	"reading_time" text,
	"kicker" text,
	"meta_description" text,
	"meta_image" text,
	"meta_lang" text
);
--> statement-breakpoint
CREATE TABLE "posts_search" (
	"post_id" integer PRIMARY KEY NOT NULL,
	"document" "tsvector" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" jsonb
);
--> statement-breakpoint
CREATE TABLE "shorts" (
	"id" text PRIMARY KEY NOT NULL,
	"content" text,
	"attachments" jsonb DEFAULT '[]'::jsonb,
	"published_at" timestamp with time zone NOT NULL,
	"kicker" text,
	"meta_lang" text
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tags_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"kicker" text,
	"color" text,
	"description" text,
	"search" text,
	"meta_description" text,
	"meta_image" text
);
--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts_search" ADD CONSTRAINT "posts_search_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "page_visibility_idx" ON "pages" USING btree ("visibility");--> statement-breakpoint
CREATE UNIQUE INDEX "page_slug_idx" ON "pages" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "post_slug_idx" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "post_published_at_idx" ON "posts" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "post_status_idx" ON "posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "posts_search_document_idx" ON "posts_search" USING gin ("document");--> statement-breakpoint
CREATE INDEX "slug_published_at_idx" ON "shorts" USING btree ("published_at");--> statement-breakpoint
CREATE UNIQUE INDEX "tag_slug_idx" ON "tags" USING btree ("slug");
