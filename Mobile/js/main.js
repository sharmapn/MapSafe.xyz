const root = "images/";

const galleries = {
  "getting-started": [
    ["mobile/ms2026-north-whangarei-20260909-01-workflow-chooser.png", "Workflow chooser: Safeguard and Access."],
    ["mobile/ms2026-north-whangarei-20260909-02-security-account-community.png", "Select the authenticated account and community."],
    ["mobile/ms2026-north-whangarei-20260909-03-security-identity-folder-network.png", "Identity, save folder and network settings."],
    ["mobile/ms2026-north-whangarei-20260909-08-safeguard-features.png", "Safeguard feature entry points."]
  ],
  anonymise: [
    ["mobile/ms2026-north-whangarei-20260909-09-anonymise-options.png", "Choose halo masking or hexagonal binning."],
    ["mobile/ms2026-north-whangarei-20260909-10-halo-masking-configuration.png", "Set the halo displacement range."],
    ["mobile/ms2026-north-whangarei-20260909-11-halo-masking-applied-expanded.png", "Review the masked result and privacy score."],
    ["mobile/ms2026-north-whangarei-20260909-12-halo-masking-applied-collapsed.png", "Collapse the result card to see the map."],
    ["mobile/ms2026-north-whangarei-20260909-13-halo-masking-saved.png", "Saved anonymised layer."],
    ["mobile/ms2026-north-whangarei-20260909-28-original-sample-dataset-unobstructed.png", "Original North Whangārei points."],
    ["mobile/ms2026-north-whangarei-20260909-29-original-and-halo-masked-unobstructed.png", "Original and halo-masked layers together."]
  ],
  hexbin: [
    ["mobile/ms2026-north-whangarei-hexbin-20261006-01-configuration-source-only.png", "Resolution selected for the original points."],
    ["mobile/ms2026-north-whangarei-hexbin-20261006-02-applied-source-and-cells.png", "Original points and occupied hexagonal cells."],
    ["mobile/ms2026-north-whangarei-hexbin-20261006-03-collapsed-cells-only.png", "Collapsed view showing the anonymised cells only."]
  ],
  encrypt: [
    ["mobile/ms2026-north-whangarei-20260909-18-identity-creation.png", "Create the local encryption identity."],
    ["mobile/ms2026-north-whangarei-20260909-19-identity-created.png", "Identity created and fingerprint displayed."],
    ["mobile/ms2026-north-whangarei-20260909-20-encrypt-protect.png", "Select the dataset for protection."],
    ["mobile/ms2026-north-whangarei-20260909-21-recipient-selection.png", "Select OpenPGP recipients."],
    ["mobile/ms2026-north-whangarei-20260909-22-encryption-success.png", "Protected package saved."],
    ["mobile/ms2026-north-whangarei-20260909-30-community-upload-selection.png", "Choose permitted resources for community upload."]
  ],
  notarise: [
    ["mobile/ms2026-north-whangarei-20260909-23-notarisation-hash-network.png", "Review the package digest and active network."],
    ["mobile/ms2026-north-whangarei-20260909-04-blockchain-network-profile.png", "Configure a blockchain profile."],
    ["mobile/ms2026-north-whangarei-20260909-05-blockchain-contract-validation.png", "Run read-only contract validation."]
  ],
  verify: [
    ["mobile/ms2026-north-whangarei-20260909-06-access-community-local.png", "Open a community package or local encrypted file."],
    ["mobile/ms2026-north-whangarei-20260909-07-verification-file-and-blockchain.png", "Compare local, registry and blockchain evidence."],
    ["community/ms2026-premium-community-20261006-07-bma-community-package-selection.png", "BMA representative selects an authorised community package."],
    ["community/ms2026-premium-community-20261006-08-bma-package-verification.png", "Package digest verification succeeds."]
  ],
  decrypt: [
    ["mobile/ms2026-north-whangarei-20260909-24-decrypt-and-access.png", "Decrypt and Access screen."],
    ["mobile/ms2026-north-whangarei-20260909-25-import-decrypted-layer.png", "Import the verified recovered layer."],
    ["mobile/ms2026-north-whangarei-20260909-26-decryption-success.png", "Decryption and signature checks succeed."],
    ["mobile/ms2026-north-whangarei-20260909-27-decrypted-dataset-map.png", "Only the recovered dataset is displayed."],
    ["community/ms2026-premium-community-20261006-09-bma-private-key-decryption.png", "BMA representative unlocks the local private key."],
    ["community/ms2026-premium-community-20261006-10-bma-decryption-success.png", "BMA decryption succeeds."],
    ["community/ms2026-premium-community-20261006-11-bma-decrypted-original-map.png", "BMA accesses the original map layer."],
    ["community/ms2026-premium-community-20261006-05-amber-anonymised-community-access.png", "Amber sees her authorised anonymised release."]
  ],
  community: [
    ["mobile/ms2026-north-whangarei-20260909-30-community-upload-selection.png", "Select an artefact for upload."],
    ["mobile/ms2026-north-whangarei-20260909-31-community-packages.png", "Browse Community Packages."],
    ["community/ms2026-premium-community-20261006-05-amber-anonymised-community-access.png", "Anonymised access for Amber."],
    ["community/ms2026-premium-community-20261006-07-bma-community-package-selection.png", "Original-package access for the BMA representative."]
  ],
  web: [
    ["web/nextgis-community-a-resource-groups.png", "MapSafe Community A resource groups."],
    ["web/nextgis-community-public-keys.png", "Public-key resource group."],
    ["web/nextgis-community-public-key-records.png", "Published public-key records."],
    ["web/nextgis-community-anonymised-datasets.png", "Anonymised dataset resources."],
    ["web/nextgis-community-encrypted-packages.png", "Encrypted package resources."],
    ["web/nextgis-community-encrypted-package-records.png", "Encrypted package records and metadata."]
  ],
  "web-manuscript": [
    ["web/nextgis-community-public-keys.png", "NextGIS Web Public Keys resource group."],
    ["web/nextgis-community-encrypted-packages.png", "NextGIS Web Encrypted Packages resource group."]
  ],
  security: [
    ["mobile/ms2026-north-whangarei-20260909-02-security-account-community.png", "Account and community selection."],
    ["mobile/ms2026-north-whangarei-20260909-03-security-identity-folder-network.png", "Identity, folder and network settings."],
    ["community/ms2026-premium-community-20261006-05-amber-anonymised-community-access.png", "Example community access state."]
  ]
};

