<template>
  <div>
  <nav class="navbar">
    <div class="navbar-left">
      <img class="logo" src="/images/wimbledon-logo.png" alt="Wimbledon Logo" />
      <h1 class="title">Wimbledon</h1>
    </div>
    <div class="navbar-right">
      <button class="btn">Sign Up</button>
    </div>
  </nav>

  <div class="game-container">
    <p v-if="isComplete">{{ winnerMessage }}</p>
    <div class="court">
      <img src="/images/tennis-top-view.jpg" alt="Tennis Court" class="court-img">

      <div class="avatar player1">
        <img src="/images/serena-img.jpg" alt="Player 1" />
        <p>Player 1</p>
      </div>

      <div
        class="ball"
        :style="{
          left: ballPosition + '%',
          transition: isAnimating ? 'left 0.5s ease' : 'none',
        }"
      ></div>

      <div class="avatar player2">
        <img src="/images/novak-img.jpg" alt="Player 2" />
        <p>Player 2</p>
      </div>

    </div>
    <div class="controls">
      <p>Score: {{ scoreboard }}</p>

      <div class="controlButtons">
        <button class="btn" @click="player1Scores" :disabled="isComplete">Player 1 Scores</button>
        <button class="btn" @click="player2Scores" :disabled="isComplete">Player 2 Scores</button>
        <button class="btn" @click="resetGame">Reset Game</button>
      </div>
      
      
    </div>
  </div>
</div>
</template>

<script setup>
import { ref } from "vue";

const scoreboard = ref("Loading...");
const isComplete = ref(false);
const winnerMessage = ref("");

//Ball animation state
const ballPosition = ref(50); // Start at the center
const isAnimating = ref(false);

const resetGame = async () => {
  const { apiBase } = useRuntimeConfig().public;
  try {
    await $fetch(`${apiBase}/reset`, { method: "POST" });
    ballPosition.value = 50; 
    isAnimating.value = false; 
    await fetchScoreboard(); 
  } catch (error) {
    console.error("Error resetting game:", error);
  }
};


//Fetch the scoreboard data from the backend
const fetchScoreboard = async () => {
  const { apiBase } = useRuntimeConfig().public;
  try {
    const response = await $fetch(`${apiBase}/scoreboard`);
    scoreboard.value = response.scoreboard;
    isComplete.value = response.isComplete;

    if (isComplete.value) {
      winnerMessage.value = `Game Over: ${response.scoreboard}`;
    }
  } catch (error) {
    console.error("Error fetching scoreboard:", error);
  }
};



//Move the ball for Player 1
const player1Scores = async () => {
  const { apiBase } = useRuntimeConfig().public;
  try {
    await $fetch(`${apiBase}/player1`, { method: "POST" });
    animateBall("left");
    await fetchScoreboard();
  } catch (error) {
    console.error("Error posting Player 1 score:", error);
  }
};

//Move the ball for Player 2
const player2Scores = async () => {
  const { apiBase } = useRuntimeConfig().public;
  try {
    await $fetch(`${apiBase}/player2`, { method: "POST" });
    animateBall("right");
    await fetchScoreboard();
  } catch (error) {
    console.error("Error posting Player 2 score:", error);
  }
};

//Animate the ball
const animateBall = (direction) => {
  isAnimating.value = true;
  ballPosition.value = direction === "left" ? 10 : 90; 
  setTimeout(() => {
    isAnimating.value = false;
  }, 500); //Reset animation flag after the transition duration
};

fetchScoreboard();
</script>

<style scoped>


.game-container {
  text-align: center;
  background-image: url('/images/wimbledon-stadium.jpg'); 
  background-size: cover; 
  background-position: center; 
  background-repeat: no-repeat;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
}

.game-container::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); 
  z-index: 1; 
}

.controls,
.court {
  position: relative;
  z-index: 2; 
}

button {
  margin: 10px;
  padding: 10px 20px;
  font-size: 16px;
}

p {
  font-size: 24px; 
  font-weight: bold;
  color: white;
  z-index: 2; 
  margin: 10px 0;
}

.court {
  position: relative;
  width: 80%;
  height: 360px;
  margin: 2rem auto;
  border: 2px solid #000;
  border-radius: 10px;
  overflow: hidden;
}

.court-img {
  width: 100%;
  height: 100%;
  object-fit: inherit; 
  object-position: center;
}

.ball {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 30px;
  height: 30px;
  background-image: url('/images/tennis-ball.png');
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: transform 1s ease-in-out;
}

.avatar {
  position: absolute;
  width: 100px;
  text-align: center;
}

.avatar img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #000;
  object-fit: cover;
}

.avatar p {
  margin-top: 5px;
  font-size: 14px;
  font-weight: bold;
}

.player1 {
  top: 50%;
  left: 5%;
  transform: translateY(-50%);
}

.player2 {
  top: 50%;
  right: 5%;
  transform: translateY(-50%);
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #004225;
  color: #fff;
  margin: 0;
}

.navbar-left {
  display: flex;
  align-items: center;
}

.logo {
  width: 50px;
  height: auto;
  margin-right: 10px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.navbar-right {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 15px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #fff;
  color: #004225;
  font-weight: bold;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #ccc;
}

.controls{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.controlButtons{
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}
</style>
