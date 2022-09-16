export function indexFromPosition(position, seatIndex) {
  return (seatIndex + position) % 6;
}

export function positionFromIndex(index, seatIndex) {
  return (index - seatIndex + 6) % 6;
}
