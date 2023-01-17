"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __asyncValues =
  (this && this.__asyncValues) ||
  function (o) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator],
      i;
    return m
      ? m.call(o)
      : ((o =
          typeof __values === "function" ? __values(o) : o[Symbol.iterator]()),
        (i = {}),
        verb("next"),
        verb("throw"),
        verb("return"),
        (i[Symbol.asyncIterator] = function () {
          return this;
        }),
        i);
    function verb(n) {
      i[n] =
        o[n] &&
        function (v) {
          return new Promise(function (resolve, reject) {
            (v = o[n](v)), settle(resolve, reject, v.done, v.value);
          });
        };
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function (v) {
        resolve({ value: v, done: d });
      }, reject);
    }
  };
var __await =
  (this && this.__await) ||
  function (v) {
    return this instanceof __await ? ((this.v = v), this) : new __await(v);
  };
var __asyncGenerator =
  (this && this.__asyncGenerator) ||
  function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []),
      i,
      q = [];
    return (
      (i = {}),
      verb("next"),
      verb("throw"),
      verb("return"),
      (i[Symbol.asyncIterator] = function () {
        return this;
      }),
      i
    );
    function verb(n) {
      if (g[n])
        i[n] = function (v) {
          return new Promise(function (a, b) {
            q.push([n, v, a, b]) > 1 || resume(n, v);
          });
        };
    }
    function resume(n, v) {
      try {
        step(g[n](v));
      } catch (e) {
        settle(q[0][3], e);
      }
    }
    function step(r) {
      r.value instanceof __await
        ? Promise.resolve(r.value.v).then(fulfill, reject)
        : settle(q[0][2], r);
    }
    function fulfill(value) {
      resume("next", value);
    }
    function reject(value) {
      resume("throw", value);
    }
    function settle(f, v) {
      if ((f(v), q.shift(), q.length)) resume(q[0][0], q[0][1]);
    }
  };
