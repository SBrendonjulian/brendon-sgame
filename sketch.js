var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  trex_running = loadAnimation("boy1.png","boy2.png","boy3.png");
  trex_collided = loadAnimation("boyhit.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("realcloud.png");
  
  obstacle1 = loadImage("realbush.png");
  obstacle2 = loadImage("realtrain.png");
  obstacle3 = loadImage("realcar.png");
  obstacle4 = loadImage("bike.png");
  obstacle5 = loadImage("truck.ico");
  
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(displayWidth, displayHeight-110);

  var message = "This is a message";
 console.log(message)
  
  trex = createSprite(50,displayHeight-220 ,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  

  trex.scale = 1.3;
  
  ground = createSprite(200,displayHeight-200,displayWidth,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  gameOver = createSprite(displayWidth/2,displayHeight/2+100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(displayWidth/2,displayHeight/2+130);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(200,displayHeight-190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = false;
  
  score = 0;
  
}

function draw() {
  
  background(180);
  //displaying score
  textSize(20);
  text("Score: "+ score, displayWidth-100,displayHeight/2-100);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
     
    if (ground.x < 100){
      ground.x = ground.width/2+100;
    }
    console.log(trex.y);
    //jump when the space key is pressed
    if(keyDown("space")) {
      //&& trex.y >= 611.8
        trex.velocityY = -15;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
      
  if(mousePressedOver(restart)) {
      reset();
    }   
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset(){
  
  gameState=PLAY;
  
  gameOver.visible=false;
  restart.visible=false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running", trex_running);
  score=0;
}


function spawnObstacles(){
 if (frameCount % 200 === 0){
   var obstacle = createSprite(600,displayHeight-230,10,40);
   obstacle.velocityX = -(6 + score/100);
   obstacle.debug = true;
    var rand = Math.round(random(1,5));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);//bush
              obstacle.scale = 0.01;
              break;
      case 2: obstacle.addImage(obstacle2);//train
              obstacle.scale = 0.5;
              break;             
      case 3: obstacle.addImage(obstacle3);//car
              break;
      case 4: obstacle.addImage(obstacle4);//bike
              obstacle.scale = 0.4;
              break;
      case 5: obstacle.addImage(obstacle5);//truck
              obstacle.scale = 0.6;
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 140 === 0) {
    var cloud = createSprite(600,200,40,10);
    cloud.y = Math.round(random(displayHeight/2-100,displayWidth/2-150  ));
    cloud.addImage(cloudImage);
    cloud.scale = 0.1;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

