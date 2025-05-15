class ProfileService {
    constructor() {}

    /**
     * Simulates sending the profile data to the backend
     * @param {Object} profile - The profile data to be updated
     * @returns {Promise} A promise that resolves with the updated profile
     */
    async editProfile(profile) {
        console.log('Profile sent to backend:', profile);

        // Simulating an API call with a Promise
        return new Promise((resolve) => {
            // Simulating some network delay
            setTimeout(() => {
                resolve(profile);
            }, 500);
        });
    }
}

export default ProfileService;
