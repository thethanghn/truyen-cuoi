export default function RoomActors({ actors = [] }) {
  const statusText = window.PlayerStatusText || [];

  return (
    <ul>
      {actors.map((actor, index) => (
        <li key={index}>
          <span>{actor.isHost ? "Host" : "Guest"}</span>: {actor.name}({actor.actorNr}) -{" "}
          {statusText[actor.customProperties.status]}
        </li>
      ))}
    </ul>
  );
}
