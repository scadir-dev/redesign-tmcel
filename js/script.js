/**
 * TMCEL Redesign — script principal (Vanilla JS)
 *
 * Responsabilidades:
 * - Menu mobile, scroll-spy, rodapé, formulário de contacto (demo)
 * - Catálogo académico: storage, CRUD, pesquisa, filtros, ordenação (ver docs/planeamento-tecnico.md)
 */

(function () {
  "use strict";

  var STORAGE_KEY = "tmcel_academico_catalogo_v1";
  var CATEGORIA_LABELS = {
    voz: "Voz móvel",
    dados: "Dados / Internet móvel",
    fibra: "Internet fixa / fibra",
    empresarial: "Empresarial",
    outro: "Outro",
  };

  var catalogMemoryStore = null;
  var catalogStorageOk = null;
  var catalogContainer = null;
  var catalogPendingRemoveId = null;
  var catalogSearchTimer = null;
  var catalogUiRefs = null;

  function init() {
    initMobileNav();
    initFooterYear();
    initNavActiveOnScroll();
    initContactFormDemo();
    initCatalog();
    if (
      typeof window.__tmcelCatalogSelfTest === "function" &&
      /catalogtest=1/.test(window.location.search)
    ) {
      window.__tmcelCatalogSelfTest();
    }
  }

  /**
   * Menu responsivo: alterna visibilidade e atributos ARIA.
   */
  function initMobileNav() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const header = document.querySelector(".site-header");
    const nav = document.getElementById("menu-principal");
    const mobileMq = window.matchMedia("(max-width: 56rem)");

    if (!toggle || !header) return;

    function syncMobileNavState() {
      if (!nav) return;
      const isMobile = mobileMq.matches;
      const isOpen = header.classList.contains("is-nav-open");
      if (isMobile && !isOpen) {
        nav.setAttribute("inert", "");
      } else {
        nav.removeAttribute("inert");
      }
    }

    function setNavOpen(isOpen) {
      header.classList.toggle("is-nav-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      syncMobileNavState();
    }

    toggle.addEventListener("click", function () {
      const isOpen = !header.classList.contains("is-nav-open");
      setNavOpen(isOpen);
      if (isOpen && toggle.matches(":focus-visible")) {
        const firstLink = header.querySelector(".site-nav__link");
        if (firstLink) {
          firstLink.focus();
        }
      }
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && header.classList.contains("is-nav-open")) {
        setNavOpen(false);
        toggle.focus();
      }
    });

    if (typeof mobileMq.addEventListener === "function") {
      mobileMq.addEventListener("change", syncMobileNavState);
    } else if (typeof mobileMq.addListener === "function") {
      mobileMq.addListener(syncMobileNavState);
    }

    window.addEventListener("resize", syncMobileNavState, { passive: true });

    // Fechar menu ao clicar numa ligação (comportamento UX em mobile)
    const navLinks = header.querySelectorAll(".site-nav__link");
    navLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        setNavOpen(false);
      });
    });

    syncMobileNavState();
  }

  /**
   * Actualiza o elemento [data-year] com o ano corrente.
   */
  function initFooterYear() {
    const yearEl = document.querySelector("[data-year]");
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  /**
   * Destaca a ligação de navegação conforme a secção visível (scroll-spy simples).
   */
  function initNavActiveOnScroll() {
    const links = document.querySelectorAll(".site-nav__link[data-nav-section]");
    if (!links.length || !("IntersectionObserver" in window)) return;

    const sectionIds = Array.from(links).map(function (link) {
      return link.getAttribute("data-nav-section");
    });

    const sections = sectionIds
      .map(function (id) {
        return document.getElementById(id);
      })
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          links.forEach(function (link) {
            const match = link.getAttribute("data-nav-section") === id;
            link.classList.toggle("site-nav__link--active", match);
            if (match) {
              link.setAttribute("aria-current", "location");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /**
   * Formulário de demonstração — impede envio real e avisa o utilizador.
   */
  function initContactFormDemo() {
    const form = document.querySelector(".contact-form");
    if (!form) return;

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (typeof form.reportValidity === "function" && !form.reportValidity()) {
        return;
      }
      alert(
        "Mensagem não enviada — formulário apenas demonstrativo nesta fase do projecto."
      );
    });
  }

  /* --------------------------------------------------------------------------
   * Catálogo académico — Storage
   * -------------------------------------------------------------------------- */

  function isCatalogStorageAvailable() {
    if (catalogStorageOk !== null) {
      return catalogStorageOk;
    }
    try {
      var testKey = "__tmcel_catalogo_test__";
      window.localStorage.setItem(testKey, "1");
      window.localStorage.removeItem(testKey);
      catalogStorageOk = true;
    } catch (err) {
      catalogStorageOk = false;
    }
    return catalogStorageOk;
  }

  function createEmptyCatalogContainer() {
    return {
      schemaVersion: 1,
      itens: [],
      preferenciasUi: {
        ultimaCategoriaFiltro: "",
        ultimaOrdenacao: "nome-asc",
        ultimaPesquisa: "",
      },
    };
  }

  function migrateCatalogIfNeeded(raw) {
    if (!raw || typeof raw !== "object") {
      return createEmptyCatalogContainer();
    }
    if (raw.schemaVersion !== 1) {
      console.warn("[catalogo] schemaVersion desconhecida; repor catálogo vazio.");
      return createEmptyCatalogContainer();
    }
    if (!Array.isArray(raw.itens)) {
      raw.itens = [];
    }
    if (!raw.preferenciasUi || typeof raw.preferenciasUi !== "object") {
      raw.preferenciasUi = createEmptyCatalogContainer().preferenciasUi;
    }
    return raw;
  }

  function loadCatalog() {
    if (!isCatalogStorageAvailable()) {
      if (!catalogMemoryStore) {
        catalogMemoryStore = createEmptyCatalogContainer();
      }
      return catalogMemoryStore;
    }
    try {
      var json = window.localStorage.getItem(STORAGE_KEY);
      if (!json) {
        var empty = createEmptyCatalogContainer();
        saveCatalog(empty);
        return empty;
      }
      return migrateCatalogIfNeeded(JSON.parse(json));
    } catch (err) {
      console.warn("[catalogo] Falha ao carregar:", err);
      return createEmptyCatalogContainer();
    }
  }

  function saveCatalog(container) {
    if (!isCatalogStorageAvailable()) {
      catalogMemoryStore = container;
      return { ok: true, modo: "memoria" };
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(container));
      return { ok: true, modo: "localStorage" };
    } catch (err) {
      console.warn("[catalogo] Falha ao guardar:", err);
      catalogMemoryStore = container;
      var quota = err && err.name === "QuotaExceededError";
      return { ok: false, modo: quota ? "quota" : "erro", error: err };
    }
  }

  /* --------------------------------------------------------------------------
   * Catálogo — Domínio e consultas
   * -------------------------------------------------------------------------- */

  function generateCatalogId() {
    if (window.crypto && typeof window.crypto.randomUUID === "function") {
      return window.crypto.randomUUID();
    }
    return "item-" + String(Date.now()) + "-" + String(Math.random()).slice(2, 9);
  }

  function normalizeForSearch(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
  }

  function validateCatalogItem(fields) {
    var errors = {};
    var nome = (fields.nome || "").trim();
    if (nome.length < 2) {
      errors.nome = "Indique um nome com pelo menos 2 caracteres.";
    }
    var categoriaId = fields.categoriaId || "";
    if (!CATEGORIA_LABELS[categoriaId]) {
      errors.categoriaId = "Seleccione uma categoria válida.";
    }
    var precoMzn = null;
    if (fields.precoMzn !== "" && fields.precoMzn != null && fields.precoMzn !== undefined) {
      var precoNum = Number(fields.precoMzn);
      if (Number.isNaN(precoNum) || precoNum < 0) {
        errors.precoMzn = "O preço deve ser um número igual ou superior a zero.";
      } else {
        precoMzn = Math.round(precoNum * 100) / 100;
      }
    }
    var dataReferencia = null;
    if (fields.dataReferencia) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(fields.dataReferencia)) {
        errors.dataReferencia = "Data inválida.";
      } else {
        dataReferencia = fields.dataReferencia;
      }
    }
    if (Object.keys(errors).length > 0) {
      return { ok: false, errors: errors, item: null };
    }
    var now = new Date().toISOString();
    return {
      ok: true,
      errors: {},
      item: {
        id: fields.id || generateCatalogId(),
        nome: nome,
        categoriaId: categoriaId,
        descricao: (fields.descricao || "").trim(),
        precoMzn: precoMzn,
        dataReferencia: dataReferencia,
        criadoEm: fields.criadoEm || now,
        actualizadoEm: now,
        origem: fields.origem || "utilizador",
        eDemonstracao: true,
      },
    };
  }

  function catalogHasPreco(itens) {
    return itens.some(function (item) {
      return item.precoMzn != null && !Number.isNaN(item.precoMzn);
    });
  }

  function catalogHasData(itens) {
    return itens.some(function (item) {
      return Boolean(item.dataReferencia);
    });
  }

  function queryItems(itens, opts) {
    var search = normalizeForSearch(opts.search || "");
    var categoryId = opts.categoryId || "";
    var sort = opts.sort || "nome-asc";

    var filtered = itens.filter(function (item) {
      if (categoryId && item.categoriaId !== categoryId) {
        return false;
      }
      if (search && normalizeForSearch(item.nome).indexOf(search) === -1) {
        return false;
      }
      return true;
    });

    var sorted = filtered.slice();
    sorted.sort(function (a, b) {
      if (sort === "nome-asc") {
        return a.nome.localeCompare(b.nome, "pt");
      }
      if (sort === "nome-desc") {
        return b.nome.localeCompare(a.nome, "pt");
      }
      if (sort === "preco-asc") {
        return comparePreco(a.precoMzn, b.precoMzn, true);
      }
      if (sort === "preco-desc") {
        return comparePreco(a.precoMzn, b.precoMzn, false);
      }
      if (sort === "data-asc") {
        return compareData(a.dataReferencia, b.dataReferencia, true);
      }
      if (sort === "data-desc") {
        return compareData(a.dataReferencia, b.dataReferencia, false);
      }
      return 0;
    });
    return sorted;
  }

  function comparePreco(a, b, asc) {
    var aNull = a == null;
    var bNull = b == null;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return asc ? a - b : b - a;
  }

  function compareData(a, b, asc) {
    var aNull = !a;
    var bNull = !b;
    if (aNull && bNull) return 0;
    if (aNull) return 1;
    if (bNull) return -1;
    return asc ? a.localeCompare(b) : b.localeCompare(a);
  }

  function addCatalogItem(container, item) {
    container.itens.push(item);
    return saveCatalog(container);
  }

  function removeCatalogItem(container, id) {
    container.itens = container.itens.filter(function (item) {
      return item.id !== id;
    });
    return saveCatalog(container);
  }

  function catalogAnnounce(message) {
    if (!catalogUiRefs || !catalogUiRefs.live) return;
    catalogUiRefs.live.textContent = "";
    window.setTimeout(function () {
      catalogUiRefs.live.textContent = message;
    }, 50);
  }

  function catalogGetUiState() {
    return {
      search: catalogUiRefs.pesquisa.value.trim(),
      categoryId: catalogUiRefs.filtro.value,
      sort: catalogUiRefs.ordenacao.value,
    };
  }

  function catalogPersistUiPrefs(container) {
    var state = catalogGetUiState();
    container.preferenciasUi.ultimaPesquisa = state.search;
    container.preferenciasUi.ultimaCategoriaFiltro = state.categoryId;
    container.preferenciasUi.ultimaOrdenacao = state.sort;
    saveCatalog(container);
  }

  function catalogUpdateSortOptions(itens) {
    var temPreco = catalogHasPreco(itens);
    var temData = catalogHasData(itens);
    Array.prototype.forEach.call(
      catalogUiRefs.ordenacao.options,
      function (opt) {
        if (opt.value.indexOf("preco-") === 0) {
          opt.disabled = !temPreco;
        }
        if (opt.value.indexOf("data-") === 0) {
          opt.disabled = !temData;
        }
      }
    );
    var current = catalogUiRefs.ordenacao.value;
  var selectedOption = catalogUiRefs.ordenacao.querySelector(
      'option[value="' + current + '"]'
    );
    if (selectedOption && selectedOption.disabled) {
      catalogUiRefs.ordenacao.value = "nome-asc";
    }
  }

  function catalogRenderList() {
    var state = catalogGetUiState();
    var results = queryItems(catalogContainer.itens, state);
    catalogUiRefs.lista.innerHTML = "";

    catalogUpdateSortOptions(catalogContainer.itens);

    var total = catalogContainer.itens.length;
    var shown = results.length;
    catalogUiRefs.contagem.textContent =
      "A mostrar " + shown + " de " + total + " item(ns) de demonstração.";

    if (shown === 0) {
      catalogUiRefs.vazio.hidden = false;
      catalogUiRefs.vazio.classList.remove("catalogo__vazio--hidden");
    } else {
      catalogUiRefs.vazio.hidden = true;
      catalogUiRefs.vazio.classList.add("catalogo__vazio--hidden");
    }

    results.forEach(function (item) {
      var li = document.createElement("li");
      li.className = "catalogo-item";
      li.setAttribute("role", "listitem");

      var header = document.createElement("div");
      header.className = "catalogo-item__header";

      var title = document.createElement("h4");
      title.className = "catalogo-item__nome";
      title.textContent = item.nome;

      var badge = document.createElement("span");
      badge.className = "catalogo-item__badge";
      badge.textContent = "Exemplo académico";

      header.appendChild(title);
      header.appendChild(badge);

      var cat = document.createElement("p");
      cat.className = "catalogo-item__categoria";
      cat.textContent = CATEGORIA_LABELS[item.categoriaId] || item.categoriaId;

      li.appendChild(header);
      li.appendChild(cat);

      if (item.descricao) {
        var desc = document.createElement("p");
        desc.className = "catalogo-item__descricao";
        desc.textContent = item.descricao;
        li.appendChild(desc);
      }

      var metaParts = [];
      if (item.precoMzn != null) {
        metaParts.push("Preço ilustrativo: " + item.precoMzn.toFixed(2) + " MZN");
      }
      if (item.dataReferencia) {
        metaParts.push("Data ref.: " + item.dataReferencia);
      }
      if (metaParts.length > 0) {
        var meta = document.createElement("p");
        meta.className = "catalogo-item__meta";
        meta.textContent = metaParts.join(" · ");
        li.appendChild(meta);
      }

      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "catalogo-item__remover";
      btn.textContent = "Remover";
      btn.setAttribute(
        "aria-label",
        "Remover item de demonstração: " + item.nome
      );
      btn.addEventListener("click", function () {
        catalogOpenRemoveDialog(item);
      });
      li.appendChild(btn);

      catalogUiRefs.lista.appendChild(li);
    });
  }

  function catalogOpenRemoveDialog(item) {
    catalogPendingRemoveId = item.id;
    catalogUiRefs.dialogTexto.textContent =
      'Deseja remover o item de demonstração "' + item.nome + '"?';
    if (typeof catalogUiRefs.dialog.showModal === "function") {
      catalogUiRefs.dialog.showModal();
    } else {
      var ok = window.confirm(catalogUiRefs.dialogTexto.textContent);
      if (ok) {
        catalogConfirmRemove();
      }
    }
  }

  function catalogConfirmRemove() {
    if (!catalogPendingRemoveId) return;
    var id = catalogPendingRemoveId;
    var removed = catalogContainer.itens.find(function (i) {
      return i.id === id;
    });
    removeCatalogItem(catalogContainer, id);
    catalogPendingRemoveId = null;
    if (catalogUiRefs.dialog.open) {
      catalogUiRefs.dialog.close();
    }
    catalogRenderList();
    catalogAnnounce(
      removed ? "Item removido: " + removed.nome + "." : "Item removido."
    );
  }

  function catalogClearFormErrors() {
    ["nome", "categoria", "preco", "data"].forEach(function (key) {
      var el = catalogUiRefs.errors[key];
      if (el) el.textContent = "";
    });
    catalogUiRefs.form
      .querySelectorAll(".catalogo-form__field--invalid")
      .forEach(function (field) {
        field.classList.remove("catalogo-form__field--invalid");
      });
  }

  function catalogShowFormErrors(errors) {
    var map = {
      nome: catalogUiRefs.errors.nome,
      categoriaId: catalogUiRefs.errors.categoria,
      precoMzn: catalogUiRefs.errors.preco,
      dataReferencia: catalogUiRefs.errors.data,
    };
    Object.keys(errors).forEach(function (key) {
      var msg = errors[key];
      var target = map[key];
      var inputMap = {
        nome: catalogUiRefs.nomeInput,
        categoriaId: catalogUiRefs.categoriaInput,
        precoMzn: catalogUiRefs.precoInput,
        dataReferencia: catalogUiRefs.dataInput,
      };
      if (target) target.textContent = msg;
      var input = inputMap[key];
      if (input && input.parentElement) {
        input.parentElement.classList.add("catalogo-form__field--invalid");
      }
    });
  }

  function catalogHandleAddSubmit(event) {
    event.preventDefault();
    catalogClearFormErrors();

    var result = validateCatalogItem({
      nome: catalogUiRefs.nomeInput.value,
      categoriaId: catalogUiRefs.categoriaInput.value,
      descricao: catalogUiRefs.descricaoInput.value,
      precoMzn: catalogUiRefs.precoInput.value,
      dataReferencia: catalogUiRefs.dataInput.value,
    });

    if (!result.ok) {
      catalogShowFormErrors(result.errors);
      catalogAnnounce("Não foi possível adicionar: verifique os campos marcados.");
      return;
    }

    var saveResult = addCatalogItem(catalogContainer, result.item);
    catalogPersistUiPrefs(catalogContainer);
    catalogRenderList();

    catalogUiRefs.form.reset();
    if (!saveResult.ok) {
      catalogAnnounce(
        "Item adicionado, mas não foi possível guardar no armazenamento local."
      );
    } else {
      catalogAnnounce("Item de demonstração adicionado: " + result.item.nome + ".");
    }
  }

  function catalogApplyPrefsToToolbar() {
    var prefs = catalogContainer.preferenciasUi;
    catalogUiRefs.pesquisa.value = prefs.ultimaPesquisa || "";
    catalogUiRefs.filtro.value = prefs.ultimaCategoriaFiltro || "";
    catalogUiRefs.ordenacao.value = prefs.ultimaOrdenacao || "nome-asc";
  }

  function catalogOnFiltersChange() {
    catalogPersistUiPrefs(catalogContainer);
    catalogRenderList();
  }

  function initCatalog() {
    var root = document.getElementById("catalogo-servicos");
    if (!root) return;

    catalogUiRefs = {
      pesquisa: document.getElementById("catalogo-pesquisa"),
      filtro: document.getElementById("catalogo-filtro-categoria"),
      ordenacao: document.getElementById("catalogo-ordenacao"),
      lista: document.getElementById("catalogo-lista"),
      contagem: document.getElementById("catalogo-contagem"),
      vazio: document.getElementById("catalogo-vazio"),
      form: document.getElementById("catalogo-formulario"),
      live: document.getElementById("catalogo-live"),
      avisoStorage: document.getElementById("catalogo-aviso-storage"),
      dialog: document.getElementById("catalogo-dialog-remover"),
      dialogTexto: document.getElementById("catalogo-dialog-texto"),
      dialogConfirmar: document.getElementById("catalogo-dialog-confirmar"),
      nomeInput: document.getElementById("catalogo-nome"),
      categoriaInput: document.getElementById("catalogo-categoria"),
      descricaoInput: document.getElementById("catalogo-descricao"),
      precoInput: document.getElementById("catalogo-preco"),
      dataInput: document.getElementById("catalogo-data"),
      errors: {
        nome: document.getElementById("catalogo-erro-nome"),
        categoria: document.getElementById("catalogo-erro-categoria"),
        preco: document.getElementById("catalogo-erro-preco"),
        data: document.getElementById("catalogo-erro-data"),
      },
    };

    if (
      !catalogUiRefs.pesquisa ||
      !catalogUiRefs.form ||
      !catalogUiRefs.lista
    ) {
      return;
    }

    catalogContainer = loadCatalog();

    if (!isCatalogStorageAvailable()) {
      catalogUiRefs.avisoStorage.hidden = false;
      catalogUiRefs.avisoStorage.classList.remove("catalogo__aviso--hidden");
    }

    catalogApplyPrefsToToolbar();
    catalogRenderList();

    catalogUiRefs.form.addEventListener("submit", catalogHandleAddSubmit);

    catalogUiRefs.pesquisa.addEventListener("input", function () {
      window.clearTimeout(catalogSearchTimer);
      catalogSearchTimer = window.setTimeout(catalogOnFiltersChange, 200);
    });

    catalogUiRefs.filtro.addEventListener("change", catalogOnFiltersChange);
    catalogUiRefs.ordenacao.addEventListener("change", catalogOnFiltersChange);

    if (catalogUiRefs.dialogConfirmar) {
      catalogUiRefs.dialogConfirmar.addEventListener("click", function () {
        catalogConfirmRemove();
      });
    }

    catalogUiRefs.dialog.addEventListener("close", function () {
      catalogPendingRemoveId = null;
    });

    window.addEventListener("storage", function (event) {
      if (event.key !== STORAGE_KEY) return;
      catalogContainer = loadCatalog();
      catalogApplyPrefsToToolbar();
      catalogRenderList();
      catalogAnnounce("Catálogo actualizado noutro separador.");
    });
  }

  /**
   * Hooks para testes manuais: abrir com ?catalogtest=1 na URL e ver consola.
   */
  if (typeof window !== "undefined" && /catalogtest=1/.test(window.location.search)) {
    window.__tmcelCatalogSelfTest = function () {
      var passed = 0;
      var failed = 0;
      function assert(cond, label) {
        if (cond) {
          passed += 1;
          console.log("[OK]", label);
        } else {
          failed += 1;
          console.error("[FAIL]", label);
        }
      }

      var sample = [
        {
          id: "1",
          nome: "Exemplo alfa",
          categoriaId: "dados",
          descricao: "",
          precoMzn: 10,
          dataReferencia: "2026-01-15",
          criadoEm: "",
          actualizadoEm: "",
          origem: "utilizador",
          eDemonstracao: true,
        },
        {
          id: "2",
          nome: "Exemplo beta",
          categoriaId: "voz",
          descricao: "",
          precoMzn: null,
          dataReferencia: null,
          criadoEm: "",
          actualizadoEm: "",
          origem: "utilizador",
          eDemonstracao: true,
        },
      ];

      assert(
        queryItems(sample, { search: "alfa", categoryId: "", sort: "nome-asc" })
          .length === 1,
        "pesquisa por nome"
      );
      assert(
        queryItems(sample, { search: "", categoryId: "voz", sort: "nome-asc" })
          .length === 1,
        "filtro categoria"
      );
      var byPreco = queryItems(sample, {
        search: "",
        categoryId: "",
        sort: "preco-desc",
      });
      assert(byPreco[0].nome === "Exemplo alfa", "ordenação preço desc");

      var invalid = validateCatalogItem({ nome: "a", categoriaId: "voz" });
      assert(!invalid.ok, "validação nome curto");

      var valid = validateCatalogItem({
        nome: "Item teste académico",
        categoriaId: "outro",
        precoMzn: "5.5",
      });
      assert(valid.ok && valid.item.eDemonstracao === true, "adicionar válido");

      console.log("Testes catálogo:", passed, "ok,", failed, "falhas");
      return { passed: passed, failed: failed };
    };
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();