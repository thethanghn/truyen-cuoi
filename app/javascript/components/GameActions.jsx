// PlayerStatus and GamePhase are defined by the xiangqi play page.
const PlayerStatus = () => window.PlayerStatus;
const GamePhase = () => window.GamePhase;

export default function GameActions({ phase = "init", actors = [], leaveHandler, startHandler }) {
  const leaveBtn = (
    <button className="btn btn-warning btn-leave" onClick={() => leaveHandler?.()}>
      Leave
    </button>
  );
  const startBtn = (
    <button className="btn btn-info btn-start" onClick={() => startHandler?.()}>
      Start
    </button>
  );
  const drawBtn = <button className="btn btn-info btn-draw">Ask for Draw</button>;
  const resignBtn = <button className="btn btn-info btn-resign">Resign</button>;

  const initPhase = <div>{leaveBtn}</div>;
  const notReadyPhase = (
    <div>
      {startBtn}
      {leaveBtn}
    </div>
  );
  const ongoingPhase = (
    <div>
      {drawBtn}
      {resignBtn}
      {leaveBtn}
    </div>
  );

  function playerStatus() {
    // The host is the local actor (isLocal == true).
    const host = actors.find((x) => x.isLocal == true);
    if (!host) return initPhase; // actor join room event has not fired yet

    const status = PlayerStatus();
    switch (host.customProperties.status) {
      case status.New:
      case status.JoinedLobby:
        return initPhase;
      case status.JoinedRoom:
      case status.NotReady:
        return notReadyPhase;
      case status.Ready:
        return ongoingPhase;
      default:
        throw new Error("Unknown player status:" + host.customProperties.status);
    }
  }

  let content;
  switch (phase) {
    case GamePhase().StandBy:
      content = playerStatus();
      break;
    case GamePhase().OnGoing:
      content = ongoingPhase;
      break;
    default:
      throw new Error("Unrecognized game phase:" + phase);
  }

  return <div className="game-actions">{content}</div>;
}
