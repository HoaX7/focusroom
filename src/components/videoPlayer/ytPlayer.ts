import { delay } from "@/lib/utils";

type PlayerStateCode = -2 | -1 | 0 | 1 | 2 | 3 | 5;

export default class YtPlayer {
  private errors = [
    "Element not found",
    "Element is not an iframe",
    "Youtube url does not include query parameter - enablejsapi=1 - JS API is disabled",
  ];

  private playerStates: { [code in PlayerStateCode]: string } = {
    [-2]: "NOT_READY",
    [-1]: "UNSTARTED",
    [0]: "ENDED",
    [1]: "PLAYING",
    [2]: "PAUSED",
    [3]: "BUFFERING",
    [5]: "CUED",
  };

  private currentPlayerStateCode: PlayerStateCode = -2;

  private iframe: HTMLIFrameElement;
  private loaded: Promise<boolean>;
  private messageListener: ((event: MessageEvent) => void) | null = null;

  constructor(iframe: HTMLIFrameElement) {
    const element: HTMLElement | null = iframe;

    if (element instanceof HTMLIFrameElement) {
      this.iframe = element;
    } else {
      this.throwError(1);
    }

    if (!this.iframe.src.includes("enablejsapi=1")) {
      this.throwError(2, this.iframe.src);
    }

    this.loaded = new Promise((resolve) => {
      let loaded = false;

      const loadListener = () => {
        this.iframe.removeEventListener("load", loadListener);

        setTimeout(() => {
          this.iframe.contentWindow?.postMessage('{"event":"listening"}', "*");
        });
      };

      this.iframe.addEventListener("load", loadListener);

      this.messageListener = (event: MessageEvent) => {
        if (event.source === this.iframe.contentWindow && event.data) {
          let eventData: any;

          try {
            eventData = JSON.parse(event.data);
          } catch {
            return;
          }

          if (eventData.event === "onReady" && !loaded) {
            loaded = true;
            this.iframe.removeEventListener("load", loadListener);
            resolve(true);
          }

          if (typeof eventData.info?.playerState === "number") {
            this.stateChangeHandler(eventData.info.playerState);
          }

          this.messageHandler(eventData);
        }
      };

      window.addEventListener("message", this.messageListener);
      this.iframe.contentWindow?.postMessage('{"event":"listening"}', "*");
    });
  }

  private throwError(errorCode: number, optionalMessage?: string): never {
    throw new Error(this.errors[errorCode] + (optionalMessage ? `: ${optionalMessage}` : "."));
  }

  private stateChangeHandler(playerStateCode: PlayerStateCode): void {
    this.currentPlayerStateCode = playerStateCode;
    const event = new CustomEvent("ytstatechange", { detail: this.playerStates[this.currentPlayerStateCode] });
    this.iframe.dispatchEvent(event);
  }

  private messageHandler(data: any): void {
    const event = new CustomEvent("ytmessage", { detail: data });
    this.iframe.dispatchEvent(event);
  }

  async command(command: string, args?: any[]) {
    await this.loaded;

    this.iframe.contentWindow?.postMessage(
      JSON.stringify({
        event: "command",
        func: command,
        args: args || [],
      }),
      "*",
    );
  }

  async play() {
    return this.command("playVideo");
  }

  async pause() {
    return this.command("pauseVideo");
  }

  async stop() {
    return this.command("stopVideo");
  }

  async mute() {
    return this.command("mute");
  }

  async unMute() {
    return this.command("unMute");
  }

  async setVolume(volume: number) {
    if (volume < 1) volume = 1;
    else if (volume > 100) volume = 100;
    return this.command("setVolume", [volume]);
  }

  async seekTo(seconds: number) {
    return this.command("seekTo", [seconds]);
  }

  async startMusic(vol = 50) {
    await delay(500);
    this.seekTo(0);
    this.setVolume(vol);
    this.unMute();
  }

  get playerState(): string {
    return this.playerStates[this.currentPlayerStateCode];
  }
}
