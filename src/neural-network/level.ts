export class Level {
  inputs: number[];
  outputs: number[];
  biases: number[];
  weights: number[][];

  constructor(inputCount: number, outputCount: number) {
    this.inputs = Array.from({ length: inputCount });
    this.outputs = Array.from({ length: outputCount });
    this.biases = Array.from({ length: outputCount });

    this.weights = this.inputs.map(() => Array.from({ length: outputCount }));
    Level.randomize(this);
  }

  static randomize(layer: Level) {
    layer.weights = layer.weights.map((inputs) =>
      inputs.map(() => Math.random() * 2 - 1)
    );

    layer.biases = layer.biases.map(() => Math.random() * 2 - 1);
  }

  static feedForward(givenInputs: number[], level: Level) {
    level.inputs = [...givenInputs];

    for (let i = 0; i < level.outputs.length; i++) {
      let sum = 0;
      for (let j = 0; j < level.inputs.length; j++) {
        sum += level.inputs[j] * level.weights[j][i];
      }

      if (sum > level.biases[i]) {
        level.outputs[i] = 1;
      } else {
        level.outputs[i] = 0;
      }
    }

    return level.outputs
  }
}
