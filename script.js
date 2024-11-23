const remainingMembers = [
    "Neha Ma'am",
    "Priya Ma'am",
    "Preksha",
    "Mukesh",
    "Palak",
    "Shekhar",
    "Narendra",
    "Arpita"
  ];
  const pastWinners = ["Preksha", "Aakanksha", "Saurabh", "Pratyush"];
  
  const nameGrid = document.getElementById("name-grid");
  const winnerName = document.getElementById("winner-name");
  const pastWinnersList = document.getElementById("past-winners");
  const startLotteryButton = document.getElementById("start-lottery");
  const lotteryTimeInput = document.getElementById("lottery-time");
  const countdownTimer = document.getElementById("countdown-timer");
  
  let colorInterval;
  
  // Utility to generate random colors
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  // Render the name boxes with random colors
  function renderNameGrid() {
    nameGrid.innerHTML = ""; // Clear existing boxes
    remainingMembers.forEach((member) => {
      const box = document.createElement("div");
      box.classList.add("name-box");
      box.textContent = member;
      box.style.backgroundColor = getRandomColor(); // Set random color
      nameGrid.appendChild(box);
    });
  }
  
  // Start changing the colors of the boxes
  function startColorChange() {
    clearInterval(colorInterval); // Clear any existing interval
    colorInterval = setInterval(() => {
      const boxes = document.querySelectorAll(".name-box");
      boxes.forEach((box) => {
        box.style.backgroundColor = getRandomColor();
      });
    }, 1000);
  }
  
  // Highlight boxes sequentially
  function highlightBoxes() {
    let index = 0;
    const boxes = document.querySelectorAll(".name-box");
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        boxes.forEach((box) => box.classList.remove("highlight"));
        boxes[index].classList.add("highlight");
  
        index = (index + 1) % boxes.length;
      }, 200);
  
      setTimeout(() => {
        clearInterval(interval);
        resolve(boxes[index - 1]); // Return the winning box
      }, 5000);
    });
  }
  
  // Announce the winner
  async function spinAndPickWinner() {
    const winningBox = await highlightBoxes();
    const winner = winningBox.textContent;
  
    // Announce and remove the winner from the grid
    announceWinner(winner);
  }
  
  // Announce and update the winner list
  function announceWinner(winner) {
    // Update the winner name
    winnerName.textContent = winner;
  
    // Add winner to past winners
    pastWinners.push(winner);
  
    // Remove winner from remaining members
    const winnerIndex = remainingMembers.indexOf(winner);
    if (winnerIndex !== -1) {
      remainingMembers.splice(winnerIndex, 1);
    }
  
    // Re-render name grid and past winners
    renderNameGrid();
    updatePastWinners();
  }
  
  // Update past winners list
  function updatePastWinners() {
    pastWinnersList.innerHTML = "";
    pastWinners.forEach((winner) => {
      const li = document.createElement("li");
      li.textContent = winner;
      pastWinnersList.appendChild(li);
    });
  }
  
  // Countdown timer
  function startCountdownTimer(endTime) {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const timeRemaining = endTime - currentTime;
  
      if (timeRemaining <= 0) {
        clearInterval(interval);
        countdownTimer.textContent = "Time's up!";
        spinAndPickWinner();
      } else {
        const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);
        countdownTimer.textContent = `Remaining Time: ${days}d ${hours}h ${minutes}m ${seconds}s`;
      }
    }, 1000);
  }
  
  // Start lottery with a timer
  startLotteryButton.addEventListener("click", () => {
    const selectedTime = new Date(lotteryTimeInput.value).getTime();
    const currentTime = new Date().getTime();
  
    if (selectedTime > currentTime) {
      startCountdownTimer(selectedTime);
      startColorChange();
      alert("Lottery timer started!");
    } else {
      alert("Please select a future time.");
    }
  });
  
  // Initialize
  renderNameGrid();
  updatePastWinners();
  