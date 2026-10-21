
const bible = {
    Genesis: {
        1: [
            {
                verse: 1,
                text: "In the beginning God created the heaven and the earth."
            },
            {
                verse: 2,
                text: "And the earth was without form, and void; and darkness was upon the face of the deep."
            }
        ],
        2: [
            {
                verse: 1,
                text: "Thus the heavens and the earth were finished, and all the host of them."
            }
        ]
    },

    Psalms: {
        1: [
            {
                verse: 1,
                text: "Blessed is the man that walketh not in the counsel of the ungodly."
            },
            {
                verse: 2,
                text: "But his delight is in the law of the LORD."
            }
        ],
        2: [
            {
                verse: 1,
                text: "Why do the heathen rage, and the people imagine a vain thing?"
            }
        ]
    },

    Proverbs: {
        1: [
            {
                verse: 7,
                text: "The fear of the LORD is the beginning of knowledge."
            }
        ],
        2: [
            {
                verse: 6,
                text: "For the LORD giveth wisdom: out of his mouth cometh knowledge and understanding."
            }
        ]
    },

    Matthew: {
        1: [
            {
                verse: 21,
                text: "And she shall bring forth a son, and thou shalt call his name JESUS."
            }
        ],
        2: [
            {
                verse: 1,
                text: "Now when Jesus was born in Bethlehem of Judaea in the days of Herod the king..."
            }
        ]
    },

    John: {
        1: [
            {
                verse: 1,
                text: "In the beginning was the Word, and the Word was with God, and the Word was God."
            },
            {
                verse: 2,
                text: "The same was in the beginning with God."
            },
            {
                verse: 3,
                text: "All things were made by him; and without him was not any thing made that was made."
            }
        ],
        2: [
            {
                verse: 1,
                text: "And the third day there was a marriage in Cana of Galilee."
            }
        ]
    },

    Philippians: {
        1: [
            {
                verse: 6,
                text: "Being confident of this very thing, that he which hath begun a good work in you will perform it."
            }
        ],
        2: [
            {
                verse: 13,
                text: "For it is God which worketh in you both to will and to do of his good pleasure."
            }
        ]
    }
};

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => {
        page.classList.add("hidden");
    });

    document.getElementById(pageId).classList.remove("hidden");

    if (pageId === "read") displayVerses();
    if (pageId === "favorites") displayFavorites();
}

function displayVerses() {
    const book = document.getElementById("bookSelect").value;
    const chapter = document.getElementById("chapterSelect").value;
    const list = document.getElementById("verseList");

    const verses = bible[book]?.[chapter] || [];

    list.innerHTML = "";

    if (verses.length === 0) {
        list.textContent = "No sample verses available for this chapter.";
        return;
    }

    verses.forEach(item => {
        const card = document.createElement("div");
        card.className = "verse";

        const text = document.createElement("p");
        text.textContent = item.text;

        const reference = document.createElement("strong");
        reference.textContent =
            `${book} ${chapter}:${item.verse}`;

        const saveButton = document.createElement("button");
        saveButton.textContent = "♡ Save Favorite";
        saveButton.onclick = () => saveFavorite({
            book,
            chapter,
            verse: item.verse,
            text: item.text
        });

        card.append(text, reference, document.createElement("br"), saveButton);
        list.appendChild(card);
    });
}

function searchVerses() {
    const query = document.getElementById("searchInput")
        .value.trim().toLowerCase();

    const results = document.getElementById("searchResults");
    results.innerHTML = "";
    document.getElementById("verseList").innerHTML = "";

    if (!query) {
        results.textContent = "Please enter a search term.";
        return;
    }

    let found = 0;

    Object.entries(bible).forEach(([book, chapters]) => {
        Object.entries(chapters).forEach(([chapter, verses]) => {
            verses.forEach(item => {
                const reference = `${book} ${chapter}:${item.verse}`;

                if (
                    item.text.toLowerCase().includes(query) ||
                    reference.toLowerCase().includes(query)
                ) {
                    const card = document.createElement("div");
                    card.className = "verse";

                    const text = document.createElement("p");
                    text.textContent = item.text;

                    const ref = document.createElement("strong");
                    ref.textContent = reference;

                    card.append(text, ref);
                    results.appendChild(card);
                    found++;
                }
            });
        });
    });

    if (found === 0) {
        results.textContent = "No matching sample verses found.";
    }
}

function saveFavorite(item) {
    const favorites = JSON.parse(
        localStorage.getItem("bibleFavorites") || "[]"
    );

    const exists = favorites.some(f =>
        f.book === item.book &&
        f.chapter === item.chapter &&
        f.verse === item.verse
    );

    if (exists) {
        alert("This verse is already in your favorites.");
        return;
    }

    favorites.push(item);
    localStorage.setItem("bibleFavorites", JSON.stringify(favorites));

    alert("Verse saved to favorites!");
}

function displayFavorites() {
    const list = document.getElementById("favoriteList");
    const favorites = JSON.parse(
        localStorage.getItem("bibleFavorites") || "[]"
    );

    list.innerHTML = "";

    if (favorites.length === 0) {
        list.textContent = "You have no favorite verses yet.";
        return;
    }

    favorites.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "verse";

        const text = document.createElement("p");
        text.textContent = item.text;

        const ref = document.createElement("strong");
        ref.textContent =
            `${item.book} ${item.chapter}:${item.verse}`;

        const remove = document.createElement("button");
        remove.textContent = "Remove";
        remove.onclick = () => {
            favorites.splice(index, 1);
            localStorage.setItem(
                "bibleFavorites",
                JSON.stringify(favorites)
            );
            displayFavorites();
        };

        card.append(text, ref, document.createElement("br"), remove);
        list.appendChild(card);
    });
}

document.getElementById("dailyVerse").textContent =
    "For God so loved the world, that he gave his only begotten Son.";
document.getElementById("dailyReference").textContent = "John 3:16";

displayVerses();
