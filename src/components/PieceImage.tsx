import { observer } from '@legendapp/state/react';
import * as React from 'react';
import { Image, ImageStyle } from 'react-native';

import { Piece } from '../models/Piece';
import { GameSettings } from '../state';

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

export const PieceSets = ['Standard', 'Huxley'];
export type PieceSetName = (typeof PieceSets)[number];

const Sets: Record<PieceSetName, PieceSet> = {
  Standard: {
    BlackPieces: {
      Pawn: require('../../assets/standard/bp.png'),
      Bishop: require('../../assets/standard/bb.png'),
      King: require('../../assets/standard/bk.png'),
      Knight: require('../../assets/standard/bn.png'),
      Queen: require('../../assets/standard/bq.png'),
      Rook: require('../../assets/standard/br.png'),
    },
    WhitePieces: {
      Pawn: require('../../assets/standard/wp.png'),
      Bishop: require('../../assets/standard/wb.png'),
      King: require('../../assets/standard/wk.png'),
      Knight: require('../../assets/standard/wn.png'),
      Queen: require('../../assets/standard/wq.png'),
      Rook: require('../../assets/standard/wr.png'),
    },
  },
  Huxley: {
    BlackPieces: {
      Pawn: require('../../assets/huxley/bp.png'),
      Bishop: require('../../assets/huxley/bb.png'),
      King: require('../../assets/huxley/bk.png'),
      Knight: require('../../assets/huxley/bn.png'),
      Queen: require('../../assets/huxley/bq.png'),
      Rook: require('../../assets/huxley/br.png'),
    },
    WhitePieces: {
      Pawn: require('../../assets/huxley/wp.png'),
      Bishop: require('../../assets/huxley/wb.png'),
      King: require('../../assets/huxley/wk.png'),
      Knight: require('../../assets/huxley/wn.png'),
      Queen: require('../../assets/huxley/wq.png'),
      Rook: require('../../assets/huxley/wr.png'),
    },
  },
};

export const PieceImage = observer(({ piece, style }: { piece: Piece; style: ImageStyle }) => {
  const pieceSet = GameSettings.pieceSet.get();
  const pieceSource = React.useMemo(
    () => Sets[pieceSet][piece.black ? 'BlackPieces' : 'WhitePieces'][piece.type],
    [pieceSet, piece.black, piece.type],
  );
  return <Image source={pieceSource} style={style} />;
});
