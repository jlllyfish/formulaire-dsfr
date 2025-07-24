import React, { useState } from "react";

// Configuration des pages du formulaire
const formPages = [
  {
    id: "participant",
    title: "Informations du participant",
    description: "Renseignez les informations personnelles du participant",
    fields: [
      {
        name: "prenoms",
        labelFr: "Prénoms",
        labelEn: "First names",
        type: "text",
        required: true,
      },
      {
        name: "noms",
        labelFr: "Noms",
        labelEn: "Last names",
        type: "text",
        required: true,
      },
      {
        name: "dateNaissance",
        labelFr: "Date de naissance",
        labelEn: "Date of birth",
        type: "date",
        required: true,
      },
      {
        name: "lieuNaissance",
        labelFr: "Lieu de naissance",
        labelEn: "Place of birth",
        type: "text",
        required: false,
      },
    ],
  },
  {
    id: "periode",
    title: "Période de mobilité",
    description: "Définissez les dates de la période de mobilité",
    fields: [
      {
        name: "dateDebut",
        labelFr: "Date de début",
        labelEn: "Start date",
        type: "date",
        required: true,
      },
      {
        name: "dateFin",
        labelFr: "Date de fin",
        labelEn: "End date",
        type: "date",
        required: true,
      },
      {
        name: "duree",
        labelFr: "Durée (en semaines)",
        labelEn: "Duration (weeks)",
        type: "number",
        required: false,
      },
    ],
  },
  {
    id: "accueil",
    title: "Organisme d'accueil",
    description: "Informations sur l'organisme qui accueille le participant",
    fields: [
      {
        name: "paysAccueil",
        labelFr: "Pays d'accueil",
        labelEn: "Host country",
        type: "text",
        required: true,
      },
      {
        name: "organismeAccueil",
        labelFr: "Organisme d'accueil",
        labelEn: "Host organization",
        type: "text",
        required: true,
      },
      {
        name: "adresseAccueil",
        labelFr: "Adresse",
        labelEn: "Address",
        type: "textarea",
        required: false,
      },
      {
        name: "contactAccueil",
        labelFr: "Personne de contact",
        labelEn: "Contact person",
        type: "text",
        required: false,
      },
    ],
  },
];

// Composant Stepper DSFR officiel
const DSFRStepper = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="fr-stepper">
      <h2 className="fr-stepper__title">
        {steps[currentStep - 1]?.title}
        <span className="fr-stepper__state">
          Étape {currentStep} sur {totalSteps}
        </span>
      </h2>
      <div
        className="fr-stepper__steps"
        data-fr-current-step={currentStep}
        data-fr-steps={totalSteps}
      ></div>
      <p className="fr-stepper__details">
        {currentStep < totalSteps ? (
          <>
            <span className="fr-text--bold">Étape suivante :</span>{" "}
            {steps[currentStep]?.title}
          </>
        ) : (
          <span className="fr-text--bold">Dernière étape</span>
        )}
      </p>
    </div>
  );
};

