CREATE TABLE "predictions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"tweet_text" text NOT NULL,
	"virality_score" text NOT NULL,
	"confidence" text NOT NULL,
	"sentiment" text NOT NULL,
	"sentiment_score" text NOT NULL,
	"hashtag_count" text NOT NULL,
	"hashtag_trending" boolean NOT NULL,
	"length_characters" text NOT NULL,
	"length_optimal" boolean NOT NULL,
	"emoji_count" text NOT NULL,
	"emoji_impact" text NOT NULL,
	"buzzword_count" text NOT NULL,
	"buzzwords" text NOT NULL,
	"suggestions" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "usage_tracking" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"date" timestamp NOT NULL,
	"prediction_count" text DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_tracking" ADD CONSTRAINT "usage_tracking_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "predictions_user_id_idx" ON "predictions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "predictions_created_at_idx" ON "predictions" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "usage_tracking_user_id_idx" ON "usage_tracking" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "usage_tracking_date_idx" ON "usage_tracking" USING btree ("date");--> statement-breakpoint
CREATE INDEX "usage_tracking_user_date_idx" ON "usage_tracking" USING btree ("user_id","date");