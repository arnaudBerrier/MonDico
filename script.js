console.log("V1 : Mon dico anglais");

/*
MON PROGRAMME : 
> Je veux pouvoir donner la définition d'un mot à mes utilisateurs
- 1. Récupérer le mot saisi par l'utilisateur
- 2. Envoyer le mot à l'API ( https://dictionaryapi.dev/ )
- 3. Récupérer le JSON (la donnée) en lien avec mon mot
- 4. Afficher les informations de mon mot sur ma page (HTML)
- 5. Ajouter un lecteur pour écouter la prononciation du mot
*/

// Etape 1 : Récupérer le mot saisi par l'utilisateur
const watchSubmit = () => {
  const form = document.querySelector("#form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const wordToSearch = data.get("search");
    apiCall(wordToSearch);
  });
};

// Etape 2 : Envoyer le mot à l'API
const apiCall = (word) => {
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((response) => response.json())
    .then((data) => {
      // Etape 3 : Récupérer la donnée
      const infoNeeded = extractData(data[0]);
      // Etape 4 : Afficher les informations
      renderToHtml(infoNeeded);
    })
    .catch(() => {
      alert("Le mot demandé n'existe pas.");
      console.log("Error");
    });
};

const extractData = (data) => {
  // 1 - Mot
  const word = data.word;
  // 2 - Ecriture phonétique
  const phonetic = findProp(data.phonetics, "text");
  // 3 - Prononciation (audio)
  const pronoun = findProp(data.phonetics, "audio");
  // 4 - Définition(s)
  const meanings = data.meanings;

  return {
    word: word,
    phonetic: phonetic,
    pronoun: pronoun,
    meanings: meanings,
  };
};

const findProp = (array, name) => {
  // Elle parcours un tableau d'objet
  for (let i = 0; i < array.length; i++) {
    // Et cherche dans ce tableau si l'objet en cour contient une certaine propriété
    const currentObject = array[i];
    const hasProp = currentObject.hasOwnProperty(name);
    if (hasProp) return currentObject[name];
  }
  // Alors elle renvoit cette propriété
};

// Etape 4 : Afficher les informations de mon mot sur ma page HTML
const renderToHtml = (data) => {
  const card = document.querySelector(".js-card");
  card.classList.remove("card--hidden");
  // Manipulation avec la prop text.content
  const title = document.querySelector(".js-card-title");
  title.textContent = data.word;
  const phonetic = document.querySelector(".js-card-phonetic");
  phonetic.textContent = data.phonetic;

  // Création d'éléments HTML
  const list = document.querySelector(".js-card-list");
  for (let i = 0; i < data.meanings.length; i++) {
    const meaning = data.meanings[i];
    const partOfSpeech = meaning.partOfSpeech;
    const definition = meaning.definitions[0].definition;

    const li = document.createElement("li");
    li.classList.add("card__meaning");

    const pPartOfSpeech = document.createElement("p");
    pPartOfSpeech.classList.add("card__part-of-speech");
    pPartOfSpeech.textContent = partOfSpeech;

    const pDefinition = document.createElement("p");
    pDefinition.classList.add("card__definition");
    pDefinition.textContent = definition;

    li.appendChild(pPartOfSpeech);
    li.appendChild(pDefinition);
    list.appendChild(li);
  }

  // Ajout de l'audio en JS
  const button = document.querySelector(".js-card-button");
  const audio = new Audio(data.pronoun);
  button.addEventListener("click", () => {
    button.classList.remove("card__player--off");
    button.classList.add("card__player--on");
    audio.play();
  });
  audio.addEventListener("ended", () => {
    button.classList.remove("card__player--on");
    button.classList.add("card__player--off");
  });
};

// Lancement du programme
watchSubmit();
