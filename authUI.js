// authUI.js
import { supabase } from './supabaseClient.js';

export async function updateAuthUI() {
// Fetch user session and profile information
    const sessionResult = await supabase.auth.getSession();
    const user = sessionResult.data.session?.user;

// If user is not logged in, redirect to login page
    if (user) {
        const {data: profile} = await supabase
            .from("profiles")
            .select("username")
            .eq("user_id", user.id)
            .single();

// Display welcome message with username or email
        const username = profile?.username || user.email || "User";
            welcomeMsg.textContent = `Welcome, ${username}!`;
            document.querySelector(".user-status").style.display = "block";
            document.getElementById('logout-btn').addEventListener('click', async (e) => {
            e.preventDefault();
            await supabase.auth.signOut();
            window.location.href = 'login.html';
        });
    }
}
