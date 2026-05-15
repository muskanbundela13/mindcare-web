import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://ujltoffybrhlbmnvsbzz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVqbHRvZmZ5YnJobGJtbnZzYnp6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NTg4NDAsImV4cCI6MjA5MjUzNDg0MH0.3bPqYoqDlAC5EeY-eGABtVH_pRfNcHCl_MqZhpZvM9Q"
);