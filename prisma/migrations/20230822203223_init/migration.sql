-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT,
    "firstName" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
