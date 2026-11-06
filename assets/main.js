/* Oh No Games — site behaviour (no libraries) */
(function () {
	var S = window.SITE || {};

	// ---- Fill company details from config.js ----
	function fill() {
		var addr = (S.address || []).join("<br>");
		var map = {
			company: S.company, legalName: S.legalName, city: S.city,
			email: S.email, updated: S.privacyUpdated, registration: S.registration
		};
		document.querySelectorAll("[data-site]").forEach(function (el) {
			var key = el.getAttribute("data-site");
			if (key === "address") { el.innerHTML = addr; return; }
			if (key === "address-inline") { el.textContent = (S.address || []).join(", "); return; }
			if (key === "email-link") { el.textContent = S.email; el.href = "mailto:" + S.email; return; }
			if (map[key] !== undefined && map[key] !== "") el.textContent = map[key];
			else if (el.hasAttribute("data-hide-empty")) el.style.display = "none";
		});
		// Optional links: hide when not configured
		document.querySelectorAll("[data-link]").forEach(function (el) {
			var url = S[el.getAttribute("data-link")];
			if (url) { el.href = url; el.removeAttribute("aria-disabled"); }
			else if (el.hasAttribute("data-hide-empty")) el.style.display = "none";
			else el.setAttribute("aria-disabled", "true");
		});
		document.querySelectorAll("[data-year]").forEach(function (el) { el.textContent = new Date().getFullYear(); });
	}
	fill();

	// ---- Menu ----
	var menu = document.querySelector(".menu");
	function toggleMenu(open) {
		if (!menu) return;
		menu.classList.toggle("open", open);
		document.body.classList.toggle("locked", open);
		menu.setAttribute("aria-hidden", open ? "false" : "true");
	}
	document.querySelectorAll("[data-menu-open]").forEach(function (b) { b.addEventListener("click", function () { toggleMenu(true); }); });
	document.querySelectorAll("[data-menu-close]").forEach(function (b) { b.addEventListener("click", function () { toggleMenu(false); }); });
	if (menu) menu.querySelectorAll("nav a").forEach(function (a) { a.addEventListener("click", function () { toggleMenu(false); }); });
	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape") { toggleMenu(false); closeLightbox(); }
	});

	// ---- Split .lines text into animated rows ----
	document.querySelectorAll(".lines").forEach(function (el) {
		var rows = el.innerHTML.split(/<br\s*\/?>/i);
		el.innerHTML = rows.map(function (r) { return "<span><span>" + r.trim() + "</span></span>"; }).join("");
	});

	// ---- Reveal on scroll ----
	var targets = document.querySelectorAll(".reveal, .lines, .film");
	if ("IntersectionObserver" in window) {
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (e) {
				if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
			});
		}, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
		targets.forEach(function (t) { io.observe(t); });
	} else {
		targets.forEach(function (t) { t.classList.add("in"); });
	}

	// ---- Intro loader (home page; once per browser session) ----
	var loader = document.querySelector(".loader");
	if (loader) {
		var seen = false;
		try { seen = sessionStorage.getItem("ohno-intro") === "1"; } catch (e) {}
		var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		if (seen || reduce) {
			loader.classList.add("gone");
		} else {
			document.body.classList.add("locked");
			var words = loader.querySelectorAll(".loader-word");
			var title = loader.querySelector(".loader-title");
			var t = 150;
			words.forEach(function (w, i) {
				setTimeout(function () {
					words.forEach(function (o) { o.classList.remove("on"); });
					w.classList.add("on");
				}, t + i * 380);
			});
			t += words.length * 380;
			setTimeout(function () {
				words.forEach(function (o) { o.classList.remove("on"); });
				title.classList.add("on");
				title.querySelectorAll(".spaced span").forEach(function (s, i) { s.style.transitionDelay = (i * 0.06) + "s"; });
			}, t);
			setTimeout(function () { loader.classList.add("done"); document.body.classList.remove("locked"); }, t + 1500);
			setTimeout(function () { loader.classList.add("gone"); }, t + 2500);
			try { sessionStorage.setItem("ohno-intro", "1"); } catch (e) {}
		}
	}

	// ---- Gallery lightbox ----
	var lb = document.querySelector(".lightbox");
	function closeLightbox() { if (lb) lb.classList.remove("open"); }
	if (lb) {
		var lbImg = lb.querySelector("img");
		document.querySelectorAll("[data-zoom]").forEach(function (el) {
			el.addEventListener("click", function () {
				var img = el.querySelector("img");
				lbImg.src = img.src; lbImg.alt = img.alt;
				lb.classList.add("open");
			});
		});
		lb.addEventListener("click", closeLightbox);
	}

	// ---- Contact form ----
	var form = document.getElementById("contact-form");
	if (form) {
		var status = form.querySelector(".form-status");
		form.addEventListener("submit", function (e) {
			e.preventDefault();
			if (form.querySelector(".hp input").value) return; // bot
			var data = {
				name: form.name.value.trim(),
				email: form.email.value.trim(),
				topic: form.topic.value,
				message: form.message.value.trim()
			};
			status.className = "form-status";
			if (!S.formspreeId) {
				// No form service configured: open the visitor's mail app.
				var body = data.message + "\n\n— " + data.name + " (" + data.email + ")";
				window.location.href = "mailto:" + S.email +
					"?subject=" + encodeURIComponent("[" + data.topic + "] Message from " + data.name) +
					"&body=" + encodeURIComponent(body);
				status.textContent = "Opening your e-mail app… If nothing happens, write to " + S.email + ".";
				return;
			}
			var btn = form.querySelector("button[type=submit]");
			btn.disabled = true;
			status.textContent = "Sending…";
			fetch("https://formspree.io/f/" + S.formspreeId, {
				method: "POST",
				headers: { "Content-Type": "application/json", "Accept": "application/json" },
				body: JSON.stringify({ name: data.name, email: data.email, _replyto: data.email, _subject: "[" + data.topic + "] " + data.name, topic: data.topic, message: data.message })
			}).then(function (r) {
				if (!r.ok) throw new Error(r.status);
				form.reset();
				status.textContent = "Thanks! Your message is on its way — we usually reply within a few days.";
				status.classList.add("ok");
			}).catch(function () {
				status.textContent = "Sorry, that didn't go through. Please e-mail us at " + S.email + ".";
				status.classList.add("err");
			}).then(function () { btn.disabled = false; });
		});
	}
})();
