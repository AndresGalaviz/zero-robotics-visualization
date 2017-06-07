interface Subsystem {
  init() : void;
  update(dt:number, time:number, paused:boolean) : void;
  play(time:number) : void;
  togglePause(paused:boolean, resumeTime:number) : void;
  changeSpeed(speed:number) : void;
}

export = Subsystem;
