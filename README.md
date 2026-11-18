# FlowSpace

Created by **Samira Sabry**.

An AI-powered HR automation portfolio featuring candidate intake, CV screening,
a RAG policy assistant, career coaching, and workflow monitoring.

- Website: https://flowspace-ai-lab.friendlybloom2.chatgpt.site/
- GitHub: https://github.com/samirasabry42-jpg/-FlowSpace

## Run locally

Install Node.js 22 or newer, then run:

```sh
npm start
```

Open http://localhost:4173. No dependency installation is needed.
The demo tools work without a backend. Live features require your own n8n
instance, connected credentials, data sources, and server-side environment variables.
The local server reads process environment variables; it does not automatically load .env files.

## Workflows

Import the five JSON templates in workflows/ into n8n. Connect your own accounts,
replace CONFIGURE_* resource and recipient placeholders, and review every node.
These templates are inactive and contain no running account credentials.
Webhook templates use no authentication initially; configure Header Auth with
X-FlowSpace-Token before publishing a live endpoint.
The screening workflow can send candidate emails when configured and executed.

## Hosting

This website currently runs on a hosted Worker; its n8n backend is provided
through an ngrok tunnel from the owner's computer. Live features require Docker,
n8n, ngrok, and that computer to remain running. The HR vector store is temporary
and policy documents must be uploaded again after n8n restarts.

Run npm run build to create dist/server/index.js, a Worker module.
For deployment on your own Worker host, configure environment variables from
.env.example plus ADMIN_ACCESS_CODE, N8N_SCREENING_DASHBOARD_URL, and
N8N_MONITORING_DASHBOARD_URL. The two dashboard adapter workflows are not included
in this five-workflow template set.
GitHub hosts this source code; GitHub Pages alone cannot run the server-side API.

## Privacy

Do not commit access codes, provider tokens, private exports, candidate records,
policy documents, or local backup files. Keep secrets in server-side configuration.
