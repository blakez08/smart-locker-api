CREATE TABLE "items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"spaceId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "problems" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "problems_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"description" text NOT NULL,
	"resolved" boolean DEFAULT false,
	"spaceId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "spaces" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "spaces_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"position" integer NOT NULL,
	"lockerId" integer NOT NULL
);
