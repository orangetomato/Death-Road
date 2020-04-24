import Field from './objects/field.js';
import Road from './objects/road.js';
import River from './objects/river.js';
import FinishZone from './objects/finish_zone.js';
import Frog from './objects/frog.js';
import Car from './objects/car.js';
import Log from './objects/log.js';

export default class Game {
    constructor(menuView, view, sounds, repo, canvasWidth, canvasHeight) {
        this.menuView = menuView;
        this.view = view;
        this.sounds = sounds;
        this.repo = repo;

        const grid = canvasWidth / 12;
        
        //Client scores
        this._highScore = [];
        console.log('Client scores before the start:', this._highScore);//

        //Game options
        this._isVibrationSwitchOn = false;
        this._isSoundsSwitchOn = true;
        
        //Dynamic objects animation
        this._requestId;
        this._intervalId;

        //Event handlers
        this._escKeycode = 27;
        this._leftArrowKeycode = 37;
        this._upArrowKeycode = 38;
        this._rightArrowKeycode = 39;
        this._downArrowKeycode = 40;
        this._isPressed = false;

        this._touchstartX;
        this._touchstartY;
        this._touchendX;
        this._touchendY;
        this._touches = [];

        //Object creation
        this._field = new Field(0, 0, canvasWidth, canvasHeight, 'lightgreen');
        this._road = new Road(0, canvasHeight - grid * 6, canvasWidth, grid * 4, 'gray');
        this._river = new River(0, canvasHeight - grid * 12, canvasWidth, grid * 5, 'blue');

        //Finish zones
        this._finishZones = [];
        let color = 'lightgreen';
        let radius = grid / 2;
        let yPos = canvasHeight - grid * 12 + grid / 2;

        for (let i = 0; i < 5; i++) {
            let xPos = i * (grid * 2.5) + radius + grid / 2;
            this._finishZones[i] = new FinishZone(xPos, yPos, radius, color);
        }
        
        //Frog
        this._frogSits = new Image();
        this._frogJumps = new Image();
        this._frogSits.src = 'pictures/frog1.png';
        this._frogJumps.src = 'pictures/frog2.png';
        this._frogIntervalId;
        this._timesRun = 0;
        this._isDead = false;
        this._isAwarded = false;
        this._frog = new Frog(canvasWidth * 0.5 - grid * 0.25, canvasHeight - grid * 0.75, grid * 0.5, grid * 0.5, this._frogSits);

        //Cars
        this._cars = [];
        let carIndex = 0;

        //Row 3
        for (let i = 0; i < 2; i++) {
            this._cars[carIndex] = new Car(i * (grid * 5), canvasHeight - grid * 3 + 6, grid * 2, grid - 12, this.generateColor(), 1);
            carIndex++;
        }

        //Row 4
        for (let i = 0; i < 2; i++) {
            this._cars[carIndex] = new Car(i * (grid * 6), canvasHeight - grid * 4 + 6, grid * 2, grid - 12, this.generateColor(), 2);
            carIndex++;
        }

        //Row 5
        for (let i = 0; i < 2; i++) {
            this._cars[carIndex] = new Car(i * (grid * 6), canvasHeight - grid * 5 + 6, grid, grid - 12, this.generateColor(), -3);
            carIndex++;
        }
        
        //Row 6
        for (let i = 0; i < 2; i++) {
            this._cars[carIndex] = new Car(i * (grid * 7), canvasHeight - grid * 6 + 6, grid * 2.5, grid - 12, this.generateColor(), -1);
            carIndex++;
        }

        //Logs
        this._logs = [];
        let logIndex = 0;

        //Row 8
        for (let i = 0; i < 3; i++) {
            this._logs[logIndex] = new Log(i * (grid * 5), canvasHeight - grid * 8 + grid / 2 + 5, grid * 3, grid - 20, 'SaddleBrown', 1);
            logIndex++;
        }

        //Row 9
        for (let i = 0; i < 2; i++) {
            this._logs[logIndex] = new Log(i * (grid * 7), canvasHeight - grid * 9 + grid / 2 + 5, grid * 1, grid - 20, 'SaddleBrown', -3);
            logIndex++;
        }

        //Row 10
        for (let i = 0; i < 2; i++) {
            this._logs[logIndex] = new Log(i * (grid * 7), canvasHeight - grid * 10 + grid / 2 + 5, grid * 3, grid - 20, 'SaddleBrown', 2);
            logIndex++;
        }
        
        //Row 11
        for (let i = 0; i < 3; i++) {
            this._logs[logIndex] = new Log(i * (grid * 4.5), canvasHeight - grid * 11 + grid / 2 + 5, grid * 2, grid - 20, 'SaddleBrown', -1);
            logIndex++;
        }

        //SPA
        this._isGame = false;
        this._SPAState;
        this.switchToStateFromURLHash();
    }

