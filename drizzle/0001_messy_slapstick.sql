CREATE TABLE "cache_tag_invalidations" (
	"tag" text PRIMARY KEY NOT NULL,
	"stale_at" timestamp with time zone NOT NULL,
	"expired_at" timestamp with time zone NOT NULL
);
