CREATE EXTENSION pg_trgm;

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "listing_url" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "picture_url" TEXT NOT NULL,
    "host_id" INTEGER NOT NULL,
    "host_response_time" TEXT,
    "neighbourhood" TEXT NOT NULL,
    "neighbourhood_cleansed" TEXT NOT NULL,
    "neighbourhood_group_cleansed" TEXT,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "room_type" TEXT NOT NULL,
    "accommodates" INTEGER NOT NULL,
    "bedrooms" INTEGER,
    "beds" INTEGER,
    "amenities" TEXT,
    "price" DOUBLE PRECISION NOT NULL,
    "number_of_reviews" INTEGER NOT NULL,
    "review_scores_rating" DOUBLE PRECISION,
    "review_scores_accuracy" DOUBLE PRECISION,
    "review_scores_cleanliness" DOUBLE PRECISION,
    "review_scores_checkin" DOUBLE PRECISION,
    "review_scores_communication" DOUBLE PRECISION,
    "review_scores_location" DOUBLE PRECISION,
    "review_scores_value" DOUBLE PRECISION,
    "reviews_per_month" DOUBLE PRECISION,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Listing_neighbourhood_cleansed_review_scores_location_idx" ON "Listing"("neighbourhood_cleansed", "review_scores_location");

-- CreateIndex
CREATE INDEX "Listing_name_description_neighbourhood_cleansed_idx" ON "Listing" USING GIN ("name" gin_trgm_ops, "description" gin_trgm_ops, "neighbourhood_cleansed" gin_trgm_ops);
