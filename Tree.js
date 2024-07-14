function Tree(primaryColor){
  this.primaryColor=primaryColor;
  this.root = null;
  this.levels = [];
  this.rootPosX = width/2;
  this.rootPosY = height/2;
}


Tree.prototype.insert = function(n){
  this.root = this.addNode(this.root, n);
  this.updatePosOfNodes();
}

Tree.prototype.delete = function(n){
  this.root = this.deleteNode(this.root, n);
  this.levels = [];
  console.log(this);
  this.updatePosOfNodes();
}

Tree.prototype.updateLevels = function(node, level){
  if (node !== null) {
    if (!this.levels[level]) {
      this.levels[level] = [];
    }
    this.levels[level].push(node);
    this.updateLevels(node.left, level + 1);
    this.updateLevels(node.right, level + 1);
  }
}

Tree.prototype.updatePosOfNodes = function(){
  this.levels = [];
  this.updateLevels(this.root, 0);
  const canvasWidth = width;
  const canvasHeight = height;
  const levelHeight = canvasHeight / (this.levels.length + 1);
  
  let posX = 0;
  let posY = 0;
  
  this.rootPosX = canvasWidth/2;
  this.rootPosY = levelHeight;
  
  for (let level = 0; level < this.levels.length; level++) {
      const nodesAtLevel = this.levels[level];
      const numNodes = nodesAtLevel.length;
      const levelWidth = canvasWidth / (numNodes + 1);
      posY += levelHeight;
      nodesAtLevel.forEach((node, index) => {
        posX += levelWidth;
        
        node.targetX = posX;
        node.targetY = posY;
        node.moveNode();
      });
      posX = 0;
  }
}

Tree.prototype.traverse = function(){
  if(this.root==null){
    console.log("Tree is empty");
    return;
  }else{
    this.root.traverse();
  }
}

Tree.prototype.search = function(n){
  if(this.root==null){
    return null;
  }else{
    return this.root.search(n);
  }
}

Tree.prototype.getNodes = function() {
  if(this.root==null){
    console.log("Tree is empty");
    return [];
  }else{
    return this.root.getNodes();
  }
}

Tree.prototype.findLeafNodes = function(){
  return this.root.findLeafNodes();
}

Tree.prototype.drawTree = function(){
   for (let level = 0; level < this.levels.length; level++) {
      const nodesAtLevel = this.levels[level];
      const numNodes = nodesAtLevel.length;
      nodesAtLevel.forEach((node, index) => {
        node.moveNode();
        stroke(200);
        strokeWeight(4);
        if (node.left !== null) {
          line(node.x, node.y, node.left.x, node.left.y);
        }
        if (node.right !== null) {
          line(node.x, node.y, node.right.x, node.right.y);
        }
        stroke(0);
        strokeWeight(0);
        fill(node.nodeColor); // Circle color
        ellipse(node.x, node.y, 40, 40); // Circle size
        fill(200); // Text color
        strokeWeight(1);
        textAlign(CENTER, CENTER);
        text(node.val, node.x, node.y);
      });
  }
}

Tree.prototype.getHeight= function(n){
  if(n == null){
    return 0;
  }
  return n.height;
}

Tree.prototype.getBalanceFactor = function(X){
  if(X == null){
    return 0;
  }
  let leftHeight = 0;
  let rightHeight = 0;
  if(X.left != null){
     leftHeight = this.getHeight(X.left)+1;
  }
  if(X.right != null){
    rightHeight = this.getHeight(X.right)+1;
  }
  return leftHeight - rightHeight;
}
/*
rotate
*/
Tree.prototype.rightRotate = function(Y){
  if(Y == null){
    return null;
  }
  X = Y.left;
  if(X != null){
    T2 = X.right;
    Y.left = T2;
    X.right = Y;
  }
  Y.height = max(this.getHeight(Y.right), this.getHeight(Y.left)) + 1;
  
  X.height = max(this.getHeight(X.right), this.getHeight(X.left)) + 1;
  return X;
}

