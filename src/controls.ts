export enum ControlType {
  Dummy = 'dummy',
  Keys = 'keys',
}

export class Controls {
  forward = false;
  left = false;
  right = false;
  reverse = false;

  constructor(type: ControlType) {
    switch (type) {
      case ControlType.Keys:
        this.addKeyboardListeners();
        break;
      case ControlType.Dummy:
        this.forward = true;
    }
  }

  private addKeyboardListeners() {
    document.onkeydown = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.left = true;
          break;
        case 'ArrowRight':
          this.right = true;
          break;
        case 'ArrowUp':
          this.forward = true;
          break;
        case 'ArrowDown':
          this.reverse = true;
          break;
      }
    };

    document.onkeyup = (event) => {
      switch (event.key) {
        case 'ArrowLeft':
          this.left = false;
          break;
        case 'ArrowRight':
          this.right = false;
          break;
        case 'ArrowUp':
          this.forward = false;
          break;
        case 'ArrowDown':
          this.reverse = false;
          break;
      }
    };
  }
}
