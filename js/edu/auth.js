/**
 * Bursa YZGT — GitHub Auth (Device Flow) + Gist Senkron
 * Backend olmadan tarayıcıda çalışır.
 *
 * Kurulum: js/edu/config.js içinde GITHUB_CLIENT_ID tanımlanmalı
 * (GitHub → Settings → Developer settings → OAuth Apps → Device Flow aktif).
 */

const GitHubAuth = {
    TOKEN_KEY: "bursayz_gh_token_v1",
    USER_KEY: "bursayz_gh_user_v1",

    clientId() {
        return (typeof BYZ_CONFIG !== "undefined" && BYZ_CONFIG.GITHUB_CLIENT_ID) || null;
    },

    isLoggedIn() {
        return !!localStorage.getItem(this.TOKEN_KEY);
    },

    token() { return localStorage.getItem(this.TOKEN_KEY); },

    user() {
        try { return JSON.parse(localStorage.getItem(this.USER_KEY)); } catch { return null; }
    },

    async headers() {
        return {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${this.token()}`,
            "X-GitHub-Api-Version": "2022-11-28"
        };
    },

    // ---- Device Flow ----
    async login() {
        const clientId = this.clientId();
        if (!clientId) {
            alert("GitHub girişi henüz yapılandırılmadı. (GITHUB_CLIENT_ID eksik — js/edu/config.js)");
            return;
        }
        try {
            const res = await fetch("https://github.com/login/device/code", {
                method: "POST",
                headers: { "Accept": "application/json", "Content-Type": "application/json" },
                body: JSON.stringify({ client_id: clientId, scope: "gist" })
            });
            const data = await res.json();
            this._modalGoster(data);
        } catch {
            alert("GitHub'a bağlanılamadı. İnternet bağlantınızı kontrol edin.");
        }
    },

    _modalGoster(device) {
        const overlay = document.getElementById("gh-modal");
        const kodEl = document.getElementById("gh-kod");
        const linkEl = document.getElementById("gh-link");
        if (!overlay) return;
        kodEl.textContent = device.user_code;
        linkEl.href = device.verification_uri;
        overlay.classList.add("acik");

        // Polling
        const interval = Math.max((device.interval || 5), 5) * 1000;
        const expiresAt = Date.now() + (device.expires_in || 900) * 1000;
        const poll = async () => {
            if (Date.now() > expiresAt || !overlay.classList.contains("acik")) return;
            try {
                const res = await fetch("https://github.com/login/oauth/access_token", {
                    method: "POST",
                    headers: { "Accept": "application/json", "Content-Type": "application/json" },
                    body: JSON.stringify({
                        client_id: this.clientId(),
                        device_code: device.device_code,
                        grant_type: "urn:ietf:params:oauth:grant-type:device_code"
                    })
                });
                const data = await res.json();
                if (data.access_token) {
                    localStorage.setItem(this.TOKEN_KEY, data.access_token);
                    await this._kullaniciCek();
                    overlay.classList.remove("acik");
                    await this.pullProgress();
                    location.reload();
                    return;
                }
                if (data.error === "authorization_pending" || data.error === "slow_down") {
                    setTimeout(poll, interval);
                } else {
                    overlay.classList.remove("acik");
                }
            } catch {
                setTimeout(poll, interval * 2);
            }
        };
        setTimeout(poll, interval);
    },

    async _kullaniciCek() {
        try {
            const res = await fetch("https://api.github.com/user", { headers: await this.headers() });
            if (res.ok) {
                const u = await res.json();
                localStorage.setItem(this.USER_KEY, JSON.stringify({ login: u.login, avatar: u.avatar_url }));
            }
        } catch {}
    },

    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
        location.reload();
    },

    // ---- Gist Senkron ----
    async _gistBul() {
        try {
            const res = await fetch("https://api.github.com/gists", { headers: await this.headers() });
            if (!res.ok) return null;
            const gists = await res.json();
            return gists.find(g => g.files && g.files[GIST_FILENAME]) || null;
        } catch { return null; }
    },

    // Yerel ilerlemeyi Gist'e yaz
    async syncProgress() {
        if (!this.isLoggedIn()) return;
        const icerik = JSON.stringify(Progress.data, null, 2);
        const mevcut = await this._gistBul();
        try {
            if (mevcut) {
                await fetch(`https://api.github.com/gists/${mevcut.id}`, {
                    method: "PATCH",
                    headers: await this.headers(),
                    body: JSON.stringify({ files: { [GIST_FILENAME]: { content: icerik } } })
                });
            } else {
                await fetch("https://api.github.com/gists", {
                    method: "POST",
                    headers: await this.headers(),
                    body: JSON.stringify({
                        description: "Bursa Yapay Zeka Geliştiricileri Topluluğu — eğitim ilerleme verisi",
                        public: false,
                        files: { [GIST_FILENAME]: { content: icerik } }
                    })
                });
            }
        } catch {}
    },

    // Gist'teki ilerlemeyi çek ve birleştir
    async pullProgress() {
        if (!this.isLoggedIn()) return false;
        const gist = await this._gistBul();
        if (!gist) return false;
        try {
            const res = await fetch(gist.files[GIST_FILENAME].raw_url);
            if (!res.ok) return false;
            const remote = await res.json();
            Progress.merge(remote);
            return true;
        } catch { return false; }
    },

    authButonuRender(containerId) {
        const el = document.getElementById(containerId);
        if (!el) return;
        if (this.isLoggedIn()) {
            const u = this.user();
            el.innerHTML = `
                <button class="github-auth-btn" id="gh-logout-btn" title="Çıkış yap (@${u ? u.login : "github"})">
                    ${u && u.avatar ? `<img class="avatar" src="${u.avatar}" alt="">` : ""}
                    <span>@${u ? u.login : "github"} · Çıkış</span>
                </button>`;
            el.querySelector("#gh-logout-btn").addEventListener("click", () => {
                if (confirm("GitHub bağlantısını kaldırmak istiyor musunuz? Yerel ilerlemeniz korunur.")) this.logout();
            });
        } else {
            el.innerHTML = `
                <button class="github-auth-btn" id="gh-login-btn" title="İlerlemenizi cihazlar arasında senkronlayın">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                    <span>GitHub ile Giriş</span>
                </button>`;
            el.querySelector("#gh-login-btn").addEventListener("click", () => this.login());
        }
    }
};

// Modal HTML üretici — sayfaya eklemek için
function githubModalHTML() {
    return `
    <div class="edu-modal-overlay" id="gh-modal">
        <div class="edu-modal">
            <h3>GitHub ile Giriş</h3>
            <p>Aşağıdaki kodu GitHub'a girin. İlerlemeniz sizin hesabınızda gizli bir Gist'e kaydedilir.</p>
            <div class="cihaz-kod" id="gh-kod">...</div>
            <p style="font-size:0.8rem">Bu pencere onayladığınızda otomatik kapanır.</p>
            <div class="modal-actions">
                <a class="modal-btn btn-birincil" id="gh-link" href="https://github.com/login/device" target="_blank" rel="noopener">GitHub'da Onayla →</a>
                <button class="btn-kapat" onclick="document.getElementById('gh-modal').classList.remove('acik')">Vazgeç</button>
            </div>
        </div>
    </div>`;
}
