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
      <p className="mb-6 text-lg font-medium text-gray-900">{question.text}</p>

      {question.type === "multiple-choice" ? (
        <MultipleChoiceInput question={question} onAnswer={onAnswer} />
      ) : (
        <NumericInput onAnswer={onAnswer} />
      )}
    </div>
  );
}

function MultipleChoiceInput({
  question,
  onAnswer,
}: {
  question: MultipleChoiceQuestion;
  onAnswer: (answer: string) => void;
}) {
  return (
    <div className="flex flex-col gap-3" role="group" aria-label="Answer choices">
      {question.choices.map((choice, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onAnswer(choice)}
          className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-left text-gray-800 hover:border-blue-700 hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:ring-offset-2"
        >
          <span className="mr-3 font-semibold text-gray-500">
            {String.fromCharCode(65 + index)}.
          </span>
          {choice}
        </button>
      ))}
    </div>
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
