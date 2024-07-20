export default function Dealing() {
  return (
    <>
      <p>
        The dealer shuffles the deck and then the player to their right cuts the
        deck. The dealer then deals 2 or 3 cards at a time to each player,
        starting with the player to their left. Between a round of dealing, the
        dealer places 2 cards face-down in the center of the table. These cards
        are known as the the <b>Blind</b>. By the end of dealing, each player
        should have <b>6</b> cards in their hand.
      </p>
      <h4>Misdeal</h4>
      <p>
        If a player receives <b>No Trump, Face, or Ace</b> cards, they may call
        for a misdeal. The cards are then reshuffled and redealt by the same
        dealer.
      </p>
    </>
  );
}
