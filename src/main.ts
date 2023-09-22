import { Car } from './car';
import { Road } from './road';
import { ControlType } from './controls';
import { NetworkVisualizer, NeuralNetwork } from './neural-network';

const carCanvas: HTMLCanvasElement = document.getElementById(
  'carCanvas'
) as HTMLCanvasElement;
carCanvas.height = window.innerHeight;
carCanvas.width = 200;

const networkCanvas: HTMLCanvasElement = document.getElementById(
  'networkCanvas'
) as HTMLCanvasElement;
networkCanvas.height = window.innerHeight;
networkCanvas.width = 500;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width / 2, carCanvas.width - 20);

const N = 200;
const cars = generateCars(N);
let bestCar = cars[0];

if (localStorage.getItem('bestBrain')) {
  for(let i =0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));
    if(i) {
      NeuralNetwork.mutate(cars[i].brain, 0.1)
    }
  }
}

const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, ControlType.Dummy, 2),
  new Car(road.getLaneCenter(0), -300, 30, 50, ControlType.Dummy, 2),
  new Car(road.getLaneCenter(2), -300, 30, 50, ControlType.Dummy, 2),
  new Car(road.getLaneCenter(0), -500, 30, 50, ControlType.Dummy, 2),
  new Car(road.getLaneCenter(1), -500, 30, 50, ControlType.Dummy, 2),
  new Car(road.getLaneCenter(1), -700, 30, 50, ControlType.Dummy, 2),
  new Car(road.getLaneCenter(2), -700, 30, 50, ControlType.Dummy, 2),
];

animate();

function animate(time: number | undefined = undefined) {
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic);
  }
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)));

  carCanvas.height = window.innerHeight;
  networkCanvas.height = window.innerHeight;

  carCtx.save();
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7);

  road.draw(carCtx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, 'red');
  }
  carCtx.globalAlpha = 0.2;
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, 'blue');
  }
  carCtx.globalAlpha = 1;
  bestCar.draw(carCtx, 'blue', true);

  carCtx.restore();

  networkCtx.lineDashOffset = -time / 50;
  NetworkVisualizer.draw(networkCtx, bestCar.brain);
  requestAnimationFrame(animate);
}

function generateCars(numOfCars: number) {
  const cars: Car[] = [];
  for (let i = 0; i <= numOfCars; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, ControlType.AI));
  }
  return cars;
}
/* ****************************************************/

const saveBtn = document.getElementById('saveBtn') as HTMLButtonElement;
const discardBtn = document.getElementById('discardBtn') as HTMLButtonElement;

saveBtn.onclick = save;
discardBtn.onclick = discard;

function save() {
  localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain));
}

function discard() {
  localStorage.removeItem('bestBrain');
}
