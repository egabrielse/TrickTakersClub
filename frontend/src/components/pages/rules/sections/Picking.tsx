export default function Picking() {
  return (
    <>
      <p>
        The player to the left of the dealer begins by either <b>picking up</b>{" "}
        or <b>passing on</b> the Blind. If they pass, the player to their left
        has the same choice, and so on.
      </p>
      <h3>If someone picks the blind...</h3>
      <p>
        The <b>picker</b> is the player that chooses to pick up the blind. The
        player that picks the blind is known as the <b>picker</b>. The picker
        will have the option to choose a partner, or to go it alone. The rest of
        the players form the opposing team.
      </p>
      <ol>
        <li>
          <b>Pick</b>: The act that makes a player the picker. The player takes
          the cards from the blind and puts them into their hand.
        </li>
        <li>
          <b>Bury</b>: They then <b>bury</b> two cards from their hand by
          placing them face-down in front of them. Buried cards count towards
          the picker's points at the end of the hand.
        </li>
        <li>
          <b>Call</b>: If they choose, the picker can call a <b>partner</b> to
          join the picking team. This can be done one of two ways:{" "}
          <b>Pick an Ace</b> or <b>Jack of Diamonds</b> (see below).
          Alternatively, the picker can choose to <b>go it alone</b>, which
          doubles the payouts if the picker wins, but quadruples the payouts if
          the picker loses.
        </li>
      </ol>
      <h3>If everyone passes...</h3>
      <p>
        The scenario in which all players pass can be resolved in a few ways.
        The choice of no-pick resolution can be left up to the dealer, or be
        chosen by the table, but regardless of the method chosen, it should be
        determined before dealing begins.
      </p>
      <p>
        The simplest resolution is to have the dealer pick up the blind. This is
        known as a <b>Force Pick</b> or "screw the dealer". For other variants,
        see below.
      </p>
    </>
  );
}
