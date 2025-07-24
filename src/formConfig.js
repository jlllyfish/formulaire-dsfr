// src/formConfig.js
export const formPages = [
  {
    id: "participant",
    title: "Informations du participant",
    description: "Identité et coordonnées du participant",
    fields: [
      {
        name: "prenoms",
        labelFr: "Prénom(s)",
        labelEn: "First name(s)",
        type: "text",
        required: true,
      },
      {
        name: "noms",
        labelFr: "Nom(s)",
        labelEn: "Last name(s)",
        type: "text",
        required: true,
      },
    ],
  },
  {
    id: "periode",
    title: "Période de mobilité",
    description: "Dates et durée du séjour",
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
    ],
  },
  {
    id: "statut",
    title: "Statut et fonction",
    description: "Position dans l'organisme d'envoi",
    fields: [
      {
        name: "statutEnvoi",
        labelFr:
          "Statut dans l'organisme d'envoi (programme pédagogique ou intitulé de poste)",
        labelEn:
          "Status at the sending organisation (learning programme or job title)",
        type: "textarea",
        required: true,
      },
    ],
  },
  {
    id: "accueil",
    title: "Organisme d'accueil",
    description: "Informations sur la destination",
    fields: [
      {
        name: "organismeAccueil",
        labelFr: "Organisme(s) d'accueil",
        labelEn: "Host organisation(s)",
        type: "text",
        required: true,
      },
      {
        name: "paysAccueil",
        labelFr: "Pays d'accueil",
        labelEn: "Host country",
        type: "text",
        required: true,
      },
      {
        name: "villeAccueil",
        labelFr: "Ville d'accueil",
        labelEn: "Host city",
        type: "text",
        required: true,
      },
      {
        name: "emailAccueil",
        labelFr: "Email de l'organisme d'accueil",
        labelEn: "Host email",
        type: "email",
        required: true,
      },
      {
        name: "telephoneAccueil",
        labelFr: "Téléphone de l'organisme d'accueil",
        labelEn: "Host phone",
        type: "tel",
        required: true,
      },
    ],
  },
];
