/* =========================================================================
   Example content (clearly marked as an example in the editor)
   ========================================================================= */
const EXAMPLE_IMAGES = { flyte: "assets/example-flyte.jpg" };  // turned into embedded data by loadExampleImages()
function exampleProfile() {
  return {
    id: uid(), example: true, label: "Example",
    name: "Tobi Adeyemi", role: "Data Scientist & Python Developer", location: "Lagos, Nigeria",
    tagline: "I turn messy data into things people use.",
    bio: "I'm a data science student who likes building the whole thing: the classes, the pricing logic, the dashboard on top. Right now I'm shipping projects with classmates and looking for an internship where I can work with real data.",
    focus: "Data science · Python · OOP", learning: "Machine learning & SQL", status: "Open to internships",
    stats: "Projects shipped: 6\nDatasets cleaned: 40+\nAutomated tests: 33\nCups of zobo: ∞",
    skills: "Python 5\npandas 4\nNumPy 4\nData visualisation 4\nOOP 4\nFlask 3\nSQL 3\nGit & GitHub 3\nMachine learning 2\nJupyter\nSQLite",
    email: "you@example.com", github: "", linkedin: "", x: "", website: "", cv: "", contactForm: false,
    photo: "",
    projects: [
      { title: "Flyte", summary: "A flight booking and airline analytics web app built on a Python OOP core.",
        problem: "Domestic fares change without explanation, bag fees show up at the end, and refund rules are unclear. Airlines also need to see demand coming.",
        part: "", result: "Compare airlines with a recommended pick, see every fare broken down, book one-way, return or multi-city trips, and run an ops dashboard with 14-day demand forecasting and K-means passenger segments. 33 automated tests; the same AirlineSystem class runs the console app and the website.",
        tags: "Python, OOP, Flask, pandas, NumPy, SQLite", code: "", live: "", image: "", exampleImage: "flyte" },
      { title: "DineAnalytics", summary: "",
        problem: "", part: "", result: "", tags: "", code: "", live: "", image: "" },
    ],
    design: { seed: 20261015, palette: -1, fonts: -1, hero: -1, motif: -1, cards: -1 },
  };
}
function blankProfile() {
  return { id: uid(), label: "New profile", name: "", role: "", location: "", tagline: "", bio: "", focus: "", learning: "", status: "",
    stats: "", skills: "", email: "", github: "", linkedin: "", x: "", website: "", cv: "", contactForm: false, photo: "",
    projects: [{ title: "", summary: "", problem: "", part: "", result: "", tags: "", code: "", live: "", image: "" }],
    design: { seed: Math.floor(Math.random() * 1e9), palette: -1, fonts: -1, hero: -1, motif: -1, cards: -1 } };
}
function uid() { return Math.random().toString(36).slice(2, 10); }
