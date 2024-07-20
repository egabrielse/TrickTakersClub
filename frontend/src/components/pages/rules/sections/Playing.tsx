export default function Playing() {
  return (
    <>
      <ul>
        <li>
          The player to the left of the dealer leads the first trick. Going
          clockwise, each player plays one card from their hand. Players must
          follow suit if they can, otherwise they may play any card.
        </li>
        <li>
          See the <b>Card Strength</b> under the <b>Overview</b> section for
          details on which cards beat others.
        </li>
        <li>The winner of the trick leads the next trick.</li>
        <li>
          Once all tricks are played, each team counts how many tricks they took
          together and sums points contained within those tricks (and bury if
          picking team). The number of tricks and points taken by each team will
          determine the payouts or changes in scores.
        </li>
      </ul>
    </>
  );
}
