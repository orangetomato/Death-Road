export default class MenuListeners {
    constructor(model) {
        this.model = model;
        this.addListeners();
    }

    addListeners() {
        const startButton = document.querySelector('.menu__button--start');
        const rulesButton = document.querySelector('.menu__button--rules');
        const highScoreButton = document.querySelector('.menu__button--high-score');
        const settingsButton = document.querySelector('.menu__button--settings');
        startButton.addEventListener('click', this.model.switchToGame.bind(this.model));
        rulesButton.addEventListener('click', this.model.switchToRules.bind(this.model));
        highScoreButton.addEventListener('click', this.model.switchToScores.bind(this.model));
        settingsButton.addEventListener('click', this.model.switchToSettings.bind(this.model));
        
        const menuButtonsList = document.querySelectorAll('.back-to-menu-button');
        for (let button of menuButtonsList) {
            button.addEventListener('click', this.model.backToMenuHandler.bind(this.model));
        }

        const settingsVibrationButton = document.querySelector('.settings__button--vibration');
        settingsVibrationButton.addEventListener('click', this.model.switchVibration.bind(this.model, settingsVibrationButton));

        const settingsSoundsButton = document.querySelector('.settings__button--sounds');
        settingsSoundsButton.addEventListener('click', this.model.switchSounds.bind(this.model, settingsSoundsButton));
        
        const submitButton = document.querySelector('.form__button');
        submitButton.addEventListener('click', this.model.submitButtonHandler.bind(this.model));

        const yesButton = document.querySelector('.popup__yes-button');
        yesButton.addEventListener('click', this.model.yesHandler.bind(this.model));
    
        const noButton = document.querySelector('.popup__no-button');
        noButton.addEventListener('click', this.model.noHandler.bind(this.model));
    
        onhashchange = this.model.switchToStateFromURLHash.bind(this.model);
        onbeforeunload = this.model.beforeUnloadHandler.bind(this.model);
    }
}