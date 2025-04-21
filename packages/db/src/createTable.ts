import { db } from "./main.js";


const createTables = async () => {
  await db.query(`
    CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');
    CREATE TYPE "OnRamp" AS ENUM ('Success', 'Failure', 'Processing');

    CREATE TABLE IF NOT EXISTS "User" (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      emailVerified TIMESTAMP,
      password TEXT,
      role "UserRole" DEFAULT 'USER',
      image TEXT
    );

    CREATE TABLE IF NOT EXISTS "Balance" (
      id TEXT PRIMARY KEY,
      amount INTEGER NOT NULL,
      locked INTEGER NOT NULL,
      userId TEXT UNIQUE NOT NULL,
      CONSTRAINT fk_user_balance FOREIGN KEY(userId) REFERENCES "User"(id)
    );

    CREATE TABLE IF NOT EXISTS "OnRampTransaction" (
      id TEXT PRIMARY KEY,
      status "OnRamp" NOT NULL,
      token TEXT NOT NULL,
      provider TEXT NOT NULL,
      amount INTEGER NOT NULL,
      startTime TIMESTAMP NOT NULL,
      userId TEXT NOT NULL,
      CONSTRAINT fk_user_onramp FOREIGN KEY(userId) REFERENCES "User"(id)
    );

    CREATE TABLE IF NOT EXISTS "p2pTranfer" (
      id TEXT PRIMARY KEY,
      amount INTEGER NOT NULL,
      senderId TEXT NOT NULL,
      receiverId TEXT NOT NULL,
      startTime TIMESTAMP NOT NULL,
      CONSTRAINT fk_sender FOREIGN KEY(senderId) REFERENCES "User"(id),
      CONSTRAINT fk_receiver FOREIGN KEY(receiverId) REFERENCES "User"(id)
    );

    CREATE TABLE IF NOT EXISTS "Account" (
      _id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_account_id TEXT NOT NULL,
      refresh_token TEXT,
      access_token TEXT,
      expires_at INTEGER,
      token_type TEXT,
      scope TEXT,
      id_token TEXT,
      session_state TEXT,
      CONSTRAINT fk_user_account FOREIGN KEY(user_id) REFERENCES "User"(id) ON DELETE CASCADE,
      UNIQUE(provider, provider_account_id)
    );

    CREATE TABLE IF NOT EXISTS "userAccount" (
      id TEXT PRIMARY KEY,
      userId TEXT NOT NULL,
      amount INTEGER DEFAULT 0,
      CONSTRAINT fk_user_useraccount FOREIGN KEY(userId) REFERENCES "User"(id)
    );

    CREATE TABLE IF NOT EXISTS "Merchant" (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "merchantAccount" (
      id TEXT PRIMARY KEY,
      merchantId TEXT NOT NULL,
      amount INTEGER DEFAULT 0,
      CONSTRAINT fk_merchant FOREIGN KEY(merchantId) REFERENCES "Merchant"(id)
    );

    CREATE TABLE IF NOT EXISTS "VerificationToken" (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires TIMESTAMP NOT NULL,
      UNIQUE(email, token)
    );
  `);

  console.log('All tables created');
  process.exit();
};

createTables().catch((e) => {
  console.error(e);
  process.exit(1);
});
