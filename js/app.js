
"use strict";

$(document).ready(function() {
    var gameBoard = $('#game-board');
    var timer;
    var elapsedSeconds = 0;
    var clicks = 0; //records how many clicks the user has pressed
    var tile1; // first tile clicked
    var tile2; // second tile clicked
    var matches = 0; //number of matched pairs
    var img1;
    var tiles =[];
    var idx;
    for (idx = 1; idx <= 32; idx++) {
        tiles.push({
            tileNum: idx,
            src: 'img/tile' + idx + '.jpg'
        });
    }
    newGame();

    function check() {
        if (matches == 8) {
            gameBoard.empty();
            gameBoard.text("Congrats!");
            window.clearInterval(timer);
        }
    }

    function newGame() {
        gameBoard.empty();
        window.clearInterval(timer);
        startTimer();
        matches = 0; //number of matched pairs
        $('#elapsed-seconds').text("Time: "+elapsedSeconds);
        $('#matches').text("Matches: "+matches);
        $('#remaining').text("Remaining: "+(8-matches));
        $('#failures').text("Failures: "+(clicks/2-matches));
        var shuffledTiles = _.shuffle(tiles);
        var selectedTiles = shuffledTiles.slice(0, 8);
        var tilePairs = [];
        _.forEach(selectedTiles, function(tile) {
            tilePairs.push(_.clone(tile));
            tilePairs.push(_.clone(tile));
        });
        tilePairs = _.shuffle(tilePairs);
        var row = $(document.createElement('div'));
        var img;
        _.forEach(tilePairs, function(tile, elemIndex) {
            if (elemIndex > 0 && 0 == elemIndex % 4) {
                gameBoard.append(row);
                row = $(document.createElement('div'));
            }
            img = $(document.createElement('img'));
            img.attr({
                src: 'img/tile-back.png',
                alt: 'image of tile ' + tile.tileNum
            });
            img.data('tile', tile);
            row.append(img);
        });
        gameBoard.append(row);

        $('#game-board img').click(function() {
            clicks++;
            var $this = $(this);
            var thisTile = $this.data('tile');
            $(this).fadeOut(100, function() {
                if (thisTile.flipped) {
                    $(this).attr('src', 'img/tile-back.png');
                } else {
                    $(this).attr('src', thisTile.src);
                }
                thisTile.flipped = !thisTile.flipped;
                $(this).fadeIn(100);
            });
            if ((clicks%2) != 0) {
                img1 = $(this);
                tile1 = img1.data('tile');
            } else {
                // this is the second click
                // so img1 refers to the first image
                // and $this refers to the second image (that was just clicked)
                tile2 = thisTile;
                var img2 = $this;
                if (tile1.tileNum == tile2.tileNum) {
                    matches++;
                    img1.off();
                    img2.off();
                } else {
                    // flip back over
                    window.setTimeout(function() {
                        img1.fadeOut(100, function() {
                            img1.attr('src', 'img/tile-back.png');
                            tile1.flipped = !tile1.flipped;
                            img1.fadeIn(100);
                        });
                        img2.fadeOut(100, function() {
                            img2.attr('src', 'img/tile-back.png');
                            tile2.flipped = !tile2.flipped;
                            img2.fadeIn(100);
                        });
                    }, 1000);
                }
                $('#matches').text("Matches: "+matches);
                $('#remaining').text("Remaining: "+(8-matches));
                $('#failures').text("Failures: "+(clicks/2-matches));
                check();
            }
        }); //on click of gameBoard images
    } // New game function

    function startTimer() {
        var startTime = _.now();
        timer = window.setInterval(function() {
            elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
            $('#elapsed-seconds').text("Time: "+elapsedSeconds);
        }, 1000);
    } // Timer function

    $('#startButton').click(function() {
        newGame();
    });

}); //jQuery Ready Function


