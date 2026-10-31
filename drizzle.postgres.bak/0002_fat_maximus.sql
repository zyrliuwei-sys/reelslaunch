CREATE TABLE "price_alert" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"consent_version" text NOT NULL,
	"consented_at" timestamp NOT NULL,
	CONSTRAINT "price_alert_email_unique" UNIQUE("email")
);
