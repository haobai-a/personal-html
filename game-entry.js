/* =========================================================
   昊白个人官网 · 游戏入口
   ---------------------------------------------------------
   在「精选项目」区域挂上《帝尊世界》的可玩入口：
   · 首页  → 三张项目卡下方追加一条通栏卡片
   · 作品页（#/projects）→ 项目列表下方追加同样的通栏卡片
   静态注入，不改动打包产物里的 React 代码。
   ========================================================= */
(function () {
  "use strict";

  var GAME = {
    file: "assets/" + "\u5e1d\u5c0a\u4e16\u754c" + ".html", // assets/帝尊世界.html
    name: "帝尊世界",
    en: "EMPEROR REALM",
    version: "v1.3.0",
    category: "文本修仙 · MUD",
    desc: "一款纯前端运行的文字修仙游戏。从初入仙途到大乘飞升，靠刷怪、突破、装备与抉择把一条仙途走完。",
    tags: ["境界突破", "战斗刷怪", "装备抉择", "本地存档"]
  };

  var gameHref = encodeURI(GAME.file);
  var ACCENT_FALLBACK = "#ff6b3d";

  /* ---------- 取站点主题色，深浅色都跟得上 ---------- */
  function cssVar(name) {
    try {
      var v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
      if (!v) v = getComputedStyle(document.body).getPropertyValue(name).trim();
      return v;
    } catch (e) {
      return "";
    }
  }

  function accentColor() {
    var v = cssVar("--nb-accent") || cssVar("--theme-accent");
    if (v) return v;
    return document.documentElement.dataset.theme === "light" ? "#d2451a" : ACCENT_FALLBACK;
  }

  // 焕新版用 --nb-*，经典版用 --theme-*，这里统一解析成卡片自己的变量
  function themeValues() {
    var line = cssVar("--nb-line");
    if (!line) {
      var rawLine = cssVar("--theme-line");
      line = /^#[0-9a-f]{6}$/i.test(rawLine) ? rawLine + "33" : "rgba(127,127,127,.26)";
    }
    return {
      "hb-accent": accentColor(),
      "hb-canvas": cssVar("--nb-canvas") || cssVar("--theme-base") || "#05080d",
      "hb-ink": cssVar("--nb-ink") || cssVar("--theme-text") || "#f7f8fa",
      "hb-muted": cssVar("--nb-muted") || cssVar("--theme-muted") || "#93a9b4",
      "hb-faint": cssVar("--nb-faint") || cssVar("--theme-faint") || "#647a86",
      "hb-line": line,
      "hb-accent-ink": cssVar("--nb-accent-ink") || "#0a0d12"
    };
  }

  function paint(card) {
    var t = themeValues();
    Object.keys(t).forEach(function (k) {
      card.style.setProperty("--" + k, t[k]);
    });
  }

  function applyAccent() {
    var t = themeValues();
    document.querySelectorAll(".hb-game").forEach(function (el) {
      Object.keys(t).forEach(function (k) {
        el.style.setProperty("--" + k, t[k]);
      });
    });
  }

  /* ---------- 样式 ---------- */
  if (!document.getElementById("hb-game-style")) {
    var style = document.createElement("style");
    style.id = "hb-game-style";
    style.textContent = [
      /* 卡片外壳：一张放在项目列表里的通栏入口 */
      ".hb-game{--hb-accent:#ff6b3d;box-sizing:border-box;position:relative;display:block;overflow:hidden;" +
        "padding:clamp(14px,1.6vw,24px);color:inherit;text-decoration:none;outline:none;" +
        "border:1px solid var(--hb-line,rgba(127,127,127,.22));" +
        "background:var(--hb-canvas,#05080d);" +
        "transition:border-color .32s,box-shadow .32s}",
      ".hb-game:before{content:\"\";position:absolute;inset:0;pointer-events:none;z-index:0;" +
        "background:radial-gradient(120% 120% at 0% 0%,color-mix(in srgb,var(--hb-accent) 12%,transparent),transparent 58%)," +
        "radial-gradient(90% 90% at 100% 100%,color-mix(in srgb,var(--hb-accent) 7%,transparent),transparent 62%)}",
      ".hb-game>*{position:relative;z-index:1}",
      ".hb-game:hover,.hb-game:focus-visible{border-color:color-mix(in srgb,var(--hb-accent) 52%,transparent);" +
        "box-shadow:0 24px 60px -34px color-mix(in srgb,var(--hb-accent) 65%,transparent)}",
      ".hb-game:focus-visible{outline:2px solid var(--hb-accent);outline-offset:3px}",
      /* 左右两栏 */
      ".hb-game__card{display:grid;grid-template-columns:minmax(0,.86fr) minmax(0,1.14fr);gap:clamp(20px,3vw,46px);" +
        "align-items:center;text-decoration:none;color:inherit;outline:none}",
      /* 外观区 */
      ".hb-game__frame{position:relative;display:block;overflow:hidden;min-height:clamp(190px,22vw,280px);" +
        "border:1px solid color-mix(in srgb,var(--hb-accent) 24%,transparent);" +
        "background:color-mix(in srgb,var(--hb-canvas,#05080d) 86%,transparent)}",
      ".hb-game__frame:before{content:\"\";position:absolute;inset:0;pointer-events:none;opacity:.5;" +
        "background:radial-gradient(120% 92% at 16% 10%,color-mix(in srgb,var(--hb-accent) 20%,transparent),transparent 58%)," +
        "repeating-linear-gradient(135deg,transparent 0 13px,color-mix(in srgb,var(--hb-ink,#fff) 4%,transparent) 13px 14px)}",
      ".hb-game__frame:after{content:\"\";position:absolute;inset:8px;border:1px solid color-mix(in srgb,var(--hb-ink,#fff) 8%,transparent);pointer-events:none}",
      ".hb-game__rune{position:relative;z-index:1;min-height:inherit;display:grid;grid-template-columns:auto auto;place-content:center;" +
        "align-items:center;gap:clamp(16px,2.4vw,30px);padding:clamp(20px,3vw,36px);pointer-events:none}",
      ".hb-game__rune-ring{width:clamp(84px,9vw,116px);height:clamp(84px,9vw,116px);border-radius:50%;display:grid;place-items:center;position:relative;" +
        "border:1px solid color-mix(in srgb,var(--hb-accent) 52%,transparent)}",
      ".hb-game__rune-ring:before{content:\"\";position:absolute;inset:9px;border-radius:50%;border:1px dashed color-mix(in srgb,var(--hb-accent) 34%,transparent)}",
      ".hb-game__rune-glyph{font-family:var(--nb-serif,\"Songti SC\",serif);font-size:clamp(36px,4.2vw,52px);line-height:1;color:var(--hb-accent);" +
        "text-shadow:0 0 22px color-mix(in srgb,var(--hb-accent) 55%,transparent)}",
      ".hb-game__rune-text{display:grid;gap:8px;justify-items:start}",
      ".hb-game__rune-title{font-family:var(--nb-serif,\"Songti SC\",serif);font-size:clamp(26px,3vw,38px);letter-spacing:.2em;margin:0;color:var(--hb-ink,#f7f8fa)}",
      ".hb-game__rune-sub{font-family:var(--nb-mono,monospace);font-size:9px;letter-spacing:.26em;text-transform:uppercase;margin:0;color:var(--hb-faint,#647a86)}",
      /* 「可玩」角标 */
      ".hb-game__badge{position:absolute;z-index:2;top:10px;left:10px;display:inline-flex;align-items:center;gap:6px;padding:4px 9px;" +
        "border:1px solid color-mix(in srgb,var(--hb-accent) 58%,transparent);border-radius:999px;" +
        "background:color-mix(in srgb,var(--hb-canvas,#05080d) 82%,transparent);" +
        "font-family:var(--nb-mono,monospace);font-size:9px;letter-spacing:.18em;text-transform:uppercase;color:var(--hb-ink,#f7f8fa)}",
      ".hb-game__badge:before{content:\"\";width:5px;height:5px;border-radius:50%;background:var(--hb-accent);box-shadow:0 0 10px var(--hb-accent)}",
      ".hb-game__cap{position:absolute;z-index:2;left:14px;right:14px;bottom:12px;display:flex;justify-content:space-between;gap:12px;" +
        "font-family:var(--nb-mono,monospace);font-size:8px;letter-spacing:.2em;text-transform:uppercase;color:var(--hb-faint,#647a86)}",
      /* 文案区 */
      ".hb-game__body{display:grid;gap:10px;align-content:start}",
      ".hb-game__meta{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;margin:0;" +
        "font-family:var(--nb-mono,monospace);font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--hb-faint,#647a86)}",
      ".hb-game__title{font-family:var(--nb-sans,system-ui);font-size:clamp(24px,2.4vw,34px);font-weight:700;line-height:1.28;letter-spacing:-.01em;margin:0;color:var(--hb-ink,#f7f8fa)}",
      ".hb-game__desc{font-size:13px;line-height:1.85;margin:0;color:var(--hb-muted,#93a9b4);max-width:58ch}",
      ".hb-game__tags{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}",
      ".hb-game__tag{font-family:var(--nb-mono,monospace);font-size:9px;letter-spacing:.12em;padding:4px 8px;" +
        "border:1px solid var(--hb-line,rgba(127,127,127,.24));color:var(--hb-faint,#647a86);" +
        "background:color-mix(in srgb,var(--hb-ink,#fff) 4%,transparent)}",
      ".hb-game__cta-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px 14px;margin-top:4px}",
      ".hb-game__cta{display:inline-flex;align-items:center;gap:8px;min-height:40px;padding:0 18px;border-radius:999px;" +
        "border:1px solid color-mix(in srgb,var(--hb-accent) 72%,transparent);" +
        "background:color-mix(in srgb,var(--hb-accent) 16%,transparent);color:var(--hb-ink,#f7f8fa);" +
        "font-family:var(--nb-mono,monospace);font-size:10px;letter-spacing:.16em;text-transform:uppercase;" +
        "transition:background-color .26s,color .26s}",
      ".hb-game:hover .hb-game__cta{background:var(--hb-accent);color:var(--hb-accent-ink,#180803)}",
      ".hb-game__cta svg{width:12px;height:12px;transition:transform .3s}",
      ".hb-game:hover .hb-game__cta svg{transform:translate(2px,-2px)}",
      ".hb-game__hint{font-family:var(--nb-mono,monospace);font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--hb-faint,#647a86)}",
      ".hb-game__note{font-family:var(--nb-mono,monospace);font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--hb-faint,#647a86);margin:0 0 12px}",
      /* 首页里作为整行卡片出现 */
      ".nb-works>[data-hb-game=home]{grid-column:1/-1}",
      /* 入场：和站点其它卡片同一节奏 */
      ".hb-game__reveal{opacity:0;transform:translateY(22px);transition:opacity .7s cubic-bezier(.22,1,.36,1),transform .7s cubic-bezier(.22,1,.36,1)}",
      ".hb-game__reveal.is-in{opacity:1;transform:none}",
      "@media (max-width:980px){.hb-game__card{grid-template-columns:minmax(0,1fr)}.hb-game__frame{min-height:180px}" +
        ".hb-game__rune{padding:22px 16px}.hb-game__rune-ring{width:72px;height:72px}.hb-game__rune-glyph{font-size:32px}" +
        ".hb-game__rune-title{font-size:24px}}",
      "@media (prefers-reduced-motion:reduce){.hb-game__reveal{opacity:1;transform:none;transition:none}.hb-game,.hb-game__cta,.hb-game__cta svg{transition:none}}"
    ].join("\n");
    (document.head || document.documentElement).appendChild(style);
  }

  /* ---------- 卡片 DOM ---------- */
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  var ARROW_SVG =
    '<svg viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  function buildRune() {
    var rune = el("span", "hb-game__rune");
    rune.setAttribute("aria-hidden", "true");
    var ring = el("span", "hb-game__rune-ring");
    ring.appendChild(el("span", "hb-game__rune-glyph", "\u5e1d"));
    rune.appendChild(ring);
    var text = el("span", "hb-game__rune-text");
    text.appendChild(el("span", "hb-game__rune-title", GAME.name));
    text.appendChild(el("span", "hb-game__rune-sub", GAME.en + " / " + GAME.version));
    rune.appendChild(text);
    return rune;
  }

  // 新标签页打不开时退回当前页跳转，避免被拦截后什么都没发生
  function hookOpen(node) {
    node.addEventListener("click", function (event) {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      var win = null;
      try {
        win = window.open(gameHref, "_blank");
      } catch (e) {
        win = null;
      }
      event.preventDefault();
      if (win) {
        try {
          win.opener = null;
        } catch (e) {}
      } else {
        window.location.href = gameHref;
      }
    });
  }
  function buildCard() {
    var card = el("a", "hb-game");
    paint(card);
    card.setAttribute("href", gameHref);
    card.setAttribute("target", "_blank");
    card.setAttribute("rel", "noopener noreferrer");
    card.setAttribute(
      "aria-label",
      "\u6253\u5f00\u300a" + GAME.name + "\u300b\u6e38\u620f\uff08\u5728\u65b0\u6807\u7b7e\u9875\u4e2d\u6e38\u73a9\uff09"
    );

    var frame = el("span", "hb-game__frame");
    frame.appendChild(el("span", "hb-game__badge", "Playable"));
    frame.appendChild(buildRune());
    var cap = el("span", "hb-game__cap");
    cap.setAttribute("aria-hidden", "true");
    cap.appendChild(el("span", null, "Play in Browser"));
    cap.appendChild(el("span", null, "No.04 / Local Save"));
    frame.appendChild(cap);

    var body = el("span", "hb-game__body");
    var meta = el("span", "hb-game__meta");
    meta.appendChild(el("span", null, GAME.category));
    meta.appendChild(el("span", null, "GAME / 04"));
    body.appendChild(meta);
    body.appendChild(el("span", "hb-game__title", GAME.name + " \u00b7 \u6587\u5b57\u4fee\u4ed9"));
    body.appendChild(el("span", "hb-game__desc", GAME.desc));

    var tags = el("span", "hb-game__tags");
    GAME.tags.forEach(function (t) {
      tags.appendChild(el("span", "hb-game__tag", t));
    });
    body.appendChild(tags);

    var ctaRow = el("span", "hb-game__cta-row");
    var cta = el("span", "hb-game__cta");
    cta.appendChild(document.createTextNode("\u8fdb\u5165\u6e38\u620f"));
    cta.insertAdjacentHTML("beforeend", ARROW_SVG);
    ctaRow.appendChild(cta);
    ctaRow.appendChild(el("span", "hb-game__hint", "\u65b0\u6807\u7b7e\u9875\u8fd0\u884c \u00b7 \u672c\u5730\u5b58\u6863"));
    body.appendChild(ctaRow);

    var inner = el("span", "hb-game__card");
    inner.appendChild(frame);
    inner.appendChild(body);
    card.appendChild(inner);
    hookOpen(card);
    return card;
  }

  function reveal(node) {
    if (!("IntersectionObserver" in window)) {
      node.classList.add("is-in");
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          node.classList.add("is-in");
          io.disconnect();
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.04 }
    );
    io.observe(node);
  }

  /* ---------- 首页：三张项目卡下方追加整行入口 ---------- */
  function mountHomeWorks() {
    var changed = false;
    document.querySelectorAll("ul.nb-works").forEach(function (list) {
      if (list.querySelector('[data-hb-game="home"]')) return;
      if (list.children.length !== 3) return;
      var li = el("li", "nb-work hb-game__reveal");
      li.setAttribute("data-hb-game", "home");
      li.style.gridColumn = "1 / -1";
      li.appendChild(buildCard());
      list.appendChild(li);
      reveal(li);
      changed = true;
    });

    // 区域标题旁加一个直达入口
    document.querySelectorAll(".nb-band--works .nb-band__head").forEach(function (head) {
      if (head.querySelector('[data-hb-game="head"]')) return;
      var viewAll = head.querySelector(".nb-arrow-link");
      var link = el("a", "nb-arrow-link");
      link.setAttribute("data-hb-game", "head");
      link.setAttribute("href", gameHref);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      link.style.whiteSpace = "nowrap";
      link.style.flex = "0 0 auto";
      link.style.marginLeft = "auto";
      link.appendChild(document.createTextNode("\u73a9\u6e38\u620f"));
      link.insertAdjacentHTML("beforeend", ARROW_SVG);
      hookOpen(link);
      if (viewAll) viewAll.parentNode.insertBefore(link, viewAll);
      else head.appendChild(link);
      changed = true;
    });
    return changed;
  }

  /* ---------- 作品页：项目列表下方追加同一条入口 ---------- */
  function mountProjectsPage() {
    var changed = false;
    document.querySelectorAll(".nb-page--works").forEach(function (page) {
      if (page.querySelector('[data-hb-game="projects"]')) return;
      var grid = page.querySelector(".nb-page__grid");
      var host = el("div", "hb-game__reveal");
      host.setAttribute("data-hb-game", "projects");
      host.style.marginTop = "clamp(32px,6vh,72px)";
      host.appendChild(el("p", "hb-game__note", "Extra Work / \u53ef\u76f4\u63a5\u8bd5\u73a9"));
      host.appendChild(buildCard());
      if (grid && grid.nextSibling) page.insertBefore(host, grid.nextSibling);
      else page.appendChild(host);
      reveal(host);
      changed = true;
    });
    return changed;
  }

  /* ---------- 经典版：首屏加一个按钮，作品页加一张卡片 ---------- */
  function mountClassic() {
    if (document.documentElement.dataset.experience !== "classic") return false;
    var changed = false;

    var home = document.querySelector("section#home");
    if (home && !home.querySelector('[data-hb-game="classic-cta"]')) {
      var contact = home.querySelector('a[href="#/contact"]');
      if (contact) {
        var cta = contact.cloneNode(false);
        cta.setAttribute("data-hb-game", "classic-cta");
        cta.setAttribute("href", gameHref);
        cta.setAttribute("target", "_blank");
        cta.setAttribute("rel", "noopener noreferrer");
        cta.appendChild(document.createTextNode("\u73a9\u6e38\u620f"));
        cta.insertAdjacentHTML(
          "beforeend",
          '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M5 15 15 5M7 5h8v8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        );
        hookOpen(cta);
        contact.parentNode.insertBefore(cta, contact.nextSibling);
        changed = true;
      }
    }

    var page = document.querySelector("section#projects");
    if (page && !page.classList.contains("nb-page") && !page.querySelector('[data-hb-game="classic-projects"]')) {
      var inner = page.querySelector(".mx-auto") || page;
      var host = el("div", "hb-game__reveal");
      host.setAttribute("data-hb-game", "classic-projects");
      host.style.marginTop = "clamp(32px,6vh,72px)";
      host.appendChild(el("p", "hb-game__note", "Extra Work / \u53ef\u76f4\u63a5\u8bd5\u73a9"));
      host.appendChild(buildCard());
      inner.appendChild(host);
      reveal(host);
      changed = true;
    }
    return changed;
  }
  /* ---------- 跟随路由重渲染补挂 ---------- */
  function mount() {
    var a = mountHomeWorks();
    var b = mountProjectsPage();
    var c = mountClassic();
    if (a || b || c) applyAccent();
  }

  function start() {
    mount();

    var scheduled = false;
    function schedule() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(function () {
        scheduled = false;
        mount();
      });
    }

    // 脚本在 React 挂载之前执行，所以观察整页而不是 main
    if ("MutationObserver" in window) {
      new MutationObserver(schedule).observe(document.body, {
        childList: true,
        subtree: true
      });
    }

    window.addEventListener("hashchange", schedule);
    window.addEventListener("resize", schedule);

    // 深浅色切换后重新取一次主题色
    if ("MutationObserver" in window) {
      new MutationObserver(function () {
        applyAccent();
      }).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "data-experience"]
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
