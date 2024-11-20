export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      apiBase: "http://localhost:3000/api/game", // Keep this pointing to your backend
    },
  },

  devServer: {
    port: 3001, // Change Nuxt server port to 3001
  },

  compatibilityDate: "2024-11-19",
});