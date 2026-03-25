-- CreateTable
CREATE TABLE "GpsDevice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "carSlug" TEXT NOT NULL,
    "deviceToken" TEXT NOT NULL,
    "label" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLat" REAL,
    "lastLng" REAL,
    "lastSpeed" REAL,
    "lastHeading" INTEGER,
    "lastIgnition" BOOLEAN,
    "lastUpdate" DATETIME,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "isMoving" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "GpsPosition" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "deviceId" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "speed" REAL,
    "heading" INTEGER,
    "ignition" BOOLEAN,
    "accuracy" REAL,
    "altitude" REAL,
    "battery" REAL,
    "rawData" TEXT,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "GpsPosition_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "GpsDevice" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GpsAlert" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "carSlug" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "lat" REAL,
    "lng" REAL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "GpsDevice_carSlug_key" ON "GpsDevice"("carSlug");

-- CreateIndex
CREATE UNIQUE INDEX "GpsDevice_deviceToken_key" ON "GpsDevice"("deviceToken");
