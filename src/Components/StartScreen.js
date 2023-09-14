const StartScreen = ({ length, dispatch }) => {
  return (
    <div className="start">
      <h2>Welcome to the React Quiz</h2>
      <h3>{length} Questions to test your React Mastery.</h3>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "startGame" })}
      >
        Let's Start
      </button>
    </div>
  );
};
export default StartScreen;
