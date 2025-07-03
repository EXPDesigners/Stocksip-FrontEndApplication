<script>
import { ref, reactive, onMounted } from 'vue';
import ProfileEdit from './profile-edit.component.vue';
import PlanDetailsComponent from '@/profile-management/components/plan-details.component.vue';
import PlanBenefits from '@/profile-management/components/plan-benefits.component.vue';
import SideNavbar from '@/public/components/side-navbar.vue';
import ToolbarContent from '@/public/components/toolbar-content.component.vue';

import PlanDetails from "@/profile-management/components/plan-details.component.vue";
import profileService from "@/profile-management/services/profile.service.js";
import userService from "@/authentication/services/user.service.js";

export default {
  name: 'ProfileComponent',
  components: {
    PlanDetails,
    ToolbarContent,
    SideNavbar,
    ProfileEdit,
    PlanDetailsComponent,
    PlanBenefits
  },
  setup() {
    const fileInput = ref(null);
    const userData = reactive({
      profileId: 0,
      name: '',
      email: '',
      role: '',
      businessName: '',
      businessAddress: '',
      phone: ''
    });

    const uploadNewPhoto = () => {
      console.log('Subir nueva foto');
      fileInput.value.click();
    };

    const onFileSelected = (event) => {
      const input = event.target;
      if (input.files && input.files[0]) {
        const file = input.files[0];
        console.log('Archivo seleccionado:', file);

        const reader = new FileReader();
        reader.onload = () => {
          const base64Image = reader.result;
          console.log('Imagen en base64:', base64Image);
        };
        reader.readAsDataURL(file);
      }
    };

    onMounted(async () => {
      const currentUser = userService.getCurrentUser();
      console.log('Current user:', currentUser);

      if (!currentUser || !currentUser.profileId) {
        console.error('No profileId found in currentUser');
        return;
      }


      const profileId = currentUser.profileId;

      console.log('Fetching profile for ID:', profileId);

      try {
        const profile = await profileService.getProfileById(profileId);
        console.log('Profile fetched:', profile);
        Object.assign(userData, profile);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    });

    return {
      userData,
      fileInput,
      uploadNewPhoto,
      onFileSelected
    };
  }
};
</script>

<template>

  <SideNavbar>
    <ToolbarContent :pageTitle="$t('profile.title')" />
    <div class="profile-container">
      <div class="profile-left">
        <div class="user-card">
          <div class="avatar-container">
            <div class="avatar">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                    d="M12 4a4 4 0 0 1 4 4 4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z" />
              </svg>
            </div>
          </div>
          <div class="user-info">
            <h2 class="user-name">{{ userData.name }}</h2>
            <p class="user-email">{{ userData.email }}</p>
            <button class="upload" @click="uploadNewPhoto">Upload New Photo</button>
          </div>
        </div>
        <ProfileEdit />
      </div>

      <section class="account-type">
        <h2 class="section-title">Account Type</h2>
        <div class="account-box">
          <div class="account-info">
            <p><strong>Role:</strong> {{ userData.role }}</p>
            <p><strong>Current Plan:</strong> Free</p>
          </div>
          <a class="change-plan-link" href="#">Do you want to change your plan?</a>
        </div>
      </section>

      <PlanDetails />
      <PlanBenefits />
    </div>
  </SideNavbar>
</template>

<style scoped>
.profile-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background-color: #F7EDDC;
  min-height: 100vh;
  padding-bottom: 40px;
  width: 100%;
}

.profile-left {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 800px;
}

.user-card {
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  background-color: #ffffff;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
}

.avatar-container {
  width: 240px;
  height: 240px;
  border-radius: 50%;
  background-color: #ddd;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
}

.avatar svg {
  width: 180px;
  height: 180px;
  fill: #aaa;
}

.user-info {
  text-align: center;
  margin-left: 80px;
}

.user-name {
  margin-bottom: 5px;
  color: #26021D;
  font-size: 3rem;
  font-weight: bold;
}

.user-email {
  color: #8E24AA;
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.upload {
  display: flex;
  justify-content: center;
  background-color: #890E4F;
  color: #fff;
  font-size: 20px;
  padding: 10px 20px;
  border-radius: 45px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload:hover {
  background-color: #6d0b3f;
}


.account-type {
  background-color: #F7EDDC;
  height: 100%;
  padding: 20px;
  justify-items: center;
}

.section-title {
  color: #6E0081;
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 3rem;
  font-family: 'Poppins', sans-serif;
}

.account-box {
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 16px 24px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-content: center;
  justify-items: center;
  width: 1000px;
}

.account-info p {
  margin: 0;
  color: #273238;
  font-size: 1.5rem;
}

.change-plan-link {
  color: #6E0081;
  font-weight: 500;
  text-decoration: underline;
  font-size: 1.5rem;
}

@media (max-width: 1024px) {
  .profile-left,
  .account-box {
    width: 90%;
  }

  .user-card {
    flex-direction: column;
    text-align: center;
  }

  .user-info {
    margin-left: 0;
    margin-top: 20px;
  }

  .account-box {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }
}
</style>