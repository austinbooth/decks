export interface Card {
  uid: string
  headline: string
  description: string
}

export interface SwipedCard {
  card: Card
  swiped: 'left' | 'right'
}
