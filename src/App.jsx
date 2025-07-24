import React, { useState } from "react";
import { formPages } from "./formConfig";

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState({});
  // État pour la recherche
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderField = (field) => {
    const value = formData[field.name] || "";

    return (
      <div key={field.name} className="fr-input-group">
        <label className="fr-label">
          {field.labelFr}
          {field.required && " *"}
        </label>
        {field.type === "textarea" ? (
          <textarea
            className="fr-input"
            name={field.name}
            value={value}
            onChange={handleChange}
            rows="3"
          />
        ) : (
          <input
            className="fr-input"
            type={field.type}
            name={field.name}
            value={value}
            onChange={handleChange}
          />
        )}
      </div>
    );
  };

  const nextPage = () => {
    if (currentPage < formPages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageIndex) => {
    setCurrentPage(pageIndex);
  };

  const currentPageData = formPages[currentPage];

  const generatePDF = () => {
    const printWindow = window.open("", "_blank");
    const logoDataUrl =
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 90 60'%3E%3Cpath fill='%23000091' d='M0 0h30v60H0z'/%3E%3Cpath fill='%23fff' d='M30 0h30v60H30z'/%3E%3Cpath fill='%23e1000f' d='M60 0h30v60H60z'/%3E%3C/svg%3E";

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="fr">
      <head>
        <meta charset="UTF-8">
        <title>Europass Mobilité - ${formData.prenoms || ""} ${
      formData.noms || ""
    }</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Marianne:wght@400;500;700&display=swap');
          
          body { 
            font-family: 'Marianne', Arial, sans-serif; 
            margin: 15px; 
            line-height: 1.3; 
            color: #161616;
            font-size: 11px;
          }
          
          .header {
            border-bottom: 2px solid #000091;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }
          
          .logos-row {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
          }
          
          .ministere-logo {
            height: 60px;
            object-fit: contain;
            margin-right: 30px;
          }
          
          .service-logo {
            height: 60px;
            object-fit: contain;
          }
          
          .titles {
            text-align: right;
          }
          
          h1 { 
            color: #000091; 
            font-size: 18px;
            font-weight: 700;
            margin: 10px 0 5px 0;
          }
          
          .subtitle {
            color: #000091;
            font-size: 14px;
            font-weight: 600;
            margin: 0 0 10px 0;
          }
          
          .date-info {
            font-size: 9px;
            color: #666;
            margin: 0;
          }
          
          h2 { 
            color: #000091; 
            font-size: 14px;
            font-weight: 600;
            margin: 20px 0 10px 0;
            border-bottom: 1px solid #000091;
            padding-bottom: 3px;
          }
          
          .fields-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
          }
          
          .field-full {
            grid-column: 1 / -1;
          }
          
          .field { 
            margin-bottom: 8px;
          }
          
          .label-fr { 
            font-weight: 600; 
            color: #161616; 
            font-size: 10px;
            display: block;
            margin-bottom: 1px;
          }
          
          .label-en {
            font-size: 8px;
            color: #888;
            font-style: italic;
            display: block;
            margin-bottom: 4px;
          }
          
          .value { 
            padding: 4px 8px; 
            background: #f9f8f6; 
            border-left: 3px solid #000091;
            min-height: 15px;
            font-size: 10px;
            font-weight: 500;
          }
          
          .value.empty {
            background: #f5f5f5;
            border-left-color: #ccc;
            color: #888;
            font-style: italic;
          }
          
          .footer {
            margin-top: 25px;
            padding-top: 15px;
            border-top: 1px solid #000091;
            text-align: center;
            color: #666;
            font-size: 9px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logos-row">
            <div class="logos-row">
            <img src="/logo-ministere.png" alt="Ministère de l'agriculture" class="ministere-logo" />
            <img src="/Logo-moow.png" alt="Logo du service" class="service-logo" />
          </div>
          <div class="titles">
            <h2>EUROPASS MOBILITÉ / EUROPASS MOBILITY</h1>
            <div class="subtitle">Contrat pédagogique / Learning agreement</div>
            <p class="date-info">
              Généré le : ${new Date().toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        
        ${formPages
          .map((page, pageIndex) => {
            const fieldsLayout = page.fields.map((field) => {
              const value = formData[field.name] || "";
              const isEmpty = !value || value === "";
              const isFullWidth = field.type === "textarea";

              return {
                ...field,
                value,
                isEmpty,
                isFullWidth,
              };
            });

            return `
            <h2>${page.title}</h2>
            <div class="fields-grid">
              ${fieldsLayout
                .map(
                  (field) => `
                <div class="field ${field.isFullWidth ? "field-full" : ""}">
                  <span class="label-fr">${field.labelFr}${
                    field.required ? " *" : ""
                  }</span>
                  <span class="label-en">${field.labelEn}</span>
                  <div class="value ${field.isEmpty ? "empty" : ""}">
                    ${field.isEmpty ? "(Non renseigné)" : field.value}
                  </div>
                </div>
              `
                )
                .join("")}
            </div>
          `;
          })
          .join("")}
        
        <div class="footer">
          <p><strong>Ministère de l'agriculture et de la souveraineté alimentaire</strong></p>
          <p>Document généré automatiquement</p>
        </div>
      </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const testGristConnection = async () => {
    try {
      const DOC_ID = "cTdjBRNu26yTzGusvQKffu";
      const TABLE_NAME = "Consortium_EFP";
      const API_KEY = import.meta.env.VITE_GRIST_API_KEY;

      console.log("🔍 Test d'accès à la table...");

      const response = await fetch(
        `https://api.allorigins.win/raw?url=${encodeURIComponent(
          "https://grist.numerique.gouv.fr/o/srfd-occ/api/docs/" +
            DOC_ID +
            "/tables/" +
            TABLE_NAME +
            "/records"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      console.log("📡 Status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Données de la table:", data);

        if (data.records && data.records.length > 0) {
          console.log("📋 Premier enregistrement:", data.records[0]);
          console.log(
            "📋 Colonnes disponibles:",
            Object.keys(data.records[0].fields)
          );

          alert(`✅ Table accessible ! 
${data.records.length} enregistrements
Colonnes: ${Object.keys(data.records[0].fields).join(", ")}`);
        } else {
          alert("⚠️ Table vide ou pas d'enregistrements");
        }
      } else {
        const errorText = await response.text();
        console.error("❌ Erreur table:", errorText);

        if (response.status === 404) {
          alert(
            "❌ Table 'Consortium_EFP' introuvable. Vérifiez le nom exact."
          );
        } else {
          alert(`❌ Erreur ${response.status}`);
        }
      }
    } catch (error) {
      console.error("❌ Erreur:", error);
      alert("❌ Erreur de connexion");
    }
  };

  // Recherche dans Grist
  const searchParticipants = async (term) => {
    if (!term || term.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const DOC_ID = "cTdjBRNu26yTzGusvQKffu";
      const TABLE_NAME = "Consortium_EFP";
      const API_KEY = import.meta.env.VITE_GRIST_API_KEY;

      const response = await fetch(
        `https://api.allorigins.win/raw?url=${encodeURIComponent(
          "https://grist.numerique.gouv.fr/o/srfd-occ/api/docs/" +
            DOC_ID +
            "/tables/" +
            TABLE_NAME +
            "/records"
        )}`,
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Filtrer les résultats par nom/prénom
        const filtered = data.records
          .filter((record) => {
            const nom = (record.fields.Nom_Majuscule || "").toLowerCase();
            const searchLower = term.toLowerCase();

            return nom.includes(searchLower);
          })
          .slice(0, 10); // Limiter à 10 résultats

        setSearchResults(filtered);
      }
    } catch (error) {
      console.error("Erreur de recherche:", error);
    }
    setIsSearching(false);
  };

  // Convertir les dates unix en format français
  const formatDate = (unixDate) => {
    if (!unixDate) return "Non définie";

    // Si c'est déjà une string au format YYYY-MM-DD, on la convertit
    if (typeof unixDate === "string" && unixDate.includes("-")) {
      const date = new Date(unixDate);
      return date.toLocaleDateString("fr-FR");
    }

    // Si c'est un timestamp unix
    const date = new Date(unixDate * 1000); // Multiplier par 1000 pour JS
    return date.toLocaleDateString("fr-FR");
  };

  // Convertir pour les inputs de type date (format YYYY-MM-DD)
  const formatDateForInput = (unixDate) => {
    if (!unixDate) return "";

    if (typeof unixDate === "string" && unixDate.includes("-")) {
      return unixDate; // Déjà au bon format
    }

    const date = new Date(unixDate * 1000);
    return date.toISOString().split("T")[0]; // Format YYYY-MM-DD
  };

  // Pré-remplir avec les données sélectionnées
  const fillFormWithGristData = (record) => {
    const fields = record.fields;

    // Mapping des champs Grist vers notre formulaire
    const newFormData = {
      // Page Participant
      prenoms: fields.Prenom_Majuscule || "",
      noms: fields.Nom_Majuscule || "",

      // Page Période
      dateDebut: formatDateForInput(fields.Date_debut_activite) || "",
      dateFin: formatDateForInput(fields.Date_fin_activite) || "",

      // Page Accueil
      paysAccueil: fields.Pays_accueil || "",
      // Ajoutez d'autres mappings selon vos besoins
    };

    setFormData((prev) => ({
      ...prev,
      ...newFormData,
    }));

    setShowSearchModal(false);
    alert(
      `✅ Formulaire pré-rempli avec les données de ${fields.Prenom_Majuscule} ${fields.Nom_Majuscule}`
    );
  };

  // Ouvrir la recherche
  const openSearch = () => {
    setShowSearchModal(true);
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <div className="fr-container">
      <header role="banner" className="fr-header">
        <div className="fr-header__body">
          <div className="fr-container">
            <div className="fr-header__body-row">
              <div className="fr-header__brand fr-enlarge-link">
                <div className="fr-header__brand-top">
                  <div className="fr-header__logo">
                    <a
                      href="/"
                      title="Accueil - Ministère de l'agriculture et de la souveraineté alimentaire"
                    >
                      <p className="fr-logo">
                        Ministère
                        <br />
                        de l'agriculture
                        <br />
                        et de la souveraineté
                        <br />
                        alimentaire
                      </p>
                    </a>
                  </div>
                  <div className="fr-header__operator">
                    <img
                      src="/Logo-moow.png"
                      alt="Logo du service"
                      style={{
                        height: "60px",
                        marginLeft: "2rem",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <div className="fr-header__navbar">
                    <button
                      className="fr-btn--menu fr-btn"
                      title="Menu"
                      type="button"
                    >
                      Menu
                    </button>
                  </div>
                </div>
                <div className="fr-header__service">
                  <a href="/" title="Accueil - EUROPASS MOBILITÉ">
                    <p className="fr-header__service-title">
                      Contrat pédagogique
                    </p>
                  </a>
                  <p className="fr-header__service-tagline">
                    Gestion des déplacements professionnels
                  </p>
                </div>
              </div>
              <div className="fr-header__tools">
                <div className="fr-btns-group">
                  <button
                    className="fr-btn fr-btn--secondary fr-btn--sm"
                    onClick={openSearch}
                  >
                    🔍 Pré-remplir depuis Grist
                  </button>
                  <button
                    className="fr-btn fr-btn--primary fr-btn--sm"
                    onClick={generatePDF}
                  >
                    📄 Export PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="fr-container fr-py-4w">
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12 fr-col-lg-3">
            <div className="fr-card">
              <div className="fr-card__body">
                <h3>Navigation</h3>
                {formPages.map((page, index) => (
                  <button
                    key={page.id}
                    onClick={() => goToPage(index)}
                    className={
                      currentPage === index
                        ? "fr-btn fr-btn--primary fr-btn--sm"
                        : "fr-btn fr-btn--tertiary-no-outline fr-btn--sm"
                    }
                    style={{
                      display: "block",
                      width: "100%",
                      marginBottom: "0.5rem",
                      textAlign: "left",
                    }}
                  >
                    {index + 1}. {page.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="fr-col-12 fr-col-lg-9">
            <div className="fr-card">
              <div className="fr-card__body">
                <h2>
                  Étape {currentPage + 1} sur {formPages.length}
                </h2>
                <h1>{currentPageData.title}</h1>
                <p style={{ color: "#666", marginBottom: "2rem" }}>
                  {currentPageData.description}
                </p>

                {currentPageData.fields.map((field) => renderField(field))}

                <div className="fr-btns-group fr-mt-4w">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className="fr-btn fr-btn--secondary"
                  >
                    Précédent
                  </button>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === formPages.length - 1}
                    className="fr-btn fr-btn--primary"
                    style={{ marginLeft: "1rem" }}
                  >
                    {currentPage === formPages.length - 1
                      ? "Terminer"
                      : "Suivant"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal de recherche Grist */}
      {showSearchModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            className="fr-modal__body"
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "2rem",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflow: "auto",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            <div
              className="fr-modal__header"
              style={{ textAlign: "right", marginBottom: "1rem" }}
            >
              <button
                className="fr-btn fr-btn--close"
                onClick={() => setShowSearchModal(false)}
              >
                ✕ Fermer
              </button>
            </div>
            <div className="fr-modal__content">
              <h2 className="fr-modal__title">🔍 Rechercher un participant</h2>

              <div className="fr-input-group">
                <label className="fr-label">Nom du participant</label>
                <input
                  className="fr-input"
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    searchParticipants(e.target.value);
                  }}
                  placeholder="Tapez au moins 2 caractères..."
                />
              </div>

              {isSearching && (
                <div className="fr-alert fr-alert--info fr-mt-2w">
                  <p>🔄 Recherche en cours...</p>
                </div>
              )}

              <div className="fr-mt-3w">
                {searchResults.length > 0 && (
                  <>
                    <h3>Résultats trouvés ({searchResults.length})</h3>
                    {searchResults.map((record) => (
                      <div
                        key={record.id}
                        onClick={() => fillFormWithGristData(record)}
                        className="fr-card fr-card--sm"
                        style={{
                          cursor: "pointer",
                          marginBottom: "1rem",
                          border: "1px solid #ddd",
                        }}
                      >
                        <div className="fr-card__body">
                          <div className="fr-card__content">
                            <h4 className="fr-card__title">
                              {record.fields.Prenom_Majuscule}{" "}
                              {record.fields.Nom_Majuscule}
                            </h4>
                            <p className="fr-card__desc">
                              📅 Du{" "}
                              {formatDate(record.fields.Date_debut_activite)} au{" "}
                              {formatDate(record.fields.Date_fin_activite)}
                              <br />
                              🌍 Destination : {record.fields.Pays_accueil}
                              <br />
                              🏫 Établissement :{" "}
                              {record.fields.EPLEFPA || "Non renseigné"}
                              <br />
                              📋 N° dossier : {record.fields.Numero_dossier}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {searchTerm.length >= 2 &&
                  searchResults.length === 0 &&
                  !isSearching && (
                    <div className="fr-alert fr-alert--warning fr-mt-2w">
                      <p>Aucun participant trouvé pour "{searchTerm}"</p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
