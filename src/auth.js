// Simple localStorage-based auth helper
const AUTH_KEY = 'sapphire_user';

export function isAuthenticated(){
  try {
    const u = JSON.parse(localStorage.getItem(AUTH_KEY));
    return !!(u && u.email);
  } catch(e){
    return false;
  }
}

export function loginUser(userObj){
  // userObj: { name, email, password } - password stored plaintext for demo (same as original approach)
  localStorage.setItem(AUTH_KEY, JSON.stringify(userObj));
}

export function logoutUser(){
  localStorage.removeItem(AUTH_KEY);
}

export function getCurrentUser(){
  try { return JSON.parse(localStorage.getItem(AUTH_KEY)) || null }
  catch(e){ return null }
}