function App() {
  const [currentPage, setCurrentPage] = useState(0);
  const [formData, setFormData] = useState({});
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
          {field.required && <span className="fr-text--red"> *</span>}
        </label>
        <p className="fr-hint-text">{field.labelEn}</p>
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

    const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Europass Mobilité - ${formData.prenoms || ""} ${
      formData.noms || ""
    }</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      margin: 15px; 
      line-height: 1.3; 
      color: #161616;
      font-size: 11px;
    }
    h1 { color: #000091; font-size: 18px; }
    h2 { color: #000091; font-size: 14px; }
    .field { margin-bottom: 10px; }
    .label { font-weight: bold; }
  </style>
</head>
<body>
  <h1>EUROPASS MOBILITÉ</h1>
  <p><em>Contrat pédagogique généré le ${new Date().toLocaleDateString(
    "fr-FR"
  )}</em></p>
  
  ${formPages
    .map(
      (page) => `
    <h2>${page.title}</h2>
    ${page.fields
      .map(
        (field) => `
      <div class="field">
        <span class="label">${field.labelFr}:</span> 
        ${formData[field.name] || "(Non renseigné)"}
      </div>
    `
      )
      .join("")}
  `
    )
    .join("")}
  
  <hr style="margin-top: 30px;">
  <p style="text-align: center; font-size: 10px; color: #666;">
    Document généré automatiquement - Ministère de l'agriculture et de la souveraineté alimentaire
  </p>
</body>
</html>`;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const searchParticipants = async (term) => {
    if (!term || term.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    console.log("🔍 Recherche de:", term);

    try {
      const DOC_ID = "cTdjBRNu26yTzGusvQKffu";
      const TABLE_NAME = "Consortium_EFP";

      console.log("📡 Appel API via proxy...");

      // Utiliser votre API proxy au lieu d'appeler directement Grist
      const response = await fetch(
        `/api/grist?doc=${DOC_ID}&table=${TABLE_NAME}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("📡 Status de la réponse:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log(
          "✅ Données reçues:",
          data.records?.length,
          "enregistrements"
        );

        // Filtrer les résultats par nom/prénom
        const filtered = data.records
          .filter((record) => {
            const nom = (record.fields.Nom_Majuscule || "").toLowerCase();
            const prenom = (record.fields.Prenom_Majuscule || "").toLowerCase();
            const searchLower = term.toLowerCase();

            const matchNom = nom.includes(searchLower);
            const matchPrenom = prenom.includes(searchLower);

            console.log(
              `🔍 Test: ${nom} ${prenom} - Recherche: ${searchLower} - Match: ${
                matchNom || matchPrenom
              }`
            );

            return matchNom || matchPrenom;
          })
          .slice(0, 10);

        console.log("🎯 Résultats filtrés:", filtered.length);
        setSearchResults(filtered);
      } else {
        const errorData = await response.json();
        console.error("❌ Erreur API:", response.status, errorData);

        if (response.status === 404) {
          alert("❌ Table introuvable via le proxy.");
        } else if (response.status === 401) {
          alert("❌ Erreur d'authentification via le proxy.");
        } else if (response.status === 500) {
          alert(`❌ Erreur serveur: ${errorData.error}`);
        } else {
          alert(
            `❌ Erreur ${response.status}: ${
              errorData.error || "Erreur inconnue"
            }`
          );
        }
        setSearchResults([]);
      }
    } catch (error) {
      console.error("❌ Erreur réseau:", error);
      alert("❌ Erreur de connexion au proxy");
      setSearchResults([]);
    }

    setIsSearching(false);
  };

  // Une seule fonction testGristConnection - gardez celle-ci et supprimez l'autre
  const testGristConnection = async () => {
    try {
      const DOC_ID = "cTdjBRNu26yTzGusvQKffu";
      const TABLE_NAME = "Consortium_EFP";

      console.log("🔍 Test d'accès via proxy...");

      const response = await fetch(
        `/api/grist?doc=${DOC_ID}&table=${TABLE_NAME}`
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

          // Afficher quelques noms pour vérifier
          const noms = data.records
            .slice(0, 5)
            .map(
              (r) =>
                `${r.fields.Prenom_Majuscule || "?"} ${
                  r.fields.Nom_Majuscule || "?"
                }`
            );
          console.log("👥 Premiers noms:", noms);

          alert(`✅ Table accessible via proxy ! 
${data.records.length} enregistrements
Colonnes: ${Object.keys(data.records[0].fields).join(", ")}
Premiers noms: ${noms.join(", ")}`);
        } else {
          alert("⚠️ Table vide ou pas d'enregistrements");
        }
      } else {
        const errorData = await response.json();
        console.error("❌ Erreur proxy:", errorData);
        alert(`❌ Erreur ${response.status}: ${errorData.error}`);
      }
    } catch (error) {
      console.error("❌ Erreur:", error);
      alert("❌ Erreur de connexion au proxy");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non définie";
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  const fillFormWithGristData = (record) => {
    const fields = record.fields;
    const newFormData = {
      prenoms: fields.Prenom_Majuscule || "",
      noms: fields.Nom_Majuscule || "",
      dateDebut: fields.Date_debut_activite || "",
      dateFin: fields.Date_fin_activite || "",
      paysAccueil: fields.Pays_accueil || "",
      organismeAccueil: fields.EPLEFPA || "",
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

  const openSearch = () => {
    console.log("🔍 Ouverture de la modal de recherche");
    setShowSearchModal(true);
    setSearchTerm("");
    setSearchResults([]);
  };

  return (
    <div>
      {/* Header DSFR */}
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
                </div>
                <div className="fr-header__service">
                  <a href="/" title="Accueil - EUROPASS MOBILITÉ">
                    <p className="fr-header__service-title">
                      Europass mobilité
                    </p>
                  </a>
                  <p className="fr-header__service-tagline">
                    Contrat pédagogique
                  </p>
                </div>
              </div>
              <div className="fr-header__tools">
                <div className="fr-header__tools-links">
                  <ul className="fr-btns-group">
                    <li>
                      <button
                        type="button"
                        className="fr-btn fr-btn--secondary fr-btn--sm"
                        onClick={() => {
                          console.log("Bouton cliqué !");
                          openSearch();
                        }}
                      >
                        🔍 Pré-remplir depuis Grist
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="fr-btn fr-btn--tertiary fr-btn--sm"
                        onClick={testGristConnection}
                        title="Tester la connexion à Grist"
                      >
                        🔧 Test Grist
                      </button>
                    </li>
                    <li>
                      <button
                        type="button"
                        className="fr-btn fr-btn--primary fr-btn--sm"
                        onClick={generatePDF}
                      >
                        📄 Export PDF
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="fr-container fr-py-4w">
        <div className="fr-grid-row fr-grid-row--gutters">
          {/* Navigation Sidebar DSFR */}
          <div className="fr-col-12 fr-col-lg-3">
            <nav
              className="fr-sidemenu"
              role="navigation"
              aria-labelledby="sidemenu-title"
            >
              <div className="fr-sidemenu__inner">
                <div
                  className="fr-collapse"
                  id="sidemenu-collapse-1"
                  style={{ display: "block" }}
                >
                  <p className="fr-sidemenu__title" id="sidemenu-title">
                    Navigation
                  </p>
                  <ul className="fr-sidemenu__list">
                    {formPages.map((page, index) => (
                      <li key={page.id} className="fr-sidemenu__item">
                        <button
                          type="button"
                          onClick={() => goToPage(index)}
                          className={`fr-sidemenu__link ${
                            currentPage === index
                              ? "fr-sidemenu__link--active"
                              : ""
                          }`}
                          style={{
                            background: "none",
                            border: "none",
                            width: "100%",
                            textAlign: "left",
                            cursor: "pointer",
                            padding: "0.75rem 1rem",
                            fontSize: "1rem",
                          }}
                          aria-current={
                            currentPage === index ? "page" : undefined
                          }
                        >
                          {index + 1}. {page.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </nav>
          </div>

          {/* Form Content */}
          <div className="fr-col-12 fr-col-lg-9">
            {/* Stepper DSFR officiel */}
            <DSFRStepper
              currentStep={currentPage + 1}
              totalSteps={formPages.length}
              steps={formPages}
            />

            {/* Form Card */}
            <div className="fr-card fr-mt-3w">
              <div className="fr-card__body">
                <p className="fr-card__desc fr-mb-3w">
                  {currentPageData.description}
                </p>

                <div className="fr-grid-row fr-grid-row--gutters">
                  {currentPageData.fields.map((field) => (
                    <div
                      key={field.name}
                      className={`fr-col-12 ${
                        field.type === "textarea" ? "" : "fr-col-md-6"
                      }`}
                    >
                      {renderField(field)}
                    </div>
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="fr-btns-group fr-btns-group--between fr-mt-4w">
                  <button
                    onClick={prevPage}
                    disabled={currentPage === 0}
                    className="fr-btn fr-btn--secondary"
                  >
                    ← Précédent
                  </button>
                  <button
                    onClick={nextPage}
                    disabled={currentPage === formPages.length - 1}
                    className="fr-btn fr-btn--primary"
                  >
                    {currentPage === formPages.length - 1
                      ? "Terminer"
                      : "Suivant →"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de recherche */}
      {showSearchModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowSearchModal(false);
            }
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              borderRadius: "8px",
              padding: "2rem",
              maxWidth: "600px",
              width: "100%",
              maxHeight: "80vh",
              overflow: "auto",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Bouton de fermeture */}
            <button
              type="button"
              onClick={() => {
                console.log("Fermeture de la modal");
                setShowSearchModal(false);
              }}
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                padding: "5px",
                color: "#666",
              }}
              title="Fermer"
            >
              ×
            </button>

            {/* Titre */}
            <h2 style={{ marginTop: 0, marginBottom: "1.5rem" }}>
              🔍 Rechercher un participant
            </h2>

            {/* Champ de recherche */}
            <div className="fr-input-group">
              <label className="fr-label" htmlFor="search-input">
                Nom du participant
              </label>
              <input
                className="fr-input"
                type="text"
                id="search-input"
                value={searchTerm}
                onChange={(e) => {
                  console.log("Recherche:", e.target.value);
                  setSearchTerm(e.target.value);
                  searchParticipants(e.target.value);
                }}
                placeholder="Tapez le nom de famille..."
                style={{ marginTop: "0.5rem" }}
              />
            </div>

            {/* État de chargement */}
            {isSearching && (
              <div
                className="fr-alert fr-alert--info"
                style={{ marginTop: "1rem" }}
              >
                <p>🔄 Recherche en cours...</p>
              </div>
            )}

            {/* Résultats */}
            {searchResults.length > 0 && (
              <div style={{ marginTop: "1.5rem" }}>
                <h3>Résultats trouvés ({searchResults.length})</h3>
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                  {searchResults.map((record) => (
                    <div
                      key={record.id}
                      onClick={() => {
                        console.log("Sélection:", record);
                        fillFormWithGristData(record);
                      }}
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "4px",
                        padding: "1rem",
                        marginBottom: "0.5rem",
                        cursor: "pointer",
                        backgroundColor: "#f8f9fa",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#e9ecef";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "#f8f9fa";
                      }}
                    >
                      <h4
                        style={{ margin: "0 0 0.5rem 0", fontWeight: "bold" }}
                      >
                        {record.fields.Prenom_Majuscule}{" "}
                        {record.fields.Nom_Majuscule}
                      </h4>
                      <div style={{ fontSize: "0.9rem", color: "#666" }}>
                        <p style={{ margin: "0.25rem 0" }}>
                          📅 Du {formatDate(record.fields.Date_debut_activite)}{" "}
                          au {formatDate(record.fields.Date_fin_activite)}
                        </p>
                        <p style={{ margin: "0.25rem 0" }}>
                          🌍 Destination : {record.fields.Pays_accueil}
                        </p>
                        <p style={{ margin: "0.25rem 0" }}>
                          🏫 Établissement :{" "}
                          {record.fields.EPLEFPA || "Non renseigné"}
                        </p>
                        <p style={{ margin: "0.25rem 0" }}>
                          📋 N° dossier : {record.fields.Numero_dossier}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Aucun résultat */}
            {searchTerm.length >= 2 &&
              searchResults.length === 0 &&
              !isSearching && (
                <div
                  className="fr-alert fr-alert--warning"
                  style={{ marginTop: "1rem" }}
                >
                  <p>Aucun participant trouvé pour "{searchTerm}"</p>
                </div>
              )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
