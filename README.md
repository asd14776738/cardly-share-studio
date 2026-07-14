# Cardly

Create editable, exportable share cards from public web and social links.

## Local development

Run npm start and open the local URL printed by the command.

## GitHub Pages

The site is published from the docs directory on the main branch.

GitHub Pages cannot execute server-side code. The Pages build calls the current Cardly Sites deployment for link extraction and image proxying. If that deployment is removed, deploy worker-template.js to Cloudflare Workers and update the API origin in app.js.
