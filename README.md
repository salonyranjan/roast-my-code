<div align="center">

<img src="https://capsule-render.vercel.app/api?type=venom&color=0:0a0a0a,35:ea580c,65:dc2626,100:0a0a0a&height=230&section=header&text=🔥%20ROAST%20MY%20CODE&fontSize=64&fontColor=ffffff&fontAlignY=48&animation=fadeIn&stroke=ea580c&strokeWidth=2&desc=An%20AI%20Head%20Chef%20With%20Zero%20Patience%20For%20Spaghetti%20Code&descSize=17&descAlignY=70&descColor=fed7aa" />

<br/>

**Paste a GitHub repo. Get inspected, insulted, and — rarely — complimented.**
<br/>Every repo becomes a printed kitchen ticket: a 0–3 star rating, a rubber-stamped verdict, and a list of exactly what got it sent back — grounded in the actual code, not generic AI slop.

<br/>

<!--
  Replace this with a real demo GIF or screenshot before you publish.
  Record a 10-15s clip of pasting a repo URL → watching the ticket print → downloading it.
  This is the single biggest driver of stars — put it right at the top.
-->
<img src="./docs/demo.gif" alt="Roast My Code — demo" width="100%" style="border-radius:8px; box-shadow: 0 0 40px #ea580c33;" />

<br/><br/>

[![Live Demo](https://img.shields.io/badge/🚀_Try_It_Live-ea580c?style=for-the-badge)](https://roast-my-code-delta.vercel.app/)
[![Deploy with Vercel](https://img.shields.io/badge/▲_Deploy_Your_Own-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/new/clone?repository-url=https://github.com/salonyranjan/roast-my-code&env=GROQ_API_KEY&envDescription=Get%20a%20free%20key%20from%20console.groq.com/keys)
[![License](https://img.shields.io/badge/license-MIT-1f2937?style=for-the-badge)](./LICENSE)
[![Stars](https://img.shields.io/github/stars/salonyranjan/roast-my-code?style=for-the-badge&color=ea580c)](https://github.com/salonyranjan/roast-my-code/stargazers)

<img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
<img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
<img src="https://img.shields.io/badge/Groq-Llama_3.3_70B-f43f5e?style=for-the-badge" />

</div>

---

### 🍽️ Sample ticket

*(what comes back when you paste a repo — this is the shareable artifact itself, not a chat transcript)*

<div align="center">
<img src="./docs/sample-ticket.png" alt="Sample kitchen inspection ticket — Roast My Code" width="380" style="border-radius:4px; box-shadow: 0 8px 30px rgba(0,0,0,0.35);" />
</div>

---

## Why this exists

Every "paste your code, get AI feedback" tool reads like a linter with a chatbot bolted on. This one is built to be screenshotted: a real persona committed to fully, a shareable result instead of a wall of chat, and complaints that cite your actual files instead of generic advice.

## How it works

1. You paste a public GitHub repo URL.
2. The server pulls the README, manifest files, and a weighted sample of source files (biggest, shallowest, most "entrypoint-shaped" first) — capped so it stays fast and cheap.
3. That code goes to Claude with a strict system prompt: stay in character, but every complaint has to be a real, specific, technically accurate observation. No invented problems.
4. The model returns a structured verdict — star rating, rubber-stamp headline, complaints, one grudging compliment, closing line.
5. It renders as a torn-edge kitchen ticket you can download as a PNG or share straight to X.

## Tech stack

**Next.js 14** (App Router) · **TypeScript** · **Tailwind CSS** · [**Groq**](https://groq.com) (Llama 3.3 70B) · **GitHub REST API** · `html-to-image` for the shareable PNG export.

---

## Run it locally

```bash
git clone https://github.com/salonyranjan/roast-my-code.git
cd roast-my-code
npm install
cp .env.example .env.local   # add your GROQ_API_KEY
npm run dev
```

Open [localhost:3000](http://localhost:3000).

### Environment variables

| Variable | Required | Notes |
|---|:---:|---|
| `GROQ_API_KEY` | ✅ | Free at [console.groq.com/keys](https://console.groq.com/keys) |
| `GITHUB_TOKEN` | optional | Raises GitHub's unauthenticated rate limit from 60/hr to 5000/hr. No permissions needed beyond public read. |

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/salonyranjan/roast-my-code&env=GROQ_API_KEY&envDescription=Get%20a%20free%20key%20from%20console.groq.com/keys)

One click, add your `GROQ_API_KEY`, done.

---

## Design notes

The visual language is a kitchen inspection ticket, not a chat window — torn paper edges, a dashed order-slip layout, a rubber stamp for the verdict, printed in a monospace "ticket printer" font. The whole point is that the *output* is the shareable artifact, so it had to look like something worth screenshotting on its own, without any UI chrome around it.

## Roadmap / ideas

- [ ] Persona picker (brutal senior dev, disappointed professor, etc.)
- [ ] Compare two repos head-to-head
- [ ] Public leaderboard of the worst-rated public repos (opt-in)
- [ ] Roast a single file via drag-and-drop, no repo required

Contributions and persona ideas welcome — open an issue or a PR.

## License

MIT — see [LICENSE](./LICENSE).

---

<div align="center">

### 🔥 If your code got roasted and you liked it — that's the whole point. Star it.

<a href="https://github.com/salonyranjan/roast-my-code/stargazers"><img src="https://img.shields.io/badge/⭐_Star_This_Repo-ea580c?style=for-the-badge&logo=github&logoColor=white" /></a>
&nbsp;
<a href="https://github.com/salonyranjan/roast-my-code/fork"><img src="https://img.shields.io/badge/🍴_Fork_&_Build-1f2937?style=for-the-badge&logo=github&logoColor=white" /></a>
&nbsp;
<a href="https://roast-my-code-delta.vercel.app/"><img src="https://img.shields.io/badge/🚀_Roast_A_Repo-000000?style=for-the-badge&logo=vercel&logoColor=white" /></a>

<br/><br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0a0a0a,35:ea580c,65:dc2626,100:0a0a0a&height=100&section=footer&animation=fadeIn" />

Built by [**Salony Ranjan**](https://github.com/salonyranjan). If your code got roasted and you're mad about it, that's kind of the point — [share it](https://twitter.com/intent/tweet) anyway.

</div>
