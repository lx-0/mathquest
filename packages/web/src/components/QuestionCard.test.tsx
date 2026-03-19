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
      const card = screen.getByLabelText("Math question");
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
      const firstRadio = screen.getByRole("radio", { name: /A\. 1\/2/i });
      firstRadio.focus();
      expect(document.activeElement).toBe(firstRadio);

      // Rerender with same id (e.g. updated onAnswer callback reference)
      rerender(<QuestionCard question={mcQuestion} onAnswer={vi.fn()} />);

      // Focus should remain on the radio, not jump back to the card
      expect(document.activeElement).toBe(firstRadio);
    });
  });

  describe("WCAG 1.3.1 — multiple-choice fieldset/legend/radio pattern", () => {
    it("renders question text as a <legend> inside a <fieldset>", () => {
      render(<QuestionCard question={mcQuestion} onAnswer={vi.fn()} />);
      const fieldset = screen.getByRole("group");
      expect(fieldset.tagName).toBe("FIELDSET");
      expect(screen.getByText("What is 3/4 + 1/4?").tagName).toBe("LEGEND");
    });

    it("renders all answer choices as radio inputs with labels", () => {
      render(<QuestionCard question={mcQuestion} onAnswer={vi.fn()} />);
      expect(screen.getByRole("radio", { name: /A\. 1\/2/i })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: /B\. 1/i })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: /C\. 4\/8/i })).toBeInTheDocument();
      expect(screen.getByRole("radio", { name: /D\. 2/i })).toBeInTheDocument();
    });

    it("all radios share the same name (radio group)", () => {
      render(<QuestionCard question={mcQuestion} onAnswer={vi.fn()} />);
      const radios = screen.getAllByRole("radio");
      const names = radios.map((r) => r.getAttribute("name"));
      expect(new Set(names).size).toBe(1);
    });

    it("each radio has a unique id matching its label's htmlFor", () => {
      render(<QuestionCard question={mcQuestion} onAnswer={vi.fn()} />);
      const radios = screen.getAllByRole("radio");
      radios.forEach((radio) => {
        const id = radio.getAttribute("id");
        expect(id).toBeTruthy();
        const label = document.querySelector(`label[for="${id}"]`);
        expect(label).toBeInTheDocument();
      });
    });

    it("calls onAnswer with selected choice when radio changes", async () => {
      const onAnswer = vi.fn();
      render(<QuestionCard question={mcQuestion} onAnswer={onAnswer} />);
      await userEvent.click(screen.getByRole("radio", { name: /B\. 1/i }));
      expect(onAnswer).toHaveBeenCalledWith("1");
    });
  });

  describe("WCAG 1.3.1 — numeric variant label/submit pattern", () => {
    it("renders the question text as a paragraph", () => {
      render(<QuestionCard question={numericQuestion} onAnswer={vi.fn()} />);
      expect(screen.getByText("What is 6 × 7?").tagName).toBe("P");
    });

    it("has a visible <label> associated with the answer input (A3)", () => {
      render(<QuestionCard question={numericQuestion} onAnswer={vi.fn()} />);
      expect(screen.getByLabelText("Your answer")).toBeInTheDocument();
    });

    it("submit is a <button type=submit>, not a <div> (A23)", () => {
      render(<QuestionCard question={numericQuestion} onAnswer={vi.fn()} />);
      const btn = screen.getByRole("button", { name: /submit/i });
      expect(btn.tagName).toBe("BUTTON");
      expect(btn).toHaveAttribute("type", "submit");
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
