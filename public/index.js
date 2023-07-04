import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getAuth, signInWithPopup, signOut, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import { getFirestore, collection, doc, updateDoc, where, getDocs, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";




// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAUelaRtaC5uZPXBvSFI6HicVNFCvIMUT0",
    authDomain: "day4words.firebaseapp.com",
    projectId: "day4words",
    storageBucket: "day4words.appspot.com",
    messagingSenderId: "1077494848756",
    appId: "1:1077494848756:web:0dd29c70fb0342ab0d12a1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
var global_user = null;
const provider = new GoogleAuthProvider();

// Initialize the counter variable if not logged in
var counterValue = 0;



// update the database when user is logged in and has updated the counter
async function updateDB() 
{
    if (global_user)
    {
        // save new counter value in user doc
        await updateDoc(doc(db, "user-progress", global_user["uid"]), {
            "day": counterValue
          });
    }
}


// Function to handle sign-in button click
function googleSignIn() {
    signInWithPopup(auth, provider)
        .then((result) => {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            global_user = result.user;
        }).catch((error) => {
            // TODO: Handle Errors here.
        });
}

// Show a logout button and display user name when logged in
function showLoggedIn(user) 
{
    document.getElementById("login-button").onclick = googleSignOut;
    document.getElementById("login-button").innerHTML = "Logout";
    document.getElementById("greeting-text").innerHTML = "Hello, " + user["displayName"];
}

// Show the login button and a prompt when not logged in
function googleSignOut() {
    signOut(auth).then(() => {
        document.getElementById("login-button").onclick = googleSignIn;
        document.getElementById("login-button").innerHTML = "Login";
        document.getElementById("greeting-text").innerHTML = "Please login";
    })
}

// Firestore function that is called when user logs in or out.'
// This function is called after login and start of website by the framework
onAuthStateChanged(auth, user => {
    // if user is set
    if (user != null) {
        // save user for later
        global_user = user

        // display that he/she is logged in
        showLoggedIn(user)

        // save or pull from database
        createEntryIfNotExists(user)
    }
    else {
        // delete user var 
        global_user = null
    }
})


// Function to create entry in Firestore right after user login
async function createEntryIfNotExists(user)
{
    // assuming the user is not in the database yet
    var user_exists = false;
    const querySnapshot = await getDocs(collection(db, "user-progress"));
    querySnapshot.forEach((doc) => {
        if (doc.id == user["uid"])
        {
            // setting variable if user is found
            user_exists = true;
        }
    });
    // if user exists, fetching stored counter value
    if (user_exists) {
        const q = await getDoc(doc(collection(db, "user-progress"), user["uid"]))
        var val = q.data()["day"]

        //setting new counter value
        document.getElementById("counter").value = val
        updateCounter()
    }
    // if user does not exist in database
    else {
        // get the current counter value
        var val = document.getElementById("counter").value

        // save the value in new entry
        await setDoc(doc(collection(db, "user-progress"), user["uid"]), {
            "day": Number(val),
        })
    }
    return
 
}
// 1000 most common words saved in local array
{

    var words = [["sono", "I am"], ["io", "I"], ["il suo", "his"], ["che", "that"], ["lui", "he"], ["era", "he/she was"], ["per", "for"], ["su", "on"], ["come", "as/like"], ["con", "with"], ["loro", "they"], ["essere", "to be"], ["a", "at"], ["uno", "one"], ["avere", "to have"], ["questo", "this"], ["da", "from"], ["di", "by"], ["caldo", "hot"], ["parola", "word"], ["ma", "but"], ["cosa", "what"], ["alcuni", "some"], ["è", "is"], ["quello", "that"], ["voi", "you (pl)"], ["o", "or"], ["aveva", "had"], ["il", "the"], ["di", "of"], ["a", "to"], ["e", "and"], ["un", "a"], ["in", "in"], ["noi", "we"], ["lattina", "can (of soda)"], ["fuori", "out"], ["altro", "other"], ["erano", "were"], ["che / quale", "which"], ["fare", "to do/make"], ["loro", "their"], ["tempo", "time"], ["se", "if"], ["volontà", "will"], ["come", "how"], ["detto", "said"], ["un", "an"], ["ogni", "each"], ["dire", "tell"], ["fa", "does"], ["fisso", "set (unchanging)"], ["tre", "three"], ["desiderare", "desire"], ["aria", "air"], ["bene", "well"], ["anche", "also"], ["giocare", "play"], ["piccolo", "small"], ["fine", "end"], ["mettere", "put"], ["casa", "home"], ["leggere", "read"], ["mano", "hand"], ["portare", "carry"], ["grande", "large"], ["compitare", "spell (words)"], ["aggiungere", "add"], ["anche", "even/also"], ["terra", "land"], ["qui", "here"], ["devo", "I must"], ["grande", "big"], ["alto", "high/tall"], ["tale", "such"], ["seguire", "follow"], ["atto", "an act"], ["perché", "why"], ["chiedere", "ask"], ["maschi", "men"], ["cambiamento", "a change"], ["è andato", "he/she went"], ["luce", "light"], ["tipo", "kind (of thing)"], ["spento", "turned off"], ["bisogno", "need"], ["casa", "house"], ["immagine", "image"], ["provare", "try"], ["noi", "us"], ["di nuovo", "again"], ["animale", "animal"], ["punto", "point"], ["madre", "mother"], ["mondo", "world"], ["vicino", "near"], ["costruire", "build"], ["se stesso", "himself"], ["terra", "earth"], ["padre", "father"], ["qualsiasi", "any"], ["nuovo", "new"], ["lavoro", "work"], ["parte", "part"], ["prendere", "take"], ["ottenere", "get"], ["posto", "place"], ["fatto", "made"], ["vivere", "live"], ["dove", "where"], ["dopo", "after"], ["indietro", "back"], ["poco", "little"], ["solo", "only"], ["turno", "round"], ["uomo", "man"], ["anno", "year"], ["è venuto", "came"], ["spettacolo", "show"], ["ogni", "every"], ["buono", "good"], ["me", "me"], ["dare", "give"], ["il nostro", "our"], ["sotto", "under"], ["nome", "name"], ["molto", "very"], ["attraverso", "through"], ["solo", "just"], ["forma", "form"], ["frase", "sentence"], ["grande", "great"], ["pensare", "think"], ["dire", "say"], ["aiutare", "help"], ["basso", "low"], ["linea", "line"], ["differire", "differ"], ["turno", "turn"], ["causa", "cause"], ["molto", "much"], ["dire", "mean"], ["prima", "before"], ["spostare", "move"], ["diritto", "right"], ["ragazzo", "boy"], ["vecchio", "old"], ["troppo", "too"], ["stesso", "same"], ["lei", "she"], ["tutto", "all"], ["ci", "there"], ["quando", "when"], ["su", "up"], ["uso", "use"], ["il tuo", "your"], ["modo", "way"], ["circa", "about"], ["molti", "many"], ["allora", "then"], ["loro", "them"], ["scrivere", "write"], ["sarebbe", "would"], ["come", "like"], ["così", "so"], ["queste", "these"], ["lei", "her"], ["lungo", "long"], ["rendere", "make"], ["cosa", "thing"], ["vedere", "see"], ["lui", "him"], ["due", "two"], ["ha", "has"], ["guardare", "look"], ["di più", "more"], ["giorno", "day"], ["potuto", "could"], ["andare", "go"], ["venire", "come"], ["ha fatto", "did"], ["numero", "number"], ["suono", "sound"], ["no", "no"], ["più", "most"], ["persone", "people"], ["il mio", "my"], ["oltre", "over"], ["sapere", "know"], ["acqua", "water"], ["di", "than"], ["chiamata", "call"], ["primo", "first"], ["che", "who"], ["può", "may"], ["giù", "down"], ["lato", "side"], ["stato", "been"], ["ora", "now"], ["trovare", "find"], ["testa", "head"], ["stare in piedi", "stand"], ["proprio", "own"], ["pagina", "page"], ["dovrebbe", "should"], ["paese", "country"], ["fondare", "found"], ["risposta", "answer"], ["scuola", "school"], ["crescere", "grow"], ["studio", "study"], ["ancora", "still"], ["imparare", "learn"], ["impianto", "plant"], ["copertura", "cover"], ["cibo", "food"], ["sole", "sun"], ["quattro", "four"], ["fra", "between"], ["stato", "state"], ["mantenere", "keep"], ["occhio", "eye"], ["mai", "never"], ["ultimo", "last"], ["lasciare", "let"], ["pensiero", "thought"], ["città", "city"], ["albero", "tree"], ["attraversare", "cross"], ["fattoria", "farm"], ["difficile", "hard"], ["inizio", "start"], ["forza", "might"], ["storia", "story"], ["sega", "saw"], ["lontano", "far"], ["mare", "sea"], ["disegnare", "draw"], ["sinistra", "left"], ["tardi", "late"], ["run", "run"], ["non", "don’t"], ["mentre", "while"], ["stampa", "press"], ["close", "close"], ["notte", "night"], ["reale", "real"], ["vita", "life"], ["pochi", "few"], ["nord", "north"], ["libro", "book"], ["portare", "carry"], ["ha preso", "took"], ["scienza", "science"], ["mangiare", "eat"], ["camera", "room"], ["amico", "friend"], ["ha iniziato", "began"], ["idea", "idea"], ["pesce", "fish"], ["montagna", "mountain"], ["stop", "stop"], ["una volta", "once"], ["base", "base"], ["sentire", "hear"], ["cavallo", "horse"], ["taglio", "cut"], ["sicuro", "sure"], ["orologio", "watch"], ["colore", "color"], ["volto", "face"], ["legno", "wood"], ["principale", "main"], ["aperto", "open"], ["sembrare", "seem"], ["insieme", "together"], ["prossimo", "next"], ["bianco", "white"], ["bambini", "children"], ["inizio", "begin"], ["ottenuto", "got"], ["camminare", "walk"], ["esempio", "example"], ["alleviare", "ease"], ["carta", "paper"], ["gruppo", "group"], ["sempre", "always"], ["musica", "music"], ["quelli", "those"], ["entrambi", "both"], ["marchio", "mark"], ["spesso", "often"], ["lettera", "letter"], ["fino a quando", "until"], ["miglio", "mile"], ["fiume", "river"], ["auto", "car"], ["piedi", "feet"], ["cura", "care"], ["secondo", "second"], ["abbastanza", "enough"], ["pianura", "plain"], ["ragazza", "girl"], ["solito", "usual"], ["giovane", "young"], ["pronto", "ready"], ["sopra", "above"], ["mai", "ever"], ["rosso", "red"], ["elenco", "list"], ["anche se", "though"], ["sentire", "feel"], ["Discussioni", "talk"], ["uccello", "bird"], ["presto", "soon"], ["corpo", "body"], ["cane", "dog"], ["famiglia", "family"], ["diretto", "direct"], ["posa", "pose"], ["lasciare", "leave"], ["canzone", "song"], ["misurare", "measure"], ["porta", "door"], ["prodotto", "product"], ["nero", "black"], ["breve", "short"], ["numerale", "numeral"], ["classe", "class"], ["vento", "wind"], ["domanda", "question"], ["accadere", "happen"], ["integrale", "complete"], ["nave", "ship"], ["area", "area"], ["metà", "half"], ["rock", "rock"], ["ordine", "order"], ["fuoco", "fire"], ["sud", "south"], ["problema", "problem"], ["pezzo", "piece"], ["ha detto", "told"], ["sapeva", "knew"], ["passare", "pass"], ["da", "since"], ["top", "top"], ["tutto", "whole"], ["re", "king"], ["strada", "street"], ["pollice", "inch"], ["moltiplicare", "multiply"], ["niente", "nothing"], ["corso", "course"], ["soggiornare", "stay"], ["ruota", "wheel"], ["completo", "full"], ["vigore", "force"], ["blu", "blue"], ["oggetto", "object"], ["decidere", "decide"], ["superficie", "surface"], ["profondità", "deep"], ["luna", "moon"], ["isola", "island"], ["piede", "foot"], ["sistema", "system"], ["occupato", "busy"], ["test", "test"], ["record", "record"], ["barca", "boat"], ["comune", "common"], ["oro", "gold"], ["possibile", "possible"], ["piano", "plane"], ["vece", "stead"], ["asciutto", "dry"], ["meraviglia", "wonder"], ["ridere", "laugh"], ["migliaia", "thousand"], ["fa", "ago"], ["corse", "ran"], ["controllare", "check"], ["gioco", "game"], ["forma", "shape"], ["uguagliare", "equate"], ["caldo", "hot"], ["perdere", "miss"], ["portato", "brought"], ["calore", "heat"], ["neve", "snow"], ["pneumatico", "tire"], ["portare", "bring"], ["sì", "yes"], ["lontano", "distant"], ["riempire", "fill"], ["est", "east"], ["dipingere", "paint"], ["lingua", "language"], ["tra", "among"], ["unità", "unit"], ["potenza", "power"], ["città", "town"], ["fine", "fine"], ["certo", "certain"], ["volare", "fly"], ["cadere", "fall"], ["portare", "lead"], ["grido", "cry"], ["scuro", "dark"], ["macchina", "machine"], ["nota", "note"], ["aspettare", "wait"], ["piano", "plan"], ["figura", "figure"], ["stella", "star"], ["scatola", "box"], ["sostantivo", "noun"], ["campo", "field"], ["resto", "rest"], ["corretto", "correct"], ["in grado di", "able"], ["libbra", "pound"], ["done", "done"], ["bellezza", "beauty"], ["unità", "drive"], ["sorgeva", "stood"], ["contenere", "contain"], ["frontale", "front"], ["insegnare", "teach"], ["settimana", "week"], ["finale", "final"], ["ha dato", "gave"], ["verde", "green"], ["oh", "oh"], ["veloce", "quick"], ["sviluppare", "develop"], ["oceano", "ocean"], ["caldo", "warm"], ["gratuito", "free"], ["minuto", "minute"], ["forte", "strong"], ["speciale", "special"], ["mente", "mind"], ["dietro", "behind"], ["chiaro", "clear"], ["coda", "tail"], ["produrre", "produce"], ["fatto", "fact"], ["spazio", "space"], ["sentito", "heard"], ["migliore", "best"], ["ora", "hour"], ["meglio", "better"], ["vero", "true"], ["durante", "during"], ["cento", "hundred"], ["cinque", "five"], ["ricordare", "remember"], ["passo", "step"], ["presto", "early"], ["tenere", "hold"], ["ovest", "west"], ["terra", "ground"], ["interesse", "interest"], ["raggiungere", "reach"], ["veloce", "fast"], ["verbo", "verb"], ["cantare", "sing"], ["ascoltare", "listen"], ["sei", "six"], ["tavolo", "table"], ["viaggi", "travel"], ["meno", "less"], ["mattina", "morning"], ["dieci", "ten"], ["semplice", "simple"], ["alcuni", "several"], ["vocale", "vowel"], ["verso", "toward"], ["guerra", "war"], ["porre", "lay"], ["contro", "against"], ["modello", "pattern"], ["lento", "slow"], ["centro", "center"], ["amore", "love"], ["persona", "person"], ["soldi", "money"], ["servire", "serve"], ["apparire", "appear"], ["strada", "road"], ["mappa", "map"], ["pioggia", "rain"], ["regola", "rule"], ["governare", "govern"], ["tirare", "pull"], ["freddo", "cold"], ["avviso", "notice"], ["voce", "voice"], ["energia", "energy"], ["caccia", "hunt"], ["probabile", "probable"], ["letto", "bed"], ["fratello", "brother"], ["uovo", "egg"], ["giro", "ride"], ["cella", "cell"], ["credere", "believe"], ["forse", "perhaps"], ["scegliere", "pick"], ["improvviso", "sudden"], ["contare", "count"], ["piazza", "square"], ["motivo", "reason"], ["lunghezza", "length"], ["rappresentare", "represent"], ["arte", "art"], ["soggetto", "subject"], ["regione", "region"], ["dimensione", "size"], ["variare", "vary"], ["risolvere", "settle"], ["parlare", "speak"], ["peso", "weight"], ["generale", "general"], ["ghiaccio", "ice"], ["materia", "matter"], ["cerchio", "circle"], ["coppia", "pair"], ["includere", "include"], ["divide", "divide"], ["sillaba", "syllable"], ["feltro", "felt"], ["grande", "grand"], ["palla", "ball"], ["ancora", "yet"], ["onda", "wave"], ["cadere", "drop"], ["cuore", "heart"], ["am", "am"], ["presente", "present"], ["pesante", "heavy"], ["danza", "dance"], ["motore", "engine"], ["posizione", "position"], ["braccio", "arm"], ["ampio", "wide"], ["vela", "sail"], ["materiale", "material"], ["frazione", "fraction"], ["foresta", "forest"], ["sedersi", "sit"], ["gara", "race"], ["finestra", "window"], ["negozio", "store"], ["estate", "summer"], ["treno", "train"], ["sonno", "sleep"], ["dimostrare", "prove"], ["solitario", "lone"], ["gamba", "leg"], ["esercizio", "exercise"], ["muro", "wall"], ["prendere", "catch"], ["monte", "mount"], ["desiderio", "wish"], ["cielo", "sky"], ["pensione", "board"], ["gioia", "joy"], ["inverno", "winter"], ["sat", "sat"], ["scritto", "written"], ["selvaggio", "wild"], ["strumento", "instrument"], ["tenere", "kept"], ["vetro", "glass"], ["erba", "grass"], ["mucca", "cow"], ["lavoro", "job"], ["bordo", "edge"], ["segno", "sign"], ["visita", "visit"], ["passato", "past"], ["morbido", "soft"], ["divertimento", "fun"], ["luminoso", "bright"], ["gas", "gas"], ["tempo", "weather"], ["mese", "month"], ["milione", "million"], ["sopportare", "bear"], ["finitura", "finish"], ["felice", "happy"], ["speranza", "hope"], ["fiore", "flower"], ["vestire", "clothe"], ["strano", "strange"], ["gone", "gone"], ["commercio", "trade"], ["melodia", "melody"], ["viaggio", "trip"], ["ufficio", "office"], ["ricevere", "receive"], ["fila", "row"], ["bocca", "mouth"], ["esatto", "exact"], ["simbolo", "symbol"], ["morire", "die"], ["meno", "least"], ["difficoltà", "trouble"], ["shout", "shout"], ["tranne", "except"], ["ha scritto", "wrote"], ["seme", "seed"], ["tono", "tone"], ["aderire", "join"], ["suggerire", "suggest"], ["pulito", "clean"], ["pausa", "break"], ["signora", "lady"], ["cantiere", "yard"], ["salire", "rise"], ["male", "bad"], ["colpo", "blow"], ["olio", "oil"], ["sangue", "blood"], ["toccare", "touch"], ["è cresciuto", "grew"], ["cent", "cent"], ["mescolare", "mix"], ["team", "team"], ["filo", "wire"], ["costo", "cost"], ["perso", "lost"], ["marrone", "brown"], ["indossare", "wear"], ["giardino", "garden"], ["pari", "equal"], ["inviato", "sent"], ["scegliere", "choose"], ["caduto", "fell"], ["adattarsi", "fit"], ["flusso", "flow"], ["fiera", "fair"], ["banca", "bank"], ["raccogliere", "collect"], ["salvare", "save"], ["controllo", "control"], ["decimale", "decimal"], ["orecchio", "ear"], ["altro", "else"], ["abbastanza", "quite"], ["rotto", "broke"], ["caso", "case"], ["mezzo", "middle"], ["uccidere", "kill"], ["figlio", "son"], ["lago", "lake"], ["momento", "moment"], ["scala", "scale"], ["forte", "loud"], ["primavera", "spring"], ["osservare", "observe"], ["bambino", "child"], ["dritto", "straight"], ["consonante", "consonant"], ["nazione", "nation"], ["dizionario", "dictionary"], ["latte", "milk"], ["velocità", "speed"], ["metodo", "method"], ["organo", "organ"], ["pagare", "pay"], ["età", "age"], ["sezione", "section"], ["vestito", "dress"], ["nube", "cloud"], ["sorpresa", "surprise"], ["tranquillo", "quiet"], ["pietra", "stone"], ["piccolo", "tiny"], ["salita", "climb"], ["fresco", "cool"], ["design", "design"], ["povero", "poor"], ["lotto", "lot"], ["esperimento", "experiment"], ["fondo", "bottom"], ["chiave", "key"], ["ferro", "iron"], ["singolo", "single"], ["bastone", "stick"], ["appartamento", "flat"], ["venti", "twenty"], ["pelle", "skin"], ["sorriso", "smile"], ["piega", "crease"], ["foro", "hole"], ["salto", "jump"], ["bambino", "baby"], ["otto", "eight"], ["villaggio", "village"], ["si incontrano", "meet"], ["radice", "root"], ["acquistare", "buy"], ["aumentare", "raise"], ["risolvere", "solve"], ["metallo", "metal"], ["se", "whether"], ["spingere", "push"], ["sette", "seven"], ["paragrafo", "paragraph"], ["terzo", "third"], ["deve", "shall"], ["tenuto", "held"], ["capelli", "hair"], ["descrivere", "describe"], ["cuoco", "cook"], ["piano", "floor"], ["o", "either"], ["risultato", "result"], ["bruciare", "burn"], ["collina", "hill"], ["sicuro", "safe"], ["gatto", "cat"], ["secolo", "century"], ["considerare", "consider"], ["tipo", "type"], ["legge", "law"], ["bit", "bit"], ["costa", "coast"], ["copia", "copy"], ["frase", "phrase"], ["silenzioso", "silent"], ["alto", "tall"], ["sabbia", "sand"], ["suolo", "soil"], ["rotolo", "roll"], ["temperatura", "temperature"], ["dito", "finger"], ["industria", "industry"], ["valore", "value"], ["lotta", "fight"], ["bugia", "lie"], ["battere", "beat"], ["eccitare", "excite"], ["naturale", "natural"], ["vista", "view"], ["senso", "sense"], ["capitale", "capital"], ["non sarà", "won’t"], ["sedia", "chair"], ["pericolo", "danger"], ["frutta", "fruit"], ["ricco", "rich"], ["spesso", "thick"], ["soldato", "soldier"], ["processo", "process"], ["operare", "operate"], ["pratica", "practice"], ["separato", "separate"], ["difficile", "difficult"], ["medico", "doctor"], ["per favore", "please"], ["proteggere", "protect"], ["mezzogiorno", "noon"], ["raccolto", "crop"], ["moderno", "modern"], ["elemento", "element"], ["colpire", "hit"], ["studente", "student"], ["angolo", "corner"], ["partito", "party"], ["fornitura", "supply"], ["la cui", "whose"], ["individuare", "locate"], ["anello", "ring"], ["carattere", "character"], ["insetto", "insect"], ["catturato", "caught"], ["periodo", "period"], ["indicare", "indicate"], ["radio", "radio"], ["raggio", "spoke"], ["atomo", "atom"], ["umano", "human"], ["storia", "history"], ["effetto", "effect"], ["elettrico", "electric"], ["aspettare", "expect"], ["osso", "bone"], ["ferrovia", "rail"], ["immaginare", "imagine"], ["fornire", "provide"], ["concordare", "agree"], ["così", "thus"], ["dolce", "gentle"], ["donna", "woman"], ["capitano", "captain"], ["indovinare", "guess"], ["necessario", "necessary"], ["tagliente", "sharp"], ["ala", "wing"], ["creare", "create"], ["prossimo", "neighbor"], ["lavaggio", "wash"], ["pipistrello", "bat"], ["piuttosto", "rather"], ["folla", "crowd"], ["mais", "corn"], ["confrontare", "compare"], ["poesia", "poem"], ["stringa", "string"], ["campana", "bell"], ["dipendere", "depend"], ["carne", "meat"], ["strofinare", "rub"], ["tubo", "tube"], ["famoso", "famous"], ["dollaro", "dollar"], ["ruscello", "stream"], ["paura", "fear"], ["vista", "sight"], ["sottile", "thin"], ["triangolo", "triangle"], ["pianeta", "planet"], ["fretta", "hurry"], ["capo", "chief"], ["colonia", "colony"], ["orologio", "clock"], ["miniera", "mine"], ["cravatta", "tie"], ["inserire", "enter"], ["maggiore", "major"], ["fresco", "fresh"], ["ricerca", "search"], ["inviare", "send"], ["giallo", "yellow"], ["pistola", "gun"], ["consentire", "allow"], ["stampa", "print"], ["morto", "dead"], ["spot", "spot"], ["deserto", "desert"], ["tuta", "suit"], ["corrente", "current"], ["ascensore", "lift"], ["rosa", "rose"], ["arrivare", "arrive"], ["master", "master"], ["pista", "track"], ["genitore", "parent"], ["riva", "shore"], ["divisione", "division"], ["foglio", "sheet"], ["sostanza", "substance"], ["favorire", "favor"], ["collegare", "connect"], ["Messaggio", "post"], ["spendere", "spend"], ["accordo", "chord"], ["grasso", "fat"], ["felice", "glad"], ["originale", "original"], ["quota", "share"], ["stazione", "station"], ["papà", "dad"], ["pane", "bread"], ["carica", "charge"], ["corretto", "proper"], ["bar", "bar"], ["offerta", "offer"], ["segmento", "segment"], ["schiavo", "slave"], ["anatra", "duck"], ["immediato", "instant"], ["mercato", "market"], ["grado", "degree"], ["popolare", "populate"], ["pulcino", "chick"], ["caro", "dear"], ["nemico", "enemy"], ["rispondere", "reply"], ["bevanda", "drink"], ["verificarsi", "occur"], ["supporto", "support"], ["discorso", "speech"], ["natura", "nature"], ["gamma", "range"], ["vapore", "steam"], ["moto", "motion"], ["sentiero", "path"], ["liquido", "liquid"], ["log", "log"], ["significava", "meant"], ["quoziente", "quotient"], ["denti", "teeth"], ["guscio", "shell"], ["collo", "neck"], ["ossigeno", "oxygen"], ["zucchero", "sugar"], ["morte", "death"], ["piuttosto", "pretty"], ["abilità", "skill"], ["donne", "women"], ["stagione", "season"], ["soluzione", "solution"], ["magnete", "magnet"], ["argento", "silver"], ["grazie", "thank"], ["ramo", "branch"], ["partita", "match"], ["suffisso", "suffix"], ["particolarmente", "especially"], ["fico", "fig"], ["impaurito", "afraid"], ["enorme", "huge"], ["sorella", "sister"], ["acciaio", "steel"], ["discutere", "discuss"], ["avanti", "forward"], ["simile", "similar"], ["guidare", "guide"], ["esperienza", "experience"], ["punteggio", "score (noun)"], ["mela", "apple"], ["comprato", "bought"], ["portato", "led"], ["pece", "pitch"], ["cappotto", "coat"], ["massa", "mass"], ["scheda", "card"], ["banda", "band (rubber)"], ["corda", "rope"], ["slittamento", "slip"], ["vittoria", "win"], ["sognare", "dream"], ["sera", "evening"], ["condizione", "condition"], ["alimentazione", "feed"], ["strumento", "tool"], ["totale", "total"], ["di base", "basic"], ["odore", "smell"], ["valle", "valley"], ["né", "nor"], ["doppio", "double"], ["sedile", "seat (in a car)"], ["continuare", "continue"], ["blocco", "a block"], ["grafico", "chart"], ["cappello", "hat"], ["vendere", "sell"], ["successo", "success"], ["azienda", "a company"], ["sottrarre", "subtract"], ["evento", "event"], ["particolare", "particular"], ["affare", "deal"], ["nuoto", "swim"], ["termine", "term"], ["opposto", "opposite"], ["moglie", "wife"], ["scarpa", "shoe"], ["spalla", "shoulder"], ["spargere", "spread"], ["organizzare", "arrange"], ["campo", "a camp"], ["inventare", "invent"], ["cotone", "cotton"], ["nascita", "birth"], ["determinare", "determine"], ["quarto di gallone", "quart"], ["nove", "nine"], ["camion", "truck"], ["rumore", "noise"], ["livello", "level"], ["possibilità", "a chance"], ["raccogliere", "gather"], ["negozio", "a shop"], ["tratto", "stretch (of land)"], ["gettare", "throw"], ["brillare", "shine"], ["proprietà", "property"], ["colonna", "column"], ["molecola", "molecule"], ["selezionare", "select"], ["sbagliato", "wrong"], ["grigio", "gray"], ["ripetizione", "repeat"], ["richiedere", "require"], ["ampio", "broad"], ["preparare", "prepare"], ["sale", "salt"], ["naso", "nose"], ["plurale", "plural"], ["rabbia", "anger"], ["richiesta", "claim"], ["continente", "continent"]];

}


// fill 4 word cards depending on index
function fillWordCards(day) {
    // get html element

    var wordCards = document.getElementsByClassName("word-card");
    var wordLen = wordCards.length
    for (var i = 0; i < wordLen; i++) {
        // get word card
        var wordCard = wordCards[i];

        //calculate index
        var index = day * wordLen + i

        // retrieve tuple (italian, english)
        var word = words[index];

        // set word card attributes
        wordCard.children[0].innerHTML = word[0];
        wordCard.setAttribute('data-current-language', 'italian')
        wordCard.setAttribute('italian', word[0]);
        wordCard.setAttribute('english', word[1]);
        wordCard.classList.add('toggled');

        // show button
        wordCard.children[1].hidden = false;

    }
}

// this function handles toggle when word card is clicked
function wordCardClicked() {
    // select word card
    var div = this

    // get attributes from word card
    var currentLanguage = div.getAttribute('data-current-language');
    var englishValue = div.getAttribute('english');
    var italianValue = div.getAttribute('italian');

    // switch to italian
    if (currentLanguage === 'english') {

        // show the italian side 
        div.children[0].innerHTML = italianValue;

        // show the speak button
        div.children[1].hidden = false;

        // add toggled class
        div.classList.add('toggled');

        // save new language italian
        div.setAttribute('data-current-language', 'italian');

    }
    // switch to english
    else {

        // show the english side
        div.children[0].innerHTML = englishValue;

        // hide the speak button 
        div.children[1].hidden = true;

        // remove toggled class
        div.classList.remove('toggled');

        // save new language english
        div.setAttribute('data-current-language', 'english');
    }
}

// this function updates counter when text field is manually added
function updateCounter() {
    var counterElement = document.getElementById("counter");
    counterValue = Number(counterElement.value);
    fillWordCards(counterValue);
    updateDB(counterValue);
}


// this function changes counter when + button is pressed 
function addCounter() {
    // get counter display
    var counterElement = document.getElementById("counter");

    // increment
    counterValue++;

    // set new value
    counterElement.value = counterValue;

    // fill new word cards
    fillWordCards(counterValue);
    updateDB(counterValue);
}

// this function changes counter when - button is pressed 
function minusCounter(op) {
    // get counter display
    var counterElement = document.getElementById("counter");

    // decrement only when greater 0
    if (counterValue > 0) {
        counterValue--;
    }

    // set new value
    counterElement.value = counterValue;

    // fill new word cards
    fillWordCards(counterValue);
    updateDB(counterValue);
}

// handle google button call
function Google(but)
{
    // select correct text to speak
    var div = but.parentNode.children[0];
    var text = div.innerHTML

    // only speak if there is text
    if (text !== "") {
        console.log(text)
        var url = "https://translate.google.com/?sl=it&tl=es&text=" + text + "&op=translate&hl=en"
        window.open(url,"_self")

    }
}



// fill first index of word cards
fillWordCards(0);


// add functions dynamically to the buttons
document.getElementById("login-button").onclick = googleSignIn;
document.getElementById("counter").onchange = googleSignIn;
document.getElementById("plus").onclick = addCounter;
document.getElementById("minus").onclick = minusCounter;
document.getElementById("counter").onchange = updateCounter;

// add functions to word cards
var wordCards = document.getElementsByClassName("word-card");
for (var i = 0; i < wordCards.length; i++) {
    wordCards[i].onclick = wordCardClicked;
}

var googleButtons = document.getElementsByClassName("google");
// add soundbuttons
for (var i = 0; i < googleButtons.length; i++) {
    googleButtons[i].onclick = function (event) {
        Google(this);
        event.stopPropagation()
    }
}
