-- Migration: 007_add_fullname_to_users
-- Description: Add full_name column to users table
-- Created: 2026-01-04

ALTER TABLE users ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);
