import { siteContent } from './site'
import { projects, experiments, type Project } from './projects'

const lede =
  'Zanimaju me instalacije i kreativna primena tehnologije u umetnosti i dizajnu. Istražujem i praktične načine upotrebe veštačke inteligencije u kreativnom procesu.'

export const serbianSite = {
  ...siteContent,
  meta: { ...siteContent.meta, description: lede },
  nav: {
    ...siteContent.nav,
    links: [
      { label: 'Projekti', href: '/#projects' },
      { label: 'Eksperimenti', href: '/#playground' },
      { label: 'Kontakt', href: '/#contact' },
    ],
  },
  hero: { ...siteContent.hero, lede },
  work: { ...siteContent.work, title: 'Projekti', note: 'Izabrani radovi' },
  playground: { ...siteContent.playground, title: 'Eksperimenti', note: 'Istraživanja i studije' },
  contact: {
    ...siteContent.contact,
    label: 'Javi mi se',
    invitation:
      'Ako se baviš umetnošću i potrebna ti je pomoć oko tehnologije — za veb-sajt, ideju koju želiš da ostvariš ili nešto sasvim drugo — slobodno mi se javi. Rado ću pomoći besplatno, a ako želiš, možeš mi pokloniti neki svoj rad.',
  },
}

const translations: Record<string, Partial<Project>> = {
  unseen: {
    type: 'Interaktivna instalacija / Generativna AI',
    kindLabel: 'Interaktivna instalacija / Generativna AI',
    credit: 'Koncept i tehnička realizacija',
    collaboration: 'U saradnji sa slikarom Mladenom Ilićem —',
    collaborationLink: { label: 'Pogledaj njegove slike ↗', href: 'https://mladenilic.art/' },
    overview:
      'un:seen pokazuje kako veštačka inteligencija i interaktivna tehnologija mogu da pretvore doprinos publike u zajedničko iskustvo, povezujući fizičku sliku, mobilni interfejs i devet ekrana.',
    sections: [
      {
        title: 'Iskustvo',
        content: [
          'Posetioci opisuju sliku putem telefona. Njihove reči postaju slike generisane veštačkom inteligencijom, prikazane na devet tableta raspoređenih u mrežu tri puta tri pored originalnog rada. Model nikada ne vidi sliku: svaki rezultat nastaje isključivo na osnovu opisa posetioca.',
        ],
      },
      {
        title: 'Moj doprinos',
        content: [
          'Razvila sam interaktivni sistem, od mobilnog interfejsa i procesa generisanja slika do Android kiosk aplikacije koja prikazuje rezultate. Projekat spaja moje interesovanje za instalacije sa praktičnim istraživanjem veštačke inteligencije, interakcije i fizičkog prostora.',
        ],
      },
      {
        title: 'Tehnička postavka',
        content: [
          'Sistem povezuje OpenAI Image API sa Supabase servisom za čuvanje slika i podataka, dok se Capacitor koristi za Android kiosk aplikaciju. Ponovni pokušaji i rezervna rešenja pomažu da sistem pouzdano radi tokom javnog korišćenja.',
        ],
      },
      {
        title: 'Izložba',
        content: [
          'Izložba predstavlja un:seen kao funkcionalnu demonstraciju učešća publike i generativne tehnologije u zajedničkom fizičkom prostoru.',
        ],
      },
    ],
    media: projects[0].media?.map((item, index) => ({
      ...item,
      alt:
        index === 0
          ? 'Prikaz instalacije un:seen: slika pored devet uspravno postavljenih tableta u mreži tri puta tri.'
          : 'Promotivni Instagram video za un:seen na srpskom jeziku.',
      caption:
        index === 0
          ? 'Prikaz postavke sa slikom i devet ekrana.'
          : 'Promotivni Instagram video · srpski',
    })),
  },
  box: {
    type: 'Interaktivni 3D / Fotogrametrija',
    kindLabel: 'Interaktivni 3D / Fotogrametrija',
    overview:
      'Ideja ovog projekta bila je da napravim kontrast između nečega što izgleda realistično i fizički prisutno, a ipak je jasno digitalno.',
    sections: [
      {
        content: [
          'Pošla sam od stvarnog predmeta snimljenog pomoću **fotogrametrije**. Želela sam da kutija zadrži realističan izgled, dok mali delovi njene površine otkrivaju drugačiji vizuelni sloj koji pokazuje njenu digitalnu prirodu.',
          'Cilj mi je bio da isprobam efekat koji daje osećaj digitalnog, bez preteranog oslanjanja na retro ASCII estetiku.',
          'Važan deo rada bio je da efekat prati stvarni oblik kutije, umesto da izgleda kao ravna površina preko nje. Koristila sam podatke iz **mape normala u šejderu** da utičem na položaj i izgled efekta, tako da linije, pomeranja i senčenje prate površinu i sitne detalje predmeta. Na to sam dodala **efekte naknadne obrade**, poput horizontalnih linija, razdvajanja RGB kanala i izobličenja signala.',
          'Efekat je vidljiv samo unutar malog kvadrata koji prati kursor, i to samo tamo gde se kvadrat preklapa sa kutijom. Fizički oblik ostaje stabilan, dok se način prikazivanja tog dela površine menja.',
          'Još nisam zadovoljna izgledom, tako da je projekat i dalje u razvoju.',
        ],
      },
    ],
    embed: { ...projects[1].embed!, title: 'Kutija' },
    media: projects[1].media?.map((item) => ({
      ...item,
      alt: 'Ukrasna kutija na stolu ispred monitora na kom je prikazan njen 3D sken.',
    })),
  },
  'the-book-of-distance': {
    type: 'Narativno VR iskustvo',
    kindLabel: 'Virtuelna stvarnost',
    credit: 'Freelance Unity programerka',
    role: 'Narativno VR iskustvo autora Randalla Okite, u produkciji Nacionalnog filmskog odbora Kanade.',
    contribution: [
      'Radila sam na projektu The Book of Distance u završnoj fazi razvoja, pre svega na optimizaciji performansi, ispravljanju grešaka i testiranju.',
      'Moj rad je obuhvatao profilisanje aplikacije, istraživanje problema sa performansama, ispravljanje grešaka u mehanikama i interakcijama, testiranje na ciljanim VR uređajima i unapređivanje ukupne stabilnosti pre objavljivanja.',
      'Sarađivala sam sa ostatkom razvojnog tima kako bismo pripremili projekat za objavljivanje na platformama SteamVR i Oculus.',
    ],
    media: projects[2].media?.map((item, index) => ({
      ...item,
      alt:
        index === 0
          ? 'Promotivni poster za The Book of Distance: silueta osobe na brodu koja posmatra more obasjano mesečinom.'
          : 'Scena iz The Book of Distance: osoba u zamračenoj sobi gleda kroz kružni otvor ka vrtu.',
    })),
  },
  'lilys-garden': {
    type: 'Mobilna igra',
    kindLabel: 'Mobilna match-3 igra sa redovnim ažuriranjima',
    credit: 'Programerka mehanika igre',
    location: 'Kopenhagen, Danska',
    contribution: [
      'U kompaniji Tactile radila sam na igri Lily’s Garden, velikom Unity projektu koji se kontinuirano razvija, sa posebnim fokusom na korisnički interfejs, animaciju i razvoj funkcionalnosti.',
      'Veliki deo mog rada obuhvatao je izradu i integraciju animiranog interfejsa i interaktivnih sekvenci pomoću Unity alata Animator i Timeline. Blisko sam sarađivala sa umetnicima i dizajnerima kako bismo vizuelne ideje pretvorili u pouzdane sisteme u igri.',
      'Radila sam u okviru velike postojeće baze koda, gde su čista arhitektura, održavanje i jedinični testovi bili važan deo razvoja. Pored rada na funkcionalnostima, doprinosila sam internim alatima i unapređenjima procesa koji su olakšavali saradnju i iteracije između različitih disciplina.',
    ],
    media: projects[3].media?.map((item) => ({
      ...item,
      alt: 'Naslovna ilustracija igre Lily’s Garden: logo igre na pozadini naslikanog vrta.',
    })),
  },
}

export const serbianProjects: Project[] = projects.map((project) => ({
  ...project,
  ...translations[project.slug],
}))
export const serbianExperiments = experiments.map((experiment, index) => ({
  ...experiment,
  ...[
    {
      type: 'Sistemi / Studija arhitekture',
      note: 'Mali Unity demo koji istražuje skalabilnu arhitekturu uz Zenject, MVC i jedinične testove. Korišćen i u nastavi.',
    },
    {
      type: 'Rani eksperiment sa mehanikama igre · 2016',
      note: 'Moj prvi Unity projekat, sačuvan kao deo lične istorije razvoja.',
    },
    {
      type: 'Fizička slika / Mobilna interakcija / Animacija · 2020',
      note: 'Fizička slika koju telefon prepoznaje i povezuje sa digitalnom animacijom. Rani korak u povezivanju fizičkog i digitalnog, koje se nastavlja kroz un:seen.',
    },
  ][index],
}))
