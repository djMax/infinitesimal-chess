import * as React from 'react';
import { Image, ImageStyle } from 'react-native';

import { Piece, PieceType } from '../models/Piece';

interface PieceImages {
  Pawn: any;
  Bishop: any;
  King: any;
  Knight: any;
  Queen: any;
  Rook: any;
}

interface PieceSet {
  BlackPieces: PieceImages;
  WhitePieces: PieceImages;
}

const PieceSets = ['Standard'];
type PieceSetName = (typeof PieceSets)[number];

const Sets: Record<PieceSetName, PieceSet> = {
  Standard: {
    BlackPieces: {
      Pawn: require('../../assets/bp.png'),
      Bishop: require('../../assets/bb.png'),
      King: require('../../assets/bk.png'),
      Knight: require('../../assets/bn.png'),
      Queen: require('../../assets/bq.png'),
      Rook: require('../../assets/br.png'),
    },
    WhitePieces: {
      Pawn: require('../../assets/wp.png'),
      Bishop: require('../../assets/wb.png'),
      King: require('../../assets/wk.png'),
      Knight: require('../../assets/wn.png'),
      Queen: require('../../assets/wq.png'),
      Rook: require('../../assets/wr.png'),
    },
  },
};

export function PieceImage({
  piece,
  style,
  set = 'Standard',
}: {
  piece: Piece;
  style: ImageStyle;
  set: PieceSetName;
}) {
  const pieceSource = React.useMemo(
    () => Sets[set][piece.black ? 'BlackPieces' : 'WhitePieces'][piece.type],
    [set, piece.black, piece.type],
  );
  return <Image source={pieceSource} style={style} />;
}
