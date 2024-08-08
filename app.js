// Import the functions you need from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-app.js";
import { getFirestore, setDoc, doc, getDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAn4VF9q_ALn5nGHoL9BW3HRir1YeUrtco",
    authDomain: "dungeonapp-3f80a.firebaseapp.com",
    projectId: "dungeonapp-3f80a",
    storageBucket: "dungeonapp-3f80a.appspot.com",
    messagingSenderId: "532180053044",
    appId: "1:532180053044:web:8bf63c2be8f651010aee61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

console.log('Firestore initialized');


//navbar handling
let navbar = document.getElementsByClassName('header')[0];

navbar.onclick = function () {
    // Toggle between 'expanded' and 'shrunk' classes
    if (navbar.classList.contains('expanded')) {
        navbar.classList.remove('expanded');
        navbar.classList.add('shrunk');
        navbar.children[1].style.display = 'none'
        navbar.children[2].style.display = 'none'
    } else {
        navbar.classList.remove('shrunk');
        navbar.classList.add('expanded');
        navbar.children[1].style.display = 'block'
        navbar.children[2].style.display = 'block'
    }
};

//Spell pick modal
let grabAbilityButton = document.getElementById('spellAdd')

grabAbilityButton.onclick = async function () {
    let contentElements = document.getElementsByClassName('content');
    for (let i = 0; i < contentElements.length; i++) {
        contentElements[i].style.display = "none";
    }
    document.getElementById('modal').style.display = 'flex';

    const abilityListContainer = document.getElementById('abilityList');
    abilityListContainer.innerHTML = ''; // Clear existing options

    const querySnapshot = await getDocs(collection(db, 'abilities'));
    querySnapshot.forEach((doc) => {
        let abilityOption = document.createElement('div');
        abilityOption.className = 'ability-option';
        abilityOption.textContent = doc.id;
        abilityOption.onclick = () => {
            fillAbilityData(doc.id);
        };
        abilityListContainer.appendChild(abilityOption);
    });
};

async function fillAbilityData(abilityName) {
    document.getElementById('characterList').innerHTML = "";
    document.getElementById('abilityList').innerHTML = "";
    document.getElementById('expandedCard').innerHTML = "";
    const docRef = doc(db, 'abilities', abilityName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById('coaster').innerHTML += `<div class="card">
            <div class="cardHeader">
                <h3>${abilityName}</h3>
            </div>
            <div class="spellStats">
                <p>Level: ${data.level}</p>
                <p>Type: ${data.type}</p>
                <p>Damage Type: ${data.dmgType}</p>
            </div>
        </div>`;

        const cards = document.getElementsByClassName('card');
        for (let i = 0; i < cards.length; i++) {
            cards[i].onclick = function () {
                let contentElements = document.getElementsByClassName('content');
                for (let i = 0; i < contentElements.length; i++) {
                    contentElements[i].style.display = "none";
                }
                document.getElementById('modal').style.display = 'flex';
                document.getElementById('abilityList').innerHTML = "";
                document.getElementById('expandedCard').innerHTML = `<div class="card">
                    <div class="cardHeader">
                        <h3>${abilityName}</h3>
                    </div>
                    <div class="spellStats">
                        <p>Level: ${data.level}</p>
                        <p>Type: ${data.type}</p>
                        <p>Damage Type: ${data.dmgType}</p>
                    </div>
                    <div class="spellDesc">
                        <p>${data.desc}</p>
                    </div>
                    <div class="spellDmgRoll">
                        <p>${data.dmgRoll}</p>
                    </div>
                    <div class="deleteCard">
                        <h2 id="deleteAbility">Remove Ability</h2>
                    </div>
                </div>`;

                // Adding event listener after the element is added to the DOM
                document.getElementById('deleteAbility').onclick = async function () {
                    if (confirm('Are you sure you want to remove this ability?')) {
                        try {
                            cards[i].remove()
                            alert('ability removed')

                            // Clear the UI after deletion
                            document.getElementById('characterList').innerHTML = "";
                            document.getElementById('abilityList').innerHTML = "";
                            document.getElementById('expandedCard').innerHTML = "";
                            document.getElementById('modal').style.display = 'none'; // Close the modal

                            let contentElements = document.getElementsByClassName('content');
                            for (let i = 0; i < contentElements.length; i++) {
                                contentElements[i].style.display = "flex"; // Show the main content again
                            }
                        } catch (e) {
                            console.error('Error deleting document: ', e);
                        }
                    }
                };
            };
        }

        document.getElementById('modal').style.display = 'none'; // Close the modal after selection
        let contentElements = document.getElementsByClassName('content');
        for (let i = 0; i < contentElements.length; i++) {
            contentElements[i].style.display = "flex"; // Show the main content again
        }
    } else {
        console.log('No such document!');
    }
}


//reset data
let resetButton = document.getElementById('resetData')

resetButton.onclick = function () {
    if (confirm("Are you sure you want to reset this character sheet?")) {
        document.getElementById("charName").value = ""
        document.getElementById("class").value = ""
        document.getElementById("race").value = ""
        document.getElementById("age").value = ""
        document.getElementById("level").value = ""
        document.getElementById("ac").value = ""
        document.getElementById("hp").value = ""
        document.getElementById("int").value = ""
        document.getElementById("wis").value = ""
        document.getElementById("arcana").value = ""
        document.getElementById("char").value = ""
        document.getElementById("per").value = ""
        document.getElementById("inv").value = ""
        document.getElementById("str").value = ""
        document.getElementById("dex").value = ""
        document.getElementById("ath").value = ""
        document.getElementById("acr").value = ""
        document.getElementById("backstry").value = ""
        document.getElementById("desc").value = ""
        document.getElementById('coaster').innerHTML = ""
    }
}

//submitting a character sheet

let subButt = document.getElementById('subChar')

subButt.onclick = async function () {
    if (confirm('are you ready to submit this character?')) {
        const charName = document.getElementById("charName").value
        const classTitle = document.getElementById("class").value
        const race = document.getElementById("race").value
        const age = document.getElementById("age").value
        const level = document.getElementById("level").value
        const ac = document.getElementById("ac").value
        const hp = document.getElementById("hp").value
        const int = document.getElementById("int").value
        const wis = document.getElementById("wis").value
        const arcana = document.getElementById("arcana").value
        const char = document.getElementById("char").value
        const per = document.getElementById("per").value
        const inv = document.getElementById("inv").value
        const str = document.getElementById("str").value
        const dex = document.getElementById("dex").value
        const ath = document.getElementById("ath").value
        const acr = document.getElementById("acr").value
        const backstry = document.getElementById("backstry").value
        const desc = document.getElementById("desc").value
        const cards = document.getElementsByClassName('card')

        let spellArr = []

        for (let i = 0; i < cards.length; i++) {
            spellArr.push(cards[i].children[0].children[0].innerText)
        }

        // Reference to the document in the Firestore collection
        const docRef = doc(db, 'characters', charName);

        try {
            // Check if the document already exists
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                // Document exists, update it
                console.log('Document exists, updating it.');
            } else {
                // Document does not exist, create it
                console.log('Document does not exist, creating it.');
            }

            // Create or overwrite the document in the Firestore collection
            await setDoc(docRef, {
                classTitle: classTitle,
                race: race,
                age: age,
                level: level,
                ac: ac,
                hp: hp,
                ogHp: hp,
                int: int,
                wis: wis,
                arcana: arcana,
                char: char,
                per: per,
                inv: inv,
                str: str,
                dex: dex,
                ath: ath,
                acr: acr,
                backstory: backstry,
                desc: desc,
                spells: spellArr
            });

            console.log('Document written with ID: ', charName);

            // Clear the input fields
            document.getElementById("charName").value = ""
            document.getElementById("class").value = ""
            document.getElementById("race").value = ""
            document.getElementById("age").value = ""
            document.getElementById("level").value = ""
            document.getElementById("ac").value = ""
            document.getElementById("hp").value = ""
            document.getElementById("int").value = ""
            document.getElementById("wis").value = ""
            document.getElementById("arcana").value = ""
            document.getElementById("char").value = ""
            document.getElementById("per").value = ""
            document.getElementById("inv").value = ""
            document.getElementById("str").value = ""
            document.getElementById("dex").value = ""
            document.getElementById("ath").value = ""
            document.getElementById("acr").value = ""
            document.getElementById("backstry").value = ""
            document.getElementById("desc").value = ""
            document.getElementById('coaster').innerHTML = ""

            alert("Character Submitted");
        } catch (e) {
            console.error('Error adding document: ', e);
        }
    }
}

