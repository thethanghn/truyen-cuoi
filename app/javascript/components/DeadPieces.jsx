const imagePath = (piece) => `/xiangqi/${piece.code}${piece.set}.png`;

function PieceList({ pieces, className }) {
  return (
    <ul className={`dead-pieces ${className}`}>
      {pieces.map((piece, index) => (
        <li className="dead-piece" key={index}>
          <span className="piece">
            <img src={imagePath(piece)} alt="" />
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function DeadPieces({ pieces = [] }) {
  const myPieces = pieces.filter((x) => x.set == 1);
  const oppPieces = pieces.filter((x) => x.set != 1);

  return (
    <div className="dead-pieces-container">
      <PieceList pieces={myPieces} className="my-pieces" />
      <PieceList pieces={oppPieces} className="opp-pieces" />
    </div>
  );
}
