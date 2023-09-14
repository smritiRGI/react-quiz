import { useRef } from "react";

const Question = ({ question, dispatch, answer }) => {
  // // console.log(question?.incorrect_answers);
  const insertIndex = useRef(Math.floor(Math.random() * 5));
  const options = question?.incorrect_answers.slice();
  options.splice(insertIndex.current, 0, question?.correct_answer);

  const hasAnswered = answer !== null;

  return (
    <div>
      <h4>{question?.question}</h4>
      <div>
        {options.map((option, index) => (
          <button
            className={`btn btn-option ${option === answer ? "answer" : ""} ${
              hasAnswered
                ? option === question?.correct_answer
                  ? "correct"
                  : "wrong"
                : null
            }`}
            key={option}
            onClick={() =>
              dispatch({
                type: "nextAnswer",
                payload: option,
              })
            }
            disabled={hasAnswered}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};
export default Question;
