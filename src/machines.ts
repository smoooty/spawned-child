import {
  createMachine,
  sendParent,
  assign,
  spawn,
  InterpreterFrom,
} from "xstate";

export const parent = createMachine({
  tsTypes: {} as import("./machines.typegen").Typegen0,
  schema: {
    context: {} as {
      stepOneMachine?: InterpreterFrom<typeof child>;
      stepTwoMachine?: InterpreterFrom<typeof child>;
    },
    events: {} as { type: "NEXT" } | { type: "BACK" },
  },
  id: "parent",
  initial: "stepOne",
  context: {
    stepOneMachine: undefined,
    stepTwoMachine: undefined,
  },
  states: {
    stepOne: {
      entry: assign({
        stepOneMachine: () => spawn(child, "child-one"),
      }),
      on: {
        NEXT: {
          target: "stepTwo",
        },
      },
    },
    stepTwo: {
      entry: assign({
        stepTwoMachine: () => spawn(child, "child-two"),
      }),
      on: {
        NEXT: {
          target: "stepThree",
        },
        BACK: {
          target: "stepOne",
        },
      },
    },
    stepThree: {
      on: {
        BACK: {
          target: "stepTwo",
        },
      },
    },
  },
});

export const child = createMachine(
  {
    tsTypes: {} as import("./machines.typegen").Typegen1,
    schema: {
      events: {} as { type: "NEXT" } | { type: "BACK" } | { type: "SELECT" },
    },
    id: "child",
    context: {},
    initial: "invalid",
    on: {
      BACK: {
        actions: ["goBack"],
      },
    },
    states: {
      invalid: {
        on: {
          SELECT: {
            target: "valid",
          },
        },
      },
      valid: {
        on: {
          NEXT: {
            actions: ["goNext"],
          },
        },
      },
    },
  },
  {
    actions: {
      goBack: sendParent({ type: "BACK" }),
      goNext: sendParent({ type: "NEXT" }),
    },
  }
);
