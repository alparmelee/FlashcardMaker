// authUI.js
import { supabase } from './supabaseClient.js';

export async function updateAuthUI() {
  const { data: { session } } = await supabase.auth.getSession();
  const authButtonsDiv = document.querySelector('.auth-buttons');

  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('user_id', session.user.id)
      .single();

    const username = profile?.username || session.user.email;
    authButtonsDiv.innerHTML = `
      <div class="user-status">
        <span>Welcome, ${username}!</span>
        <a href="#" id="logout-btn" class="logout-button btn">Logout</a>
      </div>`;

    document.getElementById('logout-btn').addEventListener('click', async e => {
      e.preventDefault();
      await supabase.auth.signOut();
      window.location.href = 'login.html';
    });

  } else {
    authButtonsDiv.innerHTML = `
      <a href="login.html" class="btn">Login</a>
      <a href="signup.html" class="btn">Signup</a>`;
  }
}
