import React, { createContext, useContext } from "react";
import { useInterpret, useActor } from "@xstate/react";
import { InterpreterFrom } from "xstate";
import { parent, child } from "./machines";

export const ParentServiceContext = createContext(
  {} as InterpreterFrom<typeof parent>
);

export const GlobalStateProvider = (props: React.PropsWithChildren<{}>) => {
  const parentService = useInterpret(parent);
  return (
    <ParentServiceContext.Provider value={parentService}>
      {props.children}
    </ParentServiceContext.Provider>
  );
};

const StepOne = ({ actorRef }: { actorRef: InterpreterFrom<typeof child> }) => {
  const [state] = useActor(actorRef);

  return (
    <div>
      <h2>1</h2>
      <div>{JSON.stringify(state.value)}</div>
      <div>
        <button
          onClick={() => {
            actorRef.send({ type: "SELECT" });
          }}
        >
          Select
        </button>
      </div>
      <button
        onClick={() => {
          actorRef.send({ type: "NEXT" });
        }}
      >
        Next
      </button>
    </div>
  );
};

const StepTwo = ({ actorRef }: { actorRef: InterpreterFrom<typeof child> }) => {
  const [state] = useActor(actorRef);

  return (
    <div>
      <h2>2</h2>
      <div>{JSON.stringify(state.value)}</div>
      <div>
        <button
          onClick={() => {
            actorRef.send({ type: "SELECT" });
          }}
        >
          Select
        </button>
      </div>
      <button
        onClick={() => {
          actorRef.send({ type: "BACK" });
        }}
      >
        Back
      </button>
      <button
        onClick={() => {
          actorRef.send({ type: "NEXT" });
        }}
      >
        Next
      </button>{" "}
    </div>
  );
};

const StepThree = () => {
  const parentService = useContext(ParentServiceContext);

  return (
    <div>
      <h2>3</h2>
      <button
        onClick={() => {
          parentService.send({ type: "BACK" });
        }}
      >
        Back
      </button>
    </div>
  );
};

const Parent = () => {
  const parentService = useContext(ParentServiceContext);
  const [state] = useActor(parentService);

  switch (true) {
    case state.matches("stepOne"):
      return typeof state.context.stepOneMachine !== "undefined" ? (
        <StepOne actorRef={state.context.stepOneMachine} />
      ) : (
        <div>initializing...</div>
      );
    case state.matches("stepTwo"):
      return typeof state.context.stepTwoMachine !== "undefined" ? (
        <StepTwo actorRef={state.context.stepTwoMachine} />
      ) : (
        <div>intializing...</div>
      );
    case state.matches("stepThree"):
      return <StepThree />;
    default:
      return <div>error</div>;
  }
};

const App = () => {
  return (
    <GlobalStateProvider>
      <div>
        <h2>parent child communication with spawned actor machines</h2>
      </div>
      <Parent />
    </GlobalStateProvider>
  );
};

export default App;
