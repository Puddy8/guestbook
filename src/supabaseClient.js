import { createClient } from '@supabase/supabase-js';

// These keys connect your app to *your* Supabase backend
const supabaseUrl = 'https://kvljzprmmvrdzyeuvwbt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt2bGp6cHJtbXZyZHp5ZXV2d2J0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4MDI2MDcsImV4cCI6MjA2ODM3ODYwN30.WzA2lBsUdoQ-tyFr5jV-7Jo6w0AHS6_C1Q3_x0Dbss4';

// Create a single Supabase client that the whole app can use
export const supabase = createClient(supabaseUrl, supabaseKey);
