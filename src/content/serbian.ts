import { siteContent } from './site'
import { projects, experiments, type Project } from './projects'

const lede =
  'Zanimaju me nove tehnologije i mogućnosti koje one otvaraju.'

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
    technical: 'Zanimaju me nove tehnologije i mogućnosti koje one otvaraju.',
  },
  work: { ...siteContent.work, title: 'Projekti', note: 'Izabrani radovi' },
  playground: { ...siteContent.playground, title: 'Eksperimenti', note: 'Istraživanja i studije' },
  background: {
    ...siteContent.background,
    university: 'Univerzitet u Novom Sadu',
  },
  contact: {
    ...siteContent.contact,
    label: 'Javi mi se',
    gamesLabel: 'Iskustvo u razvoju igara',
  },
}

const translations: Record<string, Partial<Project>> = {
  'interactive-installation': {
    title: 'un:seen — interaktivna instalacija',
    type: 'Interaktivna instalacija / Generativna AI',
    kindLabel: 'Interaktivna instalacija / Generativna AI',
    credit: 'Koncept i tehnička realizacija',
    overview:
      'Članak koji postavlja pitanje može li AI da stvara umetnost naveo me je na šire pitanje: šta umetnost čini umetnošću? Kroz ovu instalaciju istražujem to pitanje kroz niz interpretacija: posetilac posmatra sliku prijatelja, opisuje je rečima, a zatim te reči postaju nova digitalna slika. Sistem dobija opis, nikada originalnu sliku.',
    sections: [
      {
        title: 'Preispitivanje umetnosti kroz instalaciju',
        content: [
          'Projekat ne pokušava da razreši da li je slika koju je generisala AI umetnost. Umesto toga, pita šta se dešava sa slikom dok prolazi kroz različite ljude i medije, i gde se u tom procesu nalaze autorstvo, namera i interpretacija. Opis posetioca postaje deo rada: njegova pažnja i jezik oblikuju sliku koja nastaje.',
        ],
      },
      {
        title: 'Od posmatranja do jezika',
        content: [
          'Kada posmatrač pretoči svoj doživljaj u reči, subjektivno i trenutno čitanje slike postaje eksplicitno. Jezik postaje interfejs između gledanja i mašinske interpretacije. Slika prelazi iz fizičkog rada u reči posetioca, zatim u digitalne podatke i generisanu sliku prikazanu na ekranima. Svaki prelaz menja način na koji se ona može tumačiti i doživeti.',
        ],
      },
      {
        title: 'Tehnički sistem',
        content: [
          'Razvila sam mobilni veb interfejs za prikupljanje opisa i povezala ih sa procesom generisanja slika. Supabase (PostgreSQL, Auth i Storage) čuva opise, vremenske oznake i generisane slike. Android kiosk aplikacija prikazuje rezultate na devet tableta, uz ponovne pokušaje i rezervnu obradu u slučaju grešaka u generisanju ili mreži.',
        ],
      },
    ],
    media: projects[0].media?.map((item) => ({
      ...item,
      alt: 'Prikaz interaktivne instalacije: prijateljeva slika sa zakrivljenim formama pored devet tableta u mreži tri puta tri.',
      caption: 'Prikaz postavke sa slikom i devet ekrana.',
    })),
    externalLinks: [
      {
        label: 'Video instalacije · srpski · MP4',
        href: '/projects/interactive-installation/installation-video-sr.mp4',
      },
      {
        label: 'Članak o AI umetnosti: There’s no such thing as AI art · Derek Matravers (IAI)',
        href: 'https://iai.tv/articles/theres-no-such-thing-as-ai-art-auid-3621',
      },
    ],
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
      type: 'Rani eksperiment sa mehanikama igre',
      note: 'Moj prvi Unity projekat, sačuvan kao deo lične istorije razvoja.',
    },
    {
      type: 'Unity AR eksperiment',
      note: 'Prvi put sam koristila Unity da eksperimentišem sa proširenom stvarnošću.',
    },
    {
      type: 'C++ / OpenGL studija',
      note: 'Klon igre u stilu DX-Ball-a i moj prvi projekat u C++-u i OpenGL-u, napravljen tokom studija računarske grafike.',
    },
  ][index],
}))
