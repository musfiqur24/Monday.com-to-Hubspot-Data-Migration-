import fs from "node:fs";
import path from "node:path";
import { settings, root, prepareDirectories } from "../config.js";
import { State } from "./state.js";
import { Monday } from "./monday.js";
import { HubSpot } from "./hubspot.js";
import { Migration } from "./migrate.js";
export function runtime() {
  prepareDirectories();
  const config = settings();
  const state = new State(path.join(root, "state/migration.sqlite"));
  let migration;
  const throttle = () => migration?.throttle();
  const monday = new Monday(config, throttle),
    hubspot = new HubSpot(config, throttle);
  migration = new Migration({ state, monday, hubspot, config, root });
  const file = null;
  return { migration, state, hubspot, config, root, file };
}