//updating an existing character

let updateButton = document.getElementById('updateChar')

updateButton.onclick = async function () {
    let contentElements = document.getElementsByClassName('content');
    for (let i = 0; i < contentElements.length; i++) {
        contentElements[i].style.display = "none";
    }
    document.getElementById('modal').style.display = 'flex';

    // Fetch abilities from Firestore
    const characterListContainer = document.getElementById('characterList');
    characterListContainer.innerHTML = ''; // Clear existing options

    const querySnapshot = await getDocs(collection(db, 'characters'));
    querySnapshot.forEach((doc) => {
        let characterOption = document.createElement('div');
        characterOption.className = 'character-option';
        characterOption.textContent = doc.id;
        characterOption.onclick = () => {
            fillCharacterData(doc.id);
        };
        characterListContainer.appendChild(characterOption);
    });
}

async function fillCharacterData(charName) {
    document.getElementById('characterList').innerHTML = ""
    document.getElementById('abilityList').innerHTML = ""
    document.getElementById('expandedCard').innerHTML = ""
    const docRef = doc(db, 'characters', charName);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        document.getElementById("charName").value = charName
        document.getElementById("class").value = data.classTitle
        document.getElementById("race").value = data.race
        document.getElementById("age").value = data.age
        document.getElementById("level").value = data.level
        document.getElementById("ac").value = data.ac
        document.getElementById("hp").value = data.hp
        document.getElementById("int").value = data.int
        document.getElementById("wis").value = data.wis
        document.getElementById("arcana").value = data.arcana
        document.getElementById("char").value = data.char
        document.getElementById("per").value = data.per
        document.getElementById("inv").value = data.inv
        document.getElementById("str").value = data.str
        document.getElementById("dex").value = data.dex
        document.getElementById("ath").value = data.ath
        document.getElementById("acr").value = data.acr
        document.getElementById("backstry").value = data.backstory
        document.getElementById("desc").value = data.desc
        document.getElementById('coaster').innerHTML = ""

        for (let i = 0; i < data.spells.length; i++) {
            fillAbilityData(data.spells[i])
        }

        document.getElementById('modal').style.display = 'none'; // Close the modal after selection
        let contentElements = document.getElementsByClassName('content');
        for (let i = 0; i < contentElements.length; i++) {
            contentElements[i].style.display = "flex"; // Show the main content again
        }
    } else {
        console.log('No such document!');
    }
}

document.getElementById('exitButton').onclick = function () {
    document.getElementById('characterList').innerHTML = ""
    document.getElementById('abilityList').innerHTML = ""
    document.getElementById('expandedCard').innerHTML = ""
    document.getElementById('modal').style.display = 'none'; // Close the modal after selection
    let contentElements = document.getElementsByClassName('content');
    for (let i = 0; i < contentElements.length; i++) {
        contentElements[i].style.display = "flex"; // Show the main content again
    }
}