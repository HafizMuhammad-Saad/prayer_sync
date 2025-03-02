import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mrghcnorodbpqnfsaktn.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1yZ2hjbm9yb2RicHFuZnNha3RuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2MTA2NjQsImV4cCI6MjA1MjE4NjY2NH0.Hzt7jH6-BK2tKkfEg5gzZPei33P0hCowe_Qf-NnQOMM";
export const supabase = createClient(supabaseUrl, supabaseKey);