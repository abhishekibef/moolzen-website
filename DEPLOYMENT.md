# Moolzen DNS Domain Configuration Guide

Follow these instructions to bind and deploy the marketing website with **moolzen.com** as the primary canonical address and **moolzen.in** as a permanent redirect.

## 1. Hosting Providers Setup (Vercel, Netlify, Cloudflare)

### Option A: Vercel
1. Drag and drop the `website` directory onto the Vercel Dashboard to build a new project, or run `vercel` in your terminal.
2. Go to **Settings > Domains** on Vercel.
3. Add `moolzen.com` as a domain. Select **Recommend (www.moolzen.com redirects to moolzen.com)**.
4. Add `moolzen.in` as an additional domain. In its configuration settings, set **Redirect to: moolzen.com** with a Status Code of **301 (Permanent)**.
5. Vercel's edge network will now handle the redirection logic automatically based on the `vercel.json` and domain configurations.

### Option B: Netlify
1. Deploy the `website` directory to Netlify.
2. Go to **Domain Settings > Custom Domains**.
3. Set `moolzen.com` as the **Primary Domain**.
4. Set `moolzen.in` as an **Alias Domain**.
5. The `_redirects` file at the root of the project will capture all `moolzen.in` traffic and map it securely to `moolzen.com`.

---

## 2. DNS Zone Settings

Go to your Domain Registrars (e.g. GoDaddy, Namecheap, Google Domains) and apply the following records:

### For `moolzen.com` (Primary Registrar)
| Type | Host/Name | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | *[Your Hosting Provider IP (e.g. 76.76.21.21 for Vercel)]* | Automatic / 3600 |
| **CNAME** | `www` | `cname.vercel-dns.com.` *(or Netlify equivalent)* | Automatic |

### For `moolzen.in` (Redirect Registrar)
| Type | Host/Name | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | *[Your Hosting Provider IP (e.g. 76.76.21.21 for Vercel)]* | Automatic / 3600 |
| **CNAME** | `www` | `cname.vercel-dns.com.` | Automatic |

---

## 3. SEO Verification & Sitemaps
*   Always ensure the canonical header `<link rel="canonical" href="https://moolzen.com">` points to the `.com` domain to preserve Google search relevance indexes and prevent duplication penalties.
