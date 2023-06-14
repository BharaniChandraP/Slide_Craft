// Function to randomize the initial arrangement of squares
function randomizeSquares() {
    const squares = Array.from(document.getElementsByClassName("square"));
    const numbers = Array.from({ length: 8 }, (_, i) => i + 1);
    numbers.push(""); // Add an empty square
  
    squares.forEach((square) => {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      const number = numbers.splice(randomIndex, 1)[0];
      square.textContent = number;
      square.classList.toggle("empty", number === "");
    });
  }
  
  // Function to check if the puzzle is completed
  function isPuzzleComplete() {
    const squares = Array.from(document.getElementsByClassName("square"));
    const numbers = squares.map((square) => square.textContent);
    const sortedNumbers = [...numbers].sort((a, b) => a - b);
    return numbers.join("") === sortedNumbers.join("");
  }
  
//   // Function to handle square click and swapping
//   function handleSquareClick() {
//     if (this.classList.contains("empty")) return;
  
//     const emptySquare = document.querySelector(".empty");
//     const currentNumber = this.textContent;
//     const emptyNumber = emptySquare.textContent;
  
//     this.textContent = emptyNumber;
//     this.classList.add("empty");
//     emptySquare.textContent = currentNumber;
//     emptySquare.classList.remove("empty");
  
//     if (isPuzzleComplete()) {
//       alert("Congratulations! You solved the puzzle!");
//     }
//   }
// Function to get the row and column index of a square
function getSquareIndex(square) {
    const squares = Array.from(document.getElementsByClassName("square"));
    const index = squares.findIndex((element) => element === square);
    const row = Math.floor(index / 3);
    const col = index % 3;
    return { row, col };
  }
  
  // Function to calculate the distance between two squares
  function calculateDistance(square1, square2) {
    const index1 = getSquareIndex(square1);
    const index2 = getSquareIndex(square2);
    return Math.abs(index1.row - index2.row) + Math.abs(index1.col - index2.col);
  }
  
  // Function to handle square click and swapping
  function handleSquareClick() {
    if (this.classList.contains("empty")) return;
  
    const emptySquare = document.querySelector(".empty");
  
    // Check if the clicked square is adjacent to the empty square
    if (calculateDistance(this, emptySquare) !== 1) return;
  
    const currentNumber = this.textContent;
  
    // Swap the numbers between the clicked square and the empty square
    this.textContent = "";
    this.classList.add("empty");
    emptySquare.textContent = currentNumber;
    emptySquare.classList.remove("empty");
  
    if (isPuzzleComplete()) {
      alert("Congratulations! You solved the puzzle!");
    }
  }
  
  
  // Function to start the game
  function startGame() {
    randomizeSquares();
    const squares = Array.from(document.getElementsByClassName("square"));
    squares.forEach((square) => square.addEventListener("click", handleSquareClick));
  }
  
  // Start the game when the page loads
  window.addEventListener("DOMContentLoaded", startGame);
  