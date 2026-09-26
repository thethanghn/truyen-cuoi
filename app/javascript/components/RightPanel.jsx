import Chat from "./Chat";
import DeadPieces from "./DeadPieces";
import GameActions from "./GameActions";
import RoomActors from "./RoomActors";

export default function RightPanel({ gameState, leaveHandler, startHandler, sendMessageHandler, messages }) {
  const actors = Object.values(gameState.actors || {});
  const pieces = gameState.data.filter((x) => x.coords[1] < 0 || x.coords[1] > 9);

  return (
    <div className="right-panel">
      <DeadPieces pieces={pieces} />
      <RoomActors actors={actors} />
      <GameActions leaveHandler={leaveHandler} startHandler={startHandler} phase={gameState.phase} actors={actors} />
      <Chat sendMessageHandler={sendMessageHandler} messages={messages} />
    </div>
  );
}
