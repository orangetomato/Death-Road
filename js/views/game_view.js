export default class GameView {
    constructor(width, height) {
        const canvas = document.querySelector('.game__canvas');
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        this._ctx = canvas.getContext('2d');
    }

    drawRect(x, y, width, height, color) {
        this._ctx.fillStyle = color;
        this._ctx.strokeRect(x, y, width, height);
        this._ctx.fillRect(x, y, width, height);
    }
    
    drawCircle(x, y, radius, color) {
        this._ctx.beginPath();
        this._ctx.arc(x, y, radius, 0, Math.PI * 2, false);
        this._ctx.fillStyle = color;
        this._ctx.fill();
    }

    drawLine(x, y, width, length, color) {
        this._ctx.save();
        this._ctx.lineWidth = length;
        this._ctx.lineCap = 'round';
        this._ctx.strokeStyle = color;
        this._ctx.beginPath();
        this._ctx.moveTo(x, y);
        this._ctx.lineTo(x + width, y);
        this._ctx.stroke();
        this._ctx.restore();
    }

    drawImage(img, x, y, angle, width, height) {
        this._ctx.save();
        this._ctx.translate(x + width / 2, y + height / 2);
        this._ctx.rotate(angle * Math.PI / 180);
        this._ctx.drawImage(img, -width / 2, -height / 2);
        this._ctx.restore();
    }

    drawRoad(road) {
        const grid = 50;
        const stripeWidth = 50;
        const stripeHeight = 4;
        const stripeColor = 'gold';
        let stripeX;
        let stripeY;

        this.drawRect(road.xPos, road.yPos, road.width, road.height, road.color);

        for (let rowIndex = 1; rowIndex < 4; rowIndex++) {
            stripeY = road.yPos + road.height - grid * rowIndex - stripeHeight / 2;

            for (let columnIndex = 0; columnIndex < 6; columnIndex++) {
                stripeX = columnIndex * (grid + stripeWidth) + grid / 2;

                this.drawRect(stripeX, stripeY, stripeWidth, stripeHeight, stripeColor);
            }
        }
    }

    drawCar(car) {
        const leftWheelX = car.xPos + 4;
        const rightWheelX = car.xPos + car.width - 14;
        const topWheelY = car.yPos - 4;
        const bottomWheelY = car.yPos + car.height - 1;
        const wheelWidth = 10;
        const wheelHeight = 5;
        const wheelColor = 'black';

        const windScreenX = car.speed > 0 ? car.xPos + car.width - 35 : car.xPos + 15;
        const windScreenY = car.yPos + 5;
        const windScreenWidth = car.width * 0.2;
        const windScreenHeight = car.height - 10;
        const windScreenColor = 'lightblue';

        this.drawRect(leftWheelX, topWheelY, wheelWidth, wheelHeight, wheelColor);
        this.drawRect(rightWheelX, topWheelY, wheelWidth, wheelHeight, wheelColor);
        this.drawRect(rightWheelX, bottomWheelY, wheelWidth, wheelHeight, wheelColor);
        this.drawRect(leftWheelX, bottomWheelY, wheelWidth, wheelHeight, wheelColor);
        this.drawRect(car.xPos, car.yPos, car.width, car.height, car.color);
        this.drawRect(windScreenX, windScreenY, windScreenWidth, windScreenHeight, windScreenColor);
    }

    update(field, road, river, finishZones, cars, logs, frog) {
        this._ctx.clearRect(0, 0, field.width, field.height);
        this.drawRect(field.xPos, field.yPos, field.width, field.height, field.color);
        this.drawRoad(road);
        this.drawRect(river.xPos, river.yPos, river.width, river.height, river.color);

        for (let finishZone of finishZones) {
            this.drawCircle(finishZone.xPos, finishZone.yPos, finishZone.radius, finishZone.color);
        }
        for (let log of logs) {
            this.drawLine(log.xPos, log.yPos, log.width, log.height, log.color);
        }

        this.drawImage(frog.imageToDraw, frog.xPos, frog.yPos, frog.angle, frog.width, frog.height);

        for (let car of cars) {
            this.drawCar(car);
        }
    }

    updatePoints(frog) {
        const points = document.querySelector('.game__points');
        points.textContent = `${frog.points}`;
    }

    updateLives(frog) {
        const lives = document.querySelector('.game__lives');
        lives.textContent = `${frog.lives}`;
    }

    updateLevel(frog) {
        const level = document.querySelector('.game__level');
        level.textContent = `${frog.level}`;
    }

    updateTime(frog) {
        const time = document.querySelector('.game__time');
        time.textContent = `${frog.time}`;
    }

    switchPauseButtonOn() {
        const pauseButton = document.querySelector('.game__button--pause');
        pauseButton.classList.add('game__button--selected');
    }

    switchPauseButtonOff() {
        const pauseButton = document.querySelector('.game__button--pause');
        pauseButton.classList.remove('game__button--selected');
    }

    changeButtonColor(button) {
        button.classList.toggle('button--selected');
        button.blur();
    }
}