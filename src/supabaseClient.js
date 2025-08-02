import { createClient } from '@supabase/supabase-js';

// These keys connect your app to *your* Supabase backend
const supabaseUrl = 'https://swnwnnguwglyuiuvtvda.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN3bndubmd1d2dseXVpdXZ0dmRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5NDE4NjgsImV4cCI6MjA2ODUxNzg2OH0.K41CPxPlkIAGYoG6Oh75t8aQfSI66hGJ76WReC2ltSo';

// Create a single Supabase client that the whole app can use
export const supabase = createClient(supabaseUrl, supabaseKey);
