export interface Card {
  uid: string
  headline: string
  description: string
}

export interface SwipedCard extends Card {
  swiped: 'left' | 'right'
}