    //Frog moving
    jump(frog) {

        if (frog.imageToDraw === this._frogSits) {
            frog.imageToDraw = this._frogJumps;
        } else if (frog.imageToDraw === this._frogJumps) {
            frog.imageToDraw = this._frogSits;
        }
    }

    moveLeft(frog) {
        frog.xPos -= frog.step;
        frog.angle = 270;
        this.jump(frog);
    }
    
    moveForward(frog) {
        frog.yPos -= frog.step;
        frog.angle = 0;
        this.jump(frog);
    }
    
    moveRight(frog) {
        frog.xPos += frog.step;
        frog.angle = 90;
        this.jump(frog);
    }
    
    moveBack(frog) {
        frog.yPos += frog.step;
        frog.angle = 180;
        this.jump(frog);
    }

    resetPosition(frog) {
        frog.xPos = this._field.width * 0.5 - 50 * 0.25;
        frog.yPos = this._field.height - 50 * 0.75;
        frog.angle = 0;
        this._isDead = false;
        this._isAwarded = false;
    }

    //Fullscreen
    runInFullscreen() {
        document.body.requestFullscreen();
    }

    cancelFullscreen() {
        document.exitFullscreen();
    }

    //SPA
    beforeUnloadHandler(evt) {
        console.log('Game is running:', this._isGame);
        if (this._isGame) {
            evt.returnValue = 'Are you sure?';
        }
    }

    switchToStateFromURLHash() {
        const URLHash = location.hash;
        console.log('URLHash:', URLHash);//
        console.log('SPAState before:', this._SPAState);//

        const stateString = URLHash.substr(1);
        if (stateString !== '') {
            this._SPAState = {pagename: stateString};
        } else {
            this._SPAState = {pagename: 'Menu'};
        }

        console.log('SPAState after:', this._SPAState);//

        switch (this._SPAState.pagename) {
            case 'Menu':
                this.backToMenu();
                break;
            case 'Game':
                this.showGame();
                break;
            case 'Rules':
                this.showRules();
                break;
            case 'Scores':
                this.showHighScore();
                break;
            case 'Settings':
                this.showSettings();
                break;
        }
    }

    switchToMenu() {
        this.switchToState( {pagename: 'Menu'} );
    }

    switchToGame() {
        this.switchToState( {pagename: 'Game'} );
    }

    switchToRules() {
        this.switchToState( {pagename: 'Rules'} );
    }

    switchToScores() {
        this.switchToState( {pagename: 'Scores'} );
    }

    switchToSettings() {
        this.switchToState( {pagename: 'Settings'} );
    }

    switchToState(newState) {
        const stateString = newState.pagename;
        console.log(stateString);//
        location.hash = stateString;
    }

    backToMenuHandler() {
        switch (this._SPAState.pagename) {
            case 'Menu':
                break;
            case 'Game':

                if (this._frog.lives) {
                    this.switchPause();
                }

                this.menuView.showOverlay();
                this.menuView.showPopup();
                break;
            default:
                this.backToMenu();
                break;
        }
    }