const allMobile = [
  "01-workflow-chooser","02-security-account-community","03-security-identity-folder-network","04-blockchain-network-profile","05-blockchain-contract-validation","06-access-community-local","07-verification-file-and-blockchain","08-safeguard-features","09-anonymise-options","10-halo-masking-configuration","11-halo-masking-applied-expanded","12-halo-masking-applied-collapsed","13-halo-masking-saved","18-identity-creation","19-identity-created","20-encrypt-protect","21-recipient-selection","22-encryption-success","23-notarisation-hash-network","24-decrypt-and-access","25-import-decrypted-layer","26-decryption-success","27-decrypted-dataset-map","28-original-sample-dataset-unobstructed","29-original-and-halo-masked-unobstructed","30-community-upload-selection","31-community-packages"
].map((key) => [`mobile/ms2026-north-whangarei-20260909-${key}.png`, key.replaceAll("-", " ")]);
const archiveCandidates = [...allMobile, ...Object.values(galleries).flat()];
const seenArchive = new Set();
const archive = archiveCandidates.filter(([src]) => {
  if (seenArchive.has(src)) return false;
  seenArchive.add(src);
  return true;
});
galleries.archive = archive;

function card([src, caption]) {
  const figure = document.createElement("figure");
  const image = document.createElement("img");
  image.src = root + src;
  image.alt = caption;
  image.loading = "lazy";
  const figcaption = document.createElement("figcaption");
  figcaption.textContent = caption;
  figure.append(image, figcaption);
  figure.addEventListener("click", () => openLightbox(image.src, caption));
  return figure;
}
document.querySelectorAll("[data-gallery]").forEach((node) => {
  (galleries[node.dataset.gallery] || []).forEach((item) => node.append(card(item)));
});

const sidebar = document.querySelector("#sidebar");
const menuToggle = document.querySelector(".menu-toggle");
menuToggle.addEventListener("click", () => { const open = sidebar.classList.toggle("open"); menuToggle.setAttribute("aria-expanded", String(open)); });
document.querySelectorAll(".nav-link").forEach((link) => link.addEventListener("click", () => sidebar.classList.remove("open")));

const lightbox = document.querySelector(".lightbox");
const lightboxImage = lightbox.querySelector("img");
function openLightbox(src, alt) { lightboxImage.src = src; lightboxImage.alt = alt; lightbox.hidden = false; document.body.classList.add("no-scroll"); }
function closeLightbox() { lightbox.hidden = true; lightboxImage.src = ""; document.body.classList.remove("no-scroll"); }
lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => { if (event.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeLightbox(); });

const navLinks = [...document.querySelectorAll(".nav-link")];
const sections = navLinks.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`)); }), {rootMargin:"-25% 0px -65% 0px"});
sections.forEach((section) => observer.observe(section));

const modeImageButton = document.querySelector("[data-mode-image-button]");
if (modeImageButton) {
  const modeImage = document.querySelector("[data-mode-image]");
  const modeLabel = document.querySelector("[data-mode-label]");
  const modeHint = document.querySelector(".mode-switch-hint");
  let accessMode = false;
  modeImageButton.addEventListener("click", () => {
    accessMode = !accessMode;
    modeImage.src = root + (accessMode ? "mobile/ms2026-north-whangarei-20260909-06-access-community-local.png" : "mobile/ms2026-north-whangarei-20260909-01-workflow-chooser.png");
    modeImage.alt = accessMode ? "MapSafe Mobile Access workflow chooser" : "MapSafe Mobile Safeguard workflow chooser";
    modeLabel.textContent = accessMode ? "Access view" : "Safeguard view";
    modeHint.textContent = accessMode ? "Click the image to view Safeguard" : "Click the image to view Access";
    modeImageButton.setAttribute("aria-label", accessMode ? "Show Safeguard workflow image" : "Show Access workflow image");
  });
}
