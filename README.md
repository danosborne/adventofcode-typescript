## Advent of Code TypeScript Starter Kit 

`npm run create-day 5` to create the source file for December 5th.

`npm run create-today` to create the source file for today.

This is based on `scripts/day.template`. 
You could edit this to import common utils from `src/utils.ts`.

`npm run day 05` runs webpack with typescript loader over `src/05.ts` to produce a bundle in `dist/05.js`, then runs it. 

`npm run today` runs the same as above but for today and it watches for changes.

You can also run `npm run watch-day 5` to run December 5th's file while watching for changes.

I wanted the bundling so I can copy/paste to share my solution in the Slack channel at work. The webpack bundle output isn't the easiest thing to influence and is by default quite ugly though :'(...
