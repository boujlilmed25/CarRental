-- CreateTable
CREATE TABLE "Car" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "seats" INTEGER NOT NULL,
    "bags" TEXT NOT NULL,
    "transmission" TEXT NOT NULL,
    "fuel" TEXT NOT NULL,
    "mileage" TEXT NOT NULL,
    "pricePerDay" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Car_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "carSlug" TEXT NOT NULL,
    "pickupDate" TEXT NOT NULL,
    "returnDate" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'new',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSetting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL DEFAULT '',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSetting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "GpsDevice" (
    "id" TEXT NOT NULL,
    "carSlug" TEXT NOT NULL,
    "deviceToken" TEXT NOT NULL,
    "label" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLat" DOUBLE PRECISION,
    "lastLng" DOUBLE PRECISION,
    "lastSpeed" DOUBLE PRECISION,
    "lastHeading" INTEGER,
    "lastIgnition" BOOLEAN,
    "lastUpdate" TIMESTAMP(3),
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "isMoving" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GpsDevice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GpsPosition" (
    "id" TEXT NOT NULL,
    "deviceId" TEXT NOT NULL,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "speed" DOUBLE PRECISION,
    "heading" INTEGER,
    "ignition" BOOLEAN,
    "accuracy" DOUBLE PRECISION,
    "altitude" DOUBLE PRECISION,
    "battery" DOUBLE PRECISION,
    "rawData" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GpsPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GpsAlert" (
    "id" TEXT NOT NULL,
    "carSlug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GpsAlert_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Car_slug_key" ON "Car"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "GpsDevice_carSlug_key" ON "GpsDevice"("carSlug");

-- CreateIndex
CREATE UNIQUE INDEX "GpsDevice_deviceToken_key" ON "GpsDevice"("deviceToken");

-- AddForeignKey
ALTER TABLE "GpsPosition" ADD CONSTRAINT "GpsPosition_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "GpsDevice"("id") ON DELETE CASCADE ON UPDATE CASCADE;
