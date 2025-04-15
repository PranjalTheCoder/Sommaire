// app/actions.ts
"use server";
import { neon } from "@neondatabase/serverless";

export async function getDbConnection() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Neon Database URL is not defined");
  }
  const sql = neon(process.env.DATABASE_URL);
  return sql;
}


// Neon DB Database Table Schema
// -- Enable UUID extension
// CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

// // -- User table
// CREATE TABLE users (
//     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//     email VARCHAR(255) UNIQUE NOT NULL,
//     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//     full_name VARCHAR(255),
//     customer_id VARCHAR(255) UNIQUE,
//     price_id VARCHAR(255),
//     status VARCHAR(50) DEFAULT 'inactive'
// );

// -- PDF Summaies table (for storing PDF processing results)
// CREATE TABLE pdf_summaries (
//     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//     user_id VARCHAR(255) NOT NULL,
//     original_file_url TEXT NOT NULL,
//     summary_text TEXT NOT NULL,
//     status VARCHAR(50) DEFAULT 'completed',
//     title TEXT,
//     file_name TEXT,
//     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
// );

// -- Payments table
// CREATE TABLE payments (
//     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
//     amount INTEGER NOT NULL,
//     status VARCHAR(50) NOT NULL,
//     stripe_payment_id VARCHAR(255) UNIQUE NOT NULL,
//     price_id VARCHAR(255) NOT NULL,
//     user_email VARCHAR(255) NOT NULL REFERENCES users(email),
//     created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
//     updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
// );

// -- Create updated_at trigger function
// CREATE OR REPLACE FUNCTION update_updated_at_column()
// RETURNS TRIGGER AS $$
// BEGIN 
//     NEW.updated_at = CURRENT_TIMESTAMP;
//     RETURN NEW;
// END;
// $$ language 'plpgsql';

// -- Add triggers to update updated_at
// CREATE TRIGGER update_users_updated_at
//     BEFORE UPDATE ON users
//     FOR EACH ROW
//     EXECUTE FUNCTION update_updated_at_column();

// CREATE TRIGGER update_pdf_summaries_updated_at
//     BEFORE UPDATE ON pdf_summaries
//     FOR EACH ROW
//     EXECUTE FUNCTION update_updated_at_column();

// CREATE TRIGGER update_payments_updated_at
//     BEFORE UPDATE ON payments
//     FOR EACH ROW
//     EXECUTE FUNCTION update_updated_at_column();