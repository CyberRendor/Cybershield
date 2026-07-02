import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// 1. A javított URL (a /rest/v1/ NÉLKÜL!)
const SUPABASE_URL = "https://bszttorbplxuwpejlsjt.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzenR0b3JicGx4dXdwZWpsc2p0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5NTgyNTUsImV4cCI6MjA5ODUzNDI1NX0.i6SQihHpXKZcW_CuZ9hz__SnBkSeZwwe0Hr_FCdQBvk";

let supabaseClient = null;

try {
    // 2. Kliens létrehozása közvetlenül
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("Supabase kliens sikeresen inicializálva!");
} catch (error) {
    console.error("Hiba a Supabase kliens inicializálása során:", error);
}

// 3. Globális változók a többi script számára
window.supabase = supabaseClient;

window.SupabaseConnection = {
    client: supabaseClient,
    isConfigured: function() {
        // Fixáltuk: mivel tudjuk, hogy az adatok jók, ez most már mindig igazat ad vissza.
        return supabaseClient !== null;
    }
};

export { supabaseClient as supabase };
