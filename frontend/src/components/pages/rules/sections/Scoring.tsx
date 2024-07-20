export default function Scoring() {
  return (
    <>
      <p>
        Scoring in Sheepshead is zero-sum, meaning the sum of all players'
        points equals zero. In other words, for every point won by one player,
        another player must lose a point. This is why the scores at the end of a
        hand are referred to here as payouts, since the points are paid out from
        one player to another.
      </p>
      <p>
        The following table shows the payouts based on the number of points won
        by the picking team. In the event of a tie, the picker loses.
      </p>
      <table>
        <thead>
          <tr>
            <th>Point Totals</th>
            <th>Picker (alone)</th>
            <th>Picker (w/ partner)</th>
            <th>Partner</th>
            <th>Each Opponent</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>All Tricks</th>
            <td className="green">+12</td>
            <td className="green">+6</td>
            <td className="green">+3</td>
            <td className="red">-3</td>
          </tr>
          <tr>
            <th>91 to 120</th>
            <td className="green">+8</td>
            <td className="green">+4</td>
            <td className="green">+3</td>
            <td className="red">-3</td>
          </tr>
          <tr>
            <th>61 to 90</th>
            <td className="green">+4</td>
            <td className="green">+2</td>
            <td className="green">+1</td>
            <td className="red">-1</td>
          </tr>
          <tr>
            <th>31 to 60</th>
            <td className="red">-4</td>
            <td className="red">-2</td>
            <td className="red">-1</td>
            <td className="green">+1</td>
          </tr>
          <tr>
            <th>0 to 30</th>
            <td className="red">-8</td>
            <td className="red">-4</td>
            <td className="red">-2</td>
            <td className="green">+2</td>
          </tr>
          <tr>
            <th>No tricks</th>
            <td className="red">-12</td>
            <td className="red">-6</td>
            <td className="red">-3</td>
            <td className="green">+3</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
