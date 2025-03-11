import Flare from "../../../common/Flare";

export default function Variations() {
  return (
    <>
      <p>
        Sheepshead can be played with many different variations and house rules.
        While this list is not exhaustive, it does cover some of the more common
        variations. Players should agree on the rules before starting a game.
      </p>

      <h3>Calling Methods</h3>

      <h4>Call an Ace</h4>
      <ul>
        <li>
          The picker calls a fail-suit. The player that has the Ace of this
          fail-suit is the partner.
        </li>
        <li>
          The picker cannot have the called Ace in their hand or bury and must
          have a fail-suit card of the same suit in their hand.
        </li>
        <li>
          <b>Revealing the Partner</b>: When an opponent player leads with the
          suit of the called Ace, the partner must play the called Ace and the
          picker must play their same-suited fail card. This reveals the partner
          to the table.
        </li>
        <li>
          Neither the picker nor the partner can lead with the suit of the
          called Ace (unless the reveal has already happened).
        </li>
        <li>
          If the picker has all 3 fail-suit Aces in their hand, they may call a
          fail-suit Ten instead. In this scenario, the picker must keep the Ace
          of the called Ten in their hand as the fail-suit card to be played in
          the reveal.
        </li>
      </ul>

      <h4>Jack of Diamonds</h4>
      <ul>
        <li>
          The partner is automatically the player holding the Jack of Diamonds.
        </li>
        <li>
          <b>
            Call Up <Flare color="orange">Not Yet Supported</Flare>:&nbsp;
          </b>
          If the picker has the Jack of Diamonds in their hand or bury, they
          must "call up" to the Jack of Hearts. If the Jack of Hearts is also
          held, then they must call up to the Jack of Spades, and then to the
          Jack of Clubs.
        </li>
        <li>If the picker has all Jacks, they are required to go it alone.</li>
      </ul>

      <h3>Scoring</h3>

      <h4>
        Blitzing <Flare color="orange">Not Yet Supported</Flare>
      </h4>
      <ul>
        <li>
          <i>Before</i> the blind is picked up, the picker may reveal that they
          have the two red queens or the two black queens in their hand.
        </li>
        <li>Blitzing doubles the payouts for the hand.</li>
      </ul>

      <h4>Double on the Bump</h4>
      <ul>
        <li>Payouts are automatically doubled when the picking team loses</li>
        <li>
          This rule encourages players to think more carefully when considering
          to pick.
        </li>
      </ul>

      <h3>No-Pick</h3>

      <h4>Force Pick</h4>
      <ul>
        <li>
          The dealer is forced to pick up the blind. This is also known as
          "screw the dealer".
        </li>
      </ul>

      <h4>Leasters</h4>
      <ul>
        <li>The hand is played as a free-for-all with no picker.</li>
        <li>
          Of the players that take at least one trick, whoever takes the least
          amount of points wins. If there is a tie for least points, the player
          who took the least tricks wins.
        </li>
        <li>
          Note: player can win by taking every trick, since they would have the
          least amount of points of all of the trick-taking-players (i.e. just
          themself).
        </li>
      </ul>

      <h4>Mosters</h4>
      <ul>
        <li>
          Like Leasters, this variant is played as a free-for-all with no
          picker.
        </li>
        <li>
          The goal of Mosters is to <i>not</i> take the most points. The player
          that takes the most points loses the hand.
        </li>
      </ul>

      <h4>
        Doublers <Flare color="orange">Not Yet Supported</Flare>
      </h4>
      <ul>
        <li>The hand is redealt by the same dealer, and played normally.</li>
        <li>Payouts are doubled.</li>
        <li>
          This rule is compounding, meaning that if there is again a no-pick
          scenario, the scores are quadrupled, then hextupled, and so on.
        </li>
      </ul>
    </>
  );
}
