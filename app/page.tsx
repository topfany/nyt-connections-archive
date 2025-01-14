"use client";

import { useCallback, useState } from "react";
import ControlButton from "./_components/button/control-button";
import Grid from "./_components/game/grid";
import GameLostModal from "./_components/modal/game-lost-modal";
import GameWonModal from "./_components/modal/game-won-modal";
import Popup from "./_components/popup";
import useAnimation from "./_hooks/use-animation";
import useGameLogic from "./_hooks/use-game-logic";
import usePopup from "./_hooks/use-popup";
import { SubmitResult, Word } from "./_types";
import { getPerfection } from "./_utils";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useEffect } from "react";

export default function Home() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [categories, setCategories] = useState<Category[]>([]);

  // 新增：根据日期获取数据
  const fetchGameData = async (date: Date) => {
    try {
      const formattedDate = date.toISOString().split('T')[0]; // 格式化为YYYY-MM-DD
      const response = await fetch(
        `/api/proxy?date=${formattedDate}`
      );
      const data = await response.json();

      console.log('response data: ', data);
      
      // 转换groups数据格式
      const transformedCategories = Object.entries(data.groups).map(
        ([category, details]: [string, any]) => ({
          category,
          items: details.members,
          level: details.level,
        })
      );
      
      setCategories(transformedCategories);
    } catch (error) {
      console.error('Failed to fetch game data:', error);
      showPopup('Failed to load game data');
    }
  };

  // 监听日期变化
  useEffect(() => {
    if (selectedDate) {
      fetchGameData(selectedDate);
    }
  }, [selectedDate]);

  // 修改日期选择处理
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setShowCalendar(false);
    fetchGameData(date); // 重新获取数据
  };

  const [popupState, showPopup] = usePopup();
  const {
    gameWords,
    selectedWords,
    clearedCategories,
    mistakesRemaining,
    isWon,
    isLost,
    guessHistoryRef,
    selectWord,
    shuffleWords,
    deselectAllWords,
    getSubmitResult,
    handleWin,
    handleLoss,
  } = useGameLogic();

  const [showGameWonModal, setShowGameWonModal] = useState(false);
  const [showGameLostModal, setShowGameLostModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    guessAnimationState,
    wrongGuessAnimationState,
    animateGuess,
    animateWrongGuess,
  } = useAnimation();

  const handleSubmit = async () => {
    setSubmitted(true);
    await animateGuess(selectedWords);

    const result: SubmitResult = getSubmitResult();

    switch (result.result) {
      case "same":
        showPopup("You've already guessed that!");
        break;
      case "one-away":
        animateWrongGuess();
        showPopup("One away...");
        break;
      case "loss":
        showPopup("Better luck next time!");
        await handleLoss();
        setShowGameLostModal(true);
        break;
      case "win":
        showPopup(getPerfection(mistakesRemaining));
        await handleWin();
        setShowGameWonModal(true);
        break;
      case "incorrect":
        animateWrongGuess();
        break;
    }
    setSubmitted(false);
  };

  const onClickCell = useCallback(
    (word: Word) => {
      selectWord(word);
    },
    [selectWord]
  );

  const renderControlButtons = () => {
    const showResultsWonButton = (
      <ControlButton
        text="Show Results"
        onClick={() => {
          setShowGameWonModal(true);
        }}
      />
    );

    const showResultsLostButton = (
      <ControlButton
        text="Show Results"
        onClick={() => {
          setShowGameLostModal(true);
        }}
      />
    );

    const inProgressButtons = (
      <div className="flex gap-2 mb-12">
        <ControlButton
          text="Shuffle"
          onClick={shuffleWords}
          unclickable={submitted}
        />
        <ControlButton
          text="Deselect All"
          onClick={deselectAllWords}
          unclickable={selectedWords.length === 0 || submitted}
        />
        <ControlButton
          text="Submit"
          unclickable={selectedWords.length !== 4 || submitted}
          onClick={handleSubmit}
        />
      </div>
    );

    if (isWon) {
      return showResultsWonButton;
    } else if (isLost) {
      return showResultsLostButton;
    } else {
      return inProgressButtons;
    }
  };

  return (
    <>
      <div className="flex flex-col items-center w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-14">
        <h1 className="text-black text-4xl font-semibold my-4 ml-4">
          Connections Archive
        </h1>
        <hr className="mb-4 md:mb-4 w-full"></hr>
        <h2 className="text-black mb-4">Create four groups of four!</h2>

        <div className="mt-4">
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            选择日期
          </button>

          {showCalendar && (
            <div className="absolute z-50 mt-2 shadow-lg rounded-lg">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange} // 使用新的处理函数
                minDate={new Date(2024, 11, 10)}
                maxDate={new Date()}
                inline
              />
            </div>
          )}
        </div>

        <div className="relative w-full">
          <Popup show={popupState.show} message={popupState.message} />
          <Grid
            words={gameWords}
            selectedWords={selectedWords}
            onClick={onClickCell}
            clearedCategories={clearedCategories}
            guessAnimationState={guessAnimationState}
            wrongGuessAnimationState={wrongGuessAnimationState}
          />
        </div>
        <h2 className="text-black my-4 md:my-8 mx-8">
          Mistakes Remaining:{" "}
          {mistakesRemaining > 0 ? Array(mistakesRemaining).fill("•") : ""}
        </h2>
        {renderControlButtons()}
      </div>
      <GameWonModal
        isOpen={showGameWonModal}
        onClose={() => setShowGameWonModal(false)}
        guessHistory={guessHistoryRef.current}
        perfection={getPerfection(mistakesRemaining)}
      />
      <GameLostModal
        isOpen={showGameLostModal}
        onClose={() => setShowGameLostModal(false)}
        guessHistory={guessHistoryRef.current}
      />
    </>
  );
}
