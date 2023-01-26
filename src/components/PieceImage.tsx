import { Image, ImageStyle } from "react-native";
import { Piece, PieceType } from "../models/Piece";

const BlackPieces: Record<PieceType, any> = {
  Pawn: require('../../assets/bp.png'),
  Bishop: require('../../assets/bb.png'),
  King: require('../../assets/bk.png'),
  Knight: require('../../assets/bn.png'),
  Queen: require('../../assets/bq.png'),
  Rook: require('../../assets/br.png'),
};

const WhitePieces: Record<PieceType, any> = {
  Pawn: require('../../assets/wp.png'),
  Bishop: require('../../assets/wb.png'),
  King: require('../../assets/wk.png'),
  Knight: require('../../assets/wn.png'),
  Queen: require('../../assets/wq.png'),
  Rook: require('../../assets/wr.png'),
}

export function PieceImage({ piece, style }: { piece: Piece, style: ImageStyle }) {
  return (
    <Image source={(piece.black ? BlackPieces : WhitePieces)[piece.type]} style={style} />
  )
}
