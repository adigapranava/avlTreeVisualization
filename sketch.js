let popupMessage = '';
let popupTimer = 0;
let input;
let addButton;
let deleteButton;
let infoButton;
let backgroundColor = "#111";
let primaryColor = '#ED225D';
let textColor = '#fff'
let infoVisible = false;
let insertRandomVal = true;
let canvasWidth;
let canvasHeight;

function toggleInfo() {
  infoVisible = !infoVisible;
  if(!infoVisible){
    infoButton.html("Info");
    input.show();
    button.show();
  }else{
    infoButton.html("Close");
    input.hide();
    button.hide();
  }
}

function createInputForm() {
  input = createInput();
  input.size(230, 18); 
  input.position(canvasWidth/2-input.width/2, canvasHeight-input.height-35);
  input.style('font-size', '16px');
  input.style('padding', '8px');
  input.style('border', '1px solid #ccc');
  input.style('border-radius', '4px');
  input.attribute('placeholder', 'Enter a number');
  //when enter is pressed
  input.elt.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
      addNode(input.value());
    }
  });
  
  addButton = createButton('➕');
  addButton.position(input.x + input.width-addButton.width*2-9, input.y);
  addButton.mousePressed(()=>{
    addNode(input.value())
  });
  addButton.style('font-size', '14px');
  addButton.style('padding', '9px 16px');
  addButton.style('border', 'none');
  addButton.style('border-radius', '4px');
  addButton.style('background-color', '#4CAF50');
  addButton.style('color', 'white');
  
  deleteButton = createButton('➖');
  deleteButton.position(addButton.x + addButton.width + 10, addButton.y); 
  deleteButton.mousePressed(() => {
    removeNode(input.value());
  });
  deleteButton.style('font-size', '14px');
  deleteButton.style('padding', '9px 16px');
  deleteButton.style('border', 'none');
  deleteButton.style('border-radius', '4px');
  deleteButton.style('background-color', '#f44336');
  deleteButton.style('color', 'white');

  //info button
  infoButton = createButton('Info');
  infoButton.position(width - 100, height-input.height-35);
  infoButton.mousePressed(toggleInfo);
  infoButton.style('font-size', '16px');
  infoButton.style('padding', '9px 16px');
  infoButton.style('border', 'none');
  infoButton.style('border-radius', '4px');
  infoButton.style('background-color', primaryColor);
  infoButton.style('color', 'white');
  
  // Initial setup for popup
  infoVisible = false;
}

function addNode(val){
  if(!infoVisible){
    let int_val = parseInt(val);
    if(isNaN(int_val)){
      showPopup('Please enter a valid number');
    }else if(tree.search(int_val)!=null){
      showPopup(int_val + ' Already exists in the tree!')
    }
    else{
      tree.insert(int_val);
      showPopup('Inserted '+int_val+ ' to the tree!');
      console.log("addNode Val: ", val, tree.root);
    }
  }
}

function removeNode(val){
  if(!infoVisible){
    let int_val = parseInt(val);
    if(isNaN(int_val)){
      showPopup('Please enter a valid number');
    }else if(tree.search(int_val)!=null){
      tree.delete(int_val);
      showPopup(int_val + ' deleted from the tree!')
    }
    else{
      showPopup(int_val+ ' not present in the tree!');
    }
  }
}

function showPopup(message) {
  popupMessage = message;
  popupTimer = millis();
}

function windowResized() {
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;
  resizeCanvas(canvasWidth, canvasHeight);
  redraw();
  input.position(width/2-input.width/2, height-input.height-35);
  addButton.position(input.x + input.width, input.y);
   deleteButton.position(addButton.x + addButton.width + 10, addButton.y); 
  infoButton.position(width - 100, height-input.height-35);
  
}

function drawInfo() {
  // Draw the blurred background
  fill(255, 255, 255, 20);
  rect(20, 20, windowWidth - 40, windowHeight - 100, 20);
  filter(BLUR, 5);
  
  // Draw the text content
  fill(255);
  textSize(20);
  textAlign(CENTER, CENTER);
  text("🌿AVL Tree🌿", windowWidth / 2, 50);
  
  // Draw a line below the title
  stroke(255); // Set line color to white
  line(windowWidth / 2 - 50, 70, windowWidth / 2 + 50, 70); 
  strokeWeight(0);
  
  let inorder = tree.getInOrder(tree.root);
  let preorder = tree.getPreOrder(tree.root);
  let postorder = tree.getPostOrder(tree.root);
  let treeHeight = tree.getHeight(tree.root);
  
  // Display tree height
  text("Tree Height: " + treeHeight, windowWidth / 2, 100);
  
  // Display traversal values
  textSize(16);
  text("Inorder:", windowWidth / 4, 150);
  displayList(inorder, windowWidth / 4, 180);
  
  text("Preorder:", windowWidth / 2, 150);
  displayList(preorder, windowWidth / 2, 180);
  
  text("Postorder:", windowWidth * 3 / 4, 150);
  displayList(postorder, windowWidth * 3 / 4, 180);
}

function displayList(list, x, startY) {
  let lineHeight = 20;
  for (let i = 0; i < list.length; i++) {
    text(list[i], x, startY + i * lineHeight);
  }
}



function setup() {
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;
  canvas = createCanvas(windowWidth, windowHeight);
  background(backgroundColor);
  createInputForm();  
  tree = new Tree(primaryColor);
  
  //insert Random Val
  canvas.mousePressed(()=>{
    if(!infoVisible && insertRandomVal){
      val = floor(random(1,1000));
      if(tree.search(val)!=null){
        val = floor(random(1,1000));
      }
      addNode(val);
    }
  });
  
  textAlign(CENTER, CENTER);
  textSize(16);  
}

function draw() {
  background("#111");
  tree.drawTree();
  
  if (popupMessage && millis() - popupTimer < 2000) {
    fill(primaryColor);
    rectMode(CENTER);
    rect(canvasWidth / 2, 50, 300, 50, 10);
    fill(textColor);
    text(popupMessage, width / 2, 50 + 5);
    rectMode(CORNER);
  } else {
    popupMessage = '';  // Clear the popup message after 2 seconds
  }
  
  if (infoVisible) {
    drawInfo();
  }
}