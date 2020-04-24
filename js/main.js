import HighScoreRepository from './repositories/high_score_repository.js';
import Sounds from './sounds/sounds.js';
import MenuView from './views/menu_view.js';
import GameView from './views/game_view.js';
import Game from './models/game.js';
import GameControls from './controllers/game_controls.js';
import MenuListeners from './controllers/menu_listeners.js';

const canvasWidth = 600;
const canvasHeight = 600;

const databaseRepo = new HighScoreRepository();
const sounds = new Sounds(); 
const menuView = new MenuView();
const view = new GameView(canvasWidth, canvasHeight);
const model = new Game(menuView, view, sounds, databaseRepo, canvasWidth, canvasHeight);
const controller = new GameControls(model);
const menuListeners = new MenuListeners(model);