Tree.prototype.leftRotate = function(X){
  if(X == null){
    return null;
  }
  Y = X.right;
  if(Y != null){
    T2 = Y.left; 
    X.right = T2
    Y.left = X;
  }
  
//   update height of nodes
  Y.height = max(this.getHeight(Y.right), this.getHeight(Y.left)) + 1;
  
  X.height = max(this.getHeight(X.right), this.getHeight(X.left)) + 1;
  return Y;
}

Tree.prototype.printNode = function(n){
  let s ="";
  if (n==null){
    return "null";
  }else{
    return "<"+n.val+">"
  }
}

/*
Add node
*/
Tree.prototype.addNode = function(n, val){
  if(n == null){
    return new Node(val, this.rootPosX, this.rootPosY, this.primaryColor);
  }
  if(val == n.val){
    return n;
  }
  if(val < n.val){
    n.left = this.addNode(n.left, val);
  }else{
    n.right = this.addNode(n.right, val);
  }
  
  n.height = max(this.getHeight(n.left), this.getHeight(n.right)) + 1;
  bf = this.getBalanceFactor(n);
  /*
  console.log(n.val, 
              "vals BF is", bf, 
              "| and height is", tree.getHeight(n), 
              "|| left height",tree.getHeight(n.left), 
              "| left node", this.printNode(n.left),
              "|| right height",tree.getHeight(n.right),
              "|| right node", this.printNode(n.right));
  */
  
  //left left
  if(bf > 1 && n.left != null && val < n.left.val){
    return this.rightRotate(n);
  }
  //right right
  if(bf < -1 && n.right != null && val > n.right.val){
    return this.leftRotate(n);
  }
  
  //left right
  if(bf > 1 && val > n.left.val){
    n.left = this.leftRotate(n.left);
    return this.rightRotate(n);
  }
  
  //right left
  if(bf < -1 && val < n.right.val){
    n.right = this.rightRotate(n.right);
    return this.leftRotate(n);
  }
  return n;
}

Tree.prototype.getSuccesser = function(n){
  if(n==null){
    return null;
  }
  if(n.left==null){
    return n;
  }else{
    return this.getSuccesser(n.left);
  }
}

Tree.prototype.deleteNode = function(n, val){
  if(n == null){
    return null;
  }else{
    if(n.val == val){
      if(n.left == null && n.right==null){
        return null;
      }else if(n.left == null){
        return n.right;
      }else if(n.right==null){
        return n.left;
      }
      // if both children are present
      successer = this.getSuccesser(n.right);
      let temp = successer.val;
      successer.val = n.val;
      n.val = temp;
      
      n.right=this.deleteNode(n.right, val);
    }else if (val < n.val){
      n.left = this.deleteNode(n.left, val);
    }else{
      n.right = this.deleteNode(n.right, val);
    }
    n.height = max(this.getHeight(n.left), this.getHeight(n.right)) + 1;
    let bf = this.getBalanceFactor(n);
    
    if(bf > 1 ){
      return this.rightRotate(n);
    }
    //right right
    if(bf < -1 ){
      return this.leftRotate(n);
    }
    return n;
  }
}

/*
Traversal
*/
Tree.prototype.getPreOrder = function(node){
  if(node == null){
    return []
  }else{
    return [node.val, ...this.getPreOrder(node.left), ...this.getPreOrder(node.right)];
  }
}

Tree.prototype.getPostOrder = function(node){
  if(node == null){
    return []
  }else{
    return [...this.getPostOrder(node.left), ...this.getPostOrder(node.right), node.val];
  }
}

Tree.prototype.getInOrder = function(node){
  if(node == null){
    return []
  }else{
    return [...this.getInOrder(node.left), node.val, ...this.getInOrder(node.right)];
  }
}





