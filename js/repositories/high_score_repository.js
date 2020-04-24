export default class HighScoreRepository {
    constructor() {
        this._ref;
    }

    getConfig() {
        const path = 'configuration/firebase_config.json';

        return fetch(path)
        .then(response => {
            return response.json();
        })
        .then(data => {
            console.log('JSON data:', data);//
            const firebaseConfig = data;

            firebase.initializeApp(firebaseConfig);

            const database = firebase.database();
            this._ref = database.ref('scores');
            console.log('Database ref:', this._ref);//
        })
        .catch(function() {
            console.log('Error! Database is not found!');
        });
    }
    
    getScore() {
        return this.getConfig()
        .then(() => this._ref.once('value'));
    }

    pushScore(score) {
        return this._ref.push(score);
    }

    deleteScore(minKey) {
        console.log('Database item to delete:', this._ref.child(`${minKey}`));//
        return this._ref.child(`${minKey}`).remove();
    }
}

