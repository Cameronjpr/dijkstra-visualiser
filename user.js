class User {
  constructor() {
    this.dragging = false;
    this.target = null;
    this.hovering = null;
    this.dragMode = 'edgeMode'
  }

  setDragMode(mode) {
    switch (mode) {
      case 'moveMode':
        this.dragMode = 'moveMode'
        break
      case 'edgeMode':
        this.dragMode = 'edgeMode'
        break
      default:
        this.dragMode = 'edgeMode'
        break
    }
  }
}