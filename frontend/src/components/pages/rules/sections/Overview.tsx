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
        game, typically played with 5 players. While there exist variations with
        other numbers of players, these rules will assume a 5-handed game. The
        goal is of the game is to get 61 points by winning tricks. It's played
        with a Piquet pack, which is a subset of a standard 52 card,
        French-suited deck. This pack consists of 32 cards: 7-10s, Jacks,
        Queens, Kings, and Aces.
      </p>
      <p>
        The following rules are compiled from{" "}
        <a
          target="_blank"
          href="https://en.wikipedia.org/wiki/Sheepshead_(card_game)"
        >
          Wikipedia
        </a>
        ,{" "}
        <a target="_blank" href="http://www.sheepshead.org/rules">
          Sheepshead.org
        </a>
        , and from personal experience playing the game. These rules are not
        meant to be exhaustive, but rather a starting point for beginners.
      </p>

      <h3>Suits</h3>
      <p>
        Cards are split up into four suits, which do not necessarily match the
        standard suit of the card. The <b>Trump</b> suit consists of all{" "}
        <b>Queens</b>, <b>Jacks</b>, and <b>Diamonds</b>. Then there are the
        remaining <b>Fail</b> suits: <b>Clubs</b>, <b>Hearts</b>, and{" "}
        <b>Spades</b>. They are called "fail" suits, because any card from the
        Trump suit will beat or "trump" them.
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
          <ul style={{ fontSize: 24, textShadow: "0px 0px 5px white" }}>
            <li>
              <span className="black">Q♣ Q♠</span>
              &nbsp;
              <span className="red">Q♥ Q♦</span>
              &nbsp;
              <span className="black">J♣ J♠</span>
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

      <h3>Card Values</h3>
      <p>
        Each card has a point value associated with it. The sum of point
        collected by taking tricks is what determines the winner of a hand. In
        total, there are 120 points up for grabs each hand, and the team that
        takes 61 points wins the hand. In the event of a tie, the team that
        picked loses. Point values are as follows:
      </p>
      <table>
        <thead>
          <tr>
            <th>Card</th>
            <th>Aces</th>
            <th>Tens</th>
            <th>Kings</th>
            <th>Queens</th>
            <th>Jacks</th>
            <th>Other</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Value</th>
            <td>11</td>
            <td>10</td>
            <td>4</td>
            <td>3</td>
            <td>2</td>
            <td>0</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
