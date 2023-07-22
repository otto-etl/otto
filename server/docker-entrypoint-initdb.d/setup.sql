CREATE TABLE workflow (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  active BOOLEAN,
  nodes JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  edges JSONB,
  start_time TIMESTAMPTZ,
  error JSONB
);

CREATE TABLE execution (
  id SERIAL PRIMARY KEY,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  successful BOOLEAN,
  workflow_id INT REFERENCES workflow (id) ON DELETE CASCADE,
  current_version BOOLEAN,
  workflow JSONB
);

CREATE TABLE metric (
  id serial PRIMARY KEY,
  workflow_id integer REFERENCES workflow (id) ON DELETE CASCADE,
  total_executions integer,
  success_rate float(2),
  avg_milliseconds_to_complete_workflow integer,
  node_failure_count JSONB,
  avg_milliseconds_to_complete_node JSONB,
  avg_volume_extracted_data JSONB
);
