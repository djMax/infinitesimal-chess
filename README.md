# Infinitesimal Chess

A mobile game built in React Native based on [Analog Chess](https://github.com/ehulinsky/AnalogChess), a chess game where pieces can move fractional amounts of their normal moves.

## Abstractions

The board is modeled as an 8x8 coordinate space containing a set of pieces that occupy a circular space defined by their radius `R` (currently the same for all pieces). A piece must fit fully on the board, meaning the min x/y is `R`, and the max x/y is `8 - R`.

To keep things simple, the data models expect that black starts at the "top end" of the board - i.e. the left most black pawn is at `(.5, 7.5)`. The white pieces start at the bottom of the board, thus the rightmost white pawn is `(7.5, 1.5)`.

The bottom left square on the board is black. So the white king is at `(4.5, 0.5)`.

If we need to flip the board, we will just do this as a transformation for display.
