ALTER TABLE "spaces" ADD COLUMN "available" boolean DEFAULT true;--> statement-breakpoint
ALTER TABLE "items" DROP COLUMN "available";