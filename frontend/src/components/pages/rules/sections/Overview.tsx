export default function OverviewSection() {
  return (
    <>
      <p>
        Sheepshead is a{" "}
        <a
          target="_blank"
          href="https://en.wikipedia.org/wiki/Trick-taking_game#Point-trick_games"
        >
          point-trick-taking
        </a>{" "}
        game, where the goal is to get points by winning tricks. It's played
        with a Piquet pack, which is a subset of a standard 52 card,
        French-suited deck, consisting of 32 cards: 7-10s, Jacks, Queens, Kings,
        and Aces.
      </p>

      <h3>Suits</h3>
      <p>
        Cards are split up into four suits, which do not necessarily match the
        standard suit of the card. There is the <b>Trump</b> suit, which
        consists of all <b>Queens</b>, <b>Jacks</b>, and <b>Diamonds</b>. Then
        there are the remaining <b>Fail</b> suits: <b>Clubs</b>, <b>Hearts</b>,
        and <b>Spades</b>. They are called "fail" suits, because any card from
        the Trump suit will beat or "trump" them.
      </p>

      <h3>Card Strength</h3>
      <p>
        The strength of cards in Sheepshead is one of the many nuances that can
        make learning the game difficult for beginners.
      </p>
      <ol>
        <li>
          Any Trump card will <i>always</i> beat any Fail suit card.
        </li>
        <li>
          Trump cards are ranked as follows, from highest to lowest:
          <ul style={{ fontSize: 20 }}>
            <li>
              <span className="black">Q♠ Q♣</span>
              &nbsp;
              <span className="red">Q♥ Q♦</span>
              &nbsp;
              <span className="black">J♠ J♣</span>
              &nbsp;
              <span className="red">J♥ J♦</span>
              &nbsp;
              <span className="red">A♦ 10♦ K♦ 9♦ 8♦ 7♦</span>
            </li>
          </ul>
        </li>
        <li>
          Fail suit cards are ranked as follows, from highest to lowest. The key
          thing to note here is that Kings are ranked between Tens and Nines.
          <ul style={{ fontSize: 20 }}>
            <li>A 10 K 9 8 7</li>
          </ul>
        </li>
        <li>
          A fail suit card can only beat another fail suit card from another
          suit, if its suit was led (played first in the trick) and no Trump
          cards were played.
        </li>
      </ol>

      <h3>Card Point Values</h3>
      <p>
        Each card has a point value associated with it. The sum of point
        collected by taking tricks is what determines the winner of a hand. In
        total, there are 120 points up for grabs each hand, and the team that
        takes 61 points wins the hand. In the event of a tie, the team that
        picked loses. Point values are as follows:
      </p>
      <table>
        <tr>
          <th>Card</th>
          <th>Aces</th>
          <th>Tens</th>
          <th>Kings</th>
          <th>Queens</th>
          <th>Jacks</th>
          <th>Other</th>
        </tr>
        <tr>
          <th>Value</th>
          <td>11</td>
          <td>10</td>
          <td>4</td>
          <td>3</td>
          <td>2</td>
          <td>0</td>
        </tr>
      </table>
    </>
  );
}
