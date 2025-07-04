// supabaseClient.js
import {createClient} from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
    const supabaseUrl = 'https://uxytxzliqxpinajccvbu.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV4eXR4emxpcXhwaW5hamNjdmJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1Nzg4MjgsImV4cCI6MjA2NDE1NDgyOH0.1RE6lzGdoj7kfaExaJrBUap9TwuQs5d3TxLarQaweb8';
    const supabase = createClient(supabaseUrl, supabaseKey, {

});

window.supabase = supabase; // Make supabase globally accessible