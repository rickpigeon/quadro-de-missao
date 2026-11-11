/**
 * "Mostrar para todos": the GM's client sends one socket message and every other client opens the
 * board (optionally enlarging one poster). Only messages sent by a GM are obeyed.
 *
 * Message on `module.quadro-de-missao`: { type: "show", focus: posterId | null, from: userId }
 */
import { SOCKET } from "./constants.mjs";
import { reportError } from "./errors.mjs";
import { BoardApp } from "./board-app.mjs";

export function showToAll(focus = null) {
  if ( !game.user.isGM ) return;
  game.socket.emit(SOCKET, { type: "show", focus, from: game.user.id });
  BoardApp.open({ focus });
}

export function listenSocket() {
  game.socket.on(SOCKET, data => {
    try {
      if ( !data || typeof data !== "object" || data.type !== "show" ) return;
      if ( !game.users.get(data.from)?.isGM ) return;
      BoardApp.open({ focus: typeof data.focus === "string" ? data.focus : null });
    } catch ( err ) {
      reportError(err, "socket");
    }
  });
}
