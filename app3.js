
// var dimension=prompt("Enter the dimension of the puzzle");
class PicturePuzzle {
    constructor(el, width) {
      this.parentEl = el;
      this.width = width;
      this.dimension = 3;
      this.cells = [];
      
      this.init();
      this.createInputForm();
    }
  
    init() {
      this.el = this.createWrapper();
      this.parentEl.appendChild(this.el);
    }
  
    createWrapper() {
      const div = document.createElement('div');
      div.id = 'puzzle_wrapper';
      div.style.position = 'relative';
      div.style.margin = '0 auto';
      return div;
    }
  
  
    createInputForm() {
        const formWrapper = document.createElement('div');
    formWrapper.className = 'form-wrapper';

        const form = document.createElement('form');
        form.style.marginBottom = '5px';
      
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter Image URL';
        form.appendChild(input);
        // input.style.backgroundColor = 'aquamarine';
        
      
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        form.appendChild(fileInput);
       
      
        const select = document.createElement('select');
        select.style.marginLeft = '5px';
        select.style.width = '150px';
        // input.style.backgroundColor = 'aquamarine';

        const option = document.createElement('option');
        option.style.width= '100px';
        option.text = 'Select an image';
        option.disabled = true;
        option.selected = true;
        select.appendChild(option);
      
        const images = JSON.parse(localStorage.getItem('images')) || [];
        images.forEach((imageURL) => {
          const option = document.createElement('option');
          option.value = imageURL;
          option.text = imageURL;
          select.appendChild(option);
        });
      
        form.appendChild(select);
      
        const submitBtn = document.createElement('input');
        submitBtn.type = 'submit';
        submitBtn.value = 'Submit';
        form.appendChild(submitBtn);
      
        form.addEventListener('submit', (event) => {
          event.preventDefault();
          const imageURL = input.value;
          const file = fileInput.files[0];
          const selectedImageURL = select.value;
      
        //   if (imageURL) {
        //     this.loadImage(imageURL);
        //     this.saveImageToLocalStorage(imageURL);
        //   } else if (file) {
        //     const imageURL = URL.createObjectURL(file);
        //     this.loadImage(imageURL);
        //     this.saveImageToLocalStorage(imageURL);
        //   } else if (selectedImageURL) {
        //     this.loadImage(selectedImageURL);
        //   }
        // });
        if (imageURL) {
          this.loadImage(imageURL);
          this.saveImageToLocalStorage(imageURL);
        } 
        else if (file) {
          const reader = new FileReader();
          // console.log(reader.result);
          reader.onload = (e) => {
            console.log(reader.result);
            const uploadedImageURL = e.target.result;
            this.loadImage(uploadedImageURL);
            this.saveImageToLocalStorage(uploadedImageURL);
          };
          reader.readAsDataURL(file);
        }
         else if (selectedImageURL) {
          this.loadImage(selectedImageURL);
        }
      });
      
        this.parentEl.appendChild(form);

        formWrapper.appendChild(form);
    this.parentEl.appendChild(formWrapper);
      }
      
  
    loadImage(imageURL) {
        const img = new Image();
        img.onload = () => {
          console.log(img.width, img.height);
          this.height = (img.height / img.width) * this.width;
      
          this.el.style.width = `${this.width}px`;
          this.el.style.height = `${this.height}px`;
      
          this.setup(imageURL);
        };
        if (imageURL.startsWith('blob:')) {
          img.src = imageURL;
        } 
        else {
          img.crossOrigin = 'anonymous';
          img.src = imageURL;
        }
      }
      saveImageToLocalStorage(imageURL) {
        const images = JSON.parse(localStorage.getItem('images')) || [];
        images.push(imageURL);
        localStorage.setItem('images', JSON.stringify(images));
      }
      loadImageFromLocalStorage(encodedImageURL) {
        const imageURL = atob(encodedImageURL);
        this.loadImage(imageURL);
      }
      
  
    setup(imageURL) {
      const innerDiv = document.createElement('div');
      this.el.appendChild(innerDiv);
  
      for (let i = 0; i < this.dimension * this.dimension ; i++) {
        const cell = new Cell(this, i, imageURL);
        innerDiv.appendChild(cell.el);
        this.cells.push(cell);
      }
      this.shuffleArray();
      console.log(this.cells);
    }
  
