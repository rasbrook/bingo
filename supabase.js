import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xiajnqyalkmnykjnblcs.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhpYWpucXlhbGttbnlram5ibGNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE5ODcwMDcsImV4cCI6MjEwNzU2MzAwN30.8bIroYb2eFwJXAAE-GOkNKnBnvWqATY0q1OmtbWg9R8'

export const SupabaseHost = createClient(supabaseUrl, supabaseAnonKey)
