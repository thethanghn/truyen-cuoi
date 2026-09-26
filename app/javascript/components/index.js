import { createElement } from "react";
import { createRoot } from "react-dom/client";

import Chat from "./Chat";
import DeadPieces from "./DeadPieces";
import GameActions from "./GameActions";
import RightPanel from "./RightPanel";
import RoomActors from "./RoomActors";
import RoomList from "./RoomList";

const components = { Chat, DeadPieces, GameActions, RightPanel, RoomActors, RoomList };
const roots = new WeakMap();

// Render (or re-render) a component into a DOM element. Calling it again for the
// same element updates the props, like the old React.render did.
export function mount(name, element, props = {}) {
  const Component = components[name];
  if (!Component) throw new Error(`Unknown component: ${name}`);
  if (!element) return;

  let root = roots.get(element);
  if (!root) {
    root = createRoot(element);
    roots.set(element, root);
  }
  root.render(createElement(Component, props));
}
