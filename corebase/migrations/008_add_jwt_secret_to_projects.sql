-- Migration: 008_add_jwt_secret_to_projects
-- Description: Add jwt_secret to projects for signing anon/service tokens
-- Created: 2026-01-06

ALTER TABLE projects ADD COLUMN IF NOT EXISTS jwt_secret VARCHAR(255);
