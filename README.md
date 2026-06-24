# ASL Interpreter

A real-time browser-based ASL interpretation system that runs entirely on the client, with no backend required. It detects hand landmarks from a webcam feed, classifies American Sign Language gestures using geometric heuristics, and then passes recognized signs through a sentence-building layer that produces natural English output.

---

## How it works

MediaPipe Hands processes each camera frame and returns 21 normalized 3D landmarks per hand. From those landmarks, the classifier computes finger extension states, palm orientation vectors, and fingertip distances to determine which sign is being held. Each frame's classification is fed into a sliding vote queue, and a sign is only confirmed when it holds a supermajority across the window for a minimum duration. This prevents noise and accidental registrations from brief gestures.

Once a sign clears the hold threshold, it enters the sentence builder. The sentence builder maintains a phrase buffer of confirmed signs and runs them through an interpreter stack: first checking user-defined custom phrases, then a pattern database of known sign sequences ordered by length, then subsequence matching for partial inputs, and finally a grammar fallback that reconstructs natural word order from the detected vocabulary. Each result is tagged with an intent category and a confidence score derived from weighted sign co-occurrence.

A pause timer watches for gaps in signing. When no new sign is confirmed for 1.5 seconds, the current phrase is finalized and appended to a session transcript. The interpreted sentence updates live as signs are added, so the output adjusts in real time rather than waiting for the pause.

---

## Features

- Real-time hand landmark detection and skeletal overlay via MediaPipe
- Heuristic sign classifier covering numbers, responses, verbs, and common phrases
- Vote-based stability filter with configurable hold duration and confidence threshold
- Sentence builder that converts raw sign sequences into grammatically structured English
- Intent scoring across categories including requests, questions, affirmations, and greetings
- Pattern database with exact and subsequence matching, ordered by specificity
- Grammar fallback for sign combinations not in the database
- Pause-based phrase finalization with session transcript
- Custom phrase memory stored in localStorage, editable at runtime
- Optional local LLM mode that sends recognized signs to a local inference endpoint and falls back to rule-based interpretation if unavailable
- Debug overlay showing raw classification, vote count, hold progress, and cooldown state
- No server, no external API calls required, fully offline by default

---

## Tech stack

- JavaScript
- MediaPipe Hands
- HTML Canvas / WebGL
- localStorage for custom phrase persistence

---

## Run locally

Clone the repo:

```
git clone https://github.com/Bouwles/ASL-Interpreter.git
cd ASL-Interpreter
```

Open the HTML file directly in a browser by double-clicking it, or serve it locally if your browser blocks camera access from file://:

```
npx serve .
```

Camera permission is required. Everything else runs in the browser with no dependencies to install.

---

## Optional AI mode

The interpreter includes an optional mode that sends recognized signs to a locally running language model for sentence generation. This is disabled by default. To use it, open the Reference panel, enter your local inference endpoint (for example http://localhost:11434/api/generate if running Ollama), set the model name, and toggle AI mode on. If the request fails or times out, the system falls back to rule-based interpretation automatically.

---

## Supported signs

Numbers 0 through 9, YES, NO, GOOD, SORRY, THANK YOU, PLEASE, HELLO, HELP, STOP, WANT, MORE, EAT, THINK, KNOW, LIKE, NEED, YOU, WATER, MOTHER, FRIEND, I LOVE YOU.

---

Made by Paul Nercessian