    //Popup
    yesHandler() {
        this.menuView.hideOverlay();
        this.menuView.hidePopup();
        this.exit();
    }

    noHandler() {
        this.menuView.hideOverlay();
        this.menuView.hidePopup();

        if (this._frog.lives) {
            this.switchPause();
        }
    }

    //Menu handlers
    showGame() {
        this._isGame = true;
        this.runInFullscreen();
        this.menuView.hideSection();
        this.menuView.showGame();
        this.startGame();
    }

    showRules() {
        this.menuView.hideSection();
        this.menuView.showRules();
    }

    showHighScore() {
        this.getData();
        this.menuView.hideSection();
        this.menuView.showHighScore();
    }

    showSettings() {
        this.menuView.hideSection();
        this.menuView.showSettings();
    }

    showResult(frog) {
        this.menuView.hideSection();
        this.menuView.showResult();
        this.menuView.showPoints(frog.points);
        this.menuView.resetInput();
        this.menuView.addFocus();
    }

    backToMenu() {
        this._isGame = false;
        this.switchToState( {pagename: 'Menu'} );
        this.menuView.hideSection();
        this.menuView.showMenu();
    }

    //Score submitting
    submitButtonHandler(evt) {
        evt.preventDefault();

        const points = this._frog.points;

        if (points && (this._highScore.length < 10 || points > this._highScore[this._highScore.length - 1][1])) {
            this.validate(points);
        } else {
            this.backToMenu();
        }
    }

    validate(points) {
        const input = document.querySelector('.form__input');
        const name = input.value;

        if ((/^\w{1,12}$/).test(name)) {
            this.addResult(name, points);
            this.backToMenu();
        } else {
            this.menuView.hideInvalidInput();
            input.width = input.offsetWidth;
            this.menuView.showInvalidInput();

            if (this._isVibrationSwitchOn) {
                navigator.vibrate(500);
            }
        }
    }

    addResult(name, points) {
        const score = {
            'name': name,
            'points': points
        };

        this.repo.pushScore(score)
        .then(() => {
            console.log('File was pushed successfully');
            this.getData();
        })
        .catch(function() {
            console.log('Error! File was not pushed');
        });
    }

    findMinResult(scores, keys) {
        let minKey = keys[0];

        for (let i = 1; i < keys.length; i++) {
            if (scores[keys[i]].points < scores[minKey].points) {
                minKey = keys[i];
            }
        }

        console.log('Database min points < current points:', scores[minKey].points < this._frog.points);//
        console.log('Database minItem:', scores[minKey]);//
        console.log('Database minItem key:', minKey);//

        return minKey;
    }

    updateScores(scores) {
        this.sortScores(scores);

        this.menuView.removeTable();
        this.menuView.showTable(this._highScore);
        console.log('Final client scores:', this._highScore);//
    }

    compareScores(scores) {
        const keys = Object.keys(scores);
        console.log('Database keys:', keys);//

        const minKey = this.findMinResult(scores, keys);

        if (scores[minKey].points < this._frog.points && keys.length > 10) {
            const deletionPromise = this.repo.deleteScore(minKey);

            console.log('deletionPromise', deletionPromise);

            deletionPromise.then(() => {
                console.log('File was deleted successfully');
                this.getData();
            }).catch(function() {
                console.log('Error! File was not deleted');
            });
        } else {
            this.updateScores(scores);
        }
    }

    getRecievingPromise() {
        this._highScore = [];
        return this.repo.getScore();
    }

    getData() {
        console.log('Client scores:', this._highScore)//

        const recievingPromise = this.getRecievingPromise();
        console.log('recievingPromise:', recievingPromise);//

        return recievingPromise.then(data => {
            console.log('Raw database data:', data);//
            const scores = data.val();
            console.log('Database scores:', scores);//

            if (scores) {
                this.compareScores(scores);
            }
        })
        .catch(function() {
            console.log('Error! Can\'t get scores data!');
        });
    }

