# Box and Marble Logic Puzzle

[🌐 **Live Demo**](https://horaciovelvetine.github.io/box-and-marble/)

A classic logical reasoning challenge implemented as an interactive web application. Test your deductive reasoning skills with this engaging puzzle that combines visual elements with logical thinking.

## The Puzzle

Imagine you are given 3 matchboxes labeled: "Red and White", "Red and Red", and "White and White". Each box contains 2 marbles which can be either red or white. **The labels on each box are incorrect** (although the labels would be correct if you switched them around). You are allowed to peek inside one box and look at exactly one marble in that box. Can you figure out what's in each box and label them correctly?

### Key Questions to Consider

- Can you figure out what is in each box and fix the labels to be correct? 
- Does it matter which box you choose to open at the start? 
- Does this puzzle rely on inductive or deductive reasoning? 
- Can you be sure of your answer?

### The Facts

You are given 3 matchboxes with *incorrect labels*:
- **"Red and White"** 
- **"Red and Red"**   
- **"White and White"** 

There are a total of 6 marbles - 3 red and 3 white.

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software or dependencies required

### Installation & Setup

1. **Clone or Download the Repository**
   ```bash
   git clone <repository-url>
   cd box-and-marble
   ```

2. **Open the Application**
   - **Option 1: Direct File Opening**
     - Simply double-click on `index.html` to open it in your default browser
   
   - **Option 2: Using a Local Server (Recommended)**
     - Use VS Code with the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
     - Right-click on `index.html` and select "Open with Live Server"
   
   - **Option 3: Using Python's Built-in Server**
     ```bash
     # Python 3
     python -m http.server 8000
     
     # Python 2
     python -m SimpleHTTPServer 8000
     ```
     Then navigate to `http://localhost:8000` in your browser

## How to Play

### Step 1: Understanding the Setup
- You'll see three matchboxes with incorrect labels
- Each box contains exactly 2 marbles (either red or white)
- The labels describe the possible combinations but are currently wrong

### Step 2: Making Your Choice
1. **Select a Box**: Click the "Check Box" button on any of the three matchboxes
2. **View Contents**: You'll see one marble from the selected box (randomly chosen)
3. **Note**: Once you check a box, you cannot check any others!

### Step 3: Label Assignment
1. **Assign Labels**: Use the dropdown menus to select the correct label for each box
2. **Submit Answers**: Click "Check My Answers" when you've made all selections
3. **View Results**: See detailed feedback on your performance

### Step 4: Play Again
- Click "Play Again" to start a new puzzle with a different configuration
- Click "Reset Puzzle" to restart the current puzzle

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. The application is available at:

[🌐 **Live Demo**](https://horaciovelvetine.github.io/box-and-marble/)

### Local Development

For local development, you can run the application using any of the methods described in the [Getting Started](#getting-started) section.

## License

This project is open source and available under the [MIT License](LICENSE).

---

**Happy puzzling! 🧩✨**

