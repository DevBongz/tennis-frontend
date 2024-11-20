<template>
    <div class="game-container">
      <h1>Tennis Game</h1>
      <p>{{ scoreboard }}</p>
      <button @click="player1Scores">Player 1 Scores</button>
      <button @click="player2Scores">Player 2 Scores</button>
      <p v-if="isComplete">{{ winnerMessage }}</p>
    </div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  const scoreboard = ref("Loading...");
  const isComplete = ref(false);
  const winnerMessage = ref("");
  
  const fetchScoreboard = async () => {
    const { apiBase } = useRuntimeConfig().public;
    try {
      const response = await $fetch(`${apiBase}/scoreboard`);
      scoreboard.value = response.score;
      isComplete.value = response.isComplete;
  
      if (isComplete.value) {
        winnerMessage.value = `Game Over: ${scoreboard.value}`;
      }
    } catch (error) {
      console.error("Error fetching scoreboard:", error);
    }
  };
  
  const player1Scores = async () => {
    const { apiBase } = useRuntimeConfig().public;
    try {
      await $fetch(`${apiBase}/player1`, { method: "POST" });
      await fetchScoreboard();
    } catch (error) {
      console.error("Error posting Player 1 score:", error);
    }
  };
  
  const player2Scores = async () => {
    const { apiBase } = useRuntimeConfig().public;
    try {
      await $fetch(`${apiBase}/player2`, { method: "POST" });
      await fetchScoreboard();
    } catch (error) {
      console.error("Error posting Player 2 score:", error);
    }
  };
  
  fetchScoreboard();
  </script>
  
  <style scoped>
  .game-container {
    text-align: center;
    margin-top: 20px;
  }
  
  button {
    margin: 10px;
    padding: 10px 20px;
    font-size: 16px;
  }
  
  p {
    font-size: 18px;
    font-weight: bold;
  }
  </style>
  