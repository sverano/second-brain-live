# 🧠 Second Brain Live

**Copilote cognitif en temps réel propulsé par Gemini 3**

Second Brain Live est un système de raisonnement en temps réel qui transforme vos conversations et pensées en connaissances structurées et exploitables.

## ⚙️ Prérequis

- **Node.js** : Version 20.9.0 ou supérieure
- **npm** : Version 9 ou supérieure

Vérifiez votre version avec :
```bash
node --version
npm --version
```

## 🚀 Démarrage rapide

### 1. Installation des dépendances

```bash
npm install
```

### 2. Configuration de l'API Gemini

1. Obtenez votre clé API gratuite sur [Google AI Studio](https://ai.google.dev/)
2. Copiez votre clé API
3. Ajoutez-la dans le fichier `.env.local` :

```bash
GEMINI_API_KEY=votre_clé_api_ici
```

### 3. Lancement du serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📖 Utilisation

1. **Nouvelle session** : Cliquez sur "Nouvelle session" pour commencer
2. **Ajoutez des segments** : Entrez du texte représentant une conversation ou une pensée
3. **Observez l'évolution** : L'état cognitif se met à jour en temps réel

### Exemple de scénario de test

Essayez ces segments l'un après l'autre pour voir l'état cognitif évoluer :

1. "On se réunit pour discuter du lancement de notre app de fitness"
2. "Sarah propose de cibler les débutants plutôt que les athlètes"
3. "Marc dit qu'on devrait intégrer un coach IA. Tout le monde est d'accord"
4. "On hésite entre un abonnement mensuel ou un paiement unique"
5. "Sarah va créer les maquettes d'ici vendredi"

## 🏗️ Architecture

```
secondbrainlive/
├── app/
│   ├── page.tsx              # Interface principale
│   ├── layout.tsx            # Layout Next.js
│   └── api/
│       ├── update/route.ts   # Endpoint mise à jour
│       └── reset/route.ts    # Endpoint nouvelle session
├── components/
│   ├── InputPanel.tsx        # Zone de saisie
│   └── StateDisplay.tsx      # Affichage état cognitif
├── lib/
│   ├── gemini.ts             # Client Gemini 3
│   ├── state.ts              # Gestion état
│   └── types.ts              # Types TypeScript
```

## 🧩 Stack technique

- **Frontend** : Next.js 14 + React + TailwindCSS
- **Backend** : Next.js API Routes
- **IA** : Gemini 3 API (gratuite)
- **State** : In-memory (Map)

## 🎯 Fonctionnalités

- ✅ Traitement en temps réel des conversations
- ✅ Extraction automatique d'idées clés
- ✅ Détection des décisions prises
- ✅ Identification des actions à faire
- ✅ Suivi des questions ouvertes
- ✅ Interface utilisateur réactive et moderne

## 📝 Structure de l'état cognitif

```json
{
  "résumé": "Aperçu concis de la session",
  "idées_clés": ["Concept important 1", "Concept important 2"],
  "décisions": ["Décision 1", "Décision 2"],
  "actions_à_faire": ["Action 1 avec responsable", "Action 2"],
  "questions_ouvertes": ["Question non résolue"]
}
```

## 🎬 Pour le hackathon Gemini 3

### Pourquoi Gemini 3 est indispensable

1. **Raisonnement contextuel** : Maintient la cohérence sur de multiples updates
2. **Faible latence** : Réponse <2s nécessaire pour le temps réel
3. **Following instructions** : Respect strict du format JSON
4. **Multimodal natif** : Extensibilité future vers audio/vidéo
5. **API gratuite** : Compatible contraintes hackathon

### Démo rapide (3 minutes)

1. Démarrer une nouvelle session
2. Entrer 8-10 segments simulant un brainstorming
3. Montrer l'évolution de l'état cognitif en temps réel
4. Expliquer l'importance de Gemini 3 pour le raisonnement

## 📦 Scripts disponibles

```bash
npm run dev      # Serveur de développement
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Linter
```

## 🔧 Développement

Le projet utilise :
- TypeScript pour la sécurité des types
- ESLint pour la qualité du code
- Tailwind CSS pour le styling

## 📄 Licence

Ce projet est open source et disponible pour le hackathon Gemini 3.

---

Fait avec ❤️ pour le hackathon mondial Gemini 3