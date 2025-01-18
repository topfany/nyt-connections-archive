import { Word } from "@/app/_types";
import ControlButton from "../button/control-button";
import GuessHistory from "../guess-history";
import GameModal from "./game-modal";

type GameWonModalProps = {
  isOpen: boolean;
  onClose: () => void;
  guessHistory: Word[][];
  perfection: string;
};

export default function GameWonModal(props: GameWonModalProps) {
  return (
    <GameModal isOpen={props.isOpen} onClose={props.onClose}>
      <div className="flex flex-col items-center justify-center px-12">
        <p className="text-black text-4xl font-black my-4 ml-4">
          {props.perfection}
        </p>
        <hr className="mb-2 md:mb-4 w-full"></hr>
        <p className="text-black mb-8">{"You've won the game!"}</p>
        <GuessHistory guessHistory={props.guessHistory} />
        <ControlButton text="Exit" onClick={props.onClose} />
      </div>
    </GameModal>
  );
}
