//units px
var emUnit = 16; 
var counterLength = emUnit * 1.6;
var grid = [];
var player = 1;
var tokenGoal = 4; //how many token need to be in a row to win
var currentWin = 0; //represent winning loop

function changeRowLength(sign) {
    counter = document.getElementById("lengthCounter");
    currentCount = counter.innerHTML;
    counter.innerHTML = parseInt(currentCount) + parseInt(sign.id);
    tokenGoal = parseInt(counter.innerHTML)
}

function playerColorChange(p) {
    splitId = p.id.split(","); //splitId[0] = player (e.g:1), slitId[1] = color
    var r = document.querySelector(':root');
    console.log(splitId[1]);
    r.style.setProperty('--player-'+splitId[0]+'-color', "var(--player-color-" + splitId[1] + ")");
}

function showOptions() {
    console.log("open options")
    var options = document.getElementById("options");
    var exit = document.getElementById("optionsExit");
    if (options.style.display === "none") {
        options.style.display = "block";
        exit.style.display = "block";
        options.style.animation = "fadeIn 0.35s";
    } else {
        options.style.animation = "fadeOut 0.35s";
        exit.style.display = "none";
      setTimeout(function() {
        options.style.display = "none";
      }, 250);
    }
}


function start() {
    //creating color pallete
    var colors = 6;
    for (p = 1; p <= 2; p++) {
        for (c = 0; c < colors; c++) {
            newButton = document.createElement("button");
            newButton.className = "color-picker centered pick-" + c;
            newButton.setAttribute("onClick", "playerColorChange(this)");
            newButton.setAttribute("id", p + "," + c);
            document.getElementById("p" + p + "ColorPicker").appendChild(newButton);
        }
    }
    render()
}


function resetGrid() {
    //reset grid
    grid = document.getElementById("grid-container")
    let x = 0;
    while (x == 0) {
        if (grid.firstChild) {
            grid.removeChild(grid.lastChild);
        } else {
            x = 1;
        }
    }
    render()
}


function resetScore() {
    //reset player scores
    document.getElementById("c1").innerHTML = 0;
    document.getElementById("c2").innerHTML = 0;
}


function render() {
    //creating play grid
    const width = Math.floor(window.innerWidth / emUnit);
    const height = Math.floor((window.innerHeight - counterLength) / emUnit);
    const grid = document.getElementById("grid-container");
    for (x = 0; x <= width; x++) {
        for (y = 0; y <= height; y++) {
            tile = document.createElement("button");
            tile.className = "tile player0";
            tile.setAttribute("style", "grid-column-start: " + x + "; grid-row-start: " + y + ";"); //tile's location
            tile.setAttribute("onClick", "spawn(this)")
            tile.setAttribute("id", x + "," + y) //coordinates of tile
            tile.setAttribute("name", 0) //placeholder for player
            grid.appendChild(tile);
        }
    }
    document.getElementById("lengthCounter").innerHTML = tokenGoal;
}

function spawn(tile) {
    splitId = tile.id.split(",");

    if (tile.name == 0) {
        tile.setAttribute("name", player); //change tile id to show player
        tile.className = "tile player" + player; //change tile color
        
        for (x = -1; x < 2; x++) {
            for (y = -1; y < 2; y++) {
                if (x != 0 || y != 0) {
                    var c = 1
                    while (c < tokenGoal && c != -1) {
                        try {
                            var tempX = parseInt(splitId[0]) + x * c;
                            var tempY = parseInt(splitId[1]) + y * c;
                            tempTile = document.getElementById(tempX + "," + tempY);
                            if (tempTile.name == player) {
                                c++
                                if (currentWin == 1) {
                                    tempTile.setAttribute("class", "tile blocked"); //winning loop
                                    tempTile.setAttribute("name", 3); //3 = blocked
                                }

                                if (c == tokenGoal && currentWin != 1) {
                                    tempWins = document.getElementById("c"+player).innerHTML;
                                    document.getElementById("c"+player).innerHTML = parseInt(tempWins) + 1
                                    tile.setAttribute("class", "tile blocked");
                                    tile.setAttribute("name", 3)
                                    currentWin = 1;
                                    c = 1; //reset loop to change winning tiles to red
                                }
                            }
                            else {
                                c = -1;
                            }
                        }
                        catch {
                            c = -1;
                        }
                    }
                    if (currentWin == 1) {
                        currentWin = 0; //reset winning loop
                    }
                }
            }
        }

        if (player == 1) {
            player = 2; //change player's turn
        }
        else {
            player = 1;
        }
        document.getElementById("turn-banner").className = "banner t" + player;
    }
}