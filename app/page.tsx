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
// import Navbar from './_components/header/navbar';

// 新增类型定义
interface Category {
  category: string;
  items: string[];
  level: number;
}

export default function Home() {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 监听日期变化
  useEffect(() => {
    if (selectedDate) {
      fetchGameData(selectedDate);
    }
  }, [selectedDate]);

  // 修改日期选择处理
  const handleDateChange = (date: Date | null) => {
    if (!date) return; // 处理 null 值
    setSelectedDate(date);
    setShowCalendar(false);
    fetchGameData(date); // 重新获取数据，这会触发游戏状态重置
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
    categories,
    fetchGameData,
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
      {/* <Navbar /> */}
      <head>
        <link rel="canonical" href="https://connectionsarchive.net/" />
      </head>
      <div className="pt-16 flex flex-col items-center w-11/12 md:w-3/4 lg:w-7/12 mx-auto mt-14">
        <h1 className="text-black text-4xl font-semibold my-4 ml-4">
          Connections Archive - Daily Word Game Collection
        </h1>
        <hr className="mb-4 md:mb-4 w-full"></hr>
        <h2 className="text-black mb-4">Play Today&apos;s NYT Connections Puzzle, create four groups of four!</h2>

        <div className="mt-4 mb-6">
          <span>Selected Date: </span>
          <button
            onClick={() => setShowCalendar(!showCalendar)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
          >
            {selectedDate ? selectedDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : "Please select a date"}
          </button>

          {showCalendar && (
            <div className="absolute z-50 mt-2 shadow-lg rounded-lg">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange} // 使用新的处理函数
                minDate={new Date(2023, 6, 11)}
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
        <p className="text-black my-4 md:my-8 mx-8">
          Mistakes Remaining:{" "}
          {mistakesRemaining > 0 ? Array(mistakesRemaining).fill("•") : ""}
        </p>
        {renderControlButtons()}

        <div className="my-4 mb-6 w-full">
          {/* 游戏玩法说明，帮助新用户理解游戏规则 */}
          <h3 className="text-2xl font-semibold mb-3">How to Play</h3>
          <p>
            NYT Connections is a daily word puzzle game where players group 16 words into 4 categories of 4 related items each. 
            Test your vocabulary and logical thinking skills by finding the hidden connections between words. 
            Each puzzle has a unique theme and increasing difficulty levels.
          </p>
        </div>

        <div className="my-4 mb-6 w-full">
          {/* 强调存档功能，展示网站的核心价值 */}
          <h3 className="text-2xl font-semibold mb-3">Daily Puzzle Archive</h3>
          <p>
            Explore our comprehensive collection of <a href="https://www.nytimes.com/games/connections" className="underline hover:underline" target="_blank" rel="nofollow" title="NYT Connections">NYT Connections puzzles</a> from past dates. 
            Relive your favorite challenges or try puzzles you missed. 
            Our archive preserves every daily puzzle, allowing you to play anytime and track your progress over time.
          </p>
        </div>

        <div className="my-4 mb-6 w-full">
          {/* 游戏技巧分享，增加实用价值 */}
          <h3 className="text-2xl font-semibold mb-3">Tips and Strategies</h3>
          <p>
            Improve your skills with these expert tips: 
          </p>
          <ul className="list-disc ml-8">
            <li>Look for obvious connections first</li>
            <li>Consider multiple meanings of words</li>
            <li>Pay attention to word forms and endings</li>
            <li>Use the process of elimination</li>
            <li>Don&apos;t be afraid to make educated guesses</li>
          </ul>
          <p>Remember, practice makes perfect!</p>
        </div>

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
