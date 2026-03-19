import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { QuestionCard, type MultipleChoiceQuestion, type NumericQuestion } from "./QuestionCard";

const mcQuestion: MultipleChoiceQuestion = {
  type: "multiple-choice",
  id: "q1",
  text: "What is 3/4 + 1/4?",
  choices: ["1/2", "1", "4/8", "2"],
};

const numericQuestion: NumericQuestion = {
  type: "numeric",
  id: "q2",
  text: "What is 6 × 7?",
};

describe("QuestionCard", () => {
  describe("WCAG 2.4.3 — focus management", () => {
    it("focuses the card container on initial render", () => {
      render(<QuestionCard question={mcQuestion} onAnswer={vi.fn()} />);
      const card = screen.getByRole("group", { name: /math question/i }).closest("div[tabindex]");
      expect(document.activeElement).toBe(card);
    });

    it("has tabIndex=-1 on the card container", () => {
      render(<QuestionCard question={mcQuestion} onAnswer={vi.fn()} />);
      const card = screen.getByLabelText("Math question");
      expect(card).toHaveAttribute("tabindex", "-1");
    });

    it("moves focus to new card when question.id changes", () => {
      const { rerender } = render(<QuestionCard question={mcQuestion} onAnswer={vi.fn()} />);

      const nextQuestion: MultipleChoiceQuestion = {
        ...mcQuestion,
        id: "q3",
        text: "What is 2/3 of 12?",
        choices: ["4", "6", "8", "10"],
      };
      rerender(<QuestionCard question={nextQuestion} onAnswer={vi.fn()} />);

      const card = screen.getByLabelText("Math question");
      expect(document.activeElement).toBe(card);
    });

    it("does not re-focus when only non-id props change", () => {
      const onAnswer = vi.fn();
      const { rerender } = render(<QuestionCard question={mcQuestion} onAnswer={onAnswer} />);

      // Blur the card to simulate user navigating to an answer choice
      const firstChoice = screen.getByRole("button", { name: /A\. 1\/2/ });
      firstChoice.focus();
      expect(document.activeElement).toBe(firstChoice);

      // Rerender with same id (e.g. updated onAnswer callback reference)
      rerender(<QuestionCard question={mcQuestion} onAnswer={vi.fn()} />);

      // Focus should remain on the button, not jump back to the card
      expect(document.activeElement).toBe(firstChoice);
    });
  });

  describe("multiple-choice variant", () => {
    it("renders the question text", () => {
      render(<QuestionCard question={mcQuestion} onAnswer={vi.fn()} />);
      expect(screen.getByText("What is 3/4 + 1/4?")).toBeInTheDocument();
    });

    it("renders all answer choices as buttons", () => {
      render(<QuestionCard question={mcQuestion} onAnswer={vi.fn()} />);
      expect(screen.getByRole("button", { name: /A\. 1\/2/ })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /B\. 1/ })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /C\. 4\/8/ })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /D\. 2/ })).toBeInTheDocument();
    });

    it("calls onAnswer with selected choice", async () => {
      const onAnswer = vi.fn();
      render(<QuestionCard question={mcQuestion} onAnswer={onAnswer} />);
      await userEvent.click(screen.getByRole("button", { name: /B\. 1/ }));
      expect(onAnswer).toHaveBeenCalledWith("1");
    });
  });

  describe("numeric variant", () => {
    it("renders the question text", () => {
      render(<QuestionCard question={numericQuestion} onAnswer={vi.fn()} />);
      expect(screen.getByText("What is 6 × 7?")).toBeInTheDocument();
    });

    it("calls onAnswer with typed value on submit", async () => {
      const onAnswer = vi.fn();
      render(<QuestionCard question={numericQuestion} onAnswer={onAnswer} />);
      await userEvent.type(screen.getByLabelText("Your answer"), "42");
      await userEvent.click(screen.getByRole("button", { name: /submit/i }));
      expect(onAnswer).toHaveBeenCalledWith("42");
    });

    it("clears input after submit", async () => {
      render(<QuestionCard question={numericQuestion} onAnswer={vi.fn()} />);
      const input = screen.getByLabelText("Your answer");
      await userEvent.type(input, "42");
      await userEvent.click(screen.getByRole("button", { name: /submit/i }));
      expect(input).toHaveValue("");
    });
  });
});
