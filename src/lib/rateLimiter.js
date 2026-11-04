import { sleep } from './retry.js';
export class TokenBucket {
  constructor(capacity = 8, perSecond = 8) { this.capacity = capacity; this.tokens = capacity; this.perMs = perSecond / 1000; this.last = Date.now(); }
  async take() {
    for (;;) {
      const now = Date.now(); this.tokens = Math.min(this.capacity, this.tokens + (now - this.last) * this.perMs); this.last = now;
      if (this.tokens >= 1) { this.tokens--; return; }
      await sleep(Math.ceil((1 - this.tokens) / this.perMs));
    }
  }
}
