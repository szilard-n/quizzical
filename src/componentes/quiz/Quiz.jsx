import './Quiz.css';
import Question from '../question/Question.jsx';
import { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import { decode } from 'js-base64';


function Quiz({ categoryId }) {
    const [quiz, setQuiz] = useState([]);
    const [gameStatus, setGameStatus] = useState({
        isFinished: false,
        correctAnswers: 0,
    });

    const generateQuestionsArray = (apiQuestion) => {
        return apiQuestion.map(apiQ => {
            // sort answers in random order so that correct answer isn't always on last position
            const answers = [...apiQ.incorrect_answers, apiQ.correct_answer].sort(() => 0.5 - Math.random());
            return {
                id: nanoid(),
                question: decode(apiQ.question),
                correctAnswer: decode(apiQ.correct_answer),
                answers: answers.map(answer => (
                    {
                        id: nanoid(),
                        isSelected: false,
                        value: decode(answer),
                    }
                )),
            };
        });
    };

    const initializeQuizState = async () => {
        const apiResponse = await fetch(`https://opentdb.com/api.php?amount=5&category=${categoryId}&type=multiple&encode=base64`);
        const { results } = await apiResponse.json();
        setQuiz(generateQuestionsArray(results));
    };

    useEffect(() => {
        initializeQuizState().catch(console.error);
    }, []);

    const pickAnswer = (questionId, answerId) => {
        setQuiz(prevQuiz => {
            return prevQuiz.map(q => {
                // first find the answers that was answered
                if (q.id === questionId) {
                    const answersArray = q.answers;
                    // set isSelected = true to the selected answer and false to the rest
                    const updatedAnswers = answersArray.map(a =>
                        (a.id === answerId) ?
                            { ...a, isSelected: true } :
                            { ...a, isSelected: false },
                    );
                    return { ...q, answers: updatedAnswers };
                }
                return q;
            });
        });
    };

    const checkAnswers = () => {
        let nrOfCorrectAnswers = 0;
        quiz.forEach(q => {
            // find the selected answer (if present)
            const currentAnswer = q.answers.find(a => a.isSelected === true);

            // if one answer was selected, check if it's correct. else just ignore it
            if (currentAnswer) {
                const selectedAnswer = currentAnswer.value;

                if (selectedAnswer === q.correctAnswer) {
                    nrOfCorrectAnswers += 1;
                }
            }
        });
        setGameStatus({ isFinished: true, correctAnswers: nrOfCorrectAnswers });
    };


    const resetGame = () => {
        initializeQuizState().catch(console.error);
        setGameStatus({ isFinished: false, correctAnswers: 0 });
    };

    const goBack = () => {

    }

    return (
        <div className="quiz">
            {
                quiz.map((q, i) =>
                    <>
                        <Question
                            key={q.id}
                            questionId={q.id}
                            question={q.question}
                            answers={q.answers}
                            correctAnswer={q.correctAnswer}
                            pickAnswer={pickAnswer}
                            isFinished={gameStatus.isFinished}
                        />
                        {i !== (quiz.length - 1) && <hr key={i.toString()} className="quiz--questions-divider"/>}
                    </>,
                )
            }
            <div className="quiz--footer">
                {
                    gameStatus.isFinished ? (
                        <div className="quiz--play-again-container">
                            <p className="inter-font">{`You scored ${gameStatus.correctAnswers}/${quiz.length} correct answers`}</p>
                            <button className="quiz--button inter-font"
                                    onClick={resetGame}>
                                Play again
                            </button>
                        </div>
                    ) : (
                        <button className="quiz--button inter-font"
                                onClick={checkAnswers}>
                            Check answers
                        </button>
                    )
                }
            </div>
        </div>
    );
}

export default Quiz;