export function resolveLocale(
	/**
	 * e.g. navigator.languages
	 */
	userLocales: string[],
	/**
	 * the locales your app supports (e.g. ["en", "nl-NL", "fr-FR"])
	 */
	supportedLocales: string[],
	/**
	 * pass through to Intl matching semantics (used only for runtime support check)
	 */
	localeMatcher: "best fit" | "lookup" = "best fit",
) {
	if (!Array.isArray(userLocales) || userLocales.length === 0) {
		throw new Error("userLocales must be a non-empty array");
	}
	if (!Array.isArray(supportedLocales) || supportedLocales.length === 0) {
		throw new Error("supportedLocales must be a non-empty array");
	}

	// 1) Canonicalize app-supported locales and
	//    keep only those the runtime actually supports.
	const supportedCanon = Intl.getCanonicalLocales(supportedLocales);
	const runtimeSupported = new Set(
		Intl.NumberFormat.supportedLocalesOf(supportedCanon, { localeMatcher }),
	);
	if (runtimeSupported.size === 0) {
		// Fallback: if none of your locales are supported by this runtime,
		// just use your first canonical supported (still canonicalized).
		return supportedCanon[0];
	}

	// 2) Try each user-preferred locale (in order), generating a full fallback chain.
	for (const raw of userLocales) {
		// Strip unicode ('-u-…') and transform ('-t-…') extensions; they
		// aren’t relevant for matching against your whitelist.
		const base = stripExtensions(raw);
		// Canonicalize (handles case/aliases like "zh-Hant-tw" → "zh-Hant-TW")
		const [canonical] = Intl.getCanonicalLocales(base);

		// Generate fallback chain by progressively removing the last subtag.
		// Example: "zh-Hant-HK" → ["zh-Hant-HK", "zh-Hant", "zh"]
		const chain = fallbackChain(canonical);

		// Find the first item in the chain that your app supports and the runtime supports.
		for (const candidate of chain) {
			if (runtimeSupported.has(candidate)) {
				return candidate;
			}
		}
	}

	// 3) Nothing matched any preference; choose your first runtime-supported locale.
	// (Keeps behavior deterministic.)
	return runtimeSupported.values().next().value;
}

/** Remove Unicode (‘-u-…’) and transform (‘-t-…’) extensions from a BCP 47 tag */
function stripExtensions(tag: string) {
	// Split on -u- or -t- (extensions must be last); keep the part before the first extension.
	return tag.split(/-(?:u|t)-/i)[0];
}

/** Build multi-level fallback chain from most specific → least specific */
function fallbackChain(canonicalTag: string) {
	// Split subtags, e.g. ["zh", "Hant", "HK"]
	const parts = canonicalTag.split("-");
	const chain = [];
	for (let i = parts.length; i >= 1; i--) {
		chain.push(parts.slice(0, i).join("-"));
	}
	return chain;
}
