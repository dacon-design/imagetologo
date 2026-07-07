const MAX_FILE_SIZE = 10 * 1024 * 1024;
const SUPPORTED_TYPES = new Set(["image/png", "image/jpeg"]);
const SUPPORTED_EXTENSIONS = new Set(["png", "jpg", "jpeg"]);

const dropZone = document.querySelector("#uploader");
const imageInput = document.querySelector("#image-input");
const message = document.querySelector("#form-message");
const previewPanel = document.querySelector("#preview-panel");
const generationState = document.querySelector("#generation-state");
const logoResults = document.querySelector("#logo-results");
const regenerateButton = document.querySelector("#regenerate-button");

let currentFile = null;
let activePreviewUrl = null;
let dragDepth = 0;

const resultDescriptions = [
  {
    title: "核心符号",
    className: "symbol",
    description: "提取图片主体轮廓，适合 App 图标、社媒头像与品牌符号。",
  },
  {
    title: "徽章标识",
    className: "badge",
    description: "强化边框与品牌名结构，适合门店、包装与会员体系。",
  },
  {
    title: "现代字标",
    className: "wordmark",
    description: "把图片气质转成字体节奏，适合官网、名片与电商店铺。",
  },
];

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[char];
  });
}

function getFileExtension(file) {
  return file.name.split(".").pop().toLowerCase();
}

function validateFile(file) {
  if (!file) {
    return "请选择一张图片。";
  }

  const hasSupportedType = SUPPORTED_TYPES.has(file.type);
  const hasSupportedExtension = SUPPORTED_EXTENSIONS.has(getFileExtension(file));

  if (!hasSupportedType && !hasSupportedExtension) {
    return "请上传 PNG、JPG 或 JPEG 格式的图片。";
  }

  if (file.size > MAX_FILE_SIZE) {
    return "图片大小需控制在 10MB 以内。";
  }

  return "";
}

function setMessage(text, type = "") {
  message.textContent = text;
  message.className = `form-message ${type}`.trim();
}

function setGenerationState(text, isLoading = false) {
  generationState.classList.toggle("is-loading", isLoading);
  generationState.querySelector("p").textContent = text;
}

function getDisplayName(fileName) {
  return fileName.replace(/\.[^/.]+$/, "").replace(/[-_]+/g, " ").trim() || "Brand";
}

function getInitials(fileName) {
  const displayName = getDisplayName(fileName);
  const latinParts = displayName.match(/[A-Za-z0-9]+/g);

  if (latinParts?.length) {
    return latinParts
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  return displayName.slice(0, 2).toUpperCase() || "LM";
}

function getSeededVariant(fileName) {
  const total = [...fileName].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return total % 3;
}

function clearPreviewUrl() {
  if (activePreviewUrl) {
    URL.revokeObjectURL(activePreviewUrl);
    activePreviewUrl = null;
  }
}

function resetPreview() {
  clearPreviewUrl();
  previewPanel.innerHTML = `
    <div class="empty-preview">
      <span class="empty-symbol" aria-hidden="true"></span>
      <p>上传后将在这里预览原图与生成方向</p>
    </div>
  `;
}

function renderPreview(file) {
  clearPreviewUrl();
  activePreviewUrl = URL.createObjectURL(file);
  const fileName = escapeHtml(file.name);
  const extension = escapeHtml(getFileExtension(file).toUpperCase());
  const size = escapeHtml(formatBytes(file.size));

  previewPanel.innerHTML = `
    <div class="preview-content">
      <img src="${activePreviewUrl}" alt="上传图片预览" />
      <dl class="file-meta">
        <div>
          <dt>文件名</dt>
          <dd>${fileName}</dd>
        </div>
        <div>
          <dt>格式与大小</dt>
          <dd>${extension} · ${size}</dd>
        </div>
      </dl>
    </div>
  `;
}

function renderResults(results) {
  logoResults.innerHTML = results
    .map(
      (result) => `
        <article class="logo-result">
          <div class="logo-preview ${result.className}" aria-label="${result.title}">
            <span>${escapeHtml(result.mark)}</span>
          </div>
          <h3>${escapeHtml(result.title)}</h3>
          <p>${escapeHtml(result.description)}</p>
          <div class="result-actions">
            <button class="mini-button" type="button" data-export="${escapeHtml(result.title)}">下载 PNG</button>
          </div>
        </article>
      `,
    )
    .join("");
}

async function generateLogoFromImage(file, options = {}) {
  const initials = getInitials(file.name);
  const displayName = getDisplayName(file.name);
  const variant = options.variant ?? getSeededVariant(file.name);

  await new Promise((resolve) => {
    window.setTimeout(resolve, 850);
  });

  return resultDescriptions.map((item, index) => {
    const isWordmark = item.className === "wordmark";
    const mark = isWordmark ? displayName.slice(0, 10).toUpperCase() : `${initials}${variant + index}`;

    return {
      ...item,
      mark,
    };
  });
}

async function processFile(file, options = {}) {
  const error = validateFile(file);

  if (error) {
    currentFile = null;
    regenerateButton.disabled = true;
    logoResults.innerHTML = "";
    resetPreview();
    setGenerationState("等待有效图片上传", false);
    setMessage(error, "error");
    return;
  }

  currentFile = file;
  renderPreview(file);
  regenerateButton.disabled = true;
  logoResults.innerHTML = "";
  setMessage("图片已读取，正在生成 Logo 方向。", "success");
  setGenerationState("正在提取轮廓、色彩与品牌线索", true);

  try {
    const results = await generateLogoFromImage(file, options);
    renderResults(results);
    setGenerationState("已生成 3 个 Logo 方向", false);
    setMessage("生成完成。你可以换一组方向，或继续上传新图片。", "success");
    regenerateButton.disabled = false;
  } catch (error) {
    setGenerationState("生成失败", false);
    setMessage("生成过程中出现问题，请重新上传图片。", "error");
  }
}

function preventDefaults(event) {
  event.preventDefault();
  event.stopPropagation();
}

dropZone.addEventListener("dragenter", (event) => {
  preventDefaults(event);
  dragDepth += 1;
  dropZone.classList.add("drag-over");
});

dropZone.addEventListener("dragover", (event) => {
  preventDefaults(event);
});

dropZone.addEventListener("dragleave", (event) => {
  preventDefaults(event);
  dragDepth -= 1;

  if (dragDepth <= 0) {
    dragDepth = 0;
    dropZone.classList.remove("drag-over");
  }
});

dropZone.addEventListener("drop", (event) => {
  preventDefaults(event);
  dragDepth = 0;
  dropZone.classList.remove("drag-over");
  const [file] = event.dataTransfer.files;
  processFile(file);
});

dropZone.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    imageInput.click();
  }
});

imageInput.addEventListener("change", (event) => {
  const [file] = event.target.files;
  processFile(file);
});

regenerateButton.addEventListener("click", () => {
  if (!currentFile) {
    return;
  }

  const variant = Math.floor(Math.random() * 3);
  processFile(currentFile, { variant });
});

logoResults.addEventListener("click", (event) => {
  const button = event.target.closest("[data-export]");

  if (!button) {
    return;
  }

  setMessage(`${button.dataset.export} 当前为演示结果，接入真实接口后可导出文件。`, "success");
});

window.addEventListener("beforeunload", clearPreviewUrl);
