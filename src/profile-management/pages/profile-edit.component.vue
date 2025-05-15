<script>
import { ref, reactive } from 'vue';
import { useToast } from 'primevue/usetoast';
import ProfileService from "@/profile-management/services/profile.service.js";

export default {
  name: 'profile-edit',
  components: {
  },
  setup() {
    const toast = useToast();
    const profileService = new ProfileService();

    const hideActual = ref(true);
    const hideNew = ref(true);
    const hideConfirm = ref(true);

    const form = reactive({
      name: '',
      email: '',
      businessName: '',
      businessAddress: '',
      phone: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });

    const errors = reactive({
      name: '',
      email: '',
      businessName: '',
      businessAddress: '',
      phone: '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      passwordMismatch: ''
    });

    const validateForm = () => {
      let isValid = true;
      errors.name = !form.name ? 'Name is required' : '';
      errors.email = !form.email ? 'Email is required' :
          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? 'Invalid email format' : '';
      errors.businessName = !form.businessName ? 'Business name is required' : '';
      errors.businessAddress = !form.businessAddress ? 'Business address is required' : '';
      errors.phone = !form.phone ? 'Phone is required' : '';

      if (form.newPassword || form.confirmPassword) {
        if (form.newPassword !== form.confirmPassword) {
          errors.passwordMismatch = 'Passwords do not match';
          isValid = false;
        } else {
          errors.passwordMismatch = '';
        }
      }

      return isValid && !Object.values(errors).some(error => error);
    };

    const save = async () => {
      if (!validateForm()) {
        toast.add({
          severity: 'error',
          summary: 'Validation Error',
          detail: 'Please check the form for errors',
          life: 3000
        });
        return;
      }

      try {
        await profileService.editProfile(form);
        toast.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile saved successfully',
          life: 3000
        });
        resetForm();
      } catch (error) {
        toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save profile',
          life: 3000
        });
      }
    };

    const cancel = () => {
      resetForm();
    };

    const resetForm = () => {
      Object.keys(form).forEach(key => form[key] = '');
      Object.keys(errors).forEach(key => errors[key] = '');
    };

    return {
      form,
      errors,
      hideActual,
      hideNew,
      hideConfirm,
      save,
      cancel,
    };
  }
};
</script>

<template>
  <div class="profile-container">
    <div class="profile-left">
      <div class="password-section">
        <h2>Change Password</h2>

        <div class="form-group">
          <label>Current password</label>
          <div class="password-input">
            <input
                :type="hideActual ? 'password' : 'text'"
                v-model="form.currentPassword"
                class="form-input"
                placeholder="Enter current password"
            />
            <button
                type="button"
                class="toggle-password"
                @click="hideActual = !hideActual"
            >
              <i :class="hideActual ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>New password</label>
          <div class="password-input">
            <input
                :type="hideNew ? 'password' : 'text'"
                v-model="form.newPassword"
                class="form-input"
                placeholder="Enter new password"
            />
            <button
                type="button"
                class="toggle-password"
                @click="hideNew = !hideNew"
            >
              <i :class="hideNew ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>Confirm password</label>
          <div class="password-input">
            <input
                :type="hideConfirm ? 'password' : 'text'"
                v-model="form.confirmPassword"
                class="form-input"
                placeholder="Confirm new password"
            />
            <button
                type="button"
                class="toggle-password"
                @click="hideConfirm = !hideConfirm"
            >
              <i :class="hideConfirm ? 'pi pi-eye-slash' : 'pi pi-eye'"></i>
            </button>
          </div>
          <span v-if="errors.passwordMismatch" class="error-message">
            {{ errors.passwordMismatch }}
          </span>
        </div>

        <div class="actions">
          <button class="save-button" @click="save">Save</button>
          <button class="cancel-button" @click="cancel">Cancel</button>
        </div>
      </div>
    </div>

    <div class="profile-right">
      <div class="profile-section">
        <h2>Profile Information</h2>

        <div class="form-group">
          <label>Name</label>
          <div class="input-with-icon">
            <input
                type="text"
                v-model="form.name"
                class="form-input"
                placeholder="Enter your name"
            />
            <i class="pi pi-pencil"></i>
          </div>
          <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
        </div>

        <div class="form-group">
          <label>Email</label>
          <div class="input-with-icon">
            <input
                type="email"
                v-model="form.email"
                class="form-input"
                placeholder="Enter your email"
            />
            <i class="pi pi-pencil"></i>
          </div>
          <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group">
          <label>Business</label>
          <div class="input-with-icon">
            <input
                type="text"
                v-model="form.businessName"
                class="form-input"
                placeholder="Enter business name"
            />
            <i class="pi pi-pencil"></i>
          </div>
          <span v-if="errors.businessName" class="error-message">{{ errors.businessName }}</span>
        </div>

        <div class="form-group">
          <label>Phone</label>
          <div class="input-with-icon">
            <input
                type="text"
                v-model="form.phone"
                class="form-input"
                placeholder="Enter phone number"
            />
            <i class="pi pi-pencil"></i>
          </div>
          <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
        </div>

        <div class="form-group">
          <label>Business address</label>
          <div class="input-with-icon">
            <input
                type="text"
                v-model="form.businessAddress"
                class="form-input"
                placeholder="Enter business address"
            />
            <button class="map-button">
              <i class="pi pi-map-marker"></i>
            </button>
          </div>
          <span v-if="errors.businessAddress" class="error-message">{{ errors.businessAddress }}</span>
        </div>

        <div class="actions">
          <button class="save-button" @click="save">Save</button>
          <button class="cancel-button" @click="cancel">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@600;700&family=Roboto:wght@400;500;700&display=swap');

.profile-container {
  display: flex;
  gap: 24px;
  padding: 24px;
  font-family: 'Inter', sans-serif;
}

.profile-left,
.profile-right {
  flex: 1;
}

.password-section,
.profile-section {
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

h2 {
  color: #263238;
  font-family: 'Poppins', sans-serif;
  font-size: 1.5rem;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 16px;
  width: 100%;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #263238;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #263238;
  border-radius: 8px;
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  color: #263238;
  background-color: white;
  outline: none;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #8E24AA;
}

.password-input,
.input-with-icon {
  position: relative;
}

.toggle-password,
.map-button {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #8E24AA;
  cursor: pointer;
  padding: 4px;
}

.input-with-icon i {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #8E24AA;
}

.error-message {
  color: #dd0031;
  font-size: 0.875rem;
  margin-top: 4px;
  display: block;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
}

.save-button,
.cancel-button {
  min-width: 100px;
  padding: 12px 24px;
  border-radius: 8px;
  font-family: 'Roboto', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.save-button {
  background-color: #890E4F;
  color: white;
  border: none;
}

.save-button:hover {
  background-color: #6d0b3f;
}

.cancel-button {
  background-color: transparent;
  border: 2px solid #890E4F;
  color: #890E4F;
}

.cancel-button:hover {
  background-color: rgba(137, 14, 79, 0.1);
}

@media (max-width: 768px) {
  .profile-container {
    flex-direction: column;
  }

  .profile-left,
  .profile-right {
    width: 100%;
  }

  .actions {
    flex-direction: column;
  }

  .save-button,
  .cancel-button {
    width: 100%;
  }
}
</style>