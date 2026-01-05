-- Migration: 005_create_tables_metadata
-- Description: Create tables_metadata for tracking user-created tables
-- Created: 2026-01-04

CREATE TABLE IF NOT EXISTS tables_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  table_name VARCHAR(255) NOT NULL,
  display_name VARCHAR(255),
  schema JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP NULL,
  
  UNIQUE(project_id, table_name)
);

CREATE INDEX idx_tables_project ON tables_metadata(project_id);
CREATE INDEX idx_tables_deleted ON tables_metadata(deleted_at) WHERE deleted_at IS NULL;

CREATE TRIGGER update_tables_metadata_updated_at
  BEFORE UPDATE ON tables_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
