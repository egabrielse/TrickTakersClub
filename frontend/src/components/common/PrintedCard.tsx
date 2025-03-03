import { CARD_RANK, CARD_SUIT } from "../../constants/card";
import { CardRank, CardSuit, PlayingCard } from "../../types/card";

export default function PrintedCard({ rank, suit }: PlayingCard) {
  const printSuit = (suit: CardSuit) => {
    switch (suit) {
      case CARD_SUIT.DIAMOND:
        return "♦";
      case CARD_SUIT.HEART:
        return "♥";
      case CARD_SUIT.SPADE:
        return "♠";
      case CARD_SUIT.CLUB:
        return "♣";
      default:
        return "";
    }
  };

  const printRank = (rank: CardRank) => {
    switch (rank) {
      case CARD_RANK.SEVEN:
        return "7";
      case CARD_RANK.EIGHT:
        return "8";
      case CARD_RANK.NINE:
        return "9";
      case CARD_RANK.TEN:
        return "10";
      case CARD_RANK.JACK:
        return "J";
      case CARD_RANK.QUEEN:
        return "Q";
      case CARD_RANK.KING:
        return "K";
      case CARD_RANK.ACE:
        return "A";
      default:
        return "";
    }
  };

  return (
    <span
      style={{
        color:
          suit === CARD_SUIT.DIAMOND || suit === CARD_SUIT.HEART
            ? "red"
            : "black",
      }}
    >
      {printRank(rank)}
      {printSuit(suit)}
    </span>
  );
}
