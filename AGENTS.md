# Repository guidance

- Keep the Harness implementation generic and free of submission-specific branding.
- Preserve backward compatibility for recipes without `chainValidation.assertions` or actors.
- Keep application-policy findings separate from network and infrastructure failures.
- Never commit Hedera keys, actor files, environment files, or generated run artifacts.
- Run the fixture build and the relevant Harness tests before committing.
- Do not add AI co-author trailers.
