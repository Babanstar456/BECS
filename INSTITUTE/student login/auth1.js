// Auth state observer
firebase.auth().onAuthStateChanged((user) => {
  if (!user && window.location.pathname.includes('index.html')) {
    window.location.href = 'login.html';
  }
  
  if (user && window.location.pathname.includes('login.html')) {
    window.location.href = 'index.html';
  }
});