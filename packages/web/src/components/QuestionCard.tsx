import { useEffect, useRef } from "react";

export type MultipleChoiceQuestion = {
  type: "multiple-choice";
  id: string;
  text: string;
  choices: string[];
};

export type NumericQuestion = {
  type: "numeric";
  id: string;
  text: string;
};

export type Question = MultipleChoiceQuestion | NumericQuestion;

type Props = {
  question: Question;
  onAnswer: (answer: string) => void;
};

/**
 * QuestionCard renders the active math problem and manages keyboard focus.
 *
 * WCAG 2.4.3 — Focus Order: when a new question loads after answer
 * submission, focus moves to this card so keyboard and screen-reader
 * users do not have to Tab from the top of the page on every question.
 *
 * Implementation: tabIndex=-1 makes the container programmatically
 * focusable; the useEffect calls .focus() whenever question.id changes.
 *
 * WCAG 1.3.1 — Info and Relationships:
 * - Multiple-choice: <fieldset>/<legend>/<input type="radio">/<label> so
 *   screen readers announce the question as part of every answer option.
 * - Numeric: visible <label> associated with the <input>.
 * - Submit: <button type="submit"> (never a <div onClick>).
 */
export function QuestionCard({ question, onAnswer }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    cardRef.current?.focus();
  }, [question.id]);

  return (
    <div
      ref={cardRef}
      tabIndex={-1}
      className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
      aria-label="Math question"
    >
      {question.type === "multiple-choice" ? (
        <MultipleChoiceInput question={question} onAnswer={onAnswer} />
      ) : (
        <>
          <p className="mb-6 text-lg font-medium text-gray-900">{question.text}</p>
          <NumericInput onAnswer={onAnswer} />
        </>
      )}
    </div>
  );
}

/**
 * WCAG 1.3.1 — Multiple-choice must use <fieldset>/<legend>/<input type="radio">/<label>.
 * Screen readers announce the question text (from <legend>) as part of each option,
 * which is essential for math questions where the answer only makes sense in context.
 *
 * Selecting a radio immediately calls onAnswer so the game flow is preserved.
 * The radio is visually hidden (sr-only) and the styled <label> acts as the
 * clickable target; focus-within on the label surfaces the focus ring.
 */
function MultipleChoiceInput({
  question,
  onAnswer,
}: {
  question: MultipleChoiceQuestion;
  onAnswer: (answer: string) => void;
}) {
  const groupName = `mc-${question.id}`;
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mb-6 text-lg font-medium text-gray-900">{question.text}</legend>
      <div className="flex flex-col gap-3">
        {question.choices.map((choice, index) => {
          const id = `${groupName}-${index}`;
          return (
            <label
              key={index}
              htmlFor={id}
              className="flex cursor-pointer items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 hover:border-blue-700 hover:bg-blue-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-700 focus-within:ring-offset-2"
            >
              <input
                id={id}
                type="radio"
                name={groupName}
                value={choice}
                className="sr-only"
                onChange={() => onAnswer(choice)}
              />
              <span className="mr-3 font-semibold text-gray-500">
                {String.fromCharCode(65 + index)}.
              </span>
              {choice}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

function NumericInput({ onAnswer }: { onAnswer: (answer: string) => void }) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = e.currentTarget.elements.namedItem("answer") as HTMLInputElement;
    if (input.value.trim()) {
      onAnswer(input.value.trim());
      input.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="numeric-answer" className="text-sm font-medium text-gray-700">
        Your answer
      </label>
      <input
        id="numeric-answer"
        name="answer"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        required
        className="rounded-xl border border-gray-200 px-4 py-3 text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
        placeholder="Type your answer…"
      />
      <button
        type="submit"
        className="rounded-xl bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
      >
        Submit
      </button>
    </form>
  );
}
