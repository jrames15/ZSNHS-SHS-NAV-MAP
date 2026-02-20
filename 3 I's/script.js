(function () {
  "use strict";

  const HOME_BUILDINGS = {
    A: {
      code: "A",
      name: "Building A",
      subtitle: "Academic rooms and lecture spaces",
      description: "Main academic hub with classrooms across four floors.",
      href: "BUILDING A/index.html",
      tags: ["Classrooms", "4 Floors", "Academic"],
      accessible: true,
      landmarks: [
        { name: "Bagley", type: "Classroom", floor: "4", accessible: true, aliases: ["Room Bagley"] },
        { name: "Rousseau", type: "Classroom", floor: "4", accessible: true, aliases: [] },
        { name: "Dewey", type: "Classroom", floor: "4", accessible: true, aliases: [] },
        { name: "John Locke", type: "Classroom", floor: "4", accessible: true, aliases: ["Locke"] },
        { name: "Aristotle", type: "Classroom", floor: "3", accessible: true, aliases: [] },
        { name: "Socrates", type: "Classroom", floor: "3", accessible: true, aliases: [] },
        { name: "Confucious", type: "Classroom", floor: "2", accessible: false, aliases: ["Confucius"] },
        { name: "Sun Tzu", type: "Classroom", floor: "2", accessible: false, aliases: ["Suntzu"] },
        { name: "Marx", type: "Classroom", floor: "1", accessible: true, aliases: [] },
        { name: "Bill Gates", type: "Classroom", floor: "1", accessible: true, aliases: [] }
      ]
    },
    B: {
      code: "B",
      name: "Building B",
      subtitle: "Administration and student services",
      description: "Central administration offices including registrar, finance, and guidance.",
      href: "BUILDING B/index.html",
      tags: ["Office", "2 Floors", "Admin"],
      accessible: true,
      landmarks: [
        { name: "Registrar's", type: "Office", floor: "2", accessible: true, aliases: ["Registrar", "Enrollment"] },
        { name: "Finance Office", type: "Office", floor: "2", accessible: true, aliases: ["Cashier"] },
        { name: "ICT Office", type: "Office", floor: "2", accessible: true, aliases: ["IT Office"] },
        { name: "Guidance Office", type: "Office", floor: "2", accessible: true, aliases: ["Guidance"] },
        { name: "Principal Office", type: "Office", floor: "2", accessible: true, aliases: ["Principal"] },
        { name: "Asst. Principal Office", type: "Office", floor: "1", accessible: true, aliases: ["Assistant Principal"] },
        { name: "Core Heads Office", type: "Office", floor: "1", accessible: true, aliases: ["Core Heads"] }
      ]
    },
    C: {
      code: "C",
      name: "Building C",
      subtitle: "Laboratories, clinic, and library",
      description: "Contains science labs, ICT rooms, school clinic, and library services.",
      href: "BUILDING C/index.html",
      tags: ["Labs", "Library", "Facilities"],
      accessible: true,
      landmarks: [
        { name: "Chemistry Lab", type: "Lab", floor: "2", accessible: false, aliases: ["Chem Lab"] },
        { name: "Biology Lab", type: "Lab", floor: "2", accessible: false, aliases: ["Bio Lab"] },
        { name: "School Clinic", type: "Facility", floor: "1", accessible: true, aliases: ["Clinic"] },
        { name: "Pascal (Library)", type: "Facility", floor: "1", accessible: true, aliases: ["Library"] },
        { name: "SSLG Office", type: "Office", floor: "1", accessible: true, aliases: ["Student Council"] },
        { name: "Newton", type: "Classroom", floor: "3", accessible: false, aliases: [] },
        { name: "Fibonacci", type: "Classroom", floor: "3", accessible: false, aliases: [] },
        { name: "Ryzen", type: "Classroom", floor: "3", accessible: false, aliases: [] }
      ]
    },
    D: {
      code: "D",
      name: "Building D",
      subtitle: "Junior High and additional classrooms",
      description: "Supports Junior High sections and overflow classroom spaces.",
      href: "BUILDING D/index.html",
      tags: ["Classrooms", "Junior High", "Mixed Floors"],
      accessible: false,
      landmarks: [
        { name: "Waterlily", type: "Classroom", floor: "3", accessible: false, aliases: [] },
        { name: "Matibay", type: "Classroom", floor: "3", accessible: false, aliases: [] },
        { name: "Malakas", type: "Classroom", floor: "3", accessible: false, aliases: [] },
        { name: "rm.d.405", type: "Classroom", floor: "4", accessible: false, aliases: ["Room D405"] },
        { name: "rm.d.406 (vacant)", type: "Facility", floor: "4", accessible: false, aliases: ["Vacant"] },
        { name: "Junior High (1st)", type: "Classroom", floor: "1", accessible: true, aliases: ["JHS 1st"] },
        { name: "Junior High (2nd)", type: "Classroom", floor: "2", accessible: true, aliases: ["JHS 2nd"] }
      ]
    }
  };

  const LANDMARKS = Object.values(HOME_BUILDINGS).flatMap((building) =>
    building.landmarks.map((landmark) => ({ ...landmark, building: building.code, buildingName: building.name }))
  );

  document.addEventListener("DOMContentLoaded", () => {
    initHomeApp();
    initGalleryLightbox();
    renderBuildingDirectoryPage();
  });

  function initHomeApp() {
    const shell = document.querySelector(".app-shell");
    if (!shell) {
      return;
    }

    const state = {
      panel: "map",
      mapFloor: "all",
      accessibleOnly: false,
      selectedBuilding: "A",
      selectedLandmark: "",
      searchTerm: "",
      saved: loadSaved()
    };

    const panels = Array.from(document.querySelectorAll(".panel"));
    const desktopNav = Array.from(document.querySelectorAll(".nav-link"));
    const mobileNav = Array.from(document.querySelectorAll(".mobile-link"));
    const mapNodes = Array.from(document.querySelectorAll(".map-node"));
    const floorChips = Array.from(document.querySelectorAll(".chip[data-floor]"));
    const viewOnMapButtons = Array.from(document.querySelectorAll(".view-on-map"));

    const searchForm = document.getElementById("search-form");
    const searchInput = document.getElementById("global-search");
    const clearSearchButton = document.getElementById("clear-search");

    const filterType = document.getElementById("filter-type");
    const filterBuilding = document.getElementById("filter-building");
    const filterFloor = document.getElementById("filter-floor");
    const filterAccessible = document.getElementById("filter-accessible");
    const accessibleToggle = document.getElementById("toggle-accessible");

    const resultsList = document.getElementById("search-results");
    const searchEmpty = document.getElementById("search-empty");

    const selectionTitle = document.getElementById("selection-title");
    const selectionDescription = document.getElementById("selection-description");
    const selectionTags = document.getElementById("selection-tags");
    const selectionList = document.getElementById("selection-list");
    const openBuilding = document.getElementById("open-building");
    const savePlaceButton = document.getElementById("save-place");

    const savedList = document.getElementById("saved-list");
    const savedEmpty = document.getElementById("saved-empty");

    const locateButton = document.getElementById("locate-btn");
    const notificationsButton = document.getElementById("notifications-btn");

    desktopNav.forEach((button) => {
      button.addEventListener("click", () => setPanel(button.dataset.panel));
    });

    mobileNav.forEach((button) => {
      button.addEventListener("click", () => setPanel(button.dataset.panel));
    });

    mapNodes.forEach((node) => {
      node.addEventListener("click", () => {
        selectBuilding(node.dataset.building, { source: "map" });
      });
    });

    viewOnMapButtons.forEach((button) => {
      button.addEventListener("click", () => {
        setPanel("map");
        selectBuilding(button.dataset.building, { source: "buildings" });
      });
    });

    floorChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        state.mapFloor = chip.dataset.floor || "all";
        floorChips.forEach((item) => item.classList.toggle("is-active", item === chip));
        refreshMapNodes();
        refreshSelection();
      });
    });

    accessibleToggle.addEventListener("click", () => {
      state.accessibleOnly = !state.accessibleOnly;
      syncAccessibilityControls();
      refreshMapNodes();
      renderSearchResults();
      refreshSelection();
      if (state.accessibleOnly) {
        showToast("Accessible route filter enabled.");
      }
    });

    filterAccessible.addEventListener("change", () => {
      state.accessibleOnly = filterAccessible.checked;
      syncAccessibilityControls();
      refreshMapNodes();
      renderSearchResults();
      refreshSelection();
    });

    [filterType, filterBuilding, filterFloor].forEach((element) => {
      element.addEventListener("change", renderSearchResults);
    });

    searchForm.addEventListener("submit", (event) => {
      event.preventDefault();
      setPanel("search");
      renderSearchResults();
    });

    searchInput.addEventListener("input", () => {
      state.searchTerm = searchInput.value.trim();
      clearSearchButton.hidden = state.searchTerm.length === 0;
      renderSearchResults();
    });

    clearSearchButton.addEventListener("click", () => {
      searchInput.value = "";
      state.searchTerm = "";
      clearSearchButton.hidden = true;
      renderSearchResults();
      searchInput.focus();
    });

    resultsList.addEventListener("click", (event) => {
      const openButton = event.target.closest(".result-open");
      if (openButton) {
        const landmarkName = openButton.dataset.landmark || "";
        const buildingCode = openButton.dataset.building || "";
        setPanel("map");
        selectBuilding(buildingCode, { source: "search", landmarkName });
        return;
      }

      const saveButton = event.target.closest(".result-save");
      if (saveButton) {
        const match = LANDMARKS.find((item) => item.name === saveButton.dataset.landmark && item.building === saveButton.dataset.building);
        if (!match) {
          return;
        }

        const item = buildSavedLandmark(match);
        toggleSavedItem(item);
        renderSearchResults();
      }
    });

    savePlaceButton.addEventListener("click", () => {
      if (!state.selectedBuilding || !HOME_BUILDINGS[state.selectedBuilding]) {
        return;
      }

      const item = buildSavedBuilding(state.selectedBuilding);
      toggleSavedItem(item);
      refreshSelection();
    });

    savedList.addEventListener("click", (event) => {
      const openButton = event.target.closest("[data-open-id]");
      if (openButton) {
        const found = state.saved.find((item) => item.id === openButton.dataset.openId);
        if (!found) {
          return;
        }

        setPanel("map");
        if (found.type === "building") {
          selectBuilding(found.building, { source: "saved" });
        } else {
          selectBuilding(found.building, { source: "saved", landmarkName: found.label });
        }
        return;
      }

      const removeButton = event.target.closest("[data-remove-id]");
      if (!removeButton) {
        return;
      }

      state.saved = state.saved.filter((item) => item.id !== removeButton.dataset.removeId);
      persistSaved(state.saved);
      renderSavedList();
      refreshSelection();
      renderSearchResults();
    });

    locateButton.addEventListener("click", () => {
      showToast("Location marker placed near the main entrance.");
    });

    notificationsButton.addEventListener("click", () => {
      showToast("No active campus alerts.");
    });

    function setPanel(panel) {
      state.panel = panel;

      panels.forEach((section) => {
        const isActive = section.dataset.panel === panel;
        section.classList.toggle("is-active", isActive);
        section.setAttribute("aria-hidden", String(!isActive));
      });

      desktopNav.forEach((button) => {
        const isActive = button.dataset.panel === panel;
        button.classList.toggle("is-active", isActive);
        if (isActive) {
          button.setAttribute("aria-current", "page");
        } else {
          button.removeAttribute("aria-current");
        }
      });

      mobileNav.forEach((button) => {
        button.classList.toggle("is-active", button.dataset.panel === panel);
      });

      if (panel === "search") {
        renderSearchResults();
      }
      if (panel === "saved") {
        renderSavedList();
      }
    }

    function syncAccessibilityControls() {
      filterAccessible.checked = state.accessibleOnly;
      accessibleToggle.setAttribute("aria-pressed", String(state.accessibleOnly));
      accessibleToggle.classList.toggle("is-active", state.accessibleOnly);
    }

    function selectBuilding(code, options = {}) {
      const building = HOME_BUILDINGS[code];
      if (!building) {
        return;
      }

      state.selectedBuilding = code;
      state.selectedLandmark = options.landmarkName || "";

      mapNodes.forEach((node) => {
        node.classList.toggle("is-selected", node.dataset.building === code);
      });

      refreshSelection();

      if (options.source === "search") {
        showToast("Switched to map view for this result.");
      }
    }

    function refreshSelection() {
      const building = HOME_BUILDINGS[state.selectedBuilding];
      if (!building) {
        return;
      }

      selectionTitle.textContent = building.name;
      selectionDescription.textContent = `${building.description} Open ${building.landmarks.length} mapped locations.`;
      openBuilding.href = building.href;

      selectionTags.innerHTML = "";
      building.tags.forEach((tag) => {
        const tagEl = document.createElement("span");
        tagEl.className = "detail-tag";
        tagEl.textContent = tag;
        selectionTags.appendChild(tagEl);
      });

      if (state.mapFloor !== "all") {
        const floorTag = document.createElement("span");
        floorTag.className = "detail-tag";
        floorTag.textContent = `${formatFloorLabel(state.mapFloor)} floor view`;
        selectionTags.appendChild(floorTag);
      }

      if (state.accessibleOnly) {
        const accessTag = document.createElement("span");
        accessTag.className = "detail-tag";
        accessTag.textContent = "Accessible only";
        selectionTags.appendChild(accessTag);
      }

      const highlights = getVisibleLandmarksByBuilding(building.code);
      const visibleItems = state.selectedLandmark
        ? [
            ...highlights.filter((item) => item.name === state.selectedLandmark),
            ...highlights.filter((item) => item.name !== state.selectedLandmark)
          ]
        : highlights;

      selectionList.innerHTML = "";
      if (visibleItems.length === 0) {
        const empty = document.createElement("li");
        empty.textContent = "No rooms match the current map filters.";
        selectionList.appendChild(empty);
      } else {
        visibleItems.slice(0, 5).forEach((item) => {
          const li = document.createElement("li");
          li.textContent = `${item.name} - Floor ${item.floor} (${item.type})`;
          selectionList.appendChild(li);
        });
      }

      const isSaved = state.saved.some((item) => item.id === `building:${building.code}`);
      savePlaceButton.innerHTML = isSaved
        ? '<span class="material-symbols-rounded" aria-hidden="true">bookmark_remove</span>Remove from saved'
        : '<span class="material-symbols-rounded" aria-hidden="true">bookmark_add</span>Save place';
    }

    function getVisibleLandmarksByBuilding(code) {
      return HOME_BUILDINGS[code].landmarks.filter((landmark) => {
        if (state.mapFloor !== "all" && landmark.floor !== state.mapFloor) {
          return false;
        }
        if (state.accessibleOnly && !landmark.accessible) {
          return false;
        }
        return true;
      });
    }

    function refreshMapNodes() {
      mapNodes.forEach((node) => {
        const buildingCode = node.dataset.building;
        const visible = getVisibleLandmarksByBuilding(buildingCode);
        const isMuted = visible.length === 0;
        node.classList.toggle("is-muted", isMuted);
        node.disabled = isMuted;
      });

      if (state.selectedBuilding && getVisibleLandmarksByBuilding(state.selectedBuilding).length === 0) {
        state.selectedLandmark = "";
      }
    }

    function renderSearchResults() {
      const typeFilter = filterType.value;
      const buildingFilter = filterBuilding.value;
      const floorFilter = filterFloor.value;
      const query = normalizeText(state.searchTerm || searchInput.value);

      const matches = LANDMARKS.filter((item) => {
        if (typeFilter !== "all" && item.type !== typeFilter) {
          return false;
        }
        if (buildingFilter !== "all" && item.building !== buildingFilter) {
          return false;
        }
        if (floorFilter !== "all" && item.floor !== floorFilter) {
          return false;
        }
        if (state.accessibleOnly && !item.accessible) {
          return false;
        }
        if (!query) {
          return true;
        }

        const source = normalizeText([item.name, item.type, item.buildingName, ...(item.aliases || [])].join(" "));
        return source.includes(query);
      }).sort((left, right) => left.name.localeCompare(right.name));

      resultsList.innerHTML = "";

      if (matches.length === 0) {
        searchEmpty.hidden = false;
        return;
      }

      searchEmpty.hidden = true;
      matches.slice(0, 40).forEach((item) => {
        const li = document.createElement("li");
        li.className = "result-item";

        const saved = state.saved.some((savedItem) => savedItem.id === `landmark:${item.building}:${item.name}`);
        li.innerHTML = `
          <div class="result-main">
            <strong>${escapeHtml(item.name)}</strong>
            <span class="result-meta">${escapeHtml(item.buildingName)} - Floor ${escapeHtml(item.floor)} - ${escapeHtml(item.type)}${item.accessible ? " - Accessible" : ""}</span>
          </div>
          <div class="result-actions">
            <button class="mini-btn result-open" type="button" data-building="${item.building}" data-landmark="${escapeAttribute(item.name)}">Open map</button>
            <button class="mini-btn result-save" type="button" data-building="${item.building}" data-landmark="${escapeAttribute(item.name)}">${saved ? "Saved" : "Save"}</button>
          </div>
        `;

        resultsList.appendChild(li);
      });
    }

    function buildSavedBuilding(code) {
      const building = HOME_BUILDINGS[code];
      return {
        id: `building:${code}`,
        type: "building",
        label: building.name,
        meta: building.subtitle,
        building: code
      };
    }

    function buildSavedLandmark(item) {
      return {
        id: `landmark:${item.building}:${item.name}`,
        type: "landmark",
        label: item.name,
        meta: `${item.buildingName} - Floor ${item.floor}`,
        building: item.building
      };
    }

    function toggleSavedItem(item) {
      const exists = state.saved.some((entry) => entry.id === item.id);
      if (exists) {
        state.saved = state.saved.filter((entry) => entry.id !== item.id);
        showToast("Removed from saved places.");
      } else {
        state.saved = [item, ...state.saved].slice(0, 30);
        showToast("Saved for quick access.");
      }

      persistSaved(state.saved);
      renderSavedList();
      refreshSelection();
    }

    function renderSavedList() {
      savedList.innerHTML = "";

      if (state.saved.length === 0) {
        savedEmpty.hidden = false;
        return;
      }

      savedEmpty.hidden = true;
      state.saved.forEach((item) => {
        const li = document.createElement("li");
        li.className = "saved-item";
        li.innerHTML = `
          <div class="saved-main">
            <strong>${escapeHtml(item.label)}</strong>
            <span class="saved-meta">${escapeHtml(item.meta)}</span>
          </div>
          <div class="saved-actions">
            <button class="mini-btn" type="button" data-open-id="${escapeAttribute(item.id)}">Open</button>
            <button class="mini-btn" type="button" data-remove-id="${escapeAttribute(item.id)}">Remove</button>
          </div>
        `;
        savedList.appendChild(li);
      });
    }

    syncAccessibilityControls();
    clearSearchButton.hidden = true;
    refreshMapNodes();
    selectBuilding(state.selectedBuilding);
    renderSearchResults();
    renderSavedList();
  }

  function initGalleryLightbox() {
    const gallery = document.getElementById("gallery");
    if (!gallery) {
      return;
    }

    gallery.addEventListener("click", (event) => {
      const image = event.target.closest("img");
      if (!image || !image.src) {
        return;
      }

      openLightbox(image.src, image.alt || "Gallery image");
    });
  }

  function openLightbox(src, alt) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "rgba(0, 0, 0, 0.72)";
    overlay.style.display = "grid";
    overlay.style.placeItems = "center";
    overlay.style.zIndex = "9999";

    const image = document.createElement("img");
    image.src = src;
    image.alt = alt;
    image.style.maxWidth = "92%";
    image.style.maxHeight = "92%";
    image.style.borderRadius = "10px";
    image.style.boxShadow = "0 12px 30px rgba(0,0,0,0.35)";

    overlay.appendChild(image);
    overlay.addEventListener("click", () => overlay.remove());
    document.body.appendChild(overlay);
  }

  function renderBuildingDirectoryPage() {
    if (!window.buildingData || !document.body) {
      return;
    }

    const container = document.querySelector(".container");
    if (!container) {
      return;
    }

    const data = window.buildingData;
    container.innerHTML = "";

    const header = document.createElement("div");
    header.className = "header";

    const logo = document.createElement("img");
    logo.className = "logo";
    logo.src = "../images/LOGO.jpg";
    logo.alt = "ZSNHS logo";

    const titleWrap = document.createElement("div");

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = data.name || "Building";

    const subtitle = document.createElement("div");
    subtitle.style.color = "#5a5c5f";
    subtitle.textContent = data.subtitle || "Room directory";

    titleWrap.appendChild(title);
    titleWrap.appendChild(subtitle);

    header.appendChild(logo);
    header.appendChild(titleWrap);

    const roomList = document.createElement("div");
    roomList.className = "room-list";

    (data.floors || []).forEach((floor) => {
      const floorBlock = document.createElement("div");
      floorBlock.className = "floor";

      const floorTitle = document.createElement("h4");
      floorTitle.textContent = floor.name;
      floorBlock.appendChild(floorTitle);

      const roomGrid = document.createElement("div");
      roomGrid.className = "room-grid";

      (floor.rooms || []).forEach((room) => {
        const link = document.createElement("a");
        link.className = "room";
        link.href = `room.html?room=${encodeURIComponent(room)}&b=${encodeURIComponent(data.name || data.id || "Building")}`;
        link.innerHTML = `<div class="badge">${escapeHtml(floor.label || floor.name || "Floor")}</div><strong>${escapeHtml(room)}</strong><small>${escapeHtml(data.name || "Building")}</small>`;
        roomGrid.appendChild(link);
      });

      floorBlock.appendChild(roomGrid);
      roomList.appendChild(floorBlock);
    });

    container.appendChild(header);
    container.appendChild(roomList);
  }

  function normalizeText(value) {
    return String(value || "").toLowerCase().replace(/\s+/g, " ").trim();
  }

  function formatFloorLabel(floor) {
    const lookup = { "1": "1st", "2": "2nd", "3": "3rd", "4": "4th" };
    return lookup[String(floor)] || String(floor);
  }

  function loadSaved() {
    try {
      const raw = localStorage.getItem("zsnhs_saved_places_v1");
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function persistSaved(items) {
    try {
      localStorage.setItem("zsnhs_saved_places_v1", JSON.stringify(items));
    } catch (error) {
      // Keep app functional even when storage is blocked.
    }
  }

  function showToast(message) {
    const toast = document.getElementById("app-toast");
    if (!toast) {
      return;
    }

    toast.hidden = false;
    toast.textContent = message;
    window.clearTimeout(showToast.timeoutId);
    showToast.timeoutId = window.setTimeout(() => {
      toast.hidden = true;
      toast.textContent = "";
    }, 2200);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, "&#96;");
  }
})();