const mod = (() => {
  const i18nPage = "MOD_MANAGER";
  const creatorToolkitId = 2419237;
  let ModdingStatus;
  (function (ModdingStatus) {
    ModdingStatus[(ModdingStatus["Enabled"] = 0)] = "Enabled";
    ModdingStatus[(ModdingStatus["Disabled"] = 1)] = "Disabled";
    ModdingStatus[(ModdingStatus["Hidden"] = 2)] = "Hidden";
  })(ModdingStatus || (ModdingStatus = {}));
  let ModdingMode;
  (function (ModdingMode) {
    ModdingMode[(ModdingMode["Full"] = 0)] = "Full";
    ModdingMode[(ModdingMode["Local"] = 1)] = "Local";
  })(ModdingMode || (ModdingMode = {}));
  let SortOption;
  (function (SortOption) {
    SortOption["Trending"] = "-popular";
    SortOption["MostPopular"] = "downloads";
    SortOption["Rating"] = "rating";
    SortOption["Subscribers"] = "subscribers";
    SortOption["Newest"] = "-date_live";
    SortOption["LastUpdated"] = "-date_updated";
    SortOption["Alphabetical"] = "name";
  })(SortOption || (SortOption = {}));
  const io = (() => {
    const gameId = 2869;
    const baseUrl = "https://api.mod.io/v1";
    const gameUrl = `${baseUrl}/games/${gameId}`;
    const gameProfileUrl = "https://mod.io/g/melvoridle";
    const apiKey = "18d577bc8c3b77469850cf15d56cc97d";
    const platform = isSteam()
      ? "Steam"
      : isIOS()
      ? "iOS"
      : isAndroid()
      ? "Android"
      : "Browser";
    const reportUrl = (id) => `https://mod.io/report/mods/${id}/widget`;
    const pageSize = 12;
    const events = mitt();
    let accessToken = null;
    function setToken(token) {
      accessToken = token;
    }
    function isTokenValid(token) {
      if (!token) token = accessToken;
      if (!token) return false;
      return Date.now() / 1000 < token.date_expires;
    }
    function ensureUserIsAuthenticated() {
      if (!accessToken)
        throw new Error("You must be logged in to perform this action.");
      if (!isTokenValid()) {
        events.emit("unauthorized");
        throw new Error(
          "Your session has expired. Please log back in and try again."
        );
      }
    }
    function sendSecurityCode(email) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!email)
          throw new Error("An email address is required to authenticate.");
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        try {
          const res = yield fetch(`${baseUrl}/oauth/emailrequest`, {
            method: "POST",
            body: new URLSearchParams({ api_key: apiKey, email: email || "" }),
            headers: new Headers({
              "Content-Type": "application/x-www-form-urlencoded",
            }),
            signal: controller.signal,
          });
          clearTimeout(timeout);
          if (res.ok) return;
          const data = yield res.json();
          if (data.error.errors && data.error.errors.email)
            throw new Error(data.error.errors.email);
          throw new Error(data.error.message);
        } catch (_a) {
          throw new Error("mod.io failed to respond");
        }
      });
    }
    function getOAuthToken(securityCode) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!securityCode || securityCode.length !== 5)
          throw new Error("A valid security code is required to authenticate.");
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        try {
          const res = yield fetch(`${baseUrl}/oauth/emailexchange`, {
            method: "POST",
            body: new URLSearchParams({
              api_key: apiKey,
              security_code: securityCode || "",
            }),
            headers: new Headers({
              "Content-Type": "application/x-www-form-urlencoded",
            }),
            signal: controller.signal,
          });
          clearTimeout(timeout);
          const { access_token, date_expires, error } = yield res.json();
          if (error) {
            if (error.errors && error.errors.security_code)
              throw new Error(error.errors.security_code);
            throw new Error(error.message);
          }
          accessToken = { access_token, date_expires };
          return accessToken;
        } catch (_a) {
          throw new Error("mod.io failed to respond");
        }
      });
    }
    function authenticatedReq(method, endpoint, data) {
      return __awaiter(this, void 0, void 0, function* () {
        ensureUserIsAuthenticated();
        const controller = new AbortController();
        const headers = new Headers({
          Authorization: `Bearer ${accessToken.access_token}`,
        });
        const reqBaseUrl =
          endpoint === "me" || endpoint.startsWith("me/") ? baseUrl : gameUrl;
        const reqUrl = new URL(`${reqBaseUrl}/${endpoint}`);
        const reqInit = { method, headers, signal: controller.signal };
        if (method === "GET") {
          if (!data) data = {};
          data.t = Date.now().toString();
          reqUrl.search = new URLSearchParams(data).toString();
        } else if (data) {
          headers.append("Content-Type", "application/x-www-form-urlencoded");
          reqInit.body = new URLSearchParams(data);
        }
        const timeout = setTimeout(() => controller.abort(), 90000);
        try {
          const res = yield fetch(reqUrl, reqInit);
          clearTimeout(timeout);
          if (res.status === 401) {
            events.emit("unauthorized");
          }
          if (res.status > 299) {
            let error;
            try {
              error = yield res.json();
            } catch (_a) {
              throw new Error("mod.io failed to respond.");
            }
            if (error && error.message) throw new Error(error.message);
            throw new Error("mod.io failed to respond.");
          }
          try {
            return yield res.json();
          } catch (_b) {
            return;
          }
        } catch (e) {
          throw new Error("mod.io failed to respond");
        }
      });
    }
    function authenticatedBinaryPost(endpoint, data) {
      return __awaiter(this, void 0, void 0, function* () {
        ensureUserIsAuthenticated();
        const controller = new AbortController();
        const headers = new Headers({
          Authorization: `Bearer ${accessToken.access_token}`,
        });
        const reqBaseUrl =
          endpoint === "me" || endpoint.startsWith("me/") ? baseUrl : gameUrl;
        const reqUrl = new URL(`${reqBaseUrl}/${endpoint}`);
        const formData = new FormData();
        for (const name in data) {
          formData.append(name, data[name]);
        }
        const reqInit = {
          method: "POST",
          headers,
          signal: controller.signal,
          body: formData,
        };
        const timeout = setTimeout(() => controller.abort(), 90000);
        try {
          const res = yield fetch(reqUrl, reqInit);
          clearTimeout(timeout);
          if (res.status === 401) {
            events.emit("unauthorized");
          }
          if (res.status > 299) {
            let error;
            try {
              error = yield res.json();
            } catch (_a) {
              throw new Error("mod.io failed to respond.");
            }
            if (error && error.message) throw new Error(error.message);
            throw new Error("mod.io failed to respond.");
          }
          try {
            return yield res.json();
          } catch (_b) {
            return;
          }
        } catch (e) {
          throw new Error("mod.io failed to respond");
        }
      });
    }
    function getGame() {
      return __awaiter(this, void 0, void 0, function* () {
        return yield authenticatedReq("GET", "");
      });
    }
    function getUser() {
      return __awaiter(this, void 0, void 0, function* () {
        return yield authenticatedReq("GET", "me");
      });
    }
    function getUserMods() {
      return __awaiter(this, void 0, void 0, function* () {
        const limit = 100;
        let offset = 0;
        const userMods = [];
        while (offset >= 0 && offset <= 1337) {
          const params = {
            game_id: gameId.toString(),
            tags: platform,
            _limit: limit.toString(),
            _offset: offset.toString(),
          };
          if (!cloudManager.hasTotHEntitlement) {
            params["tags-not-in"] = "Throne of the Herald";
          }
          const res = yield authenticatedReq("GET", "me/mods", params);
          userMods.push(...res.data);
          const end =
            res.result_count !== res.result_limit ||
            res.result_total === res.result_limit + res.result_offset;
          if (end) offset = -1;
          else offset += limit;
        }
        return userMods;
      });
    }
    function getPagedUserMods(sort, pagination, search, tags) {
      return __awaiter(this, void 0, void 0, function* () {
        const params = {
          game_id: gameId.toString(),
          _sort: sort,
          _limit: pagination.pageSize.toString(),
          _offset: ((pagination.page - 1) * pagination.pageSize).toString(),
          tags: `${platform}${tags ? "," + tags.join(",") : ""}`,
        };
        if (search) params["name-lk"] = `*${search}*`;
        return yield authenticatedReq("GET", "me/mods", params);
      });
    }
    function isLoggedIn() {
      return isTokenValid();
    }
    function getAllMods(sort, pagination, search, tags) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!Object.values(SortOption).includes(sort))
          throw new Error("A valid sort option is required.");
        if (!pagination) throw new Error("Pagination details are required.");
        if (isNaN(pagination.page) || pagination.page < 0)
          throw new Error("A valid page is required.");
        if (isNaN(pagination.pageSize) || pagination.pageSize <= 0)
          throw new Error("A valid page size is required.");
        const params = {
          _sort: sort,
          _limit: pagination.pageSize.toString(),
          _offset: ((pagination.page - 1) * pagination.pageSize).toString(),
          tags: `${platform}${tags ? "," + tags.join(",") : ""}`,
        };
        if (!cloudManager.hasTotHEntitlement) {
          params["tags-not-in"] = "Throne of the Herald";
        }
        if (search) {
          if (search.startsWith("id:")) {
            const ids = search.slice(3);
            params["id-in"] = ids;
          } else {
            params["name-lk"] = `*${search}*`;
          }
        }
        return yield authenticatedReq("GET", "mods", params);
      });
    }
    function getMod(id) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!id || isNaN(id))
          throw new Error(
            "A valid mod ID is required to retrieve a mod's details."
          );
        return yield authenticatedReq("GET", `mods/${id}`);
      });
    }
    function getLatestModfile(id) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!id || isNaN(id))
          throw new Error(
            "A valid mod ID is required to retrieve a mod's details."
          );
        return (yield authenticatedReq("GET", `mods/${id}/files`, {
          _sort: "-id",
          _limit: "1",
        })).data[0];
      });
    }
    function getSubscribed() {
      return __awaiter(this, void 0, void 0, function* () {
        const limit = 100;
        let offset = 0;
        const subscribed = [];
        while (offset >= 0 && offset <= 1337) {
          const params = {
            game_id: gameId.toString(),
            tags: platform,
            _limit: limit.toString(),
            _offset: offset.toString(),
          };
          if (!cloudManager.hasTotHEntitlement) {
            params["tags-not-in"] = "Throne of the Herald";
          }
          const res = yield authenticatedReq("GET", "me/subscribed", params);
          subscribed.push(...res.data);
          const end =
            res.result_count !== res.result_limit ||
            res.result_total === res.result_limit + res.result_offset;
          if (end) offset = -1;
          else offset += limit;
        }
        return subscribed;
      });
    }
    function getDependencies(id) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!id || isNaN(id))
          throw new Error(
            "A valid mod ID is required to retrieve a mod's dependencies."
          );
        return (yield authenticatedReq("GET", `mods/${id}/dependencies`)).data;
      });
    }
    function subscribeTo(id) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!id || isNaN(id))
          throw new Error("A valid mod ID is required to subscribe to a mod.");
        return yield authenticatedReq("POST", `mods/${id}/subscribe`, {});
      });
    }
    function unsubscribeFrom(id) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!id || isNaN(id))
          throw new Error(
            "A valid mod ID is required to unsubscribe from a mod."
          );
        yield authenticatedReq("DELETE", `mods/${id}/subscribe`, {});
      });
    }
    function getStats(id) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!id || isNaN(id))
          throw new Error(
            "A valid mod ID is required to unsubscribe from a mod."
          );
        return yield authenticatedReq("GET", `mods/${id}/stats`);
      });
    }
    function getRatings() {
      return __awaiter(this, void 0, void 0, function* () {
        const limit = 100;
        let offset = 0;
        const ratings = [];
        while (offset >= 0 && offset <= 1337) {
          const res = yield authenticatedReq("GET", "me/ratings", {
            game_id: gameId.toString(),
            tags: platform,
            _limit: limit.toString(),
            _offset: offset.toString(),
          });
          ratings.push(...res.data);
          const end =
            res.result_count !== res.result_limit ||
            res.result_total === res.result_limit + res.result_offset;
          if (end) offset = -1;
          else offset += limit;
        }
        return ratings;
      });
    }
    function download(modfile, onProgress) {
      var e_1, _a;
      return __awaiter(this, void 0, void 0, function* () {
        if (!modfile) throw new Error("A valid modfile object is required.");
        const reqUrl = new URL(modfile.download.binary_url);
        reqUrl.search = new URLSearchParams({
          t: Date.now().toString(),
        }).toString();
        const res = yield fetch(reqUrl);
        if (!res.body) throw new Error("No such download.");
        const chunks = [];
        let downloadSize = 0;
        const startTime = performance.now();
        let intervalStart = startTime - 251;
        try {
          for (
            var _b = __asyncValues(downloadStreamIterable(res.body)), _c;
            (_c = yield _b.next()), !_c.done;

          ) {
            const chunk = _c.value;
            if (onProgress) {
              const timeNow = performance.now();
              const elapsedTime = timeNow - startTime + 1;
              const intervalTime = timeNow - intervalStart;
              downloadSize += chunk.length;
              if (intervalTime > 250) {
                intervalStart = timeNow;
                onProgress(
                  downloadSize,
                  modfile.filesize,
                  (downloadSize / elapsedTime) * 1000
                );
              }
            }
            chunks.push(chunk);
          }
        } catch (e_1_1) {
          e_1 = { error: e_1_1 };
        } finally {
          try {
            if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
          } finally {
            if (e_1) throw e_1.error;
          }
        }
        const blob = new Blob(chunks);
        if (blob.size !== modfile.filesize)
          throw new Error(
            "An error occurred when downloading the mod. Please try again."
          );
        return blob;
      });
    }
    function downloadStreamIterable(downloadStream) {
      return __asyncGenerator(
        this,
        arguments,
        function* downloadStreamIterable_1() {
          const reader = downloadStream.getReader();
          try {
            while (true) {
              const { done, value } = yield __await(reader.read());
              if (done) return yield __await(void 0);
              yield yield __await(value);
            }
          } finally {
            reader.releaseLock();
          }
        }
      );
    }
    function rate(id, rating) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!id || isNaN(id))
          throw new Error("A valid mod ID is required to rate a mod.");
        if (rating < -1 || rating > 1) throw new Error("Invalid rating value.");
        yield authenticatedReq("POST", `mods/${id}/ratings`, {
          rating: rating.toString(),
        });
      });
    }
    function ratePositive(id) {
      return __awaiter(this, void 0, void 0, function* () {
        yield rate(id, 1);
      });
    }
    function rateNegative(id) {
      return __awaiter(this, void 0, void 0, function* () {
        yield rate(id, -1);
      });
    }
    function removeRating(id) {
      return __awaiter(this, void 0, void 0, function* () {
        yield rate(id, 0);
      });
    }
    return {
      auth: {
        accessToken,
        setToken,
        isTokenValid,
        ensureUserIsAuthenticated,
        sendSecurityCode,
        getOAuthToken,
        authenticatedReq,
        authenticatedBinaryPost,
      },
      game: { profileUrl: gameProfileUrl, get: getGame },
      user: {
        get: getUser,
        mods: getUserMods,
        pagedMods: getPagedUserMods,
        isLoggedIn,
      },
      mods: {
        SortOption,
        pageSize,
        getAll: getAllMods,
        get: getMod,
        getLatestModfile: getLatestModfile,
        getSubscribed,
        getDependencies,
        subscribeTo,
        unsubscribeFrom,
        getStats,
        getRatings,
        download,
        ratePositive,
        rateNegative,
        removeRating,
        reportUrl: reportUrl,
      },
      on: events.on,
      off: events.off,
    };
  })();
  const parser = (() => {
    const tagOptions = new Map();
    function setupTagMap(gameData) {
      tagOptions.clear();
      for (const tagSets of gameData.tag_options) {
        const tags = new Set(tagSets.tags);
        tagOptions.set(tagSets.name, tags);
      }
    }
    function parseTags(unformattedTags) {
      if (!tagOptions.size) throw new Error("Parse has not been setup yet!");
      const tags = { platforms: [], supportedGameVersion: "", types: [] };
      for (const tag of unformattedTags) {
        if (tagOptions.get("Platform").has(tag.name)) {
          tags.platforms.push(tag.name);
          continue;
        }
        if (tagOptions.get("Supported Game Version").has(tag.name)) {
          tags.supportedGameVersion = tag.name;
          continue;
        }
        if (tagOptions.get("Type").has(tag.name)) {
          tags.types.push(tag.name);
          continue;
        }
      }
      return tags;
    }
    function parse(modIoData, modfile, file) {
      return __awaiter(this, void 0, void 0, function* () {
        let unpacked = yield unpack(file);
        const paths = Object.keys(unpacked);
        const baseDir = paths[0];
        if (paths.every((p) => p.startsWith(baseDir))) {
          paths.splice(0, 1);
          unpacked = Object.assign(
            {},
            ...paths.map((key) => ({
              [removeBaseDir(key, baseDir)]: unpacked[key],
            }))
          );
        }
        if (!unpacked["manifest.json"])
          throw new Error(
            `[${modIoData.name}] No manifest file was found. Expected a "manifest.json" to be at the root.`
          );
        let manifest;
        try {
          manifest = JSON.parse(fflate.strFromU8(unpacked["manifest.json"]));
        } catch (_a) {
          throw new Error(
            `[${modIoData.name}] The manifest is invalid and was not able to be parsed.`
          );
        }
        if (!manifest.namespace)
          console.warn(
            `[${modIoData.name}] No namespace is defined. The mod will have limited access to game APIs.`
          );
        else if (!NamespaceMap.isValidModdedName(manifest.namespace))
          throw new Error(
            `[${modIoData.name}] Namespace is invalid. Namespaces must only contain alphanumeric characters and underscores and cannot start with the word "melvor".`
          );
        else if (manifest.namespace === "dev")
          throw new Error(
            `[${modIoData.name}] Namespace is invalid. The namespace "dev" is reserved.`
          );
        if (!manifest.setup && !manifest.load)
          throw new Error(
            `[${modIoData.name}] Either a setup or load resource must be defined.`
          );
        if (manifest.setup && !isValidSetup(manifest.setup))
          throw new Error(`[${modIoData.name}] Setup resource is not valid.`);
        if (manifest.load && !isValidLoad(manifest.load))
          throw new Error(
            `[${modIoData.name}] One or more invalid resources are contained in the load list.`
          );
        if (manifest.icon && !isValidIcon(manifest.icon))
          throw new Error(`[${modIoData.name}] Icon resource is not valid.`);
        const tags = parseTags(modIoData.tags);
        if (!tags.supportedGameVersion)
          throw new Error(
            `[${modIoData.name}] Invalid supported game version.`
          );
        let dependencies = [];
        try {
          dependencies = yield io.mods.getDependencies(modIoData.id);
        } catch (e) {
          console.error(e);
          throw new Error(
            `[${modIoData.name}] Failed to get mod dependencies from mod.io.`
          );
        }
        const resources = {};
        for (const file in unpacked) {
          if (!unpacked[file].length) continue;
          let type = "";
          if (file.endsWith(".js") || file.endsWith(".mjs"))
            type = "text/javascript";
          else if (file.endsWith(".html")) type = "text/html";
          else if (file.endsWith(".svg")) type = "image/svg+xml";
          resources[file] = new Blob([unpacked[file]], { type });
        }
        return {
          id: modIoData.id,
          name: modIoData.name,
          namespace: manifest.namespace,
          version: modfile.version,
          tags,
          author: modIoData.submitted_by.username,
          description: modIoData.summary,
          icon: manifest.icon,
          setup: manifest.setup,
          load: manifest.load,
          resources,
          modioUrl: modIoData.profile_url,
          homepageUrl: modIoData.homepage_url,
          dependencies,
          installed: Math.floor(Date.now() / 1000),
          updated: modfile.date_added,
          changelog: modfile.changelog,
        };
      });
    }
    function parseLocal(name, file) {
      return __awaiter(this, void 0, void 0, function* () {
        let unpacked = yield unpack(file);
        const paths = Object.keys(unpacked);
        const baseDir = paths[0];
        if (paths.every((p) => p.startsWith(baseDir))) {
          paths.splice(0, 1);
          unpacked = Object.assign(
            {},
            ...paths.map((key) => ({
              [removeBaseDir(key, baseDir)]: unpacked[key],
            }))
          );
        }
        if (!unpacked["manifest.json"])
          throw new Error(
            `No manifest file was found. Expected a "manifest.json" to be at the root.`
          );
        let manifest;
        try {
          manifest = JSON.parse(fflate.strFromU8(unpacked["manifest.json"]));
        } catch (_a) {
          throw new Error(
            `The manifest is invalid and was not able to be parsed.`
          );
        }
        if (!manifest.namespace)
          console.warn(
            `No namespace is defined. The mod will have limited access to game APIs.`
          );
        else if (!NamespaceMap.isValidModdedName(manifest.namespace))
          throw new Error(
            `Namespace is invalid. Namespaces must only contain alphanumeric characters and underscores and cannot start with the word "melvor".`
          );
        else if (manifest.namespace === "dev")
          throw new Error(
            `Namespace is invalid. The namespace "dev" is reserved.`
          );
        if (!manifest.setup && !manifest.load)
          throw new Error(`Either a setup or load resource must be defined.`);
        if (manifest.setup && !isValidSetup(manifest.setup))
          throw new Error(`Setup resource is not valid.`);
        if (manifest.load && !isValidLoad(manifest.load))
          throw new Error(
            `One or more invalid resources are contained in the load list.`
          );
        if (manifest.icon && !isValidIcon(manifest.icon))
          throw new Error(`Icon resource is not valid.`);
        const resources = {};
        for (const file in unpacked) {
          if (!unpacked[file].length) continue;
          let type = "";
          if (file.endsWith(".js") || file.endsWith(".mjs"))
            type = "text/javascript";
          else if (file.endsWith(".html")) type = "text/html";
          else if (file.endsWith(".svg")) type = "image/svg+xml";
          resources[file] = new Blob([unpacked[file]], { type });
        }
        return {
          id: -1,
          name,
          namespace: manifest.namespace,
          version: "",
          tags: {
            supportedGameVersion: gameVersion.substring(1),
            platforms: [],
            types: [],
          },
          author: "",
          description: "",
          icon: manifest.icon,
          setup: manifest.setup,
          load: manifest.load,
          resources,
          modioUrl: "",
          homepageUrl: "",
          dependencies: [],
          installed: Math.floor(Date.now() / 1000),
          updated: 0,
          changelog: "",
        };
      });
    }
    function unpack(zip) {
      return __awaiter(this, void 0, void 0, function* () {
        const u8arr = new Uint8Array(yield zip.arrayBuffer());
        return new Promise((resolve, reject) => {
          fflate.unzip(u8arr, (err, unzipped) => {
            if (err) {
              reject(err);
              return;
            }
            resolve(unzipped);
          });
        });
      });
    }
    function removeBaseDir(path, baseDir) {
      return path.replace(baseDir, "");
    }
    function isValidSetup(setup) {
      return isScriptFile(setup) || isModuleFile(setup);
    }
    function isValidLoad(load) {
      if (typeof load === "string") return isValidLoadResource(load);
      if (!Array.isArray(load)) return false;
      return load.every((r) => isValidLoadResource(r));
    }
    function isValidLoadResource(resource) {
      return (
        isScriptFile(resource) ||
        isModuleFile(resource) ||
        isStylesheetFile(resource) ||
        isJsonFile(resource) ||
        isHTMLFile(resource)
      );
    }
    function isScriptFile(resource) {
      return typeof resource === "string" && resource.endsWith(".js");
    }
    function isModuleFile(resource) {
      return (
        typeof resource === "string" &&
        (resource.endsWith(".js") || resource.endsWith(".mjs"))
      );
    }
    function isStylesheetFile(resource) {
      return typeof resource === "string" && resource.endsWith(".css");
    }
    function isHTMLFile(resource) {
      return typeof resource === "string" && resource.endsWith(".html");
    }
    function isJsonFile(resource) {
      return typeof resource === "string" && resource.endsWith(".json");
    }
    function isValidIcon(icon) {
      return (
        typeof icon === "string" &&
        (icon.endsWith(".png") || icon.endsWith(".svg"))
      );
    }
    function setup(gameData) {
      setupTagMap(gameData);
    }
    return {
      parse,
      parseLocal,
      parseTags,
      setup,
      isScriptFile,
      isModuleFile,
      isStylesheetFile,
      isHTMLFile,
      isJsonFile,
    };
  })();
  const packager = (() => {
    let fs = null;
    let path = null;
    function zip(name, dir) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!isSteam())
          throw new Error(
            "Cannot create a zip. This functionality is only available in the Steam client."
          );
        if (!fs) fs = require("fs/promises");
        if (!path) path = require("path");
        if (!(yield ensureDirExists(dir)))
          throw new Error(`No such directory exists: "${dir}"`);
        const pkg = yield createPackage(
          name,
          yield collectFiles(dir, "", {}, yield getIgnoreSet(dir))
        );
        return pkg;
      });
    }
    const ALREADY_COMPRESSED = [
      "zip",
      "gz",
      "png",
      "jpg",
      "jpeg",
      "pdf",
      "doc",
      "docx",
      "ppt",
      "pptx",
      "xls",
      "xlsx",
      "heic",
      "heif",
      "7z",
      "bz2",
      "rar",
      "gif",
      "webp",
      "webm",
      "mp4",
      "mov",
      "mp3",
      "aifc",
    ];
    function ensureDirExists(dir) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          return (yield fs.stat(dir)).isDirectory();
        } catch (e) {
          if ("code" in e && e.code === "ENOENT") return false;
          throw e;
        }
      });
    }
    function getIgnoreSet(root) {
      return __awaiter(this, void 0, void 0, function* () {
        const rootDir = yield fs.readdir(root);
        if (!rootDir.includes(".modignore")) return [];
        const ignoreFile = yield fs.readFile(
          path.join(root, ".modignore"),
          "UTF-8"
        );
        return ignoreFile
          .split(/\r?\n/)
          .map(
            (i) =>
              new RegExp(
                `^${i
                  .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
                  .replace(/\*/g, ".*")}$`
              )
          );
      });
    }
    function collectFiles(root, dirPath = "", fileMap = {}, ignoreSet = []) {
      return __awaiter(this, void 0, void 0, function* () {
        const dir = yield fs.readdir(path.join(root, dirPath), {
          withFileTypes: true,
        });
        for (const dirent of dir) {
          if (dirent.name === ".modignore") continue;
          let ignored = false;
          for (const ignore of ignoreSet) {
            if (ignore.test(dirent.name)) {
              ignored = true;
              break;
            }
          }
          if (ignored) continue;
          if (dirent.isDirectory()) {
            yield collectFiles(
              root,
              path.join(dirPath, dirent.name),
              fileMap,
              ignoreSet
            );
            continue;
          }
          const fileBuffer = yield fs.readFile(
            path.join(root, dirPath, dirent.name)
          );
          const ext = dirent.name
            .slice(dirent.name.lastIndexOf(".") + 1)
            .toLowerCase();
          fileMap[path.join(dirPath, dirent.name)] = [
            new Uint8Array(fileBuffer.buffer),
            { level: ALREADY_COMPRESSED.indexOf(ext) === -1 ? 6 : 0 },
          ];
        }
        return fileMap;
      });
    }
    function createPackage(name, files) {
      return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res, rej) => {
          fflate.zip(files, (err, out) => {
            if (err) rej(err);
            res(
              new File(
                [out],
                `${name
                  .toLowerCase()
                  .replace(/ /g, "_")
                  .replace(/[^\w]/g, "")}.zip`,
                { type: "application/zip" }
              )
            );
          });
        });
      });
    }
    return { zip };
  })();
  const db = (() => {
    const db = new MelvorDatabase();
    function countMods() {
      return __awaiter(this, void 0, void 0, function* () {
        return yield db.mods.count();
      });
    }
    function getAllMods() {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          return yield db.mods.toArray();
        } catch (_a) {
          throw new Error(
            "There was an issue with retrieving locally-stored mods. Please reload the game and try again."
          );
        }
      });
    }
    function getMod(id) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          return yield db.mods.get(id);
        } catch (_a) {
          throw new Error(
            "There was an issue with retrieving locally-stored mods. Please reload the game and try again."
          );
        }
      });
    }
    function putMod(mod) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          yield db.mods.put(mod);
        } catch (_a) {
          throw new Error(
            "There was an issue with storing mods locally. Please reload the game and try again."
          );
        }
      });
    }
    function deleteMod(id) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          yield db.mods.delete(id);
        } catch (_a) {
          throw new Error(
            "There was an issue with deleting locally-stored mods. Please reload the game and try again."
          );
        }
      });
    }
    function deleteAllMods() {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          yield db.mods.clear();
        } catch (_a) {
          throw new Error(
            "There was an issue with deleting locally-stored mods. Please reload the game and try again."
          );
        }
      });
    }
    function deleteUnsubscribedMods(subscribedIds) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          yield db.mods.where("id").noneOf(subscribedIds).delete();
        } catch (_a) {
          throw new Error(
            "There was an issue with deleting locally-stored mods. Please reload the game and try again."
          );
        }
      });
    }
    function countLocalMods() {
      return __awaiter(this, void 0, void 0, function* () {
        return yield db.localMods.count();
      });
    }
    function getAllLocalMods() {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          return yield db.localMods.toCollection().sortBy("loadPriority");
        } catch (_a) {
          throw new Error(
            "There was an issue with retrieving locally-stored mods. Please reload the game and try again."
          );
        }
      });
    }
    function getLocalMod(id) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          return yield db.localMods.get(id);
        } catch (_a) {
          throw new Error(
            "There was an issue with retrieving locally-stored mods. Please reload the game and try again."
          );
        }
      });
    }
    function putLocalMod(mod) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          yield db.localMods.put(mod);
        } catch (_a) {
          throw new Error(
            "There was an issue with storing mods locally. Please reload the game and try again."
          );
        }
      });
    }
    function deleteLocalMod(id) {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          yield db.localMods.delete(id);
        } catch (_a) {
          throw new Error(
            "There was an issue with deleting locally-stored mods. Please reload the game and try again."
          );
        }
      });
    }
    function deleteAllLocalMods() {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          yield db.localMods.clear();
        } catch (_a) {
          throw new Error(
            "There was an issue with deleting locally-stored mods. Please reload the game and try again."
          );
        }
      });
    }
    return {
      mods: {
        count: countMods,
        getAll: getAllMods,
        get: getMod,
        put: putMod,
        delete: deleteMod,
        deleteAll: deleteAllMods,
        deleteUnsubscribed: deleteUnsubscribedMods,
      },
      localMods: {
        count: countLocalMods,
        getAll: getAllLocalMods,
        get: getLocalMod,
        put: putLocalMod,
        delete: deleteLocalMod,
        deleteAll: deleteAllLocalMods,
      },
    };
  })();
  const loader = (() => {
    const resourceUrls = new Map();
    function getModFromResourceUrl(url) {
      if (!url) return;
      for (const [mod, resources] of resourceUrls) {
        for (const [resource, resourceUrl] of resources) {
          if (resourceUrl === url) return mod;
        }
      }
      return;
    }
    function load(mods) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!Array.isArray(mods)) {
          yield loadMod(mods);
          return;
        }
        for (const mod of mods) {
          try {
            yield loadMod(mod);
          } catch (e) {
            console.error(`[${mod.name}]`, e);
          }
        }
      });
    }
    function loadMod(mod) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!mod)
          throw new Error('Argument "mod" cannot be null or undefined.');
        if (mod.id === creatorToolkitId) {
        }
        if (typeof mod.setup === "string") yield loadSetup(mod, mod.setup);
        if (typeof mod.load === "string") yield loadResource(mod, mod.load);
        else if (Array.isArray(mod.load)) {
          for (const resource of mod.load) {
            if (typeof resource === "string") yield loadResource(mod, resource);
          }
        }
      });
    }
    function loadSetup(mod, resource) {
      return __awaiter(this, void 0, void 0, function* () {
        const module = yield loadModule(mod, resource);
        if (typeof module.setup !== "function")
          throw new Error(
            `[${mod.name}] Setup resource "${resource}" does not export a valid named function "setup".`
          );
        yield contextApi.runSetup(mod, module.setup);
      });
    }
    function loadResource(mod, resource) {
      return __awaiter(this, void 0, void 0, function* () {
        if (parser.isScriptFile(resource))
          return yield loadScript(mod, resource);
        else if (parser.isModuleFile(resource))
          return yield loadModule(mod, resource);
        else if (parser.isStylesheetFile(resource))
          return loadStylesheet(mod, resource);
        else if (parser.isHTMLFile(resource))
          return yield loadTemplates(mod, resource);
        else if (parser.isJsonFile(resource))
          return yield loadGameData(mod, resource);
        throw new Error(
          `Mod "${mod.name}" resource "${resource}" is invalid and cannot be loaded.`
        );
      });
    }
    function loadScript(mod, resource) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!parser.isScriptFile(resource))
          throw new Error(
            `[${mod.name}] Cannot load resource "${resource}" as a script. Expected file type ".js".`
          );
        return new Promise((res, rej) => {
          const scriptEl = document.createElement("script");
          scriptEl.type = "text/javascript";
          scriptEl.src = getResourceUrl(mod, resource);
          scriptEl.onload = () => res();
          scriptEl.onerror = () =>
            rej(`[${mod.name}] Error loading resource "${resource}".`);
          document.body.appendChild(scriptEl);
        });
      });
    }
    function loadModule(mod, resource) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!parser.isModuleFile(resource))
          throw new Error(
            `[${mod.name}] Cannot load resource "${resource}" as a module. Expected file type ".mjs" or ".js".`
          );
        return yield import(getResourceUrl(mod, resource));
      });
    }
    function loadStylesheet(mod, resource) {
      if (!parser.isStylesheetFile(resource))
        throw new Error(
          `[${mod.name}] Cannot load resource "${resource}" as a stylesheet. Expected file type ".css".`
        );
      const styleEl = document.createElement("link");
      styleEl.href = getResourceUrl(mod, resource);
      styleEl.rel = "stylesheet";
      document.head.appendChild(styleEl);
    }
    function loadTemplates(mod, resource) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!parser.isHTMLFile(resource))
          throw new Error(
            `[${mod.name}] Cannot load resource "${resource}" as a template file. Expected file type ".html".`
          );
        const url = getResourceUrl(mod, resource);
        return new Promise((res, rej) => {
          const req = new XMLHttpRequest();
          req.open("GET", url, true);
          req.responseType = "document";
          req.onload = () => {
            req.response.querySelectorAll("template").forEach((el) => {
              document.body.append(el.cloneNode(true));
            });
            res();
          };
          req.onerror = () => {
            rej(`[${mod.name}] Templates failed to load.`);
          };
          req.send();
        });
      });
    }
    function loadJson(mod, resource) {
      return __awaiter(this, void 0, void 0, function* () {
        resource = ensureResourceExists(mod, resource);
        if (!parser.isJsonFile(resource))
          throw new Error(
            `[${mod.name}] Cannot load resource "${resource}" as JSON data. Expected file type ".json".`
          );
        return JSON.parse(yield mod.resources[resource].text());
      });
    }
    function loadGameData(mod, resource) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!mod.namespace)
          throw new Error(
            `[${mod.name}] Cannot load game data "${resource}". No namespace was defined in the mod's manifest.json.`
          );
        const data = yield loadJson(mod, resource);
        const ns = game.registeredNamespaces.getNamespace(mod.namespace);
        data.namespace = ns.name;
        try {
          game.registerDataPackage(data);
        } catch (e) {
          throw new Error(
            `[${mod.name}] ${e instanceof Error ? e.message : e}`
          );
        }
      });
    }
    function ensureResourceExists(mod, resource) {
      if (mod.resources[resource]) return resource;
      const backslashResource = resource.replace(/\//g, "\\");
      if (mod.resources[backslashResource]) return backslashResource;
      const forwardslashResource = resource.replace(/\\/g, "/");
      if (mod.resources[forwardslashResource]) return forwardslashResource;
      throw new Error(`[${mod.name}] Could not find resource "${resource}".`);
    }
    function getResourceUrl(mod, resource) {
      if (resource.startsWith("melvor:")) {
        return cdnMedia(resource.substring(7));
      } else if (
        resource.startsWith("http:") ||
        resource.startsWith("https:")
      ) {
        return resource;
      } else if (resource.includes(":")) {
        const namespace = resource.split(":")[0];
        if (game.registeredNamespaces.hasNamespace(namespace)) {
          const asset = resource.substring(resource.indexOf(":") + 1);
          if (mod.namespace === namespace) return getResourceUrl(mod, asset);
          if (!assetSharingContextApi.isShared(namespace, asset))
            throw new Error(
              `[${mod.name}] The asset "${resource}" has not been shared.`
            );
          const sharingMod = store.state.loaded.find(
            (m) => m.namespace === namespace
          );
          if (sharingMod) return getResourceUrl(sharingMod, asset);
        }
      }
      resource = ensureResourceExists(mod, resource);
      if (!resourceUrls.has(mod)) resourceUrls.set(mod, new Map());
      const urls = resourceUrls.get(mod);
      if (!urls.has(resource)) {
        const url = URL.createObjectURL(mod.resources[resource]);
        urls.set(resource, url);
      }
      return urls.get(resource);
    }
    return {
      load,
      loadScript,
      loadModule,
      loadStylesheet,
      loadTemplates,
      loadJson,
      getModFromResourceUrl,
      getResourceUrl,
    };
  })();
  const bus = (() => {
    const eventMap = new Map();
    const source = {
      USER: "user",
      INSTALLED_MODS: "myMods",
      LOAD_ORDER: "loadOrder",
      DISABLED_MODS: "disabledMods",
      SUBSCRIBE_QUEUE: "subscribeQueue",
      UNSUBSCRIBE_QUEUE: "unsubscribeQueue",
      DOWNLOAD_QUEUE: "downloadQueue",
      INSTALL_QUEUE: "installQueue",
      UNINSTALL_QUEUE: "uninstallQueue",
      MOD: (id) => `mod_${id}`,
    };
    const event = {
      SIGN_IN: "signIn",
      SIGN_OUT: "signOut",
      QUEUED: "queued",
      BEGIN: "begin",
      PROGRESS: "progress",
      COMPLETE: "complete",
      ERROR: "error",
      CHANGE: "change",
      ENABLED: "enabled",
      DISABLED: "disabled",
      REFRESH: "refresh",
      DOWNLOAD_QUEUED: "downloadQueued",
      DOWNLOAD_BEGIN: "downloadBegin",
      DOWNLOAD_COMPLETE: "downloadComplete",
      INSTALL_QUEUED: "installQueued",
      INSTALL_BEGIN: "installBegin",
      INSTALL_COMPLETE: "installComplete",
      UNINSTALL_QUEUED: "uninstallQueued",
      UNINSTALL_BEGIN: "uninstallBegin",
      UNINSTALL_COMPLETE: "uninstallComplete",
    };
    function on(source, event, cb) {
      const emitEvent = `${source}:${event}`;
      if (!eventMap.has(emitEvent)) eventMap.set(emitEvent, []);
      eventMap.get(emitEvent).push(cb);
    }
    function off(source, event, cb) {
      const emitEvent = `${source}:${event}`;
      if (!eventMap.has(emitEvent)) return;
      if (!cb) {
        eventMap.delete(emitEvent);
        return;
      }
      const cbs = eventMap.get(emitEvent);
      const i = cbs.indexOf(cb);
      if (i === -1) return;
      cbs.splice(i, 1);
    }
    function fire(source, event, e) {
      const emitEvent = `${source}:${event}`;
      if (!eventMap.has(emitEvent)) return;
      for (const cb of [...eventMap.get(emitEvent)]) cb(e);
    }
    return { on, off, fire, source, event };
  })();
  const loginStore = (() => {
    const events = mitt();
    const state = { email: "", sessionRestored: false };
    const getters = {
      isLoggedIn() {
        return io.auth.isTokenValid();
      },
    };
    const actions = {
      restoreSession() {
        return __awaiter(this, void 0, void 0, function* () {
          yield tryGetPlayFabData();
          tryGetLocalData();
        });
      },
      sendSecurityCode(email) {
        return __awaiter(this, void 0, void 0, function* () {
          state.email = email;
          yield io.auth.sendSecurityCode(email);
          localStorage.setItem("modioEmail", email);
          playFabStoreData("modioEmail", email);
        });
      },
      loginUsingSecurityCode(code) {
        return __awaiter(this, void 0, void 0, function* () {
          const token = yield io.auth.getOAuthToken(code);
          actions.login(token);
        });
      },
      login(token) {
        if (!io.auth.isTokenValid(token)) return;
        io.auth.setToken(token);
        const serializedToken = JSON.stringify(token);
        localStorage.setItem("modioToken", serializedToken);
        playFabStoreData("modioToken", serializedToken);
        events.emit("login");
      },
      logout() {
        io.auth.setToken(null);
        localStorage.removeItem("modioToken");
        playFabStoreData("modioToken", null);
        events.emit("logout");
      },
    };
    function tryGetPlayFabData() {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          const { modioEmail, modioToken } = yield playFabManager.retrieve([
            "modioEmail",
            "modioToken",
          ]);
          if (modioEmail) state.email = modioEmail;
          if (modioToken) {
            state.sessionRestored = true;
            const token = JSON.parse(modioToken);
            actions.login(token);
          }
        } catch (_a) {}
      });
    }
    function tryGetLocalData() {
      if (!state.email) {
        state.email =
          localStorage.getItem("modioEmail") || storedCloudSaves[6] || "";
      }
      if (!io.auth.isTokenValid()) {
        const modioToken = localStorage.getItem("modioToken");
        if (modioToken) {
          state.sessionRestored = true;
          const token = JSON.parse(modioToken);
          io.auth.setToken(token);
        }
      }
    }
    return { state, getters, actions, on: events.on, off: events.off };
  })();
  const store = (() => {
    const events = mitt();
    const state = {
      mode: ModdingMode.Full,
      userData: null,
      gameData: null,
      moddingStatus: ModdingStatus.Disabled,
      setup: false,
      fullModeSetup: false,
      localModeSetup: false,
      creatorToolkitLoaded: false,
      devMods: new Set(),
      preferLatestMods: new Map(),
      subscriptions: new Set(),
      loadOrder: [],
      installed: [],
      loaded: [],
      disabled: new Set(),
      disableAll: false,
      ratings: new Map(),
      dependencyPrompts: [],
      dependencyPromptOpen: false,
      autoDownload: !localStorage.getItem("mm__stop-auto-download"),
      initialOpenSetup: false,
    };
    const getters = {
      hasLocalMods() {
        return __awaiter(this, void 0, void 0, function* () {
          return (yield db.mods.count()) > 0;
        });
      },
      usingLocalMode() {
        return state.mode === ModdingMode.Local;
      },
      isLoggedIn() {
        return io.auth.isTokenValid();
      },
      mod(id) {
        return __awaiter(this, void 0, void 0, function* () {
          if (getters.usingLocalMode()) return null;
          const cachedMod = getCachedBrowserGetModResponse(id);
          if (cachedMod) return cachedMod;
          try {
            const mod = yield io.mods.get(id);
            return cacheBrowserGetModResponse(mod);
          } catch (e) {
            console.error(`Unable to retrieve mod by id ${id}`, e);
            return null;
          }
        });
      },
      mods(sort, pageParams, search, tags) {
        return __awaiter(this, void 0, void 0, function* () {
          if (getters.usingLocalMode())
            return {
              data: [],
              result_count: 0,
              result_limit: 0,
              result_offset: 0,
              result_total: 0,
            };
          const cachedRes = getCachedBrowserGetModsResponse(
            sort,
            pageParams,
            search,
            tags
          );
          if (cachedRes) return cachedRes;
          try {
            const res = (
              tags === null || tags === void 0
                ? void 0
                : tags.includes("onDevTeam")
            )
              ? yield io.user.pagedMods(
                  sort,
                  pageParams,
                  search,
                  tags === null || tags === void 0
                    ? void 0
                    : tags.filter((t) => t !== "onDevTeam")
                )
              : yield io.mods.getAll(sort, pageParams, search, tags);
            return cacheBrowserGetModsResponse(
              sort,
              pageParams,
              search,
              tags,
              res
            );
          } catch (e) {
            console.error("Error while fetching mods from mod.io:", e);
            return {
              data: [],
              result_count: 0,
              result_total: 0,
              result_limit: 0,
              result_offset: 0,
            };
          }
        });
      },
      rating(id) {
        if (!id || !state.ratings.has(id)) return 0;
        return state.ratings.get(id);
      },
      isModDev(id) {
        if (!id) return false;
        return state.devMods.has(id);
      },
      isLatestPreferred(id) {
        if (!id) return false;
        return state.preferLatestMods.has(id);
      },
      isSubscribed(id) {
        if (!id) return false;
        return state.subscriptions.has(id);
      },
      isInstalled(id) {
        return state.installed.some((m) => m.id === id);
      },
      isDisabled(id) {
        if (!id) return false;
        return state.disableAll || state.disabled.has(id);
      },
      beingSubscribed() {
        return subscribeQueue.items();
      },
      beingUnsubscribed() {
        return unsubscribeQueue.items();
      },
      beingDownloaded() {
        return downloadQueue.items();
      },
      beingInstalled() {
        return installQueue.items();
      },
      beingUninstalled() {
        return uninstallQueue.items();
      },
      loadedModList() {
        return state.loaded.map((m) => m.name);
      },
    };
    const actions = {
      useLocalMode() {
        state.mode = ModdingMode.Local;
        events.emit("enableLocalMode");
      },
      setup() {
        return __awaiter(this, void 0, void 0, function* () {
          if (state.setup) return;
          const moddingStatus = yield getPlayFabData("modManager");
          state.moddingStatus =
            moddingStatus === "enabled"
              ? ModdingStatus.Enabled
              : moddingStatus === "hidden"
              ? ModdingStatus.Hidden
              : ModdingStatus.Disabled;
          if (state.moddingStatus !== ModdingStatus.Hidden) {
            document
              .querySelectorAll(".btn-mod-manager")
              .forEach((e) => e.classList.remove("d-none"));
            sidebar.category(
              "Modding",
              {
                before: "General",
                name: getLangString(i18nPage, "MODDING"),
                nameClass: `page-nav-name-misc-modding`,
              },
              ({ item }) => {
                item("Mod Manager", {
                  name: getLangString(i18nPage, "MOD_MANAGER"),
                  icon: createElement("i", {
                    classList: ["fas", "fa-cubes", "text-success"],
                  }),
                  onClick: () => mod.manager.open(),
                  nameClass: `page-nav-name-misc-mod-manager`,
                });
                item("Mod Settings", {
                  name: getLangString(i18nPage, "MOD_SETTINGS"),
                  rootClass: "d-none",
                  icon: createElement("i", {
                    classList: ["fas", "fa-cog", "text-dark"],
                  }),
                  nameClass: `page-nav-name-misc-mod-settings`,
                });
              }
            );
          }
          state.setup = true;
        });
      },
      unsetup() {
        document
          .querySelectorAll(".btn-mod-manager")
          .forEach((e) => e.classList.add("d-none"));
        sidebar.category("Modding").removeItem("Mod Manager");
        sidebar.category("Modding").removeItem("Mod Settings");
      },
      fullModeSetup() {
        return __awaiter(this, void 0, void 0, function* () {
          if (state.fullModeSetup) return;
          state.gameData = yield io.game.get();
          parser.setup(state.gameData);
          state.fullModeSetup = true;
        });
      },
      localModeSetup() {
        return __awaiter(this, void 0, void 0, function* () {
          if (state.localModeSetup) return;
          document.querySelectorAll("button.btn-mod-manager").forEach((e) => {
            e.classList.remove("btn-alt-success");
            e.classList.add("btn-alt-warning");
            const i = e.querySelector("i");
            if (i) {
              i.classList.remove("fa-cubes");
              i.classList.add("fa-exclamation-circle");
            }
          });
          document.querySelectorAll(".btn-mod-manager button").forEach((e) => {
            e.classList.remove("btn-alt-success");
            e.classList.add("btn-alt-warning");
            const i = e.querySelector("i");
            if (i) {
              i.classList.remove("fa-cubes");
              i.classList.add("fa-exclamation-circle");
            }
          });
          sidebar
            .category("Modding")
            .item("Mod Manager", {
              icon: createElement("i", {
                classList: ["fas", "fa-exclamation-circle", "text-warning"],
              }),
            });
          state.localModeSetup = true;
        });
      },
      afterLogin() {
        return __awaiter(this, void 0, void 0, function* () {
          const allModsDisabled = localStorage.getItem("allModsDisabled");
          let modLoadOrder = null;
          let modDisabled = null;
          let modPreferLatest = null;
          let modAccountStorage = null;
          try {
            ({ modLoadOrder, modDisabled, modPreferLatest, modAccountStorage } =
              yield playFabManager.retrieve([
                "modLoadOrder",
                "modDisabled",
                "modPreferLatest",
                "modAccountStorage",
              ]));
          } catch (_a) {}
          actions.initDisableAll(allModsDisabled);
          actions.initLoadOrder(
            modLoadOrder || localStorage.getItem("modLoadOrder")
          );
          actions.initDisabled(
            modDisabled || localStorage.getItem("modDisabled")
          );
          if (!getters.usingLocalMode()) {
            yield actions.refreshSubscriptions();
            yield actions.processUnsubscribed();
          }
          yield actions.refreshInstalled();
          if (!getters.usingLocalMode()) {
            cloudManager.log("Checking for Mod Updates...");
            yield actions.initPreferredLatest(
              modPreferLatest || localStorage.getItem("modPreferLatest")
            );
            yield actions.downloadSubscribedButNotInstalled();
            if (
              getters.beingDownloaded().length ||
              getters.beingInstalled().length
            ) {
              cloudManager.log("Updating Mods...");
              yield actions.waitForQueues();
            }
          }
          accountStorageContextApi.deserializeAll(modAccountStorage);
          yield actions.loadEnabledMods();
          events.emit("afterLogin");
        });
      },
      loadEnabledMods() {
        return __awaiter(this, void 0, void 0, function* () {
          if (!contextApi.hasCharacterSelectionLoadedTriggered()) {
            cloudManager.log("Loading Mods...");
            cloudManager.setStatus("Loading Mods...");
            const toLoad = state.installed.filter(
              (m) => !getters.isDisabled(m.id)
            );
            for (let i = 0; i < toLoad.length; i++) {
              const mod = toLoad[i];
              if (state.loaded.some((m) => m.id === mod.id)) continue;
              cloudManager.log(
                `Loading Mods (${i + 1}/${toLoad.length}): ${mod.name} (v${
                  mod.version
                })`
              );
              cloudManager.setStatus(
                `Loading Mods (${i + 1}/${toLoad.length}): ${mod.name}`
              );
              const depsNotFound = [];
              if (mod.dependencies && mod.dependencies.length) {
                for (const dep of mod.dependencies) {
                  if (state.loaded.findIndex((m) => m.id === dep.mod_id) === -1)
                    depsNotFound.push(dep);
                }
                if (depsNotFound.length) {
                  console.error(
                    `[${
                      mod.name
                    }] Failed to load due to missing dependencies: ${depsNotFound.map(
                      (d) => d.name
                    )}`
                  );
                  actions.queueDependencyPrompt(mod, depsNotFound);
                  continue;
                }
              }
              try {
                yield loader.load(mod);
                state.loaded.push(mod);
                if (mod.id === creatorToolkitId) {
                  state.creatorToolkitLoaded = true;
                  events.emit("loadCreatorToolkit");
                }
              } catch (e) {
                console.error(`[${mod.name}]`, e);
              }
            }
            yield contextApi.trigger.modsLoaded();
          }
        });
      },
      initOpen() {
        return __awaiter(this, void 0, void 0, function* () {
          yield actions.initDevMods();
          yield actions.initRatings();
          state.initialOpenSetup = true;
          events.emit("initialOpenSetup");
        });
      },
      queueDependencyPrompt(mod, dependencies) {
        if (!dependencies.length) return;
        const plural = dependencies.length > 1;
        const s = plural ? "s" : "";
        const isOrAre = plural ? "are" : "is";
        const yOrIes = plural ? "ies" : "y";
        const message = createElement("div", {
          children: [
            createElement("p", {
              classList: ["mb-0"],
              children: [
                "The installed mod ",
                createElement("strong", {
                  classList: ["text-success"],
                  text: mod.name,
                }),
                ` has a dependency on the following mod${s}, which ${isOrAre} not installed, ${isOrAre} disabled, or ${isOrAre} loaded too late in the load order:`,
              ],
            }),
            createElement("ul", {
              classList: ["list-group"],
              children: dependencies.map((d) =>
                createElement("li", {
                  classList: [
                    "list-group-item",
                    "bg-white",
                    "border-dark",
                    "font-weight-bold",
                    "text-danger",
                  ],
                  children: [
                    createElement("i", {
                      classList: ["fas", "fa-times-circle", "mr-2"],
                    }),
                    d.name,
                  ],
                })
              ),
            }),
            createElement("p", {
              classList: ["mb-0"],
              text: "The mod will not be loaded.",
            }),
          ],
        });
        state.dependencyPrompts.push({
          icon: "warning",
          title: `Missing Mod Dependenc${yOrIes}`,
          html: message,
          confirmButtonText: "Show in Mod Manager",
          denyButtonText: "Continue without Loading",
          showDenyButton: true,
          preConfirm: () =>
            state.dependencyPrompts.unshift(
              `id:${dependencies.map((d) => d.mod_id).join(",")}`
            ),
        });
      },
      openNextDependencyPrompt() {
        return __awaiter(this, void 0, void 0, function* () {
          if (!state.dependencyPrompts.length || state.dependencyPromptOpen)
            return;
          state.dependencyPromptOpen = true;
          const prompt = state.dependencyPrompts.shift();
          if (!prompt) {
            actions.openNextDependencyPrompt();
            return;
          }
          if (typeof prompt === "string") {
            yield manager.openModManager(false, prompt);
          } else {
            const { isConfirmed } = yield SwalLocale.fire(prompt);
            if (!isConfirmed && manager.hasChanges())
              yield manager.showPromptForReload();
          }
          state.dependencyPromptOpen = false;
          actions.openNextDependencyPrompt();
        });
      },
      initLoadOrder(data) {
        if (!data) return;
        state.loadOrder = JSON.parse(data);
      },
      saveLoadOrder() {
        const newlyInstalled = state.installed
          .map((m) => m.id)
          .filter((id) => !state.loadOrder.includes(id));
        state.loadOrder.push(...newlyInstalled);
        const serializedLoadOrder = JSON.stringify(state.loadOrder);
        localStorage.setItem("modLoadOrder", serializedLoadOrder);
        playFabManager.queueUpdate("modLoadOrder", serializedLoadOrder);
      },
      shiftLoadOrder(id, up) {
        const loadOrder = [...state.loadOrder];
        const i = loadOrder.findIndex((i) => i === id);
        if (i === -1)
          throw new Error(
            `A mod with id of ${id} is not currently in the load order.`
          );
        if (up && i === 0) return;
        if (!up && i === loadOrder.length - 1) return;
        const j = i + (up ? -1 : 1);
        if (
          loadOrder[i] === creatorToolkitId ||
          loadOrder[j] === creatorToolkitId
        )
          return;
        const temp = loadOrder[i];
        loadOrder[i] = loadOrder[j];
        loadOrder[j] = temp;
        state.loadOrder = loadOrder;
        actions.saveLoadOrder();
        actions.refreshInstalled();
        bus.fire(bus.source.LOAD_ORDER, bus.event.CHANGE);
      },
      initDevMods() {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            const mods = yield io.user.mods();
            for (const mod of mods) {
              state.devMods.add(mod.id);
              cacheBrowserGetModResponse(mod);
            }
          } catch (e) {
            console.error(
              "Failed to initialize mods the logged in user is on the dev team for",
              e
            );
          }
        });
      },
      initPreferredLatest(preferredLatest) {
        return __awaiter(this, void 0, void 0, function* () {
          if (!preferredLatest) return;
          const latest = JSON.parse(preferredLatest);
          for (const id of latest) {
            if (getters.isSubscribed(id)) {
              try {
                state.preferLatestMods.set(
                  id,
                  yield io.mods.getLatestModfile(id)
                );
              } catch (e) {
                console.error(
                  `Failed to get the latest modfile for mod with id "${id}"`,
                  e
                );
              }
            }
          }
          actions.savePreferredLatest();
          if (state.preferLatestMods.size)
            bus.fire(bus.source.INSTALLED_MODS, bus.event.REFRESH);
        });
      },
      refreshLatest() {
        return __awaiter(this, void 0, void 0, function* () {
          for (const [id] of state.preferLatestMods) {
            try {
              state.preferLatestMods.set(
                id,
                yield io.mods.getLatestModfile(id)
              );
            } catch (e) {
              console.error(
                `Failed to get the latest modfile for mod with id "${id}"`,
                e
              );
            }
          }
        });
      },
      savePreferredLatest() {
        const serializedPreferredLatest = JSON.stringify(
          Array.from(state.preferLatestMods.keys())
        );
        localStorage.setItem("modPreferLatest", serializedPreferredLatest);
        playFabManager.queueUpdate(
          "modPreferLatest",
          serializedPreferredLatest
        );
      },
      refreshSubscriptions() {
        return __awaiter(this, void 0, void 0, function* () {
          try {
            const mods = yield io.mods.getSubscribed();
            state.subscriptions.clear();
            for (const mod of mods) {
              state.subscriptions.add(mod.id);
              cacheBrowserGetModResponse(mod);
            }
          } catch (e) {
            console.error("Failed to refresh mod subscriptions", e);
          }
        });
      },
      processUnsubscribed() {
        return __awaiter(this, void 0, void 0, function* () {
          state.loadOrder = state.loadOrder.filter((id) =>
            state.subscriptions.has(id)
          );
          yield db.mods.deleteUnsubscribed(Array.from(state.subscriptions));
        });
      },
      refreshInstalled() {
        return __awaiter(this, void 0, void 0, function* () {
          const installed = yield db.mods.getAll();
          sortModsByLoadOrder(installed);
          actions.setInstalled(installed);
        });
      },
      setInstalled(mods) {
        state.installed = mods;
        bus.fire(bus.source.INSTALLED_MODS, bus.event.REFRESH);
      },
      downloadSubscribedButNotInstalled() {
        return __awaiter(this, void 0, void 0, function* () {
          if (getters.usingLocalMode()) return;
          const sortedSubscriptions = Array.from(state.subscriptions);
          sortModsByLoadOrder(sortedSubscriptions);
          for (const subbedId of sortedSubscriptions) {
            const subbed = yield getters.mod(subbedId);
            if (subbed) actions.downloadIfOutOfDate(subbed);
          }
        });
      },
      downloadIfOutOfDate(mod) {
        if (getters.usingLocalMode()) return;
        const installed = state.installed.find((m) => m.id === mod.id);
        if (
          !installed ||
          installed.version !==
            (state.preferLatestMods.has(mod.id)
              ? state.preferLatestMods.get(mod.id).version
              : mod.modfile.version)
        ) {
          if (state.autoDownload) {
            actions.download(mod);
          } else if (!installed) {
            bus.fire(bus.source.SUBSCRIBE_QUEUE, bus.event.COMPLETE, {
              input: mod,
              output: mod,
            });
          }
        }
      },
      waitForQueues() {
        return __awaiter(this, void 0, void 0, function* () {
          if (getters.usingLocalMode()) return;
          if (!state.autoDownload) return;
          return new Promise((res) => {
            let totalTimeWaited = 0;
            const waiting = setInterval(() => {
              totalTimeWaited += 500;
              const queuesCleared =
                !getters.beingDownloaded().length &&
                !getters.beingInstalled().length;
              const timeout = totalTimeWaited >= 30 * 1000;
              if (queuesCleared || timeout) {
                clearInterval(waiting);
                res();
              }
            }, 500);
          });
        });
      },
      setPreferredLatest(mod) {
        return __awaiter(this, void 0, void 0, function* () {
          if (!getters.isSubscribed(mod.id) || !getters.isModDev(mod.id))
            return;
          try {
            state.preferLatestMods.set(
              mod.id,
              yield io.mods.getLatestModfile(mod.id)
            );
          } catch (e) {
            console.error(
              `Failed to set mod "${mod.name}" as using the latest release.`,
              e
            );
            return;
          }
          actions.savePreferredLatest();
          actions.downloadIfOutOfDate(mod);
          bus.fire(bus.source.MOD(mod.id), bus.event.REFRESH);
        });
      },
      setPreferredLive(mod) {
        if (state.preferLatestMods.delete(mod.id)) {
          actions.savePreferredLatest();
          actions.downloadIfOutOfDate(mod);
          bus.fire(bus.source.MOD(mod.id), bus.event.REFRESH);
        }
      },
      subscribe(mod) {
        if (getters.usingLocalMode()) return false;
        const isBeingUnsubscribed = getters
          .beingUnsubscribed()
          .some((id) => id === mod.id);
        const isBeingUninstalled = getters
          .beingUninstalled()
          .some((id) => id === mod.id);
        if (isBeingUnsubscribed || isBeingUninstalled) return false;
        subscribeQueue.enqueue(mod).then(() => {
          state.subscriptions.add(mod.id);
          bus.fire(bus.source.MOD(mod.id), bus.event.REFRESH);
          if (state.autoDownload) actions.download(mod);
        });
        return true;
      },
      unsubscribe(mod) {
        if (getters.usingLocalMode()) return false;
        const isBeingSubscribed = getters
          .beingSubscribed()
          .some((id) => id === mod.id);
        const isBeingDownloaded = getters
          .beingDownloaded()
          .some((id) => id === mod.id);
        const isBeingInstalled = getters
          .beingUninstalled()
          .some((id) => id === mod.id);
        if (isBeingSubscribed || isBeingDownloaded || isBeingInstalled)
          return false;
        unsubscribeQueue.enqueue(mod).then(() => {
          state.subscriptions.delete(mod.id);
          bus.fire(bus.source.MOD(mod.id), bus.event.REFRESH);
          if (state.installed.some((m) => m.id === mod.id))
            actions.uninstall(mod);
        });
        return true;
      },
      download(mod) {
        if (getters.usingLocalMode()) return;
        downloadQueue
          .enqueue(mod)
          .then(({ modfile, file }) => actions.install(mod, modfile, file));
      },
      install(mod, modfile, file) {
        if (getters.usingLocalMode()) return;
        installQueue.enqueue({ mod, modfile, file }).then(() =>
          __awaiter(this, void 0, void 0, function* () {
            if (mod.tags.some((tag) => tag.name === "Dependency")) {
              const loadIndex = state.loadOrder.indexOf(mod.id);
              if (loadIndex > -1) {
                state.loadOrder.splice(loadIndex, 1);
              }
              state.loadOrder.unshift(mod.id);
            }
            yield actions.refreshInstalled();
            actions.saveLoadOrder();
            bus.fire(bus.source.MOD(mod.id), bus.event.REFRESH);
          })
        );
      },
      uninstall(mod) {
        uninstallQueue.enqueue(mod).then(() =>
          __awaiter(this, void 0, void 0, function* () {
            actions.enable(mod.id);
            yield actions.refreshInstalled();
            actions.saveLoadOrder();
            if (state.preferLatestMods.delete(mod.id)) {
              actions.savePreferredLatest();
            }
          })
        );
      },
      uninstallAll() {
        return __awaiter(this, void 0, void 0, function* () {
          yield db.mods.deleteAll();
          yield actions.refreshInstalled();
        });
      },
      initDisabled(data) {
        return __awaiter(this, void 0, void 0, function* () {
          if (!data) return;
          state.disabled = new Set(JSON.parse(data));
        });
      },
      saveDisabled() {
        const serializedDisabled = JSON.stringify(Array.from(state.disabled));
        localStorage.setItem("modDisabled", serializedDisabled);
        playFabManager.queueUpdate("modDisabled", serializedDisabled);
      },
      enable(id) {
        if (!getters.isDisabled(id)) return;
        state.disabled.delete(id);
        actions.saveDisabled();
        bus.fire(bus.source.MOD(id), bus.event.ENABLED);
        bus.fire(bus.source.DISABLED_MODS, bus.event.CHANGE);
      },
      disable(id) {
        if (getters.isDisabled(id)) return;
        state.disabled.add(id);
        actions.saveDisabled();
        bus.fire(bus.source.MOD(id), bus.event.DISABLED);
        bus.fire(bus.source.DISABLED_MODS, bus.event.CHANGE);
      },
      initDisableAll(flag) {
        if (!flag) return;
        actions.disableAll();
      },
      disableAll() {
        state.disableAll = true;
        localStorage.setItem("allModsDisabled", "1");
        events.emit("changeDisableAll");
      },
      undisableAll() {
        state.disableAll = false;
        localStorage.removeItem("allModsDisabled");
        events.emit("changeDisableAll");
      },
      initRatings() {
        return __awaiter(this, void 0, void 0, function* () {
          if (getters.usingLocalMode()) return;
          try {
            const ratings = yield io.mods.getRatings();
            state.ratings.clear();
            for (const rating of ratings) {
              state.ratings.set(rating.mod_id, rating.rating);
              bus.fire(bus.source.MOD(rating.mod_id), bus.event.REFRESH);
            }
          } catch (e) {
            console.error("Failed to refresh mod ratings", e);
          }
        });
      },
      thumbsUp(id) {
        return __awaiter(this, void 0, void 0, function* () {
          if (getters.usingLocalMode()) return;
          try {
            yield io.mods.ratePositive(id);
          } catch (e) {
            console.error(`Failed to rate the mod with id ${id}`, e);
            return;
          }
          yield actions.addRating(id, 1);
        });
      },
      thumbsDown(id) {
        return __awaiter(this, void 0, void 0, function* () {
          if (getters.usingLocalMode()) return;
          try {
            yield io.mods.rateNegative(id);
          } catch (e) {
            console.error(`Failed to rate the mod with id ${id}`, e);
            return;
          }
          yield actions.addRating(id, -1);
        });
      },
      unthumbs(id) {
        return __awaiter(this, void 0, void 0, function* () {
          if (getters.usingLocalMode()) return;
          try {
            yield io.mods.removeRating(id);
          } catch (e) {
            console.error(
              `Failed to remove the rating from the mod with id ${id}`,
              e
            );
            return;
          }
          yield actions.addRating(id, 0);
        });
      },
      addRating(id, rating) {
        return __awaiter(this, void 0, void 0, function* () {
          if (getters.usingLocalMode()) return;
          if (!rating) state.ratings.delete(id);
          else state.ratings.set(id, rating);
          yield refreshCachedModStats(id);
        });
      },
      toggleAutoDownload() {
        state.autoDownload = !state.autoDownload;
        if (state.autoDownload) {
          localStorage.removeItem("mm__stop-auto-download");
        } else {
          localStorage.setItem("mm__stop-auto-download", "1");
        }
      },
    };
    function sortModsByLoadOrder(mods) {
      mods.sort((modA, modB) => {
        const idA = typeof modA === "number" ? modA : modA.id;
        const idB = typeof modB === "number" ? modB : modB.id;
        if (idA === creatorToolkitId) return -1;
        if (idB === creatorToolkitId) return 1;
        const indexA = state.loadOrder.indexOf(idA);
        const indexB = state.loadOrder.indexOf(idB);
        if (indexA === -1 && indexB === -1) return 0;
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
      });
    }
    const pageCache = new Map();
    const modCache = new Map();
    function cacheBrowserGetModsResponse(
      sort,
      pageParams,
      search,
      tags,
      response
    ) {
      const key = toCacheKey(sort, pageParams, search, tags);
      if (!pageCache.has(key))
        pageCache.set(key, { totalResults: response.result_total, pages: [] });
      const cache = pageCache.get(key);
      if (cache.totalResults !== response.result_total) cache.pages = [];
      for (const mod of response.data) cacheBrowserGetModResponse(mod);
      const expires = new Date();
      expires.setMinutes(expires.getMinutes() + 5);
      cache.pages[response.result_offset / response.result_limit] = {
        mods: response.data.map((m) => m.id),
        expires,
      };
      response.data = response.data
        .map((m) => getCachedBrowserGetModResponse(m.id))
        .filter((m) => m !== null);
      return response;
    }
    function cacheBrowserGetModResponse(mod) {
      if (!modCache.has(mod.id)) {
        mod.categorized_tags = parser.parseTags(mod.tags);
        modCache.set(mod.id, mod);
        return mod;
      }
      const cache = modCache.get(mod.id);
      cache.logo = mod.logo;
      cache.name = mod.name;
      cache.summary = mod.summary;
      cache.profile_url = mod.profile_url;
      cache.media = mod.media;
      cache.modfile = mod.modfile;
      cache.stats = mod.stats;
      cache.tags = mod.tags;
      cache.categorized_tags = parser.parseTags(mod.tags);
      bus.fire(bus.source.MOD(mod.id), bus.event.REFRESH, cache);
      return cache;
    }
    function refreshCachedModStats(id) {
      return __awaiter(this, void 0, void 0, function* () {
        const mod = getCachedBrowserGetModResponse(id);
        if (!mod) return;
        try {
          mod.stats = yield io.mods.getStats(mod.id);
          cacheBrowserGetModResponse(mod);
        } catch (e) {
          console.error("Failed to get mod stats", e);
        }
      });
    }
    function getCachedBrowserGetModsResponse(sort, pageParams, search, tags) {
      const key = toCacheKey(sort, pageParams, search, tags);
      const cache = pageCache.get(key);
      if (!cache) return null;
      const cachedObject = cache.pages[pageParams.page - 1];
      if (!cachedObject) return null;
      if (cachedObject.expires < new Date()) {
        cache.pages[pageParams.page] = null;
        return null;
      }
      if (cachedObject.mods.some((id) => !modCache.has(id))) {
        return null;
      }
      const res = {
        data: cachedObject.mods.map((id) => modCache.get(id)),
        result_count: cachedObject.mods.length,
        result_limit: pageParams.pageSize,
        result_offset: (pageParams.page - 1) * pageParams.pageSize,
        result_total: cache.totalResults,
      };
      return res;
    }
    function getCachedBrowserGetModResponse(id) {
      if (!modCache.has(id)) return null;
      return modCache.get(id);
    }
    function toCacheKey(sort, pageParams, search, tags) {
      return new URLSearchParams({
        sort,
        pageSize: pageParams.pageSize.toString(),
        search: search || "",
        tags:
          (tags === null || tags === void 0 ? void 0 : tags.join(",")) || "",
      }).toString();
    }
    class EventingAsyncProcessQueue {
      constructor(config) {
        this.q = [];
        this.name = config.name;
        this.processor = config.processor;
        this.itemsMap = config.itemsMap;
        this.findIndex = config.findIndex;
      }
      enqueue(item) {
        return new Promise((res, rej) => {
          this.q.push({ item, res, rej });
          bus.fire(this.name, bus.event.QUEUED, item);
          bus.fire(this.name, bus.event.CHANGE, this.items());
          if (this.q.length === 1) this.process();
        });
      }
      dequeue(item) {
        const i = this.getQueuePosition(item);
        if (i < 1) return;
        const dequeued = this.q.splice(i, 1);
        bus.fire(this.name, bus.event.CHANGE, this.items());
        dequeued[0].rej(`Item was dequeued from ${this.name}.`);
      }
      items() {
        return this.q.map((i) => i.item).map(this.itemsMap);
      }
      contains(item) {
        return this.getQueuePosition(item) > -1;
      }
      getQueuePosition(item) {
        return this.findIndex(
          this.q.map((i) => i.item),
          item
        );
      }
      process() {
        return __awaiter(this, void 0, void 0, function* () {
          while (this.q.length) {
            const { item, res, rej } = this.q[0];
            try {
              bus.fire(this.name, bus.event.BEGIN, { input: item });
              const output = yield this.processor(item, (...args) =>
                bus.fire(this.name, bus.event.PROGRESS, { input: item, args })
              );
              bus.fire(this.name, bus.event.COMPLETE, { input: item, output });
              res(output);
            } catch (error) {
              bus.fire(this.name, bus.event.ERROR, { input: item, error });
              rej(`Error on ${this.name} : ${error}`);
            } finally {
              this.q.shift();
              bus.fire(this.name, bus.event.CHANGE, this.items());
            }
          }
        });
      }
    }
    const subscribeQueue = new EventingAsyncProcessQueue({
      name: bus.source.SUBSCRIBE_QUEUE,
      processor: (mod) =>
        __awaiter(void 0, void 0, void 0, function* () {
          return yield io.mods.subscribeTo(mod.id);
        }),
      findIndex: (q, mod) => q.findIndex((i) => i.id === mod.id),
      itemsMap: (mod) => mod.id,
    });
    const unsubscribeQueue = new EventingAsyncProcessQueue({
      name: bus.source.UNSUBSCRIBE_QUEUE,
      processor: (mod) =>
        __awaiter(void 0, void 0, void 0, function* () {
          yield io.mods.unsubscribeFrom(mod.id);
          return mod;
        }),
      findIndex: (q, mod) => q.findIndex((i) => i.id === mod.id),
      itemsMap: (mod) => mod.id,
    });
    const downloadQueue = new EventingAsyncProcessQueue({
      name: bus.source.DOWNLOAD_QUEUE,
      processor: (mod, onProgress) =>
        __awaiter(void 0, void 0, void 0, function* () {
          const modfile = state.preferLatestMods.get(mod.id) || mod.modfile;
          return { modfile, file: yield io.mods.download(modfile, onProgress) };
        }),
      findIndex: (q, mod) => q.findIndex((i) => i.id === mod.id),
      itemsMap: (mod) => mod.id,
    });
    const installQueue = new EventingAsyncProcessQueue({
      name: bus.source.INSTALL_QUEUE,
      processor: ({ mod, modfile, file }) =>
        __awaiter(void 0, void 0, void 0, function* () {
          const localMod = yield parser.parse(mod, modfile, file);
          yield db.mods.put(localMod);
        }),
      findIndex: (q, { mod }) => q.findIndex((i) => i.mod.id === mod.id),
      itemsMap: ({ mod }) => mod.id,
    });
    const uninstallQueue = new EventingAsyncProcessQueue({
      name: bus.source.UNINSTALL_QUEUE,
      processor: (mod) =>
        __awaiter(void 0, void 0, void 0, function* () {
          return yield db.mods.delete(mod.id);
        }),
      findIndex: (q, mod) => q.findIndex((i) => i.id === mod.id),
      itemsMap: (mod) => mod.id,
    });
    return { state, getters, actions, on: events.on, off: events.off };
  })();
  const manager = (() => {
    function ModManager() {
      const header = Header();
      const main = Main();
      const wrapper = createElement("div", {
        classList: ["d-flex", "flex-column", "h-100"],
        children: [header.el, main.el],
      });
      function open(goToMyMods, query) {
        if (store.getters.usingLocalMode()) {
          main.goToMyModsTab();
          return;
        }
        main.browse.update();
        if (query) main.setBrowseSearch(query);
        main.browse.getMods();
        if (goToMyMods !== undefined && !goToMyMods) main.goToBrowseTab();
        if (goToMyMods) main.goToMyModsTab();
        if (!store.state.initialOpenSetup) {
          store.actions.initOpen();
        }
      }
      return { el: wrapper, open };
    }
    function Header() {
      const title = createElement("span", {
        text: getLangString(i18nPage, "MOD_MANAGER"),
      });
      const menu = HeaderMenu();
      menu.el.classList.add("mr-5", "float-right");
      const header = createElement("h3", {
        classList: ["block-title", "mb-2", "flex-grow-0"],
        children: [title, menu.el],
      });
      return { el: header };
    }
    function HeaderMenu() {
      const option = (text) =>
        createElement("button", {
          classList: ["dropdown-item"],
          attributes: [["type", "button"]],
          text,
        });
      const divider = () =>
        createElement("div", { classList: ["dropdown-divider"] });
      const icon = Icon("cog").el;
      const button = createElement("button", {
        id: "mm__main-menu",
        classList: ["btn", "btn-dark", "btn-rounded", "dropdown-toggle"],
        attributes: [
          ["type", "button"],
          ["data-toggle", "dropdown"],
          ["aria-haspopup", "true"],
          ["aria-expanded", "false"],
        ],
        children: [icon],
      });
      const reloadOpt = option("Reload to Apply Changes");
      reloadOpt.classList.add("d-none", "text-warning");
      const autoDownloadOpt = option("Auto Download: ");
      const autoDownloadSetting = createElement("span", {
        text: store.state.autoDownload ? "ON" : "OFF",
      });
      autoDownloadSetting.classList.toggle(
        "text-success",
        store.state.autoDownload
      );
      autoDownloadSetting.classList.toggle(
        "text-danger",
        !store.state.autoDownload
      );
      autoDownloadOpt.appendChild(autoDownloadSetting);
      const modioOpt = option("Open Melvor Idle on mod.io");
      const guidesOpt = option("View Modding Guides");
      const signOutOpt = option("Sign Out");
      const menu = createElement("div", {
        classList: ["dropdown-menu", "dropdown-menu-right", "font-size-sm"],
        attributes: [["aria-labeledby", "mm__main-menu"]],
        children: [
          reloadOpt,
          autoDownloadOpt,
          modioOpt,
          guidesOpt,
          divider(),
          signOutOpt,
        ],
      });
      const wrapper = createElement("div", {
        classList: ["dropdown", "d-inline"],
        children: [button, menu],
      });
      function showReloadOpt() {
        if (!contextApi.hasCharacterSelectionLoadedTriggered()) return;
        button.classList.add("text-warning");
        icon.classList.remove("fa-cog");
        icon.classList.add("fa-exclamation-circle");
        reloadOpt.classList.remove("d-none");
      }
      function onEnableLocalMode() {
        signOutOpt.disabled = true;
        signOutOpt.classList.add("opacity-25");
      }
      bus.on(bus.source.INSTALL_QUEUE, bus.event.COMPLETE, showReloadOpt);
      bus.on(bus.source.UNINSTALL_QUEUE, bus.event.COMPLETE, showReloadOpt);
      bus.on(bus.source.LOAD_ORDER, bus.event.CHANGE, showReloadOpt);
      bus.on(bus.source.DISABLED_MODS, bus.event.CHANGE, showReloadOpt);
      store.on("changeDisableAll", showReloadOpt);
      store.on("enableLocalMode", onEnableLocalMode);
      reloadOpt.addEventListener("click", () =>
        __awaiter(this, void 0, void 0, function* () {
          yield playFabManager.persist();
          window.location.reload();
        })
      );
      autoDownloadOpt.addEventListener("click", (e) => {
        e.stopPropagation();
        store.actions.toggleAutoDownload();
        autoDownloadSetting.textContent = store.state.autoDownload
          ? "ON"
          : "OFF";
        autoDownloadSetting.classList.toggle(
          "text-success",
          store.state.autoDownload
        );
        autoDownloadSetting.classList.toggle(
          "text-danger",
          !store.state.autoDownload
        );
      });
      modioOpt.addEventListener("click", () => openLink(io.game.profileUrl));
      guidesOpt.addEventListener("click", () =>
        openLink("https://wiki.melvoridle.com/w/Mod_Creation")
      );
      signOutOpt.addEventListener("click", () => {
        if (store.getters.usingLocalMode()) return;
        loginStore.actions.logout();
        Swal.close();
        store.actions.uninstallAll();
      });
      return { el: wrapper };
    }
    function Main() {
      const tabPanel = (content) =>
        createElement("div", {
          classList: ["tab-pane", "h-100"],
          attributes: [["role", "tabpanel"]],
          children: [content],
        });
      const dTabs = DesktopTabs({ onBrowseTab, onMyModsTab });
      const mTabs = MobileTabs({ onBrowseTab, onMyModsTab });
      const browse = Browse();
      const browseTabPanel = tabPanel(browse.el);
      browseTabPanel.classList.add("active");
      const myMods = MyMods();
      const myModsTabPanel = tabPanel(myMods.el);
      const content = createElement("div", {
        classList: ["block-content", "tab-content", "p-0", "flex-grow-1"],
        children: [browseTabPanel, myModsTabPanel],
      });
      const wrapper = createElement("div", {
        classList: [
          "mm__tab-block",
          "block",
          "block-transparent",
          "mb-0",
          "mb-md-3",
          "flex-grow-1",
          "d-flex",
          "flex-column",
        ],
        children: [dTabs.el, content, mTabs.el],
      });
      function onBrowseTab() {
        if (store.getters.usingLocalMode()) return;
        mTabs.setTab("browse");
        myMods.close();
        browseTabPanel.classList.add("active");
        myModsTabPanel.classList.remove("active");
      }
      function onMyModsTab() {
        mTabs.setTab("my-mods");
        browse.close();
        browseTabPanel.classList.remove("active");
        myModsTabPanel.classList.add("active");
      }
      return {
        el: wrapper,
        browse,
        myMods,
        goToBrowseTab: onBrowseTab,
        goToMyModsTab: onMyModsTab,
        setBrowseSearch: browse.setSearch,
      };
    }
    function DesktopTabs({ onBrowseTab, onMyModsTab }) {
      const link = (text, icon, iconColor) =>
        createElement("a", {
          classList: ["nav-main-link"],
          children: [
            Icon(icon, { size: "lg", classList: [`text-${iconColor}`, "mr-2"] })
              .el,
            createElement("span", { text }),
          ],
        });
      const tab = (link) =>
        createElement("li", { classList: ["nav-main-item"], children: [link] });
      const browseLink = link(
        getLangString(i18nPage, "BROWSE"),
        "search",
        "info"
      );
      const browseTab = tab(browseLink);
      const myModsLink = link(
        getLangString(i18nPage, "MY_MODS"),
        "cubes",
        "success"
      );
      const myModsTab = tab(myModsLink);
      const creatorToolkitLink = link(
        "Creator Toolkit",
        "exclamation-triangle",
        "warning"
      );
      const creatorToolkitTab = tab(creatorToolkitLink);
      creatorToolkitTab.classList.add("d-none");
      const wrapper = createElement("ul", {
        classList: [
          "nav-main",
          "nav-main-horizontal",
          "nav-main-hover",
          "nav-main-horizontal-center",
          "d-md-flex",
          "justify-content-center",
          "d-none",
          "mb-2",
        ],
        children: [browseTab, myModsTab, creatorToolkitTab],
      });
      function onEnableLocalMode() {
        browseTab.classList.add("opacity-25");
        browseLink.classList.add("disabled");
      }
      function onInitialOpenSetup() {
        if (store.state.devMods.size && !isIOS() && !isAndroid()) {
          creatorToolkitTab.classList.remove("d-none");
        }
      }
      function onLoadCreatorToolkit() {
        const icon = creatorToolkitLink.querySelector("i");
        icon === null || icon === void 0
          ? void 0
          : icon.classList.remove("fa-exclamation-triangle");
        icon === null || icon === void 0
          ? void 0
          : icon.classList.add("fa-asterisk");
        creatorToolkitTab.classList.remove("d-none");
        const menuBtns = document.querySelectorAll(
          ".btn-group.btn-mod-manager, .btn-mod-manager .btn-group"
        );
        menuBtns.forEach((e) => {
          const isMobileBtn = !e.classList.contains("btn-mod-manager");
          const tkBtn = createElement("button", {
            attributes: [["role", "button"]],
            classList: [
              "btn",
              "btn-lg",
              "btn-alt-warning",
              ...(isMobileBtn ? ["my-2"] : []),
            ],
            children: [
              createElement("i", {
                classList: [
                  "fas",
                  "fa-fw",
                  "fa-asterisk",
                  ...(isMobileBtn ? [] : ["opacity-50"]),
                ],
              }),
            ],
          });
          tkBtn.addEventListener("click", () =>
            contextApi.trigger.creatorToolkitOpen()
          );
          e.append(tkBtn);
        });
      }
      browseLink.addEventListener("click", onBrowseTab);
      myModsLink.addEventListener("click", onMyModsTab);
      creatorToolkitLink.addEventListener("click", () => {
        if (store.state.loaded.some((m) => m.id === creatorToolkitId))
          contextApi.trigger.creatorToolkitOpen();
        else
          modManager === null || modManager === void 0
            ? void 0
            : modManager.open(false, `id:${creatorToolkitId}`);
      });
      store.on("enableLocalMode", onEnableLocalMode);
      store.on("initialOpenSetup", onInitialOpenSetup);
      store.on("loadCreatorToolkit", onLoadCreatorToolkit);
      return { el: wrapper };
    }
    function MobileTabs({ onBrowseTab, onMyModsTab }) {
      const link = (text, icon, iconColor) =>
        createElement("a", {
          classList: ["nav-main-link", "justify-content-center", "py-3"],
          children: [
            Icon(icon, { size: "sm", classList: [`text-${iconColor}`, "mr-2"] })
              .el,
            createElement("span", { text }),
          ],
        });
      const tab = (link) =>
        createElement("li", {
          classList: [
            "nav-main-item",
            "flex-grow-1",
            "border-top",
            "border-4x",
            "border-dark",
          ],
          children: [link],
        });
      const browseLink = link(
        getLangString(i18nPage, "BROWSE"),
        "search",
        "info"
      );
      const browseTab = tab(browseLink);
      browseTab.classList.remove("border-dark");
      browseTab.classList.add("border-success", "active");
      const myModsLink = link(
        getLangString(i18nPage, "MY_MODS"),
        "cubes",
        "success"
      );
      const myModsTab = tab(myModsLink);
      const wrapper = createElement("ul", {
        classList: [
          "mm__mobile-tabs",
          "nav-main",
          "nav-main-horizontal",
          "nav-main-horizontal-center",
          "d-flex",
          "d-md-none",
          "mb-0",
          "mt-2",
        ],
        children: [browseTab, myModsTab],
      });
      const state = { tab: "browse" };
      function setTab(tab) {
        state.tab = tab;
        update();
      }
      function update() {
        browseTab.classList.toggle("border-dark", state.tab !== "browse");
        browseTab.classList.toggle("border-success", state.tab === "browse");
        browseTab.classList.toggle("active", state.tab === "browse");
        myModsTab.classList.toggle("border-dark", state.tab !== "my-mods");
        myModsTab.classList.toggle("border-success", state.tab === "my-mods");
        myModsTab.classList.toggle("active", state.tab === "my-mods");
      }
      function onEnableLocalMode() {
        browseLink.classList.add("opacity-25");
        browseLink.classList.add("disabled");
      }
      browseLink.addEventListener("click", onBrowseTab);
      myModsLink.addEventListener("click", onMyModsTab);
      store.on("enableLocalMode", onEnableLocalMode);
      return { el: wrapper, setTab, update };
    }
    function Icon(name, options = {}) {
      var _a;
      const classList = [`${options.outline ? "far" : "fas"}`, `fa-${name}`];
      if (options.size) classList.push(`fa-${options.size}`);
      if (options.fixedWidth) classList.push("fa-fw");
      (_a = options.classList) === null || _a === void 0
        ? void 0
        : _a.forEach((c) => classList.push(c));
      const icon = createElement("i", { classList: classList });
      const state = { name, size: options.size };
      function setIcon(name) {
        icon.classList.remove(`fa-${state.name}`);
        state.name = name;
        icon.classList.add(`fa-${state.name}`);
      }
      function setSize(size) {
        if (state.size) icon.classList.remove(`fa-${size}`);
        state.size = size;
        if (state.size) icon.classList.add(`fa-${size}`);
      }
      function togglePulse(isPulsing) {
        if (isPulsing === undefined)
          isPulsing = !icon.classList.contains("fa-pulse");
        icon.classList.toggle("fa-pulse", isPulsing);
      }
      function toggleOutline(isOutline) {
        if (isOutline === undefined)
          isOutline = !icon.classList.contains("far");
        icon.classList.toggle("far", isOutline);
        icon.classList.toggle("fas", !isOutline);
      }
      return { el: icon, setIcon, setSize, togglePulse, toggleOutline };
    }
    function CircularProgress() {
      const spinner = createElement("div", {
        classList: ["spinner-border", "text-success"],
        attributes: [["role", "status"]],
        children: [
          createElement("span", { classList: ["sr-only"], text: "Loading..." }),
        ],
      });
      const wrapper = createElement("div", {
        classList: [
          "mm__circular-progress",
          "position-absolute",
          "w-100",
          "h-100",
          "d-flex",
          "align-items-center",
          "justify-content-center",
        ],
        children: [spinner],
      });
      function show() {
        wrapper.classList.add("d-flex");
        wrapper.classList.remove("d-none");
      }
      function hide() {
        wrapper.classList.remove("d-flex");
        wrapper.classList.add("d-none");
      }
      function toggle(shouldShow) {
        (shouldShow && show()) || hide();
      }
      return { el: wrapper, show, hide, toggle };
    }
    function GameVersionBadge({ showOnUpToDate }) {
      const currentGameVersion = gameVersion.substring(1);
      const icon = Icon("exclamation-triangle");
      const versionText = createElement("span", {
        classList: ["ml-1"],
        text: "-.-.-",
      });
      const badge = createElement("div", {
        classList: ["badge", "badge-warning", "p-2"],
        children: [icon.el, versionText],
      });
      const state = { mod: null };
      function setMod(mod) {
        state.mod = mod;
        update();
      }
      function update() {
        let version = "-.-.-";
        if (state.mod) {
          version =
            "categorized_tags" in state.mod
              ? state.mod.categorized_tags.supportedGameVersion
              : state.mod.tags.supportedGameVersion;
        }
        versionText.textContent = version;
        badge.classList.toggle(
          "d-none",
          !showOnUpToDate && version === currentGameVersion
        );
        badge.classList.toggle("badge-success", version === currentGameVersion);
        badge.classList.toggle("badge-warning", version !== currentGameVersion);
        icon.setIcon(
          version === currentGameVersion
            ? "check-circle"
            : "exclamation-triangle"
        );
      }
      return { el: badge, setMod, update };
    }
    function DetailPane({ tab, onClose }) {
      const placeholderWrapper = createElement("div", {
        classList: [
          "h-100",
          "d-flex",
          "align-items-center",
          "justify-content-center",
        ],
        children: [
          createElement("div", {
            classList: ["text-center"],
            text: "Select a mod to view its details here.",
          }),
        ],
      });
      const header = DetailHeader({ onClose });
      const actions = DetailActions({ tab });
      const previewImage = createElement("img", {
        classList: ["mm__preview-img--180px", "w-100"],
        attributes: [
          ["src", cdnMedia("assets/media/mods/placeholder_thumbnail.png")],
        ],
      });
      const releaseSelector = DetailReleaseSelector();
      const subBtn = DetailSubBtn();
      const detailsBox = DetailBox();
      const reportBtn = createElement("button", {
        classList: [
          "btn",
          "btn-outline-danger",
          "btn-sm",
          "btn-rounded",
          "mt-auto",
          "mx-4",
          "d-md-none",
        ],
        attributes: [["type", "button"]],
        text: "Report",
      });
      const innerContentWrapper = createElement("div", {
        classList: ["mm__flex-expand", "d-flex", "flex-column"],
        children: [
          actions.el,
          previewImage,
          releaseSelector.el,
          subBtn.el,
          detailsBox.el,
          reportBtn,
        ],
      });
      const moreInfoBtn = createElement("button", {
        classList: ["btn", "btn-sm", "btn-link", "btn-block", "mt-2"],
        attributes: [["type", "button"]],
        text: "View on mod.io",
      });
      const contentWrapper = createElement("div", {
        classList: [
          "block-content",
          "mm__minh-100",
          "flex-column",
          "p-2",
          "d-none",
        ],
        children: [header.el, innerContentWrapper, moreInfoBtn],
      });
      const wrapper = createElement("div", {
        classList: [
          "block",
          "block-rounded",
          "mm__flex-expand--no-xl",
          "h-100",
          "mb-0",
        ],
        children: [placeholderWrapper, contentWrapper],
      });
      const state = { mod: null, ioMod: null };
      function setMod(mod, ioMod) {
        if (state.ioMod)
          bus.off(bus.source.MOD(state.ioMod.id), bus.event.REFRESH, onRefresh);
        previewImage.src = cdnMedia(
          "assets/media/mods/placeholder_thumbnail.png"
        );
        if (ioMod && !mod && store.getters.isInstalled(ioMod.id))
          mod = store.state.installed.find((m) => m.id === ioMod.id);
        state.mod = mod;
        state.ioMod = ioMod;
        header.setMod(state.mod, state.ioMod);
        actions.setMod(state.mod, state.ioMod);
        releaseSelector.setMod(state.ioMod);
        subBtn.setMod(state.mod, state.ioMod);
        detailsBox.setMod(state.mod, state.ioMod);
        innerContentWrapper.scrollTop = 0;
        if (state.ioMod)
          bus.on(bus.source.MOD(state.ioMod.id), bus.event.REFRESH, onRefresh);
        update(true);
        if (!store.getters.usingLocalMode() && state.mod && !state.ioMod) {
          store.getters.mod(state.mod.id).then((ioMod) => {
            var _a;
            if (
              state.ioMod ||
              ((_a = state.mod) === null || _a === void 0 ? void 0 : _a.id) !==
                (ioMod === null || ioMod === void 0 ? void 0 : ioMod.id)
            )
              return;
            if (ioMod) setMod(state.mod, ioMod);
          });
        }
      }
      function update(stopPropagation = false) {
        var _a, _b;
        const hasModState = state.mod !== null || state.ioMod !== null;
        placeholderWrapper.classList.toggle("d-none", hasModState);
        placeholderWrapper.classList.toggle("d-flex", !hasModState);
        contentWrapper.classList.toggle("d-none", !hasModState);
        contentWrapper.classList.toggle("d-flex", hasModState);
        previewImage.src = state.ioMod
          ? state.ioMod.media.images.length
            ? state.ioMod.media.images[0].original
            : state.ioMod.logo.original
          : cdnMedia("assets/media/mods/placeholder_thumbnail.png");
        moreInfoBtn.disabled = !state.ioMod;
        reportBtn.classList.toggle(
          "invisible",
          ((_a = state.mod) === null || _a === void 0 ? void 0 : _a.id) ===
            creatorToolkitId ||
            ((_b = state.ioMod) === null || _b === void 0 ? void 0 : _b.id) ===
              creatorToolkitId
        );
        if (!stopPropagation) {
          header.update();
          actions.update();
          releaseSelector.update();
          subBtn.update();
          detailsBox.update();
        }
      }
      function destroy() {
        subBtn.destroy();
        bus.off(
          bus.source.UNSUBSCRIBE_QUEUE,
          bus.event.COMPLETE,
          onUnsubscribeComplete
        );
        if (state.ioMod)
          bus.off(bus.source.MOD(state.ioMod.id), bus.event.REFRESH, onRefresh);
        store.off("enableLocalMode", onEnableLocalMode);
        wrapper.remove();
      }
      function onUnsubscribeComplete(e) {
        var _a, _b;
        const { input } = e;
        if (tab !== "my-mods") return;
        if (!state.mod && !state.ioMod) return;
        if (
          ((_a = state.mod) === null || _a === void 0 ? void 0 : _a.id) !==
            input.id &&
          ((_b = state.ioMod) === null || _b === void 0 ? void 0 : _b.id) !==
            input.id
        )
          return;
        onClose();
        setMod(null, null);
      }
      bus.on(
        bus.source.UNSUBSCRIBE_QUEUE,
        bus.event.COMPLETE,
        onUnsubscribeComplete
      );
      function onClickReport() {
        var _a;
        if (!state.mod && !state.ioMod) return;
        const modId =
          ((_a = state.ioMod) === null || _a === void 0 ? void 0 : _a.id) ||
          state.mod.id;
        openLink(io.mods.reportUrl(modId));
      }
      function onClickMoreInfo() {
        if (!state.ioMod) return;
        openLink(state.ioMod.profile_url);
      }
      function onRefresh() {
        if (state.mod) {
          const id = state.mod.id;
          const installed = store.state.installed.find((m) => m.id === id);
          if (installed && installed !== state.mod) {
            setMod(installed, state.ioMod);
            return;
          }
        }
        update();
      }
      function onEnableLocalMode() {
        reportBtn.classList.add("d-none");
        subBtn.el.classList.add("d-none");
        detailsBox.el.classList.add("mt-2");
      }
      reportBtn.addEventListener("click", onClickReport);
      moreInfoBtn.addEventListener("click", onClickMoreInfo);
      innerContentWrapper.addEventListener("touchmove", (e) =>
        e.stopPropagation()
      );
      store.on("enableLocalMode", onEnableLocalMode);
      return { el: wrapper, setMod, update, destroy };
    }
    function DetailHeader({ onClose }) {
      const backBtn = createElement("button", {
        classList: [
          "mm__back-btn",
          "btn",
          "text-white",
          "position-absolute",
          "p-4",
          "d-md-none",
        ],
        children: [Icon("chevron-left").el],
      });
      const report = DetailReportIcon();
      report.el.classList.add("d-none", "d-md-block");
      const title = createElement("span");
      const versionText = createElement("span");
      const updateVersion = createElement("span");
      const updateBadge = createElement("div", {
        classList: ["badge", "badge-success", "badge-pill", "ml-1"],
        children: [
          Icon("arrow-circle-up", { classList: ["mr-1"] }).el,
          updateVersion,
        ],
      });
      const version = createElement("small", {
        classList: ["d-block", "text-muted", "font-w300", "ml-2"],
        children: [versionText, updateBadge],
      });
      const titleWrap = createElement("h5", {
        classList: [
          "text-combat-smoke",
          "text-center",
          "text-truncate",
          "mb-0",
          "px-4",
        ],
        children: [title, version],
      });
      const author = createElement("button", {
        classList: ["col-auto", "btn", "btn-link", "px-1"],
      });
      const authorWrap = createElement("h6", {
        classList: [
          "row",
          "no-gutters",
          "align-items-center",
          "justify-content-center",
          "text-muted",
          "mb-0",
          "px-4",
        ],
        children: [
          createElement("span", {
            classList: ["col-auto", "font-w300"],
            text: "by",
          }),
          author,
        ],
      });
      const wrapper = createElement("div", {
        classList: ["position-sticky", "my-2"],
        children: [backBtn, report.el, titleWrap, authorWrap],
      });
      const state = { mod: null, ioMod: null };
      function setMod(mod, ioMod) {
        state.mod = mod;
        state.ioMod = ioMod;
        report.setMod(ioMod);
        update(true);
      }
      function update(stopPropagation = false) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        report.el.classList.toggle(
          "invisible",
          ((_a = state.mod) === null || _a === void 0 ? void 0 : _a.id) ===
            creatorToolkitId ||
            ((_b = state.ioMod) === null || _b === void 0 ? void 0 : _b.id) ===
              creatorToolkitId
        );
        title.textContent =
          ((_c = state.mod) === null || _c === void 0 ? void 0 : _c.name) ||
          ((_d = state.ioMod) === null || _d === void 0 ? void 0 : _d.name) ||
          "-";
        author.textContent =
          ((_e = state.ioMod) === null || _e === void 0
            ? void 0
            : _e.submitted_by.username) ||
          ((_f = state.mod) === null || _f === void 0 ? void 0 : _f.author) ||
          "-";
        versionText.textContent = state.mod
          ? state.mod.version || "-"
          : ((_g = state.ioMod) === null || _g === void 0
              ? void 0
              : _g.modfile.version) || "-";
        const id = modId();
        const targetVersion = id
          ? store.state.preferLatestMods.has(id)
            ? store.state.preferLatestMods.get(id).version || "-"
            : state.ioMod
            ? state.ioMod.modfile.version || "-"
            : ((_h = state.mod) === null || _h === void 0
                ? void 0
                : _h.version) || "-"
          : "-";
        updateVersion.textContent = targetVersion;
        updateBadge.classList.toggle(
          "d-none",
          !state.mod || (state.mod.version || "-") === targetVersion
        );
        if (!stopPropagation) {
        }
      }
      function modId() {
        var _a, _b;
        return (
          ((_a = state.mod) === null || _a === void 0 ? void 0 : _a.id) ||
          ((_b = state.ioMod) === null || _b === void 0 ? void 0 : _b.id)
        );
      }
      function onClickAuthor() {
        if (!state.ioMod) return;
        openLink(state.ioMod.submitted_by.profile_url);
      }
      function onEnableLocalMode() {
        report.el.classList.remove("d-md-block");
      }
      author.addEventListener("click", onClickAuthor);
      backBtn.addEventListener("click", onClose);
      store.on("enableLocalMode", onEnableLocalMode);
      return { el: wrapper, setMod, update };
    }
    function DetailReportIcon() {
      const reportBtn = createElement("button", {
        classList: ["mm__report-icon", "btn", "text-danger"],
        attributes: [["type", "button"]],
        children: [Icon("flag", { fixedWidth: true, outline: true }).el],
      });
      const state = { mod: null };
      function setMod(mod) {
        state.mod = mod;
      }
      function onClick() {
        if (!state.mod) return;
        openLink(io.mods.reportUrl(state.mod.id));
      }
      reportBtn.addEventListener("click", onClick);
      return { el: reportBtn, setMod };
    }
    function DetailActions({ tab }) {
      const enableSwitch = DetailEnableSwitch(`mm__${tab}--enable-switch`);
      const ratingThumbs = RatingThumbs();
      ratingThumbs.el.classList.add("ml-auto");
      const actionBar = createElement("div", {
        classList: ["row", "no-gutters", "align-items-center", "px-2"],
        children: [enableSwitch.el, ratingThumbs.el],
      });
      const ratingBar = RatingBar();
      const wrapper = createElement("div", {
        children: [actionBar, ratingBar.el],
      });
      const state = { mod: null, ioMod: null };
      function setMod(mod, ioMod) {
        state.mod = mod;
        state.ioMod = ioMod;
        enableSwitch.setMod(state.mod, state.ioMod);
        ratingThumbs.setMod(state.ioMod);
        ratingBar.setMod(state.ioMod);
        update(true);
      }
      function update(stopPropagation = false) {
        if (!stopPropagation) {
          enableSwitch.update();
          ratingThumbs.update();
          ratingBar.update();
        }
      }
      function onEnableLocalMode() {
        ratingThumbs.el.classList.add("d-none");
        ratingBar.el.classList.add("d-none");
        enableSwitch.el.classList.add("mb-2");
      }
      store.on("enableLocalMode", onEnableLocalMode);
      return { el: wrapper, setMod, update };
    }
    function DetailEnableSwitch(id) {
      const input = createElement("input", {
        id,
        classList: ["custom-control-input"],
        attributes: [
          ["type", "checkbox"],
          ["name", id],
        ],
      });
      const label = createElement("label", {
        classList: ["custom-control-label"],
        attributes: [["for", id]],
        text: "Enabled",
      });
      const wrapper = createElement("div", {
        classList: [
          "custom-control",
          "custom-switch",
          "custom-control-success",
        ],
        children: [input, label],
      });
      const state = { mod: null, ioMod: null };
      function setMod(mod, ioMod) {
        state.mod = mod;
        state.ioMod = ioMod;
        update();
      }
      function update() {
        var _a, _b;
        const isInstalled =
          state.mod !== null ||
          (state.ioMod !== null && store.getters.isInstalled(state.ioMod.id));
        input.disabled = !isInstalled || store.state.disableAll;
        const isDisabled = isInstalled
          ? store.getters.isDisabled(
              ((_a = state.mod) === null || _a === void 0 ? void 0 : _a.id) ||
                ((_b = state.ioMod) === null || _b === void 0 ? void 0 : _b.id)
            )
          : true;
        input.checked = !isDisabled;
        label.textContent = isDisabled ? "Disabled" : "Enabled";
        wrapper.classList.toggle("d-none", !isInstalled);
      }
      function onToggle() {
        var _a, _b, _c;
        const isInstalled =
          state.mod ||
          store.getters.isInstalled(
            (_a = state.ioMod) === null || _a === void 0 ? void 0 : _a.id
          );
        if (!isInstalled) return;
        const modId =
          ((_b = state.mod) === null || _b === void 0 ? void 0 : _b.id) ||
          ((_c = state.ioMod) === null || _c === void 0 ? void 0 : _c.id);
        if (modId) {
          if (input.checked) store.actions.enable(modId);
          else store.actions.disable(modId);
        }
        update();
      }
      function onChangeDisableAll() {
        update();
      }
      input.addEventListener("change", onToggle);
      store.on("changeDisableAll", onChangeDisableAll);
      return { el: wrapper, setMod, update };
    }
    function RatingThumbs() {
      const thumbBtn = (icon) =>
        createElement("button", {
          classList: ["btn", "text-muted", "p-1"],
          children: [icon.el],
        });
      const thumbsUpIcon = Icon("thumbs-up", {
        outline: true,
        fixedWidth: true,
        size: "lg",
      });
      const thumbsUpBtn = thumbBtn(thumbsUpIcon);
      const ratingPositiveCount = createElement("span", {
        classList: ["mr-2"],
        text: "0",
      });
      const thumbsDownIcon = Icon("thumbs-down", {
        outline: true,
        fixedWidth: true,
        size: "lg",
      });
      const thumbsDownBtn = thumbBtn(thumbsDownIcon);
      const ratingNegativeCount = createElement("span", { text: "0" });
      const ratingActionWrapper = createElement("div", {
        children: [
          thumbsUpBtn,
          ratingPositiveCount,
          thumbsDownBtn,
          ratingNegativeCount,
        ],
      });
      const state = { mod: null, processing: false };
      function setMod(mod) {
        state.mod = mod;
        state.processing = false;
        update();
      }
      function update() {
        var _a;
        const rating = store.getters.rating(
          (_a = state.mod) === null || _a === void 0 ? void 0 : _a.id
        );
        thumbsUpIcon.toggleOutline(!(rating > 0));
        thumbsDownIcon.toggleOutline(!(rating < 0));
        ratingPositiveCount.textContent = state.mod
          ? formatNumber(state.mod.stats.ratings_positive)
          : "0";
        ratingNegativeCount.textContent = state.mod
          ? formatNumber(state.mod.stats.ratings_negative)
          : "0";
      }
      function onClickThumbsUp() {
        return __awaiter(this, void 0, void 0, function* () {
          if (!state.mod) return;
          if (state.processing) return;
          state.processing = true;
          const wasThumbsUp = store.getters.rating(state.mod.id) > 0;
          thumbsUpIcon.toggleOutline(wasThumbsUp);
          thumbsDownIcon.toggleOutline(true);
          if (wasThumbsUp) yield store.actions.unthumbs(state.mod.id);
          else yield store.actions.thumbsUp(state.mod.id);
          state.processing = false;
        });
      }
      function onClickThumbsDown() {
        return __awaiter(this, void 0, void 0, function* () {
          if (!state.mod) return;
          if (state.processing) return;
          state.processing = true;
          const wasThumbsDown = store.getters.rating(state.mod.id) < 0;
          thumbsDownIcon.toggleOutline(wasThumbsDown);
          thumbsUpIcon.toggleOutline(true);
          if (wasThumbsDown) yield store.actions.unthumbs(state.mod.id);
          else yield store.actions.thumbsDown(state.mod.id);
          state.processing = false;
        });
      }
      thumbsUpBtn.addEventListener("click", onClickThumbsUp);
      thumbsDownBtn.addEventListener("click", onClickThumbsDown);
      return { el: ratingActionWrapper, setMod, update };
    }
    function RatingBar() {
      const positiveRatingBar = createElement("div", {
        classList: ["progress-bar", "mm__no-transition", "bg-success"],
      });
      const ratingBar = createElement("div", {
        classList: ["progress", "mm__progress--thin", "mb-2"],
        children: [positiveRatingBar],
      });
      const state = { mod: null };
      function setMod(mod) {
        state.mod = mod;
        update();
      }
      function update() {
        var _a;
        positiveRatingBar.style.width = `${
          state.mod ? state.mod.stats.ratings_percentage_positive : 0
        }%`;
        ratingBar.classList.toggle(
          "bg-danger",
          (((_a = state.mod) === null || _a === void 0
            ? void 0
            : _a.stats.ratings_total) || 0) > 0
        );
      }
      return { el: ratingBar, setMod, update };
    }
    function DetailReleaseSelector() {
      const btn = (text) =>
        createElement("button", {
          classList: ["btn", "btn-outline-info"],
          attributes: [["type", "button"]],
          text,
        });
      const liveBtn = btn("Live");
      const latestBtn = btn("Latest");
      const btnGroup = createElement("div", {
        classList: ["btn-group", "btn-group-sm", "w-100"],
        attributes: [["role", "group"]],
        children: [liveBtn, latestBtn],
      });
      const wrapper = createElement("div", {
        classList: ["mt-2"],
        children: [
          createElement("i", {
            classList: ["fas", "fa-asterisk", "fa-xs", "text-warning", "mr-1"],
          }),
          createElement("span", {
            classList: ["font-size-sm", "font-weight-bold"],
            text: "Use Release",
          }),
          btnGroup,
        ],
      });
      const state = { mod: null };
      function setMod(mod) {
        state.mod = mod;
        update();
      }
      function update() {
        wrapper.classList.toggle(
          "d-none",
          !state.mod ||
            !store.getters.isSubscribed(state.mod.id) ||
            !store.getters.isModDev(state.mod.id)
        );
        const preferLatest = state.mod
          ? store.state.preferLatestMods.has(state.mod.id)
          : false;
        liveBtn.classList.toggle("btn-outline-info", preferLatest);
        liveBtn.classList.toggle("btn-info", !preferLatest);
        latestBtn.classList.toggle("btn-outline-info", !preferLatest);
        latestBtn.classList.toggle("btn-info", preferLatest);
      }
      function onClickLive() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
          if (
            !store.getters.isLatestPreferred(
              (_a = state.mod) === null || _a === void 0 ? void 0 : _a.id
            )
          )
            return;
          yield setPreferredRelease(false);
        });
      }
      function onClickLatest() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
          if (
            store.getters.isLatestPreferred(
              (_a = state.mod) === null || _a === void 0 ? void 0 : _a.id
            )
          )
            return;
          yield setPreferredRelease(true);
        });
      }
      function setPreferredRelease(preferLatest) {
        return __awaiter(this, void 0, void 0, function* () {
          if (!state.mod) return;
          if (!store.getters.isModDev(state.mod.id)) return;
          liveBtn.classList.toggle("btn-outline-info", preferLatest);
          liveBtn.classList.toggle("btn-info", !preferLatest);
          latestBtn.classList.toggle("btn-outline-info", !preferLatest);
          latestBtn.classList.toggle("btn-info", preferLatest);
          liveBtn.disabled = true;
          latestBtn.disabled = true;
          if (!preferLatest) store.actions.setPreferredLive(state.mod);
          else yield store.actions.setPreferredLatest(state.mod);
          yield store.actions.waitForQueues();
          liveBtn.disabled = false;
          latestBtn.disabled = false;
        });
      }
      liveBtn.addEventListener("click", onClickLive);
      latestBtn.addEventListener("click", onClickLatest);
      return { el: wrapper, setMod, update };
    }
    function DetailSubBtn() {
      const subBtn = createElement("button", {
        classList: ["btn", "btn-success", "btn-block", "my-0"],
        attributes: [["type", "button"]],
        children: [Icon("plus", { classList: ["mr-2"] }).el, "Subscribe"],
      });
      const unsubBtn = createElement("button", {
        classList: ["btn", "btn-danger", "btn-block", "my-0"],
        attributes: [["type", "button"]],
        children: [Icon("times", { classList: ["mr-2"] }).el, "Unsubscribe"],
      });
      const wrapper = createElement("div", {
        classList: ["my-2"],
        children: [subBtn, unsubBtn],
      });
      const state = { mod: null, ioMod: null };
      function setMod(mod, ioMod) {
        state.mod = mod;
        state.ioMod = ioMod;
        update();
      }
      function modId() {
        var _a, _b;
        return (
          ((_a = state.mod) === null || _a === void 0 ? void 0 : _a.id) ||
          ((_b = state.ioMod) === null || _b === void 0 ? void 0 : _b.id)
        );
      }
      function update() {
        const id = modId();
        const isSubscibed = store.getters.isSubscribed(id);
        subBtn.classList.toggle("d-none", isSubscibed);
        unsubBtn.classList.toggle("d-none", !isSubscibed);
        const isBeingSubscribed = store.getters
          .beingSubscribed()
          .some((id) => id === id);
        subBtn.disabled = isBeingSubscribed;
        unsubBtn.disabled = isBeingSubscribed;
      }
      function destroy() {
        bus.off(
          bus.source.SUBSCRIBE_QUEUE,
          bus.event.BEGIN,
          onSubscribeOrUnsubscribeBegin
        );
        bus.off(
          bus.source.UNSUBSCRIBE_QUEUE,
          bus.event.BEGIN,
          onSubscribeOrUnsubscribeBegin
        );
        wrapper.remove();
      }
      function onClickSubscribe() {
        return __awaiter(this, void 0, void 0, function* () {
          if (!state.mod && !state.ioMod) return;
          if (!state.ioMod && state.mod)
            state.ioMod = yield store.getters.mod(state.mod.id);
          if (state.ioMod) store.actions.subscribe(state.ioMod);
        });
      }
      function onClickUnsubscribe() {
        return __awaiter(this, void 0, void 0, function* () {
          if (!state.mod && !state.ioMod) return;
          if (!state.ioMod && state.mod)
            state.ioMod = yield store.getters.mod(state.mod.id);
          if (state.ioMod) store.actions.unsubscribe(state.ioMod);
        });
      }
      function onSubscribeOrUnsubscribeBegin(e) {
        const { input } = e;
        if ((!state.mod && !state.ioMod) || modId() !== input.id) return;
        subBtn.disabled = true;
        unsubBtn.disabled = true;
      }
      subBtn.addEventListener("click", onClickSubscribe);
      unsubBtn.addEventListener("click", onClickUnsubscribe);
      bus.on(
        bus.source.SUBSCRIBE_QUEUE,
        bus.event.BEGIN,
        onSubscribeOrUnsubscribeBegin
      );
      bus.on(
        bus.source.UNSUBSCRIBE_QUEUE,
        bus.event.BEGIN,
        onSubscribeOrUnsubscribeBegin
      );
      return { el: wrapper, setMod, update, destroy };
    }
    function DetailBox() {
      const section = () => createElement("div", { classList: ["mb-1"] });
      const heading = (text, parent) =>
        createElement("h6", {
          classList: ["text-muted", "d-inline-block", "mr-2", "mb-0"],
          children: [createElement("small", { text })],
          parent,
        });
      const tagGroup = (parent) =>
        createElement("div", { classList: ["d-inline"], parent });
      const tag = (text, color, parent) =>
        createElement("span", {
          classList: ["badge", `badge-${color || "light"}`, "mr-1"],
          text,
          parent,
        });
      const gameVersionSection = section();
      heading("Game Version", gameVersionSection);
      const gameVersionTagGroup = tagGroup(gameVersionSection);
      const gameVersionTag = tag(
        gameVersion.substring(1),
        "success",
        gameVersionTagGroup
      );
      const platformSection = section();
      heading("Platform", platformSection);
      const platformTagGroup = tagGroup(platformSection);
      const typeSection = section();
      heading("Type", typeSection);
      const typeTagGroup = tagGroup(typeSection);
      const changelogSection = section();
      heading("Changelog", changelogSection);
      const changelog = createElement("ul", {
        classList: ["font-size-sm", "pl-4", "mb-0"],
        parent: changelogSection,
      });
      const summarySection = section();
      heading("Summary", summarySection);
      const summary = createElement("div", {
        classList: ["font-size-sm"],
        parent: summarySection,
      });
      const summaryText = createElement("span", { parent: summary });
      const moreBtn = createElement("a", {
        classList: ["pointer-enabled"],
        text: " More...",
        parent: summary,
      });
      moreBtn.addEventListener("click", () => {
        moreBtn.classList.add("d-none");
        descriptionSection.classList.remove("d-none");
      });
      const descriptionSection = section();
      heading("Description", descriptionSection);
      const description = createElement("div", {
        classList: ["mm__mod-description", "font-size-sm"],
        parent: descriptionSection,
      });
      description.addEventListener("click", (e) => {
        if (e.target instanceof HTMLAnchorElement) {
          openLink(e.target.href);
          e.preventDefault();
          return false;
        }
      });
      const wrapper = createElement("div", {
        classList: ["mb-2"],
        children: [
          gameVersionSection,
          platformSection,
          typeSection,
          changelogSection,
          summarySection,
          descriptionSection,
        ],
      });
      const state = { mod: null, ioMod: null };
      function setMod(mod, ioMod) {
        state.mod = mod;
        state.ioMod = ioMod;
        update();
      }
      function update() {
        var _a, _b, _c, _d, _e, _f, _g;
        while (platformTagGroup.firstChild)
          platformTagGroup.removeChild(platformTagGroup.firstChild);
        while (typeTagGroup.firstChild)
          typeTagGroup.removeChild(typeTagGroup.firstChild);
        while (changelog.firstChild)
          changelog.removeChild(changelog.firstChild);
        const tags =
          ((_a = state.mod) === null || _a === void 0 ? void 0 : _a.tags) ||
          ((_b = state.ioMod) === null || _b === void 0
            ? void 0
            : _b.categorized_tags);
        const isUpToDate =
          !tags || gameVersion.substring(1) === tags.supportedGameVersion;
        gameVersionTag.classList.toggle("badge-success", isUpToDate);
        gameVersionTag.classList.toggle("badge-warning", !isUpToDate);
        gameVersionTag.textContent =
          (tags === null || tags === void 0
            ? void 0
            : tags.supportedGameVersion) || "-.-.-";
        changelogSection.classList.toggle(
          "d-none",
          !((_c = state.mod) === null || _c === void 0 ? void 0 : _c.changelog)
        );
        if (
          (_d = state.mod) === null || _d === void 0 ? void 0 : _d.changelog
        ) {
          state.mod.changelog.split("\n").forEach((c) => {
            changelog.append(createElement("li", { text: c }));
          });
        }
        summaryText.textContent =
          ((_e = state.mod) === null || _e === void 0
            ? void 0
            : _e.description) ||
          ((_f = state.ioMod) === null || _f === void 0
            ? void 0
            : _f.summary) ||
          null;
        moreBtn.classList.toggle(
          "d-none",
          !state.ioMod || !state.ioMod.description
        );
        descriptionSection.classList.add("d-none");
        description.innerHTML =
          ((_g = state.ioMod) === null || _g === void 0
            ? void 0
            : _g.description) || "";
        if (tags) {
          for (const platform of tags.platforms)
            tag(platform, "dark", platformTagGroup);
          for (const type of tags.types) tag(type, "dark", typeTagGroup);
        }
      }
      return { el: wrapper, setMod, update };
    }
    function Browse() {
      const gridView = BrowseGridView({ onSelectMod });
      const listView = BrowseListView({ onSelectMod });
      const noResults = createElement("div", {
        classList: [
          "mm__cover",
          "align-items-center",
          "justify-content-center",
          "text-center",
          "font-size-sm",
          "d-none",
        ],
        children: [createElement("span", { children: ["No results."] })],
      });
      const viewWrapper = createElement("div", {
        classList: ["position-relative", "h-100"],
        children: [gridView.el, listView.el, noResults],
      });
      const toolbar = BrowseToolbar({
        onSort,
        onFilter,
        onChangeView,
        onSearch,
      });
      const pagerBar = BrowsePagerBar({
        onPagerPrevious,
        onPagerNext,
        onToggleToolbar,
      });
      const progress = CircularProgress();
      progress.hide();
      const main = createElement("main", {
        classList: [
          "col-12",
          "col-md-6",
          "col-lg-7",
          "col-xl-8",
          "d-flex",
          "d-md-flex",
          "flex-column",
        ],
        children: [toolbar.el, viewWrapper, pagerBar.el, progress.el],
      });
      const detailsPane = DetailPane({
        tab: "browse",
        onClose: onCloseDetails,
      });
      const detail = createElement("aside", {
        classList: [
          "col-12",
          "col-md-6",
          "col-lg-5",
          "col-xl-4",
          "d-none",
          "flex-column",
          "d-md-block",
        ],
        children: [detailsPane.el],
      });
      const wrapper = createElement("div", {
        classList: ["row", "h-100"],
        children: [main, detail],
      });
      const state = {
        search: "",
        sort: SortOption.Trending,
        tags: [],
        page: 1,
        maxPage: 1,
        view: "grid",
      };
      function onSort(sort) {
        state.sort = sort;
        state.page = 1;
        getMods();
      }
      function onFilter(tags, preventRefresh = false) {
        state.tags = tags;
        state.page = 1;
        if (!preventRefresh) getMods();
      }
      function onSearch(search) {
        state.search = search;
        state.page = 1;
        getMods();
      }
      function onPagerPrevious() {
        if (state.page < 2) return;
        state.page--;
        getMods();
      }
      function onPagerNext() {
        if (state.page >= state.maxPage) return;
        state.page++;
        getMods();
      }
      function setSearch(search) {
        toolbar.setSearch(search);
      }
      function getMods() {
        return __awaiter(this, void 0, void 0, function* () {
          if (store.getters.usingLocalMode()) return;
          progress.show();
          gridView.el.classList.add("mm__loading");
          listView.el.classList.add("mm__loading");
          const result = yield store.getters.mods(
            state.sort,
            { page: state.page, pageSize: io.mods.pageSize },
            state.search,
            state.tags
          );
          noResults.classList.toggle("d-flex", result.result_count === 0);
          noResults.classList.toggle("d-none", result.result_count > 0);
          state.maxPage = Math.ceil(result.result_total / result.result_limit);
          gridView.setMods(result.data);
          listView.setMods(result.data);
          pagerBar.pager.setPageData(result);
          progress.hide();
          gridView.el.classList.remove("mm__loading");
          listView.el.classList.remove("mm__loading");
        });
      }
      function onToggleToolbar(show) {
        toolbar.el.classList.toggle("d-none", !show);
      }
      function onChangeView(view) {
        state.view = view;
        update();
      }
      function onSelectMod(mod) {
        detailsPane.setMod(null, mod);
        detail.classList.add("d-flex");
        detail.classList.remove("d-none");
        main.classList.add("d-none");
        main.classList.remove("d-flex");
      }
      function update() {
        gridView.gridEl.classList.toggle("d-none", state.view !== "grid");
        gridView.gridEl.classList.toggle("invisible", state.view !== "grid");
        listView.el.classList.toggle("d-flex", state.view === "list");
        listView.el.classList.toggle("d-none", state.view !== "list");
      }
      function onCloseDetails() {
        detail.classList.remove("d-flex");
        detail.classList.add("d-none");
        main.classList.remove("d-none");
        main.classList.add("d-flex");
      }
      function close() {
        detailsPane.setMod(null, null);
        onCloseDetails();
      }
      return { el: wrapper, close, getMods, update, setSearch };
    }
    function BrowseGridView({ onSelectMod }) {
      const grid = createElement("div", {
        classList: [
          "row",
          "row-deck",
          "align-content-start",
          "mm__flex-expand--no-xl",
          "d-xl-flex",
          "mb-4",
        ],
      });
      const gridItems = [];
      for (let i = 0; i < io.mods.pageSize; i++) {
        const item = BrowserGridItem({ onSelectMod });
        const col = createElement("div", {
          classList: ["col-6", "col-lg-4", "col-xl-3"],
          children: [item.el],
        });
        grid.appendChild(col);
        gridItems.push(item);
      }
      const wrapper = createElement("div", {
        classList: ["mm__grid-view", "d-flex", "flex-column", "w-100", "h-100"],
        children: [grid],
      });
      const state = { mods: [] };
      function setMods(mods) {
        state.mods = mods;
        update();
      }
      function update() {
        const modCount = state.mods.length;
        for (let i = 0; i < gridItems.length; i++) {
          gridItems[i].setMod(i < modCount ? state.mods[i] : null);
        }
      }
      grid.addEventListener("touchmove", (e) => e.stopPropagation());
      return { el: wrapper, gridEl: grid, setMods, update };
    }
    function BrowserGridItem({ onSelectMod }) {
      const stats = BrowseModStats();
      stats.el.classList.add("row", "no-gutters");
      stats.ratingEl.classList.add("col-auto");
      stats.subscribersEl.classList.add("col", "text-right");
      const devMark = createElement("i", {
        classList: [
          "fa",
          "fa-asterisk",
          "text-warning",
          "mr-1",
          "col-auto",
          "d-none",
        ],
      });
      const title = createElement("div", {
        classList: ["text-truncate", "col"],
        text: "...",
      });
      const quickSub = BrowseGridItemQuickSub();
      quickSub.el.classList.add("col-auto");
      const titleWrap = createElement("div", {
        classList: [
          "row",
          "no-gutters",
          "align-items-center",
          "justify-content-center",
        ],
        children: [devMark, title, quickSub.el],
      });
      const header = createElement("h3", {
        classList: ["block-title"],
        children: [titleWrap, stats.el],
      });
      const headerWrap = createElement("div", {
        classList: ["py-1", "px-2"],
        children: [header],
      });
      const previewImage = createElement("img", {
        classList: ["img-fluid", "rounded-top"],
        attributes: [
          [
            "src",
            cdnMedia("assets/media/mods/placeholder_thumbnail-320x180.png"),
          ],
        ],
      });
      const versionRibbon = BrowseGameVersionRibbon();
      const previewWrap = createElement("div", {
        classList: ["card-img-top", "position-relative", "text-center"],
        children: [previewImage, versionRibbon.el],
      });
      const wrapper = createElement("a", {
        classList: [
          "mm__grid-item",
          "block",
          "block-rounded",
          "block-link-pop",
          "pointer-enabled",
        ],
        children: [previewWrap, headerWrap],
      });
      const state = { mod: null };
      function setMod(mod) {
        if (state.mod)
          bus.off(bus.source.MOD(state.mod.id), bus.event.REFRESH, onRefresh);
        previewImage.src = cdnMedia(
          "assets/media/mods/placeholder_thumbnail-320x180.png"
        );
        state.mod = mod;
        stats.setMod(state.mod);
        quickSub.setMod(state.mod);
        versionRibbon.setMod(state.mod);
        if (state.mod)
          bus.on(bus.source.MOD(state.mod.id), bus.event.REFRESH, onRefresh);
        update(true);
      }
      function update(stopPropagation = false) {
        var _a, _b;
        wrapper.classList.toggle("invisible", !state.mod);
        wrapper.classList.toggle("d-none", !state.mod);
        wrapper.classList.toggle("d-xl-block", !state.mod);
        devMark.classList.toggle(
          "d-none",
          !state.mod || !store.getters.isModDev(state.mod.id)
        );
        title.textContent =
          ((_a = state.mod) === null || _a === void 0 ? void 0 : _a.name) ||
          "...";
        previewImage.src =
          ((_b = state.mod) === null || _b === void 0
            ? void 0
            : _b.logo.thumb_320x180) ||
          cdnMedia("assets/media/mods/placeholder_thumbnail-320x180.png");
        if (!stopPropagation) {
          stats.update();
          quickSub.update();
          versionRibbon.update();
        }
      }
      function destroy() {
        if (state.mod)
          bus.off(bus.source.MOD(state.mod.id), bus.event.REFRESH, onRefresh);
      }
      function onRefresh() {
        update();
      }
      function onClick() {
        if (!state.mod) return;
        onSelectMod(state.mod);
      }
      wrapper.addEventListener("click", onClick);
      return { el: wrapper, setMod, update, destroy };
    }
    function BrowseListView({ onSelectMod }) {
      const list = createElement("div", {
        classList: ["mm__flex-expand", "mb-4"],
      });
      const listItems = [];
      for (let i = 0; i < io.mods.pageSize; i++) {
        const item = BrowserListItem({ onSelectMod });
        list.appendChild(item.el);
        listItems.push(item);
      }
      const wrapper = createElement("div", {
        classList: ["mm__list-view", "flex-column", "w-100", "h-100"],
        children: [list],
      });
      const state = { mods: [] };
      function setMods(mods) {
        state.mods = mods;
        update();
      }
      function update() {
        const modCount = state.mods.length;
        for (let i = 0; i < listItems.length; i++) {
          listItems[i].setMod(i < modCount ? state.mods[i] : null);
        }
      }
      list.addEventListener("touchmove", (e) => e.stopPropagation());
      return { el: wrapper, setMods, update };
    }
    function BrowserListItem({ onSelectMod }) {
      const smallPreview = createElement("img", {
        classList: [
          "col-auto",
          "mm__preview-img--80px",
          "d-none",
          "d-lg-block",
          "mr-4",
        ],
        attributes: [
          [
            "src",
            cdnMedia("assets/media/mods/placeholder_thumbnail-320x180.png"),
          ],
        ],
      });
      const stats = BrowseModStats();
      stats.el.classList.add("d-block", "d-lg-none", "mt-1");
      stats.ratingEl.classList.add("d-inline-block", "mr-2");
      stats.subscribersEl.classList.add("d-inline-block");
      const statsLg = BrowseModStats();
      statsLg.el.classList.add(
        "col-2",
        "d-none",
        "d-lg-block",
        "pl-2",
        "pl-xl-4"
      );
      statsLg.ratingEl.classList.add("mb-1");
      const devMark = createElement("i", {
        classList: ["fa", "fa-asterisk", "text-warning", "mr-1", "d-none"],
      });
      const title = createElement("span", {
        classList: ["mm__list-item--title"],
        text: "",
      });
      const titleWrapper = createElement("div", {
        classList: ["col", "text-truncate"],
        children: [devMark, title, stats.el],
      });
      const gameVersion = GameVersionBadge({ showOnUpToDate: true });
      const gameVersionWrapper = createElement("div", {
        classList: ["col-auto", "mr-4"],
        children: [gameVersion.el],
      });
      const quickSub = BrowseListItemQuickSub();
      quickSub.el.classList.add("col-auto", "align-self-stretch");
      const flexWrap = createElement("div", {
        classList: ["row", "no-gutters", "align-items-center", "p-2"],
        children: [
          smallPreview,
          titleWrapper,
          statsLg.el,
          gameVersionWrapper,
          quickSub.el,
        ],
      });
      const wrapper = createElement("a", {
        classList: [
          "mm__list-item",
          "block",
          "block-rounded",
          "block-link-pop",
          "pointer-enabled",
          "mb-2",
        ],
        children: [flexWrap],
      });
      const state = { mod: null };
      function setMod(mod) {
        if (state.mod)
          bus.off(bus.source.MOD(state.mod.id), bus.event.REFRESH, onRefresh);
        smallPreview.src = cdnMedia(
          "assets/media/mods/placeholder_thumbnail-320x180.png"
        );
        state.mod = mod;
        stats.setMod(state.mod);
        statsLg.setMod(state.mod);
        gameVersion.setMod(state.mod);
        quickSub.setMod(state.mod);
        if (state.mod)
          bus.on(bus.source.MOD(state.mod.id), bus.event.REFRESH, onRefresh);
        update(true);
      }
      function update(stopPropagation = false) {
        var _a, _b;
        wrapper.classList.toggle("d-none", !state.mod);
        smallPreview.src =
          ((_a = state.mod) === null || _a === void 0
            ? void 0
            : _a.logo.thumb_320x180) ||
          cdnMedia("assets/media/mods/placeholder_thumbnail-320x180.png");
        devMark.classList.toggle(
          "d-none",
          !state.mod || !store.getters.isModDev(state.mod.id)
        );
        title.textContent =
          ((_b = state.mod) === null || _b === void 0 ? void 0 : _b.name) || "";
        if (!stopPropagation) {
          stats.update();
          statsLg.update();
          gameVersion.update();
          quickSub.update();
        }
      }
      function destroy() {
        if (state.mod)
          bus.off(bus.source.MOD(state.mod.id), bus.event.REFRESH, onRefresh);
      }
      function onRefresh() {
        update();
      }
      function onClick() {
        if (!state.mod) return;
        onSelectMod(state.mod);
      }
      wrapper.addEventListener("click", onClick);
      return { el: wrapper, setMod, update, destroy };
    }
    function BrowseGameVersionRibbon() {
      const versionText = createElement("small", { text: "-.-.-" });
      const icon = Icon("check-circle", { classList: ["fa-xs", "mr-1"] });
      const ribbon = createElement("div", {
        classList: [
          "mm__version-ribbon",
          "h6",
          "bg-success",
          "text-white",
          "rounded-left",
          "row",
          "no-gutters",
          "align-items-center",
          "py-1",
          "px-2",
        ],
        children: [icon.el, versionText],
      });
      const state = { mod: null };
      function setMod(mod) {
        state.mod = mod;
        update();
      }
      function update() {
        var _a;
        const isUpToDate =
          !state.mod ||
          state.mod.categorized_tags.supportedGameVersion ===
            gameVersion.substring(1);
        versionText.textContent =
          ((_a = state.mod) === null || _a === void 0
            ? void 0
            : _a.categorized_tags.supportedGameVersion) || "-.-.-";
        ribbon.classList.toggle("bg-success", isUpToDate);
        ribbon.classList.toggle("bg-warning", !isUpToDate);
        icon.setIcon(isUpToDate ? "check-circle" : "exclamation-triangle");
      }
      return { el: ribbon, setMod, update };
    }
    function BrowseGridItemQuickSub() {
      const icon = (name, customClass, color) =>
        Icon(name, {
          classList: [customClass, `text-${color}`],
          fixedWidth: true,
          size: "lg",
        });
      const subCheck = icon("check-circle", "mm__quick-sub--check", "success");
      const subBtn = icon("plus", "mm__quick-sub--sub", "success");
      const unsubBtn = icon("times", "mm__quick-sub--unsub", "danger");
      const subProgress = icon("spinner", "mm__quick-sub--progress", "muted");
      subProgress.togglePulse(true);
      const wrapper = createElement("div", {
        classList: ["mm__quick-sub"],
        children: [subCheck.el, subBtn.el, unsubBtn.el, subProgress.el],
      });
      const state = { mod: null };
      function setMod(mod) {
        state.mod = mod;
        update();
      }
      function update() {
        var _a;
        wrapper.classList.toggle(
          "mm__quick-sub--subscribed",
          store.getters.isSubscribed(
            (_a = state.mod) === null || _a === void 0 ? void 0 : _a.id
          )
        );
        wrapper.classList.toggle(
          "mm__quick-sub--in-progress",
          store.getters.beingSubscribed().some((id) => {
            var _a;
            return (
              id ===
              ((_a = state.mod) === null || _a === void 0 ? void 0 : _a.id)
            );
          })
        );
      }
      function destroy() {
        bus.off(
          bus.source.SUBSCRIBE_QUEUE,
          bus.event.BEGIN,
          onSubscribeOrUnsubscribeBegin
        );
        bus.off(
          bus.source.UNSUBSCRIBE_QUEUE,
          bus.event.BEGIN,
          onSubscribeOrUnsubscribeBegin
        );
      }
      function onClickSubscribe(e) {
        e.stopPropagation();
        if (!state.mod) return;
        store.actions.subscribe(state.mod);
      }
      function onClickUnsubscribe(e) {
        e.stopPropagation();
        if (!state.mod) return;
        store.actions.unsubscribe(state.mod);
      }
      function onSubscribeOrUnsubscribeBegin(e) {
        const { input } = e;
        if (!state.mod || state.mod.id !== input.id) return;
        wrapper.classList.add("mm__quick-sub--in-progress");
      }
      subBtn.el.addEventListener("click", onClickSubscribe);
      unsubBtn.el.addEventListener("click", onClickUnsubscribe);
      bus.on(
        bus.source.SUBSCRIBE_QUEUE,
        bus.event.BEGIN,
        onSubscribeOrUnsubscribeBegin
      );
      bus.on(
        bus.source.UNSUBSCRIBE_QUEUE,
        bus.event.BEGIN,
        onSubscribeOrUnsubscribeBegin
      );
      return { el: wrapper, setMod, update, destroy };
    }
    function BrowseListItemQuickSub() {
      const subBtn = createElement("button", {
        classList: ["btn", "btn-dark", "text-success", "h-100"],
        attributes: [["type", "button"]],
        children: [Icon("plus", { fixedWidth: true }).el],
      });
      const unsubBtn = createElement("button", {
        classList: ["btn", "btn-dark", "text-danger", "d-none", "h-100"],
        attributes: [["type", "button"]],
        children: [Icon("times", { fixedWidth: true }).el],
      });
      const wrapper = createElement("div", { children: [subBtn, unsubBtn] });
      const state = { mod: null };
      function setMod(mod) {
        state.mod = mod;
        update();
      }
      function update() {
        var _a;
        const isSubscibed = store.getters.isSubscribed(
          (_a = state.mod) === null || _a === void 0 ? void 0 : _a.id
        );
        subBtn.classList.toggle("d-none", isSubscibed);
        unsubBtn.classList.toggle("d-none", !isSubscibed);
        const isBeingSubscribed = store.getters.beingSubscribed().some((id) => {
          var _a;
          return (
            id === ((_a = state.mod) === null || _a === void 0 ? void 0 : _a.id)
          );
        });
        subBtn.disabled = isBeingSubscribed;
        unsubBtn.disabled = isBeingSubscribed;
      }
      function destroy() {
        bus.off(
          bus.source.SUBSCRIBE_QUEUE,
          bus.event.BEGIN,
          onSubscribeOrUnsubscribeBegin
        );
        bus.off(
          bus.source.UNSUBSCRIBE_QUEUE,
          bus.event.BEGIN,
          onSubscribeOrUnsubscribeBegin
        );
        wrapper.remove();
      }
      function onClickSubscribe(e) {
        e.stopPropagation();
        if (!state.mod) return;
        store.actions.subscribe(state.mod);
      }
      function onClickUnsubscribe(e) {
        e.stopPropagation();
        if (!state.mod) return;
        store.actions.unsubscribe(state.mod);
      }
      function onSubscribeOrUnsubscribeBegin(e) {
        const { input } = e;
        if (!state.mod || state.mod.id !== input.id) return;
        subBtn.disabled = true;
        unsubBtn.disabled = true;
      }
      subBtn.addEventListener("click", onClickSubscribe);
      unsubBtn.addEventListener("click", onClickUnsubscribe);
      bus.on(
        bus.source.SUBSCRIBE_QUEUE,
        bus.event.BEGIN,
        onSubscribeOrUnsubscribeBegin
      );
      bus.on(
        bus.source.UNSUBSCRIBE_QUEUE,
        bus.event.BEGIN,
        onSubscribeOrUnsubscribeBegin
      );
      return { el: wrapper, setMod, update, destroy };
    }
    function BrowseModStats() {
      const icon = (name) => Icon(name, { classList: ["mr-1"] }).el;
      const statWrap = (icon, text) =>
        createElement("div", {
          classList: ["mm__dim"],
          children: [icon, text],
        });
      const ratingText = createElement("span", { text: "0%" });
      const rating = statWrap(icon("thumbs-up"), ratingText);
      const subscribersText = createElement("span", { text: "0" });
      const subscribers = statWrap(icon("star"), subscribersText);
      const wrapper = createElement("div", {
        classList: ["font-size-sm"],
        children: [rating, subscribers],
      });
      const state = { mod: null };
      function setMod(mod) {
        state.mod = mod;
        update();
      }
      function update() {
        var _a, _b;
        ratingText.textContent = `${
          ((_a = state.mod) === null || _a === void 0
            ? void 0
            : _a.stats.ratings_percentage_positive) || 0
        }%`;
        subscribersText.textContent = formatNumber(
          ((_b = state.mod) === null || _b === void 0
            ? void 0
            : _b.stats.subscribers_total) || 0
        );
      }
      return {
        el: wrapper,
        ratingEl: rating,
        subscribersEl: subscribers,
        setMod,
        update,
      };
    }
    function BrowseToolbar({ onSort, onFilter, onSearch, onChangeView }) {
      const sortDropdown = BrowseSortDropdown({ onSort });
      sortDropdown.el.classList.add(
        "col",
        "col-sm-auto",
        "col-md",
        "col-lg-auto",
        "ml-0",
        "ml-sm-2",
        "ml-md-0",
        "ml-lg-2",
        "mr-2"
      );
      const filterDropdown = BrowseFilterDropdown({ onFilter });
      filterDropdown.el.classList.add("col-auto", "mr-2");
      const viewSelector = BrowseViewSelector({ onChangeView });
      viewSelector.el.classList.add("col-auto");
      const searchBar = BrowseSearchBar({ onSearch });
      searchBar.el.classList.add(
        "col-12",
        "col-sm",
        "col-md-12",
        "col-lg",
        "mb-2",
        "mb-sm-0",
        "mb-md-2",
        "mb-lg-0"
      );
      const wrapper = createElement("div", {
        classList: [
          "row",
          "no-gutters",
          "justify-content-between",
          "mb-sm-4",
          "order-1",
          "order-sm-0",
          "d-none",
          "d-sm-flex",
        ],
        children: [
          searchBar.el,
          sortDropdown.el,
          filterDropdown.el,
          viewSelector.el,
        ],
      });
      return { el: wrapper, setSearch: searchBar.setSearch };
    }
    function BrowseSearchBar({ onSearch }) {
      const input = createElement("input", {
        classList: ["mm__search-box", "form-control", "form-control-alt"],
        attributes: [
          ["type", "text"],
          ["placeholder", "Search..."],
        ],
      });
      const inputGroup = createElement("div", {
        classList: ["input-group"],
        children: [input],
      });
      const state = { searchDebounce: null };
      function onInput() {
        if (state.searchDebounce) clearTimeout(state.searchDebounce);
        state.searchDebounce = setTimeout(() => onSearch(input.value), 500);
      }
      function setSearch(search) {
        input.value = search;
        onSearch(search);
      }
      input.addEventListener("input", onInput);
      return { el: inputGroup, setSearch };
    }
    function BrowseSortDropdown({ onSort }) {
      const defaultSort = "Trending";
      const sortStrings = {
        [SortOption.Trending]:
          setLang === "en" ? "Trending" : getLangString(i18nPage, "POPULAR"),
        [SortOption.MostPopular]:
          setLang === "en"
            ? "Most Popular"
            : getLangString(i18nPage, "DOWNLOADS"),
        [SortOption.Rating]: getLangString(i18nPage, "RATING"),
        [SortOption.Subscribers]: getLangString(i18nPage, "SUBSCRIBERS"),
        [SortOption.Newest]: getLangString(i18nPage, "NEWEST"),
        [SortOption.LastUpdated]: "Last Updated",
        [SortOption.Alphabetical]: "Alphabetical",
      };
      const sortText = createElement("span", {
        classList: ["d-inline-block", "mr-auto"],
        text: defaultSort,
      });
      const button = createElement("button", {
        id: "browser-sort-button",
        classList: [
          "btn",
          "btn-primary",
          "btn-block",
          "dropdown-toggle",
          "d-flex",
          "align-items-center",
        ],
        attributes: [
          ["type", "button"],
          ["data-toggle", "dropdown"],
          ["aria-haspopup", "true"],
          ["aria-expanded", "false"],
        ],
        children: [sortText],
      });
      const options = [];
      for (const key of enumKeys(SortOption)) {
        const option = createElement("button", {
          classList: ["dropdown-item"],
          attributes: [["type", "button"]],
          text: sortStrings[SortOption[key]],
        });
        option.addEventListener("click", () => onClickOption(SortOption[key]));
        options.push(option);
      }
      const optionsWrapper = createElement("div", {
        classList: ["dropdown-menu"],
        attributes: [["aria-labeledby", "browser-sort-button"]],
        children: options,
      });
      const dropdown = createElement("div", {
        classList: ["dropdown"],
        children: [button, optionsWrapper],
      });
      const state = { sort: SortOption.Trending };
      function onClickOption(option) {
        sortText.textContent = sortStrings[option];
        state.sort = option;
        onSort(state.sort);
      }
      function enumKeys(obj) {
        return Object.keys(obj).filter((k) => Number.isNaN(+k));
      }
      return { el: dropdown };
    }
    function BrowseFilterDropdown({ onFilter }) {
      const divider = () =>
        createElement("div", { classList: ["dropdown-divider"] });
      const option = (tag, display, color, checked = false) => {
        const id = `mm__browse-filter--${tag}`;
        const checkbox = createElement("input", {
          id,
          classList: ["custom-control-input"],
          attributes: [
            ["type", "checkbox"],
            ["name", id],
          ],
        });
        checkbox.checked = checked;
        checkbox.addEventListener("click", onClickCheckbox);
        checkbox.dataset.tag = tag;
        typeChecks.push(checkbox);
        const label = createElement("label", {
          classList: ["custom-control-label", "pointer-enabled"],
          attributes: [["for", id]],
          text: display || tag,
        });
        const checkboxWrapper = createElement("div", {
          classList: ["custom-control", "custom-checkbox"],
          children: [checkbox, label],
        });
        if (color) checkboxWrapper.classList.add(`custom-control-${color}`);
        const option = createElement("button", {
          classList: ["dropdown-item"],
          attributes: [["type", "button"]],
          children: [checkboxWrapper],
        });
        option.addEventListener("click", (e) => onClickOption(e, checkbox));
        return option;
      };
      const typeChecks = [];
      const button = createElement("button", {
        id: "browser-filter-button",
        classList: [
          "btn",
          "btn-alt-primary",
          "btn-block",
          "dropdown-toggle",
          "d-flex",
          "align-items-center",
        ],
        attributes: [
          ["type", "button"],
          ["data-toggle", "dropdown"],
          ["aria-haspopup", "true"],
          ["aria-expanded", "false"],
        ],
        children: [Icon("filter").el],
      });
      const optionsWrapper = createElement("div", {
        classList: [
          "dropdown-menu",
          "dropdown-menu-right",
          "mm__scrollable-dropdown",
        ],
        attributes: [["aria-labeledby", "browser-sort-button"]],
      });
      const dropdown = createElement("div", {
        classList: ["dropdown", "d-inline-flex"],
        children: [button, optionsWrapper],
      });
      function populateOptions() {
        var _a, _b;
        if (typeChecks.length) typeChecks.splice(0, typeChecks.length);
        while (optionsWrapper.lastChild)
          optionsWrapper.removeChild(optionsWrapper.lastChild);
        optionsWrapper.appendChild(
          option(gameVersion.substring(1), "Current Game Version", "success")
        );
        if (store.state.devMods.size)
          optionsWrapper.appendChild(
            option("onDevTeam", "Team Member", "success")
          );
        optionsWrapper.appendChild(divider());
        const typeTags =
          ((_b =
            (_a = store.state.gameData) === null || _a === void 0
              ? void 0
              : _a.tag_options.find((o) => o.name === "Type")) === null ||
          _b === void 0
            ? void 0
            : _b.tags) || [];
        for (const tag of typeTags) {
          optionsWrapper.appendChild(option(tag));
        }
        filter(true);
      }
      function onClickCheckbox(e) {
        e.preventDefault();
        return false;
      }
      function onClickOption(e, checkbox) {
        e.stopPropagation();
        checkbox.checked = !checkbox.checked;
        filter();
      }
      function filter(preventRefresh = false) {
        const checked = typeChecks
          .filter((c) => c.checked)
          .map((c) => c.dataset.tag);
        onFilter(checked, preventRefresh);
      }
      store.on("afterLogin", populateOptions);
      store.on("initialOpenSetup", populateOptions);
      return { el: dropdown };
    }
    function BrowseViewSelector({ onChangeView }) {
      const gridViewBtn = createElement("button", {
        classList: ["btn", "btn-secondary", "active"],
        children: [Icon("th", { fixedWidth: true }).el],
      });
      const listViewBtn = createElement("button", {
        classList: ["btn", "btn-secondary"],
        children: [Icon("th-list", { fixedWidth: true }).el],
      });
      const btnGroup = createElement("div", {
        classList: ["btn-group"],
        attributes: [["role", "group"]],
        children: [gridViewBtn, listViewBtn],
      });
      function onClickGridView() {
        toggleView("grid");
      }
      function onClickListView() {
        toggleView("list");
      }
      function toggleView(view) {
        const isList = view === "list";
        gridViewBtn.classList.toggle("active", !isList);
        listViewBtn.classList.toggle("active", isList);
        onChangeView(view);
      }
      gridViewBtn.addEventListener("click", onClickGridView);
      listViewBtn.addEventListener("click", onClickListView);
      return { el: btnGroup };
    }
    function BrowsePagerBar({ onPagerPrevious, onPagerNext, onToggleToolbar }) {
      const pager = BrowsePager({ onPagerPrevious, onPagerNext });
      pager.el.classList.add("col");
      const toolbarToggleIcon = Icon("ellipsis-h", { fixedWidth: true }).el;
      const toolbarToggleBtn = createElement("button", {
        classList: ["btn", "btn-dark", "btn-sm", "text-muted"],
        children: [toolbarToggleIcon],
      });
      const toolbarToggleWrapper = createElement("div", {
        classList: ["col-auto", "d-sm-none"],
        children: [toolbarToggleBtn],
      });
      const wrapper = createElement("div", {
        classList: ["row", "my-2", "mb-md-0"],
        children: [pager.el, toolbarToggleWrapper],
      });
      const state = { showToolbar: false };
      function onClickToolbarToggle() {
        state.showToolbar = !state.showToolbar;
        onToggleToolbar(state.showToolbar);
        toolbarToggleBtn.classList.toggle("active", state.showToolbar);
      }
      toolbarToggleBtn.addEventListener("click", onClickToolbarToggle);
      return { el: wrapper, pager };
    }
    function BrowsePager({ onPagerPrevious, onPagerNext }) {
      const pageBtn = (icon) =>
        createElement("button", {
          classList: [
            "btn",
            "btn-secondary",
            "btn-rounded",
            "btn-sm",
            "btn-block",
            "px-3",
          ],
          attributes: [["type", "button"]],
          children: [Icon(icon, { fixedWidth: true }).el],
        });
      const btnWrapper = (btn) =>
        createElement("div", {
          classList: ["col", "col-sm-auto"],
          children: [btn],
        });
      const prevPageBtn = pageBtn("chevron-left");
      const prevPageWrapper = btnWrapper(prevPageBtn);
      const resultCount = createElement("span", { text: "0 - 0" });
      const totalResultCount = createElement("span", { text: "0" });
      const resultWrapper = createElement("div", {
        classList: ["col-auto", "d-none", "d-sm-block"],
        children: [resultCount, " of ", totalResultCount],
      });
      const nextPageBtn = pageBtn("chevron-right");
      const nextPageWrapper = btnWrapper(nextPageBtn);
      const wrapper = createElement("nav", {
        classList: [
          "row",
          "align-items-center",
          "justify-content-center",
          "mx-0",
        ],
        attributes: [["aria-label", "Browser page navigation"]],
        children: [prevPageWrapper, resultWrapper, nextPageWrapper],
      });
      const state = { resultCount: 0, resultOffset: 0, totalResults: 0 };
      function setPageData(result) {
        state.resultCount = result.result_count;
        state.resultOffset = result.result_offset;
        state.totalResults = result.result_total;
        update();
      }
      function update() {
        resultCount.textContent = `${
          state.resultCount ? state.resultOffset + 1 : 0
        } - ${state.resultOffset + state.resultCount}`;
        totalResultCount.textContent = state.totalResults.toString();
        const firstPage = state.resultOffset === 0;
        prevPageBtn.disabled = firstPage;
        const lastPage =
          state.resultOffset + state.resultCount === state.totalResults;
        nextPageBtn.disabled = lastPage;
      }
      function onClickPrevBtn() {
        onPagerPrevious();
      }
      function onClickNextBtn() {
        onPagerNext();
      }
      prevPageBtn.addEventListener("click", onClickPrevBtn);
      nextPageBtn.addEventListener("click", onClickNextBtn);
      return { el: wrapper, setPageData, update };
    }
    function MyMods() {
      const dummySizer = createElement("main", {
        classList: ["d-flex", "d-md-flex", "flex-column", "invisible"],
        children: [
          BrowseToolbar({
            onSort() {},
            onFilter() {},
            onSearch() {},
            onChangeView() {},
          }).el,
          createElement("div", {
            classList: ["position-relative", "h-100"],
            children: [BrowseGridView({ onSelectMod() {} }).el],
          }),
          BrowsePagerBar({
            onPagerPrevious() {},
            onPagerNext() {},
            onToggleToolbar() {},
          }).el,
        ],
      });
      const toolbar = MyModsToolbar();
      const listView = MyModsListView({ onSelectMod });
      const viewWrapper = createElement("div", {
        classList: [
          "mm__list-view",
          "d-flex",
          "d-md-flex",
          "flex-column",
          "col-12",
        ],
        children: [toolbar.el, listView.el],
      });
      const main = createElement("main", {
        classList: ["col-12", "col-md-6", "col-lg-7", "col-xl-8", "d-md-block"],
        children: [dummySizer, viewWrapper],
      });
      const detailsPane = DetailPane({
        tab: "my-mods",
        onClose: onCloseDetails,
      });
      const detail = createElement("aside", {
        classList: [
          "col-12",
          "col-md-6",
          "col-lg-5",
          "col-xl-4",
          "d-none",
          "flex-column",
          "d-md-block",
        ],
        children: [detailsPane.el],
      });
      const wrapper = createElement("div", {
        classList: ["row", "h-100"],
        children: [main, detail],
      });
      function onSelectMod(mod, ioMod) {
        detailsPane.setMod(mod, ioMod);
        detail.classList.add("d-flex");
        detail.classList.remove("d-none");
        main.classList.add("d-none");
        main.classList.remove("d-flex");
      }
      function onCloseDetails() {
        detail.classList.remove("d-flex");
        detail.classList.add("d-none");
        main.classList.remove("d-none");
        main.classList.add("d-flex");
      }
      function close() {
        detailsPane.setMod(null, null);
        onCloseDetails();
      }
      return { el: wrapper, close };
    }
    function MyModsListView({ onSelectMod }) {
      const downloadBar = MyModsDownloadBar().el;
      const installBar = MyModsInstallBar().el;
      const installedMods = createElement("div");
      const queuedMods = createElement("div", {
        classList: ["mm__queued-list"],
      });
      const noModsMessage = createElement("div", {
        classList: [
          "h-100",
          "w-100",
          "d-flex",
          "align-items-center",
          "justify-content-center",
          "text-center",
          "font-size-sm",
        ],
        children: [
          createElement("span", {
            children: [
              "You have no mods installed. Visit the ",
              createElement("strong", { text: "Browse" }),
              " tab to start installing them!",
            ],
          }),
        ],
      });
      const wrapper = createElement("div", {
        classList: ["mm__flex-expand"],
        children: [installedMods, queuedMods, noModsMessage],
      });
      const state = { mods: new Map() };
      function update() {
        const frag = document.createDocumentFragment();
        for (const mod of store.state.installed) {
          const item =
            state.mods.get(mod.id) ||
            MyModsListViewItem({ onSelectMod, downloadBar, installBar });
          item.setMod(mod, null);
          state.mods.set(mod.id, item);
          frag.appendChild(item.el);
        }
        installedMods.appendChild(frag);
        toggleNoModsMessage();
      }
      function destroy() {
        for (const [id, item] of state.mods) {
          item.destroy();
        }
        wrapper.remove();
      }
      function toggleNoModsMessage() {
        const anyMods =
          installedMods.children.length || queuedMods.children.length;
        const noMods = !anyMods;
        noModsMessage.classList.toggle("d-flex", noMods);
        noModsMessage.classList.toggle("d-none", !noMods);
      }
      function onSubscribeComplete(e) {
        const { input } = e;
        addQueuedMod(input);
      }
      function onUnsubscribeComplete(e) {
        const { input } = e;
        const item = state.mods.get(input.id);
        if (item && queuedMods.contains(item.el)) {
          item.destroy();
        }
      }
      function onDownloadQueued(e) {
        const mod = e;
        if (state.mods.has(mod.id))
          setListItemStatus(mod.id, "downloadQueued", "Downloading (Queued)");
        else addQueuedMod(mod);
      }
      function onDownloadBegin(e) {
        const { input } = e;
        if (state.mods.has(input.id))
          setListItemStatus(input.id, "downloadBegin", "Downloading...");
        else addQueuedMod(input);
      }
      function onInstallQueued(e) {
        const { mod } = e;
        if (state.mods.has(mod.id))
          setListItemStatus(mod.id, "installQueued", "Installing (Queued)");
        else addQueuedMod(mod);
      }
      function onInstallBegin(e) {
        const { input } = e;
        if (state.mods.has(input.mod.id))
          setListItemStatus(input.mod.id, "installBegin", "Installing...");
        else addQueuedMod(input.mod);
      }
      function onInstallComplete(e) {
        const { input } = e;
        setListItemStatus(input.mod.id, "", "");
      }
      function onUninstallQueued(e) {
        const mod = e;
        setListItemStatus(mod.id, "uninstallQueued", "Uninstalling (Queued)");
      }
      function onUninstallBegin(e) {
        const { input } = e;
        setListItemStatus(input.id, "uninstallBegin", "Uninstalling...");
      }
      function onInstallError(e) {
        const { input, error } = e;
        onError({ input: input.mod, error });
      }
      function onError(e) {
        const { input, error } = e;
        setListItemStatus(input.id, "error", `ERROR: ${error.message}`);
      }
      function setListItemStatus(id, status, message) {
        if (!state.mods.has(id)) return;
        state.mods.get(id).setStatus(status, message);
      }
      function addQueuedMod(mod) {
        if (!mod || state.mods.has(mod.id)) return;
        const item = MyModsListViewItem({
          onSelectMod,
          downloadBar,
          installBar,
        });
        item.setMod(null, mod);
        state.mods.set(mod.id, item);
        queuedMods.appendChild(item.el);
        toggleNoModsMessage();
      }
      function onUninstallComplete(e) {
        const { input } = e;
        const item = state.mods.get(input.id);
        if (!item) return;
        item.destroy();
        state.mods.delete(input.id);
        toggleNoModsMessage();
      }
      bus.on(bus.source.INSTALLED_MODS, bus.event.REFRESH, update);
      bus.on(
        bus.source.SUBSCRIBE_QUEUE,
        bus.event.COMPLETE,
        onSubscribeComplete
      );
      bus.on(
        bus.source.UNSUBSCRIBE_QUEUE,
        bus.event.COMPLETE,
        onUnsubscribeComplete
      );
      bus.on(bus.source.DOWNLOAD_QUEUE, bus.event.QUEUED, onDownloadQueued);
      bus.on(bus.source.DOWNLOAD_QUEUE, bus.event.BEGIN, onDownloadBegin);
      bus.on(bus.source.DOWNLOAD_QUEUE, bus.event.ERROR, onError);
      bus.on(bus.source.INSTALL_QUEUE, bus.event.QUEUED, onInstallQueued);
      bus.on(bus.source.INSTALL_QUEUE, bus.event.BEGIN, onInstallBegin);
      bus.on(bus.source.INSTALL_QUEUE, bus.event.COMPLETE, onInstallComplete);
      bus.on(bus.source.INSTALL_QUEUE, bus.event.ERROR, onInstallError);
      bus.on(bus.source.UNINSTALL_QUEUE, bus.event.QUEUED, onUninstallQueued);
      bus.on(bus.source.UNINSTALL_QUEUE, bus.event.BEGIN, onUninstallBegin);
      bus.on(
        bus.source.UNINSTALL_QUEUE,
        bus.event.COMPLETE,
        onUninstallComplete
      );
      bus.on(bus.source.UNINSTALL_QUEUE, bus.event.ERROR, onError);
      wrapper.addEventListener("touchmove", (e) => e.stopPropagation());
      return { el: wrapper, update, destroy };
    }
    function MyModsListViewItem({ onSelectMod, downloadBar, installBar }) {
      const icon = MyModsModIcon();
      icon.el.classList.add("col-auto", "mr-2", "mr-lg-4");
      const devIcon = createElement("i", {
        classList: [
          "fas",
          "fa-asterisk",
          "fa-xs",
          "text-warning",
          "mr-1",
          "d-none",
        ],
      });
      const title = createElement("span", {
        classList: ["mm__list-item--title"],
        text: "",
      });
      const recentlyUpdatedBadge = createElement("span", {
        classList: ["badge", "badge-info", "d-none"],
        text: "Recently Updated",
      });
      const badgeWrapper = createElement("div", {
        children: [recentlyUpdatedBadge],
      });
      const titleWrapper = createElement("div", {
        classList: ["col", "text-truncate"],
        children: [devIcon, title, badgeWrapper],
      });
      const versionBadge = GameVersionBadge({ showOnUpToDate: false });
      const statusText = createElement("div", {
        classList: ["col-auto", "font-size-sm", "mm__dim", "ml-2", "ml-lg-4"],
        text: "---",
      });
      const downloadBtn = MyModsDownloadBtn();
      downloadBtn.el.classList.add("mr-2", "mr-lg-4");
      const loadOrderBtnGroup = MyModsLoadOrderBtnGroup();
      if (!store.getters.usingLocalMode())
        loadOrderBtnGroup.el.classList.add("mr-2", "mr-lg-4");
      const unsubBtn = MyModsQuickUnsubBtn();
      if (store.getters.usingLocalMode()) unsubBtn.el.classList.add("d-none");
      const actionGroup = createElement("div", {
        classList: [
          "col-12",
          "col-lg-auto",
          "d-flex",
          "justify-content-end",
          "mt-2",
          "mt-lg-0",
          "ml-lg-4",
        ],
        children: [downloadBtn.el, loadOrderBtnGroup.el, unsubBtn.el],
      });
      const flexWrap = createElement("div", {
        classList: ["row", "no-gutters", "align-items-center", "p-2"],
        children: [
          icon.el,
          titleWrapper,
          versionBadge.el,
          statusText,
          actionGroup,
        ],
      });
      const wrapper = createElement("a", {
        classList: [
          "block",
          "block-rounded",
          "block-link-pop",
          "pointer-enabled",
          "mb-2",
        ],
        children: [flexWrap],
      });
      const state = { mod: null, ioMod: null, status: "", statusMessage: "" };
      function setMod(mod, ioMod) {
        var _a, _b;
        if (state.mod) {
          bus.off(
            bus.source.MOD(state.mod.id),
            bus.event.ENABLED,
            onToggleDisable
          );
          bus.off(
            bus.source.MOD(state.mod.id),
            bus.event.DISABLED,
            onToggleDisable
          );
          bus.off(bus.source.MOD(state.mod.id), bus.event.REFRESH, onRefresh);
        }
        state.mod = mod;
        state.ioMod = ioMod;
        icon.setMod(state.mod);
        versionBadge.setMod(state.mod || state.ioMod);
        downloadBtn.setMod(state.mod || state.ioMod);
        loadOrderBtnGroup.setMod(state.mod);
        unsubBtn.setMod(state.mod || state.ioMod);
        const modId =
          ((_a = state.mod) === null || _a === void 0 ? void 0 : _a.id) ||
          ((_b = state.ioMod) === null || _b === void 0 ? void 0 : _b.id) ||
          0;
        const beingDownloaded = store.getters.beingDownloaded();
        const downloadIndex = beingDownloaded.indexOf(modId);
        const beingInstalled = store.getters.beingDownloaded();
        const installIndex = beingInstalled.indexOf(modId);
        const beingUninstalled = store.getters.beingDownloaded();
        const uninstallIndex = beingUninstalled.indexOf(modId);
        if (downloadIndex === 0) state.status = "downloadBegin";
        else if (downloadIndex > 0) state.status = "downloadQueued";
        else if (installIndex === 0) state.status = "installBegin";
        else if (installIndex > 0) state.status = "installQueued";
        else if (uninstallIndex === 0) state.status = "uninstallBegin";
        else if (uninstallIndex > 0) state.status = "uninstallQueued";
        update(true);
        if (state.mod) {
          bus.on(
            bus.source.MOD(state.mod.id),
            bus.event.ENABLED,
            onToggleDisable
          );
          bus.on(
            bus.source.MOD(state.mod.id),
            bus.event.DISABLED,
            onToggleDisable
          );
          bus.on(bus.source.MOD(state.mod.id), bus.event.REFRESH, onRefresh);
        }
      }
      function setStatus(status, message) {
        state.status = status;
        state.statusMessage = message;
        update();
      }
      function update(stopPropagation = false) {
        var _a, _b, _c;
        devIcon.classList.toggle(
          "d-none",
          !state.mod || !store.getters.isModDev(state.mod.id)
        );
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
        recentlyUpdatedBadge.classList.toggle(
          "d-none",
          !state.mod ||
            !state.mod.updated ||
            !(state.mod.updated >= threeDaysAgo.getTime() / 1000)
        );
        title.textContent =
          ((_a = state.mod) === null || _a === void 0 ? void 0 : _a.name) ||
          ((_b = state.ioMod) === null || _b === void 0 ? void 0 : _b.name) ||
          "";
        wrapper.classList.toggle(
          "mm__disabled",
          store.getters.isDisabled(
            (_c = state.mod) === null || _c === void 0 ? void 0 : _c.id
          )
        );
        if (state.status) {
          statusText.classList.remove("d-none");
          actionGroup.classList.add("d-none");
          actionGroup.classList.remove(
            "d-flex",
            "col-lg-auto",
            "mt-lg-0",
            "ml-lg-4"
          );
          statusText.textContent = state.statusMessage;
        } else {
          statusText.classList.add("d-none");
          actionGroup.classList.remove("d-none");
          actionGroup.classList.add(
            "d-flex",
            "col-lg-auto",
            "mt-lg-0",
            "ml-lg-4"
          );
          statusText.textContent = "---";
        }
        if (state.status === "error") {
          statusText.classList.add("text-danger");
          actionGroup.classList.remove("d-none");
          actionGroup.classList.add("d-flex");
        } else {
          statusText.classList.remove("text-danger");
        }
        if (state.status === "downloadBegin") {
          wrapper.appendChild(downloadBar);
        } else if (wrapper.contains(downloadBar)) {
          wrapper.removeChild(downloadBar);
        }
        if (state.status === "installQueued") {
          statusText.textContent = "Installing (Queued)";
        }
        if (state.status === "installBegin") {
          wrapper.appendChild(installBar);
        } else if (wrapper.contains(installBar)) {
          wrapper.removeChild(installBar);
        }
        if (!stopPropagation) {
          icon.update();
          versionBadge.update();
          downloadBtn.update();
          loadOrderBtnGroup.update();
          unsubBtn.update();
        }
      }
      function destroy() {
        if (state.mod) {
          bus.off(
            bus.source.MOD(state.mod.id),
            bus.event.ENABLED,
            onToggleDisable
          );
          bus.off(
            bus.source.MOD(state.mod.id),
            bus.event.DISABLED,
            onToggleDisable
          );
          bus.off(bus.source.MOD(state.mod.id), bus.event.REFRESH, onRefresh);
        }
        if (wrapper.contains(downloadBar)) wrapper.removeChild(downloadBar);
        if (wrapper.contains(installBar)) wrapper.removeChild(installBar);
        wrapper.remove();
      }
      function onToggleDisable() {
        var _a;
        const isDisabled = store.getters.isDisabled(
          (_a = state.mod) === null || _a === void 0 ? void 0 : _a.id
        );
        wrapper.classList.toggle("mm__disabled", isDisabled);
      }
      function onRefresh() {
        update();
      }
      function onClick() {
        if (!state.mod && !state.ioMod) return;
        if (state.status) return;
        onSelectMod(state.mod, state.ioMod);
      }
      function onEnableLocalMode() {
        loadOrderBtnGroup.el.classList.remove("mr-2", "mr-lg-4");
        unsubBtn.el.classList.add("d-none");
      }
      wrapper.addEventListener("click", onClick);
      store.on("enableLocalMode", onEnableLocalMode);
      store.on("changeDisableAll", onToggleDisable);
      return { el: wrapper, setMod, setStatus, update, destroy };
    }
    function MyModsModIcon() {
      const placeholderIcon = cdnMedia(
        "assets/media/mods/placeholder_icon.png"
      );
      const icon = createElement("img", {
        classList: ["mm__icon"],
        attributes: [["src", placeholderIcon]],
      });
      const wrapper = createElement("div", {
        classList: ["text-center"],
        children: [icon],
      });
      const state = { mod: null };
      function setMod(mod) {
        state.mod = mod;
        update();
      }
      function update() {
        var _a;
        let src = placeholderIcon;
        if ((_a = state.mod) === null || _a === void 0 ? void 0 : _a.icon) {
          try {
            src = loader.getResourceUrl(state.mod, state.mod.icon);
          } catch (_b) {
            console.error(
              `[${state.mod.name}] The icon file "${state.mod.icon}" does not exist.`
            );
          }
        }
        icon.src = src;
      }
      return { el: wrapper, setMod, update };
    }
    function MyModsDownloadBtn() {
      const type = createElement("small", { classList: ["ml-1"] });
      const btn = createElement("button", {
        classList: ["btn", "btn-dark", "text-success"],
        attributes: [["type", "button"]],
        children: [Icon("download", { fixedWidth: true }).el, type],
      });
      const state = { mod: null, ioMod: null };
      function setMod(mod) {
        return __awaiter(this, void 0, void 0, function* () {
          if (mod && !("version" in mod)) {
            state.mod = null;
            state.ioMod = mod;
          } else {
            state.mod = mod;
            state.ioMod = state.mod
              ? yield store.getters.mod(state.mod.id)
              : null;
          }
          update();
        });
      }
      function update() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
          const isInstalled = store.getters.isInstalled(
            (_a = state.mod) === null || _a === void 0 ? void 0 : _a.id
          );
          const targetVersion =
            state.mod && store.state.preferLatestMods.has(state.mod.id)
              ? store.state.preferLatestMods.get(state.mod.id).version || "-"
              : state.ioMod
              ? state.ioMod.modfile.version || "-"
              : ((_b = state.mod) === null || _b === void 0
                  ? void 0
                  : _b.version) || "-";
          const isUpToDate =
            state.mod !== null && (state.mod.version || "-") === targetVersion;
          type.textContent = isInstalled ? "Update" : "Download";
          btn.classList.toggle("d-none", isInstalled && isUpToDate);
        });
      }
      function onClick(e) {
        e.stopPropagation();
        if (!state.ioMod) return;
        store.actions.download(state.ioMod);
      }
      btn.addEventListener("click", onClick);
      return { el: btn, setMod, update };
    }
    function MyModsLoadOrderBtnGroup() {
      const upBtn = createElement("button", {
        classList: ["btn", "btn-dark"],
        attributes: [["type", "button"]],
        children: [Icon("chevron-up").el],
      });
      const downBtn = createElement("button", {
        classList: ["btn", "btn-dark"],
        attributes: [["type", "button"]],
        children: [Icon("chevron-down").el],
      });
      const group = createElement("div", {
        classList: ["btn-group"],
        attributes: [["role", "group"]],
        children: [upBtn, downBtn],
      });
      const state = { mod: null };
      function setMod(mod) {
        state.mod = mod;
        update();
      }
      function update() {
        var _a;
        group.classList.toggle(
          "d-none",
          !state.mod || !store.getters.isInstalled(state.mod.id)
        );
        group.classList.toggle(
          "invisible",
          ((_a = state.mod) === null || _a === void 0 ? void 0 : _a.id) ===
            creatorToolkitId
        );
        const loadOrder = store.state.installed.findIndex((m) => {
          var _a;
          return (
            m.id ===
            ((_a = state.mod) === null || _a === void 0 ? void 0 : _a.id)
          );
        });
        upBtn.disabled =
          !state.mod ||
          state.mod.id === creatorToolkitId ||
          loadOrder < 1 ||
          (loadOrder === 1 && store.state.installed[0].id === creatorToolkitId);
        downBtn.disabled =
          !state.mod ||
          state.mod.id === creatorToolkitId ||
          loadOrder === -1 ||
          loadOrder === store.state.installed.length - 1;
      }
      function onClickUp(e) {
        e.stopPropagation();
        if (!state.mod) return;
        store.actions.shiftLoadOrder(state.mod.id, true);
      }
      function onClickDown(e) {
        e.stopPropagation();
        if (!state.mod) return;
        store.actions.shiftLoadOrder(state.mod.id, false);
      }
      upBtn.addEventListener("click", onClickUp);
      downBtn.addEventListener("click", onClickDown);
      return { el: group, setMod, update };
    }
    function MyModsQuickUnsubBtn() {
      const icon = Icon("times", { fixedWidth: true });
      const btn = createElement("button", {
        classList: ["btn", "btn-dark", "text-danger"],
        attributes: [["type", "button"]],
        children: [icon.el],
      });
      const state = { mod: null };
      function setMod(mod) {
        state.mod = mod;
        update();
      }
      function update() {
        var _a, _b;
        const isUnsubscribing = store.getters.beingUnsubscribed().some((id) => {
          var _a;
          return (
            id === ((_a = state.mod) === null || _a === void 0 ? void 0 : _a.id)
          );
        });
        const isUnsubscribed =
          !store.getters.isSubscribed(
            (_a = state.mod) === null || _a === void 0 ? void 0 : _a.id
          ) &&
          store.getters.beingSubscribed()[0] !==
            ((_b = state.mod) === null || _b === void 0 ? void 0 : _b.id);
        btn.disabled = !state.mod || isUnsubscribing || isUnsubscribed;
        icon.setIcon(isUnsubscribing ? "spinner" : "times");
        icon.togglePulse(isUnsubscribing);
      }
      function onClick(e) {
        return __awaiter(this, void 0, void 0, function* () {
          e.stopPropagation();
          if (store.getters.usingLocalMode()) return;
          if (!state.mod) return;
          if ("version" in state.mod) {
            const mod = yield store.getters.mod(state.mod.id);
            if (mod) store.actions.unsubscribe(mod);
          } else {
            store.actions.unsubscribe(state.mod);
          }
          update();
        });
      }
      btn.addEventListener("click", onClick);
      return { el: btn, setMod, update };
    }
    function MyModsDownloadBar() {
      const downloadedText = createElement("span", { text: "0" });
      const totalDownloadText = createElement("span", { text: "0" });
      const downloadPercentText = createElement("span", { text: "0" });
      const downloadSizeUnit = createElement("span", { text: "KB" });
      const downloadProgress = createElement("div", {
        classList: ["col-auto", "font-size-sm"],
        children: [
          downloadedText,
          " / ",
          totalDownloadText,
          " ",
          downloadSizeUnit,
          " (",
          downloadPercentText,
          "%)",
        ],
      });
      const downloadSpeedText = createElement("span", { text: "0" });
      const downloadSpeedUnit = createElement("span", { text: "KB" });
      const downloadSpeed = createElement("div", {
        classList: ["col-auto", "font-size-sm"],
        children: [downloadSpeedText, " ", downloadSpeedUnit, "/s"],
      });
      const progressBar = createElement("div", {
        classList: ["progress-bar", "bg-info"],
        attributes: [
          ["role", "progressbar"],
          ["aria-valuenow", "0"],
          ["aria-valuemin", "0"],
          ["aria-valuemax", "100"],
        ],
      });
      const progress = createElement("div", {
        classList: ["col-12", "progress", "mm__progress--thin", "mt-1"],
        children: [progressBar],
      });
      const wrapper = createElement("div", {
        classList: [
          "row",
          "no-gutters",
          "align-items-center",
          "p-2",
          "justify-content-between",
        ],
        children: [downloadProgress, downloadSpeed, progress],
      });
      function onDownloadBegin() {
        progressBar.style.width = "0%";
      }
      function onDownloadProgress(e) {
        const [bytesDownloaded, byteTotal, bytesPerSecond] = e.args;
        const isDownloadInMb = byteTotal >= Math.pow(10, 5);
        downloadedText.textContent = byteToKiloOrMegabyte(
          bytesDownloaded,
          isDownloadInMb
        );
        totalDownloadText.textContent = byteToKiloOrMegabyte(
          byteTotal,
          isDownloadInMb
        );
        downloadSizeUnit.textContent = isDownloadInMb ? "MB" : "KB";
        const percComplete = Math.round((bytesDownloaded / byteTotal) * 100);
        downloadPercentText.textContent = percComplete.toString();
        progressBar.style.width = `${percComplete}%`;
        progressBar.ariaValueNow = percComplete.toString();
        const isSpeedInMb = bytesPerSecond >= Math.pow(10, 5);
        downloadSpeedText.textContent = byteToKiloOrMegabyte(
          bytesPerSecond,
          isSpeedInMb
        );
        downloadSpeedUnit.textContent = isSpeedInMb ? "MB" : "KB";
      }
      function onDownloadComplete() {
        progressBar.style.width = "100%";
      }
      const byteToKiloOrMegabyte = (bytes, isMega) =>
        (bytes / Math.pow(10, isMega ? 6 : 3)).toFixed(2);
      bus.on(bus.source.DOWNLOAD_QUEUE, bus.event.BEGIN, onDownloadBegin);
      bus.on(bus.source.DOWNLOAD_QUEUE, bus.event.PROGRESS, onDownloadProgress);
      bus.on(bus.source.DOWNLOAD_QUEUE, bus.event.COMPLETE, onDownloadComplete);
      return { el: wrapper };
    }
    function MyModsInstallBar() {
      const dummyText = createElement("div", {
        classList: ["col-12", "font-size-sm", "invisible"],
        text: "---",
      });
      const progressBar = createElement("div", {
        classList: [
          "progress-bar",
          "progress-bar-striped",
          "progress-bar-animated",
          "bg-success",
          "w-100",
        ],
        attributes: [
          ["role", "progressbar"],
          ["aria-valuenow", "100"],
          ["aria-valuemin", "100"],
          ["aria-valuemax", "100"],
        ],
      });
      const progress = createElement("div", {
        classList: ["col-12", "progress", "mm__progress--thin", "mt-1"],
        children: [progressBar],
      });
      const wrapper = createElement("div", {
        classList: ["row", "no-gutters", "align-items-center", "p-2"],
        children: [dummyText, progress],
      });
      return { el: wrapper };
    }
    function MyModsToolbar() {
      const checkForUpdatesIcon = Icon("redo-alt", { classList: ["mr-2"] });
      const checkForUpdatesTimer = createElement("span", {
        classList: ["ml-1", "d-none"],
        text: "(0)",
      });
      const checkForUpdatesBtn = createElement("button", {
        classList: ["btn", "btn-outline-success", "btn-block"],
        children: [
          checkForUpdatesIcon.el,
          "Check for Updates",
          checkForUpdatesTimer,
        ],
      });
      if (store.getters.usingLocalMode()) {
        checkForUpdatesBtn.classList.add("d-none");
        checkForUpdatesBtn.disabled = true;
      }
      const leftGroup = createElement("div", {
        classList: ["col", "col-sm-auto"],
        children: [checkForUpdatesBtn],
      });
      const mobileToggleBtn = createElement("button", {
        classList: ["btn", "btn-dark", "btn-sm", "text-muted", "h-100"],
        children: [Icon("ellipsis-h", { fixedWidth: true }).el],
      });
      const mobileToggleGroup = createElement("div", {
        classList: ["col-auto", "d-sm-none", "ml-2"],
        children: [mobileToggleBtn],
      });
      mobileToggleBtn.addEventListener("click", () => {
        rightGroup.classList.toggle("d-none");
      });
      const disableAllSwitch = MyModsDisableAllSwitch();
      const rightGroup = createElement("div", {
        classList: [
          "col-12",
          "col-sm-auto",
          "mt-2",
          "my-sm-auto",
          "text-right",
          "d-none",
          "d-sm-block",
        ],
        children: [disableAllSwitch.el],
      });
      const wrapper = createElement("div", {
        classList: [
          "row",
          "no-gutters",
          "justify-content-between",
          "mb-0",
          "mb-sm-2",
          "mt-2",
          "mt-sm-0",
          "order-1",
          "order-sm-0",
          "d-flex",
        ],
        children: [leftGroup, mobileToggleGroup, rightGroup],
      });
      const state = { delayTimer: 0 };
      function onEnableLocalMode() {
        checkForUpdatesBtn.classList.add("d-none");
        checkForUpdatesBtn.disabled = true;
      }
      function startDelayTimer() {
        checkForUpdatesBtn.disabled = true;
        state.delayTimer = 30;
        checkForUpdatesTimer.textContent = `(${state.delayTimer})`;
        checkForUpdatesTimer.classList.remove("d-none");
        const int = setInterval(() => {
          state.delayTimer--;
          checkForUpdatesTimer.textContent = `(${state.delayTimer})`;
          if (state.delayTimer < 1) {
            clearInterval(int);
            checkForUpdatesBtn.disabled = false;
            checkForUpdatesTimer.classList.add("d-none");
          }
        }, 1000);
      }
      checkForUpdatesBtn.addEventListener("click", () =>
        __awaiter(this, void 0, void 0, function* () {
          if (state.delayTimer) return;
          if (store.getters.usingLocalMode()) return;
          checkForUpdatesBtn.disabled = true;
          checkForUpdatesIcon.setIcon("spinner");
          checkForUpdatesIcon.togglePulse(true);
          yield store.actions.refreshLatest();
          yield store.actions.refreshSubscriptions();
          yield store.actions.downloadSubscribedButNotInstalled();
          checkForUpdatesIcon.setIcon("redo-alt");
          checkForUpdatesIcon.togglePulse(false);
          startDelayTimer();
        })
      );
      store.on("enableLocalMode", onEnableLocalMode);
      startDelayTimer();
      return { el: wrapper };
    }
    function MyModsDisableAllSwitch() {
      const id = "mm__disable-all-switch";
      const input = createElement("input", {
        id,
        classList: ["custom-control-input"],
        attributes: [
          ["type", "checkbox"],
          ["name", id],
        ],
      });
      input.checked = store.state.disableAll;
      const label = createElement("label", {
        classList: ["custom-control-label"],
        attributes: [["for", id]],
        text: "Disable All",
      });
      const wrapper = createElement("div", {
        classList: ["custom-control", "custom-switch", "custom-control-danger"],
        children: [input, label],
      });
      function update() {
        input.checked = store.state.disableAll;
      }
      function onToggle() {
        if (input.checked) store.actions.disableAll();
        else store.actions.undisableAll();
      }
      input.addEventListener("change", onToggle);
      store.on("changeDisableAll", update);
      return { el: wrapper, update };
    }
    function EnableBody() {
      const warnings = [
        [
          "mm__enable-check-1",
          "I understand that, unless explicitly stated by the mod, installed mods will apply account-wide, and not only to this character.",
        ],
        [
          "mm__enable-check-2",
          "I understand that mods can alter the game and may cause unexpected or unwanted behavior.",
        ],
        [
          "mm__enable-check-3",
          "I understand that it is not the responsibility of the developers of Melvor Idle to rectify any game breaking bugs I may run in to while using Mods. This includes but is not limited to the rectification/restoration of corrupted, deleted or missing saves.",
        ],
        [
          "mm__enable-check-4",
          "I understand that mods can potentially execute malicious code, and while mods can be reported and removed from the Mod Browser, I accept responsibility for which mods I choose to install.",
        ],
      ];
      const checks = warnings.map((w) => EnableCheck(w[0], w[1]));
      const validation = createElement("span", {
        text: "You must agree to all points above to enable mod support.",
        classList: ["font-size-sm", "text-danger", "d-none"],
      });
      const el = createElement("div", {
        children: [
          createElement("p", {
            text: "Using mods can have unintended consequences and are disabled by default. To enable them, please agree to the below important points:",
            classList: ["font-size-sm", "text-warning"],
          }),
          ...checks.map((c) => c.el),
          validation,
        ],
      });
      function canSubmit() {
        const valid = checks.every((c) => c.isChecked());
        validation.classList.toggle("d-none", valid);
        return valid;
      }
      function reset() {
        checks.forEach((c) => c.reset());
        validation.classList.add("d-none");
      }
      return { el, canSubmit, reset };
    }
    function EnableCheck(id, text) {
      const el = createElement("div", {
        classList: ["bg-light", "rounded", "p-2", "mb-2"],
      });
      const formGroup = createElement("div", {
        classList: ["form-check"],
        parent: el,
      });
      const checkbox = createElement("input", {
        id,
        classList: ["form-check-input", "pointer-enabled"],
        attributes: [
          ["type", "checkbox"],
          ["name", id],
        ],
        parent: formGroup,
      });
      createElement("label", {
        text,
        classList: [
          "form-check-label",
          "pointer-enabled",
          "font-size-sm",
          "text-left",
        ],
        attributes: [["for", id]],
        parent: formGroup,
      });
      function isChecked() {
        return checkbox.checked;
      }
      function reset() {
        checkbox.checked = false;
      }
      return { el, isChecked, reset };
    }
    let initialized = false;
    let modManager = null;
    let promptForReload = false;
    function init() {
      return __awaiter(this, void 0, void 0, function* () {
        if (initialized) return;
        initialized = true;
        if (modManager) return;
        if (
          !cloudManager.hasFullVersionEntitlement ||
          !PlayFab.ClientApi.IsClientLoggedIn()
        )
          return;
        try {
          yield store.actions.setup();
        } catch (e) {
          const error =
            e instanceof Error
              ? e
              : new Error("The Mod Manager encountered a fatal error.");
          yield promptForReloadOnError(error);
          return;
        }
        if (store.state.moddingStatus === ModdingStatus.Hidden) return;
        modManager = ModManager();
        if (store.state.moddingStatus !== ModdingStatus.Enabled) return;
        yield loginStore.actions.restoreSession();
        if (
          loginStore.state.sessionRestored &&
          !loginStore.getters.isLoggedIn()
        ) {
          yield promptForLogin(true);
          if (!loginStore.getters.isLoggedIn()) {
            yield promptForLocalMode();
            if (store.getters.usingLocalMode()) {
              yield localModeInit();
              if (store.state.localModeSetup) yield processAfterLogin();
              return;
            }
            if (!loginStore.getters.isLoggedIn()) return;
          }
        }
        if (!loginStore.getters.isLoggedIn()) return;
        yield fullModeInit();
        if (store.state.fullModeSetup) yield processAfterLogin();
      });
    }
    function fullModeInit() {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          const alreadySetup = store.state.fullModeSetup;
          yield store.actions.fullModeSetup();
          if (!alreadySetup) {
            io.on("unauthorized", () => {
              loginStore.actions.logout();
              promptForLogin(true);
            });
            loginStore.on("login", () => {
              processAfterLogin();
            });
          }
        } catch (e) {
          yield promptForLocalMode(true);
          if (store.getters.usingLocalMode()) {
            yield localModeInit();
            if (store.state.localModeSetup) yield processAfterLogin();
            return;
          }
        }
      });
    }
    function localModeInit() {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          yield store.actions.localModeSetup();
        } catch (e) {
          const error =
            e instanceof Error
              ? e
              : new Error("The Mod Manager encountered a fatal error.");
          yield promptForReloadOnError(error);
          return;
        }
      });
    }
    function processAfterLogin() {
      return __awaiter(this, void 0, void 0, function* () {
        try {
          yield store.actions.afterLogin();
        } catch (e) {
          const error =
            e instanceof Error
              ? e
              : new Error("The Mod Manager encountered a fatal error.");
          yield promptForReloadOnError(error);
          return;
        }
      });
    }
    function openModManager(goToMyMods, query) {
      return __awaiter(this, void 0, void 0, function* () {
        if (!PlayFab.ClientApi.IsClientLoggedIn()) return;
        if (
          store.state.moddingStatus !== ModdingStatus.Enabled &&
          !(yield promptToEnable())
        )
          return;
        if (
          !store.getters.usingLocalMode() &&
          !loginStore.getters.isLoggedIn()
        ) {
          yield promptForLogin();
          if (loginStore.getters.isLoggedIn()) {
            yield fullModeInit();
            processAfterLogin();
          } else return;
        }
        const canPersist =
          "storage" in navigator && "persist" in navigator.storage;
        if (canPersist) {
          if (isSteam() || isAndroid() || isIOS()) {
            yield navigator.storage.persist();
          } else if (!localStorage.getItem("hasPromptedPersistedStorage")) {
            const isPersisted = yield navigator.storage.persisted();
            if (!isPersisted) {
              yield Swal.fire({
                icon: "info",
                title: "Persist Storage?",
                text: "For best performance, the Mod Manager requires permission to persist storage data. Would you like to grant this permission?",
                customClass: { container: "swal-infront" },
                confirmButtonText: "Yes",
                showCancelButton: true,
                cancelButtonText: "No",
                preConfirm: () =>
                  __awaiter(this, void 0, void 0, function* () {
                    yield navigator.storage.persist();
                  }),
              });
              localStorage.setItem("hasPromptedPersistedStorage", "1");
            }
          }
        }
        modManager === null || modManager === void 0
          ? void 0
          : modManager.open(goToMyMods, query);
        yield Swal.fire({
          allowOutsideClick: false,
          customClass: {
            container: "swal-infront",
            popup: "mm__popup",
            htmlContainer: "mm__container text-left mt-2 mb-0 mx-3",
          },
          html:
            modManager === null || modManager === void 0
              ? void 0
              : modManager.el,
          showConfirmButton: false,
          showCloseButton: true,
        });
        if (
          promptForReload &&
          !store.state.dependencyPrompts.length &&
          loginStore.getters.isLoggedIn()
        )
          yield showPromptForReload();
      });
    }
    function promptForLogin(expiredLogin = false) {
      return __awaiter(this, void 0, void 0, function* () {
        if (loginStore.getters.isLoggedIn()) return;
        const title = "Sign into mod.io to continue";
        const modioSignin = Swal.mixin({
          iconHtml: `<img style="width:100%;" src="${cdnMedia(
            "assets/media/mods/modio-color-small.png"
          )}" />`,
          title,
          customClass: {
            container: "swal-infront",
            icon: "border-0 w-50",
            input: "text-muted",
          },
          showLoaderOnConfirm: true,
        });
        const { isDismissed } = yield modioSignin.fire({
          html: expiredLogin
            ? createElement("div", {
                children: [
                  createElement("p", {
                    classList: ["text-danger"],
                    text: "Your mod.io session has expired. Please sign in again to continue using the Mod Manager.",
                  }),
                  createElement("p", {
                    classList: ["mb-0"],
                    text: "Enter the email address you would like to use to sign into mod.io.",
                  }),
                ],
              })
            : createElement("div", {
                children: [
                  createElement("p", {
                    text: "Melvor Idle's Mod Manager is powered by mod.io.",
                  }),
                  createElement("p", {
                    classList: ["mb-0"],
                    text: "Enter the email address you would like to use to sign into mod.io. This can be a new or existing mod.io account.",
                  }),
                ],
              }),
          input: "email",
          inputValue: loginStore.state.email,
          confirmButtonText:
            'Next <i class="fas fa-fw fa-arrow-right opacity-50 ml-1"></i>',
          inputValidator: (value) =>
            __awaiter(this, void 0, void 0, function* () {
              try {
                yield loginStore.actions.sendSecurityCode(value);
                return null;
              } catch (e) {
                console.error(e);
                if (e instanceof Error) return e.message;
                return "mod.io failed to respond.";
              }
            }),
        });
        if (isDismissed) return;
        yield modioSignin.fire({
          html: createElement("p", {
            classList: ["mb-0"],
            text: "Enter the 5-digit security code that was sent to your email to finish signing into mod.io.",
          }),
          input: "text",
          confirmButtonText:
            '<i class="fas fa-fw fa-sign-in-alt opacity-50 mr-1"></i> Sign in',
          inputValidator: (value) =>
            __awaiter(this, void 0, void 0, function* () {
              try {
                yield loginStore.actions.loginUsingSecurityCode(value);
                return null;
              } catch (e) {
                console.error(e);
                if (e instanceof Error) return e.message;
                return "mod.io failed to respond.";
              }
            }),
        });
      });
    }
    function isProcessing() {
      return (
        store.getters.beingSubscribed().length > 0 ||
        store.getters.beingDownloaded().length > 0 ||
        store.getters.beingInstalled().length > 0 ||
        store.getters.beingUnsubscribed().length > 0 ||
        store.getters.beingUninstalled().length > 0
      );
    }
    function onReloadTriggeringEvent() {
      if (!contextApi.hasCharacterSelectionLoadedTriggered()) return;
      promptForReload = true;
    }
    let enableBody;
    function promptToEnable() {
      return __awaiter(this, void 0, void 0, function* () {
        if (!enableBody) {
          enableBody = EnableBody();
        }
        const enable = yield SwalLocale.fire({
          icon: "warning",
          title: "Enable Mod Manager?",
          html: enableBody.el,
          confirmButtonText: "Enable Mod Manager",
          showCancelButton: true,
          preConfirm: () => enableBody.canSubmit(),
          didClose: () => enableBody.reset(),
        });
        if (enable.isConfirmed) {
          const enableModBtn = document.querySelector(
            ".mod-support-enable-btn"
          );
          if (enableModBtn) enableModBtn.classList.add("d-none");
          const disableModBtn = document.querySelector(
            ".mod-support-disable-btn"
          );
          if (disableModBtn) {
            disableModBtn.classList.remove("d-none");
            disableModBtn.textContent = "Disable & Hide Mod Manager";
          }
          yield playFabStoreData("modManager", "enabled");
          const reload = yield SwalLocale.fire({
            title: getLangString(i18nPage, "RELOAD_REQUIRED"),
            icon: "warning",
            text: "To finish enabling mod support, you must reload the game. Would you like to reload the game now?",
            showConfirmButton: true,
            confirmButtonText: "Yes, Reload Now",
            showCancelButton: true,
            cancelButtonText: "No, I'll Do It Later",
          });
          if (reload.isConfirmed) window.location.reload();
        }
        return enable.isConfirmed;
      });
    }
    function promptToDisable() {
      var _a, _b;
      return __awaiter(this, void 0, void 0, function* () {
        const moddingEnabled =
          store.state.moddingStatus === ModdingStatus.Enabled ||
          (yield getPlayFabData("modManager")) === "enabled";
        const disable = yield SwalLocale.fire({
          title: `${moddingEnabled ? "Disable & " : ""}Hide Mod Manager?`,
          icon: "warning",
          text: `${
            moddingEnabled
              ? "This is an account-wide action and will disable mods across all characters, not just this one. In addition, t"
              : "T"
          }his will hide the Mod Manager until re-enabled through the settings menu.`,
          showConfirmButton: true,
          confirmButtonText: `${
            moddingEnabled ? "Disable & " : ""
          }Hide Mod Manager`,
          showCancelButton: true,
          cancelButtonText: "Cancel",
        });
        if (disable.isConfirmed) {
          (_a = document.querySelector(".mod-support-enable-btn")) === null ||
          _a === void 0
            ? void 0
            : _a.classList.remove("d-none");
          (_b = document.querySelector(".mod-support-disable-btn")) === null ||
          _b === void 0
            ? void 0
            : _b.classList.add("d-none");
          yield playFabStoreData("modManager", "hidden");
          sidebar.removeCategory("Modding");
          if (store.state.moddingStatus === ModdingStatus.Enabled) {
            const reload = yield SwalLocale.fire({
              title: getLangString(i18nPage, "RELOAD_REQUIRED"),
              icon: "warning",
              text: "To finish disabling mod support, you must reload the game. Would you like to reload the game now?",
              showConfirmButton: true,
              confirmButtonText: "Yes, Reload Now",
              showCancelButton: true,
              cancelButtonText: "No, I'll Do It Later",
            });
            if (reload.isConfirmed) window.location.reload();
          }
        }
        return disable.isConfirmed;
      });
    }
    function showPromptForReload(canDefer = true) {
      return __awaiter(this, void 0, void 0, function* () {
        const reload = yield SwalLocale.fire({
          title: getLangString(i18nPage, "RELOAD_REQUIRED"),
          icon: "warning",
          text: "You have made changes to your mod configuration that require the game to be reloaded to take effect. Would you like to reload the game now?",
          showConfirmButton: true,
          confirmButtonText: canDefer ? "Yes, Reload Now" : "Reload",
          showDenyButton: canDefer,
          denyButtonText: "No, I'll Do It Later",
          willClose: () =>
            __awaiter(this, void 0, void 0, function* () {
              if (!canDefer) {
                yield playFabManager.persist();
                window.location.reload();
              }
            }),
        });
        if (reload.isConfirmed) {
          yield playFabManager.persist();
          window.location.reload();
        }
      });
    }
    function showPromptForInProgress() {
      return __awaiter(this, void 0, void 0, function* () {
        const open = yield SwalLocale.fire({
          title: "Mod Installation in Progress",
          icon: "warning",
          text: "Please allow the Mod Manager to finish processing any queued mods for installation and then try again.",
          showConfirmButton: true,
          confirmButtonText: "Open Mod Manager",
          showDenyButton: true,
          denyButtonText: "Cancel",
        });
        if (open.isConfirmed) openModManager(true);
      });
    }
    function promptForLocalMode(fromModioFailure = false) {
      return __awaiter(this, void 0, void 0, function* () {
        const localModeText = createElement("span", {
          classList: ["font-weight-bold", "text-warning", "pointer-enabled"],
          children: [
            "Local Mode",
            createElement("i", {
              classList: ["fas", "fa-question-circle", "ml-1"],
            }),
          ],
        });
        const localModeDescription = createElement("p", {
          classList: [
            "font-size-sm",
            "bg-combat-dark",
            "rounded",
            "p-2",
            "d-none",
          ],
          attributes: [["style", "margin-top:-1rem;"]],
          children: [
            "Using mods in ",
            createElement("span", {
              classList: ["font-weight-bold", "text-warning"],
              text: "Local Mode",
            }),
            " means only mods already installed on this device will be loaded and new mod subscriptions or updates to existing mods will not be installed.",
            " In addition, the mod Browser will be disabled and mods cannot be uninstalled.",
          ],
        });
        localModeText.addEventListener("click", () =>
          localModeDescription.classList.toggle("d-none")
        );
        const clearCachedCredsText = createElement("span", {
          text: "Clear cached mod.io credentials",
        });
        const clearCachedCredsIcon = createElement("i", {
          classList: ["d-none", "fas", "fa-spinner", "fa-pulse", "ml-1"],
        });
        const clearCachedCredsBtn = createElement("button", {
          classList: ["btn", "btn-info"],
          children: [clearCachedCredsText, clearCachedCredsIcon],
        });
        clearCachedCredsBtn.addEventListener(
          "click",
          () =>
            __awaiter(this, void 0, void 0, function* () {
              clearCachedCredsBtn.disabled = true;
              clearCachedCredsIcon.classList.remove("d-none");
              localStorage.removeItem("modioToken");
              PlayFab.ClientApi.UpdateUserData(
                { Data: { modioToken: null } },
                () => {
                  window.location.reload();
                }
              );
            }),
          { once: true }
        );
        const { isConfirmed, isDenied, isDismissed } = yield SwalLocale.fire({
          icon: "warning",
          title: fromModioFailure
            ? "mod.io Unreachable"
            : "Enable Mods using Local Mode?",
          html: createElement("div", {
            children: [
              fromModioFailure
                ? createElement("p", {
                    children: [
                      "The mod.io service cannot be reached at this time. This may be due to invalid cached credentials. You can reload to try again or opt to start the game with mods set to ",
                      localModeText,
                      ".",
                    ],
                  })
                : createElement("p", {
                    children: [
                      "You've opted not to sign back into mod.io. Would you like to continue without mods or start the game with mods set to ",
                      localModeText,
                      "?",
                    ],
                  }),
              localModeDescription,
              clearCachedCredsBtn,
            ],
          }),
          showConfirmButton: true,
          confirmButtonText: fromModioFailure
            ? "Reload to Try Again"
            : "Sign into mod.io",
          showDenyButton: true,
          denyButtonText: "Use Local Mode",
          showCancelButton: true,
          cancelButtonText: "Continue without Mods",
        });
        if (isConfirmed) {
          if (fromModioFailure) {
            window.location.reload();
            return;
          }
          yield promptForLogin(true);
          return;
        }
        if (isDenied) store.actions.useLocalMode();
        if (isDismissed && fromModioFailure) store.actions.unsetup();
      });
    }
    function promptForReloadOnError(error) {
      return __awaiter(this, void 0, void 0, function* () {
        const errorLog = createElement("textarea", {
          classList: ["form-control", "text-danger"],
          attributes: [
            ["readonly", "true"],
            ["rows", "5"],
          ],
          children: [
            `Error Name: ${error.name}\nError Message: ${
              error.message
            }\nStack Trace:\n${error.stack || "Stack not available"}`,
          ],
        });
        errorLog.addEventListener("click", () =>
          errorLog.setSelectionRange(0, errorLog.value.length)
        );
        const { isConfirmed, isDismissed } = yield SwalLocale.fire({
          icon: "error",
          title: "Mod Manager failed to load!",
          html: createElement("div", {
            children: [
              createElement("p", {
                text: "The Mod Manager failed to initialize. No mods were loaded.",
              }),
              createElement("div", {
                classList: ["input-group"],
                children: [errorLog],
              }),
            ],
          }),
          confirmButtonText: "Reload to Try Again",
          cancelButtonText: "Continue without Mods",
          showCancelButton: true,
        });
        if (isConfirmed) window.location.reload();
        if (isDismissed) store.actions.unsetup();
      });
    }
    function hasChanges() {
      return promptForReload;
    }
    bus.on(
      bus.source.INSTALL_QUEUE,
      bus.event.COMPLETE,
      onReloadTriggeringEvent
    );
    bus.on(
      bus.source.UNINSTALL_QUEUE,
      bus.event.COMPLETE,
      onReloadTriggeringEvent
    );
    bus.on(bus.source.LOAD_ORDER, bus.event.CHANGE, onReloadTriggeringEvent);
    bus.on(bus.source.DISABLED_MODS, bus.event.CHANGE, onReloadTriggeringEvent);
    store.on("changeDisableAll", onReloadTriggeringEvent);
    return {
      init,
      openModManager,
      isProcessing,
      hasChanges,
      promptToEnable,
      promptToDisable,
      showPromptForReload,
      showPromptForInProgress,
    };
  })();
  const patcher = (() => {
    const blacklist = new Map([
      ["SaveWriter", []],
      ["MelvorDatabase", []],
      ["NativeManager", []],
      ["CloudManager", []],
    ]);
    const patchMap = new Map();
    function patch(mod, className, methodOrPropertyName) {
      if (!className)
        throw new Error(
          "A valid class must be specified to patch a method or getter/setter."
        );
      if (!(methodOrPropertyName in className.prototype))
        throw new Error(
          `No method or getter/setter "${String(
            methodOrPropertyName
          )}" was found on class ${className.name}`
        );
      if (isBlacklisted(className, methodOrPropertyName))
        throw new Error(
          `The method or getter/setter "${String(
            methodOrPropertyName
          )}" on class ${className.name} cannot be patched.`
        );
      if (!patchMap.has(className)) patchMap.set(className, new Map());
      const patches = patchMap.get(className);
      if (!patches.has(methodOrPropertyName)) {
        let inheritanceChain = className.prototype;
        let desc = undefined;
        while (inheritanceChain && !desc) {
          desc = Object.getOwnPropertyDescriptor(
            inheritanceChain,
            methodOrPropertyName
          );
          inheritanceChain = inheritanceChain.__proto__;
        }
        if (!desc)
          throw new Error(
            `No method or getter/setter "${String(
              methodOrPropertyName
            )}" was found on class ${className.name}`
          );
        const isGetterOrSetter =
          desc.get !== undefined || desc.set !== undefined;
        const isMethod = typeof desc.value === "function";
        if (!isGetterOrSetter && !isMethod)
          throw new Error(
            `No method or getter/setter "${String(
              methodOrPropertyName
            )}" was found on class ${className.name}`
          );
        const patcher = isGetterOrSetter
          ? createPropertyPatcher(className, methodOrPropertyName)
          : createMethodPatcher(className, methodOrPropertyName);
        patches.set(methodOrPropertyName, { mods: new Set(), patcher });
      }
      const patch = patches.get(methodOrPropertyName);
      if (patch.mods.size !== 0) {
        const modNames = [];
        patch.mods.forEach((m) => {
          if (m.name !== mod.name) modNames.push(m.name);
        });
        if (modNames.length)
          console.warn(
            `[${mod.name}] Possible mod conflict - ${className.name}.${String(
              methodOrPropertyName
            )} has already been patched by the following mods: ${modNames
              .map((n) => `"${n}"`)
              .join(", ")}`
          );
      }
      patch.mods.add(mod);
      return patch.patcher;
    }
    function isPatched(className, methodName) {
      if (!className)
        throw new Error(
          "A valid class must be specified to check if it is patched."
        );
      if (!(methodName in className.prototype))
        throw new Error(
          `No method or getter/setter ${String(
            methodName
          )} was found on class ${className.name}`
        );
      if (!patchMap.has(className)) return false;
      return patchMap.get(className).has(methodName);
    }
    function createMethodPatcher(typeName, methodName) {
      const beforeHooks = [];
      const originalMethod = typeName.prototype[methodName];
      const overrides = [];
      const afterHooks = [];
      function before(hook) {
        if (typeof hook !== "function") {
          throw new Error("Expected hook to be of type function.");
        }
        beforeHooks.push(hook);
      }
      function replace(override) {
        if (typeof override !== "function") {
          throw new Error("Expected override to be of type function.");
        }
        overrides.push(override);
      }
      function after(hook) {
        if (typeof hook !== "function") {
          throw new Error("Expected hook to be of type function.");
        }
        afterHooks.push(hook);
      }
      typeName.prototype[methodName] = function (...args) {
        for (const hook of beforeHooks) {
          const newArgs = hook.apply(this, args);
          if (Array.isArray(newArgs)) args = newArgs;
        }
        let returnValue = undefined;
        if (!overrides.length) returnValue = originalMethod.apply(this, args);
        else {
          let i = overrides.length - 1;
          const next = (...nextArgs) => {
            args = nextArgs;
            i--;
            if (i < 0) return originalMethod.call(this, ...args);
            return overrides[i].call(this, next, ...args);
          };
          returnValue = overrides[i].call(this, next, ...args);
        }
        for (const hook of afterHooks) {
          const newReturn = hook.call(this, returnValue, ...args);
          if (newReturn !== undefined) returnValue = newReturn;
        }
        return returnValue;
      };
      return { before, replace, after };
    }
    function createPropertyPatcher(typeName, propertyName) {
      let prototype = typeName.prototype;
      let propDesc = undefined;
      while (prototype && !propDesc) {
        propDesc = Object.getOwnPropertyDescriptor(prototype, propertyName);
        if (!propDesc) prototype = prototype.__proto__;
      }
      const originalGetter =
        propDesc === null || propDesc === void 0 ? void 0 : propDesc.get;
      const getters = [];
      const originalSetter =
        propDesc === null || propDesc === void 0 ? void 0 : propDesc.set;
      const setters = [];
      Object.defineProperty(typeName.prototype, propertyName, {
        get() {
          if (!originalGetter && !getters.length) return undefined;
          if (originalGetter && !getters.length)
            return originalGetter.call(this);
          let i = getters.length - 1;
          const next = () => {
            i--;
            if (i < 0)
              return originalGetter === null || originalGetter === void 0
                ? void 0
                : originalGetter.call(this);
            return getters[i].call(this, next);
          };
          return getters[i].call(this, next);
        },
        set(value) {
          if (!originalSetter && !setters.length) return;
          if (originalSetter && !setters.length)
            return originalSetter.call(this, value);
          let i = setters.length - 1;
          const next = (v) => {
            i--;
            if (i < 0) {
              originalSetter === null || originalSetter === void 0
                ? void 0
                : originalSetter.call(this, v);
              return;
            }
            setters[i].call(this, next, v);
          };
          setters[i].call(this, next, value);
        },
        configurable: true,
      });
      return {
        get(getter) {
          if (typeof getter !== "function") {
            throw new Error("Expected getter to be of type function.");
          }
          getters.push(getter);
        },
        set(setter) {
          if (typeof setter !== "function") {
            throw new Error("Expected setter to be of type function.");
          }
          setters.push(setter);
        },
        replace(getter, setter) {
          if (getter && typeof getter !== "function") {
            throw new Error("Expected getter to be of type function.");
          }
          if (setter && typeof setter !== "function") {
            throw new Error("Expected setter to be of type function.");
          }
          if (getter) getters.push(getter);
          if (setter) setters.push(setter);
        },
      };
    }
    function isBlacklisted(typeName, methodName) {
      if (!blacklist.has(typeName.name)) return false;
      const bl = blacklist.get(typeName.name);
      if (!bl.length) return true;
      return bl.some((m) => m === methodName);
    }
    return { patch, isPatched };
  })();
  const contextApi = (() => {
    const loadedContexts = new Map();
    let modsLoadedTriggered = false;
    const modsLoadedHooks = new Map();
    let characterSelectionLoadedTriggered = false;
    const characterSelectionLoadedHooks = new Map();
    let interfaceAvailableTriggered = false;
    const interfaceAvailableHooks = new Map();
    let characterLoadedTriggered = false;
    const characterLoadedHooks = new Map();
    let interfaceReadyTriggered = false;
    const interfaceReadyHooks = new Map();
    const creatorToolkitOpenHooks = new Map();
    function modsLoaded() {
      return __awaiter(this, void 0, void 0, function* () {
        if (modsLoadedTriggered) return;
        modsLoadedTriggered = true;
        yield lifecycle(modsLoadedHooks);
      });
    }
    function characterSelectionLoaded() {
      return __awaiter(this, void 0, void 0, function* () {
        if (characterSelectionLoadedTriggered) return;
        characterSelectionLoadedTriggered = true;
        yield lifecycle(characterSelectionLoadedHooks);
        store.actions.openNextDependencyPrompt();
      });
    }
    function interfaceAvailable() {
      return __awaiter(this, void 0, void 0, function* () {
        if (interfaceAvailableTriggered) return;
        interfaceAvailableTriggered = true;
        yield lifecycle(interfaceAvailableHooks);
      });
    }
    function characterLoaded() {
      return __awaiter(this, void 0, void 0, function* () {
        if (characterLoadedTriggered) return;
        characterLoadedTriggered = true;
        characterStorageContextApi.unlock();
        yield lifecycle(characterLoadedHooks);
      });
    }
    function interfaceReady() {
      return __awaiter(this, void 0, void 0, function* () {
        if (interfaceReadyTriggered) return;
        interfaceReadyTriggered = true;
        settingsContextApi.renderSidebar();
        yield lifecycle(interfaceReadyHooks);
      });
    }
    function creatorToolkitOpen() {
      return __awaiter(this, void 0, void 0, function* () {
        yield lifecycle(creatorToolkitOpenHooks);
      });
    }
    function lifecycle(hooks) {
      return __awaiter(this, void 0, void 0, function* () {
        for (const mod of store.state.loaded) {
          if (!doesContextExist(mod)) continue;
          const ctx = getOrCreateContext(mod);
          const modHooks = hooks.get(mod.id);
          if (!modHooks) continue;
          for (const cb of modHooks) {
            try {
              yield cb(ctx);
            } catch (e) {
              console.error(`[${mod.name}]`, e);
            }
          }
        }
      });
    }
    function doesContextExist(mod) {
      return loadedContexts.has(mod.id);
    }
    function getOrCreateContext(mod) {
      if (!mod) throw new Error("A mod must be supplied to get a context.");
      if (!doesContextExist(mod)) {
        if (mod.id === creatorToolkitId)
          loadedContexts.set(mod.id, createToolkitContext(mod));
        else loadedContexts.set(mod.id, createContext(mod));
      }
      return loadedContexts.get(mod.id);
    }
    function getContext(namespaceOrResource) {
      if (typeof namespaceOrResource === "string") {
        return getContextFromNamespace(namespaceOrResource);
      }
      return getContextFromResource(namespaceOrResource);
    }
    function getContextFromNamespace(namespace) {
      const mod = store.state.loaded.find((m) => m.namespace === namespace);
      if (!mod || mod.id === creatorToolkitId)
        throw new Error(
          `"${namespace}" is not a loaded mod's namespace. The namespace must be defined in the mod's manifest.json in order to use it.`
        );
      return getOrCreateContext(mod);
    }
    function getContextFromResource(resource) {
      let mod;
      if (resource instanceof HTMLScriptElement) {
        mod = loader.getModFromResourceUrl(resource.src);
      } else if (resource && resource.url) {
        mod = loader.getModFromResourceUrl(resource.url);
      }
      if (!mod)
        throw new Error(
          "No mod context is associated with this resource or invalid use of mod.getContext. If calling from a module, pass in import.meta as the parameter. If calling from a script, pass document.currentScript as the parameter."
        );
      return getOrCreateContext(mod);
    }
    function getModsFromError(error) {
      const mods = new Set();
      if (error instanceof Error && error.stack !== undefined) {
        const regexp = new RegExp(
          `blob:${escapeRegExp(
            location.origin
          )}\\/[0-9a-f]{8}-([0-9a-f]{4}-){3}[0-9a-f]{12}`,
          "g"
        );
        const matches = error.stack.match(regexp);
        if (matches !== null) {
          matches.forEach((match) => {
            const mod = loader.getModFromResourceUrl(match);
            if (mod !== undefined && !mods.has(mod)) {
              mods.add(mod);
            }
          });
        }
      }
      return Array.from(mods).map((mod) => {
        return { id: mod.id, name: mod.name, version: mod.version };
      });
    }
    const devMod = {
      id: 0,
      version: "0.0.0",
      name: "Dev",
      description: "",
      namespace: "dev",
      author: "Melvor Idle",
      resources: {},
      tags: { platforms: [], supportedGameVersion: "", types: [] },
      modioUrl: "",
      homepageUrl: "",
      dependencies: [],
    };
    store.state.loaded.push(devMod);
    function getDevContext() {
      return getOrCreateContext(devMod);
    }
    function register(setup) {
      return __awaiter(this, void 0, void 0, function* () {
        if (
          !document.currentScript ||
          document.currentScript instanceof SVGScriptElement
        )
          throw new Error(
            "Invalid use of mod.register. It may only be called from within a script loaded by the Mod Manager."
          );
        const mod = loader.getModFromResourceUrl(document.currentScript.src);
        if (!mod)
          throw new Error(
            "Invalid use of mod.register. It may only be called from within a script loaded by the Mod Manager."
          );
        return yield runSetup(mod, setup);
      });
    }
    function runSetup(mod, setup) {
      return __awaiter(this, void 0, void 0, function* () {
        if (typeof setup !== "function")
          throw new Error(
            `[${mod.name}] You must supply a callback function to receive the context object when registering a mod.`
          );
        const ctx = getOrCreateContext(mod);
        const retVal = yield setup(ctx);
        return retVal;
      });
    }
    function createToolkitContext(mod) {
      const ctx = createContext(mod);
      return Object.assign(Object.assign({}, ctx), {
        isAuthenticated: io.user.isLoggedIn,
        request: io.auth.authenticatedReq,
        binaryPost: io.auth.authenticatedBinaryPost,
        zip: packager.zip,
        parse: parser.parse,
        parseLocal: parser.parseLocal,
        getModResourceUrl: loader.getResourceUrl,
        load(mod) {
          return __awaiter(this, void 0, void 0, function* () {
            yield loader.load(mod);
            store.state.loaded.push(mod);
          });
        },
        onOpen(callback) {
          let hooks = creatorToolkitOpenHooks.get(mod.id);
          if (!hooks) {
            hooks = [];
            creatorToolkitOpenHooks.set(mod.id, hooks);
          }
          hooks.push(callback);
        },
        db: db.localMods,
      });
    }
    function createContext(mod) {
      let ns = undefined;
      if (mod.namespace) {
        ns = game.registeredNamespaces.registerNamespace(
          mod.namespace,
          mod.name,
          true
        );
      }
      const gameDataContext = gameDataContextApi.createContext(mod, ns);
      const characterStorageContext =
        characterStorageContextApi.createContext(mod);
      const accountStorageContext = accountStorageContextApi.createContext(mod);
      const settingsContext = settingsContextApi.createContext(mod, ns);
      const sharingContext = assetSharingContextApi.createContext(mod, ns);
      function getResourceUrl(resourcePath) {
        return loader.getResourceUrl(mod, resourcePath);
      }
      function loadTemplates(resourcePath) {
        return __awaiter(this, void 0, void 0, function* () {
          yield loader.loadTemplates(mod, resourcePath);
        });
      }
      function loadStylesheet(resourcePath) {
        loader.loadStylesheet(mod, resourcePath);
      }
      function loadScript(resourcePath) {
        return __awaiter(this, void 0, void 0, function* () {
          yield loader.loadScript(mod, resourcePath);
        });
      }
      function loadModule(resourcePath) {
        return __awaiter(this, void 0, void 0, function* () {
          return yield loader.loadModule(mod, resourcePath);
        });
      }
      function loadData(resourcePath) {
        return __awaiter(this, void 0, void 0, function* () {
          return yield loader.loadJson(mod, resourcePath);
        });
      }
      function onModsLoaded(callback) {
        if (typeof callback !== "function")
          throw new Error(
            `[${mod.name}] Hook onModsLoaded requires a callback.`
          );
        let hooks = modsLoadedHooks.get(mod.id);
        if (!hooks) {
          hooks = [];
          modsLoadedHooks.set(mod.id, hooks);
        }
        hooks.push(callback);
      }
      function onCharacterSelectionLoaded(callback) {
        if (typeof callback !== "function")
          throw new Error(
            `[${mod.name}] Hook onCharacterSelectionLoaded requires a callback.`
          );
        let hooks = characterSelectionLoadedHooks.get(mod.id);
        if (!hooks) {
          hooks = [];
          characterSelectionLoadedHooks.set(mod.id, hooks);
        }
        hooks.push(callback);
      }
      function onInterfaceAvailable(callback) {
        if (typeof callback !== "function")
          throw new Error(
            `[${mod.name}] Hook onInterfaceAvailable requires a callback.`
          );
        let hooks = interfaceAvailableHooks.get(mod.id);
        if (!hooks) {
          hooks = [];
          interfaceAvailableHooks.set(mod.id, hooks);
        }
        hooks.push(callback);
      }
      function onCharacterLoaded(callback) {
        if (typeof callback !== "function")
          throw new Error(
            `[${mod.name}] Hook onCharacterLoaded requires a callback.`
          );
        let hooks = characterLoadedHooks.get(mod.id);
        if (!hooks) {
          hooks = [];
          characterLoadedHooks.set(mod.id, hooks);
        }
        hooks.push(callback);
      }
      function onInterfaceReady(callback) {
        if (typeof callback !== "function")
          throw new Error(
            `[${mod.name}] Hook onInterfaceReady requires a callback.`
          );
        let hooks = interfaceReadyHooks.get(mod.id);
        if (!hooks) {
          hooks = [];
          interfaceReadyHooks.set(mod.id, hooks);
        }
        hooks.push(callback);
      }
      function api(endpoints) {
        if (!ns) throw NamespaceError(mod, "api");
        if (typeof endpoints === "object")
          modApis[ns.name] = Object.assign(
            Object.assign({}, modApis[ns.name]),
            endpoints
          );
        else if (typeof endpoints !== "undefined")
          throw new Error(
            `[${mod.name}] Invalid use of api. Parameter endpoints must be of type object.`
          );
        return modApis[ns.name];
      }
      function patch(_class, methodName) {
        return patcher.patch(mod, _class, methodName);
      }
      function isPatched(_class, methodName) {
        return patcher.isPatched(_class, methodName);
      }
      return {
        get name() {
          return mod.name;
        },
        get namespace() {
          return mod.namespace;
        },
        get version() {
          return mod.version;
        },
        gameData: gameDataContext,
        characterStorage: characterStorageContext,
        accountStorage: accountStorageContext,
        settings: settingsContext,
        getResourceUrl,
        loadTemplates,
        loadStylesheet,
        loadScript,
        loadModule,
        loadData,
        onModsLoaded,
        onCharacterSelectionLoaded,
        onInterfaceAvailable,
        onCharacterLoaded,
        onInterfaceReady,
        share: sharingContext.share,
        api,
        patch,
        isPatched,
      };
    }
    return {
      register,
      runSetup,
      hasModsLoadedTriggered: () => modsLoadedTriggered,
      hasCharacterSelectionLoadedTriggered: () =>
        characterSelectionLoadedTriggered,
      hasCharacterLoadedTriggered: () => characterLoadedTriggered,
      hasInterfaceReadyTriggered: () => interfaceReadyTriggered,
      trigger: {
        modsLoaded,
        characterSelectionLoaded,
        interfaceAvailable,
        characterLoaded,
        interfaceReady,
        creatorToolkitOpen,
      },
      getContext,
      getDevContext,
      getModsFromError,
    };
  })();
  const assetSharingContextApi = (() => {
    const sharedAssets = new Map();
    function createContext(mod, ns) {
      if (!ns) {
        return {
          share: () => {
            throw NamespaceError(mod, "share");
          },
        };
      }
      function share(resourcePath) {
        if (!mod.resources[resourcePath])
          throw new Error(
            `[${mod.name}] Cannot share asset "${resourcePath}" as it does not exist.`
          );
        if (!sharedAssets.has(ns.name)) sharedAssets.set(ns.name, new Set());
        sharedAssets.get(ns.name).add(resourcePath);
      }
      return { share };
    }
    function isShared(namespace, asset) {
      if (!sharedAssets.has(namespace)) return false;
      return sharedAssets.get(namespace).has(asset);
    }
    return { createContext, isShared };
  })();
  const gameDataContextApi = (() => {
    function createContext(mod, ns) {
      if (!ns)
        return {
          addPackage: () => {
            throw NamespaceError(mod, "gameData.addPackage");
          },
          buildPackage: () => {
            throw NamespaceError(mod, "gameData.buildPackage");
          },
        };
      function addPackage(data) {
        return __awaiter(this, void 0, void 0, function* () {
          if (typeof data === "string") data = yield loader.loadJson(mod, data);
          data.namespace = ns.name;
          try {
            game.registerDataPackage(data);
          } catch (e) {
            throw new Error(
              `[${mod.name}] ${e instanceof Error ? e.message : e}`
            );
          }
        });
      }
      function buildPackage(builder) {
        const pkg = PackageBuilder(ns, builder);
        return { package: pkg, add: () => addPackage(pkg) };
      }
      return { addPackage, buildPackage };
    }
    function PackageBuilder(ns, builder) {
      const pkg = {
        $schema: "../schema/gameData.json",
        namespace: ns.name,
        data: {},
      };
      function addData(key, data) {
        if (key === "golbinRaid") {
          pkg.data[key] = data;
        } else {
          if (!pkg.data[key]) pkg.data[key] = [];
          pkg.data[key].push(data);
        }
      }
      function modifyData(key, data) {
        if (!pkg.modifications) pkg.modifications = {};
        if (!pkg.modifications[key]) pkg.modifications[key] = [];
        pkg.modifications[key].push(data);
      }
      builder({
        ancientSpells: { add: (data) => addData("ancientSpells", data) },
        archaicSpells: { add: (data) => addData("archaicSpells", data) },
        attacks: { add: (data) => addData("attacks", data) },
        attackStyles: { add: (data) => addData("attackStyles", data) },
        auroraSpells: { add: (data) => addData("auroraSpells", data) },
        bankSortOrder: { add: (data) => addData("bankSortOrder", data) },
        combatAreas: { add: (data) => addData("combatAreas", data) },
        combatAreaDisplayOrder: {
          add: (data) => addData("combatAreaDisplayOrder", data),
        },
        combatEvents: { add: (data) => addData("combatEvents", data) },
        combatPassives: { add: (data) => addData("combatPassives", data) },
        cookingCategories: {
          modify: (data) => modifyData("cookingCategories", data),
        },
        curseSpells: { add: (data) => addData("curseSpells", data) },
        dungeons: { add: (data) => addData("dungeons", data) },
        dungeonDisplayOrder: {
          add: (data) => addData("dungeonDisplayOrder", data),
        },
        fletchingRecipes: {
          modify: (data) => modifyData("fletchingRecipes", data),
        },
        gamemodes: { add: (data) => addData("gamemodes", data) },
        golbinRaid: { add: (data) => addData("golbinRaid", data) },
        items: { add: (data) => addData("items", data) },
        itemEffects: { add: (data) => addData("itemEffects", data) },
        itemSynergies: { add: (data) => addData("itemSynergies", data) },
        itemUpgrades: { add: (data) => addData("itemUpgrades", data) },
        lore: { add: (data) => addData("lore", data) },
        monsters: { add: (data) => addData("monsters", data) },
        pages: { add: (data) => addData("pages", data) },
        pets: { add: (data) => addData("pets", data) },
        prayers: { add: (data) => addData("prayers", data) },
        randomGems: { add: (data) => addData("randomGems", data) },
        randomSuperiorGems: {
          add: (data) => addData("randomSuperiorGems", data),
        },
        shopCategories: { add: (data) => addData("shopCategories", data) },
        shopCategoryOrder: {
          add: (data) => addData("shopCategoryOrder", data),
        },
        shopPurchases: {
          add: (data) => addData("shopPurchases", data),
          modify: (data) => modifyData("shopPurchases", data),
        },
        shopDisplayOrder: { add: (data) => addData("shopDisplayOrder", data) },
        shopUpgradeChains: {
          add: (data) => addData("shopUpgradeChains", data),
          modify: (data) => modifyData("shopUpgradeChains", data),
        },
        skills: { add: (_class) => game.registerSkill(ns, _class) },
        skillData: { add: (data) => addData("skillData", data) },
        slayerAreas: { add: (data) => addData("slayerAreas", data) },
        slayerAreaDisplayOrder: {
          add: (data) => addData("slayerAreaDisplayOrder", data),
        },
        itmMonsters: { add: (data) => addData("itmMonsters", data) },
        spiderLairMonsters: {
          add: (data) => addData("spiderLairMonsters", data),
        },
        stackingEffects: { add: (data) => addData("stackingEffects", data) },
        standardSpells: { add: (data) => addData("standardSpells", data) },
        steamAchievements: { add: (_data) => console.error("Hah, no.") },
        tutorialStages: { add: (data) => addData("tutorialStages", data) },
        tutorialStageOrder: {
          add: (data) => addData("tutorialStageOrder", data),
        },
      });
      return pkg;
    }
    return { createContext };
  })();
  const characterStorageContextApi = (() => {
    const MAX_CHARACTER_STORAGE = Math.pow(2, 13);
    let unlocked = false;
    const characterStorage = new Map();
    function createContext(mod) {
      function setItem(key, data) {
        if (data === undefined) return removeItem(key);
        if (!unlocked) throw LockedError(mod);
        if (typeof key !== "string")
          throw new Error(
            `[${mod.name}] Data key is expected to be of type 'string'.`
          );
        const storedValue = JSON.stringify(data);
        const thisSize = key.length + storedValue.length;
        if (!characterStorage.has(mod.id))
          characterStorage.set(mod.id, new Map());
        const modData = characterStorage.get(mod.id);
        const totalDataSize = Array.from(modData).reduce((total, [k, v]) => {
          if (k === key) return total;
          return total + k.length + v.length;
        }, 0);
        if (totalDataSize + thisSize > MAX_CHARACTER_STORAGE)
          throw new Error(
            `[${mod.name}] Cannot add ${formatNumber(
              thisSize
            )} bytes of data to characterStorage. Total character storage for this mod would exceed the limit of ${formatNumber(
              MAX_CHARACTER_STORAGE
            )} bytes.`
          );
        modData.set(key, storedValue);
      }
      function getItem(key) {
        if (!unlocked) throw LockedError(mod);
        if (!characterStorage.has(mod.id)) return undefined;
        if (!characterStorage.get(mod.id).has(key)) return undefined;
        return JSON.parse(characterStorage.get(mod.id).get(key));
      }
      function removeItem(key) {
        if (!unlocked) throw LockedError(mod);
        if (!characterStorage.has(mod.id)) return;
        characterStorage.get(mod.id).delete(key);
      }
      function clear() {
        if (!unlocked) throw LockedError(mod);
        if (!characterStorage.has(mod.id)) return;
        characterStorage.get(mod.id).clear();
      }
      return { setItem, getItem, removeItem, clear };
    }
    function LockedError(mod) {
      return new Error(
        `[${mod.name}] Cannot use characterStorage before a character has been loaded.`
      );
    }
    function unlock() {
      unlocked = true;
    }
    function serialize(mod) {
      if (!characterStorage.has(mod.id)) return null;
      const data = Array.from(characterStorage.get(mod.id));
      return data.map(([key, value]) => [key, JSON.parse(value)]);
    }
    function deserialize(mod, data) {
      if (!data) return;
      characterStorage.set(mod.id, new Map());
      const modStorage = characterStorage.get(mod.id);
      for (const [key, value] of data) {
        modStorage.set(key, JSON.stringify(value));
      }
    }
    return { createContext, unlock, serialize, deserialize };
  })();
  const accountStorageContextApi = (() => {
    const MAX_ACCOUNT_STORAGE = Math.pow(2, 13);
    const accountStorage = new Map();
    function createContext(mod) {
      function setItem(key, data) {
        if (data === undefined) return removeItem(key);
        if (typeof key !== "string")
          throw new Error(
            `[${mod.name}] Data key is expected to be of type 'string'.`
          );
        const storedValue = JSON.stringify(data);
        const thisSize = key.length + storedValue.length;
        if (!accountStorage.has(mod.id)) accountStorage.set(mod.id, new Map());
        const modData = accountStorage.get(mod.id);
        const totalDataSize = Array.from(modData).reduce((total, [k, v]) => {
          if (k === key) return total;
          return total + k.length + v.length;
        }, 0);
        if (totalDataSize + thisSize > MAX_ACCOUNT_STORAGE)
          throw new Error(
            `[${mod.name}] Cannot add ${formatNumber(
              thisSize
            )} bytes of data to accountStorage. Total account storage for this mod would exceed the limit of ${formatNumber(
              MAX_ACCOUNT_STORAGE
            )} bytes.`
          );
        modData.set(key, storedValue);
        queuePersist();
      }
      function getItem(key) {
        if (!accountStorage.has(mod.id)) return undefined;
        if (!accountStorage.get(mod.id).has(key)) return undefined;
        return JSON.parse(accountStorage.get(mod.id).get(key));
      }
      function removeItem(key) {
        if (!accountStorage.has(mod.id)) return;
        accountStorage.get(mod.id).delete(key);
        queuePersist();
      }
      function clear() {
        if (!accountStorage.has(mod.id)) return;
        accountStorage.get(mod.id).clear();
        queuePersist();
      }
      return { setItem, getItem, removeItem, clear };
    }
    function queuePersist() {
      const data = [];
      for (const mod of store.state.loaded) {
        const modData = serialize(mod);
        if (!modData) continue;
        data.push([mod.id, modData]);
      }
      playFabManager.queueUpdate("modAccountStorage", JSON.stringify(data));
    }
    function deserializeAll(allData) {
      if (!allData) return;
      const parsedData = JSON.parse(allData);
      for (const data of parsedData) {
        const modId = data[0];
        const mod = store.state.installed.find((m) => m.id === modId);
        if (!mod) continue;
        deserialize(mod, data[1]);
      }
    }
    function serialize(mod) {
      if (!accountStorage.has(mod.id)) return null;
      const data = Array.from(accountStorage.get(mod.id));
      return data.map(([key, value]) => [key, JSON.parse(value)]);
    }
    function deserialize(mod, data) {
      if (!data || !Array.isArray(data)) return;
      accountStorage.set(mod.id, new Map());
      const modStorage = accountStorage.get(mod.id);
      for (const [key, value] of data) {
        modStorage.set(key, JSON.stringify(value));
      }
    }
    return { createContext, serialize, deserialize, deserializeAll };
  })();
  const settingsContextApi = (() => {
    const allSections = new Map();
    const disabledModSections = new Map();
    const elementValueMap = new Map();
    let sidebarRendered = false;
    function renderSidebar() {
      if (sidebarRendered) return;
      sidebarRendered = true;
      for (const [modId] of allSections) {
        const mod = store.state.loaded.find((m) => m.id === modId);
        if (!mod) continue;
        renderModSidebar(mod);
      }
    }
    function renderModSidebar(mod) {
      var _a;
      const modSettingsItem = sidebar.category("Modding").item("Mod Settings");
      (_a = modSettingsItem.rootEl) === null || _a === void 0
        ? void 0
        : _a.classList.remove("d-none");
      const existingSubitems = modSettingsItem.subitems();
      let before;
      for (const subitem of existingSubitems) {
        if (mod.name < subitem.id) {
          before = subitem.id;
          break;
        }
      }
      let iconSrc = cdnMedia("assets/media/mods/placeholder_icon.png");
      if (mod.icon) {
        try {
          iconSrc = loader.getResourceUrl(mod, mod.icon);
        } catch (_b) {
          console.error(
            `[${mod.name}] The icon file "${mod.icon}" does not exist.`
          );
        }
      }
      modSettingsItem.subitem(mod.name, {
        name: createElement("span", {
          children: [
            createElement("img", {
              classList: ["mr-2"],
              attributes: [
                ["src", iconSrc],
                ["height", "24"],
                ["width", "24"],
              ],
            }),
            mod.name,
          ],
        }),
        before,
        onClick: () => renderModSettings(mod),
      });
    }
    function renderModSettings(mod) {
      if (!allSections.has(mod.id)) return;
      const sections = allSections.get(mod.id);
      if (!sections.length) return;
      const html = createElement("div");
      createElement("h3", {
        classList: ["block-title", "mb-2"],
        text: `Settings: ${mod.name}`,
        parent: html,
      });
      for (const section of sections) {
        createElement("h2", {
          classList: ["content-heading", "border-bottom", "mb-4", "pb-2"],
          text: section.name,
          parent: html,
        });
        const settingWrapper = createElement("div", {
          classList: ["col"],
          parent: createElement("div", { classList: ["row"], parent: html }),
        });
        for (const setting of section.settings) {
          createElement("div", {
            classList: ["mb-4"],
            parent: settingWrapper,
            children: [setting.root],
          });
        }
      }
      Swal.fire({
        customClass: {
          container: "swal-infront",
          htmlContainer: "mm__container font-size-sm text-left mt-2 mb-0 mx-3",
        },
        html,
        showConfirmButton: false,
        showCloseButton: true,
      });
    }
    function createContext(mod, ns) {
      function section(name) {
        if (name.length > 32)
          throw new Error(
            `[${mod.name}] Setting section name is too long. Maximum length is 32 characters.`
          );
        if (!allSections.has(mod.id)) allSections.set(mod.id, []);
        const sections = allSections.get(mod.id);
        let section = sections.find((s) => s.name === name);
        if (!section) {
          section = { name, settings: [] };
          sections.push(section);
        }
        if (
          sidebarRendered &&
          !sidebar
            .category("Modding")
            .item("Mod Settings")
            .subitems()
            .some((s) => s.id === mod.name)
        ) {
          renderModSidebar(mod);
        }
        function get(name) {
          const setting = section.settings.find((s) => s.config.name === name);
          if (!setting) throw new Error(`[${mod.name}] No such setting found.`);
          return setting.get();
        }
        function set(name, value) {
          const setting = section.settings.find((s) => s.config.name === name);
          if (!setting) throw new Error(`[${mod.name}] No such setting found.`);
          setting.set(value);
        }
        function add(config) {
          if (Array.isArray(config)) {
            for (const c of config) {
              addSetting(c);
            }
            return;
          }
          addSetting(config);
        }
        function addSetting(config) {
          const setting = createSetting(mod, config);
          section.settings.push(setting);
        }
        return { get, set, add };
      }
      function type(name, config, configValidator) {
        if (!ns) throw NamespaceError(mod, "settings.type");
        createType(mod, name, config, configValidator);
      }
      return { section, type };
    }
    function createSetting(mod, config) {
      if (mod.namespace) {
        const selfModdedType = `${mod.namespace}:${config.type}`;
        if (types[selfModdedType]) return types[selfModdedType](mod, config);
      }
      if (!types[config.type])
        throw new Error(
          `[${mod.name}] Invalid setting type: "${config.type}".`
        );
      return types[config.type](mod, config);
    }
    function createType(mod, name, config, configValidator) {
      const fullName = `${mod.namespace}:${name}`;
      if (types[fullName])
        throw new Error(
          `[${mod.name}] Setting type "${fullName}" already exists.`
        );
      types[fullName] = (instanceMod, instanceConfig) => {
        if (configValidator) {
          try {
            configValidator(instanceConfig);
          } catch (e) {
            throw new Error(`[${instanceMod.name}] ${e}`);
          }
        }
        return Custom(
          instanceMod,
          Object.assign(Object.assign({}, instanceConfig), {
            render: config.render,
            get: config.get,
            set: config.set,
          })
        );
      };
      return fullName;
    }
    const types = {
      text: Text,
      number: Number,
      switch: Switch,
      dropdown: Dropdown,
      button: Button,
      "checkbox-group": CheckboxGroup,
      "radio-group": RadioGroup,
      label: Label,
      custom: Custom,
    };
    function InputLabel(name, label, hint) {
      const labelEl = createElement("label", {
        classList: [
          "font-weight-normal",
          "flex-wrap",
          "justify-content-start",
          "ml-2",
        ],
        children: [label],
        attributes: [["for", name]],
      });
      if (hint) {
        createElement("span", {
          classList: ["ms__force-wrap"],
          parent: labelEl,
        });
        createElement("small", {
          classList: ["d-block"],
          children: [hint],
          parent: labelEl,
        });
      }
      return labelEl;
    }
    function ValidationMessage() {
      return createElement("small", {
        classList: [
          "text-danger",
          "ms__validation-message",
          "validation-message",
          "ml-2",
        ],
        text: "",
      });
    }
    function Text(mod, config) {
      function render(name, onChange, config) {
        const input = createElement("input", {
          id: name,
          classList: ["form-control", "form-control-lg"],
          attributes: [
            ["type", "text"],
            ["name", name],
          ],
        });
        const group = createElement("div", {
          classList: ["form-group"],
          children: [
            InputLabel(name, config.label, config.hint),
            input,
            ValidationMessage(),
          ],
        });
        if (config.maxLength) input.maxLength = config.maxLength;
        if (config.default) input.value = config.default;
        input.addEventListener("change", () => onChange());
        return group;
      }
      function get(root) {
        return root.querySelector("input").value;
      }
      function set(root, data) {
        root.querySelector("input").value = data;
      }
      return Setting(
        mod,
        Object.assign(Object.assign({}, config), { render, get, set })
      );
    }
    function Number(mod, config) {
      function render(name, onChange, config) {
        const input = createElement("input", {
          id: name,
          classList: ["form-control", "form-control-lg"],
          attributes: [
            ["type", "number"],
            ["name", name],
          ],
        });
        const group = createElement("div", {
          classList: ["form-group"],
          children: [
            InputLabel(name, config.label, config.hint),
            input,
            ValidationMessage(),
          ],
        });
        if (config.min != null) input.min = config.min.toString();
        if (config.max != null) input.max = config.max.toString();
        if (config.default != null) input.value = config.default.toString();
        input.addEventListener("change", () => onChange());
        return group;
      }
      function get(root) {
        const value = parseFloat(root.querySelector("input").value);
        return isNaN(value) ? config.default || 0 : value;
      }
      function set(root, data) {
        var _a;
        root.querySelector("input").value =
          (data === null || data === void 0 ? void 0 : data.toString()) ||
          ((_a = config.default) === null || _a === void 0
            ? void 0
            : _a.toString()) ||
          "0";
      }
      return Setting(
        mod,
        Object.assign(Object.assign({}, config), { render, get, set })
      );
    }
    function Switch(mod, config) {
      function render(name, onChange, config) {
        const input = createElement("input", {
          id: name,
          classList: ["custom-control-input"],
          attributes: [
            ["type", "checkbox"],
            ["name", name],
          ],
        });
        const label = InputLabel(name, config.label, config.hint);
        label.classList.add("custom-control-label");
        const group = createElement("div", {
          classList: ["custom-control", "custom-switch", "custom-control-lg"],
          children: [input, label, ValidationMessage()],
        });
        if (config.default) input.checked = true;
        input.addEventListener("change", () => onChange());
        return group;
      }
      function get(root) {
        return root.querySelector("input").checked;
      }
      function set(root, data) {
        root.querySelector("input").checked = data;
      }
      return Setting(
        mod,
        Object.assign(Object.assign({}, config), { render, get, set })
      );
    }
    function Dropdown(mod, config) {
      if (config.default === undefined)
        throw new Error(
          `[${mod.name}] A default value must be specified when creating a dropdown setting.`
        );
      if (!Array.isArray(config.options) || config.options.length === 0)
        throw new Error(
          `[${mod.name}] You must define an array of options when creating a dropdown setting.`
        );
      const defaultOption = config.options.find(
        (o) => o.value === config.default
      );
      if (defaultOption === undefined)
        throw new Error(
          `[${mod.name}] The default value must match the value of one of the defined options when creating a dropdown setting.`
        );
      function render(name, onChange, config) {
        const button = createElement("button", {
          id: name,
          classList: [
            "btn",
            `btn-${config.color || "primary"}`,
            "dropdown-toggle",
            "font-size-sm",
          ],
          attributes: [
            ["type", "button"],
            ["data-toggle", "dropdown"],
            ["aria-haspopup", "true"],
            ["aria-expanded", "false"],
          ],
        });
        const options = [];
        for (const option of config.options) {
          const opt = createElement("button", {
            classList: ["dropdown-item", "pointer-enabled"],
            children: [option.display],
          });
          elementValueMap.set(opt, option.value);
          opt.addEventListener("click", () => {
            button.innerHTML =
              option.display instanceof HTMLElement
                ? option.display.outerHTML
                : option.display;
            elementValueMap.set(button, option.value);
            onChange();
          });
          if (config.default === option.value) {
            button.innerHTML = opt.innerHTML;
            elementValueMap.set(button, option.value);
          }
          options.push(opt);
        }
        const dropdownMenu = createElement("div", {
          classList: ["dropdown-menu", "font-size-sm"],
          attributes: [["aria-labelledby", name]],
          children: options,
        });
        const dropdown = createElement("div", {
          classList: ["dropdown"],
          children: [button, dropdownMenu],
        });
        const group = createElement("div", {
          classList: ["form-inline", "flex-wrap-reverse"],
          children: [
            ValidationMessage(),
            dropdown,
            InputLabel(name, config.label, config.hint),
          ],
        });
        return group;
      }
      function get(root) {
        return elementValueMap.get(root.querySelector("button"));
      }
      function set(root, data) {
        const option = config.options.find((o) => o.value === data);
        if (!option)
          throw new Error(
            `[${mod.name}] Could not set setting ${config.label} to ${data}. No valid option found.`
          );
        const btn = root.querySelector("button");
        elementValueMap.set(btn, data);
        btn.innerHTML =
          option.display instanceof HTMLElement
            ? option.display.outerHTML
            : option.display;
      }
      return Setting(
        mod,
        Object.assign(Object.assign({}, config), { render, get, set })
      );
    }
    function Button(mod, config) {
      if (!config.display)
        throw new Error(
          `[${mod.name}] A display value must be defined when creating a button setting.`
        );
      if (!config.onClick || typeof config.onClick !== "function")
        throw new Error(
          `[${mod.name}] An onClick function must be defined when creating a button setting.`
        );
      function render(name, onChange, config) {
        const button = createElement("button", {
          id: name,
          classList: [
            "btn",
            `btn-${config.color || "primary"}`,
            "font-size-sm",
          ],
          attributes: [["type", "button"]],
          children: [config.display],
        });
        button.addEventListener("click", () => onChange());
        const group = createElement("div", {
          classList: ["form-inline", "flex-wrap-reverse"],
          children: [ValidationMessage(), button],
        });
        if (config.label || config.hint)
          group.appendChild(InputLabel(name, config.label, config.hint));
        return group;
      }
      function get() {}
      function set() {}
      return Setting(
        mod,
        Object.assign(Object.assign({}, config), {
          onChange: config.onClick,
          render,
          get,
          set,
        })
      );
    }
    function CheckboxGroup(mod, config) {
      if (!Array.isArray(config.options) || config.options.length === 0)
        throw new Error(
          `[${mod.name}] You must define an array of options when creating a checkbox group setting.`
        );
      function render(name, onChange, config) {
        const group = createElement("div", { classList: ["form-group"] });
        if (config.label || config.hint)
          group.appendChild(InputLabel(name, config.label, config.hint));
        for (let i = 0; i < config.options.length; i++) {
          const option = config.options[i];
          const optName = `${name}[${i}]`;
          const checkbox = createElement("input", {
            id: optName,
            classList: ["custom-control-input"],
            attributes: [
              ["type", "checkbox"],
              ["name", optName],
            ],
          });
          elementValueMap.set(checkbox, option.value);
          const label = InputLabel(optName, option.label, option.hint);
          label.classList.add("custom-control-label");
          const control = createElement("div", {
            classList: [
              "custom-control",
              "custom-checkbox",
              "custom-control-lg",
              "mb-1",
            ],
            children: [checkbox, label],
          });
          if (config.default && config.default.includes(option.value))
            checkbox.checked = true;
          checkbox.addEventListener("change", () => onChange());
          group.appendChild(control);
        }
        group.appendChild(ValidationMessage());
        return group;
      }
      function get(root) {
        const checkboxes = root.querySelectorAll('input[type="checkbox"]');
        const value = [];
        checkboxes.forEach(
          (c) => c.checked && value.push(elementValueMap.get(c))
        );
        return value;
      }
      function set(root, data) {
        const checkboxes = root.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(
          (c) =>
            data && data.includes(elementValueMap.get(c)) && (c.checked = true)
        );
      }
      return Setting(
        mod,
        Object.assign(Object.assign({}, config), { render, get, set })
      );
    }
    function RadioGroup(mod, config) {
      if (!Array.isArray(config.options) || config.options.length === 0)
        throw new Error(
          `[${mod.name}] You must define an array of options when creating a radio group setting.`
        );
      function render(name, onChange, config) {
        const group = createElement("div", { classList: ["form-group"] });
        if (config.label || config.hint)
          group.appendChild(InputLabel(name, config.label, config.hint));
        for (let i = 0; i < config.options.length; i++) {
          const option = config.options[i];
          const optName = `${name}[${i}]`;
          const radio = createElement("input", {
            id: optName,
            classList: ["custom-control-input"],
            attributes: [
              ["type", "radio"],
              ["name", name],
            ],
          });
          elementValueMap.set(radio, option.value);
          const label = InputLabel(optName, option.label, option.hint);
          label.classList.add("custom-control-label");
          const control = createElement("div", {
            classList: [
              "custom-control",
              "custom-radio",
              "custom-control-lg",
              "mb-1",
            ],
            children: [radio, label],
          });
          if (config.default === option.value) radio.checked = true;
          radio.addEventListener("change", () => onChange());
          group.appendChild(control);
        }
        group.appendChild(ValidationMessage());
        return group;
      }
      function get(root) {
        const radios = root.querySelectorAll('input[type="radio"]');
        for (const radio of Array.from(radios)) {
          if (radio.checked) return elementValueMap.get(radio);
        }
        return "";
      }
      function set(root, data) {
        const radios = root.querySelectorAll('input[type="radio"]');
        radios.forEach((c) => {
          if (elementValueMap.get(c) === data) c.checked = true;
        });
      }
      return Setting(
        mod,
        Object.assign(Object.assign({}, config), { render, get, set })
      );
    }
    function Label(mod, config) {
      if (!config.label)
        throw new Error(
          `[${mod.name}] A label value must be defined when creating a label setting.`
        );
      function render(name, onChange, config) {
        const label = createElement("span", {
          id: name,
          children: [config.label],
        });
        if (config.hint)
          createElement("small", {
            classList: ["d-block"],
            children: [config.hint],
            parent: label,
          });
        return label;
      }
      function get() {}
      function set() {}
      return Setting(
        mod,
        Object.assign(Object.assign({}, config), { render, get, set })
      );
    }
    function Custom(mod, config) {
      if (!config.render)
        throw new Error(
          `[${mod.name}] A render function must be defined when creating a custom setting.`
        );
      if (!config.get)
        throw new Error(
          `[${mod.name}] A get function must be defined when creating a custom setting.`
        );
      if (!config.set)
        throw new Error(
          `[${mod.name}] A set function must be defined when creating a custom setting.`
        );
      return Setting(mod, Object.assign({}, config));
    }
    function Setting(mod, config) {
      if (!config.name)
        throw new Error(
          `[${mod.name}] A name must be defined when creating a setting.`
        );
      let value = config.default;
      const root = config.render(
        `${mod.namespace}:${config.name}`,
        onChange,
        config
      );
      function onChange(options) {
        const newValue = config.get(root);
        const res = (
          options === null || options === void 0
            ? void 0
            : options.isRestoringValue
        )
          ? true
          : config.onChange
          ? config.onChange(newValue, value)
          : true;
        const validation = root.querySelector(".validation-message");
        if (typeof res === "string") {
          config.set(root, value);
          if (validation) {
            validation.textContent = res;
            validation.classList.add("d-block");
          }
          return;
        }
        if (validation) {
          validation.textContent = "";
          validation.classList.remove("d-block");
        }
        if (res !== undefined && !res) {
          config.set(root, value);
          return;
        }
        value = newValue;
        config.set(root, value);
      }
      function get() {
        return value;
      }
      function set(val, options) {
        config.set(root, val);
        onChange(options);
      }
      const setting = { mod, config, root, get, set };
      return setting;
    }
    function serialize(mod) {
      if (!allSections.has(mod.id)) return serializeDisabled(mod);
      const sections = allSections.get(mod.id);
      const data = [];
      for (const section of sections) {
        if (!section.settings.length) continue;
        const s = [section.name, []];
        for (const setting of section.settings) {
          s[1].push([setting.config.name, setting.get()]);
        }
        data.push(s);
      }
      const serializeSize = JSON.stringify(data);
      if (serializeSize.length > 5000) {
        console.error(
          new Error(
            `[${mod.name}] Total settings storage is too large (> 5 KB). Settings values will not be persisted.`
          )
        );
        return null;
      }
      return data;
    }
    function serializeDisabled(mod) {
      if (!disabledModSections.has(mod.id)) return null;
      return disabledModSections.get(mod.id);
    }
    function deserialize(mod, data) {
      if (!data) return;
      if (!allSections.has(mod.id)) {
        deserializeDisabled(mod, data);
        return;
      }
      const sections = allSections.get(mod.id);
      for (const section of data) {
        const s = sections.find((s) => s.name === section[0]);
        if (!s) continue;
        for (const setting of section[1]) {
          const stg = s.settings.find((s) => s.config.name === setting[0]);
          if (!stg) continue;
          stg.set(setting[1], { isRestoringValue: true });
        }
      }
    }
    function deserializeDisabled(mod, data) {
      if (!data) return;
      disabledModSections.set(mod.id, data);
    }
    return { createContext, renderSidebar, serialize, deserialize };
  })();
  const encoder = (() => {
    function encode(writer) {
      const data = [];
      for (const mod of store.state.installed) {
        const settingsData = settingsContextApi.serialize(mod);
        const characterStorageData = characterStorageContextApi.serialize(mod);
        if (!settingsData && !characterStorageData) continue;
        data.push([mod.id, settingsData, characterStorageData]);
      }
      writer.writeArray(data, (mod, w) => {
        w.writeUint32(mod[0]);
        w.writeString(JSON.stringify(mod[1]));
        w.writeString(JSON.stringify(mod[2]));
      });
      return writer;
    }
    function decode(reader, version) {
      reader.getArray((r) => {
        const modId = r.getUint32();
        const setttingsContextAPIRaw = r.getString();
        const characterStorageContextApiRaw = r.getString();
        const mod = store.state.installed.find((m) => m.id === modId);
        if (!mod) return;
        settingsContextApi.deserialize(mod, JSON.parse(setttingsContextAPIRaw));
        characterStorageContextApi.deserialize(
          mod,
          JSON.parse(characterStorageContextApiRaw)
        );
      });
    }
    return { encode, decode };
  })();
  const playFabManager = (() => {
    const updates = [];
    const cachedValues = new Map();
    let debounceTimeout = null;
    function queueUpdate(key, data) {
      if (cachedValues.get(key) === data) {
        dequeueUpdate(key);
        return;
      }
      const existingQueuedItem = updates.find((i) => i[0] === key);
      if (existingQueuedItem) {
        existingQueuedItem[1] = data;
        debounce();
        return;
      }
      updates.push([key, data]);
      debounce();
    }
    function dequeueUpdate(key) {
      const existingQueuedIndex = updates.findIndex((i) => i[0] === key);
      if (existingQueuedIndex === -1) return;
      updates.splice(existingQueuedIndex, 1);
    }
    function debounce() {
      if (debounceTimeout) {
        clearTimeout(debounceTimeout);
      }
      debounceTimeout = setTimeout(persist, 3 * 1000);
    }
    function persist() {
      if (!updates.length) return;
      const data = {};
      for (let i = 0; i < 10 && i < updates.length; i++) {
        data[updates[i][0]] = updates[i][1];
        cachedValues.set(updates[i][0], updates[i][1]);
      }
      const pulled = updates.splice(0, 10);
      return new Promise((resolve, reject) => {
        PlayFab.ClientApi.UpdateUserData({ Data: data }, (_res, err) => {
          if (err) {
            updates.push(...pulled);
            reject(
              `Error while persisting mod account data: ${PlayFab.GenerateErrorReport(
                err
              )}`
            );
            return;
          }
          resolve();
        });
        persist();
        debounceTimeout = null;
      });
    }
    function retrieve(keys) {
      return __awaiter(this, void 0, void 0, function* () {
        if (keys.length > 10) throw new Error("2 many keyz");
        return new Promise((resolve, reject) => {
          PlayFab.ClientApi.GetUserData({ Keys: keys }, (res, err) => {
            if (err)
              return reject(
                `Error while retrieving mod account data: ${PlayFab.GenerateErrorReport(
                  err
                )}`
              );
            const values = {};
            if (!res.data.Data) return resolve(values);
            for (const key of keys) {
              const value = res.data.Data[key]
                ? res.data.Data[key].Value
                : null;
              values[key] = value;
              if (value) cachedValues.set(key, value);
            }
            return resolve(values);
          });
        });
      });
    }
    function cachedValue(key) {
      return cachedValues.get(key);
    }
    return { queueUpdate, dequeueUpdate, retrieve, cachedValue, persist };
  })();
  function NamespaceError(mod, endpoint) {
    return new Error(
      `[${mod.name}] No namespace was registered and so the "${endpoint}" endpoint is not accessible. Please define a valid namespace within manifest.json to use this resource.`
    );
  }
  const modApis = {};
  return {
    manager: {
      init: manager.init,
      isHidden: () => store.state.moddingStatus === ModdingStatus.Hidden,
      isEnabled: () => store.state.moddingStatus === ModdingStatus.Enabled,
      open: manager.openModManager,
      isProcessing: manager.isProcessing,
      hasChanges: manager.hasChanges,
      promptToEnable: manager.promptToEnable,
      promptToDisable: manager.promptToDisable,
      showPromptForReload: manager.showPromptForReload,
      showPromptForInProgress: manager.showPromptForInProgress,
      getLoadedModList: store.getters.loadedModList,
    },
    register: contextApi.register,
    trigger: contextApi.trigger,
    api: modApis,
    getContext: contextApi.getContext,
    getDevContext: contextApi.getDevContext,
    getModsFromError: contextApi.getModsFromError,
    encode: encoder.encode,
    decode: encoder.decode,
    persist: playFabManager.persist,
  };
})();
