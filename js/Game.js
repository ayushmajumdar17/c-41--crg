class Game {
  constructor() {

  }

  getState() {
    var gameStateRef = database.ref('gameState');
    gameStateRef.on("value", function (data) {
      gameState = data.val();
    })

  }

  update(state) {
    database.ref('/').update({
      gameState: state
    });
  }

  async start() {
    if (gameState === 0) {
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if (playerCountRef.exists()) {
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }

    car1 = createSprite(100, 200);
    car1.addImage(car1img);
    car2 = createSprite(300, 200);
    car2.addImage(car2img);
    car3 = createSprite(500, 200);
    car3.addImage(car3img);
    car4 = createSprite(700, 200);
    car4.addImage(car4img);
    cars = [car1, car2, car3, car4];
  }

  play() {
    form.hide();

    Player.getPlayerInfo();
    player.getCarsRank();

    if (allPlayers !== undefined) {
      background("#c68767");
      image(track, 0, -displayHeight * 4, displayWidth, displayHeight * 5);

      //var display_position = 100;

      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 175;
      var y;

      for (var plr in allPlayers) {
        //add 1 to the index for every loop
        index = index + 1;

        //position the cars a little away from each other in x direction
        x = x + 200;
        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        cars[index - 1].x = x;
        cars[index - 1].y = y;

        if (index === player.index) {
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth / 2;
          camera.position.y = cars[index - 1].y;
          fill("red");
          circle(x, y, 80);

        }

        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }

    }

    if (keyIsDown(UP_ARROW) && player.index !== null) {
      yVel += 0.5;
      player.distance += yVel;
      player.update();
      // console.log(player.distance);

    }
    if (player.distance > 3750) {
      gameState = 2;
      player.rank += 1
      Player.updateCarsAtEnd(player.rank);



    }

    drawSprites();

  }
  end() {
    console.log("GAMEOVER");
    console.log(player.rank);
  }

  displayRanks() {
    background(whiteback);
    camera.position.x = 0;
    camera.position.y = 0;
    imageMode(CENTER);
    Player.getPlayerInfo();
    image(gold, 0, -100, 250, 300);
    image(silver, displayWidth / 4, -100 + displayHeight / 10, 225, 270);
    image(bronze, displayWidth / -4, -100 + displayHeight / 9, 200, 240);


    textAlign(CENTER);
    textSize(50);



    for (var plr in allPlayers) {

      if (allPlayers[plr].rank === 1) {
        text("1st: " + allPlayers[plr].name, 0, 200);
      }
      else if (allPlayers[plr].rank === 2) {
        text("2nd: " + allPlayers[plr].name, displayWidth / 4, displayHeight / 9 + 73);
      }

      else if (allPlayers[plr].rank === 3) {
        text("3rd: " + allPlayers[plr].name, displayWidth / -4, displayHeight / 10 + 76);
      }
      else {
        textSize(30);
        text("Honorable mention: " + allPlayers[plr].name, 0, 225);
      }
    }


  }
}
