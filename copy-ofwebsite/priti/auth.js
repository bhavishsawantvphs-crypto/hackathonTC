// ============================================
// SUPABASE CONNECTION
// ============================================

const supabaseClient = window.supabase.createClient(
  "https://vzjcynucqpebxoczlzrc.supabase.co",
  "sb_publishable_lUvfYB-aU86m1VmqN7vCwg_OoWgpe7I"
);


// ============================================
// LOGIN
// ============================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const emailInput = loginForm.querySelector('input[type="email"]');
    const passwordInput = loginForm.querySelector('input[type="password"]');

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      alert("Login failed: " + error.message);
      return;
    }

    console.log("Login successful:", data.user);

    // Send the logged-in user to the main website
    window.location.href = "index.html";
  });
}


// ============================================
// SIGN UP
// ============================================

const signupForm = document.getElementById("signupForm");

if (signupForm) {
  signupForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const inputs = signupForm.querySelectorAll("input");

    const fullName = inputs[0].value.trim();
    const username = inputs[1].value.trim();
    const email = inputs[2].value.trim();
    const password = inputs[3].value;

    if (!fullName || !username || !email || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password,

      // Store additional signup information
      options: {
        data: {
          full_name: fullName,
          username: username
        }
      }
    });

    if (error) {
      alert("Sign up failed: " + error.message);
      return;
    }

    console.log("Signup successful:", data);

    if (data.session) {
      // Email confirmation is disabled
      alert("Account created successfully!");
      window.location.href = "index.html";
    } else {
      // Email confirmation is enabled
      alert(
        "Account created successfully! Please check your email and verify your account before signing in."
      );
    }
  });
}


// ============================================
// CHECK CURRENT LOGIN SESSION
// ============================================

async function checkCurrentUser() {
  const {
    data: { user }
  } = await supabaseClient.auth.getUser();

  if (user) {
    console.log("Currently logged in:", user.email);
    console.log("User ID:", user.id);
  } else {
    console.log("No user is currently logged in.");
  }
}

checkCurrentUser();