import "../App.css";
import Header from "./Header";
import { useEffect, useReducer } from "react";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import NextButton from "./NextButton";
import Progress from "./Progress";
import Finished from "./Finished";
import Timer from "./Timer";
const initialState = {
  questions: [],
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  timer: 60,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "dataRecieved":
      return { ...state, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...state, status: "error" };
    case "startGame":
      return { ...state, status: "active" };
    case "nextAnswer":
      const currentQuestion = state.questions[state.index];
      return {
        ...state,
        answer: action.payload,
        points:
          currentQuestion.correct_answer === action.payload
            ? state.points + 10
            : state.points,
      };
    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null,
      };
    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    case "restart":
      return {
        ...initialState,
        questions: state.questions,
        status: "ready",
      };

    case "tick":
      return {
        ...state,
        timer: state.timer - 1,
        highScore:
          state.timer === 0
            ? Math.max(state.points, state.highScore)
            : state.highScore,
        status: state.timer === 0 ? "finished" : state.status,
      };
    default:
      throw new Error("Action unknown");
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch(
          "https://opentdb.com/api.php?amount=10&category=22&difficulty=easy&type=multiple"
        );
        const data = await response.json();
        dispatch({ type: "dataRecieved", payload: data.results });
      } catch (e) {
        dispatch({ type: "dataFailed", payload: e });
      }
    }
    fetchQuestions();
    return () => {};
  }, []);

  return (
    <div className="App">
      <Header />
      <Main>
        {state.status === "loading" && <Loader />}
        {state.status === "error" && <Error />}
        {state.status === "ready" && (
          <StartScreen length={state.questions.length} dispatch={dispatch} />
        )}
        {state.status === "active" && (
          <>
            <Progress
              index={state.index}
              numQuestions={state.questions.length}
              points={state.points}
              maxPoints={state.questions.length * 10}
            />
            <Question
              question={state.questions[state.index]}
              dispatch={dispatch}
              answer={state.answer}
              key={state.index}
            />
            <Timer timer={state.timer} dispatch={dispatch} />
            <NextButton
              dispatch={dispatch}
              answer={state.answer}
              index={state.index}
              numQuestions={state.questions.length}
            />
          </>
        )}
        {state.status === "finished" && (
          <Finished
            points={state.points}
            maxPoints={state.questions.length * 10}
            highScore={state.highScore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
