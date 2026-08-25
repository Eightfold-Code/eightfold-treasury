# House Writing Standards

Canonical copy: `/home/hermes/AGENTS.md` (VM). Every agent working for Dino
(Moriarty, Dante, Machiavelli, pi, Codex, opencode, Gatsby) follows these
standards for commit messages, documentation, READMEs, PR descriptions, and
technical text. Project copies should be refreshed from this file.

## Git Commit Messages

Sources:
- Tim Pope, "A Note About Git Commit Messages": https://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html
- Chris Beams, "How to Write a Git Commit Message": https://cbea.ms/git-commit/

Rules:
1. Separate subject from body with a blank line.
2. Limit the subject line to 50 characters.
3. Capitalize the subject line.
4. Do not end the subject line with a period.
5. Use the imperative mood in the subject line. The subject must complete the
   sentence: "If applied, this commit will ..." ("Add login", not "Added
   login" or "Adds login").
6. Wrap the body at 72 characters.
7. The body explains what and why, never how; the diff already shows how.

Example:

```
Add JWT-based user authentication

Session cookies do not work for the mobile client. Issue a token on
login and verify it in a middleware for protected routes.
```

## Documentation and Technical Writing

Sources:
- ASD-STE100 Simplified Technical English: https://asd-ste100.org/
- Google developer documentation style guide: https://developers.google.com/style

Rules:
1. Be concise: one idea per sentence, sentences under ~20 words where possible.
2. Follow Zinsser's four principles of quality writing: Simplicity, Brevity, Clarity, Humanity.
3. Use active voice and present tense. Prefer "The server returns the file"
   over "The file is returned by the server".
4. Write instructions in the imperative mood: "Click Save", "Run the
   installer", "Set the API key".
5. Use standard, consistent terminology: never use synonyms for the same
   thing; define acronyms on first use.
6. Avoid jargon, idioms, slang, and metaphors; write for a global audience
   including non-native speakers.
7. Use "must" for requirements, "should" for recommendations, "may" for
   permission. Avoid "shall" in user documentation.
8. Number steps when order matters; use bullets otherwise.
9. Refer to UI elements by their exact label, use code formatting for code
   and filenames, capitalize product names.
10. Keep paragraphs short; prefer lists and tables over long prose.
11. Verify every claim against real behavior before writing it down.