    shuffleArray() {
      for (let i = this.cells.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        this.swapCells(i, j);
      }
    }
  
    swapCells(i, j) {
      let temp = this.cells[i];
      this.cells[i] = this.cells[j];
      this.cells[j] = temp;
      this.cells[i].setPosition(i);
      this.cells[j].setPosition(j);
      console.log(this.cells)
      if (this.isGameCompleted()) {
        console.log("Game Completed");
        alert("Congrats!!Game Completed")
        if (confirm("Do you want to play again?")) {
            location.reload();
            }
        
      }
    }
  
    isGameCompleted() {
      for (let i = 0; i < this.cells.length; i++) {
        if (i !== this.cells[i].index) {
          return false;
        }
      }
      return true;
    }
  
    findPosition(ind) {
      const cell = this.cells.find((cell) => cell.index === ind);
      return cell ? this.cells.indexOf(cell) : -1;
    }
  
    findEmpty() {
      return this.cells.findIndex((cell) => cell.isempty);
    }
    setPosition(index) {
      const { left, top } = this.getPositionFromIndex(index);
      this.el.style.left = `${left}px`;
      this.el.style.top = `${top}px`;
    }
  
    getPositionFromIndex(index) {
      return {
        left: this.width * (index % this.dimension),
        top: this.height * Math.floor(index / this.dimension)
      }
    }
  }
  
  class Cell {
    constructor(puzzle, ind, imageURL) {
      this.isempty = false;
      this.puzzle = puzzle;
      this.index = ind;
      this.width = this.puzzle.width / this.puzzle.dimension;
      this.height = this.puzzle.height / this.puzzle.dimension;
      this.el = this.createDiv(imageURL);
      puzzle.el.appendChild(this.el);
  
      if (this.index === this.puzzle.dimension * this.puzzle.dimension - 1) {
        this.isempty = true;
        return;
      }
  
      this.setImage(imageURL);
    }
  
    setPosition(index) {
      const { left, top } = this.getPositionFromIndex(index);
      this.el.style.left = `${left}px`;
      this.el.style.top = `${top}px`;
    }
  
    getPositionFromIndex(index) {
      const { x, y } = this.getXYposition(index);
      return {
        left: this.width * x,
        top: this.height * y
      }
    }
  
    getXYposition(index) {
      return {
        x: index % this.puzzle.dimension,
        y: Math.floor(index / this.puzzle.dimension)
      }
    }
  
    createDiv(imageURL) {
      const div = document.createElement('div');
      div.className= "cell";
      div.style.backgroundSize = `${this.puzzle.width}px ${this.puzzle.height}px`;
      div.style.position = 'absolute';
      div.style.border = '1px solid #FFF';
      div.style.width = `${this.width}px`;
      div.style.height = `${this.height}px`;
  
      div.onclick = () => {
        const currentIndexOftheCell = this.puzzle.findPosition(this.index);
        const emptyCellIndex = this.puzzle.findEmpty();
        const { x, y } = this.getXYposition(currentIndexOftheCell);
        const { x: emptyX, y: emptyY } = this.getXYposition(emptyCellIndex);
  
        if ((x === emptyX || y === emptyY) && (Math.abs(x - emptyX) === 1 || Math.abs(y - emptyY) === 1)) {
          this.puzzle.swapCells(currentIndexOftheCell, emptyCellIndex);
        }
      }
      return div;
    }
  
    setImage(imageURL) {
      const { x, y } = this.getXYposition(this.index);
      const left = this.width * x;
      const top = this.height * y;
  
      this.el.style.backgroundImage = `url(${imageURL})`;
      this.el.style.backgroundPosition = `-${left}px -${top}px`;
    }
  }
  
  const picturePuzzle = new PicturePuzzle(
    document.getElementById('puzzle-wrapper'), // Pass the correct CSS selector for the parent element, e.g., 'body'
    250
  );
  

