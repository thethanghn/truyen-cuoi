export default function RoomList({ rooms = [], joinGameHandler }) {
  if (rooms.length === 0) return <div>No Active Room</div>;

  function join(event, roomId) {
    event.preventDefault();
    joinGameHandler?.(roomId);
  }

  return (
    <ul>
      {rooms.map((room) => (
        <li key={room.id}>
          {room.title} -{" "}
          <a href="#" onClick={(event) => join(event, room.id)}>
            Join
          </a>
        </li>
      ))}
    </ul>
  );
}