    sortScores(scores) {
        const keys = Object.keys(scores);
        console.log('Database keys:', keys);//

        for (let key of keys) {
            const gotName = scores[key].name;
            const gotPoints = scores[key].points;
            const gotData = [gotName, gotPoints];

            console.log('Recieved data:', gotData);//
            
            for (let i = 0; i < 10; i++) {
                if (!this._highScore[i]) {
                    this._highScore.push(gotData);
                    break;
                } else if (gotData[1] > this._highScore[i][1]) {
                    this._highScore.splice(i, 0, gotData);
                    break;
                }
            }
        }
        console.log('Client scores:', this._highScore);//
    }

    //Timer
    startTimer() {
        this._intervalId = setInterval(this.changeTime.bind(this, this._frog), 1000);
        console.log('Start timer');//
    }

    changeTime(frog) {
        frog.time--;

        if (!frog.time) {
            console.log('Time is over');//
            this.reduceLives(frog);
            setTimeout(() => this.resetPosition(frog), 100);

            if (this._isSoundsSwitchOn) {
                this.sounds._frogSound.play();
            }
        }

        this.view.updateTime(frog);
    }

    //New game
    resetGame() {
        let lastLevel = this._frog.level;

        this._cars = this._cars.map(function(item) {
            item.speed > 0 ? item.speed -= (lastLevel - 1) / 2 : item.speed += (lastLevel - 1) / 2;
            return item;
        });

        this._logs = this._logs.map(function(item) {
            item.speed > 0 ? item.speed -= (lastLevel - 1) / 2 : item.speed += (lastLevel - 1) / 2;
            return item;
        });

        this._finishZones = this._finishZones.map(function(item) {
            item.color = 'lightgreen';
            return item;
        });
        
        this.view.switchPauseButtonOff();
        clearInterval(this._intervalId);
        console.log('Stop timer');//
        this.resetPosition(this._frog);
        this._frog.lives = 3;
        this._frog.points = 0;
        this._frog.level = 1;
        this._frog.time = 30;
        this._frog.step = 25;
    }

    startGame() {
        this.resetGame();
        this.view.updateLevel(this._frog);
        this.view.updatePoints(this._frog);        
        this.view.updateLives(this._frog);
        this.view.updateTime(this._frog);
        this.runAnimation(this._field, this._road, this._river, this._finishZones, this._cars, this._logs, this._frog);
        console.log('Start animation');//
        this.startTimer();

        if (this._isSoundsSwitchOn) {
            this.sounds._frogSound.play();
        }

        console.log('Game started');//
    }

    endGame(frog) {

        if (document.fullscreenElement) {
            this.cancelFullscreen();
        }
        
        console.log('Lives are over');//
        cancelAnimationFrame(this._requestId);
        console.log('Stop animation');//
        clearInterval(this._intervalId);
        console.log('Stop timer');//
        frog.step = 0;

        const recievingPromise = this.getRecievingPromise();
        console.log('recievingPromise:', recievingPromise);//

        const dataPromise = this.getData();

        dataPromise.then(() => {

            if (frog.points && (this._highScore.length < 10 || frog.points > this._highScore[this._highScore.length - 1][1])) {
                this.menuView.showInput();
            } else {
                this.menuView.hideInput();
            }

            this.showResult(frog);
        });

        console.log('Client high score:', this._highScore);//
        console.log('Current points:', frog.points);//
    }

    reduceLives(frog) {

        if (this._isDead) {
            return;
        }

        this._isDead = true;

        frog.lives--;

        if (this._isVibrationSwitchOn) {
            navigator.vibrate(800);
        }

        if (!frog.lives) {
            this.endGame(frog);
            return;
        }

        frog.time = 30;
        this.view.updateLives(frog);
        this.view.updateTime(frog);
    }

    generateColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }

    uplevel(finishZones, cars, logs, frog) {
        finishZones = finishZones.map(function(item) {
            item.color = 'lightgreen';
            return item;
        });
        
        cars = cars.map(function(item) {
            item.speed > 0 ? item.speed += 0.5 : item.speed -= 0.5;
            return item;
        });
        
        logs = logs.map(function(item) {
            item.speed > 0 ? item.speed += 0.5 : item.speed -= 0.5;
            return item;
        });
        
        if (this._isSoundsSwitchOn) {
            this.sounds._awardSound.play();
        }

        frog.level++;
        frog.points += 30;
        frog.time = 30;
        this.view.updateLevel(frog);
        this.view.updatePoints(frog);
        this.view.updateTime(frog);
    }
    
    award(frog, finishZone) {

        if (this._isAwarded) {
            return;
        }

        this._isAwarded = true;
        
        if (this._isVibrationSwitchOn) {
            navigator.vibrate(100);
        }

        if (this._isSoundsSwitchOn) {
            this.sounds._frogSound.play();
        }

        setTimeout(() => finishZone.color = 'blue', 100);
        frog.points += frog.time;
        frog.time = 30;
        this.view.updatePoints(frog);
        this.view.updateTime(frog);
    }

    //Game options
    switchVibration(button) {

        if (this._isVibrationSwitchOn) {
            this._isVibrationSwitchOn = false;
        } else {
            this._isVibrationSwitchOn = true;
        }

        this.view.changeButtonColor(button);
    }

    switchSounds(button) {

        if (this._isSoundsSwitchOn) {
            this._isSoundsSwitchOn = false;
        } else {
            this._isSoundsSwitchOn = true;
        }

        this.view.changeButtonColor(button);
    }

    switchPause() {
        console.log('requestId', this._requestId);//

        if (this._requestId) {
            this.view.switchPauseButtonOn();
            cancelAnimationFrame(this._requestId);
            console.log('Stop animation');//
            this._requestId = null;
            clearInterval(this._intervalId);
            console.log('Stop timer');//
            this._frog.step = 0;
        } else {
            this.view.switchPauseButtonOff();
            this._requestId = requestAnimationFrame(this.runAnimation.bind(this, this._field, this._road, this._river, this._finishZones, this._cars, this._logs, this._frog));
            console.log('Start animation');//
            this.startTimer();
            this._frog.step = 25;
        }
    }

    exit() {

        if (this._isSoundsSwitchOn) {
            this.sounds._escapeSound.play();
        }

        if (document.fullscreenElement) {
            this.cancelFullscreen();
        }

        if (this._intervalId) {
            clearInterval(this._intervalId);
            console.log('Stop timer');//
        }

        if (this._requestId) {
            cancelAnimationFrame(this._requestId);
            console.log('Stop animation');//
        }

        this.backToMenu();
    }

    //Frog controls
    clickHandler(button) {
        const upButton = document.querySelector('.game__button--up');
        const downButton = document.querySelector('.game__button--down');
        const leftButton = document.querySelector('.game__button--left');
        const rightButton = document.querySelector('.game__button--right');
        const exitButton = document.querySelector('.game__button--exit');
        const pauseButton = document.querySelector('.game__button--pause');

        switch (button) {
            case pauseButton:
                this.switchPause();
                break;

            case exitButton:
                this.backToMenuHandler();
                break;

            case upButton:
            case downButton:
            case leftButton:
            case rightButton:

                if (!this._timesRun) {
                    this._frogIntervalId = setInterval(() => {
                        this._timesRun++;
                        console.log(this._timesRun);

                        switch (button) {
                            case leftButton:
                                this.moveLeft(this._frog);
                                break;                    
                            case upButton:
                                this.moveForward(this._frog);
                                break;
                            case rightButton:
                                this.moveRight(this._frog);
                                break;
                            case downButton:
                                this.moveBack(this._frog);
                                break;
                        }

                        
                        if (this._timesRun > 1) {
                            clearInterval(this._frogIntervalId);
                            this._timesRun = 0;
                        }
                    }, 100);
                }

            break;
        }
    }

    keydownHandler(evt) {

        if (this._isPressed) {
            return;
        }

        this._isPressed = true;
        
        switch (evt.keyCode) {
            case this._escKeycode:
                evt.preventDefault();
                this.backToMenuHandler();
                break;

            case this._leftArrowKeycode:
            case this._upArrowKeycode:
            case this._rightArrowKeycode:
            case this._downArrowKeycode:
                evt.preventDefault();

                if (!this._timesRun) {
                    this._frogIntervalId = setInterval(() => {
                        this._timesRun++;
                        console.log(this._timesRun);

                        switch (evt.keyCode) {
                            case this._leftArrowKeycode:
                                this.moveLeft(this._frog);
                                break;
                            case this._upArrowKeycode:
                                this.moveForward(this._frog);
                                break;
                            case this._rightArrowKeycode:
                                this.moveRight(this._frog);
                                break;
                            case this._downArrowKeycode:
                                this.moveBack(this._frog);
                                break;
                        }

                        if (this._timesRun > 1) {
                            clearInterval(this._frogIntervalId);
                            this._timesRun = 0;
                        }
                    }, 100);
                }

            break;
        }
    }

    keyupHandler() {
        this._isPressed = false;
    }

    touchStartHandler(evt) {
        evt.preventDefault();
        console.log(evt.touches[0]);
        this._touches = [evt.touches[0]];
        this._touchstartX = this._touches[0].clientX;
        this._touchstartY = this._touches[0].clientY;
        console.log('touchstartX:', this._touchstartX);
        console.log('touchstartY:', this._touchstartY);
    }
    
    touchEndHandler(evt) {
        evt.preventDefault();
        this._touches = [evt.changedTouches[0]];
        this._touchendX = this._touches[0].clientX;
        this._touchendY = this._touches[0].clientY;
        console.log('touchendX:', this._touches[0].clientX);
        console.log('touchendY:', this._touches[0].clientY);
        console.log(this._touches);
        this.moveBySwipe();
    }; 
    
    moveBySwipe() {
        const leftRightPriority = Math.abs(this._touchstartY - this._touchendY) < Math.abs(this._touchstartX - this._touchendX);
        const upDownPriority = !leftRightPriority;

        if (!this._timesRun) {
            this._frogIntervalId = setInterval(() => {
                this._timesRun++;
                console.log(this._timesRun);

                if (this._touchstartX > this._touchendX && leftRightPriority) {
                    this.moveLeft(this._frog);
                    console.log('Swiped left');
                } else if (this._touchstartX < this._touchendX && leftRightPriority) {
                    this.moveRight(this._frog);
                    console.log('Swiped right');
                } else if (this._touchstartY > this._touchendY && upDownPriority) {
                    this.moveForward(this._frog);
                    console.log('Swiped up');
                } else if (this._touchstartY < this._touchendY && upDownPriority) {
                    this.moveBack(this._frog);
                    console.log('Swiped down');
                } else if (this._touchendY === this._touchstartY) {
                    console.log('Tap!');
                }
                
                if (this._timesRun > 1) {
                    clearInterval(this._frogIntervalId);
                    this._timesRun = 0;
                }
            }, 100);
        }
    }

    //Dynamic elements
    checkFrogPosition(frog, field) {
        let fieldLeft = field.xPos;
        let fieldRight = field.xPos + field.width;
        let fieldTop = field.yPos;
        let fieldBottom = field.yPos + field.height;
        
        let frogLeft = frog.xPos;
        let frogRight = frog.xPos + frog.width;
        let frogTop = frog.yPos;
        let frogBottom = frog.yPos + frog.height;

        if (frogTop < fieldTop) {
            frog.yPos = fieldTop + 50 * 0.75;
        }
    
        if (frogBottom > fieldBottom) {
            frog.yPos = fieldBottom - 50 * 0.75;
        }
    
        if (frogLeft < fieldLeft) {
            frog.xPos = fieldLeft;
        }
    
        if (frogRight > fieldRight) {
            frog.xPos = fieldRight - frog.width;
        }
    }

    checkIntersections(field, road, river, finishZones, cars, logs, frog) {

        if (this.hasIntersection(frog, road)) {

            for (let car of cars) {

                if (this.hasIntersection(frog, car)) {
                    console.log('Collision');//

                    if (this._isSoundsSwitchOn) {
                        this.sounds._squishSound.play();
                    }

                    car.color = 'red';
                    this.reduceLives(frog);
                    setTimeout(() => this.resetPosition(frog), 100);
                    break;
                }
            }
        }
        
        if (this.hasIntersection(frog, river)) {
            let isSafe = false;

            for (let log of logs) {

                if (this.hasIntersection(frog, log)) {
                    isSafe = true;
                    frog.xPos += log.speed;
                }
            }
            
            if (frog.yPos < river.yPos + 50) {

                for (let finishZone of finishZones) {

                    if (this.hasIntersection(frog, finishZone) && finishZone.color !== 'blue') {
                        isSafe = true;

                        this.award(frog, finishZone);
                        setTimeout(() => {
                            this.resetPosition(frog);

                            if (finishZones.every(item => item.color === 'blue')) {
                                this.uplevel(finishZones, cars, logs, frog); 
                            }
                        }, 100);
                    }
                }
            }

            if (!isSafe) {

                if (this._isSoundsSwitchOn) {
                    this.sounds._splashSound.play();
                }

                console.log('Drowning');//
                this.reduceLives(frog);
                setTimeout(() => this.resetPosition(frog), 100);
            }
        }
    }

    hasIntersection(frog, obstacle) {
        let frogLeft = frog.xPos;
        let frogRight = frog.xPos + frog.width;
        let frogTop = frog.yPos;
        let frogBottom = frog.yPos + frog.height;

        let obstacleLeft = obstacle.xPos;
        let obstacleRight = obstacle.xPos + obstacle.width;
        let obstacleTop = obstacle.yPos;
        let obstacleBottom = obstacle.yPos + obstacle.height;

        return !(frogLeft >= obstacleRight || frogRight <= obstacleLeft || frogTop >= obstacleBottom || frogBottom <= obstacleTop);
    }

    checkObstaclePosition(obstacles, field) {
        for (let obstacle of obstacles) {
            let gap = obstacle.height;

            if (obstacle.xPos > field.width + gap) {
                if (obstacle.name === 'Car') {
                    obstacle.color = this.generateColor();
                }
                obstacle.xPos = field.xPos - obstacle.width - gap;
            }

            if (obstacle.xPos < field.xPos - obstacle.width - gap) {
                if (obstacle.name === 'Car') {
                    obstacle.color = this.generateColor();
                }
                obstacle.xPos = field.width + gap;
            }
        }
    }

    changeObstaclePosition(obstacles) {
        for (let obstacle of obstacles) {
            obstacle.xPos += obstacle.speed;
        }
    }

    runAnimation(field, road, river, finishZones, cars, logs, frog) {

        if (this._requestId) {
            cancelAnimationFrame(this._requestId);
        }

        this.changeObstaclePosition(cars);
        this.changeObstaclePosition(logs);
        this.checkObstaclePosition(cars, field);
        this.checkObstaclePosition(logs, field);
        this.checkFrogPosition(frog, field);
        this.checkIntersections(field, road, river, finishZones, cars, logs, frog);
        this.view.update(field, road, river, finishZones, cars, logs, frog);

        if (frog.lives) {
            console.log('Lives left:', frog.lives);//
            this._requestId = requestAnimationFrame(this.runAnimation.bind(this, field, road, river, finishZones, cars, logs, frog));
        } else {
            console.log('Stop animation');//
        }
    }
}