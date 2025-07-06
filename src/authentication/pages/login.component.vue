<script>

import {useAuthenticationStore} from "@/authentication/services/authentication.store.js";
import {SignInRequest} from "@/authentication/model/sign-in.request.js";
import {Toast as PvToast} from "primevue";
import {useToast} from "primevue/usetoast";

export default {
  name: "login",
  components: {PvToast},
  data() {
    return {
      hide: true,
      username: "",
      password: "",
      authenticationStore: useAuthenticationStore(),
      rememberMe: false,
      accountType: '',
      toast: useToast(),
    }
  },
  methods: {
    goToConfirmation() {
    },
    goToRegister() {
      this.$router.push('/sign-up');
    },
    goToPasswordRecovery() {
      this.$router.push('/password-recovery');
    },
    togglePassword() {
      this.hide = !this.hide;
    },
    onSignIn() {
      let signUpRequest = new SignInRequest(this.username, this.password);
      try {
        this.authenticationStore.signIn(signUpRequest, this.$router);
      } catch (error) {
        this.toast.add({
          severity: 'error',
          summary: this.$t('toast.error'),
          detail: this.$t('sign-in.invalid-credentials'),
          life: 3000
        });
        console.error('Error to enter the system:', error);
      }
    }

  }
}
</script>

<template>
  <div class="authentication-container">
    <!-- Login Section -->
    <div class="login-section">
      <h2>Sign In</h2>
      <form @submit.prevent="goToConfirmation">
        <div class="form-group">
          <label for="username">Email</label>
          <input
              id="username"
              v-model="username"
              type="email"
              placeholder="email@example.com"
              class="form-input"
          />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-input">
            <input
                id="password"
                v-model="password"
                :type="hide ? 'password' : 'text'"
                placeholder="Enter your password"
                class="form-input"
            />
            <button
                type="button"
                class="toggle-password"
                @click="togglePassword"
            >
              <i :class="hide ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
        </div>

        <div class="remember-me">
          <label class="checkbox-container">
            <input
                type="checkbox"
                v-model="rememberMe"
            />
            <span class="checkmark"></span>
            <span>Remember me</span>
          </label>
        </div>

        <button type="submit" class="sign-in-button" @click="onSignIn">
          Sign In
        </button>

        <div class="forgot-password">
          <a href="#" @click.prevent="goToPasswordRecovery">{{ $t('login.forgotPassword') }}</a>
        </div>

        <div class="divider">or</div>

        <div class="social-login">
          <button type="button" class="social-button">
            <img src="@/assets/google-icon.svg" alt="Google" />
          </button>
          <button type="button" class="social-button">
            <i class="pi pi-key"></i>
          </button>
        </div>
      </form>
    </div>

    <!-- Register Section -->
    <div class="hello-section">
      <h2>Hello, user</h2>
      <p>Create your personal account to access all the features of the platform</p>

      <button class="register-button" @click="goToRegister" type="submit">
        Register
      </button>

      <div class="security-logos">
        <img src="@/assets/ssl-icon.svg" alt="SSL" />
        <img src="@/assets/recaptcha.svg" alt="reCAPTCHA" />
      </div>
    </div>
  </div>
</template>

<style>
/* Move @import to the top */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&family=Roboto:wght@400;500;700&display=swap');

.authentication-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
  background-color: #F7EDDC;
}

.login-section, .hello-section {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.login-section {
  background-color: #F7EDDC;
}

.form-group {
  width: 100%;
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #8E24AA;
  font-family: 'Inter', sans-serif;
}

.form-input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid #26021D;
  border-radius: 45px;
  font-family: 'Inter', sans-serif;
  color: #4E4E4E;
  background-color: white;
  outline: none;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #8E24AA;
}

.password-input {
  position: relative;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #8E24AA;
  cursor: pointer;
  padding: 0;
}

.form-select {
  width: 240px;
  padding: 0.8rem 1rem;
  border: 1px solid #26021D;
  border-radius: 45px;
  font-family: 'Inter', sans-serif;
  color: white;
  background-color: transparent;
  outline: none;
  appearance: none;
  cursor: pointer;
}

.form-select option {
  color: #4E4E4E;
  background-color: white;
}

.login-section h2 {
  color: #8E24AA;
  font-size: 2.6rem;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 2rem;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #4E4E4E;
}

.checkbox-container input {
  margin-right: 0.5rem;
}

.checkbox-container .checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #8E24AA;
  border-radius: 3px;
  margin-right: 0.5rem;
  position: relative;
}

.checkbox-container input:checked + .checkmark:after {
  content: '';
  position: absolute;
  left: 5px;
  top: 2px;
  width: 5px;
  height: 10px;
  border: solid #8E24AA;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.sign-in-button {
  align-items: center;
  font-family: 'Roboto', sans-serif;
  background-color: #59033A;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  width: 240px;
  height: 3rem;
  border-radius: 45px;
  border: none;
  margin: 1rem auto 0 auto;
  display: block;
  cursor: pointer;
  transition: background-color 0.3s;
}

.sign-in-button:hover {
  background-color: #6d0b3f;
}

.hello-section {
  background-color: #26021D;
  border-bottom-left-radius: 6rem;
  border-top-left-radius: 6rem;
  color: white;
  align-items: center;
}

.hello-section h2 {
  font-weight: bold;
  font-size: 2.6rem;
  font-family: 'Poppins', sans-serif;
  margin-bottom: 1rem;
  color: #F7EDDC;
}

.hello-section p {
  font-size: 1.2rem;
  margin-bottom: 2rem;
  text-align: center;
  font-family: 'Inter', sans-serif;
}

.register-button {
  font-family: 'Roboto', sans-serif;
  background-color: #59033A;
  color: white;
  font-weight: bold;
  font-size: 1rem;
  width: 240px;
  height: 3rem;
  border-radius: 45px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.register-button:hover {
  background-color: #6d0b3f;
}

.security-logos {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.security-logos img {
  height: 30px;
}

.divider {
  text-align: center;
  margin: 1.5rem 0;
  position: relative;
  color: #4E4E4E;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 45%;
  height: 1px;
  background-color: rgba(0, 0, 0, 0.12);
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.forgot-password {
  text-align: center;
  margin-top: 1rem;
}

.forgot-password a {
  color: #7e1c75;
  text-decoration: none;
  transition: color 0.3s;
}

.forgot-password a:hover {
  color: #8E24AA;
}

.social-login {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.social-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid #26021D;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s;
}

.social-button:hover {
  transform: scale(1.05);
}

.social-button img {
  width: 24px;
  height: 24px;
}

.social-button i {
  font-size: 24px;
  color: #26021D;
}

/* Responsive Design */
@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
  }

  .register-section {
    border-radius: 6rem 6rem 0 0;
    order: -1;
  }

  .form-input,
  .form-select,
  .sign-in-button,
  .register-button {
    width: 100%;
  }
}

.select-group {
  position: relative;
  width: 240px;
}

.select-label {
  display: block;
  margin-bottom: 0.5rem;
  color: white;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
}

.form-select {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
  outline: none;
  appearance: none;
  cursor: pointer;
  font-size: 0.9rem;
}

.form-select option {
  color: #4E4E4E;
  background-color: #26021D;
  padding: 8px;
}

.select-arrow {
  position: absolute;
  right: 1rem;
  top: 65%;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 5px solid white;
  pointer-events: none;
}
</style>