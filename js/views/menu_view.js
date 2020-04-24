export default class MenuView {
    constructor() {
        this._result = document.querySelector('.result');
        this._menu = document.querySelector('.menu');
        this._gameSection = document.querySelector('.game');
        this._rules = document.querySelector('.rules');
        this._highScore = document.querySelector('.high-score');
        this._settings = document.querySelector('.settings');

        this._input = document.querySelector('.form__input');
    }

    showPoints(points) {
        const resultText = document.querySelector('.result__text');
        resultText.textContent = points;
    }

    resetInput() {
        document.forms[0].reset();

        if (this._input.classList.contains('form__input--invalid')) {
            this.hideInvalidInput();
        }
    }

    addFocus() {
        const submitButton = document.querySelector('.form__button');

        if (this._input.hasAttribute('hidden')) {
            submitButton.focus();
        } else {
            this._input.focus();
        }
    }
    
    showInput() {
        this._input.removeAttribute('hidden');
    }

    hideInput() {
        this._input.setAttribute('hidden', true);
    }

    showInvalidInput() {
        this._input.classList.add('form__input--invalid');
    }

    hideInvalidInput() {
        this._input.classList.remove('form__input--invalid');
    }

    showResult() {
        this._result.removeAttribute('hidden');
    }

    showMenu() {
        this._menu.removeAttribute('hidden');
    }

    showGame() {
        this._gameSection.removeAttribute('hidden');
    }

    showRules() {
        this._rules.removeAttribute('hidden');
    }

    showHighScore() {
        this._highScore.removeAttribute('hidden');
    }

    showSettings() {
        this._settings.removeAttribute('hidden');
    }

    hideSection() {
        if (!this._result.hasAttribute('hidden')) {
            this._result.setAttribute('hidden', true);
            return;
        }

        if (!this._menu.hasAttribute('hidden')) {
            this._menu.setAttribute('hidden', true);
            return;
        }

        if (!this._gameSection.hasAttribute('hidden')) {
            this._gameSection.setAttribute('hidden', true);
            return;
        }

        if (!this._rules.hasAttribute('hidden')) {
            this._rules.setAttribute('hidden', true);
            return;
        }

        if (!this._highScore.hasAttribute('hidden')) {
            this._highScore.setAttribute('hidden', true);
            return;
        }

        if (!this._settings.hasAttribute('hidden')) {
            this._settings.setAttribute('hidden', true);
            return;
        }
    }

    removeTable() {
        const table = document.querySelector('.high-score__table');
        if (table) {
            table.remove();
        }
    }

    showTable(score) {
        const tableBlock = document.querySelector('.high-score__table-block');
        const table = document.createElement('table');
        table.classList.add('high-score__table');
        tableBlock.append(table);

        const tr = document.createElement('tr');
        table.append(tr);

        const th1 = document.createElement('th');
        th1.append('Rank');
        th1.setAttribute('align', 'center');

        const th2 = document.createElement('th');
        th2.append('Player');
        th2.setAttribute('align', 'center');

        const th3 = document.createElement('th');
        th3.append('Points');
        th3.setAttribute('align', 'center');

        tr.append(th1, th2, th3);
        tableBlock.append(table);
    
        for (let i = 0; i < score.length; i++) {
            const tr = document.createElement('tr');
            table.append(tr);

            const td1 = document.createElement('td');
            tr.append(td1);
            td1.setAttribute('align', 'center');
    
            const td2 = document.createElement('td');
            tr.append(td2);
            td2.setAttribute('align', 'center');
    
            const td3 = document.createElement('td');
            tr.append(td3);
            td3.setAttribute('align', 'center');

            td1.append(i + 1);
            td2.append(score[i][0]);
            td3.append(score[i][1]);
        }
    }

    showPopup() {
        const popup = document.querySelector('.popup');
        popup.removeAttribute('hidden');
        popup.classList.add('popup--show');
    }
    
    hidePopup() {
        const popup = document.querySelector('.popup');
        popup.setAttribute('hidden', true);
        popup.classList.remove('popup--show');
    }

    showOverlay() {
        const overlay = document.querySelector('.overlay');
        overlay.removeAttribute('hidden');
    }

    hideOverlay() {
        const overlay = document.querySelector('.overlay');
        overlay.setAttribute('hidden', true);
    }
}