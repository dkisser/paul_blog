/* 全站交互：主题三态切换 / 移动导航 / 回到顶部 / 复制委托 / TL;DR 折叠 /
 * TOC scrollspy / mermaid 双主题重渲染 / 首页 typeit 打字机。
 * 注意：本文件里的 class 切换一律使用完整类名（Tailwind v4 自动扫描本目录）。
 * 组件态样式（如 .toc-link.is-active）定义在 assets/css/main.src.css。 */
(function () {
  "use strict";

  /* ── 主题：自动（跟随系统）/ 浅色 / 深色 三态 ─────────────────────── */
  var STORE_KEY = "theme";
  var media = window.matchMedia("(prefers-color-scheme: dark)");
  var themeListeners = [];

  function storedTheme() {
    try {
      return localStorage.getItem(STORE_KEY);
    } catch (e) {
      return null;
    }
  }
  function isDark() {
    var t = storedTheme();
    return t === "dark" || (t !== "light" && media.matches);
  }
  function currentMode() {
    return storedTheme() || "auto";
  }
  function applyDom() {
    document.documentElement.classList.toggle("dark", isDark());
    var btn = document.getElementById("theme-toggle");
    if (btn) {
      var mode = currentMode();
      var icon = btn.querySelector("[data-theme-icon]");
      if (icon) {
        icon.textContent = mode === "auto" ? "routine" : mode === "light" ? "light_mode" : "dark_mode";
      }
      btn.title = "主题：" + (mode === "auto" ? "跟随系统" : mode === "light" ? "浅色" : "深色");
    }
    themeListeners.forEach(function (fn) {
      fn(isDark());
    });
  }
  function cycleTheme() {
    var next = { auto: "light", light: "dark", dark: "auto" }[currentMode()];
    try {
      if (next === "auto") localStorage.removeItem(STORE_KEY);
      else localStorage.setItem(STORE_KEY, next);
    } catch (e) {}
    applyDom();
  }
  media.addEventListener("change", function () {
    if (!storedTheme()) applyDom();
  });

  /* ── 点击委托：主题切换 / 移动导航 / 复制 / TL;DR 折叠 ────────────── */
  document.addEventListener("click", function (e) {
    var target = e.target;

    if (target.closest("#theme-toggle")) {
      cycleTheme();
      return;
    }

    var navToggle = target.closest("#nav-toggle");
    if (navToggle) {
      var panel = document.getElementById("mobile-nav");
      if (panel) {
        var open = !panel.classList.toggle("hidden");
        navToggle.setAttribute("aria-expanded", String(open));
        var navIcon = navToggle.querySelector(".material-symbols-outlined");
        if (navIcon) navIcon.textContent = open ? "close" : "menu";
      }
      return;
    }

    var codeBtn = target.closest(".code-copy-btn");
    if (codeBtn) {
      var win = codeBtn.closest(".code-window");
      var pre = win && win.querySelector("pre");
      if (pre) {
        copyText(pre.innerText).then(function () {
          flashBtn(codeBtn);
        });
      }
      return;
    }

    var textBtn = target.closest("[data-copy-text]");
    if (textBtn) {
      copyText(textBtn.getAttribute("data-copy-text")).then(function () {
        flashBtn(textBtn);
      });
      return;
    }

    var linkBtn = target.closest("[data-copy-link]");
    if (linkBtn) {
      copyText(location.href).then(function () {
        flashBtn(linkBtn);
      });
      return;
    }

    var mdBtn = target.closest("[data-copy-md]");
    if (mdBtn) {
      var tpl = document.getElementById("raw-md");
      if (tpl) {
        copyText(tpl.content ? tpl.content.textContent : tpl.textContent).then(function () {
          flashBtn(mdBtn);
        });
      }
      return;
    }

    var tldrToggle = target.closest("[data-tldr-toggle]");
    if (tldrToggle) {
      var content = document.getElementById("tldr-content");
      if (content) {
        var collapsed = content.classList.toggle("hidden");
        var arrow = tldrToggle.querySelector("[data-tldr-arrow]");
        if (arrow) arrow.style.transform = collapsed ? "rotate(180deg)" : "";
      }
    }
  });

  /* ── 复制辅助 ── */
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        resolve();
      } catch (err) {
        reject(err);
      }
      document.body.removeChild(ta);
    });
  }
  function flashBtn(btn) {
    var label = btn.querySelector("[data-copy-label]");
    if (!label) return;
    var orig = label.textContent;
    label.textContent = "已复制";
    setTimeout(function () {
      label.textContent = orig;
    }, 2000);
  }

  /* ── 回到顶部 ── */
  var backBtn = document.getElementById("back-to-top");
  if (backBtn) {
    var onScroll = function () {
      var show = window.scrollY > 600;
      backBtn.classList.toggle("hidden", !show);
      backBtn.classList.toggle("flex", show);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    backBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ── TOC scrollspy（IntersectionObserver） ── */
  var toc = document.getElementById("toc");
  if (toc) {
    var links = Array.prototype.slice.call(toc.querySelectorAll("a[href^='#']"));
    var linkById = {};
    var headings = [];
    links.forEach(function (a) {
      var id = decodeURIComponent(a.getAttribute("href").slice(1));
      var el = document.getElementById(id);
      if (el) {
        linkById[id] = a;
        headings.push(el);
      }
    });
    var activeId = null;
    var setActive = function (id) {
      if (id === activeId) return;
      activeId = id;
      links.forEach(function (a) {
        a.classList.toggle("is-active", a === linkById[id]);
      });
    };
    if (headings.length) {
      var visible = {};
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            visible[entry.target.id] = entry.isIntersecting;
          });
          var first = headings.filter(function (h) { return visible[h.id]; })[0];
          if (first) {
            setActive(first.id);
          } else {
            // 无可见标题时：取最后一个越过视口顶部的标题
            var past = headings.filter(function (h) {
              return h.getBoundingClientRect().top <= 96;
            });
            if (past.length) setActive(past[past.length - 1].id);
          }
        },
        { rootMargin: "-80px 0px -60% 0px" }
      );
      headings.forEach(function (h) {
        observer.observe(h);
      });
      setActive(headings[0].id);
    }
  }

  /* ── Mermaid（front matter mermaid: true 时由 vendor-assets 加载） ── */
  function mermaidNodes() {
    return Array.prototype.slice.call(document.querySelectorAll("pre.mermaid"));
  }
  function runMermaid() {
    if (!window.mermaid) return;
    var nodes = mermaidNodes();
    if (!nodes.length) return;
    window.mermaid.initialize({
      startOnLoad: false,
      theme: isDark() ? "dark" : "default",
    });
    nodes.forEach(function (n) {
      if (!n.hasAttribute("data-src")) n.setAttribute("data-src", n.textContent);
      n.removeAttribute("data-processed");
      n.textContent = n.getAttribute("data-src");
    });
    window.mermaid.run({ nodes: nodes }).catch(function (err) {
      console.error("mermaid 渲染失败:", err);
    });
  }
  runMermaid();
  // 主题切换时按当前主题重渲染（原文保存在 data-src）
  themeListeners.push(function () {
    runMermaid();
  });

  /* ── 首页 TypeIt 打字机（data-lines JSON 数组） ── */
  var typeEl = document.getElementById("typeit-summary");
  if (typeEl && window.TypeIt) {
    var lines = [];
    try {
      lines = JSON.parse(typeEl.getAttribute("data-lines") || "[]");
    } catch (e) {}
    if (lines.length) {
      var instance = new window.TypeIt(typeEl, {
        loop: true,
        speed: 70,
        deleteSpeed: 35,
        waitUntilVisible: true,
      });
      lines.forEach(function (line) {
        instance.type(line, { delay: 1200 }).pause(2000).delete();
      });
      instance.go();
    }
  }

  /* 初始化主题图标（防闪烁脚本已设置 class，此处同步按钮态） */
  applyDom();
})();
