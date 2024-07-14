function Node(n, x=0,y=0 , primaryColor){
  this.val = n;
  this.left = null;
  this.right = null;
  
  this.x=x;
  this.y=y;
  this.targetX=0;
  this.targetY=0;
  this.nodeSpeed = 0.05;
  this.nodeColor = primaryColor;
  this.height=1;
}

Node.prototype.traverse  = function(){
  if(this.left != null){
    this.left.traverse();
  }
  console.log(this.val);
  if(this.right != null){
    this.right.traverse();
  } 
}

Node.prototype.search = function(n){
  if(this.val == n){
    // console.log("FOUND");
    return this;
  }else if (this.val > n && this.left != null){
    return this.left.search(n);
  }else if (this.val < n && this.right != null){
    return this.right.search(n);
  }
  return null;
}

Node.prototype.getNodes = function(){
  let elements = [];
  let leftElements = [];
  let rightElements = [];
  if(this.left != null){
    leftElements = this.left.getNodes();
  }
  elements = [...leftElements, ...[this.val]]
  if(this.right != null){
    rightElements = this.right.getNodes();
  } 
  elements = [...elements, ...rightElements];
  return elements;
}

Node.prototype.findLeafNodes = function(){
  let leafCount = 0;
  if(this.left == null && this.right == null){
    leafCount = leafCount + 1;
  }else{
    if(this.right != null){
      leafCount = leafCount + this.right.findLeafNodes();
    }
     if(this.left != null){
      leafCount = leafCount + this.left.findLeafNodes();
    }
  }
  return leafCount;
}

Node.prototype.moveNode = function(){
  this.x += (this.targetX - this.x) * this.nodeSpeed;
  this.y += (this.targetY - this.y) * this.nodeSpeed;
}