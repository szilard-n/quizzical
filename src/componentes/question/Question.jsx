import './Question.css';

function Question({ question, questionId, answers, correctAnswer, pickAnswer, isFinished }) {
    return (
        <div className="question">
            <h2 className="question--title karla-font">{question}</h2>
            <div className="question--answers">
                {
                    answers.map(answer => {
                        let backgroundColor = 'transparent';

                        if (isFinished) {
                            if (answer.isSelected && correctAnswer === answer.value) {
                                backgroundColor = 'green';
                            } else if (!answer.isSelected && correctAnswer === answer.value) {
                                backgroundColor = 'green-low-opacity';
                            } else if (answer.isSelected && correctAnswer !== answer.value) {
                                backgroundColor = 'red';
                            } else {
                                backgroundColor = 'gray';
                            }
                        }

                        return (
                            <div key={answer.id}
                                 className={
                                     `question--answer-text 
                                        inter-font background-${backgroundColor} 
                                        ${answer.isSelected && !isFinished && 'question--answer-selected'}`
                                 }
                                 onClick={isFinished ? undefined : () => pickAnswer(questionId, answer.id)}>
                                {answer.value}
                            </div>
                        );

                    })
                }
            </div>
        </div>
    );
}

export default Question;