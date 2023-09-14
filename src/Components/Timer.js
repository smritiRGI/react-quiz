import { useEffect } from "react";

const Timer = ({ timer, dispatch }) => {
  useEffect(() => {
    const id = setInterval(() => dispatch({ type: "tick" }), 1000);

    return () => {
      clearInterval(id);
    };
  }, [dispatch]);

  return <div className="timer">{timer}</div>;
};
export default Timer;
