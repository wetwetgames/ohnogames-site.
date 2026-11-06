# ohnogames.site — Oh No Games website

Static site (plain HTML/CSS/JS, no build step). Pages:

| File | Page |
|---|---|
| `index.html` | Home: intro animation, studio intro, featured game, about, contact teaser |
| `game.html` | D.J.T page: trailer, pitch, features, screenshot gallery |
| `contact.html` | Contact form + e-mail + company address |
| `privacy.html` | Privacy Policy (website + games) |
| `404.html` | "Page not found" |

## 1. Fill in your details

Open **`assets/config.js`** and change:

- `legalName`, `address` (3 lines), `city`, optional `registration`
- `email` (default `hello@ohnogames.site`, see step 4)
- `formspreeId` (step 3), `steamUrl` / `youtubeUrl` / `xUrl` / `discordUrl` (empty = hidden)

Every page reads these values, so you only edit them once.
Placeholder pictures are trailer frames in `assets/img/` — replace files with the same names to swap them.
Test locally: `python -m http.server 4321` inside this folder, then open http://localhost:4321.

## 2. Host it (free) on GitHub Pages

1. Create a new **public** GitHub repository, e.g. `ohnogames-site`.
2. Put the **contents** of this `Website` folder at the root of that repo (GitHub Desktop: add the
   repo, copy the files in, commit, push). The `CNAME` file (contains `ohnogames.site`) must be included.
3. Repo → **Settings → Pages** → Source: *Deploy from a branch*, Branch: `main` / `(root)` → Save.
4. Same page, **Custom domain**: `ohnogames.site` → Save. Tick **Enforce HTTPS** once it becomes available
   (can take up to an hour after DNS works).

(Alternative without GitHub: drag this folder onto https://app.netlify.com/drop, then use Netlify's DNS
values instead of the ones below.)

## 3. Namecheap DNS (Domain List → ohnogames.site → Manage)

1. **Domain** tab → *Redirect Domain*: delete the `ohnogames.site → http://www.ohnogames.site/` redirect
   (trash icon). Keep Nameservers on *Namecheap BasicDNS*.
2. **Advanced DNS** tab → *Host Records*: delete the parking records (`CNAME www → parkingpage.namecheap.com`,
   any `URL Redirect Record`), then add:

| Type | Host | Value |
|---|---|---|
| A Record | `@` | `185.199.108.153` |
| A Record | `@` | `185.199.109.153` |
| A Record | `@` | `185.199.110.153` |
| A Record | `@` | `185.199.111.153` |
| CNAME Record | `www` | `<your-github-username>.github.io.` |

TTL: Automatic. DNS usually updates within 30 minutes (up to 48 h).

## 4. E-mail at your domain

Free option: Namecheap → Domain tab → **Redirect Email** (or Advanced DNS → *Mail Settings* →
*Email Forwarding*): forward `hello@ohnogames.site` to your existing inbox. Paid option: Namecheap Private Email.

## 5. Contact form

Without setup, "Send" opens the visitor's e-mail app with the message filled in. For a real form:
sign up at https://formspree.io (free: 50 messages/month), create a form sending to your e-mail,
copy its id (`https://formspree.io/f/`**`xyzabcd`**) into `formspreeId` in `assets/config.js`.

## Notes

- `assets/video/trailer.mp4` is the trailer re-encoded at 720p (14 MB). If you upload the trailer to YouTube,
  you can replace the `<video>` in `game.html` with the YouTube embed to save bandwidth.
- The Privacy Policy is a template written for what the site and the game do today (no cookies, no analytics,
  saves stored on the player's device). Update it if you add analytics, ads, accounts or online features,
  and have it checked for your country's rules.
