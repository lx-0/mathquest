import { render, screen, act, fireEvent } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { AudioProvider, useAudio } from "./AudioContext";

// Helper that exposes context values via rendered elements
function AudioConsumer() {
  const { userHasInteracted, muted, toggleMute, play, pause } = useAudio();
  return (
    <div>
      <span data-testid="interacted">{String(userHasInteracted)}</span>
      <span data-testid="muted">{String(muted)}</span>
      <button onClick={toggleMute}>Toggle mute</button>
      <button
        onClick={() => {
          const audio = document.getElementById("test-audio") as HTMLAudioElement | null;
          const result = play(audio);
          const resultEl = document.getElementById("play-result");
          if (resultEl) resultEl.textContent = String(result);
        }}
      >
        Play
      </button>
      <button
        onClick={() => {
          const audio = document.getElementById("test-audio") as HTMLAudioElement | null;
          pause(audio);
        }}
      >
        Pause
      </button>
    </div>
  );
}

function makeAudioElement() {
  const audio = document.createElement("audio");
  audio.id = "test-audio";
  audio.play = vi.fn().mockResolvedValue(undefined);
  audio.pause = vi.fn();
  document.body.appendChild(audio);
  return audio;
}

describe("AudioProvider", () => {
  let audio: HTMLAudioElement;

  beforeEach(() => {
    audio = makeAudioElement();
  });

  afterEach(() => {
    audio.remove();
    vi.restoreAllMocks();
  });

  it("starts with userHasInteracted=false and muted=false", () => {
    render(
      <AudioProvider>
        <AudioConsumer />
      </AudioProvider>
    );
    expect(screen.getByTestId("interacted")).toHaveTextContent("false");
    expect(screen.getByTestId("muted")).toHaveTextContent("false");
  });

  it("sets userHasInteracted to true on pointerdown", async () => {
    render(
      <AudioProvider>
        <AudioConsumer />
      </AudioProvider>
    );
    expect(screen.getByTestId("interacted")).toHaveTextContent("false");

    await act(async () => {
      fireEvent.pointerDown(window);
    });

    expect(screen.getByTestId("interacted")).toHaveTextContent("true");
  });

  it("sets userHasInteracted to true on keydown", async () => {
    render(
      <AudioProvider>
        <AudioConsumer />
      </AudioProvider>
    );

    await act(async () => {
      fireEvent.keyDown(window);
    });

    expect(screen.getByTestId("interacted")).toHaveTextContent("true");
  });

  it("toggleMute flips muted state", async () => {
    render(
      <AudioProvider>
        <AudioConsumer />
      </AudioProvider>
    );

    expect(screen.getByTestId("muted")).toHaveTextContent("false");

    await act(async () => {
      screen.getByRole("button", { name: "Toggle mute" }).click();
    });

    expect(screen.getByTestId("muted")).toHaveTextContent("true");

    await act(async () => {
      screen.getByRole("button", { name: "Toggle mute" }).click();
    });

    expect(screen.getByTestId("muted")).toHaveTextContent("false");
  });

  it("play() returns false and does not call audio.play() before user interaction", async () => {
    render(
      <AudioProvider>
        <AudioConsumer />
        <div id="play-result" />
      </AudioProvider>
    );

    await act(async () => {
      screen.getByRole("button", { name: "Play" }).click();
    });

    expect(audio.play).not.toHaveBeenCalled();
  });

  it("play() calls audio.play() after user interaction when not muted", async () => {
    render(
      <AudioProvider>
        <AudioConsumer />
        <div id="play-result" />
      </AudioProvider>
    );

    // Simulate user interaction first
    await act(async () => {
      fireEvent.pointerDown(window);
    });

    await act(async () => {
      screen.getByRole("button", { name: "Play" }).click();
    });

    expect(audio.play).toHaveBeenCalledTimes(1);
  });

  it("play() pauses and returns false when muted", async () => {
    render(
      <AudioProvider>
        <AudioConsumer />
        <div id="play-result" />
      </AudioProvider>
    );

    // Interact then mute
    await act(async () => {
      fireEvent.pointerDown(window);
    });
    await act(async () => {
      screen.getByRole("button", { name: "Toggle mute" }).click();
    });

    await act(async () => {
      screen.getByRole("button", { name: "Play" }).click();
    });

    expect(audio.play).not.toHaveBeenCalled();
    expect(audio.pause).toHaveBeenCalledTimes(1);
  });

  it("play() is a no-op for null audio element", async () => {
    // Should not throw
    render(
      <AudioProvider>
        <AudioConsumer />
      </AudioProvider>
    );

    await act(async () => {
      fireEvent.pointerDown(window);
    });

    // Remove the audio element so getElementById returns null
    audio.remove();

    await act(async () => {
      screen.getByRole("button", { name: "Play" }).click();
    });

    expect(audio.play).not.toHaveBeenCalled();
  });

  it("pause() calls audio.pause()", async () => {
    render(
      <AudioProvider>
        <AudioConsumer />
      </AudioProvider>
    );

    await act(async () => {
      screen.getByRole("button", { name: "Pause" }).click();
    });

    expect(audio.pause).toHaveBeenCalledTimes(1);
  });
});

describe("useAudio", () => {
  it("throws when used outside AudioProvider", () => {
    function Bare() {
      useAudio();
      return null;
    }
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Bare />)).toThrow(
      "useAudio must be used inside an <AudioProvider>"
    );
    consoleSpy.mockRestore();
  });
});
