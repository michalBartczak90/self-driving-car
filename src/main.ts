import { Car } from './car';
import { Road } from './road';
import { ControlType } from './controls';

const carCanvas: HTMLCanvasElement = document.getElementById(
  'carCanvas'
) as HTMLCanvasElement;
carCanvas.height = window.innerHeight;
carCanvas.width = 200;

const networkCanvas: HTMLCanvasElement = document.getElementById(
  'networkCanvas'
) as HTMLCanvasElement;
networkCanvas.height = window.innerHeight;
networkCanvas.width = 300;

const carCtx = carCanvas.getContext('2d');
const networkCtx = networkCanvas.getContext('2d');

const road = new Road(carCanvas.width / 2, carCanvas.width - 20);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, ControlType.AI);
const traffic = [
  new Car(road.getLaneCenter(1), -100, 30, 50, ControlType.Dummy, 2),
  new Car(road.getLaneCenter(0), -250, 30, 50, ControlType.Dummy, 2),
  new Car(road.getLaneCenter(3), -500, 30, 50, ControlType.Dummy, 2),
];
animate();

function animate() {
  traffic.forEach((trafficCar) => trafficCar.update(road.borders, []));
  car.update(road.borders, traffic);

  carCtx.clearRect(0, 0, carCanvas.width, carCanvas.height);

  carCtx.save();
  carCtx.translate(0, -car.y + carCanvas.height * 0.7);

  traffic.forEach((trafficCar) => trafficCar.draw(carCtx, 'red'));
  road.draw(carCtx);
  car.draw(carCtx, 'blue');
  carCtx.restore();

  requestAnimationFrame(animate);
}
