// Login
document.getElementById("login-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("usernameOrEmail").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Login successful: " + userCredential.user.email);
    })
    .catch((err) => alert("Login failed: " + err.message));
});

// Signup
document.getElementById("signup-form").addEventListener("submit", function (e) {
  e.preventDefault();
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      alert("Signup successful: " + userCredential.user.email);
    })
    .catch((err) => alert("Signup failed: " + err.message));
});

// Google Login
document.getElementById("google-login").addEventListener("click", function () {
  auth.signInWithPopup(provider)
    .then((result) => {
      alert("Google login successful: " + result.user.displayName);
    })
    .catch((err) => alert("Google login failed: " + err.message));
});

// Logout
document.getElementById("logout-btn").addEventListener("click", function () {
  auth.signOut()
    .then(() => {
      alert("Logged out successfully.");
    })
    .catch((err) => alert("Logout failed: " + err.message));
});

// Display current user
auth.onAuthStateChanged((user) => {
  const userInfo = document.getElementById("user-info");
  if (user) {
    userInfo.textContent = JSON.stringify({
      uid: user.uid,
      email: user.email,
      name: user.displayName,
    }, null, 2);
  } else {
    userInfo.textContent = "No user logged in.";
  }
});