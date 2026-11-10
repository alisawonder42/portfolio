import { siteContent } from './site'
import { projects, experiments, type Project } from './projects'

const lede =
  'Tehnički me zanimaju nove tehnologije i kreativne mogućnosti koje otvaraju. Umetnički me privlače paradoksi, protivrečnosti i kontrasti, posebno između tradicionalnog i savremenog, kao i između umetnosti i nauke.'

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
  hero: {
    ...siteContent.hero,
    lede,
    technicalLabel: 'Tehnički',
    technical: 'Zanimaju me nove tehnologije i kreativne mogućnosti koje otvaraju.',
    artisticLabel: 'Umetnički',
    artistic: 'Privlače me paradoksi, protivrečnosti i kontrasti, posebno između tradicionalnog i savremenog, kao i između umetnosti i nauke.',
  },
  work: { ...siteContent.work, title: 'Projekti', note: 'Izabrani radovi' },
  playground: { ...siteContent.playground, title: 'Eksperimenti', note: 'Istraživanja i studije' },
  contact: {
    ...siteContent.contact,
    label: 'Javi mi se',
    gamesLabel: 'Iskustvo u razvoju igara',
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
        title: 'Koncept',
        content: [
          'Koncept za un:seen razvila sam polazeći od metafizičkih slika Mladena Ilića i njegovog intuitivnog pristupa slikanju. Njegovi radovi i stvaralački proces bili su polazište za instalaciju.',
        ],
      },
      {
        title: 'Iskustvo',
        content: [
          'Posetioci opisuju sliku putem telefona. Njihove reči postaju slike generisane veštačkom inteligencijom, prikazane na devet tableta raspoređenih u mrežu tri puta tri pored originalnog rada. Model nikada ne vidi sliku: svaki rezultat nastaje isključivo na osnovu opisa posetioca.',
        ],
      },
      {
        title: 'Moj doprinos',
        content: [
          'Razvila sam interaktivni sistem, od mobilnog interfejsa i procesa generisanja slika do Android kiosk aplikacije koja prikazuje rezultate. Takođe sam dizajnirala katalog izložbe. Projekat spaja moje interesovanje za instalacije sa praktičnim istraživanjem veštačke inteligencije, interakcije i fizičkog prostora.',
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
    sections: [
      {
        title: 'Koncept: digitalna distorzija',
        content: [
          'Želela sam da istražim kontrast između predmeta koji izgleda realistično i fizički prisutno i efekta koji je očigledno digitalan. Umesto retro ASCII estetike, zanimala su me suptilna izobličenja koja otkrivaju digitalnu prirodu objekta.',
        ],
      },
      {
        title: 'Fotogrametrija',
        content: [
          'Fotografisala sam pravu ukrasnu kutiju iz više uglova fotoaparatom i pomoću fotogrametrije rekonstruisala njen 3D model.',
        ],
      },
      {
        title: 'Tehnička strana',
        content: [
          'Skenirani model sam postavila u interaktivnu veb scenu. Kvadrat koji prati kursor otkriva linije, razdvajanje RGB kanala i distorziju na površini kutije, dok podaci iz mape normala pomažu da efekat prati njen oblik. Projekat je još u razvoju.',
        ],
      },
    ],
    embed: { ...projects[1].embed!, title: 'Kutija' },
    media: projects[1].media?.map((item) => ({
      ...item,
      alt: 'Prava ukrasna kutija pored monitora na kom je prikazan njen 3D model napravljen fotogrametrijom.',
    })),
  },
  'the-book-of-distance': {
    type: 'Narativno VR iskustvo',
    kindLabel: 'Virtuelna stvarnost',
    credit: 'Konsultantkinja',
    role: 'Narativno VR iskustvo autora Randalla Okite, u produkciji Nacionalnog filmskog odbora Kanade.',
    overview:
      'Priča prati Joneza Okitu, koji je 1935. otišao iz Hirošime u Kanadu, gde se tokom Drugog svetskog rata suočio sa rasizmom i prisilnom internacijom. Njegov unuk, umetnik Randal Okita, kroz interaktivno iskustvo rekonstruiše priču o porodici, raseljavanju i sećanju.',
    contribution: [
      'Pomagala sam timu u završnoj fazi razvoja, uglavnom kroz testiranje i profilisanje performansi, uz manji doprinos samom razvoju.',
    ],
    media: projects[2].media?.map((item, index) => ({
      ...item,
      alt:
        index === 0
          ? 'Promotivni poster za The Book of Distance: silueta osobe na brodu koja posmatra more obasjano mesečinom.'
          : 'Scena iz The Book of Distance: osoba u zamračenoj sobi gleda kroz kružni otvor ka vrtu.',
    })),
  },
  'soft-photography': {
    type: 'Analogna fotografija / Digitalni eksperimenti',
    kindLabel: 'Fotografija / Digitalni eksperimenti',
    overview:
      'Rani eksperiment sa analognom fotografijom i digitalnim formama, snimljen fotoaparatom Zenit na filmu 2017. godine.',
    sections: [
      {
        title: 'Istraživanja',
        content: [
          'Serija fotografija žena nastala tokom istraživanja analogne fotografije, mekog fokusa, nesavršenih kadrova i načina na koje se analogne slike mogu povezivati u digitalnom obliku.',
        ],
      },
    ],
  },
  'mladen-ilic': {
    type: 'Portfolio umetnika / Fotografija / Video',
    kindLabel: 'Portfolio umetnika',
    credit: 'Koncept, fotografija i video',
    overview:
      'Sajt slikara Mladena Ilića koji predstavlja njegov rad u digitalnom prostoru kroz fotografiju, video i lični vizuelni identitet.',
    contribution: [
      'Osmislila sam koncept sajta, fotografisala i snimila video-materijale kojima je predstavljen njegov rad.',
    ],
    sections: [
      {
        title: 'Potpis kao identitet',
        content: [
          'Umesto tipografski ispisanog imena, upotrebila sam njegov svojeručni potpis kao prepoznatljiv znak sajta. Kao potpis na slici, on prenosi osećaj autorstva i autentičnosti u digitalni prostor.',
        ],
      },
    ],
    externalLinks: [
      { label: 'Poseti mladenilic.art', href: 'https://mladenilic.art/' },
    ],
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
      type: 'Rani eksperiment sa mehanikama igre · 2016',
      note: 'Moj prvi Unity projekat, sačuvan kao deo lične istorije razvoja.',
    },
    {
      type: 'Fizička slika / Mobilna interakcija / Animacija · 2020',
      note: 'Eksperimentisala sam sa aplikacijom koja prepoznaje sliku kada uperite telefon u nju i oživljava je animacijom.',
    },
  ][index],
}))
