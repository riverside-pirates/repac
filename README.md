# REPAC - Riverside Engineering Parent Action Council

Source of truth for the REPAC organization website, supporting the PLTW engineering program at Riverside High School in Durham, NC.

## About

REPAC is a 501(c)(3) nonprofit organization founded in 2008 that supports the Project Lead The Way (PLTW) pre-engineering faculty and students at Riverside High School.

## Site Structure

Plain HTML/CSS/JS static site — no build tools or dependencies.

```
index.html                  Home page
about.html                  About REPAC (history, mission, board)
engineering-program.html    PLTW program overview
course-descriptions.html    PLTW course details
freshman-info.html          Info for incoming freshmen
engineering-faq.html        Engineering program FAQ
repac-faq.html              REPAC organization FAQ
student-activities.html     TSA, clubs, community service
events.html                 Events calendar
fundraising.html            Spirit wear, fundraising
css/style.css               Shared stylesheet
js/main.js                  Shared JS (nav toggle, FAQ accordion)
images/                     Image assets
```

## Local Development

Open `index.html` in a browser. No build step required.

For a local dev server:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Placeholder Content

Sections marked with a dashed yellow border contain placeholder content that needs to be filled in by REPAC leadership (board members, contact info, donation links, meeting minutes, etc.).
