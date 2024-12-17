import { useState } from "react";
import {
    GameSettings,
    HandPhase,
    PlayingCard,
    Scoreboard,
    TrickState
} from "../../../types/game";
import { HAND_PHASES } from "../../../constants/game";
import {
    DealHandMessage,
    GameStartedMessage,
    NewGameMessage,
    PickPayload,
    RefreshMessage,
    SatDownMessage,
    StoodUpMessage,
    UpNextMessage
} from "../../../types/message";

export default function useGameState() {
    // ~ Game state ~
    const [gameInProgress, setGameInProgress] = useState(false);
    const [dealerIndex, setDealerIndex] = useState(0);
    const [playerOrder, setPlayerOrder] = useState<string[]>([]);
    const [gameSettings, setGameSettings] = useState<GameSettings | null>(null);
    const [scoreboard, setScoreboard] = useState<Scoreboard | null>(null);
    // ~ Hand state ~
    const [handInProgress, setHandInProgress] = useState(false);
    const [cardsInBlind, setCardsInBlind] = useState<number>(0);
    const [calledCard, setCalledCard] = useState<PlayingCard | null>(null);
    const [pickerId, setPickerId] = useState<string | null>(null);
    const [partnerId, setPartnerId] = useState<string | null>(null);
    const [tricks, setTricks] = useState<TrickState[]>([]);
    const [phase, setPhase] = useState<HandPhase>(HAND_PHASES.PICK);
    const [upNextId, setUpNextId] = useState<string>("");
    // ~ Player hand state ~
    const [playerHand, setPlayerHand] = useState<PlayingCard[]>([]);
    const [playerBury, setPlayerBury] = useState<PlayingCard[]>([]);

    const reset = () => {
        setGameInProgress(false);
        setDealerIndex(0);
        setPlayerOrder([]);
        setGameSettings(null);
        setScoreboard({});
        setHandInProgress(false);
        setCardsInBlind(0);
        setCalledCard(null);
        setPickerId(null);
        setPartnerId(null);
        setTricks([]);
        setPhase(HAND_PHASES.PICK);
        setUpNextId("");
        setPlayerHand([]);
        setPlayerBury([]);
    }

    const handleRefreshMessage = (message: RefreshMessage) => {
        const { gameState, handState, playerHandState } = message.data;
        if (gameState) {
            setGameInProgress(true);
            setDealerIndex(gameState.dealerIndex);
            setPlayerOrder(gameState.playerOrder);
            setGameSettings(gameState.settings);
            setScoreboard(gameState.scoreboard);
            setHandInProgress(handState !== undefined);

            if (handState) {
                setCardsInBlind(handState.cardsInBlind);
                setCalledCard(handState.calledCard);
                setPickerId(handState.pickerId);
                setPartnerId(handState.partnerId);
                setTricks(handState.tricks);
                setPhase(handState.phase);
                setUpNextId(handState.upNextId);

                if (playerHandState) {
                    setPlayerHand(playerHandState.hand);
                    setPlayerBury(playerHandState.bury);
                }
            }
        }
    }

    const handleNewGameMessage = (message: NewGameMessage) => {
        setGameInProgress(true);
        setGameSettings(message.data.settings);
        setPlayerOrder(message.data.playerOrder);
    }

    const handleSatDownMessage = (message: SatDownMessage) => {
        setPlayerOrder((prev) => [...prev, message.data]);
    }

    const handleStoodUpMessage = (message: StoodUpMessage) => {
        setPlayerOrder((prev) => prev.filter((id) => id !== message.data));
    }

    const handleGameStartedMessage = (message: GameStartedMessage) => {
        setHandInProgress(true);
        setScoreboard(message.data.scoreboard);
        setPlayerOrder(message.data.playerOrder);
    }

    const handleGameOverMessage = () => {
        reset();
    }

    const handleDealHandMessage = (message: DealHandMessage) => {
        setDealerIndex(message.data.dealerIndex);
        setPlayerHand(message.data.cards);
    }

    const handleUpNextMessage = (message: UpNextMessage) => {
        setUpNextId(message.data.playerId);
        setPhase(message.data.phase);
    }

    const handlePickMessage = (message: PickPayload) => {
        setPlayerHand((prev) => [...prev, ...message.data.cards]);
    }

    return {
        reset,
        handleRefreshMessage,
        handleSatDownMessage,
        handleStoodUpMessage,
        handleNewGameMessage,
        handleGameStartedMessage,
        handleGameOverMessage,
        handleDealHandMessage,
        handleUpNextMessage,
        handlePickMessage,
        gameInProgress,
        dealerIndex,
        playerOrder,
        gameSettings,
        scoreboard,
        handInProgress,
        cardsInBlind,
        calledCard,
        pickerId,
        partnerId,
        tricks,
        phase,
        upNextId,
        playerHand,
        playerBury,
    };
}