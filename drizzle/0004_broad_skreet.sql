CREATE TYPE "public"."currency" AS ENUM('USD');--> statement-breakpoint
CREATE TABLE "rentals" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "rentals_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"spaceId" integer NOT NULL,
	"startTime" timestamp DEFAULT now() NOT NULL,
	"endTime" timestamp
);
--> statement-breakpoint
ALTER TABLE "spaces" ADD COLUMN "price" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "spaces" ADD COLUMN "currency" "currency" DEFAULT 'USD';